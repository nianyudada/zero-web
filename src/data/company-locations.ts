export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  status: 'running' | 'monitoring' | 'standby' | 'warning';
  statusText: string;
  version?: string; // 类似基础版、高级版、AI预测版
  bg: string;
  decorativeBg: string;
  hasDashboard?: boolean;
  metrics?: { label: string; value: string }[];
  description: string;
}

export interface CompanyLocation {
  id: string;
  name: string;
  shortName: string;
  province: string;
  city: string;
  district: string;
  address: string;
  coordinates: [number, number]; // [lng, lat] in GCJ-02 for AMap
  logoColor: string;
  industry: string;
  installedCapacity: string;
  storageCapacity: string;
  storageQuota: string;
  carbonReduction: string;
  carbonScore: string;
  contactPerson: string;
  contactPhone: string;
  services: ServiceItem[];
}

// 基础预置企业服务池
export const BASE_SERVICES: ServiceItem[] = [
  { 
    id: '1', 
    title: '智慧能管', 
    subtitle: '核心系统', 
    status: 'running', 
    statusText: '运行中', 
    version: 'AI预测版',
    bg: 'from-[#eaf5ef] to-[#dcf0e3]', 
    decorativeBg: 'bg-green-100/40',
    hasDashboard: true,
    metrics: [
      { label: '今日发电量', value: '18,450 kWh' },
      { label: '今日上网电量', value: '12,820 kWh' },
      { label: '今日下网电量', value: '3,240 kWh' },
      { label: '今日发电效率', value: '98.6%' }
    ],
    description: '全厂区水电气冷热多能流实时监测与能效AI优化'
  },
  { 
    id: '2', 
    title: '企业管理', 
    subtitle: '多维协同', 
    status: 'running', 
    statusText: '运行中', 
    version: '基础版',
    bg: 'from-[#f4eeff] to-[#ece1fa]', 
    decorativeBg: 'bg-purple-100/40',
    hasDashboard: false,
    description: '能源组织架构分配、用能定额考核与安全运维管理'
  },
  { 
    id: '3', 
    title: '智能微网', 
    subtitle: '源网荷储', 
    status: 'running', 
    statusText: '运行中', 
    version: '高级版',
    bg: 'from-[#e2f6f1] to-[#d1eee8]', 
    decorativeBg: 'bg-emerald-100/40',
    hasDashboard: true,
    metrics: [
      { label: '清洁自给率', value: '82.5%' },
      { label: '微网离网响应', value: '<20 ms' },
      { label: '微网实时负荷', value: '1,420 kW' },
      { label: '就地消纳率', value: '94.8%' }
    ],
    description: '微电网协调控制，光伏自发自用与削峰填谷策略执行'
  },
  { 
    id: '4', 
    title: '虚拟电厂', 
    subtitle: '聚合商端', 
    status: 'running', 
    statusText: '接入中', 
    version: 'AI预测版',
    bg: 'from-[#eef2fe] to-[#dfe7fc]', 
    decorativeBg: 'bg-indigo-100/40',
    hasDashboard: true,
    metrics: [
      { label: '可调负荷容量', value: '8.5 MW' },
      { label: '本月调度收益', value: '¥34,600' },
      { label: '响应达成率', value: '99.2%' },
      { label: '负荷调节速率', value: '2.1 MW/min' }
    ],
    description: '参与电网需求侧响应与调峰辅助服务市场结算'
  },
  { 
    id: '5', 
    title: '资产管理', 
    subtitle: '全生命周期', 
    status: 'running', 
    statusText: '运行中', 
    version: '基础版',
    bg: 'from-[#ebf4fa] to-[#dbebf6]', 
    decorativeBg: 'bg-blue-100/40',
    hasDashboard: false,
    metrics: [
      { label: '在线设备总数', value: '268 台' },
      { label: '设备健康度', value: '99.2%' },
      { label: '平均无故障时长', value: '3,420 h' },
      { label: '巡检异常预警', value: '0 件' }
    ],
    description: '光伏组件、逆变器、电池柜及变压器设备健康度数字台账'
  },
  { 
    id: '6', 
    title: '零碳园区', 
    subtitle: '碳资产中心', 
    status: 'running', 
    statusText: '运行中', 
    version: '高级版',
    bg: 'from-[#f1eefa] to-[#e7e1f6]', 
    decorativeBg: 'bg-indigo-100/30',
    hasDashboard: true,
    metrics: [
      { label: '综合碳减排量', value: '1,280 t' },
      { label: '清洁能源占比', value: '78.5%' },
      { label: '绿电认证比例', value: '100%' },
      { label: '万元产值能耗降幅', value: '-14.2%' }
    ],
    description: 'Scope 1/2/3温室气体核算、碳配额管理及零碳园区认证'
  },
  { 
    id: '7', 
    title: '智慧充储', 
    subtitle: '工商业储能', 
    status: 'monitoring', 
    statusText: '监测中', 
    version: 'AI预测版',
    bg: 'from-[#faefe0] to-[#f4e2cb]', 
    decorativeBg: 'bg-orange-100/40',
    hasDashboard: true,
    description: '电化学储能电站BMS/PCS状态实时监控与充放电防过充保护'
  },
  { 
    id: '8', 
    title: '绿电交易', 
    subtitle: '电力市场', 
    status: 'standby', 
    statusText: '待结算', 
    version: '高级版',
    bg: 'from-[#e2f7f1] to-[#cff0e7]', 
    decorativeBg: 'bg-emerald-100/40',
    hasDashboard: true,
    description: '跨省跨区中长期绿色电力交易撮合与绿色电力证书追踪'
  }
];

