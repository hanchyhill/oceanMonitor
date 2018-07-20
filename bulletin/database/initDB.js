// 合并initSchemas 和 connect
const mongoose = require('mongoose');
const glob = require('glob');
// mongoose.Promise = global.Promise;
const dbLink = 'mongodb://localhost:12345/bulletinTest';
const dbLink2 = 'mongodb://10.148.16.20:20186/bulletins';
const dbConfig = {user:'bulletinowner', pass:'9184ab8a6b', autoIndex: false, keepAlive: 120,useNewUrlParser: true};
const {resolve} = require('path');
const MAX_RECONNECTED = 10;

exports.initSchemas = ()=>{
  glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(
    require
  )
}

exports.connect = ()=>{
  let maxConnectTimes = 0;
  return new Promise((resolve,reject)=>{
    if(mongoose.connection.readyState ==1){
      console.log('mongo 已连接');
      resolve('mongo 已连接');
    }
    if(process.env.NODE_ENV !== 'production'){
      mongoose.set('debug', true);
      mongoose.connect(dbLink,{ keepAlive: 120 , autoIndex: false, useNewUrlParser: true,});
    }
    else{
      mongoose.connect(dbLink2,dbConfig,);
    }
    
    mongoose.connection.on('disconnected',()=>{
      mongoose.connect(dbLink);
    });

    mongoose.connection.on('error',(err)=>{
      maxConnectTimes++;
      if(maxConnectTimes < MAX_RECONNECTED){
        mongoose.connect(dbLink);
      }
      else{
        reject(new Error('Max Reconnect, DB breakdown.'));
      }
    });
    mongoose.connection.once('open',()=>{
      console.log('MongoDB Connected successfully!=>' + dbLink);
      resolve();
    })
  });
};
