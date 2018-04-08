# 海洋监测网页

分步走战略：

1. step1: 图像直链 + iframe(较短页面内嵌) + speedDailThumbnail(长页面缩略图外链)
2. step2: 图像转存本地
3. step3: 爬虫外部链接，清洗数据，数据分类，本地储存

## 环境分析

* oceanweather -> image-TabGroup
  * [西太海温](http://www.oceanweather.com/data/NPAC-Western/SST.GIF)
  * [南海海温](http://www.oceanweather.com/data/South-China-Sea/SST.GIF)
  * [西太浪高](http://www.oceanweather.com/data/NPAC-Western/WAVE000.GIF)
  * [南海浪高](http://www.oceanweather.com/data/South-China-Sea/WAVE000.GIF)

* tropicalTidbits -> image-TabGroup
  * [西太海温](https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_sst_wpac_1.png)
  * [西太海温距平](https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_wpac_1.png)
  * [全球海温距平](https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_global_1.png)

* wisc -> image-TabGroup
  * [涡度](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsvor.GIF)
  * [低层辐合](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsconv.GIF)
  * [高空辐散](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdvg.GIF)
  * [垂直风切](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsshr.GIF)
  * [风切趋势](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmssht.GIF)
  * [高空风反演](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmswv.GIF)
  * [中低层风反演](http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsir.GIF)

* [wisc引导气流](http://tropic.ssec.wisc.edu/real-time/dlmmain.php?&basin=westpac&sat=wgms&prod=dlm2&zoom=&time=) -> iframe

* [SSD西太分析](http://www.ssd.noaa.gov/PS/TROP/TCFP/west_pacific.html)
  * [0-48小时生成概率](http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rCUMP_048.gif) -> image

* [SSD风场分析](http://www.ssd.noaa.gov/PS/TROP/mtcswa.html) -> speedDail
* [SSD降水概率估计](http://www.ssd.noaa.gov/PS/TROP/etrap.html) -> speedDail
* [JTWC台风警报图](http://www.metoc.navy.mil/jtwc/products/abpwsair.jpg) -> image
* [气旋变性分析](http://moe.met.fsu.edu/cyclonephase/) -> speedDail
* [海洋热容量](http://www.aoml.noaa.gov/phod/cyclone/data/np.html) -> speedDail
* [最大潜在强度](http://wxmaps.org/pix/wpacpot.png) -> image
* [热带气旋气候预测]

* ASCAT风场扫描 -> image-TabGroup

```链接
上升
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds232.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds233.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds242.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds243.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds244.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds245.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds254.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds255.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds256.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds257.png

下降
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas230.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas231.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas232.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas233.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas242.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas243.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas244.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas245.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas254.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas255.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas256.png
http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas257.png
```

## 当前台风

* [台风快讯](http://www.nmc.cn/publish/typhoon/typhoon_new.html) -> iframe
* [SSD当前台风](http://www.ssd.noaa.gov/PS/TROP/Basin_WestPac.html) -> iframe
* [tropicaltidbits](https://www.tropicaltidbits.com/storminfo/) -> speedDail
* [colostate](http://rammb.cira.colostate.edu/products/tc_realtime/) -> speedDail
* [WISC](http://tropic.ssec.wisc.edu/) -> speedDail
* [JMA](http://www.jma.go.jp/en/typh/) -> iframe
* [JTWC](http://www.metoc.navy.mil/jtwc/jtwc.html) -> speedDail
* [NRL(Blocked)](https://www.nrlmry.navy.mil/tc-bin/tc_home2.cgi) -> speedDail
* [数字台风网](http://agora.ex.nii.ac.jp/digital-typhoon/) -> speedDail

## 数值/路径

* [机构汇总](http://www.typhoon2000.ph/multi/log.php) -> speedDail
* [RUC模式集合预报](https://ruc.noaa.gov/hfip/tceps/) -> speedDail
* [tropicaltidbits](https://www.tropicaltidbits.com/analysis/models/) -> speedDail
* [EMC气旋追踪](http://www.emc.ncep.noaa.gov/gmb/tpm/emchurr/tcgen/) -> speedDail
* [12121](http://www.gd12121.com:8080/special/typhoonpattern/page/typhoonpattern.asp) -> speedDail

## 报文

[SSD机构报文集合](http://www.ssd.noaa.gov/PS/TROP/bulletins.html) -> speedDail

[SSD 机构ADT分析集合](http://www.ssd.noaa.gov/PS/TROP/adt.html) -> speedDail

[WISC ADT分析](http://tropic.ssec.wisc.edu/real-time/adt/adt.html) -> speedDail

[北京报文](http://www.nmc.cn/publish/typhoon/message.html) -> speedDail

[信息中心北京报文](http://10.148.8.228/to_pros_typonmessage.action?name=bjtfdwb) -> speedDail

[unisys报文合集](http://www.weather.unisys.com/hurricane/archive/18040206) -> 根据系统时间动态生成链接

## 卫星

[WISC BD色阶](http://tropic.ssec.wisc.edu/real-time/westpac/images/irbdgms5kml.GIF) -> image

[WISC NG色阶](http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/irngmskml.GIF) -> image

[SSD西太](http://www.ssd.noaa.gov/imagery/twpac.html) -> image-TabGroup

[col-Himawari圆盘图](http://col.st/t8E3d) -> speedDail

[col热带](http://rammb.cira.colostate.edu/ramsdis/online/himawari-8.asp) -> speedDail

[NICT葵花8即时](http://rammb.cira.colostate.edu/ramsdis/online/himawari-8.asp) -> speedDail

[JMA葵花卫星](http://www.data.jma.go.jp/mscweb/data/himawari/sat_img.php?area=se2) -> speedDail

## 相关链接

* [台湾中央气象局](https://www.cwb.gov.tw/)
* [香港天文台](http://gb.weather.gov.hk/contentc.htm)
* [澳门地球物理暨氣象局](http://www.smg.gov.mo/smg/c_index.htm)
* [菲律宾PAGASA](https://www1.pagasa.dost.gov.ph/)
* [日本气象厅-风观测](http://www.jma.go.jp/en/amedas/000.html?elementCode=1)

* [德法强度表](http://www.ssd.noaa.gov/PS/TROP/CI-chart.html)
* [氣象常用表單位換算](http://photino.cwb.gov.tw/rdcweb/lib/comput1.htm#1)
* [计量单位换算](http://photino.cwb.gov.tw/rdcweb/lib/comput2.htm)
* [海平面气压订正](http://www.ab126.com/Geography/2204.html)

* [百度台风吧](https://tieba.baidu.com/f?kw=%E5%8F%B0%E9%A3%8E)
* [台风论坛](http://bbs.typhoon.org.cn/index.php?c=thread&fid=79)
