const PromiseFtp = require('promise-ftp');
const config = {
  ftp:{host: '10.148.8.212', user: 'gmcrgz', password: 'guangz123',keepalive:500, autoReconnect:true,preserveCwd:true},
  dir01:'/bcgz/dmsg/',
  dir02:'/bcgzup/msg/publ/',
}

const main = async ()=>{
  const ftp = new PromiseFtp();
  const serverMessage = await ftp.connect();
  await ftp.connect();
  await ftp.cwd(config.dir01);
  const list = await ftp.list();
  const filterList = scanList(list);
  console.log('Directory listing:');
  console.dir(list);
  await ftp.ascii();
  for(let file of list){
    let content = '';
    let stream = await ftp.get(file.name);
    content = await readStream(stream);

    solveBulletin(content)
    .then(resolve=>{})
    .catch(err=>{throw err});
  }
  await ftp.end();
};

const scanList = (list=[])=>{
  console.dir(list);
  const list93 = list.filter(file=>file.name.search(/^93/));
  list.sort((file1,file2)=>{
    file.date;// 小的排前面
  });
};

const readStream = function(stream){
  return new Promise((resolve,reject)=>{
    let content = '';
    stream.on('data', function(chunk){
      content += chunk;
    });
    stream.on('error',err=>reject(err));
    readStream.on('end', function(chunk){
      // 文件读取完成，文件内容是 [你好，我是程序猿小卡]
      //console.log('文件读取完成，文件内容是 [%s]', content);
      resolve(content);
    });
  });
}

const solveBulletin = async (content='')=>{

};

main()
.then(v=>{})
.catch(err=>{throw err});