export const ALL_COMPANIES: CompanyLocation[] = [
  // 1. 江苏省
  {
    id: '1',
    name: '天合富家演示',
    shortName: '天合富家',
    province: '江苏省',
    city: '常州市',
    district: '新北区',
    address: '江苏省常州市新北区天合路2号天合光能科技园',
    coordinates: [119.973986, 31.810589],
    logoColor: 'from-amber-200 to-amber-500',
    industry: '分布式光伏与智慧能源',
    installedCapacity: '86.4 MWp',
    storageCapacity: '16.0 MW',
    storageQuota: '32.0 MWh',
    carbonReduction: '12,800 tCO₂/年',
    carbonScore: 'AAA 级绿厂',
    contactPerson: '周建明 (能源总监)',
    contactPhone: '138****6682',
    services: [
      BASE_SERVICES[0], BASE_SERVICES[1], BASE_SERVICES[2], 
      BASE_SERVICES[3], BASE_SERVICES[4], BASE_SERVICES[5], 
      BASE_SERVICES[6], BASE_SERVICES[7]
    ]
  },
  {
    id: '101',
    name: '常州绿能低碳智造基地有限公司',
    shortName: '常州绿能智造',
    province: '江苏省',
    city: '常州市',
    district: '武进区',
    address: '江苏省常州市武进国家高新区新航路18号',
    coordinates: [119.945821, 31.698745],
    logoColor: 'from-emerald-200 to-emerald-500',
    industry: '高端装备能效升级',
    installedCapacity: '42.8 MWp',
    storageCapacity: '9.0 MW',
    storageQuota: '18.5 MWh',
    carbonReduction: '6,450 tCO₂/年',
    carbonScore: 'AA+ 级',
    contactPerson: '李海峰',
    contactPhone: '139****1823',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[4], BASE_SERVICES[6]]
  },
  {
    id: '102',
    name: '苏州汇能数字能源科技创新园',
    shortName: '苏州汇能数字',
    province: '江苏省',
    city: '苏州市',
    district: '苏州工业园区',
    address: '江苏省苏州市工业园区金鸡湖大道99号纳米城',
    coordinates: [120.738291, 31.275142],
    logoColor: 'from-blue-200 to-blue-500',
    industry: '虚拟电厂与能碳算法',
    installedCapacity: '28.0 MWp',
    storageCapacity: '6.0 MW',
    storageQuota: '12.0 MWh',
    carbonReduction: '4,100 tCO₂/年',
    carbonScore: 'AAA 级示范',
    contactPerson: '陈思宇 (运营经理)',
    contactPhone: '137****9082',
    services: [BASE_SERVICES[0], BASE_SERVICES[1], BASE_SERVICES[3], BASE_SERVICES[5], BASE_SERVICES[7]]
  },

  // 2. 浙江省
  {
    id: '3',
    name: '绿能微网科技',
    shortName: '绿能微网',
    province: '浙江省',
    city: '杭州市',
    district: '滨江区',
    address: '浙江省杭州市滨江区江南大道3880号华荣时代大厦',
    coordinates: [120.210452, 30.187321],
    logoColor: 'from-emerald-200 to-emerald-500',
    industry: '源网荷储微网集成',
    installedCapacity: '65.2 MWp',
    storageCapacity: '12.5 MW',
    storageQuota: '25.0 MWh',
    carbonReduction: '9,800 tCO₂/年',
    carbonScore: 'AA+ 级',
    contactPerson: '张绍华',
    contactPhone: '136****5519',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[3], BASE_SERVICES[4], BASE_SERVICES[6]]
  },
  {
    id: '103',
    name: '杭州智云虚拟电厂聚合运营中心',
    shortName: '智云虚拟电厂',
    province: '浙江省',
    city: '杭州市',
    district: '余杭区',
    address: '浙江省杭州市余杭区文一西路未来科技城海创基地',
    coordinates: [119.998451, 30.278912],
    logoColor: 'from-indigo-200 to-indigo-500',
    industry: '负荷聚合与微电网',
    installedCapacity: '35.0 MWp',
    storageCapacity: '7.5 MW',
    storageQuota: '15.0 MWh',
    carbonReduction: '5,200 tCO₂/年',
    carbonScore: 'AA 级',
    contactPerson: '王若琳',
    contactPhone: '158****2291',
    services: [BASE_SERVICES[0], BASE_SERVICES[3], BASE_SERVICES[5], BASE_SERVICES[7]]
  },
  {
    id: '104',
    name: '宁波港区智慧绿色充储示范站',
    shortName: '宁波港绿充站',
    province: '浙江省',
    city: '宁波市',
    district: '鄞州区',
    address: '浙江省宁波市鄞州区海晏北路港航大厦',
    coordinates: [121.625891, 29.864123],
    logoColor: 'from-cyan-200 to-cyan-500',
    industry: '智慧港口光储充一体化',
    installedCapacity: '55.4 MWp',
    storageCapacity: '15.0 MW',
    storageQuota: '30.0 MWh',
    carbonReduction: '8,400 tCO₂/年',
    carbonScore: 'AAA 级港口示范',
    contactPerson: '赵大勇',
    contactPhone: '135****4478',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[6], BASE_SERVICES[7]]
  },

  // 3. 广东省
  {
    id: '4',
    name: '零碳园区总部',
    shortName: '零碳总部',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '广东省深圳市南山区科苑南路高新科技园中区科兴科学园',
    coordinates: [113.945281, 22.548912],
    logoColor: 'from-blue-200 to-blue-500',
    industry: '零碳顶层咨询与数字化',
    installedCapacity: '110.0 MWp',
    storageCapacity: '20.0 MW',
    storageQuota: '40.0 MWh',
    carbonReduction: '17,200 tCO₂/年',
    carbonScore: '国家级零碳三星',
    contactPerson: '林嘉豪 (首席技术官)',
    contactPhone: '139****0012',
    services: [
      BASE_SERVICES[0], BASE_SERVICES[1], BASE_SERVICES[2], 
      BASE_SERVICES[3], BASE_SERVICES[4], BASE_SERVICES[5], 
      BASE_SERVICES[6], BASE_SERVICES[7]
    ]
  },
  {
    id: '105',
    name: '深圳湾光储充放一体化超充示范站',
    shortName: '深圳湾超充站',
    province: '广东省',
    city: '深圳市',
    district: '宝安区',
    address: '广东省深圳市宝安区宝安大道海纳百川大厦',
    coordinates: [113.884123, 22.561234],
    logoColor: 'from-amber-200 to-amber-500',
    industry: '液冷极速超充网络',
    installedCapacity: '30.5 MWp',
    storageCapacity: '10.0 MW',
    storageQuota: '20.0 MWh',
    carbonReduction: '4,800 tCO₂/年',
    carbonScore: 'AAA 级绿充',
    contactPerson: '郑明翰',
    contactPhone: '131****8890',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[6]]
  },
  {
    id: '106',
    name: '广州开发区氢能多能互补综合示范区',
    shortName: '广州多能互补区',
    province: '广东省',
    city: '广州市',
    district: '黄埔区',
    address: '广东省广州市黄埔区科学城开泰大道氢能创新中心',
    coordinates: [113.456712, 23.167891],
    logoColor: 'from-teal-200 to-teal-500',
    industry: '氢光储多能流耦合',
    installedCapacity: '78.0 MWp',
    storageCapacity: '14.0 MW',
    storageQuota: '28.0 MWh',
    carbonReduction: '11,500 tCO₂/年',
    carbonScore: 'AA+ 级',
    contactPerson: '黄文彬',
    contactPhone: '133****6677',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[3], BASE_SERVICES[5], BASE_SERVICES[7]]
  },

  // 4. 内蒙古自治区
  {
    id: '2',
    name: '内蒙古阿拉善盟生态环境综合治理与光储充一体化特大零碳园区演示企业有限公司',
    shortName: '阿拉善特大零碳园区',
    province: '内蒙古自治区',
    city: '阿拉善盟',
    district: '阿拉善左旗',
    address: '内蒙古自治区阿拉善盟阿拉善左旗巴彦浩特镇腾格里沙漠生态工业园区01号',
    coordinates: [105.706421, 38.845123],
    logoColor: 'from-cyan-200 to-cyan-500',
    industry: '荒漠光伏治沙与生态修复',
    installedCapacity: '1,200.0 MWp',
    storageCapacity: '150.0 MW',
    storageQuota: '300.0 MWh',
    carbonReduction: '184,000 tCO₂/年',
    carbonScore: '国家超级标杆零碳示范',
    contactPerson: '额尔敦 (常务副总)',
    contactPhone: '139****7765',
    services: [
      BASE_SERVICES[0], BASE_SERVICES[1], BASE_SERVICES[2], 
      BASE_SERVICES[3], BASE_SERVICES[4], BASE_SERVICES[5], 
      BASE_SERVICES[6], BASE_SERVICES[7]
    ]
  },
  {
    id: '107',
    name: '额济纳荒漠光伏治沙特大电站',
    shortName: '额济纳光伏电站',
    province: '内蒙古自治区',
    city: '阿拉善盟',
    district: '额济纳旗',
    address: '内蒙古自治区阿拉善盟额济纳旗达来呼布镇戈壁光伏产业园',
    coordinates: [101.072134, 41.968745],
    logoColor: 'from-emerald-200 to-emerald-500',
    industry: '沙戈荒大型基地',
    installedCapacity: '800.0 MWp',
    storageCapacity: '80.0 MW',
    storageQuota: '160.0 MWh',
    carbonReduction: '125,000 tCO₂/年',
    carbonScore: 'AAA 级绿电基地',
    contactPerson: '巴特尔',
    contactPhone: '138****9921',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[4], BASE_SERVICES[7]]
  },

  // 5. 河北省
  {
    id: '5',
    name: '华北风力示范',
    shortName: '华北风力',
    province: '河北省',
    city: '张家口市',
    district: '桥东区',
    address: '河北省张家口市桥东区工业东街8号可再生能源示范区指挥中心',
    coordinates: [114.887654, 40.789123],
    logoColor: 'from-purple-200 to-purple-500',
    industry: '陆上风电集中监控与集控',
    installedCapacity: '350.0 MWp',
    storageCapacity: '35.0 MW',
    storageQuota: '70.0 MWh',
    carbonReduction: '54,000 tCO₂/年',
    carbonScore: 'AAA 级绿电示范',
    contactPerson: '孙德成',
    contactPhone: '136****3311',
    services: [BASE_SERVICES[0], BASE_SERVICES[1], BASE_SERVICES[3], BASE_SERVICES[4], BASE_SERVICES[5]]
  },
  {
    id: '108',
    name: '张北千万千瓦级风光互补储能综合基地',
    shortName: '张北风光储基地',
    province: '河北省',
    city: '张家口市',
    district: '康保县',
    address: '河北省张家口市康保县风电特许权园区2号变电所',
    coordinates: [114.612345, 41.854123],
    logoColor: 'from-blue-200 to-blue-500',
    industry: '风光荷储网一体化基地',
    installedCapacity: '620.0 MWp',
    storageCapacity: '60.0 MW',
    storageQuota: '120.0 MWh',
    carbonReduction: '96,000 tCO₂/年',
    carbonScore: '国家级示范基地',
    contactPerson: '吴建华',
    contactPhone: '150****8833',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[3], BASE_SERVICES[4], BASE_SERVICES[7]]
  },

  // 6. 甘肃省
  {
    id: '6',
    name: '西北光热发电',
    shortName: '西北光热',
    province: '甘肃省',
    city: '酒泉市',
    district: '肃州区',
    address: '甘肃省酒泉市肃州区富强路清洁能源装备制造产业园',
    coordinates: [98.508765, 39.743219],
    logoColor: 'from-rose-200 to-rose-500',
    industry: '熔盐储热与可调光热发电',
    installedCapacity: '150.0 MWp',
    storageCapacity: '40.0 MW',
    storageQuota: '80.0 MWh',
    carbonReduction: '23,000 tCO₂/年',
    carbonScore: 'AA+ 级清洁能源',
    contactPerson: '马振邦',
    contactPhone: '137****1122',
    services: [BASE_SERVICES[0], BASE_SERVICES[2], BASE_SERVICES[4], BASE_SERVICES[5], BASE_SERVICES[6]]
  },
  {
    id: '109',
    name: '敦煌熔盐塔式百兆瓦级光热电站',
    shortName: '敦煌塔式光热',
    province: '甘肃省',
    city: '酒泉市',
    district: '敦煌市',
    address: '甘肃省酒泉市敦煌市七里镇光电产业博览园',
    coordinates: [94.661234, 40.141234],
    logoColor: 'from-amber-200 to-amber-500',
    industry: '高倍聚光熔盐塔式光热',
    installedCapacity: '100.0 MWp',
    storageCapacity: '50.0 MW',
    storageQuota: '110.0 MWh',
    carbonReduction: '35,000 tCO₂/年',
    carbonScore: 'AAA 级绿色地标',
    contactPerson: '冯万山',
    contactPhone: '139****4455',
    services: [BASE_SERVICES[0], BASE_SERVICES[1], BASE_SERVICES[2], BASE_SERVICES[5], BASE_SERVICES[7]]
  }
];

