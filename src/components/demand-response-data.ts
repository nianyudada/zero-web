// Shared demand-response policy data and revenue calculation logic.
// Consumed by DemandResponseResultsPage (榜单版) and DemandResponsePanel (左右布局版).

export type CalcMode = "annual" | "single";

export interface ElecTier {
  name: string;
  price: number;
  note?: string;
}

export interface CapConfig {
  perKwMonth: number;
  label: string;
}

export interface RegionConfig {
  id: string;
  name: string;
  level: "省级" | "市级" | "区级";
  elecTiers: ElecTier[];
  capConfig?: CapConfig;
  policyValidity: string;
  policyName: string;
  condition?: string;
}

export interface RegionResult {
  region: RegionConfig;
  rank: number;
  bestTierName: string;
  bestTierPrice: number;
  electricRevenue: number;
  capacityRevenue: number;
  totalRevenue: number;
}

// ─── Region Data ──────────────────────────────────────────────────────────────

export const REGIONS: RegionConfig[] = [
  {
    id: "hunan",
    name: "湖南省",
    level: "省级",
    elecTiers: [
      { name: "需求响应", price: 10, note: "提前2h通知" },
      { name: "可中断负荷", price: 20, note: "需具备可中断负荷能力" },
    ],
    policyValidity: "—",
    policyName: "湖南电力需求响应市场运营规则（2024年版）",
    condition: "需具备可中断负荷能力",
  },
  {
    id: "jiangsu",
    name: "江苏省",
    level: "省级",
    elecTiers: [
      { name: "直控型响应", price: 15, note: "电网直控，响应最快" },
      { name: "自控型响应", price: 10, note: "自主响应" },
    ],
    policyValidity: "2026.6-2029.7",
    policyName: "关于开展负荷快速响应能力建设工作的通知",
  },
  {
    id: "lingang",
    name: "上海·临港",
    level: "区级",
    elecTiers: [
      { name: "快速响应（30min）", price: 3, note: "提前30min通知" },
      { name: "实时精准响应", price: 9, note: "不通知响应，最高速" },
    ],
    capConfig: { perKwMonth: 2.5, label: "虚拟电厂容量补贴" },
    policyValidity: "2026年",
    policyName: "临港新片区虚拟电厂建设试点方案（2025年版）",
    condition: "⚡ 最高速响应，无通知时间要求",
  },
  {
    id: "songjiang",
    name: "上海·松江",
    level: "区级",
    elecTiers: [
      { name: "日前/日内响应", price: 2, note: "提前24h通知" },
      { name: "快速响应", price: 4, note: "提前0.5-2h通知" },
      { name: "实时响应", price: 6, note: "提前<0.5h通知" },
    ],
    capConfig: { perKwMonth: 0.833, label: "虚拟电厂容量补贴" },
    policyValidity: "2026年",
    policyName: "上海市松江区虚拟电厂精准响应管理办法（试行）",
    condition: "需提前<0.5h通知（实时档次）",
  },
  {
    id: "anhui",
    name: "安徽省",
    level: "省级",
    elecTiers: [
      { name: "削峰响应", price: 3, note: "提前2h通知" },
      { name: "填谷响应", price: 1.5, note: "提前2h通知" },
    ],
    capConfig: { perKwMonth: 4, label: "旺季容量补贴" },
    policyValidity: "2025年版",
    policyName: "安徽省电力需求响应市场运营规则（2024年版）",
    condition: "旺季容量补贴4元/kW·月",
  },
  {
    id: "hebei",
    name: "河北省",
    level: "省级",
    elecTiers: [],
    capConfig: { perKwMonth: 8, label: "实时响应容量补贴" },
    policyValidity: "2024年版",
    policyName: "河北省电力需求响应市场运营规则（2024年版）",
    condition: "仅容量补贴，无电量补贴",
  },
  {
    id: "zhejiang",
    name: "浙江省",
    level: "省级",
    elecTiers: [
      { name: "早峰响应", price: 2, note: "08:00-11:00" },
      { name: "晚峰响应", price: 3, note: "18:00-21:00" },
      { name: "填谷响应", price: 4, note: "00:00-06:00" },
    ],
    capConfig: { perKwMonth: 1, label: "需求响应容量补贴" },
    policyValidity: "2025年迎峰度夏期间",
    policyName: "浙江省电力需求响应管理办法（2025年修订版）",
    condition: "A+级可享1.3倍补贴系数",
  },
  {
    id: "guangdong",
    name: "广东省",
    level: "省级",
    elecTiers: [
      {
        name: "削峰响应（年度交易中值）",
        price: 2.7,
        note: "实际0-2.7元/kWh竞价形成",
      },
    ],
    policyValidity: "2026年年度交易",
    policyName: "广东电力交易中心关于开展2026年削峰需求响应年度交易的通知",
  },
  {
    id: "guangzhou",
    name: "广东·广州",
    level: "市级",
    elecTiers: [
      { name: "有功功率响应", price: 3.5, note: "≤3.5元/kWh，自动AGC" },
    ],
    capConfig: { perKwMonth: 0.5, label: "备用容量补贴" },
    policyValidity: "2025年发布",
    policyName: "广州市电力需求侧管理实施细则（2025年版）",
    condition: "市级财政每年≤1000万奖补",
  },
  {
    id: "guizhou",
    name: "贵州省",
    level: "省级",
    elecTiers: [{ name: "邀约型削峰响应", price: 2, note: "≤2元/kWh" }],
    policyValidity: "2026年交易方案",
    policyName: "贵州省电力需求响应管理暂行办法（2024年版）",
  },
];

