# High, medium and low cloud cover

# 高云量, 中云量, 低云量

图中显示EC细网格预报的高云、中云和低云覆盖的分布情况。

These charts represent the the high-, medium- and low-level cloud cover from  HRES.

模式中的云按照以下分为3类：

* 低云(Low-level Cloud Cover): 所在气压层的气压 > 0.8 * 地面气压, 表征地表上空约0 ~ 1800m 的云量;
* 中云(Medium-level Cloud Cover): 0.45 * 地面气压 < 所在气压层的气压 < 0.8 * 地面气压, 表征地表以上约 1800m  ~ 6300m 的云量;
* 高云(High-level Cloud Cover): 所在气压层的气压 < 0.45 * 地面气压, 表征地表以上 1800m  ~ 6300m 的云量。

Model clouds are classified into three categories:

    Low-level Cloud Cover (LCC): where p > 0.8ps (p - pressure, ps - surface pressure). This approximately corresponds to 0 to 5900ft (0 to 1800m) above ground.
    Medium-level Cloud Cover (MCC): where 0.45ps < p < 0.8ps or approximately 5900ft to 20500ft (1800m to 6300m) above ground.
    High-level Cloud Cover (HCC): p<0.45ps or approximately higher than 20500ft (6300m) above ground.

图像中根据不同云的类型进行着色，着色方案依据HSL色彩模型(Hue 色相,  Saturation 饱和度,  Luminance 亮度)进行计算。图中用3种基础色相(hues)表示3个
层次的云: 低云为棕色, 中云为洋红色, 高云为青色。这三种云构成了HSL色彩空间的三个基础坐标矢量。每一层云的饱和度(Saturation)正比于对应层次的云量,
饱和度从0(无云)到1(全天空覆盖)。而图像亮度则与三个层次的云的总和有关: 在无云区表现为白色, 在三层云都覆盖的区域呈现出深灰色. 需要注意的是由于各层云之前有互相覆盖的关系，总云量并不是低云、中云、高云的简单算术和。
图上的图例显示了云在不同组合下的颜色(色相)，而下图的色彩立方给出了此配色方案更清晰的表示。

The plotting algorithm uses an HSL (Hue Saturation Luminance) colour representation for the different clouds. Three basic colours (hues) are used to represent the three cloud layers: brown for low-level clouds, magenta for medium-level clouds and cyan for high-level clouds. These three cloud layers are combined as three vectors in HSL space. The "saturation" of each layer is proportional to its cloud cover which varies from 0 (no clouds) to 1 (overcast). "Luminance" is associated with the sum of LCC, MCC and HCC: cloud-free areas appear white, and areas of the maximum cloud cover are dark grey. Note that the total cloud cover is not generally equal to the sum of LCC, MCC and HCC because of overlap. To help interpret the charts, a colour legend at the top shows relevant colours (hues) for different level combinations, whilst a more comprehensive representation of the colour scheme is given in the diagram below.

色彩立方表征了不同云覆盖情况下的色彩变化, 三维数组的每个分量分别对应着低云、中云、高云。
这种表示方法能够同时表示出不同层次的云，即使不同层次的云之前发生了互相遮盖也能进行识别区分。
想要进一步了解这种着色算法请参考《ECMWF Newsletter No. 101》

A "Rubik's cube" representation of the colour table used for the different categories of cloud cover (triplets denote cloud cover in each of the low, middle and high layers, respectively).


This display method helps with the recognition of clouds of different layers, even when they overlap. As an example, active fronts in the forecast are easily seen, as dark grey bands.

More information about the algorithm can be seen in ECMWF Newsletter No. 101