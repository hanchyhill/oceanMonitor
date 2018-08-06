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
      let trimData = `意外的文本信息`;
      let data = undefined;
      try{
          data = JSON.parse(event.data.text());
          if(data.text){
            trimData = data.text.replace(/\n/g,' ').replace(/\s{2,}/g,'');
          }else{
            trimData = '不符合预期格式的文本信息：' + data;
          }
      }
      catch(err){
        try{
          trimData = '文本信息:'+event.data.text();
        }
        catch(err){
          console.error(err);
        }

      }
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
