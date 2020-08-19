// 去重
const mongoose = require('mongoose');
let Cyclone = mongoose.model('Cyclone');

async function save2DB(fcData){
  const subscribes = await Cyclone.findOne({tcID:fcData.tcID,ins:fcData.ins})
                             .exec();
  if(subscribes){
    if(fcData.ins == 'TRAMS_TY'){
      await Cyclone.findOneAndDelete({tcID:fcData.tcID,ins:fcData.ins})
                               .exec();
      console.log(fcData.tcID+'已存在,删除后保存');
      let cyclone = new Cyclone(fcData);
      await cyclone.save()
      .then(()=>{
        console.log('储存完成'+fcData.tcID);
      })
      .catch(err=>{
        console.log('储存错误');
        // console.error(err);
        throw err;
      })
    }else{
      console.log(fcData.tcID+'已存在,跳出');
      return;
    }
  }else{
    let cyclone = new Cyclone(fcData);
    await cyclone.save()
    .then(()=>{
      console.log('储存完成'+fcData.tcID);
    })
    .catch(err=>{
      console.log('储存错误');
      // console.error(err);
      throw err;
    })
  }
}

exports.save2DB = save2DB;