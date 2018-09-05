const urlBase64ToUint8Array = function (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const vapidPublicKey = 'BFqbp_L8wDhix6IIki9mxJGcJmOQAQ32euPT8NIvL4YPn-ahHuw6flgPVOvkgu2VTlHJ6cvcXy-BjKA7EWHrqFE';
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
// // Japan_Meteorological_Agency_logo2.jpg
// // JTWC_LogoFront.gif
// // Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  
  let title = 'trident';
  let trimData = `意外的文本信息`;
  let data = undefined;
  let tag = 'env';
  let icon = '/static/thumbnails/nmc-icon.jpg';
  try{
    data = JSON.parse(event.data.text());
    if(data.text){
      trimData = data.text.replace(/\n/g,' ').replace(/\s{2,}/g,'');
      title = data.title;
      tag = data.url;
    }else{
      trimData = '不符合预期格式的文本信息：' + data;
    }
  }
  catch(err){
    try{
      trimData = '文本信息:'+event.data.text();
    }
    catch(err){
      console.log(err);
    }
  }
  console.log(tag);
  event.waitUntil(
    self.registration.showNotification(title, {
      body: trimData,
      icon: icon,
      tag:tag,
      vibrate: [500, 100, 500],
    })
    // self.registration.showNotification('ServiceWorker Cookbook', {
    //   body: 'Push Notification Subscription Management'
    // })
  )
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
  let data = event.notification.tag||'https://trident.gdmo.gq';
  // console.log(data);
  event.waitUntil(
     self.clients.openWindow(data)
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({
       userVisibleOnly: true,
       applicationServerKey: convertedVapidKey
    })
    .then(function(subscription) {
      console.log('Subscribed after expiration', subscription.endpoint);
      return fetch('register', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
    })
  );
});

