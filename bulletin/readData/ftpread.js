const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const {resolveData} = require('./readData.js');
const config = {
  ftp:{host: '10.148.8.212', user: 'gmcrgz', password: 'guangz123',
      keepalive:120, autoReconnect:true,preserveCwd:true,},
  dir01:'/bcgz/dmsg/',
  dir02:'/bcgzup/msg/publ/',
  isFirst : true,
  first2read : 10,
  lastDate:0,
}
const errorFileList = [];//['93200820.ABJ'];

const main = async ()=>{
  const ftp = new PromiseFtp();
  const serverMessage = await ftp.connect(config.ftp)
  .catch(err=>{throw err});
  // await ftp.connect().catch(err=>console.log(err));
  await ftp.cwd(config.dir01);
  const list = await ftp.list();
  const filterList = scanList(list);
  console.log('文件数 ' + filterList.length)
  // console.log('Directory listing:');
  // console.dir(filterList);
  // await ftp.ascii();
  for(let file of filterList){
    let content = '';
    let stream = undefined;
    
    if(errorFileList.includes(file.name)){
      console.log('skip'+file.name);
      continue;
    }
    try {
      // console.log('await '+ file.name);
      stream = await ftp.get(file.name);
      // console.log(file.name + '读取完毕');
      content = await readStream(stream);
      
    } catch (error) {// 发生错误重新连接一次
      console.log('意外中断，重新读取'+file.name);
      await ftp.end();
      await ftp.reconnect();
      await ftp.cwd(config.dir01);
      stream = await ftp.get(file.name);
      console.log(file.name + '读取完毕');
      content = await readStream(stream);
    }
    //let stream = await ftp.get(file.name);
    //console.log(file.name + '读取完毕');
    //content = await readStream(stream);
    resolveData(content)
      .catch(err=>{console.error('解析错误:'+err.message)});
  }
  if(filterList.length!==0){
    config.lastDate = filterList[0].date.getTime();
  }
  else{
    console.log('没有新文件');
  }
  console.log('ftp 读取完毕');
  await ftp.end();
};

const scanList = (list=[])=>{
  // console.dir(list);
  const list93 = list
    .filter(file=>file.name.search(/^93/)!==-1 && (file.date.getTime()>config.lastDate));
  return list93.sort((file1,file2)=>file2.date - file1.date);
};

const readStream = function(stream){
  // console.log(stream);
  stream.setEncoding('ascii');
  return new Promise((resolve,reject)=>{
    let content = '';
    stream.on('data', function(chunk){
      // console.log(chunk);
      content += chunk;
    });
    stream.on('error',err=>reject(err));
    stream.on('end', function(chunk){
      resolve(content);
    }); 
    stream.resume();
  });
}

/* const solveBulletin = async (content='')=>{

}; */

exports.ftpRead = main;