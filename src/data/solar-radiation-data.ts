/**
 * 全国各省市光伏气象日照与理论等效发电小时数据库
 * 依据国家能源局《光伏发电电价政策资源区分类标准》、国家发改委价格司与中国气象局太阳能资源评估公报真实编制
 */

export interface CitySolarData {
  id: string;
  name: string;
  annualHours: number; // 年等效利用小时数 (kWh/kWp)
  dailyHours: number;  // 日均等效日照辐射时数 (h/day)
  resourceZone: "一类资源区" | "二类资源区" | "三类资源区";
  annualRadiation: number; // 年总辐射量 MJ/m²
  monthlyWeights: number[]; // 12个月发电量占比 (加和为1.0)
  features: string;
}

export interface ProvinceSolarData {
  id: string;
  name: string;
  shortName: string;
  region: "直辖市" | "华东" | "华南" | "华北" | "华中" | "西北" | "西南" | "东北" | "港澳台";
  zone: "一类资源区" | "二类资源区" | "三类资源区";
  avgAnnualHours: number; // 年等效利用小时数 (kWh/kWp)
  dailyHours?: number;    // 省级日均等效日照时数 (h/day)
  annualRadiation?: number; // 省级年总辐射量 (MJ/m²)
  monthlyWeights?: number[]; // 12个月发电量占比
  features?: string;      // 省级光照气象与消纳特征
  defaultCityId: string;
  cities: CitySolarData[];
}

// 典型月度日照分布模版 (加和约为 1.0)
// 北方典型 (冬弱夏强，6-7月峰值)
const NORTH_WEIGHTS = [0.058, 0.068, 0.088, 0.104, 0.116, 0.118, 0.112, 0.098, 0.088, 0.068, 0.048, 0.036];
// 南方典型 (春雨梅雨期6月略抑，7-9月伏旱高光照)
const SOUTH_WEIGHTS = [0.062, 0.064, 0.076, 0.088, 0.096, 0.092, 0.114, 0.116, 0.102, 0.082, 0.060, 0.048];
// 西北与高原典型 (全年晴空日数多，季节波动较小)
const PLATEAU_WEIGHTS = [0.070, 0.076, 0.086, 0.094, 0.098, 0.096, 0.092, 0.090, 0.086, 0.080, 0.068, 0.064];
// 西南盆地典型 (冬春多阴雨雾气，夏秋稍高)
const SICHUAN_WEIGHTS = [0.048, 0.056, 0.078, 0.096, 0.108, 0.110, 0.116, 0.112, 0.088, 0.072, 0.062, 0.054];

