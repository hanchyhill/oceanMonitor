const config = {
  regArr : [
    {name:'WTPQ2-RJTD',cn:'JMA台风预报',     reg:/WTPQ2.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'WTPQ5-RJTD',cn:'JMA台风预报5天',  reg:/WTPQ5.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'WTPQ3-RJTD',cn:'JMA分析报',       reg:/WTPQ3.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'WTJP2-RJTD',cn:'JMA警报',       reg:/WTJP2.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'WTJP3-RJTD',cn:'JMA风暴警报',       reg:/WTJP3.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'FXPQ8-RJTD',cn:'JMA数值指导预报', reg:/FXPQ.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'WTPN3-PGTW',cn:'JTWC台风预报',    reg:/WTPN3.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WTPN5-PGTW',cn:'JTWC台风预报长remark',reg:/WTPN5.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WTPN2-PGTW',cn:'JTWC理由分析',    reg:/WTPN2.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'ABPW-PGTW', cn:'JTWC当前台风通报', reg:/ABPW.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'TPPN-PGTW', cn:'JTWC台风定位报',   reg:/TPPN.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WDPN-PGTW', cn:'JTWC诊断分析报',   reg:/WDPN.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WTSS-VHHH', cn:'HKO台风警报',      reg:/WTSS.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'FXSS2-VHHH',cn:'HKO主观预报',      reg:/FXSS2.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'FXSS0-VHHH',cn:'HKO模式指导预报',   reg:/FXSS0.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'WTPH0-RPMM', cn:'PAGASA警报',       reg:/WTPH0.*?RPMM\s*?(\d{6})/i,ins:'RPMM',},
    {name:'WTPH2-RPMM', cn:'PAGASA台风预报',       reg:/WTPH2.*?RPMM\s*?(\d{6})/i,ins:'RPMM',},
    {name:'WTKO-RKSL', cn:'KMA警报',       reg:/WTKO.*?RKSL\s*?(\d{6})/i,ins:'RKSL',},
    {name:'FXXT03-EGRR', cn:'英国模式报文',       reg:/FXXT03.*?EGRR\s*?(\d{6})/i,ins:'EGRR',},
    {name:'WTPQ2-BABJ',cn:'北京台风警报',      reg:/WTPQ2.*?BABJ\s*?(\d{6})/i,extra:{warning:'sameFileName'},ins:'BABJ',},
    {name:'TCPQ4-BABJ',cn:'北京卫星定位报',    reg:/TCPQ4.*?BABJ\s*?(\d{6})/i,ins:'BABJ',},
    {name:'SBHK-VHHH', cn:'HKO卫星定位报',    reg:/SBHK.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'SBCI-BCGZ', cn:'广州卫星定位报',   reg:/SBCI.*?BCGZ\s*?(\d{6})/i,ins:'BCGZ',},
    {name:'SDTH20-VTBB',cn:'曼谷卫星定位报',  reg:/SDTH20.*?VTBB\s*?(\d{6})/i,ins:'VTBB',},
    {name:'SDPH-RPMM', cn:'PAGASA卫星定位报', reg:/SDPH.*?RPMM\s*?(\d{6})/i,ins:'RPMM',},
  ]
};

exports.config = config;