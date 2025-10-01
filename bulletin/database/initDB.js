// 合并initSchemas 和 connect
const mongoose = require('mongoose');
const glob = require('glob');
// mongoose.Promise = global.Promise;

const {resolve} = require('path');
const MAX_RECONNECTED = 10;
const {configBL} = require('./privateConfig/private.dbConfig.js');
let dbLink_local = configBL.localLink;
let dbLink_remote = configBL.remoteLink;
let dbConfig_remote = configBL.remoteConfig;
let dbLink;
let dbConfig;

if(process.env.NODE_ENV !== 'production'){
  mongoose.set('debug', true);
  dbLink = dbLink_remote//dbLink_local;
  dbConfig = dbConfig_remote//configBL.localConfig;
}else{
  dbLink = dbLink_remote;
  dbConfig = dbConfig_remote;
}

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
    mongoose.connect(dbLink,dbConfig);
    
    mongoose.connection.on('disconnected',()=>{
      mongoose.connect(dbLink,dbConfig);
    });

    mongoose.connection.on('error',(err)=>{
      maxConnectTimes++;
      if(maxConnectTimes < MAX_RECONNECTED){
        mongoose.connect(dbLink,dbConfig);
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