export const CHINA_SOLAR_PROVINCES: ProvinceSolarData[] = [
  // --- 直辖市 ---
  {
    id: "beijing",
    name: "北京市",
    shortName: "北京",
    region: "直辖市",
    zone: "二类资源区",
    avgAnnualHours: 1320,
    defaultCityId: "beijing-city",
    cities: [
      { id: "beijing-city", name: "北京(市区)", annualHours: 1320, dailyHours: 3.62, resourceZone: "二类资源区", annualRadiation: 5120, monthlyWeights: NORTH_WEIGHTS, features: "暖温带半湿润大陆性季风气候，春秋光照纯净，组件积灰适中" },
      { id: "beijing-miyun", name: "密云/延庆", annualHours: 1380, dailyHours: 3.78, resourceZone: "二类资源区", annualRadiation: 5350, monthlyWeights: NORTH_WEIGHTS, features: "北部山区海拔较高、空气能见度高，日照辐射显著优于主城区" }
    ]
  },
  {
    id: "shanghai",
    name: "上海市",
    shortName: "上海",
    region: "直辖市",
    zone: "三类资源区",
    avgAnnualHours: 1120,
    defaultCityId: "shanghai-pudong",
    cities: [
      { id: "shanghai-pudong", name: "浦东新区", annualHours: 1130, dailyHours: 3.10, resourceZone: "三类资源区", annualRadiation: 4450, monthlyWeights: SOUTH_WEIGHTS, features: "临海开阔，海风带走积温降温增效，夏秋季日照丰沛" },
      { id: "shanghai-city", name: "上海(主城区)", annualHours: 1100, dailyHours: 3.01, resourceZone: "三类资源区", annualRadiation: 4380, monthlyWeights: SOUTH_WEIGHTS, features: "城市热岛效应明显，梅雨季需关注组件排涝及逆变器除湿" },
      { id: "shanghai-chongming", name: "崇明区", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4560, monthlyWeights: SOUTH_WEIGHTS, features: "海岛光照无高楼遮挡，生态湿地绿电环境良好" }
    ]
  },
  {
    id: "tianjin",
    name: "天津市",
    shortName: "天津",
    region: "直辖市",
    zone: "二类资源区",
    avgAnnualHours: 1300,
    defaultCityId: "tianjin-binhai",
    cities: [
      { id: "tianjin-binhai", name: "滨海新区", annualHours: 1320, dailyHours: 3.62, resourceZone: "二类资源区", annualRadiation: 5180, monthlyWeights: NORTH_WEIGHTS, features: "沿海港口滩涂光伏条件优渥，晴空日照时长充足" },
      { id: "tianjin-city", name: "天津(市区)", annualHours: 1290, dailyHours: 3.53, resourceZone: "二类资源区", annualRadiation: 5050, monthlyWeights: NORTH_WEIGHTS, features: "暖温带半湿润大陆性季风，夏季光伏大发期与工业用电峰值重叠" }
    ]
  },
  {
    id: "chongqing",
    name: "重庆市",
    shortName: "重庆",
    region: "直辖市",
    zone: "三类资源区",
    avgAnnualHours: 880,
    defaultCityId: "chongqing-city",
    cities: [
      { id: "chongqing-city", name: "主城区(渝中/江北)", annualHours: 870, dailyHours: 2.38, resourceZone: "三类资源区", annualRadiation: 3480, monthlyWeights: SICHUAN_WEIGHTS, features: "典型盆地多雾地形，秋冬云雾蔽日，推荐大倾角及弱光响应组件" },
      { id: "chongqing-wanzhou", name: "万州区", annualHours: 920, dailyHours: 2.52, resourceZone: "三类资源区", annualRadiation: 3680, monthlyWeights: SICHUAN_WEIGHTS, features: "三峡库区日照稍优于主城，峡谷开阔地段晴日较多" },
      { id: "chongqing-fuling", name: "涪陵/武隆", annualHours: 900, dailyHours: 2.47, resourceZone: "三类资源区", annualRadiation: 3590, monthlyWeights: SICHUAN_WEIGHTS, features: "山地微气候显著，宜避开迎风多雨迎雾山脊阴面" }
    ]
  },

  // --- 华东地区 ---
  {
    id: "jiangsu",
    name: "江苏省",
    shortName: "江苏",
    region: "华东",
    zone: "三类资源区",
    avgAnnualHours: 1150,
    defaultCityId: "suzhou",
    cities: [
      { id: "suzhou", name: "苏州市", annualHours: 1130, dailyHours: 3.10, resourceZone: "三类资源区", annualRadiation: 4420, monthlyWeights: SOUTH_WEIGHTS, features: "高端智造重镇，工业屋顶载荷优良，自发自用比例极高" },
      { id: "nanjing", name: "南京市", annualHours: 1150, dailyHours: 3.15, resourceZone: "三类资源区", annualRadiation: 4480, monthlyWeights: SOUTH_WEIGHTS, features: "沿江平原地形，夏热期长，午间光伏消纳与空调峰值高度重合" },
      { id: "wuxi", name: "无锡市", annualHours: 1135, dailyHours: 3.11, resourceZone: "三类资源区", annualRadiation: 4430, monthlyWeights: SOUTH_WEIGHTS, features: "光伏产业核心制造基地，并网消纳体系成熟" },
      { id: "changzhou", name: "常州市", annualHours: 1140, dailyHours: 3.12, resourceZone: "三类资源区", annualRadiation: 4450, monthlyWeights: SOUTH_WEIGHTS, features: "新能源之都，分布式光储一体化落地政策支持力度大" },
      { id: "nantong", name: "南通市", annualHours: 1180, dailyHours: 3.23, resourceZone: "三类资源区", annualRadiation: 4620, monthlyWeights: SOUTH_WEIGHTS, features: "沿江沿海风光资源兼备，海滨平原晴好天气较多" },
      { id: "xuzhou", name: "徐州市", annualHours: 1220, dailyHours: 3.34, resourceZone: "三类资源区", annualRadiation: 4780, monthlyWeights: NORTH_WEIGHTS, features: "苏北淮海经济区，日照条件全省居前，接近二类区下限" },
      { id: "yancheng", name: "盐城市", annualHours: 1200, dailyHours: 3.29, resourceZone: "三类资源区", annualRadiation: 4700, monthlyWeights: SOUTH_WEIGHTS, features: "黄海湿地滩涂与百万千瓦级渔光互补核心基地" },
      { id: "yangzhou", name: "扬州市", annualHours: 1145, dailyHours: 3.14, resourceZone: "三类资源区", annualRadiation: 4460, monthlyWeights: SOUTH_WEIGHTS, features: "江淮平原温和光照，组件运行温和积热低" },
      { id: "taizhou", name: "泰州市", annualHours: 1140, dailyHours: 3.12, resourceZone: "三类资源区", annualRadiation: 4450, monthlyWeights: SOUTH_WEIGHTS, features: "泰州医药城与装备产业园工商业绿电需求旺盛" },
      { id: "lianyungang", name: "连云港市", annualHours: 1210, dailyHours: 3.32, resourceZone: "三类资源区", annualRadiation: 4750, monthlyWeights: NORTH_WEIGHTS, features: "苏北海港城市，晴空率高，海边盐雾需做防腐配置" },
      { id: "huaian", name: "淮安市", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4520, monthlyWeights: NORTH_WEIGHTS, features: "苏北平原地势平坦，无高大建筑遮蔽" },
      { id: "suqian", name: "宿迁市", annualHours: 1170, dailyHours: 3.21, resourceZone: "三类资源区", annualRadiation: 4560, monthlyWeights: NORTH_WEIGHTS, features: "光伏硅片电池制造基地，屋顶利用率极高" },
      { id: "zhenjiang", name: "镇江市", annualHours: 1135, dailyHours: 3.11, resourceZone: "三类资源区", annualRadiation: 4430, monthlyWeights: SOUTH_WEIGHTS, features: "低碳试点标杆城市，工业园区屋顶绿电渗透率领先" }
    ]
  },
  {
    id: "zhejiang",
    name: "浙江省",
    shortName: "浙江",
    region: "华东",
    zone: "三类资源区",
    avgAnnualHours: 1110,
    defaultCityId: "hangzhou",
    cities: [
      { id: "hangzhou", name: "杭州市", annualHours: 1100, dailyHours: 3.01, resourceZone: "三类资源区", annualRadiation: 4320, monthlyWeights: SOUTH_WEIGHTS, features: "夏秋季光照强劲，峰谷电价差大，工商业自用ROI极高" },
      { id: "ningbo", name: "宁波市", annualHours: 1120, dailyHours: 3.07, resourceZone: "三类资源区", annualRadiation: 4400, monthlyWeights: SOUTH_WEIGHTS, features: "单项冠军制造之都，厂房屋顶面积大，海风降温增效" },
      { id: "wenzhou", name: "温州市", annualHours: 1130, dailyHours: 3.10, resourceZone: "三类资源区", annualRadiation: 4450, monthlyWeights: SOUTH_WEIGHTS, features: "浙南低纬度光照丰富，夏秋季需做好防抗超强台风设计" },
      { id: "jiaxing", name: "嘉兴市", annualHours: 1125, dailyHours: 3.08, resourceZone: "三类资源区", annualRadiation: 4420, monthlyWeights: SOUTH_WEIGHTS, features: "秀洲全国光伏高新区，分布式光伏示范城市" },
      { id: "huzhou", name: "湖州市", annualHours: 1115, dailyHours: 3.05, resourceZone: "三类资源区", annualRadiation: 4380, monthlyWeights: SOUTH_WEIGHTS, features: "两山理念发源地，绿色电力交易与绿证核发活跃" },
      { id: "shaoxing", name: "绍兴市", annualHours: 1110, dailyHours: 3.04, resourceZone: "三类资源区", annualRadiation: 4360, monthlyWeights: SOUTH_WEIGHTS, features: "纺织印染高耗能企业云集，消纳绿电降碳诉求迫切" },
      { id: "jinhua", name: "金华市", annualHours: 1090, dailyHours: 2.99, resourceZone: "三类资源区", annualRadiation: 4290, monthlyWeights: SOUTH_WEIGHTS, features: "浙中盆地气候，夏伏日照高，雨季注意排水" },
      { id: "taizhou-zj", name: "台州市", annualHours: 1120, dailyHours: 3.07, resourceZone: "三类资源区", annualRadiation: 4410, monthlyWeights: SOUTH_WEIGHTS, features: "民营制造重镇，沿海光伏支架需加强热镀锌抗腐蚀" },
      { id: "quzhou", name: "衢州市", annualHours: 1070, dailyHours: 2.93, resourceZone: "三类资源区", annualRadiation: 4210, monthlyWeights: SOUTH_WEIGHTS, features: "浙西山区晴雨转换频繁，适宜朝南最佳坡度倾角布置" },
      { id: "zhoushan", name: "舟山市", annualHours: 1150, dailyHours: 3.15, resourceZone: "三类资源区", annualRadiation: 4520, monthlyWeights: SOUTH_WEIGHTS, features: "海岛四面开阔无尘，日照反射与海风散热优异" }
    ]
  },
  {
    id: "shandong",
    name: "山东省",
    shortName: "山东",
    region: "华东",
    zone: "二类资源区",
    avgAnnualHours: 1300,
    defaultCityId: "jinan",
    cities: [
      { id: "jinan", name: "济南市", annualHours: 1280, dailyHours: 3.51, resourceZone: "二类资源区", annualRadiation: 5040, monthlyWeights: NORTH_WEIGHTS, features: "全国光伏第一大省，光伏并网容量大，工商业绿电收益高" },
      { id: "qingdao", name: "青岛市", annualHours: 1320, dailyHours: 3.62, resourceZone: "二类资源区", annualRadiation: 5200, monthlyWeights: NORTH_WEIGHTS, features: "海洋性季风调节，夏无酷暑有利光伏组件逆温效率" },
      { id: "yantai", name: "烟台市", annualHours: 1360, dailyHours: 3.73, resourceZone: "二类资源区", annualRadiation: 5350, monthlyWeights: NORTH_WEIGHTS, features: "胶东半岛三面临海，日照年辐射量居华东沿海前茅" },
      { id: "weifang", name: "潍坊市", annualHours: 1310, dailyHours: 3.59, resourceZone: "二类资源区", annualRadiation: 5160, monthlyWeights: NORTH_WEIGHTS, features: "平原开阔，传统重工与高端农光互补示范广布" },
      { id: "linyi", name: "临沂市", annualHours: 1260, dailyHours: 3.45, resourceZone: "二类资源区", annualRadiation: 4960, monthlyWeights: NORTH_WEIGHTS, features: "商贸物流之都，大型仓储物流园区彩钢瓦屋顶众多" },
      { id: "zibo", name: "淄博市", annualHours: 1270, dailyHours: 3.48, resourceZone: "二类资源区", annualRadiation: 5000, monthlyWeights: NORTH_WEIGHTS, features: "传统老工业基地，高耗能用电负荷平稳消纳无忧" },
      { id: "jining", name: "济宁市", annualHours: 1260, dailyHours: 3.45, resourceZone: "二类资源区", annualRadiation: 4950, monthlyWeights: NORTH_WEIGHTS, features: "鲁西南采煤沉陷区水面漂浮光伏与农光示范标杆" }
    ]
  },
  {
    id: "anhui",
    name: "安徽省",
    shortName: "安徽",
    region: "华东",
    zone: "三类资源区",
    avgAnnualHours: 1140,
    defaultCityId: "hefei",
    cities: [
      { id: "hefei", name: "合肥市", annualHours: 1130, dailyHours: 3.10, resourceZone: "三类资源区", annualRadiation: 4450, monthlyWeights: SOUTH_WEIGHTS, features: "逆变器与组件制造名城，阳光电源等总部所在地，并网标准严谨" },
      { id: "wuhu", name: "芜湖市", annualHours: 1120, dailyHours: 3.07, resourceZone: "三类资源区", annualRadiation: 4410, monthlyWeights: SOUTH_WEIGHTS, features: "沿江汽车产业链聚集，汽车零部件厂房大跨度屋顶丰富" },
      { id: "bengbu", name: "蚌埠市", annualHours: 1180, dailyHours: 3.23, resourceZone: "三类资源区", annualRadiation: 4650, monthlyWeights: NORTH_WEIGHTS, features: "淮河两岸平原，硅基新材料产业集聚，日照良好" },
      { id: "chuzhou", name: "滁州市", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4560, monthlyWeights: SOUTH_WEIGHTS, features: "世界光伏之都，全球光伏光伏玻璃产能超四成聚集于此" },
      { id: "suzhou-ah", name: "宿州市", annualHours: 1210, dailyHours: 3.32, resourceZone: "三类资源区", annualRadiation: 4760, monthlyWeights: NORTH_WEIGHTS, features: "皖北平原光照充沛，接近二类资源区水平" }
    ]
  },
  {
    id: "fujian",
    name: "福建省",
    shortName: "福建",
    region: "华东",
    zone: "三类资源区",
    avgAnnualHours: 1180,
    defaultCityId: "fuzhou",
    cities: [
      { id: "fuzhou", name: "福州市", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4570, monthlyWeights: SOUTH_WEIGHTS, features: "沿海温和湿润，夏热期长，午后阵雨后日照迅速恢复" },
      { id: "xiamen", name: "厦门市", annualHours: 1240, dailyHours: 3.40, resourceZone: "三类资源区", annualRadiation: 4880, monthlyWeights: SOUTH_WEIGHTS, features: "闽南沿海开阔晴朗，年辐射强度位居全省第一，海风降温" },
      { id: "quanzhou", name: "泉州市", annualHours: 1220, dailyHours: 3.34, resourceZone: "三类资源区", annualRadiation: 4800, monthlyWeights: SOUTH_WEIGHTS, features: "民营轻工鞋服外贸重镇，全天工商业电量消纳极佳" },
      { id: "zhangzhou", name: "漳州市", annualHours: 1230, dailyHours: 3.37, resourceZone: "三类资源区", annualRadiation: 4850, monthlyWeights: SOUTH_WEIGHTS, features: "闽南金三角光热充足，适合平铺及微倾角设计" },
      { id: "ningde", name: "宁德市", annualHours: 1150, dailyHours: 3.15, resourceZone: "三类资源区", annualRadiation: 4520, monthlyWeights: SOUTH_WEIGHTS, features: "锂电新能源制造之都，厂房储能与光伏协同需求强烈" }
    ]
  },
  {
    id: "jiangxi",
    name: "江西省",
    shortName: "江西",
    region: "华东",
    zone: "三类资源区",
    avgAnnualHours: 1080,
    defaultCityId: "nanchang",
    cities: [
      { id: "nanchang", name: "南昌市", annualHours: 1090, dailyHours: 2.99, resourceZone: "三类资源区", annualRadiation: 4290, monthlyWeights: SOUTH_WEIGHTS, features: "鄱阳湖平原火炉夏季光伏产能暴增，伏旱晴天持久" },
      { id: "ganzhou", name: "赣州市", annualHours: 1120, dailyHours: 3.07, resourceZone: "三类资源区", annualRadiation: 4410, monthlyWeights: SOUTH_WEIGHTS, features: "赣南丘陵盆地，纬度更低，冬日太阳高度角适中" },
      { id: "jiujiang", name: "九江市", annualHours: 1110, dailyHours: 3.04, resourceZone: "三类资源区", annualRadiation: 4370, monthlyWeights: SOUTH_WEIGHTS, features: "临长江控鄱阳，开阔水域反光增益明显" },
      { id: "shangrao", name: "上饶市", annualHours: 1060, dailyHours: 2.90, resourceZone: "三类资源区", annualRadiation: 4180, monthlyWeights: SOUTH_WEIGHTS, features: "晶科能源发祥地，组件应用与运维技术积淀深厚" }
    ]
  },

  // --- 华南地区 ---
  {
    id: "guangdong",
    name: "广东省",
    shortName: "广东",
    region: "华南",
    zone: "三类资源区",
    avgAnnualHours: 1180,
    defaultCityId: "guangzhou",
    cities: [
      { id: "guangzhou", name: "广州市", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4570, monthlyWeights: SOUTH_WEIGHTS, features: "大湾区核心枢纽，夏长冬暖，工业空调峰值与光伏发电无缝契合" },
      { id: "shenzhen", name: "深圳市", annualHours: 1180, dailyHours: 3.23, resourceZone: "三类资源区", annualRadiation: 4650, monthlyWeights: SOUTH_WEIGHTS, features: "高科技园区密集，屋顶空间珍贵，优先选用高功率N型高效组件" },
      { id: "foshan", name: "佛山市", annualHours: 1150, dailyHours: 3.15, resourceZone: "三类资源区", annualRadiation: 4530, monthlyWeights: SOUTH_WEIGHTS, features: "传统制造与家电之都，工业屋顶载荷大，消纳稳定" },
      { id: "dongguan", name: "东莞市", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4570, monthlyWeights: SOUTH_WEIGHTS, features: "世界工厂，厂房屋顶成片连通，分布式投资回报周期短" },
      { id: "huizhou", name: "惠州市", annualHours: 1170, dailyHours: 3.21, resourceZone: "三类资源区", annualRadiation: 4610, monthlyWeights: SOUTH_WEIGHTS, features: "大亚湾石化及仲恺高新，海风调节下日照稳定性好" },
      { id: "zhongshan", name: "中山市", annualHours: 1170, dailyHours: 3.21, resourceZone: "三类资源区", annualRadiation: 4600, monthlyWeights: SOUTH_WEIGHTS, features: "珠江西岸制造重镇，光热条件好，注意夏季台风锚固" },
      { id: "zhuhai", name: "珠海市", annualHours: 1190, dailyHours: 3.26, resourceZone: "三类资源区", annualRadiation: 4690, monthlyWeights: SOUTH_WEIGHTS, features: "百岛之市空气通透度佳，日照散射少，直射光比例高" },
      { id: "zhanjiang", name: "湛江市", annualHours: 1260, dailyHours: 3.45, resourceZone: "三类资源区", annualRadiation: 4960, monthlyWeights: SOUTH_WEIGHTS, features: "雷州半岛全省光照之冠，低纬度太阳入射角近乎垂直" },
      { id: "shantou", name: "汕头市", annualHours: 1220, dailyHours: 3.34, resourceZone: "三类资源区", annualRadiation: 4810, monthlyWeights: SOUTH_WEIGHTS, features: "潮汕沿海光照充沛，夏季光热强劲，注意遮阴通风" }
    ]
  },
  {
    id: "guangxi",
    name: "广西壮族自治区",
    shortName: "广西",
    region: "华南",
    zone: "三类资源区",
    avgAnnualHours: 1120,
    defaultCityId: "nanning",
    cities: [
      { id: "nanning", name: "南宁市", annualHours: 1120, dailyHours: 3.07, resourceZone: "三类资源区", annualRadiation: 4420, monthlyWeights: SOUTH_WEIGHTS, features: "亚热带季风，年平均气温高，冬春季早晨多晨雾后迅速放晴" },
      { id: "beihai", name: "北海市", annualHours: 1230, dailyHours: 3.37, resourceZone: "三类资源区", annualRadiation: 4850, monthlyWeights: SOUTH_WEIGHTS, features: "北部湾明珠，海滨晴天多，全年光伏发电等效小时数居自治区之首" },
      { id: "liuzhou", name: "柳州市", annualHours: 1040, dailyHours: 2.85, resourceZone: "三类资源区", annualRadiation: 4100, monthlyWeights: SOUTH_WEIGHTS, features: "重工业重镇，汽车钢铁用电负荷极度稳定，自发自用率极高" },
      { id: "guilin", name: "桂林市", annualHours: 1030, dailyHours: 2.82, resourceZone: "三类资源区", annualRadiation: 4060, monthlyWeights: SOUTH_WEIGHTS, features: "喀斯特地貌常年多雨多云，春秋季节弱光响应设计尤为关键" }
    ]
  },
  {
    id: "hainan",
    name: "海南省",
    shortName: "海南",
    region: "华南",
    zone: "二类资源区",
    avgAnnualHours: 1380,
    defaultCityId: "haikou",
    cities: [
      { id: "haikou", name: "海口市", annualHours: 1320, dailyHours: 3.62, resourceZone: "二类资源区", annualRadiation: 5210, monthlyWeights: SOUTH_WEIGHTS, features: "低纬度热带气候，全年太阳高度角大，日照持续期长" },
      { id: "sanya", name: "三亚市", annualHours: 1450, dailyHours: 3.97, resourceZone: "二类资源区", annualRadiation: 5720, monthlyWeights: SOUTH_WEIGHTS, features: "中国热带滨海光照最充足地区之一，极适合建筑光伏一体化BIPV" },
      { id: "dongfang", name: "东方市", annualHours: 1420, dailyHours: 3.89, resourceZone: "二类资源区", annualRadiation: 5600, monthlyWeights: SOUTH_WEIGHTS, features: "海南西南部干燥少雨，晴空率全岛最高" }
    ]
  },

  // --- 华北地区 ---
  {
    id: "hebei",
    name: "河北省",
    shortName: "河北",
    region: "华北",
    zone: "二类资源区",
    avgAnnualHours: 1360,
    defaultCityId: "shijiazhuang",
    cities: [
      { id: "shijiazhuang", name: "石家庄市", annualHours: 1320, dailyHours: 3.62, resourceZone: "二类资源区", annualRadiation: 5200, monthlyWeights: NORTH_WEIGHTS, features: "太行山东麓平原，光伏利用小时数达二类标杆，企业减碳刚需" },
      { id: "zhangjiakou", name: "张家口市", annualHours: 1520, dailyHours: 4.16, resourceZone: "一类资源区", annualRadiation: 6000, monthlyWeights: NORTH_WEIGHTS, features: "国家级可再生能源示范区，坝上高原光照极其优越，达到一类水平" },
      { id: "chengde", name: "承德市", annualHours: 1440, dailyHours: 3.95, resourceZone: "二类资源区", annualRadiation: 5680, monthlyWeights: NORTH_WEIGHTS, features: "燕山山脉日照充足，冬季晴朗无雾霾遮光" },
      { id: "tangshan", name: "唐山市", annualHours: 1330, dailyHours: 3.64, resourceZone: "二类资源区", annualRadiation: 5240, monthlyWeights: NORTH_WEIGHTS, features: "沿海港口重工业集中，钢结构大型厂房屋顶资源极其丰富" },
      { id: "baoding", name: "保定市", annualHours: 1310, dailyHours: 3.59, resourceZone: "二类资源区", annualRadiation: 5160, monthlyWeights: NORTH_WEIGHTS, features: "中国电谷，老牌光伏名城，全产业链配套完备" }
    ]
  },
  {
    id: "shanxi",
    name: "山西省",
    shortName: "山西",
    region: "华北",
    zone: "二类资源区",
    avgAnnualHours: 1380,
    defaultCityId: "taiyuan",
    cities: [
      { id: "taiyuan", name: "太原市", annualHours: 1350, dailyHours: 3.70, resourceZone: "二类资源区", annualRadiation: 5320, monthlyWeights: NORTH_WEIGHTS, features: "高原盆地干燥晴朗，年日照充足，传统煤电转型绿色微电网先锋" },
      { id: "datong", name: "大同市", annualHours: 1480, dailyHours: 4.05, resourceZone: "二类资源区", annualRadiation: 5840, monthlyWeights: NORTH_WEIGHTS, features: "采煤沉陷区领跑者基地，高海拔低温干燥，组件逆温运行效率极高" },
      { id: "shuozhou", name: "朔州市", annualHours: 1450, dailyHours: 3.97, resourceZone: "二类资源区", annualRadiation: 5720, monthlyWeights: NORTH_WEIGHTS, features: "晋北高原强光照带，年利用小时常年保持高位" },
      { id: "yuncheng", name: "运城市", annualHours: 1280, dailyHours: 3.51, resourceZone: "二类资源区", annualRadiation: 5040, monthlyWeights: NORTH_WEIGHTS, features: "晋南黄河阶地，夏秋日照丰沛，农光工商业协同度高" }
    ]
  },
  {
    id: "neimenggu",
    name: "内蒙古自治区",
    shortName: "内蒙古",
    region: "华北",
    zone: "一类资源区",
    avgAnnualHours: 1560,
    defaultCityId: "huhehaote",
    cities: [
      { id: "huhehaote", name: "呼和浩特市", annualHours: 1540, dailyHours: 4.22, resourceZone: "一类资源区", annualRadiation: 6080, monthlyWeights: NORTH_WEIGHTS, features: "一类资源黄金带，晴空万里日照长，光伏投资IRR领跑全国" },
      { id: "baotou", name: "包头市", annualHours: 1560, dailyHours: 4.27, resourceZone: "一类资源区", annualRadiation: 6150, monthlyWeights: NORTH_WEIGHTS, features: "世界绿色硅都，光伏上游材料与终端电站同频共振" },
      { id: "eerduosi", name: "鄂尔多斯市", annualHours: 1600, dailyHours: 4.38, resourceZone: "一类资源区", annualRadiation: 6310, monthlyWeights: NORTH_WEIGHTS, features: "库布齐沙漠大基地，沙戈荒光伏治沙标杆，年等效超1600h" },
      { id: "bayannaoer", name: "巴彦淖尔市", annualHours: 1620, dailyHours: 4.44, resourceZone: "一类资源区", annualRadiation: 6390, monthlyWeights: NORTH_WEIGHTS, features: "河套平原日照极为充沛，几乎全年中无阴云阻滞" },
      { id: "chifeng", name: "赤峰市", annualHours: 1460, dailyHours: 4.00, resourceZone: "二类资源区", annualRadiation: 5760, monthlyWeights: NORTH_WEIGHTS, features: "蒙东高原向平原过渡带，光伏资源良好" },
      { id: "alashan", name: "阿拉善盟", annualHours: 1680, dailyHours: 4.60, resourceZone: "一类资源区", annualRadiation: 6620, monthlyWeights: NORTH_WEIGHTS, features: "巴丹吉林沙漠强辐射区，中国最高太阳能辐射带之一" }
    ]
  },

  // --- 华中地区 ---
  {
    id: "henan",
    name: "河南省",
    shortName: "河南",
    region: "华中",
    zone: "三类资源区",
    avgAnnualHours: 1190,
    defaultCityId: "zhengzhou",
    cities: [
      { id: "zhengzhou", name: "郑州市", annualHours: 1190, dailyHours: 3.26, resourceZone: "三类资源区", annualRadiation: 4690, monthlyWeights: NORTH_WEIGHTS, features: "中原枢纽，工商业与整县户用光伏大省，电网接入容量管理严谨" },
      { id: "luoyang", name: "洛阳市", annualHours: 1200, dailyHours: 3.29, resourceZone: "三类资源区", annualRadiation: 4720, monthlyWeights: NORTH_WEIGHTS, features: "豫西山地与盆地过渡，装备制造基地大跨度工业厂房多" },
      { id: "nanyang", name: "南阳市", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4570, monthlyWeights: SOUTH_WEIGHTS, features: "豫西南盆地温和湿润，全年光照平稳" },
      { id: "anyang", name: "安阳市", annualHours: 1250, dailyHours: 3.42, resourceZone: "二类资源区", annualRadiation: 4930, monthlyWeights: NORTH_WEIGHTS, features: "豫北平原光照条件好，接近二类资源区上限" }
    ]
  },
  {
    id: "hubei",
    name: "湖北省",
    shortName: "湖北",
    region: "华中",
    zone: "三类资源区",
    avgAnnualHours: 1080,
    defaultCityId: "wuhan",
    cities: [
      { id: "wuhan", name: "武汉市", annualHours: 1080, dailyHours: 2.96, resourceZone: "三类资源区", annualRadiation: 4260, monthlyWeights: SOUTH_WEIGHTS, features: "江城夏伏高温晴晒强，7-9月日照集中，光伏制冷消纳完美匹配" },
      { id: "xiangyang", name: "襄阳市", annualHours: 1180, dailyHours: 3.23, resourceZone: "三类资源区", annualRadiation: 4650, monthlyWeights: NORTH_WEIGHTS, features: "汉江流域向北开阔，湖北省内光照优选区域" },
      { id: "yichang", name: "宜昌市", annualHours: 1050, dailyHours: 2.88, resourceZone: "三类资源区", annualRadiation: 4140, monthlyWeights: SOUTH_WEIGHTS, features: "三峡清洁能源之都，水电光伏多能互补" }
    ]
  },
  {
    id: "hunan",
    name: "湖南省",
    shortName: "湖南",
    region: "华中",
    zone: "三类资源区",
    avgAnnualHours: 1020,
    defaultCityId: "changsha",
    cities: [
      { id: "changsha", name: "长沙市", annualHours: 1020, dailyHours: 2.79, resourceZone: "三类资源区", annualRadiation: 4020, monthlyWeights: SOUTH_WEIGHTS, features: "工程机械之都，厂房荷载超群，夏秋日照强烈" },
      { id: "yueyang", name: "岳阳市", annualHours: 1080, dailyHours: 2.96, resourceZone: "三类资源区", annualRadiation: 4260, monthlyWeights: SOUTH_WEIGHTS, features: "洞庭湖滨开阔水域，光热反射增益，年等效小时高于全省均值" },
      { id: "chenzhou", name: "郴州市", annualHours: 1050, dailyHours: 2.88, resourceZone: "三类资源区", annualRadiation: 4140, monthlyWeights: SOUTH_WEIGHTS, features: "南岭山脉南端，南接粤港澳大湾区，光照充裕度良好" }
    ]
  },

  // --- 西北地区 ---
  {
    id: "shanxi-sn",
    name: "陕西省",
    shortName: "陕西",
    region: "西北",
    zone: "二类资源区",
    avgAnnualHours: 1320,
    defaultCityId: "xian",
    cities: [
      { id: "xian", name: "西安市", annualHours: 1220, dailyHours: 3.34, resourceZone: "三类资源区", annualRadiation: 4800, monthlyWeights: NORTH_WEIGHTS, features: "关中平原光照平稳，隆基绿能总部所在地，单晶硅技术源头" },
      { id: "yulin", name: "榆林市", annualHours: 1540, dailyHours: 4.22, resourceZone: "一类资源区", annualRadiation: 6080, monthlyWeights: NORTH_WEIGHTS, features: "陕北毛乌素沙地边缘，属于国家一类资源极优区，年等效超1500h" },
      { id: "yanan", name: "延安市", annualHours: 1400, dailyHours: 3.84, resourceZone: "二类资源区", annualRadiation: 5520, monthlyWeights: NORTH_WEIGHTS, features: "黄土高原丘陵沟壑，晴朗日数多，山地立体光伏示范多" },
      { id: "baoji", name: "宝鸡市", annualHours: 1200, dailyHours: 3.29, resourceZone: "三类资源区", annualRadiation: 4730, monthlyWeights: NORTH_WEIGHTS, features: "关中西部秦岭北麓，工商业重镇厂房屋顶开阔" }
    ]
  },
  {
    id: "gansu",
    name: "甘肃省",
    shortName: "甘肃",
    region: "西北",
    zone: "一类资源区",
    avgAnnualHours: 1500,
    defaultCityId: "jiuquan",
    cities: [
      { id: "jiuquan", name: "酒泉/敦煌", annualHours: 1620, dailyHours: 4.44, resourceZone: "一类资源区", annualRadiation: 6400, monthlyWeights: PLATEAU_WEIGHTS, features: "河西走廊光伏航母基地，年辐射量超6400MJ/m²，光热储能互补" },
      { id: "lanzhou", name: "兰州市", annualHours: 1380, dailyHours: 3.78, resourceZone: "二类资源区", annualRadiation: 5450, monthlyWeights: NORTH_WEIGHTS, features: "黄河穿城而过的河谷城市，干燥晴日率高" },
      { id: "zhangye", name: "张掖市", annualHours: 1560, dailyHours: 4.27, resourceZone: "一类资源区", annualRadiation: 6150, monthlyWeights: PLATEAU_WEIGHTS, features: "祁连山北麓戈壁绿洲，年平均日照超3000小时" }
    ]
  },
  {
    id: "qinghai",
    name: "青海省",
    shortName: "青海",
    region: "西北",
    zone: "一类资源区",
    avgAnnualHours: 1620,
    defaultCityId: "xining",
    cities: [
      { id: "xining", name: "西宁市", annualHours: 1580, dailyHours: 4.33, resourceZone: "一类资源区", annualRadiation: 6240, monthlyWeights: PLATEAU_WEIGHTS, features: "青藏高原门户，光伏零碳工业园示范，海拔高空气透明无衰减" },
      { id: "haixi", name: "海西州(格尔木/德令哈)", annualHours: 1680, dailyHours: 4.60, resourceZone: "一类资源区", annualRadiation: 6640, monthlyWeights: PLATEAU_WEIGHTS, features: "柴达木盆地聚宝盆，全国顶尖一类光照区，极少阴雨降水" },
      { id: "hainan-qh", name: "海南州(共和塔拉滩)", annualHours: 1640, dailyHours: 4.49, resourceZone: "一类资源区", annualRadiation: 6480, monthlyWeights: PLATEAU_WEIGHTS, features: "全球最大光伏发电园区，羊光互补生态修复标杆" }
    ]
  },
  {
    id: "ningxia",
    name: "宁夏回族自治区",
    shortName: "宁夏",
    region: "西北",
    zone: "一类资源区",
    avgAnnualHours: 1550,
    defaultCityId: "yinchuan",
    cities: [
      { id: "yinchuan", name: "银川市", annualHours: 1540, dailyHours: 4.22, resourceZone: "一类资源区", annualRadiation: 6080, monthlyWeights: PLATEAU_WEIGHTS, features: "塞上江南晴空日数占全年的80%以上，贺兰山下光伏产业链完备" },
      { id: "zhongwei", name: "中卫市", annualHours: 1580, dailyHours: 4.33, resourceZone: "一类资源区", annualRadiation: 6240, monthlyWeights: PLATEAU_WEIGHTS, features: "西部云基地核心，算力中心与沙漠绿电直供无缝结合" },
      { id: "wuzhong", name: "吴忠市", annualHours: 1530, dailyHours: 4.19, resourceZone: "一类资源区", annualRadiation: 6040, monthlyWeights: PLATEAU_WEIGHTS, features: "黄河灌区农业与光伏复合开发成效卓著" }
    ]
  },
  {
    id: "xinjiang",
    name: "新疆维吾尔自治区",
    shortName: "新疆",
    region: "西北",
    zone: "一类资源区",
    avgAnnualHours: 1530,
    defaultCityId: "hami",
    cities: [
      { id: "hami", name: "哈密市", annualHours: 1620, dailyHours: 4.44, resourceZone: "一类资源区", annualRadiation: 6400, monthlyWeights: PLATEAU_WEIGHTS, features: "疆电外送核心枢纽，戈壁日照极其强劲，一类资源核心带" },
      { id: "wulumuqi", name: "乌鲁木齐市", annualHours: 1380, dailyHours: 3.78, resourceZone: "二类资源区", annualRadiation: 5450, monthlyWeights: NORTH_WEIGHTS, features: "天山北坡经济带核心，夏季日照极长(晚间22点方日落)" },
      { id: "kashi", name: "喀什地区", annualHours: 1520, dailyHours: 4.16, resourceZone: "一类资源区", annualRadiation: 6000, monthlyWeights: PLATEAU_WEIGHTS, features: "南疆塔里木盆地西缘，干旱少雨光照充盈" },
      { id: "kelamayi", name: "克拉玛依市", annualHours: 1450, dailyHours: 3.97, resourceZone: "二类资源区", annualRadiation: 5720, monthlyWeights: NORTH_WEIGHTS, features: "准噶尔盆地油田绿电替代示范基地" }
    ]
  },

  // --- 西南地区 ---
  {
    id: "sichuan",
    name: "四川省",
    shortName: "四川",
    region: "西南",
    zone: "三类资源区",
    avgAnnualHours: 920,
    defaultCityId: "chengdu",
    cities: [
      { id: "chengdu", name: "成都市", annualHours: 890, dailyHours: 2.44, resourceZone: "三类资源区", annualRadiation: 3520, monthlyWeights: SICHUAN_WEIGHTS, features: "四川盆地阴雨多雾，冬春寡照，建议配置低辐照高效组件及跟踪支架" },
      { id: "panzhihua", name: "攀枝花市", annualHours: 1540, dailyHours: 4.22, resourceZone: "一类资源区", annualRadiation: 6080, monthlyWeights: PLATEAU_WEIGHTS, features: "南亚热带干热河谷，四川唯一一类强光区，年日照超2700小时" },
      { id: "liangshan", name: "凉山州(西昌)", annualHours: 1480, dailyHours: 4.05, resourceZone: "二类资源区", annualRadiation: 5850, monthlyWeights: PLATEAU_WEIGHTS, features: "月城安宁河谷，高原干湿分明，冬春旱季天天晴空万里" },
      { id: "mianyang", name: "绵阳市", annualHours: 920, dailyHours: 2.52, resourceZone: "三类资源区", annualRadiation: 3640, monthlyWeights: SICHUAN_WEIGHTS, features: "中国科技城，工商业园区用电集中，峰谷电价差保障投资收益" },
      { id: "yibin", name: "宜宾市", annualHours: 880, dailyHours: 2.41, resourceZone: "三类资源区", annualRadiation: 3480, monthlyWeights: SICHUAN_WEIGHTS, features: "动力电池之都，沿江平坝夏季发电集中" }
    ]
  },
  {
    id: "guizhou",
    name: "贵州省",
    shortName: "贵州",
    region: "西南",
    zone: "三类资源区",
    avgAnnualHours: 930,
    defaultCityId: "guiyang",
    cities: [
      { id: "guiyang", name: "贵阳市", annualHours: 920, dailyHours: 2.52, resourceZone: "三类资源区", annualRadiation: 3640, monthlyWeights: SICHUAN_WEIGHTS, features: "天无三日晴地形，中国大数据之都，数据中心冷电协同" },
      { id: "qianxinan", name: "黔西南州(兴义)", annualHours: 1160, dailyHours: 3.18, resourceZone: "三类资源区", annualRadiation: 4580, monthlyWeights: SOUTH_WEIGHTS, features: "滇黔桂交界低纬度阳光充沛，贵州光热条件最优区域" },
      { id: "zunyi", name: "遵义市", annualHours: 880, dailyHours: 2.41, resourceZone: "三类资源区", annualRadiation: 3480, monthlyWeights: SICHUAN_WEIGHTS, features: "大娄山脉多雾，夏季晴天光伏产出较为集中" }
    ]
  },
  {
    id: "yunnan",
    name: "云南省",
    shortName: "云南",
    region: "西南",
    zone: "二类资源区",
    avgAnnualHours: 1420,
    defaultCityId: "kunming",
    cities: [
      { id: "kunming", name: "昆明市", annualHours: 1420, dailyHours: 3.89, resourceZone: "二类资源区", annualRadiation: 5610, monthlyWeights: PLATEAU_WEIGHTS, features: "春城冬暖夏凉，低纬高原紫外辐射高，全年无酷暑积热损耗" },
      { id: "lijiang", name: "丽江市", annualHours: 1530, dailyHours: 4.19, resourceZone: "一类资源区", annualRadiation: 6040, monthlyWeights: PLATEAU_WEIGHTS, features: "滇西北高海拔澄澈高原，冬春旱季日照极好，达一类资源水平" },
      { id: "dali", name: "大理州", annualHours: 1470, dailyHours: 4.03, resourceZone: "二类资源区", annualRadiation: 5800, monthlyWeights: PLATEAU_WEIGHTS, features: "苍山洱海干热河谷带，风光储协同水光互补条件极佳" },
      { id: "qujing", name: "曲靖市", annualHours: 1360, dailyHours: 3.73, resourceZone: "二类资源区", annualRadiation: 5370, monthlyWeights: PLATEAU_WEIGHTS, features: "滇东工业名城，绿色硅光伏产业高地" }
    ]
  },
  {
    id: "xizang",
    name: "西藏自治区",
    shortName: "西藏",
    region: "西南",
    zone: "一类资源区",
    avgAnnualHours: 1780,
    defaultCityId: "lasa",
    cities: [
      { id: "lasa", name: "拉萨市", annualHours: 1780, dailyHours: 4.88, resourceZone: "一类资源区", annualRadiation: 7030, monthlyWeights: PLATEAU_WEIGHTS, features: "日光之城，全球太阳能辐射最高大都市之一，年利用小时近1800h" },
      { id: "rikaze", name: "日喀则市", annualHours: 1850, dailyHours: 5.07, resourceZone: "一类资源区", annualRadiation: 7300, monthlyWeights: PLATEAU_WEIGHTS, features: "高原晴空率超95%，空气稀薄通透，光伏单位千瓦产出位居全球第一梯队" },
      { id: "ali", name: "阿里地区", annualHours: 1900, dailyHours: 5.21, resourceZone: "一类资源区", annualRadiation: 7500, monthlyWeights: PLATEAU_WEIGHTS, features: "世界屋脊屋脊，强紫外超高辐射，微电网与储能必备" },
      { id: "linzhi", name: "林芝市", annualHours: 1480, dailyHours: 4.05, resourceZone: "二类资源区", annualRadiation: 5840, monthlyWeights: PLATEAU_WEIGHTS, features: "西藏江南雅鲁藏布江谷地，降水稍多，光照适中" }
    ]
  },

  // --- 东北地区 ---
  {
    id: "liaoning",
    name: "辽宁省",
    shortName: "辽宁",
    region: "东北",
    zone: "二类资源区",
    avgAnnualHours: 1350,
    defaultCityId: "shenyang",
    cities: [
      { id: "shenyang", name: "沈阳市", annualHours: 1340, dailyHours: 3.67, resourceZone: "二类资源区", annualRadiation: 5280, monthlyWeights: NORTH_WEIGHTS, features: "重工业基地，冬季晴冷干燥反光强，组件积雪快速滑落增益" },
      { id: "dalian", name: "大连市", annualHours: 1370, dailyHours: 3.75, resourceZone: "二类资源区", annualRadiation: 5400, monthlyWeights: NORTH_WEIGHTS, features: "黄渤海交界滨海半岛，海风清爽除积温，光伏出力优于内陆" },
      { id: "chaoyang", name: "朝阳市", annualHours: 1440, dailyHours: 3.95, resourceZone: "二类资源区", annualRadiation: 5680, monthlyWeights: NORTH_WEIGHTS, features: "辽西少雨干旱向内蒙过渡带，辽宁光照资源之首" },
      { id: "anshan", name: "鞍山市", annualHours: 1330, dailyHours: 3.64, resourceZone: "二类资源区", annualRadiation: 5240, monthlyWeights: NORTH_WEIGHTS, features: "钢铁重镇，重工业高载能工业厂房屋顶集中" }
    ]
  },
  {
    id: "jilin",
    name: "吉林省",
    shortName: "吉林",
    region: "东北",
    zone: "二类资源区",
    avgAnnualHours: 1350,
    defaultCityId: "changchun",
    cities: [
      { id: "changchun", name: "长春市", annualHours: 1320, dailyHours: 3.62, resourceZone: "二类资源区", annualRadiation: 5200, monthlyWeights: NORTH_WEIGHTS, features: "汽车工业园区开阔，春秋两季日照晴朗，光伏综合PR表现佳" },
      { id: "baicheng", name: "白城市", annualHours: 1480, dailyHours: 4.05, resourceZone: "二类资源区", annualRadiation: 5830, monthlyWeights: NORTH_WEIGHTS, features: "吉林西部千万千瓦级新能源基地，地广人稀光热风力俱佳" },
      { id: "songyuan", name: "松原市", annualHours: 1390, dailyHours: 3.81, resourceZone: "二类资源区", annualRadiation: 5480, monthlyWeights: NORTH_WEIGHTS, features: "松嫩平原南端干燥开阔，油田绿电综合利用多" }
    ]
  },
  {
    id: "heilongjiang",
    name: "黑龙江省",
    shortName: "黑龙江",
    region: "东北",
    zone: "二类资源区",
    avgAnnualHours: 1320,
    defaultCityId: "haerbin",
    cities: [
      { id: "haerbin", name: "哈尔滨市", annualHours: 1300, dailyHours: 3.56, resourceZone: "二类资源区", annualRadiation: 5120, monthlyWeights: NORTH_WEIGHTS, features: "高纬度夏季白昼长达16小时，夏季光伏大发，冬季雪面双面组件增益显著" },
      { id: "qiqihaer", name: "齐齐哈尔市", annualHours: 1390, dailyHours: 3.81, resourceZone: "二类资源区", annualRadiation: 5480, monthlyWeights: NORTH_WEIGHTS, features: "松嫩平原西部干旱少雨，晴好天气持续长" },
      { id: "daqing", name: "大庆市", annualHours: 1370, dailyHours: 3.75, resourceZone: "二类资源区", annualRadiation: 5400, monthlyWeights: NORTH_WEIGHTS, features: "油田百湖之城，水面漂浮光伏与工业绿电协同推进" }
    ]
  },

  // --- 港澳台地区 ---
  {
    id: "taiwan",
    name: "台湾省",
    shortName: "台湾",
    region: "港澳台",
    zone: "三类资源区",
    avgAnnualHours: 1220,
    defaultCityId: "tainan",
    cities: [
      { id: "tainan", name: "台南/高雄", annualHours: 1360, dailyHours: 3.73, resourceZone: "二类资源区", annualRadiation: 5360, monthlyWeights: SOUTH_WEIGHTS, features: "台湾南部热带晴朗干燥，全岛光照最充沛区域，农光渔光盛行" },
      { id: "taipei", name: "台北市", annualHours: 1080, dailyHours: 2.96, resourceZone: "三类资源区", annualRadiation: 4260, monthlyWeights: SOUTH_WEIGHTS, features: "北部盆地冬季东北季风多阴雨，夏季光热充沛" }
    ]
  },
  {
    id: "hongkong",
    name: "香港特别行政区",
    shortName: "香港",
    region: "港澳台",
    zone: "三类资源区",
    avgAnnualHours: 1180,
    defaultCityId: "hongkong-island",
    cities: [
      { id: "hongkong-island", name: "全港(港九新界)", annualHours: 1180, dailyHours: 3.23, resourceZone: "三类资源区", annualRadiation: 4650, monthlyWeights: SOUTH_WEIGHTS, features: "沿海亚热带高光照，上网电价补贴(FiT)政策优惠，屋顶BIPV价值高" }
    ]
  },
  {
    id: "macau",
    name: "澳门特别行政区",
    shortName: "澳门",
    region: "港澳台",
    zone: "三类资源区",
    avgAnnualHours: 1180,
    defaultCityId: "macau-peninsula",
    cities: [
      { id: "macau-peninsula", name: "全澳(半岛/氹仔)", annualHours: 1180, dailyHours: 3.23, resourceZone: "三类资源区", annualRadiation: 4650, monthlyWeights: SOUTH_WEIGHTS, features: "低碳海岛微型电网示范，综合光照充足" }
    ]
  }
];

