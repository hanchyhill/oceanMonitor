import Env from './env';

/**
 * 环境分析
 */
const envSrc = {
  tab:{
    sst:[
      {name:'西太海温',origin:'https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_sst_wpac_1.png'},
      {name:'海温距平',origin:'https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_wpac_1.png'},
      {name:'全球海温距平',origin:'https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_global_1.png'},
      {name:'南海浪高',origin:'http://www.oceanweather.com/data/South-China-Sea/WAVE000.GIF'},
      {name:'西太浪高',origin:'http://www.oceanweather.com/data/NPAC-Western/WAVE000.GIF'},
    ],
    wiscEnv:[
      {name:'低层涡度',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsvor.GIF'},
      {name:'低层辐合',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsconv.GIF'},
      {name:'高空辐散',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdvg.GIF'},
      {name:'垂直风切',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsshr.GIF'},
      {name:'风切趋势',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmssht.GIF'},
      {name:'高空风反演',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmswv.GIF'},
      {name:'中低层风反演',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsir.GIF'},
    ],
    probability:[
      {name:'0-48h 生成概率',origin:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rCUMP_048.gif'},
      {name:'0-24h 生成概率',origin:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rTCFP_024.gif'},
      {name:'24-48h 生成概率',origin:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rTCFP_048.gif'},
      {name:'最大潜在强度',origin:'http://wxmaps.org/pix/wpacpot.png'},
    ]
  },
  imgs:{
    jtwc:{name:'JTWC热带气旋警报图',origin:'http://www.metoc.navy.mil/jtwc/products/abpwsair.jpg'},
  }
};

/**
 * 数值模式
 */
const nwpSrc = {
  speedDial:{
    typhoon2000:{
      link:'http://www.typhoon2000.ph/multi/models.php',
      imgSrc:'/static/thumbnails/typhoon2000.jpg',
      headInfo:'模式/机构路径集合',
      head2:'typhoon2000',
      notes:'提供多家数值模式路径，历史台风机构预报路径合集',
    },
    ruc:{
      link:'https://ruc.noaa.gov/hfip/tceps/',
      imgSrc:'/static/thumbnails/ruc-tceps.jpg',
      headInfo:'模式集合预报',
      head2:'NOAA / RUC tceps',
      notes:'提供NCEP、EC、UKMO等集合预报路径',
    },
    emc:{
      link:'http://www.emc.ncep.noaa.gov/gmb/tpm/emchurr/tcgen/',
      imgSrc:'/static/thumbnails/emc-tc-track.jpg',
      headInfo:'气旋生成与追踪',
      head2:'NCEP / EMC',
      notes:'提供气旋生成和追踪监测',
    },
    gd121:{
      link:'http://www.gd12121.com:8080/special/typhoonpattern/page/typhoonpattern.asp',
      imgSrc:'/static/thumbnails/gd12121.jpg',
      headInfo:'EC集合预报',
      head2:'广东12121',
      notes:'提供EC集合预报相关产品',
    },
    gefs:{
      link:'https://www.tropicaltidbits.com/storminfo/',
      imgSrc:'/static/thumbnails/gefs_latest.png',
      headInfo:'GFS集合',
      head2:'tropicaltidbits',
      notes:'提供GFS集合预报图',
    },
  },
}

/**
 * 报文
 */
const bulletinSrc = {
  speedDial:{
    ssdBulletin:{
      link:'http://www.ssd.noaa.gov/PS/TROP/bulletins.html',
      imgSrc:'/static/thumbnails/ssdBulletin.jpg',
      headInfo:'NHC/JTWC报文合集',
      head2:'NOAA / SSD',
      notes:'提供实时NHC/JTWC/CPHC报文合集',
    },
    ssdADT:{
      link:'http://www.ssd.noaa.gov/PS/TROP/adt.html',
      imgSrc:'/static/thumbnails/ssdADT.jpg',
      headInfo:'ADT分析合集',
      head2:'NOAA / SSD',
      notes:'提供实时机构ADT分析报文合集',
    },
    wiscADT:{
      link:'http://tropic.ssec.wisc.edu/real-time/adt/adt.html',
      imgSrc:'/static/thumbnails/wiscADT.jpg',
      headInfo:'WISC ADT分析',
      head2:'WISC / CMISS',
      notes:'提供实时自动ADT分析',
    },
    nmcBulletin:{
      link:'http://www.nmc.cn/publish/typhoon/message.html',
      imgSrc:'/static/thumbnails/nmcBulletin.jpg',
      headInfo:'北京报文',
      head2:'中央气象台',
      notes:'NMC北京报文',
    },
    gdBJTY:{
      link:'http://10.148.8.228/to_pros_typonmessage.action?name=bjtfdwb',
      imgSrc:'/static/thumbnails/gdBJ.jpg',
      headInfo:'北京台风定位报',
      head2:'数据中心',
      notes:'信息中心下发的台风报文',
    },
  },
};

/**
 * 当前台风
 */
const currentSrc = {
  speedDial:{
    typhoonNew:{
      link:'http://www.nmc.cn/publish/typhoon/typhoon_new.html',
      imgSrc:'/static/thumbnails/typhoonnew.jpg',
      headInfo:'台风快讯',
      head2:'中央气象台',
      notes:'',
    },
    activeTCinSSD:{
      link:'http://www.ssd.noaa.gov/PS/TROP/Basin_WestPac.html',
      imgSrc:'/static/thumbnails/SSD-active-TC.jpg',
      headInfo:'NOAA active TC',
      head2:'NOAA / SSD / TROP',
      notes:'SSD 提供当前活跃TC的报文、目标监测卫星图像以及其他相关信息',
    },
    tropicaltidbits:{
      link:'https://www.tropicaltidbits.com/storminfo/',
      imgSrc:'/static/thumbnails/tropicaltidbits.jpg',
      headInfo:'TC消息集合',
      head2:'tropicaltidbits',
      notes:'此网站是Levi Cowan的个人网站，提供各家机构的预报集合，数值预报路径，多家数值预报模式和海洋环境监测数据。',
    },
    colostate:{
      link:'http://rammb.cira.colostate.edu/products/tc_realtime/',
      imgSrc:'/static/thumbnails/colostate-tc-realtime.jpg',
      headInfo:'TC real-time',
      head2:'科罗拉多州立大学',
      notes:'由科罗拉多州立大学提供的热带气旋监测网页，提供多通道卫星、海洋热容量、数值预报、德法指数等相关监测数据。',
    },
    wisc:{
      link:'http://tropic.ssec.wisc.edu/',
      imgSrc:'/static/thumbnails/wisc-tc-real-time.jpg',
      headInfo:'CIMSS realtime',
      head2:'威斯康星大学',
      notes:'由CIMSS热带气旋小组提供的热带气旋环境分析和监测页面',
    },
    jma:{
      link:'http://www.jma.go.jp/en/typh/',
      imgSrc:'/static/thumbnails/jma-tc.jpg',
      headInfo:'热带气旋消息',
      head2:'日本气象厅',
      notes:'负责有关世界气象组织对国际换日线以西的北太平洋洋面上生成的热带气旋达热带风暴或以上级别给予国际编号及命名工作。',
    },
    jtwc:{
      link:'http://www.metoc.navy.mil/jtwc/jtwc.html',
      imgSrc:'/static/thumbnails/jtwc.jpg',
      headInfo:'JTWC',
      head2:'联合台风警报中心',
      notes:'美国海军位于夏威夷珍珠港的海军太平洋气象及海洋中心。该中心负责为太平洋、印度洋等海域的热带气旋发出警报。',
    },
    digitalTY:{
      link:'http://agora.ex.nii.ac.jp/digital-typhoon/',
      imgSrc:'/static/thumbnails/digitalTY.jpg',
      headInfo:'digital typhoon',
      head2:'数字台风网',
      notes:'提供当前和历史台风卫星云图数据',
    },
    nrlNavy:{
      link:'https://www.nrlmry.navy.mil/TC.html',
      imgSrc:'/static/thumbnails/nrl.jpg',
      headInfo:'NRL TC',
      head2:'美国海军热带气旋监测',
      notes:`It's blocked`,
    },
  },
};

/**
 * 相关链接
 */
const refSrc = {
  links:{
    org:[
      {name:'香港天文台', url:'http://gb.weather.gov.hk/contentc.htm'},
      {name:'澳门地球物理暨氣象局', url:'http://www.smg.gov.mo/smg/c_index.htm'},
      {name:'台湾中央气象局', url:'https://www.cwb.gov.tw/'},
      {name:'日本气象厅-风观测', url:'http://www.jma.go.jp/en/amedas/000.html?elementCode=1'},
      {name:'菲律宾PAGASA', url:'https://www1.pagasa.dost.gov.ph/'},
    ],
    others:[
      {name:'http://www.ssd.noaa.gov/PS/TROP/CI-chart.html', url:'http://www.ssd.noaa.gov/PS/TROP/CI-chart.html'},
      {name:'http://photino.cwb.gov.tw/rdcweb/lib/comput1.htm#1', url:'http://photino.cwb.gov.tw/rdcweb/lib/comput1.htm#1'},
      {name:'http://photino.cwb.gov.tw/rdcweb/lib/comput2.htm', url:'http://photino.cwb.gov.tw/rdcweb/lib/comput2.htm'},
      {name:'http://www.ab126.com/Geography/2204.html', url:'http://www.ab126.com/Geography/2204.html'},
      {name:'https://tieba.baidu.com/f?kw=%E5%8F%B0%E9%A3%8E', url:'https://tieba.baidu.com/f?kw=%E5%8F%B0%E9%A3%8E'},
      {name:'http://bbs.typhoon.org.cn/index.php?c=thread&amp;fid=79', url:'http://bbs.typhoon.org.cn/index.php?c=thread&amp;fid=79'},
    ],
  },
}

/**
 * 卫星数据源
 */
const satSrc = {
  speedDial:{
    colSlider:{
      link:'http://col.st/t8E3d',
      imgSrc:'/static/thumbnails/col-slider.jpg',
      headInfo:'交互式圆盘图',
      head2:'科罗拉多州立大学',
      notes:'提供葵花、GOES系列卫星的交互式多通道卫星图像',
    },
    colTropics:{
      link:'http://rammb.cira.colostate.edu/ramsdis/online/himawari-8.asp#Tropics',
      imgSrc:'/static/thumbnails/col-tropics-sat.jpg',
      headInfo:'himawari8 热带',
      head2:'科罗拉多州立大学',
      notes:'提供葵花卫星的图像',
    },
    nictHim8:{
      link:'https://himawari8.nict.go.jp/',
      imgSrc:'/static/thumbnails/nict.jpg',
      headInfo:'葵花8即时图像',
      head2:'NICT',
      notes:'提供葵花卫星的实时图像',
    },
    jmaSat:{
      link:'http://www.data.jma.go.jp/mscweb/data/himawari/sat_img.php?area=se2',
      imgSrc:'/static/thumbnails/jma-sat.jpg',
      headInfo:'葵花8多通道图像',
      head2:'日本气象厅',
      notes:'提供葵花8多通道和多通道融合图像',
    },
    fy4:{
      link:'http://fy4.nsmc.org.cn/nsmc/cn/image/animation.html',
      imgSrc:'/static/thumbnails/fy4.jpg',
      headInfo:'风云4号卫星云图',
      head2:'国家卫星气象中心',
      notes:'提供风云4多通道及二级产品图像',
    },
    gdWeb:{
      link:'http://10.148.8.228/to_live_home.action?name=xfy2g',
      imgSrc:'/static/thumbnails/gd-web.jpg',
      headInfo:'业务网卫星图像',
      head2:'生态中心',
      notes:'提供风云、葵花系列卫星云图',
    },
    gdSat:{
      link:'http://10.12.12.211/satellite/',
      imgSrc:'/static/thumbnails/gd-sat.jpg',
      headInfo:'华南区域卫星遥感',
      head2:'生态中心',
      notes:'提供风云、葵花系列卫星云图',
    },
  },
  tab:{
    wiscSat:[
      {name:'BD色阶', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/irbdgms5kml.GIF',},
      {name:'红外', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yyirgms5.GIF',},
      {name:'NHC色阶', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yyirgms5n.GIF',},
      {name:'水汽', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yywvgms5.GIF',},
    ],
    ssdSat:[
      {name:'him8可见光', origin:'http://www.ssd.noaa.gov/jma/twpac/vis-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-vis.html'},
      {name:'him8-ir2', origin:'http://www.ssd.noaa.gov/jma/twpac/ir2-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-ir2.html'},
      {name:'him8-水汽-ir3', origin:'http://www.ssd.noaa.gov/jma/twpac/wv-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-wv.html'},
      {name:'him8-ir4', origin:'http://www.ssd.noaa.gov/jma/twpac/ir4-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-ir4.html'},
      {name:'ir4-BD色阶', origin:'http://www.ssd.noaa.gov/jma/twpac/bd-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-bd.html'},
      {name:'ir4-Rainbow', origin:'http://www.ssd.noaa.gov/jma/twpac/rb-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-rb.html'},
      {name:'ir4-AVN', origin:'http://www.ssd.noaa.gov/jma/twpac/avn-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-avn.html'},
      {name:'RGB', origin:'http://www.ssd.noaa.gov/jma/twpac/rgb-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-rgb.html'},
    ],
    polarSat:[
      {name:'DMSP-85GHz', origin:'http://www.ssd.noaa.gov/poes/twpac/ss85-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/poes/twpac/h5-loop-ss85.html'},
      {name:'DMSP-地面风', origin:'http://www.ssd.noaa.gov/poes/twpac/sswd-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/poes/twpac/h5-loop-sswd.html'},
      {name:'AMSU-89GHz', origin:'http://www.ssd.noaa.gov/poes/twpac/am89-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/poes/twpac/h5-loop-am89.html'},
    ],
    coloSat:[
      {name:'可见光', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/tropics_band_03.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/tropics_band_03&width=1020&height=720&number_of_images_to_display=24'},
      {name:'Band 7 (3.9 µm)', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/himawari-8_band_07_sector_06.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/himawari-8_band_07_sector_06&width=1020&height=720&number_of_images_to_display=24'},
      {name:'Band 8 (6.2 µm)', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/tropics_band_08.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/tropics_band_08&width=1020&height=720&number_of_images_to_display=24'},
      {name:'Band 13 (10.4 µm)', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/himawari-8_band_13_sector_06.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/himawari-8_band_13_sector_06&width=1020&height=720&number_of_images_to_display=24'},
    ],
  },
  
}

const srcConfig = {envSrc, nwpSrc, bulletinSrc, currentSrc, refSrc,};

export default srcConfig;
export {envSrc, nwpSrc, bulletinSrc, refSrc, currentSrc,};