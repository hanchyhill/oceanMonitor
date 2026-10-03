const test = require('node:test');
const assert = require('node:assert/strict');
const {parseQuery, queryPaths, queryIdentifiers, handleIdentifierQuery} = require('./identifierQueries');
const {IDENTIFIER_INDEXES, addIdentifierSchema} = require('./database/identifierSchema');
const mongoose = require('mongoose');

const base = {interface: 'tc-ens-by-identifier', kind: 'wg', value: 'wg-2025-01-0000'};
const row = (n, hour = '00') => ({_id: new mongoose.Types.ObjectId(n.toString(16).padStart(24, '0')),
  initTime: new Date(`2025-01-01T${hour}:00:00Z`), ins: 'ecmwf', unidGlobal: base.value,
  tracks: [{ensembleNumber: 1, track: [[0, [140, 20]]]}]});
function fakeCollection(rows) {
  const observed = {closed: false};
  function cursor(values) {
    let index = 0, maximum = Infinity;
    return {sort(value) { observed.sort = value; return this; },
      limit(value) { maximum = value; observed.limit = value; return this; },
      maxTimeMS(value) { observed.timeout = value; return this; },
      async hasNext() { return index < Math.min(maximum, values.length); },
      async next() { return values[index++]; }, async close() { observed.closed = true; }};
  }
  return {observed, find(filter, options) { observed.filter = filter; observed.options = options; return cursor(rows); },
    aggregate(pipeline, options) { observed.pipeline = pipeline; observed.aggregateOptions = options; return cursor(rows); }};
}

test('three scenarios, UTC minute boundary, no default institution or 48h/month constraint', () => {
  const global = parseQuery(base);
  assert.equal(global.query.paths, 'none');
  assert.equal(global.filter.ins, undefined);
  assert.equal(global.filter.initTime, undefined);
  assert.deepEqual(global.filter.unidGlobal, {$eq: base.value, $type: 'string'});
  const current = parseQuery({kind: 'wc', value: 'wc-0000', initTime: '2025-01-01T08:00:42+08:00'});
  assert.equal(current.query.paths, 'ensemble');
  assert.equal(current.filter.initTime.$gte.toISOString(), '2025-01-01T00:00:00.000Z');
  assert.equal(current.filter.initTime.$lt.toISOString(), '2025-01-01T00:01:00.000Z');
  const ins = parseQuery({kind: 'wi', value: 'wi-aifs-cai-2025-01-0000', ins: 'aifs-cai',
    gte: '2025-01-01T00:00:00Z', lte: '2025-02-03T00:00:00Z'});
  assert.equal(ins.filter.ins, 'aifs-cai');
  assert.ok(ins.filter.initTime.$lte);
  assert.deepEqual(global.filter.$or, [{basinShort2: 'WP'}, {basinShort: 'W'}]);
  assert.equal(global.filter.cycloneNumber.$ne, 'C-9999');
});

test('reject malformed identifiers, operators, invalid time, limits and institution mismatch', () => {
  for (const params of [
    {...base, value: 'wg-2025-13-0000'}, {...base, kind: '__proto__'}, {...base, value: {$gt: ''}},
    {...base, extra: 'bad'}, {...base, basin: 'ATL'}, {...base, limit: '501'}, {...base, limit: '2.5'},
    {...base, paths: 'all', limit: '101'}, {...base, initTime: '2025-01-01T00:00:00Z'},
    {kind: 'wc', value: 'wc-0000'}, {kind: 'wc', value: 'wc-0000', initTime: '2025-02-30T00:00:00Z'},
    {kind: 'wi', value: 'wi-ecmwf-2025-01-0000'},
    {kind: 'wi', value: 'wi-ecmwf-2025-01-0000', ins: 'ncep_e'},
    {...base, ins: 'ecmwf,ncep_e'}, {...base, gte: '2025-02-01T00:00:00Z', lte: '2025-01-01T00:00:00Z'}
  ]) assert.throws(() => parseQuery(params), {status: 400});
});

