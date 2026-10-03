// Shared by both Cyclone schemas; no automatic business-document backfill.
const IDENTIFIER_INDEXES = [
  {name: 'tc_identity_wc_time_id', key: {unidCurrent: 1, initTime: 1, _id: 1}, field: 'unidCurrent'},
  {name: 'tc_identity_wi_ins_time_id', key: {unidIns: 1, ins: 1, initTime: 1, _id: 1}, field: 'unidIns'},
  {name: 'tc_identity_wg_time_id', key: {unidGlobal: 1, initTime: 1, _id: 1}, field: 'unidGlobal'}
];
function indexOptions(index) {
  return {name: index.name, unique: false, collation: {locale: 'simple'},
    partialFilterExpression: {[index.field]: {$type: 'string'}}};
}
function addIdentifierSchema(schema) {
  schema.add({unidCurrent: String, unidIns: String, unidGlobal: String, tsid: String});
  IDENTIFIER_INDEXES.forEach(index => schema.index(index.key, indexOptions(index)));
}
module.exports = {addIdentifierSchema, IDENTIFIER_INDEXES, indexOptions};
