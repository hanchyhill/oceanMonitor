import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - 海洋监测' : '海洋监测';
    window.document.title = title;
};

const protocol = location.protocol;
const isLocal = location.host.search(/8080/)===-1?false:true;
const ajaxUrl = isLocal ?
    'http://127.0.0.1:10074' :
    // 'https://trident.gdmo.gq' :
    env === 'production' ?
    protocol + '//trident.gdmo.gq' :
    protocol + '//trident.gdmo.gq';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;