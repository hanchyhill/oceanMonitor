const crypto = require('crypto');
const mongoose = require('mongoose');
const {parseInitMinute} = require('./identifierUpdates');

const FIELDS = {wc: 'unidCurrent', wi: 'unidIns', wg: 'unidGlobal'};
const META = {initTime: 1, ins: 1, cycloneNumber: 1, cycloneName: 1, tcID: 1,
  basinShort: 1, basinShort2: 1, unidCurrent: 1, unidIns: 1, unidGlobal: 1, tsid: 1};
const MAX_TIME_MS = 30000;
const BUDGET = {none: 2 * 1024 * 1024, ensemble: 8 * 1024 * 1024, all: 8 * 1024 * 1024};

class QueryError extends Error {
  constructor(message, status = 400, code = 'invalidQuery') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
function fail(message) { throw new QueryError(message); }
function time(value) {
  if (!parseInitMinute(value)) fail('时间必须是带时区的 ISO 时间');
  return new Date(value);
}
function validIdentifier(kind, value, ins) {
  if (kind === 'wc') return /^wc-\d{4}$/.test(value);
  if (kind === 'wg') return /^wg-\d{4}-(?:0[1-9]|1[0-2])-\d{4}$/.test(value);
  const escaped = ins.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^wi-${escaped}-\\d{4}-(?:0[1-9]|1[0-2])-\\d{4}$`).test(value);
}
function binding(query) {
  return crypto.createHash('sha256').update(JSON.stringify(query)).digest('hex');
}
function encodeCursor(query, after) {
  return Buffer.from(JSON.stringify({version: 1, binding: binding(query), after})).toString('base64url');
}
function decodeCursor(value, query, list) {
  if (!value) return null;
  try {
    if (value.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(value)) fail('游标格式错误');
    const cursor = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (cursor.version !== 1 || cursor.binding !== binding(query)) fail('游标与查询不匹配');
    if (list) {
      if (typeof cursor.after !== 'string' || !cursor.after || cursor.after.length > 128) fail('游标格式错误');
    } else {
      if (!cursor.after || !/^[a-f\d]{24}$/.test(cursor.after.id)) fail('游标格式错误');
      time(cursor.after.time);
    }
    return cursor.after;
  } catch (error) {
    if (error instanceof QueryError) throw error;
    fail('游标格式错误');
  }
}

function parseQuery(params, list = false) {
  const allowed = ['interface', 'kind', 'value', 'initTime', 'ins', 'basin', 'gte', 'lte', 'paths', 'limit', 'cursor'];
  for (const key of Object.keys(params)) {
    if (!allowed.includes(key) || typeof params[key] !== 'string' || !params[key]) fail('查询字段错误');
  }
  const kind = params.kind;
  if (!Object.prototype.hasOwnProperty.call(FIELDS, kind)) fail('kind 必须为 wc/wi/wg');
  if (params.basin && params.basin !== 'WPAC') fail('仅支持 WPAC');
  const ins = params.ins || null;
  if (ins && !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(ins)) fail('ins 必须为单个机构');
  if (kind === 'wi' && !ins) fail('wi 必须指定机构 ins');
  if (kind === 'wc' && (!params.initTime || params.gte || params.lte)) fail('wc 必须指定 initTime，不能指定范围');
  if (kind !== 'wc' && params.initTime) fail('wi/wg 请使用 gte/lte 范围');
  if (list && (params.value || params.paths)) fail('编号列表不接受 value/paths');
  if (!list && (!params.value || !validIdentifier(kind, params.value, ins))) fail('编号格式或机构错误');
  const paths = list ? 'none' : params.paths || (kind === 'wg' ? 'none' : 'ensemble');
  if (!Object.prototype.hasOwnProperty.call(BUDGET, paths)) fail('paths 必须为 none/ensemble/all');
  const limit = params.limit === undefined ? (paths === 'none' ? 100 : 20) : Number(params.limit);
  if (params.limit !== undefined && !/^\d+$/.test(params.limit)) fail('limit 必须为整数');
  if (!Number.isInteger(limit) || limit < 1 || limit > (paths === 'none' ? 500 : 100)) fail('limit 超出范围');
  const minute = kind === 'wc' ? parseInitMinute(params.initTime) : null;
  if (kind === 'wc' && !minute) fail('initTime 无效');
  const gte = params.gte ? time(params.gte) : null;
  const lte = params.lte ? time(params.lte) : null;
  if (gte && lte && gte > lte) fail('gte 不能晚于 lte');
  const query = {kind, value: list ? null : params.value, ins, basin: 'WPAC',
    initTime: minute ? minute.start.toISOString() : null,
    gte: gte ? gte.toISOString() : null, lte: lte ? lte.toISOString() : null, paths, list};
  const filter = {cycloneNumber: {$ne: 'C-9999'}, $or: [{basinShort2: 'WP'}, {basinShort: 'W'}]};
  if (ins) filter.ins = ins;
  // Explicit type predicate lets the deployed MongoDB planner use our partial index.
  if (!list) filter[FIELDS[kind]] = {$eq: query.value, $type: 'string'};
  else filter[FIELDS[kind]] = {$type: 'string', $regex: kind === 'wc' ? /^wc-\d{4}$/ :
    kind === 'wg' ? /^wg-\d{4}-(?:0[1-9]|1[0-2])-\d{4}$/ :
      new RegExp(`^wi-${ins.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d{4}-(?:0[1-9]|1[0-2])-\\d{4}$`)};
  if (minute) filter.initTime = {$gte: minute.start, $lt: minute.end};
  else if (gte || lte) {
    filter.initTime = {};
    if (gte) filter.initTime.$gte = gte;
    if (lte) filter.initTime.$lte = lte;
  }
  return {query, filter, limit, after: decodeCursor(params.cursor, query, list)};
}

async function queryPaths(collection, params, options = {}) {
  const parsed = parseQuery(params);
  const {query, limit, after} = parsed;
  const projection = {...META};
  if (query.paths !== 'none') projection.tracks = 1;
  if (query.paths === 'all') projection.detTrack = 1;
  let filter = parsed.filter;
  if (after) filter = {$and: [filter, {$or: [
    {initTime: {$gt: new Date(after.time)}},
    {initTime: new Date(after.time), _id: {$gt: new mongoose.Types.ObjectId(after.id)}}
  ]}]};
  const cursor = collection.find(filter, {projection, collation: {locale: 'simple'}})
    .sort({initTime: 1, _id: 1}).limit(limit + 1).maxTimeMS(MAX_TIME_MS);
  return readPage(cursor, query, limit, options.budget || BUDGET[query.paths],
    row => ({time: row.initTime.toISOString(), id: String(row._id)}));
}

async function queryIdentifiers(collection, params, options = {}) {
  const {query, filter, limit, after} = parseQuery(params, true);
  const pipeline = [{$match: filter}, {$group: {
    _id: `$${FIELDS[query.kind]}`, documentCount: {$sum: 1},
    institutions: {$addToSet: '$ins'}, times: {$addToSet: '$initTime'},
    firstInitTime: {$min: '$initTime'}, lastInitTime: {$max: '$initTime'}
  }}];
  if (after) pipeline.push({$match: {_id: {$gt: after}}});
  pipeline.push({$sort: {_id: 1}}, {$limit: limit + 1}, {$project: {
    _id: 0, identifier: '$_id', documentCount: 1,
    institutionCount: {$size: '$institutions'}, initializationCount: {$size: '$times'},
    firstInitTime: 1, lastInitTime: 1
  }});
  const cursor = collection.aggregate(pipeline, {allowDiskUse: true, maxTimeMS: MAX_TIME_MS,
    collation: {locale: 'simple'}});
  return readPage(cursor, query, limit, options.budget || BUDGET.none, row => row.identifier);
}

async function readPage(cursor, query, limit, budget, position) {
  const result = {success: true, query, data: [], page: {count: 0, hasMore: false, nextCursor: null}};
  // Reserve space for the last item cursor and envelope (max allowed cursor is 2048 bytes).
  let bytes = Buffer.byteLength(JSON.stringify(result), 'utf8') + 4096;
  try {
    while (await cursor.hasNext()) {
      const row = await cursor.next();
      if (result.data.length === limit) { result.page.hasMore = true; break; }
      const size = Buffer.byteLength(JSON.stringify(row), 'utf8') + 1;
      if (bytes + size > budget) {
        if (!result.data.length) throw new QueryError('单条文档超过响应预算，请使用 paths=none', 413, 'responseTooLarge');
        result.page.hasMore = true;
        break;
      }
      result.data.push(row);
      bytes += size;
    }
  } finally { await cursor.close(); }
  result.page.count = result.data.length;
  if (result.page.hasMore) result.page.nextCursor = encodeCursor(query, position(result.data[result.data.length - 1]));
  return result;
}

async function handleIdentifierQuery(ctx, collection) {
  try {
    ctx.body = ctx.query.interface === 'tc-ens-identifiers' ?
      await queryIdentifiers(collection, ctx.query) : await queryPaths(collection, ctx.query);
  } catch (error) {
    ctx.status = error instanceof QueryError ? error.status : 503;
    ctx.body = {success: false, code: error instanceof QueryError ? error.code : 'queryUnavailable',
      error: error instanceof QueryError ? error.message : '编号查询暂不可用'};
  }
}

module.exports = {parseQuery, queryPaths, queryIdentifiers, handleIdentifierQuery, QueryError};
