const child_process = require('child_process');
const path = require('path');

function promiseExec(input,opt){
  console.log(input, opt)
  return new Promise((resolve,reject)=>{
    const cmd = child_process.exec(input, opt);
    cmd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      if(data.indexOf('fatal:')!=-1){
        cmd.kill('SIGHUP');
        reject(`fatal error`);
      }
    });
    cmd.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    cmd.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if(code){
        reject(`child process exited with code ${code}`);
      }else{
        resolve('success');
      }
    });
    cmd.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
      if(code){
        reject(`child process exited with code ${code}`);
      }else{
        resolve('success');
      }
    });
    cmd.on('error',err=>{
      cmd.kill('SIGHUP');
      reject(`error: ${err}`);
    })
  })
}