const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log(vapidKeys.publicKey);
console.log(vapidKeys.privateKey);