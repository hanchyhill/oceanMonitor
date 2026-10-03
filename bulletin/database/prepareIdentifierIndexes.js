// Run inside the API repository. Never prints connection strings or credentials.
const mongoose = require('mongoose');
const {IDENTIFIER_INDEXES, indexOptions} = require('./identifierSchema');

async function main() {
  const args = process.argv.slice(2);
  if (args.some(value => !['--apply', '--env=local', '--env=production'].includes(value)) ||
      args.filter(value => value.startsWith('--env=')).length > 1) {
    throw new Error('usage');
  }
  const environment = args.includes('--env=production') ? 'production' : 'local';
  if (!args.includes('--apply')) {
    console.log(JSON.stringify({mode: 'dry-run', environment, collection: 'cyclones',
      indexes: IDENTIFIER_INDEXES.map(index => ({key: index.key, ...indexOptions(index)}))}, null, 2));
    return;
  }
  const {configWriteTC} = require('./privateConfig/private.dbConfig');
  if (!configWriteTC) throw new Error('missingWriteConfig');
  const link = environment === 'production' ? configWriteTC.remoteLink : configWriteTC.localLink;
  const config = environment === 'production' ? configWriteTC.remoteConfig : configWriteTC.localConfig;
  if (!link) throw new Error('missingConnection');
  const db = mongoose.createConnection(link, {...config, autoIndex: false, useNewUrlParser: true,
    useUnifiedTopology: true, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000,
    socketTimeoutMS: 0});
  try {
    await new Promise((resolve, reject) => {
      db.once('open', resolve);
      db.once('error', reject);
    });
    const collection = db.db.collection('cyclones');
    console.log(JSON.stringify({environment, status: 'creating', indexes: IDENTIFIER_INDEXES.map(index => index.name)}));
    // Build together so a large collection does not require three separate scans.
    await collection.createIndexes(IDENTIFIER_INDEXES.map(index => ({key: index.key, ...indexOptions(index)})));
    IDENTIFIER_INDEXES.forEach(index => console.log(JSON.stringify({environment,
      collection: 'cyclones', index: index.name, status: 'ready'})));
    const actual = await collection.indexes();
    for (const index of IDENTIFIER_INDEXES) {
      const found = actual.find(value => value.name === index.name);
      if (!found || JSON.stringify(found.key) !== JSON.stringify(index.key) || found.unique === true ||
          JSON.stringify(found.partialFilterExpression) !== JSON.stringify(indexOptions(index).partialFilterExpression)) {
        throw new Error('indexVerificationFailed');
      }
    }
    console.log(JSON.stringify({status: 'verified', environment, indexes: IDENTIFIER_INDEXES.length}));
  } finally { await db.close(true); }
}
main().catch(error => {
  // Driver error messages can contain the database URL. Only emit a safe code.
  console.error(JSON.stringify({status: 'failed', code: error.code ||
    (['usage', 'missingWriteConfig', 'missingConnection', 'indexVerificationFailed'].includes(error.message) ?
      error.message : error.name)}));
  process.exitCode = 1;
});
