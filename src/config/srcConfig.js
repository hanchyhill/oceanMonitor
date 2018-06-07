import Env from './env';

/**
 * 环境分析
 * ES6 module
 */
const envSrc = {
  /**
   * speedDial数据
  */
  speedDial:{
    steer:{
      link:'http://tropic.ssec.wisc.edu/real-time/dlmmain.php?&basin=westpac&sat=wgms&prod=dlm2&zoom=&time=',
      imgSrc:'/static/thumbnails/steerStream.jpg',
      headInfo:'引导气流',
      head2:'WISC',
      notes:'根据热带气旋强度选择平均引导流，引导气流可以指示热带气旋的移动方向。',
    },
    oceanHeatContent:{
      link:'http://www.aoml.noaa.gov/phod/cyclone/data/np.html',
      imgSrc:'/static/thumbnails/ohc.jpg',
      headInfo:'海洋热容量',
      head2:'NOAA / AOML',
      notes:'海洋上层的热力结构是热带气旋与海洋相互作用中的关节要素，对热带气旋的加强起着重要作用。',
    },
    cyclonephase:{
      link:'http://moe.met.fsu.edu/cyclonephase/',
      imgSrc:'/static/thumbnails/cyclonephase.jpg',
      headInfo:'气旋变性分析',
      head2:'moe.met.fsu.edu',
      notes:'本页面提供当前和历史数据中北半球气旋相位图。',
    },
    mtcswa:{
      link:'http://www.ssd.noaa.gov/PS/TROP/mtcswa.html',
      imgSrc:'/static/thumbnails/mtcswa.jpg',
      headInfo:'融合地面风反演',
      head2:'NOAA / MTCSWA',
      notes:'由多部卫星探测器融合反演当前台风的地面风场。',
    },
    eTRaP:{
      link:'http://www.ssd.noaa.gov/PS/TROP/etrap.html',
      imgSrc:'/static/thumbnails/eTRaP.jpg',
      headInfo:'集合热带降水估测',
      head2:'NOAA / eTRaP',
      notes:'由多部卫星微波探测器和数值预报估测热带降水。',
    },
  },
  tab:{
    sst:[
      {name:'西太海温',origin:'https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_sst_wpac_1.png',
        local:'/static/remote-img/env/cdas-sflux_sst_wpac_1.png',},
      {name:'海温距平',origin:'https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_wpac_1.png',
        local:'/static/remote-img/env/cdas-sflux_ssta_wpac_1.png',},
      {name:'全球海温距平',origin:'https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_global_1.png',
        local:'/static/remote-img/env/cdas-sflux_ssta_global_1.png',},
      {name:'海洋热容量',origin:'http://models.weatherbell.com/sst/tcheat_wpac_2017.png',
      local:'http://models.weatherbell.com/sst/tcheat_wpac_2017.png',},
      {name:'西太海温2',origin:'http://models.weatherbell.com/sst/wpac_cdas1.png',
      local:'http://models.weatherbell.com/sst/wpac_cdas1.png',},
      {name:'海温距平2',origin:'http://models.weatherbell.com/sst/wpac_cdas1_anom.png',
      local:'http://models.weatherbell.com/sst/wpac_cdas1_anom.png',},
      {name:'南海浪高',origin:'http://www.oceanweather.com/data/South-China-Sea/WAVE000.GIF',
      local:'/static/remote-img/env/WAVE000.GIF',},
      {name:'西太浪高',origin:'http://www.oceanweather.com/data/NPAC-Western/WAVE000.GIF',
      local:'/static/remote-img/env/west-WAVE000.GIF',},
    ],
    wiscEnv:[
      {name:'低层涡度',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsvor.GIF',
      local:'/static/remote-img/env/wgmsvor.GIF',},
      {name:'低层辐合',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsconv.GIF',
      local:'/static/remote-img/env/wgmsconv.GIF',},
      {name:'高空辐散',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdvg.GIF',
      local:'/static/remote-img/env/wgmsdvg.GIF',},
      {name:'垂直风切',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsshr.GIF',
      local:'/static/remote-img/env/wgmsshr.GIF',},
      {name:'风切趋势',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmssht.GIF',
      local:'/static/remote-img/env/wgmssht.GIF',},
      {name:'高空风反演',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmswv.GIF',
      local:'/static/remote-img/env/wgmswv.GIF',},
      {name:'中低层风反演',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsir.GIF',
      local:'/static/remote-img/env/wgmsir.GIF',},
    ],
    wiscSteer:[
      {name:'700-850mb',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdlm1.GIF', note:'中心气压>1000hPa / 最大风力<23m/s', local:'/static/remote-img/env/wgmsdlm1.GIF'},
      {name:'500-850hPa',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdlm2.GIF', note:'中心气压(990-999hPa) / 最大风力23-31m/s', local:'/static/remote-img/env/wgmsdlm2.GIF'},
      {name:'400-850mb',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdlm3.GIF', note:'中心气压970-989hPa / 最大风力31-46m/s', local:'/static/remote-img/env/wgmsdlm3.GIF'},
      {name:'300-850mb',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdlm4.GIF', note:'中心气压950-969hPa / 最大风力46-57m/s', local:'/static/remote-img/env/wgmsdlm4.GIF'},
      {name:'250-850mb',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdlm5.GIF', note:'中心气压940-949hPa / 最大风力57-63m/s', local:'/static/remote-img/env/wgmsdlm5.GIF'},
      {name:'200-700mb',origin:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdlm6.GIF', note:'中心气压<940hPa / 最大风力>63m/s', local:'/static/remote-img/env/wgmsdlm6.GIF'},
    ],
    probability:[
      {name:'0-48h 生成概率',origin:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rCUMP_048.gif',
      local:'/static/remote-img/env/wp_rCUMP_048.gif',},
      {name:'0-24h 生成概率',origin:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rTCFP_024.gif',
      local:'/static/remote-img/env/wp_rTCFP_024.gif',},
      {name:'24-48h 生成概率',origin:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rTCFP_048.gif',
      local:'/static/remote-img/env/wp_rTCFP_048.gif',},
      {name:'最大潜在强度',origin:'http://wxmaps.org/pix/wpacpot.png',
      local:'/static/remote-img/env/wpacpot.png',},
    ],
    mjo:[
      {name:'MJO(EC)',origin:'http://www.cpc.ncep.noaa.gov/products/precip/CWlink/MJO/CLIVAR/ECMF_phase_51m_full.gif',
      local:'http://www.cpc.ncep.noaa.gov/products/precip/CWlink/MJO/CLIVAR/ECMF_phase_51m_full.gif',},
      {name:'MJO(NCEP-GEFS)',origin:'http://www.cpc.ncep.noaa.gov/products/precip/CWlink/MJO/ensplume_full.gif',
      local:'http://www.cpc.ncep.noaa.gov/products/precip/CWlink/MJO/ensplume_full.gif',},
    ],
  },
  imgs:{
    jtwc:{name:'JTWC热带气旋警报图',origin:'https://pzal.ndbc.noaa.gov/collab/jtwc/products/abpwsair.jpg',// origin:'http://www.metoc.navy.mil/jtwc/products/abpwsair.jpg',
    local:'/static/remote-img/env/abpwsair.jpg',},
    tropicOutlook:{name:'2周热带天气展望',origin:'http://www.cpc.ncep.noaa.gov/products/precip/CWlink/ghazards/images/gth_full.png',
    local:'http://www.cpc.ncep.noaa.gov/products/precip/CWlink/ghazards/images/gth_full.png',},
    phSatAnalysis:{name:'热带卫星天气分析',origin:'http://www.typhoon2000.ph/t2kgraphsat.gif',
    local:'http://www.typhoon2000.ph/t2kgraphsat.gif',},
    scs2idx:{name:'南海夏季风爆发指数',origin:'http://cmdp.ncc-cma.net/Monitoring/EastAsian/scs2idx.today.gif',
    local:'http://cmdp.ncc-cma.net/Monitoring/EastAsian/scs2idx.today.gif',},

  },
  
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
    typhoonNew:{
      link:'http://www.nmc.cn/publish/typhoon/typhoon_new.html',
      imgSrc:'/static/thumbnails/typhoonnew.jpg',
      headInfo:'台风快讯',
      head2:'中央气象台',
      notes:'',
    },
    nmcBulletin:{
      link:'http://www.nmc.cn/publish/typhoon/message.html',
      imgSrc:'/static/thumbnails/nmcBulletin.jpg',
      headInfo:'北京报文',
      head2:'中央气象台',
      notes:'NMC北京报文',
    },
    jma:{
      link:'http://www.jma.go.jp/en/typh/',
      imgSrc:'/static/thumbnails/jma-tc.jpg',
      headInfo:'JMA热带气旋通报',
      head2:'日本气象厅',
      notes:'负责有关世界气象组织对国际换日线以西的北太平洋洋面上生成的热带气旋达热带风暴或以上级别给予国际编号及命名工作。',
    },
    jtwc:{
      link:'https://pzal.ndbc.noaa.gov/collab/jtwc/',
      imgSrc:'/static/thumbnails/jtwc.jpg',
      orginLink:'http://www.metoc.navy.mil/jtwc/jtwc.html',
      headInfo:'美国JTWC',
      head2:'联合台风警报中心',
      notes:'美国海军位于夏威夷珍珠港的海军太平洋气象及海洋中心。该中心负责为太平洋、印度洋等海域的热带气旋发出警报。',
    },
    ssdBulletin:{
      link:'http://www.ssd.noaa.gov/PS/TROP/bulletins.html',
      imgSrc:'/static/thumbnails/ssdBulletin.jpg',
      headInfo:'NHC-SSD报文合集',
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
    gdBJTY:{
      link:'http://10.148.8.228/to_pros_typonmessage.action?name=bjtfdwb',
      imgSrc:'/static/thumbnails/gdBJ.jpg',
      headInfo:'北京台风定位报',
      head2:'数据中心',
      notes:'信息中心下发的台风报文',
    },
    nchmf:{
      link:'http://www.nchmf.gov.vn/Web/en-US/70/102/Default.aspx',
      imgSrc:'/static/thumbnails/nchmf-vietnam.jpg',
      headInfo:'越南预报',
      head2:'越南水文气象预报中心',
      notes:'越南路径预报',
    },
  },
};

/**
 * 当前台风
 */
const currentSrc = {
  speedDial:{
    
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
      {name:'NRL历史台风数据', url:'https://www.nrlmry.navy.mil/tcdat/'},
      
    ],
    others:[
      {name:'德法强度表', url:'http://www.ssd.noaa.gov/PS/TROP/CI-chart.html'},
      {name:'氣象常用表單位換算', url:'http://photino.cwb.gov.tw/rdcweb/lib/comput1.htm#1'},
      {name:'计量单位换算', url:'http://photino.cwb.gov.tw/rdcweb/lib/comput2.htm'},
      {name:'海平面气压订正', url:'http://www.ab126.com/Geography/2204.html'},
      {name:'百度台风吧', url:'https://tieba.baidu.com/f?kw=%E5%8F%B0%E9%A3%8E'},
      {name:'台风论坛', url:'http://bbs.typhoon.org.cn/index.php?c=thread&amp;fid=79'},
      {name:'ECMWF 二进制报文解析', url:'http://apps.ecmwf.int/codes/bufr/validator/'},
      
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
      {name:'BD色阶', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/irbdgmskml.GIF',
      local:'/static/remote-img/sat/irbdgmskml.GIF',},
      {name:'红外', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yyirgms5.GIF',
      local:'/static/remote-img/sat/yyirgms5.GIF',},
      {name:'NHC色阶', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yyirgms5n.GIF',
      local:'/static/remote-img/sat/yyirgms5n.GIF',},
      {name:'水汽', origin:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yywvgms5.GIF',
      local:'/static/remote-img/sat/yywvgms5.GIF',},
    ],
    ssdSat:[
      {name:'him8可见光', origin:'http://www.ssd.noaa.gov/jma/twpac/vis-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-vis.html',
      local:'/static/remote-img/sat/vis-l.gif',},
      {name:'him8-ir2', origin:'http://www.ssd.noaa.gov/jma/twpac/ir2-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-ir2.html',
      local:'/static/remote-img/sat/ir2-l.gif',},
      {name:'him8-水汽-ir3', origin:'http://www.ssd.noaa.gov/jma/twpac/wv-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-wv.html',
      local:'/static/remote-img/sat/wv-l.gif',},
      {name:'him8-ir4', origin:'http://www.ssd.noaa.gov/jma/twpac/ir4-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-ir4.html',
      local:'/static/remote-img/sat/ir4-l.gif',},
      {name:'ir4-BD色阶', origin:'http://www.ssd.noaa.gov/jma/twpac/bd-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-bd.html',
      local:'/static/remote-img/sat/bd-l.gif',},
      {name:'ir4-Rainbow', origin:'http://www.ssd.noaa.gov/jma/twpac/rb-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-rb.html',
      local:'/static/remote-img/sat/rb-l.gif',},
      {name:'ir4-AVN', origin:'http://www.ssd.noaa.gov/jma/twpac/avn-l.gif', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-avn.html',
      local:'/static/remote-img/sat/avn-l.gif',},
      {name:'RGB', origin:'http://www.ssd.noaa.gov/jma/twpac/rgb-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/jma/twpac/h5-loop-rgb.html',
      local:'/static/remote-img/sat/rgb-l.jpg',},
    ],
    polarSat:[
      {name:'DMSP-85GHz', origin:'http://www.ssd.noaa.gov/poes/twpac/ss85-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/poes/twpac/h5-loop-ss85.html',
      local:'/static/remote-img/sat/ss85-l.jpg',},
      {name:'DMSP-地面风', origin:'http://www.ssd.noaa.gov/poes/twpac/sswd-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/poes/twpac/h5-loop-sswd.html',
      local:'/static/remote-img/sat/sswd-l.jpg',},
      {name:'AMSU-89GHz', origin:'http://www.ssd.noaa.gov/poes/twpac/am89-l.jpg', anchorUrl:'http://www.ssd.noaa.gov/poes/twpac/h5-loop-am89.html',
      local:'/static/remote-img/sat/am89-l.jpg',},
    ],
    coloSat:[
      {name:'可见光', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/tropics_band_03.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/tropics_band_03&width=1020&height=720&number_of_images_to_display=24',
      local:'/static/remote-img/sat/tropics_band_03.gif',},
      {name:'Band 7 (3.9 µm)', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/himawari-8_band_07_sector_06.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/himawari-8_band_07_sector_06&width=1020&height=720&number_of_images_to_display=24',
      local:'/static/remote-img/sat/himawari-8_band_07_sector_06.gif',},
      {name:'Band 8 (6.2 µm)', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/tropics_band_08.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/tropics_band_08&width=1020&height=720&number_of_images_to_display=24',
      local:'/static/remote-img/sat/tropics_band_08.gif',},
      {name:'Band 13 (10.4 µm)', origin:'http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/himawari-8_band_13_sector_06.gif', anchorUrl:'http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/himawari-8_band_13_sector_06&width=1020&height=720&number_of_images_to_display=24',
      local:'/static/remote-img/sat/himawari-8_band_13_sector_06.gif',},
    ],
  },
  
}

/**
 * 风场扫描
 */
const ascatImg ={
  descend:[
    [ 
      {name:'下降华东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds230.png',local:'/static/remote-img/ascat/WMBds230.png'},
      {name:'下降黄海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds242.png',local:'/static/remote-img/ascat/WMBds242.png'},
      {name:'下降日本', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds254.png',local:'/static/remote-img/ascat/WMBds254.png'},
    ],
    [
      {name:'广东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds231.png',local:'/static/remote-img/ascat/WMBds231.png'},
      {name:'下降东海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds243.png',local:'/static/remote-img/ascat/WMBds243.png'},
      {name:'下降琉球以东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds255.png',local:'/static/remote-img/ascat/WMBds255.png'},
    ],
    [
      {name:'下降南海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds232.png',local:'/static/remote-img/ascat/WMBds232.png'},
      {name:'下降菲律宾北部', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds244.png',local:'/static/remote-img/ascat/WMBds244.png'},
      {name:'下降关岛', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds256.png',local:'/static/remote-img/ascat/WMBds256.png'},
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds233.png',local:'/static/remote-img/ascat/WMBds233.png',name:'下降南海南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds245.png',local:'/static/remote-img/ascat/WMBds245.png',name:'下降菲律宾南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds257.png',local:'/static/remote-img/ascat/WMBds257.png',name:'下降菲东', },
    ],
  ],
  ascend:[
    [ 
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas230.png',local:'/static/remote-img/ascat/WMBas230.png',name:'上升华东', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas242.png',local:'/static/remote-img/ascat/WMBas242.png',name:'上升黄海', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas254.png',local:'/static/remote-img/ascat/WMBas254.png',name:'上升日本', },
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas231.png',local:'/static/remote-img/ascat/WMBas231.png',name:'上升广东', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas243.png',local:'/static/remote-img/ascat/WMBas243.png',name:'上升东海', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas255.png',local:'/static/remote-img/ascat/WMBas255.png',name:'上升琉球以东', },
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas232.png',local:'/static/remote-img/ascat/WMBas232.png',name:'上升南海', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas244.png',local:'/static/remote-img/ascat/WMBas244.png',name:'上升菲北', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas256.png',local:'/static/remote-img/ascat/WMBas256.png',name:'上升关岛', },
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas233.png',local:'/static/remote-img/ascat/WMBas233.png',name:'上升南海南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas245.png',local:'/static/remote-img/ascat/WMBas245.png',name:'上升菲南', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas257.png',local:'/static/remote-img/ascat/WMBas257.png',name:'上升菲东', },
    ],
  ],
  descendB:[
    [ 
      {name:'下降华东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds230.png',local:'/static/remote-img/ascat/B-WMBds230.png'},
      {name:'下降黄海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds242.png',local:'/static/remote-img/ascat/B-WMBds242.png'},
      {name:'下降日本', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds254.png',local:'/static/remote-img/ascat/B-WMBds254.png'},
    ],
    [
      {name:'广东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds231.png',local:'/static/remote-img/ascat/B-WMBds231.png'},
      {name:'下降东海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds243.png',local:'/static/remote-img/ascat/B-WMBds243.png'},
      {name:'下降琉球以东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds255.png',local:'/static/remote-img/ascat/B-WMBds255.png'},
    ],
    [
      {name:'下降南海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds232.png',local:'/static/remote-img/ascat/B-WMBds232.png'},
      {name:'下降菲律宾北部', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds244.png',local:'/static/remote-img/ascat/B-WMBds244.png'},
      {name:'下降关岛', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds256.png',local:'/static/remote-img/ascat/B-WMBds256.png'},
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds233.png',local:'/static/remote-img/ascat/B-WMBds233.png',name:'下降南海南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds245.png',local:'/static/remote-img/ascat/B-WMBds245.png',name:'下降菲律宾南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBds257.png',local:'/static/remote-img/ascat/B-WMBds257.png',name:'下降菲东', },
    ],
  ],
  ascendB:[
    [ 
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas230.png',local:'/static/remote-img/ascat/B-WMBas230.png',name:'上升华东', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas242.png',local:'/static/remote-img/ascat/B-WMBas242.png',name:'上升黄海', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas254.png',local:'/static/remote-img/ascat/B-WMBas254.png',name:'上升日本', },
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas231.png',local:'/static/remote-img/ascat/B-WMBas231.png',name:'上升广东', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas243.png',local:'/static/remote-img/ascat/B-WMBas243.png',name:'上升东海', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas255.png',local:'/static/remote-img/ascat/B-WMBas255.png',name:'上升琉球以东', },
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas232.png',local:'/static/remote-img/ascat/B-WMBas232.png',name:'上升南海', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas244.png',local:'/static/remote-img/ascat/B-WMBas244.png',name:'上升菲北', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas256.png',local:'/static/remote-img/ascat/B-WMBas256.png',name:'上升关岛', },
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas233.png',local:'/static/remote-img/ascat/B-WMBas233.png',name:'上升南海南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas245.png',local:'/static/remote-img/ascat/B-WMBas245.png',name:'上升菲南', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_METB/zooms/WMBas257.png',local:'/static/remote-img/ascat/B-WMBas257.png',name:'上升菲东', },
    ],
  ],
};

const srcConfig = {envSrc, nwpSrc, bulletinSrc, currentSrc, refSrc, satSrc, ascatImg};

export default srcConfig;
export {envSrc, nwpSrc, bulletinSrc, currentSrc, refSrc, satSrc, ascatImg};