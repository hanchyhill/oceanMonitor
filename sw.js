// Immediately take control of the page, see the 'Immediate Claim' recipe
// for a detailed explanation of the implementation of the following two
// event listeners.

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  event.waitUntil(
    (function(){
      let trimData = `时    间： 	01 日 08 时
      命    名： 	“云雀”，JONGDARI
      编    号： 	1812 号
      中心位置： 	北纬30.4度、东经128.0度
      强度等级： 	热带风暴
      最大风力： 	8级， 20米/秒（约72公里/时）
      中心气压： 	990 hPa
      参考位置： 	距离浙江省舟山市偏东方向约560公里
      风圈半径： 	七级风圈半径 东北方向150公里；东南方向90公里；西南方向110公里；西北方向200公里
      预报结论： 	“云雀”将以每小时15公里左右的速度向西南方向移动，强度变化不大。
      （下次更新时间为1日11时30分）`.replace(/\n/g,' ').replace(/\s{2,}/g,'');
      let data = undefined;
      try{
        data = event.data.json();//{}
        trimData = data.text
      }
      catch(err){
      }
      
      // console.log(data);

      self.registration.showNotification('台风快讯', {
        body: trimData,
        icon: '/static/thumbnails/nmc-icon.jpg',
        vibrate: [500, 100, 500],
      });
    })()
  )

});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
     self.clients.openWindow('http://www.nmc.cn/publish/typhoon/typhoon_new.html')
  );
});