/**
 * 快速查找省份与城市 (兼容原有接口)
 */
export function findProvinceAndCity(provinceId: string, cityId?: string): { province: ProvinceSolarData; city: CitySolarData } {
  const province = CHINA_SOLAR_PROVINCES.find(p => p.id === provinceId) || CHINA_SOLAR_PROVINCES[0];
  const targetCityId = cityId || province.defaultCityId;
  const city = province.cities.find(c => c.id === targetCityId) || province.cities[0];
  return { province, city };
}

/**
 * 获取省级气象与理论发电基准档案 (省级标准化数据)
 */
export function getProvinceSolarProfile(provinceId: string): {
  id: string;
  name: string;
  shortName: string;
  region: ProvinceSolarData["region"];
  zone: ProvinceSolarData["zone"];
  annualHours: number;      // 年等效利用小时数 (kWh/kWp)
  dailyHours: number;       // 省级日均等效辐射小时 (h/天)
  annualRadiation: number;  // 年总辐射量 (MJ/m²)
  monthlyWeights: number[]; // 12个月发电量占比
  features: string;         // 气候与光伏运维特征
  citiesCount: number;      // 所属重点采样城市/地级市数
} {
  const province = CHINA_SOLAR_PROVINCES.find(p => p.id === provinceId) || CHINA_SOLAR_PROVINCES[0];
  const defCity = province.cities.find(c => c.id === province.defaultCityId) || province.cities[0];
  
  const annualHours = province.avgAnnualHours || defCity?.annualHours || 1150;
  const dailyHours = Number((annualHours / 365).toFixed(2));
  const annualRadiation = province.annualRadiation || defCity?.annualRadiation || Math.round(annualHours * 3.9);
  const monthlyWeights = province.monthlyWeights || defCity?.monthlyWeights || [0.06, 0.07, 0.08, 0.09, 0.10, 0.10, 0.11, 0.11, 0.10, 0.08, 0.06, 0.05];
  const features = province.features || defCity?.features || `${province.name}地处${province.zone}，年等效利用约${annualHours}小时。`;

  return {
    id: province.id,
    name: province.name,
    shortName: province.shortName,
    region: province.region,
    zone: province.zone,
    annualHours,
    dailyHours,
    annualRadiation,
    monthlyWeights,
    features,
    citiesCount: province.cities.length
  };
}