// 辅助数值解析函数
export function parseCapacityNumber(val?: string): number {
  if (!val) return 0;
  const match = val.replace(/,/g, '').match(/[0-9]+(?:\.[0-9]+)?/);
  return match ? parseFloat(match[0]) : 0;
}

export function formatCapacityNumber(num: number, decimals: number = 1): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// 格式化企业编号规则，如 CO00057342
export function formatCompanyCode(idOrCode: string | number): string {
  const str = String(idOrCode).trim();
  // 如果已经是带字母前缀的标准编号，直接返回或标准化
  if (/^[A-Za-z]+[0-9]+$/.test(str)) {
    const prefix = str.replace(/[0-9]/g, '').toUpperCase();
    const numPart = str.replace(/[^0-9]/g, '');
    return `${prefix}${numPart.padStart(8, '0')}`;
  }
  const numericOnly = str.replace(/[^0-9]/g, '');
  if (!numericOnly) return 'CO00000001';
  // 按照8位数字补零格式化
  return `CO${numericOnly.padStart(8, '0')}`;
}

// 构建 3 级行政区划树
export interface DistrictNode {
  district: string;
  count: number;
  pvCapacity: number;       // 光伏装机合计 (MWp)
  storageCapacity: number;  // 储能装机合计 (MW)
  storageQuota: number;     // 储能配额合计 (MWh)
  companies: CompanyLocation[];
}

