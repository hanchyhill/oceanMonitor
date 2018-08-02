import urlBase64ToUint8Array from './base64util';

const testServiceWorker = ()=>{
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost'||window.location.hostname === '127.0.0.1')){
    return true;
  }else{
    return false;
  }
}

const testPush = ()=>'PushManager' in window?true:false;
const registerSW = ()=>{
  if (testServiceWorker()) {
    navigator.serviceWorker.register('/sw.js');
    navigator.serviceWorker.ready
    .then(()=> {
      console.log('SW注册完成');
    })
  };
}

const subscribePush =  ()=>{
  let reg = undefined;
  return navigator.serviceWorker.ready
  .then(registration=>{
    reg = registration;
    return registration.pushManager.getSubscription()
  })
  .then(subscription=>{
    if (subscription) {// If a subscription was found, return it.
      console.log('已订阅');
      return subscription;
    }else{
      const vapidPublicKey = 'BFqbp_L8wDhix6IIki9mxJGcJmOQAQ32euPT8NIvL4YPn-ahHuw6flgPVOvkgu2VTlHJ6cvcXy-BjKA7EWHrqFE';
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      return  reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
      });
    }
  })
};

function unsubscribePush() {
  return navigator.serviceWorker.ready
  .then(function(registration) {
    return registration.pushManager.getSubscription();
  }).then(function(subscription) {
    if(subscription){
      return subscription.unsubscribe()
      .then(()=>{
        return subscription;
      });
    }else{
      console.log('并未订阅消息');
      return false;
    }
  });
}

const isSubscribe = ()=>{
  return navigator.serviceWorker.ready
  .then(registration=>registration.pushManager.getSubscription())
  .then((subscription)=>{
    if(subscription){
      return subscription;
    }else{
      return false;
    }
  })
}

export { testServiceWorker,registerSW,subscribePush, isSubscribe,testPush,unsubscribePush};