/**
 * 热门工业光伏推荐省份快捷选择
 */
export const POPULAR_SOLAR_PROVINCES = [
  { provinceId: "jiangsu", label: "江苏", hours: 1150, zone: "三类区" },
  { provinceId: "guangdong", label: "广东", hours: 1180, zone: "三类区" },
  { provinceId: "zhejiang", label: "浙江", hours: 1110, zone: "三类区" },
  { provinceId: "shandong", label: "山东", hours: 1300, zone: "二类区" },
  { provinceId: "hebei", label: "河北", hours: 1320, zone: "二类区" },
  { provinceId: "neimenggu", label: "内蒙古", hours: 1620, zone: "一类区" },
  { provinceId: "qinghai", label: "青海", hours: 1600, zone: "一类区" },
  { provinceId: "xizang", label: "西藏", hours: 1800, zone: "一类区" }
];

/**
 * 热门工业光伏推荐城市快捷选择 (保留兼容)
 */
export const POPULAR_SOLAR_CITIES = [
  { provinceId: "jiangsu", cityId: "suzhou", label: "江苏 · 苏州", hours: 1130, zone: "三类区" },
  { provinceId: "guangdong", cityId: "guangzhou", label: "广东 · 广州", hours: 1160, zone: "三类区" },
  { provinceId: "zhejiang", cityId: "hangzhou", label: "浙江 · 杭州", hours: 1100, zone: "三类区" },
  { provinceId: "shandong", cityId: "jinan", label: "山东 · 济南", hours: 1280, zone: "二类区" },
  { provinceId: "neimenggu", cityId: "eerduosi", label: "内蒙古 · 鄂尔多斯", hours: 1600, zone: "一类区" },
  { provinceId: "qinghai", cityId: "xining", label: "青海 · 西宁", hours: 1580, zone: "一类区" },
  { provinceId: "hebei", cityId: "shijiazhuang", label: "河北 · 石家庄", hours: 1320, zone: "二类区" },
  { provinceId: "xizang", cityId: "lasa", label: "西藏 · 拉萨", hours: 1780, zone: "一类区" }
];
