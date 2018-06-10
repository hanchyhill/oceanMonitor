const {connect,initSchemas} = require('./database/initDB.js');
const mongoose = require('mongoose');
const schedule = require('node-schedule');


async function main (){
  await connect();
  initSchemas();
  const Bulletin = mongoose.model('Bulletin');
  const {readData} = require('./readData/readData.js');
  // const bulletin = await Bulletin.find({});
  // console.log(bulletin);
  let ruleI1 = new schedule.RecurrenceRule();
  ruleI1.minute = [new schedule.Range(0, 59, 1)];// 1分钟轮询
  let job1 = schedule.scheduleJob(ruleI1, (fireDate)=>{
    console.log('轮询开始'+(new Date()).toDateString());
    readData()
    .catch(err=>{
      console.log(err.message);
      throw new Error('readData Error:'+err.message);
    })
  });
}

main()
.catch(err=>{
  console.error(err);
});