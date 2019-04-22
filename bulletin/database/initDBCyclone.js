// 合并initSchemas 和 connect
const mongoose = require('mongoose');
const glob = require('glob');
// mongoose.Promise = global.Promise;
const dbLink = 'mongodb://localhost:12345/cyclones';
const dbLink2 = 'mongodb://10.148.16.20:20186/cyclones';
// const dbConfig = {user:'rwTC', pass:'1FL4SvheFLETSZrXX5tj',useNewUrlParser: true, autoIndex: false, keepAlive: 120,};
const dbConfig = {user:'readTC', pass:'aJvl1tl4kF16QWvgb6ZC',useNewUrlParser: true, autoIndex: false, keepAlive: 120,};
const {resolve} = require('path');
const MAX_RECONNECTED = 10;

exports.initSchemas = ()=>{
  glob.sync(resolve(__dirname,'./tc-ens-schema','**/*.js')).forEach(
    require
  )
}

exports.connect = ()=>{
  let maxConnectTimes = 0;
  let link;
  return new Promise((resolve,reject)=>{
    if(mongoose.connection.readyState ==1){
      console.log('mongo 已连接');
      resolve('mongo 已连接');
    }
    if(process.env.NODE_ENV !== 'production'){
      mongoose.set('debug', true);
      // link = dbLink;
      // mongoose.connect(link,{ keepAlive: 120 , autoIndex: false, useNewUrlParser: true,});
      link = dbLink;
      mongoose.connect(link,{ keepAlive: 120 , autoIndex: false, useNewUrlParser: true,});
    }
    else{
      link = dbLink2;
      mongoose.connect(link,dbConfig,);
    }
    
    mongoose.connection.on('disconnected',()=>{
      mongoose.connect(link);
    });

    mongoose.connection.on('error',(err)=>{
      maxConnectTimes++;
      if(maxConnectTimes < MAX_RECONNECTED){
        mongoose.connect(link);
      }
      else{
        reject(new Error('Max Reconnect, DB breakdown.'));
      }
    });
    mongoose.connection.once('open',()=>{
      console.log('MongoDB Connected successfully!=>' + link);
      resolve();
    })
  });
};
