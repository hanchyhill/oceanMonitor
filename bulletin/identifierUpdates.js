const crypto = require('crypto');
const mongoose = require('mongoose');
const moment = require('moment');

const IDENTIFIER_FIELDS = ['unidCurrent', 'unidIns', 'unidGlobal', 'tsid'];
const MAX_UPDATES = 100;
const MAX_IDENTIFIER_LENGTH = 128;

function tokenMatches(header, expectedToken) {
  if (!expectedToken || typeof header !== 'string' || !header.startsWith('Bearer ')) return false;
  const supplied = header.slice(7);
  if (!supplied) return false;
  const expectedHash = crypto.createHash('sha256').update(expectedToken).digest();
  const suppliedHash = crypto.createHash('sha256').update(supplied).digest();
  return crypto.timingSafeEqual(expectedHash, suppliedHash);
}

function parseInitMinute(value) {
  if (typeof value !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return null;
  const time = moment.parseZone(value, moment.ISO_8601, true);
  if (!time.isValid()) return null;
  const start = new Date(Math.floor(time.valueOf() / 60000) * 60000);
  return {start, end: new Date(start.getTime() + 60000)};
}

function validateBatch(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      Object.keys(body).some(key => key !== 'initTime' && key !== 'updates')) {
    return {error: '请求体字段错误'};
  }
  const minute = parseInitMinute(body.initTime);
  if (!minute) return {error: '起报时刻必须是带时区的有效时间'};
  if (!Array.isArray(body.updates) || body.updates.length < 1 || body.updates.length > MAX_UPDATES) {
    return {error: `updates 必须包含 1 至 ${MAX_UPDATES} 条记录`};
  }
  const seen = new Set();
  for (const item of body.updates) {
    if (!item || typeof item !== 'object' || Array.isArray(item) ||
        Object.keys(item).some(key => key !== 'id' && key !== 'identifiers') ||
        typeof item.id !== 'string' || !/^[a-f\d]{24}$/i.test(item.id)) {
      return {error: '记录 id 或字段错误'};
    }
    const id = item.id.toLowerCase();
    if (seen.has(id)) return {error: 'updates 包含重复 id'};
    seen.add(id);
    const identifiers = item.identifiers;
    if (!identifiers || typeof identifiers !== 'object' || Array.isArray(identifiers)) {
      return {error: 'identifiers 格式错误'};
    }
    const fields = Object.keys(identifiers);
    if (!fields.length || fields.some(field => !IDENTIFIER_FIELDS.includes(field))) {
      return {error: 'identifiers 只能包含统一编号字段'};
    }
    if (fields.some(field => typeof identifiers[field] !== 'string' ||
        !identifiers[field].trim() || identifiers[field].length > MAX_IDENTIFIER_LENGTH)) {
      return {error: '编号必须是非空且不超过 128 字符的文本'};
    }
  }
  return {minute, updates: body.updates};
}

async function applyIdentifierBatch(collection, validated) {
  const results = [];
  for (const item of validated.updates) {
    const id = new mongoose.Types.ObjectId(item.id);
    try {
      const projection = {initTime: 1};
      for (const field of IDENTIFIER_FIELDS) projection[field] = 1;
      const current = await collection.findOne({_id: id}, {projection});
      if (!current) {
        results.push({id: item.id, status: 'notFound'});
        continue;
      }
      if (!current.initTime || current.initTime < validated.minute.start ||
          current.initTime >= validated.minute.end) {
        results.push({id: item.id, status: 'timeMismatch'});
        continue;
      }
      const changed = {};
      const filter = {_id: id, initTime: {$gte: validated.minute.start, $lt: validated.minute.end}};
      let conflict = false;
      for (const field of Object.keys(item.identifiers)) {
        const previous = current[field];
        const next = item.identifiers[field];
        // Every supplied field must still match, including already-equal fields.
        filter[field] = previous === undefined ? {$exists: false} : previous;
        if (previous === next) continue;
        if (previous !== undefined && previous !== null && previous !== '') {
          conflict = true;
          break;
        }
        changed[field] = next;
      }
      if (conflict) {
        results.push({id: item.id, status: 'conflict'});
      } else if (!Object.keys(changed).length) {
        results.push({id: item.id, status: 'unchanged'});
      } else {
        // Native collection update avoids Mongoose's automatic updatedAt mutation.
        const outcome = await collection.updateOne(filter, {$set: changed});
        results.push({id: item.id, status: outcome.matchedCount === 1 ? 'updated' : 'conflict'});
      }
    } catch (error) {
      results.push({id: item.id, status: 'error'});
    }
  }
  const counts = {updated: 0, unchanged: 0, notFound: 0, timeMismatch: 0, conflict: 0, error: 0};
  for (const result of results) counts[result.status]++;
  return {success: counts.error === 0, counts, results};
}

module.exports = {tokenMatches, parseInitMinute, validateBatch, applyIdentifierBatch};
