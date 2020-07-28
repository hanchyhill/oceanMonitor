const schedule = require('node-schedule');
const rp = require('request-promise');
const {serverChanKey} = require('./key.config.js');
let scUrl = `https://sc.ftqq.com/${serverChanKey}.send`;

let demoDes = `[JMA台風情報](http://www.jma.go.jp/en/typh/)
![日本台风报文](http://www.jma.go.jp/en/typh/images/wide/all-00.png)
熱帯低気圧

令和元年12月21日21時40分 発表


<21日21時の実況>

大きさ -

強さ -

熱帯低気圧

存在地域 カロリン諸島

中心位置 北緯 6度00分(6.0度)

東経 141度00分(141.0度)

進行方向、速さ 西北西 25km/h(13kt)

中心気圧 1002hPa

最大風速 15m/s(30kt)

最大瞬間風速 23m/s(45kt)

<22日09時の予報>

強さ -

熱帯低気圧

存在地域 カロリン諸島

予報円の中心 北緯 6度50分(6.8度)

東経 139度00分(139.0度)

進行方向、速さ 西北西 20km/h(11kt)

中心気圧 1002hPa

最大風速 15m/s(30kt)

最大瞬間風速 23m/s(45kt)

予報円の半径 80km(45NM)

<22日21時の予報>

強さ -

存在地域 カロリン諸島

予報円の中心 北緯 7度50分(7.8度)

東経 137度00分(137.0度)

進行方向、速さ 西北西 20km/h(11kt)

中心気圧 1000hPa

中心付近の最大風速 18m/s(35kt)

最大瞬間風速 25m/s(50kt)

予報円の半径 110km(60NM)
`;

async function push2sc(){
  let scOpt = createPushOpt('日本台风报文', demoDes);
  // console.log(scOpt);
  let res = await rp(scOpt).catch(err=>{throw err});
  console.log(res);
}

function createPushOpt(txt='日本台风报文', des='![日本台风报文](http://www.jma.go.jp/en/typh/images/wide/all-00.png)'){
  let option = {
    method: 'POST',
    uri: scUrl,
    form: {
      text: txt, // 消息标题，最长为256，必填
      desp: des, // 消息内容，最长64Kb，可空，支持MarkDown
    },
    json: true, // Automatically stringifies the body to JSON
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  
  };
  return option;
}

push2sc()
  .catch(err=>{
    console.error(err);
  })