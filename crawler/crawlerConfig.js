const dirConfig ={
  base:'../static/remote-img/',
  dirArr:['env/', 'sat/', 'ascat/']
};

const config = {
  i20: [
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_sst_wpac_1.png', lastModified:'', dir:'env/'},//'last-modified'
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_ssta_wpac_1.png', lastModified:'', dir:'env/'},
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_ssta_global_1.png', lastModified:'', dir:'env/'},
    {urlBase:'http://www.oceanweather.com/data/South-China-Sea/', name:'WAVE000.GIF', lastModified:'', dir:'env/'},
    {urlBase:'http://www.oceanweather.com/data/NPAC-Western/', name:'WAVE000.GIF', lastModified:'', dir:'env/west-'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsvor.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsconv.GIF', lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsdvg.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsshr.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmssht.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmswv.GIF'  , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsir.GIF'  , lastModified:'', dir:'env/'},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rCUMP_048.gif', lastModified:'', dir:'env/'},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rTCFP_024.gif', lastModified:'', dir:'env/'},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rTCFP_048.gif', lastModified:'', dir:'env/'},
    {urlBase:'http://wxmaps.org/pix/'                            , name:'wpacpot.png'     , lastModified:'', dir:'env/'},
    {urlBase:'http://www.metoc.navy.mil/jtwc/products/', name:'abpwsair.jpg', lastModified:'', dir:'env/', retry:'any'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds230.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds242.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds254.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds231.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds243.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds255.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds232.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds244.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds256.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds233.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds245.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds257.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas230.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas242.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas254.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas231.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas243.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas255.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas232.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas244.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas256.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas233.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas245.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas257.png' , lastModified:'', dir:'ascat/'},
  ],
  i6:[
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'irbdgmskml.GIF', lastModified:'', dir:'sat/'},// 这个是不是有问题?
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yyirgms5.GIF'  , lastModified:'', dir:'sat/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yyirgms5n.GIF' , lastModified:'', dir:'sat/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yywvgms5.GIF'  , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'vis-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'ir2-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'wv-l.gif' , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'ir4-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'bd-l.gif' , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'rb-l.gif' , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'avn-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'rgb-l.jpg', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'ss85-l.jpg', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'sswd-l.jpg', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'am89-l.jpg', dir:'sat/'},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'tropics_band_03.gif', dir:'sat/'},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'himawari-8_band_07_sector_06.gif', dir:'sat/'},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'tropics_band_08.gif', dir:'sat/'},
    {urlBase:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/', name:'himawari-8_band_13_sector_06.gif', dir:'sat/'},
  ],
};

module.exports = {
  config,
  dirConfig,
};

/* export {config,dirConfig};
export default {config,dirConfig}; */