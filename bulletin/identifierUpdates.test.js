const test = require('node:test');
const assert = require('node:assert/strict');
const {tokenMatches, parseInitMinute, validateBatch, applyIdentifierBatch} = require('./identifierUpdates.js');

const id = '507f1f77bcf86cd799439011';
const initTime = '2026-09-30T00:00:00Z';

function batch(identifiers, time = initTime) {
  return {initTime: time, updates: [{id, identifiers}]};
}

test('token validation and strict UTC minute parsing', () => {
  assert.equal(tokenMatches('Bearer secret', 'secret'), true);
  assert.equal(tokenMatches('Bearer wrong', 'secret'), false);
  assert.equal(tokenMatches('secret', 'secret'), false);
  assert.equal(parseInitMinute('2026-02-30T00:00:00Z'), null);
  assert.equal(parseInitMinute('2026-09-30T00:00:00'), null);
  assert.equal(parseInitMinute('2026-09-30T08:00:45+08:00').start.toISOString(), new Date(initTime).toISOString());
});

test('batch rejects fields outside the identifier allowlist', () => {
  assert.match(validateBatch(batch({tracks: []})).error, /identifiers/);
  assert.match(validateBatch(batch({unidGlobal: 'G', tcID: 'other'})).error, /identifiers/);
  assert.match(validateBatch(batch({unidGlobal: ''})).error, /编号/);
  const duplicate = batch({unidGlobal: 'G'});
  duplicate.updates.push(duplicate.updates[0]);
  assert.match(validateBatch(duplicate).error, /重复/);
});

test('write changes only supplied identifiers and is idempotent', async () => {
  const document = {
    _id: id,
    initTime: new Date(initTime),
    tcID: 'existing-tc',
    tracks: [{track: [{lat: 10, lon: 150}]}],
    detTrack: {track: [{lat: 11, lon: 151}]},
    updatedAt: new Date('2026-09-29T00:00:00Z'),
  };
  const originalPaths = JSON.stringify({tracks: document.tracks, detTrack: document.detTrack,
    tcID: document.tcID, updatedAt: document.updatedAt});
  const collection = {
    updates: [],
    async findOne() { return document; },
    async updateOne(filter, update) {
      this.updates.push({filter, update});
      Object.assign(document, update.$set);
      return {matchedCount: 1};
    },
  };
  const request = batch({unidGlobal: 'GLB-001', tsid: '1234'});
  const first = await applyIdentifierBatch(collection, validateBatch(request));
  assert.equal(first.results[0].status, 'updated');
  assert.deepEqual(collection.updates[0].update, {$set: {unidGlobal: 'GLB-001', tsid: '1234'}});
  assert.equal(JSON.stringify({tracks: document.tracks, detTrack: document.detTrack,
    tcID: document.tcID, updatedAt: document.updatedAt}), originalPaths);
  const second = await applyIdentifierBatch(collection, validateBatch(request));
  assert.equal(second.results[0].status, 'unchanged');
  assert.equal(collection.updates.length, 1);
});

test('conflicting value and mismatched issue time do not write', async () => {
  let writes = 0;
  const collection = {
    async findOne() { return {initTime: new Date(initTime), unidGlobal: 'GLB-OLD'}; },
    async updateOne() { writes++; return {matchedCount: 1}; },
  };
  const conflict = await applyIdentifierBatch(collection, validateBatch(batch({unidGlobal: 'GLB-NEW'})));
  assert.equal(conflict.results[0].status, 'conflict');
  const mismatch = await applyIdentifierBatch(collection,
    validateBatch(batch({unidIns: 'INS-001'}, '2026-09-30T06:00:00Z')));
  assert.equal(mismatch.results[0].status, 'timeMismatch');
  assert.equal(writes, 0);
});
