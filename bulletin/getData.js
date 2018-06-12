const {connect,initSchemas} = require('./database/initDB.js');
const mongoose = require('mongoose');

async function main (){
  await connect()
    .catch(err=>{throw err});
  initSchemas();
  const Bulletin = mongoose.model('Bulletin');
  let bulletins = await Bulletin.where('date').gt((new Date(Date.now() - 1000*60*60*8)));// 可以不需要exec()
  console.dir(bulletins);
}

main()
.catch(err=>{
  console.error(err);
});