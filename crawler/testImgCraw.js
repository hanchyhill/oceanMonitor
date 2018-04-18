/**
 * TODO promise化
 * async await化
 * data.on('end')
 * 
 * 
 * 
 */
const schedule = require('node-schedule');
// const cheerio = require('cheerio');
const http = require('http');
const axios = require('axios');
const fs = require('fs');



const config = {
  sst : [
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_sst_wpac_1.png', lastModied:''},//'last-modified'
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_ssta_wpac_1.png', lastModied:''},
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_ssta_global_1.png', lastModied:''},
    {urlBase:'http://www.oceanweather.com/data/South-China-Sea/', name:'WAVE000.GIF', lastModied:''},
    {urlBase:'http://www.oceanweather.com/data/NPAC-Western/', name:'WAVE000.GIF', lastModied:''},
  ],
  wiscEnv:[
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsvor.GIF' , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsconv.GIF', lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsdvg.GIF' , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsshr.GIF' , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmssht.GIF' , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmswv.GIF'  , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsir.GIF'  , lastModied:''},
  ],
  probability:[
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rCUMP_048.gif', lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rTCFP_024.gif', lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rTCFP_048.gif', lastModied:''},
    {urlBase:'http://wxmaps.org/pix/'                            , name:'wpacpot.png'     , lastModied:''},
  ],
  wiscSat:[
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'irbdgmskml.GIF', lastModied:''},// 这个是不是有问题?
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yyirgms5.GIF'  , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yyirgms5n.GIF' , lastModied:''},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yywvgms5.GIF'  , lastModied:''},
  ],
  ssdSat:[
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'vis-l.gif', lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'ir2-l.gif', lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'wv-l.gif' , lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'ir4-l.gif', lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'bd-l.gif' , lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'rb-l.gif' , lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'avn-l.gif', lastModied:''},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'rgb-l.jpg', lastModied:''},
  ],
  polarSat:[
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'ss85-l.jpg'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'sswd-l.jpg'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'am89-l.jpg'},
  ],
  coloSat:[
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'tropics_band_03.gif', lastModied:''},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'himawari-8_band_07_sector_06.gif', lastModied:''},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'tropics_band_08.gif', lastModied:''},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'himawari-8_band_13_sector_06.gif', lastModied:''},
  ],
};

function getImg(urlBase, fileName){
  axios({
    method: 'get',
    url: urlBase + fileName,
    responseType: 'stream',
  })
  .then(function(res) {
    console.log(res.headers);
    res.data.pipe(fs.createWriteStream('../static/remote-img/'+fileName));
  })
  .catch(err=>{
    console.log(err);
  });
}

async function sc01(params) {
  let now = new Date();
  console.log(now.toString());
  for(let item of config.sst){
    getImg(item.urlBase, item.name);
  }
};

let rule01 = new schedule.RecurrenceRule();
rule01.minute = [new schedule.Range(0, 59, 1)];

let job01 = schedule.scheduleJob(rule01, sc01);