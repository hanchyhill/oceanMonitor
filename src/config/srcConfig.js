import Env from './env';

const env = {
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

const srcConfig = {env,};

export default srcConfig;
export {env,};