// ─── Calculation ──────────────────────────────────────────────────────────────

export function computeResults(
  capacity: number,
  duration: number,
  times: number,
  mode: CalcMode
): RegionResult[] {
  const raw = REGIONS.map((region) => {
    let bestElec = 0;
    let bestTierName = "—";
    let bestTierPrice = 0;

    for (const tier of region.elecTiers) {
      const rev =
        mode === "annual"
          ? (capacity * duration * tier.price * times) / 10000
          : capacity * duration * tier.price; // 元, single event
      if (rev > bestElec) {
        bestElec = rev;
        bestTierName = tier.name;
        bestTierPrice = tier.price;
      }
    }

    // Capacity subsidy is annual — not shown in single mode
    const capRev =
      mode === "annual" && region.capConfig
        ? (capacity * region.capConfig.perKwMonth * 12) / 10000
        : 0;

    return {
      region,
      rank: 0,
      bestTierName,
      bestTierPrice,
      electricRevenue: bestElec,
      capacityRevenue: capRev,
      totalRevenue: bestElec + capRev,
    };
  });

  raw.sort((a, b) => b.totalRevenue - a.totalRevenue);
  raw.forEach((r, i) => (r.rank = i + 1));
  return raw;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉", 4: "🏅" };

export const LEVEL_CLS: Record<string, string> = {
  省级: "bg-blue-50 text-blue-600 border-blue-200",
  市级: "bg-violet-50 text-violet-600 border-violet-200",
  区级: "bg-amber-50 text-amber-700 border-amber-200",
};

export function fmtAnnual(n: number) {
  return n.toFixed(1);
}

export function fmtSingle(n: number) {
  // Show in 元; if large, use 万 for readability but keep 元 as base unit label
  if (n >= 10000) return (n / 10000).toFixed(2) + "万";
  return Math.round(n).toLocaleString("zh-CN");
}

// ─── Panel v2 types (new expandable card layout) ─────────────────────────────

export type TierCalcType = "elec" | "perKwDay" | "perKwEvent" | "perKwMonth";

export interface PanelTier {
  id: string;
  name: string;
  // price range for slider; if fixed, min===max===priceDefault
  priceMin: number;
  priceMax: number;
  priceDefault: number;
  priceFixed: boolean;
  priceMultiplier: number; // effectivePrice = sliderPrice * multiplier
  priceDisplayUnit: string;
  condition: string;
  isBest: boolean;
  calcType: TierCalcType;
  capMonthPerKw?: number; // yuan/kW/month → annual cap = cap * 12 / 10000
  capLumpPerKw?: number;  // yuan/kW, one-time annual lump
  capNote?: string;
}

export interface PanelPolicy {
  id: string;
  name: string;
  docNo: string;
  url: string;
  sliderMin: number;
  sliderMax: number;
  sliderDefault: number;
  sliderFixed: boolean;
  sliderFixedNote?: string;
  tiers: PanelTier[];
}

export interface RegionPanel {
  id: string;
  name: string;
  level: "省级" | "市级" | "区级";
  policyValidity: string;
  policies: PanelPolicy[];
}

// ─── Revenue calc for panel tiers ────────────────────────────────────────────

export function calcTierRevenue(
  tier: PanelTier,
  capacity: number,
  duration: number,
  times: number,
  sliderPrice: number
): { elec: number; cap: number; total: number } {
  const basePrice = tier.priceFixed
    ? tier.priceDefault
    : Math.min(sliderPrice, tier.priceMax);
  const effPrice = basePrice * tier.priceMultiplier;

  let elec = 0;
  switch (tier.calcType) {
    case "elec":
      elec = (capacity * duration * effPrice * times) / 10000;
      break;
    case "perKwDay":
    case "perKwEvent":
      elec = (capacity * effPrice * times) / 10000;
      break;
    case "perKwMonth":
      elec = (capacity * effPrice * 12) / 10000;
      break;
  }

  const cap =
    (tier.capMonthPerKw ?? 0) * capacity * 12 / 10000 +
    (tier.capLumpPerKw ?? 0) * capacity / 10000;

  return { elec, cap, total: elec + cap };
}

// ─── Panel region data (5 regions) ───────────────────────────────────────────

export const PANEL_REGIONS: RegionPanel[] = [
  {
    id: "jiangsu",
    name: "江苏省",
    level: "省级",
    policyValidity: "2026.6.23 — 2029.7.13",
    policies: [
      {
        id: "js_p1",
        name: "关于开展负荷快速响应能力建设工作的通知",
        docNo: "苏发改规发〔2026〕1号",
        url: "http://www.jiangsu.gov.cn/art/2026/6/29/art_64797_11796105.html",
        sliderMin: 0,
        sliderMax: 15,
        sliderDefault: 15,
        sliderFixed: false,
        tiers: [
          {
            id: "js_direct",
            name: "直控型负荷快速响应",
            priceMin: 0, priceMax: 15, priceDefault: 15,
            priceFixed: false, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "电网直控，响应最快",
            isBest: true,
            calcType: "elec",
          },
          {
            id: "js_self",
            name: "自控型负荷快速响应",
            priceMin: 0, priceMax: 10, priceDefault: 10,
            priceFixed: false, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "自主响应，无需电网直控",
            isBest: false,
            calcType: "elec",
          },
        ],
      },
      {
        id: "js_p2",
        name: "江苏省电力需求响应实施细则",
        docNo: "苏发改规发〔2024〕2号",
        url: "http://www.jiangsu.gov.cn/art/2026/6/29/art_64797_11796105.html",
        sliderMin: 3, sliderMax: 4.8, sliderDefault: 4.8,
        sliderFixed: true,
        sliderFixedNote: "该政策文件为固定补贴单价",
        tiers: [
          {
            id: "js_contracted",
            name: "约定需求响应（日前通知）",
            priceMin: 3, priceMax: 3, priceDefault: 3,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "日前通知，约定响应",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "js_fast_4h",
            name: "快上快下（提前>4小时）",
            priceMin: 3.6, priceMax: 3.6, priceDefault: 3.6,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "提前4小时以上通知",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "js_fast_2_4h",
            name: "快上快下（提前2-4小时）",
            priceMin: 4.2, priceMax: 4.2, priceDefault: 4.2,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "提前2-4小时通知",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "js_fast_05_2h",
            name: "快上快下（提前0.5-2小时）",
            priceMin: 4.8, priceMax: 4.8, priceDefault: 4.8,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "提前0.5-2小时通知",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "js_realtime",
            name: "实时需求响应（提前≤0.5小时）",
            priceMin: 3, priceMax: 3, priceDefault: 3,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "提前0.5小时及以下，最快响应",
            isBest: false,
            calcType: "elec",
            capLumpPerKw: 10,
            capNote: "叠加容量补贴 10元/千瓦（年度一次性）",
          },
        ],
      },
    ],
  },

  {
    id: "chongqing",
    name: "重庆市",
    level: "市级",
    policyValidity: "2026年4月29日发布（征求意见稿）",
    policies: [
      {
        id: "cq_p1",
        name: "重庆市电力需求响应及应急响应实施方案（征求意见稿）",
        docNo: "2026年4月29日发布",
        url: "https://jjxxw.cq.gov.cn/",
        sliderMin: 0, sliderMax: 4.8, sliderDefault: 4.8,
        sliderFixed: false,
        tiers: [
          {
            id: "cq_peak",
            name: "削峰需求响应",
            priceMin: 0, priceMax: 4.8, priceDefault: 4.8,
            priceFixed: false, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "集中竞价边际出清，最高限价4.8元/kWh",
            isBest: true,
            calcType: "elec",
          },
          {
            id: "cq_valley",
            name: "填谷需求响应",
            priceMin: 0, priceMax: 0.32, priceDefault: 0.32,
            priceFixed: false, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "最高限价0.32元/kWh（限价基准0.2元×系数）",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "cq_vpp",
            name: "虚拟电厂削峰/填谷",
            priceMin: 0, priceMax: 4.8, priceDefault: 4.8,
            priceFixed: false, priceMultiplier: 1.2,
            priceDisplayUnit: "元/kWh（电力用户补贴×1.2）",
            condition: "1.2倍激励，调节容量不低于10000kW",
            isBest: false,
            calcType: "elec",
            capMonthPerKw: 5,
            capNote: "叠加月激励补贴 5元/千瓦",
          },
          {
            id: "cq_emg_cap",
            name: "应急响应容量备用（直采直控）",
            priceMin: 30, priceMax: 30, priceDefault: 30,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/千瓦（系数2）",
            condition: "直采直控系数2，自主调节系数1（15元/kW）",
            isBest: false,
            calcType: "perKwEvent",
          },
          {
            id: "cq_emg_elec",
            name: "应急响应调节激励（实时调节）",
            priceMin: 6, priceMax: 6, priceDefault: 6,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh（系数1.5）",
            condition: "实时调节系数1.5，快速调节系数1（4元/kWh）",
            isBest: false,
            calcType: "elec",
          },
        ],
      },
    ],
  },

  {
    id: "guangdong",
    name: "广东省",
    level: "省级",
    policyValidity: "2026年3月8日发布",
    policies: [
      {
        id: "gd_p1",
        name: "广东省市场化需求响应实施细则修订版",
        docNo: "2026年3月8日发布",
        url: "https://www.gdcsg.cn/",
        sliderMin: 0, sliderMax: 2.7, sliderDefault: 2.25,
        sliderFixed: false,
        sliderFixedNote: undefined,
        tiers: [
          {
            id: "gd_dayahead_early",
            name: "日前邀约削峰（D-3至D-1日20点）",
            priceMin: 0, priceMax: 2.7, priceDefault: 2.25,
            priceFixed: false, priceMultiplier: 1.0,
            priceDisplayUnit: "元/kWh（P₁×1.0）",
            condition: "提前D-3至D-1日20点通知",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "gd_dayahead_late",
            name: "日前邀约削峰（晚通知）",
            priceMin: 0, priceMax: 2.7, priceDefault: 2.25,
            priceFixed: false, priceMultiplier: 1.2,
            priceDisplayUnit: "元/kWh（P₁×1.2）",
            condition: "D-1日20点至提前2小时通知",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "gd_flex_2h",
            name: "灵活避峰（日内，提前0.5~2h）",
            priceMin: 0, priceMax: 2.7, priceDefault: 2.25,
            priceFixed: false, priceMultiplier: 1.4,
            priceDisplayUnit: "元/kWh（P₁×1.4）",
            condition: "提前0.5-2小时通知",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "gd_flex_urgent",
            name: "灵活避峰（日内紧急，提前≤0.5h）",
            priceMin: 0, priceMax: 2.7, priceDefault: 2.25,
            priceFixed: false, priceMultiplier: 1.6,
            priceDisplayUnit: "元/kWh（P₁×1.6）",
            condition: "提前0.5小时以内，最快响应",
            isBest: true,
            calcType: "elec",
          },
          {
            id: "gd_interruptible",
            name: "可中断负荷",
            priceMin: 0, priceMax: 2.7, priceDefault: 2.25,
            priceFixed: false, priceMultiplier: 1.0,
            priceDisplayUnit: "元/kWh（P₁×1.0）",
            condition: "需具备可中断负荷能力",
            isBest: false,
            calcType: "elec",
            capLumpPerKw: 1,
            capNote: "叠加容量补贴 1000元/MW（≈1元/kW）",
          },
        ],
      },
    ],
  },

  {
    id: "zhejiang",
    name: "浙江省",
    level: "省级",
    policyValidity: "2025年迎峰度夏期间",
    policies: [
      {
        id: "zj_p1",
        name: "2025年浙江省迎峰度夏电力需求侧管理工作实施方案",
        docNo: "浙发改能源〔2025〕131号",
        url: "https://fzggw.zj.gov.cn/",
        sliderMin: 0, sliderMax: 5, sliderDefault: 4,
        sliderFixed: true,
        sliderFixedNote: "该地区为固定补贴单价，滑动条不可用",
        tiers: [
          {
            id: "zj_morning",
            name: "日前削峰约定型·早峰/腰峰",
            priceMin: 2, priceMax: 2, priceDefault: 2,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "日前约定，早峰/腰峰时段",
            isBest: false,
            calcType: "elec",
            capMonthPerKw: 1,
            capNote: "叠加容量补贴 1元/kW·月（需≥5MW）",
          },
          {
            id: "zj_evening",
            name: "日前削峰约定型·晚峰",
            priceMin: 3, priceMax: 3, priceDefault: 3,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "日前约定，晚峰时段（18:00-21:00）",
            isBest: false,
            calcType: "elec",
            capMonthPerKw: 1,
            capNote: "叠加容量补贴 1元/kW·月（需≥5MW）",
          },
          {
            id: "zj_valley",
            name: "日前填谷",
            priceMin: 5, priceMax: 5, priceDefault: 5,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kW·日",
            condition: "日前约定填谷，按容量·天计费",
            isBest: false,
            calcType: "perKwDay",
          },
          {
            id: "zj_hourly",
            name: "小时级响应",
            priceMin: 4, priceMax: 4, priceDefault: 4,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "需通过小时级响应能力认证",
            isBest: true,
            calcType: "elec",
            capMonthPerKw: 1,
            capNote: "叠加容量补贴 1元/kW·月",
          },
          {
            id: "zj_minute",
            name: "分钟级响应",
            priceMin: 4, priceMax: 4, priceDefault: 4,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "需通过分钟级响应能力认证",
            isBest: false,
            calcType: "elec",
            capMonthPerKw: 1,
            capNote: "叠加容量补贴 1元/kW·月",
          },
          {
            id: "zj_second",
            name: "（准）秒级响应",
            priceMin: 4, priceMax: 4, priceDefault: 4,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "需通过秒级响应能力认证",
            isBest: false,
            calcType: "elec",
            capMonthPerKw: 0.1,
            capNote: "叠加容量补贴 0.1元/kW·月",
          },
        ],
      },
    ],
  },

  {
    id: "shandong",
    name: "山东省",
    level: "省级",
    policyValidity: "2026年发布",
    policies: [
      {
        id: "sd_p1",
        name: "山东省虚拟电厂建设运行管理办法",
        docNo: "鲁发改能源〔2026〕220号",
        url: "http://nyj.shandong.gov.cn/",
        sliderMin: 0, sliderMax: 4, sliderDefault: 4,
        sliderFixed: true,
        sliderFixedNote: "竞价出清模式，此处按政策上限估算",
        tiers: [
          {
            id: "sd_cap",
            name: "紧急型需求响应容量补偿",
            priceMin: 0, priceMax: 4, priceDefault: 4,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/kW·月",
            condition: "≤4元/kW·月，单边报量报价边际出清",
            isBest: true,
            calcType: "perKwMonth",
          },
          {
            id: "sd_elec",
            name: "电能量补偿",
            priceMin: 0, priceMax: 0.8, priceDefault: 0.6,
            priceFixed: false, priceMultiplier: 1,
            priceDisplayUnit: "元/kWh",
            condition: "与现货市场用户侧小时电价挂钩",
            isBest: false,
            calcType: "elec",
          },
          {
            id: "sd_residential",
            name: "居民空调/电采暖响应",
            priceMin: 4, priceMax: 4, priceDefault: 4,
            priceFixed: true, priceMultiplier: 1,
            priceDisplayUnit: "元/千瓦·次",
            condition: "针对居民空调、电采暖，按容量·次计费",
            isBest: false,
            calcType: "perKwEvent",
          },
        ],
      },
    ],
  },
];