export interface CityNode {
  city: string;
  count: number;
  pvCapacity: number;       // 光伏装机合计 (MWp)
  storageCapacity: number;  // 储能装机合计 (MW)
  storageQuota: number;     // 储能配额合计 (MWh)
  districts: DistrictNode[];
}

export interface ProvinceNode {
  province: string;
  count: number;
  pvCapacity: number;       // 光伏装机合计 (MWp)
  storageCapacity: number;  // 储能装机合计 (MW)
  storageQuota: number;     // 储能配额合计 (MWh)
  cities: CityNode[];
}

export function buildAdministrativeTree(companies: CompanyLocation[] = ALL_COMPANIES): ProvinceNode[] {
  const provinceMap = new Map<string, Map<string, Map<string, CompanyLocation[]>>>();

  companies.forEach(company => {
    if (!provinceMap.has(company.province)) {
      provinceMap.set(company.province, new Map());
    }
    const cityMap = provinceMap.get(company.province)!;
    if (!cityMap.has(company.city)) {
      cityMap.set(company.city, new Map());
    }
    const districtMap = cityMap.get(company.city)!;
    if (!districtMap.has(company.district)) {
      districtMap.set(company.district, []);
    }
    districtMap.get(company.district)!.push(company);
  });

  const result: ProvinceNode[] = [];

  provinceMap.forEach((cityMap, province) => {
    let provTotal = 0;
    const cities: CityNode[] = [];

    cityMap.forEach((districtMap, city) => {
      let cityTotal = 0;
      const districts: DistrictNode[] = [];

      districtMap.forEach((comps, district) => {
        const dPv = comps.reduce((acc, c) => acc + parseCapacityNumber(c.installedCapacity), 0);
        const dStorage = comps.reduce((acc, c) => acc + parseCapacityNumber(c.storageCapacity), 0);
        const dQuota = comps.reduce((acc, c) => acc + parseCapacityNumber(c.storageQuota), 0);

        districts.push({
          district,
          count: comps.length,
          pvCapacity: dPv,
          storageCapacity: dStorage,
          storageQuota: dQuota,
          companies: comps
        });
        cityTotal += comps.length;
      });

      const cPv = districts.reduce((acc, d) => acc + d.pvCapacity, 0);
      const cStorage = districts.reduce((acc, d) => acc + d.storageCapacity, 0);
      const cQuota = districts.reduce((acc, d) => acc + d.storageQuota, 0);

      cities.push({
        city,
        count: cityTotal,
        pvCapacity: cPv,
        storageCapacity: cStorage,
        storageQuota: cQuota,
        districts
      });
      provTotal += cityTotal;
    });

    const pPv = cities.reduce((acc, c) => acc + c.pvCapacity, 0);
    const pStorage = cities.reduce((acc, c) => acc + c.storageCapacity, 0);
    const pQuota = cities.reduce((acc, c) => acc + c.storageQuota, 0);

    result.push({
      province,
      count: provTotal,
      pvCapacity: pPv,
      storageCapacity: pStorage,
      storageQuota: pQuota,
      cities
    });
  });

  return result;
}