test('projection and count pagination keep whole documents and generate query-bound cursor', async () => {
  const collection = fakeCollection([row(1), row(2), row(3, '06')]);
  const result = await queryPaths(collection, {...base, paths: 'all', limit: '2'});
  assert.equal(result.page.count, 2);
  assert.equal(result.page.hasMore, true);
  assert.equal(collection.observed.options.projection.tracks, 1);
  assert.equal(collection.observed.options.projection.detTrack, 1);
  assert.deepEqual(collection.observed.sort, {initTime: 1, _id: 1});
  assert.equal(collection.observed.closed, true);
  const next = fakeCollection([row(3, '06')]);
  const final = await queryPaths(next, {...base, paths: 'all', limit: '2', cursor: result.page.nextCursor});
  assert.equal(final.page.hasMore, false);
  assert.equal(final.page.nextCursor, null);
  assert.ok(next.observed.filter.$and[0].$or);
  assert.equal(next.observed.filter.$and[1].$or[1]._id.$gt.toString(), row(2)._id.toString());
  assert.throws(() => parseQuery({...base, cursor: result.page.nextCursor}), /不匹配/);
  assert.throws(() => parseQuery({...base, cursor: 'invalid'}), /游标/);
  const meta = fakeCollection([]);
  const empty = await queryPaths(meta, base);
  assert.equal(meta.observed.options.projection.tracks, undefined);
  assert.deepEqual(empty.page, {count: 0, hasMore: false, nextCursor: null});
});

test('UTF8 byte budget paginates without dropping document and rejects oversized single document', async () => {
  const a = {...row(1), note: '中文'.repeat(1000)};
  const b = {...row(2), note: '中文'.repeat(1000)};
  const collection = fakeCollection([a, b]);
  const result = await queryPaths(collection, base, {budget: 12000});
  assert.equal(result.data.length, 1);
  assert.equal(result.page.hasMore, true);
  assert.ok(Buffer.byteLength(JSON.stringify(result)) < 12000);
  const next = await queryPaths(fakeCollection([b]), {...base, cursor: result.page.nextCursor}, {budget: 12000});
  assert.equal(String(next.data[0]._id), String(b._id));
  const huge = fakeCollection([a]);
  await assert.rejects(queryPaths(huge, base, {budget: 5000}), {status: 413, code: 'responseTooLarge'});
  assert.equal(huge.observed.closed, true);
});

test('identifier list aggregates correct filtered scope and pages distinct identifiers', async () => {
  const params = {interface: 'tc-ens-identifiers', kind: 'wi', ins: 'ecmwf', limit: '1'};
  const collection = fakeCollection([{identifier: 'wi-ecmwf-2025-01-0000'}, {identifier: 'wi-ecmwf-2025-01-0001'}]);
  const result = await queryIdentifiers(collection, params);
  assert.equal(result.page.count, 1);
  assert.equal(collection.observed.pipeline[0].$match.ins, 'ecmwf');
  assert.equal(collection.observed.pipeline[1].$group._id, '$unidIns');
  assert.equal(result.page.hasMore, true);
  const next = fakeCollection([]);
  await queryIdentifiers(next, {...params, cursor: result.page.nextCursor});
  assert.deepEqual(next.observed.pipeline[2], {$match: {_id: {$gt: 'wi-ecmwf-2025-01-0000'}}});
  assert.throws(() => parseQuery({...params, paths: 'none'}, true), /列表/);
});

test('schema adds optional fields and named nonunique partial indexes without auto backfill', () => {
  const schema = new mongoose.Schema({}, {autoIndex: false});
  addIdentifierSchema(schema);
  assert.ok(schema.path('tsid'));
  assert.equal(schema.path('unidGlobal').options.required, undefined);
  assert.equal(schema.indexes().length, 3);
  for (const [key, options] of schema.indexes()) {
    assert.equal(options.unique, false);
    assert.ok(options.partialFilterExpression);
    assert.equal(key._id, 1);
  }
  assert.equal(IDENTIFIER_INDEXES.length, 3);
});

test('HTTP handler returns safe errors without exposing driver configuration', async () => {
  const ctx = {query: {...base, paths: 'bad'}};
  await handleIdentifierQuery(ctx, fakeCollection([]));
  assert.equal(ctx.status, 400);
  const failed = {query: base};
  await handleIdentifierQuery(failed, {find() { throw new Error('credential-private-url'); }});
  assert.equal(failed.status, 503);
  assert.doesNotMatch(JSON.stringify(failed.body), /credential/);
});

test('Koa HTTP query decodes timestamps and reports invalid parameters', async () => {
  const Koa = require('koa');
  const app = new Koa();
  const collection = fakeCollection([row(1)]);
  app.use(ctx => handleIdentifierQuery(ctx, collection));
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/api`;
    const params = new URLSearchParams({kind: 'wc', value: 'wc-0000', initTime: '2025-01-01T08:00:00+08:00'});
    const response = await fetch(`${url}?${params}`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.query.initTime, '2025-01-01T00:00:00.000Z');
    assert.equal(body.data[0].tracks[0].ensembleNumber, 1);
    const invalid = await fetch(`${url}?kind=wi&value=wi-ecmwf-2025-01-0000`);
    assert.equal(invalid.status, 400);
    const wg = await fetch(`${url}?kind=wg&value=wg-2025-01-0000`);
    assert.equal(wg.status, 200);
    assert.equal(collection.observed.options.projection.tracks, undefined);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
