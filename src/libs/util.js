import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - 海洋监测' : '海洋监测';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:10074' :
    env === 'production' ?
    'https://trident.gdmo.gq' :
    'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;