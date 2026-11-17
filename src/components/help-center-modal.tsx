import { useState, useMemo, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  FileText,
  History,
  X,
} from 'lucide-react';

export interface HelpCenterPageProps {
  onBack: () => void;
  onOpenGuide?: () => void;
}

type MainTab = 'manual' | 'faq';
type ManualSubTab = 'docs' | 'history';

// ─── 1. 用户手册数据结构（标准标题 + 文本 + 图片，无繁琐卡片） ───────────────

interface ArticleBlock {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  image?: {
    url: string;
    caption: string;
  };
}

interface ManualArticle {
  id: string;
  code: string;
  title: string;
  updatedAt: string;
  blocks: ArticleBlock[];
}

interface ManualChapterNode {
  id: string;
  title: string;
  articles: ManualArticle[];
}

interface VersionHistoryEntry {
  version: string;
  date: string;
  editionTag: string;
  changes: string[];
}

interface ServiceManualConfig {
  serviceKey: string;
  serviceName: string;
  hasContent: boolean;
  chapters: ManualChapterNode[];
  versionHistory: VersionHistoryEntry[];
}

const ENERGY_MANAGEMENT_CHAPTERS: ManualChapterNode[] = [
  {
    id: 'ch-overview',
    title: '一、模块概述与版本说明',
    articles: [
      {
        id: 'art-1-1',
        code: '1.1',
        title: '能源管理模块概述',
        updatedAt: '2026-08-20',
        blocks: [
          {
            paragraphs: [
              '能源管理（智慧能管）是天工智云平台的核心系统，面向工业制造园区提供水、电、气、冷、热多能流全链路实时监测、分时电费复核、最大需量管控及重点设备能效优化。',
              '系统通过构建从总进线关口表、车间配电柜到重点产线机台的三级计量体系，帮助企业全面掌握用能去向，降低综合用能成本。',
            ],
            image: {
              url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
              caption: '图 1-1 能源管理模块全厂多能流实时监测界面示意图',
            },
          },
          {
            heading: '核心功能组成',
            bullets: [
              '能效总览看板：汇总展示今日发电量、上网电量、下网电量、综合能耗及实时负荷曲线。',
              '多能流拓扑与分项计量：按电力、自来水、天然气、蒸汽等介质查看三级支路计量与线损分布。',
              '分时电价与电费复核：结合各省尖峰平谷时段规则，自动核算电度电费、基本电费与力调电费。',
              '最大需量监测与防越限：实时跟踪15分钟滑窗需量功率，触发越限预警并联动储能削峰。',
              '重点设备诊断与报表中心：在线核算空压机、冷水机组能效指标，支持日/月/年用能报表导出。',
            ],
          },
        ],
      },
      {
        id: 'art-1-2',
        code: '1.2',
        title: '各版本功能说明',
        updatedAt: '2026-08-20',
        blocks: [
          {
            paragraphs: [
              '能源管理模块根据企业数字化深度与智能控制需求，分为基础版、高级版与AI预测版三个版本。企业可在不更换现场智能表计与边缘网关的前提下平滑升级。',
            ],
          },
          {
            heading: '基础版',
            paragraphs: [
              '适用于完成初步数字化改造、需要线上远程抄表与基础电费复核的单体工厂。',
            ],
            bullets: [
              '支持全厂电、水、气、热三级计量拓扑树与15分钟定时冻结数据采集。',
              '支持尖峰、高峰、平段、低谷分时电量统计与月度电费账单自动生成。',
              '支持支路功率越限基础告警及标准能耗报表（Excel / PDF）导出。',
            ],
          },
          {
            heading: '高级版',
            paragraphs: [
              '适用于具备多车间定额考核及两部制需量管控需求的中大型制造园区，包含基础版全部功能。',
            ],
            bullets: [
              '数据采样精度提升至秒级实时遥测，支持全厂能流桑基图（Sankey）损耗分析。',
              '提供两部制电价最大需量（MD）15分钟滑窗实时监测与三级防越限预警联动。',
              '支持主变压器经济运行区间分析、功率因数力调电费优化及班组单耗定额考核。',
            ],
          },
          {
            heading: 'AI预测版',
            paragraphs: [
              '适用于追求负荷预测寻优与源网荷储协同控制的新型工业园区，包含高级版全部功能。',
            ],
            bullets: [
              '内置融合气象温湿度与排产计划的短期负荷AI预测模型（未来24h~72h负荷预测）。',
              '支持空压机站、中央空调冷源站AI群控参数寻优，动态下发变频与温度控制指令。',
              '支持夜间非生产时段异常待机能耗与管网跑冒滴漏AI指纹识别。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ch-menus',
    title: '二、菜单功能说明',
    articles: [
      {
        id: 'art-2-1',
        code: '2.1',
        title: '能效总览看板',
        updatedAt: '2026-08-20',
        blocks: [
          {
            heading: '功能简介',
            paragraphs: [
              '“能效总览看板”是能源管理模块的默认首屏页面，集中展示厂区实时负荷走势、今日发电与购电指标、分项用能结构及未处理告警信息。',
            ],
            image: {
              url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
              caption: '图 2-1 能效总览看板负荷趋势与分项用能占比界面',
            },
          },
          {
            heading: '界面说明与操作',
            bullets: [
              '顶部核心指标栏：展示今日综合能耗（tce）、今日发电量（kWh）、今日上网/下网电量及当月累计电费，支持切换日、月、年统计周期。',
              '实时负荷对比曲线：同屏展示昨日实际负荷、今日实时负荷及AI预测负荷曲线，鼠标悬停可查看任意15分钟时间点的有功功率与功率因数。',
              '分项用能占比：按生产动力、暖通空调、空压机站、照明插座及充电桩统计用电比例，点击对应分项可下钻查看车间明细。',
            ],
          },
        ],
      },
      {
        id: 'art-2-2',
        code: '2.2',
        title: '多能流拓扑与分项计量',
        updatedAt: '2026-08-18',
        blocks: [
          {
            heading: '功能简介',
            paragraphs: [
              '“多能流拓扑与分项计量”菜单通过配电一次接线图与能流桑基图，直观反映电、水、气、蒸汽从总表进线到各车间支路的流向与传输损耗。',
            ],
            image: {
              url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
              caption: '图 2-2 厂区多级配电计量拓扑与支路监测示意图',
            },
          },
          {
            heading: '主要操作说明',
            bullets: [
              '介质切换：通过页面顶部标签可切换查看电力、自来水、天然气、蒸汽及压缩空气计量网络。',
              '线损与平衡校验：系统自动核算上级总表与下级分表之和的差值，当不平衡率超过设定阈值（默认3%）时自动高亮提醒。',
              '表计详情查阅：点击拓扑图中的任意表计节点，可查看三相电压、三相电流、有功/无功功率及历史冻结电量。',
            ],
          },
        ],
      },
      {
        id: 'art-2-3',
        code: '2.3',
        title: '分时电价与电费账单复核',
        updatedAt: '2026-08-15',
        blocks: [
          {
            heading: '功能简介',
            paragraphs: [
              '该菜单根据园区所在省份最新的电网分时电价规则，自动拆解企业每月电度电费、基本电费与力调电费，辅助能源管理员开展错峰生产与账单核对。',
            ],
          },
          {
            heading: '核算内容说明',
            bullets: [
              '尖峰平谷电度电费：按尖峰、高峰、平段、低谷四个时段统计用电量与电费支出占比，识别高成本用电工序。',
              '基本电费方式对比：自动对比“按变压器容量计费”与“按实际最大需量计费”的月度费用差额，提供容改需经济性建议。',
              '功率因数力调电费：根据0.90标准考核线实时核算月度平均功率因数，预防无功欠补导致的力调电费罚款。',
            ],
          },
        ],
      },
      {
        id: 'art-2-4',
        code: '2.4',
        title: '最大需量监测与防越限控制',
        updatedAt: '2026-08-20',
        blocks: [
          {
            heading: '功能简介',
            paragraphs: [
              '针对执行两部制电价的工业企业，“最大需量监测与防越限控制”菜单实时跟踪关口表15分钟滑窗平均功率，防止实际需量超过供电局申报核定值。',
            ],
            image: {
              url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
              caption: '图 2-4 15分钟滑窗最大需量实时追踪与预警红线',
            },
          },
          {
            heading: '预警与联动机制',
            bullets: [
              '需量红线设置：支持录入月度申报最大需量值（kW），并配置关注（90%）、预警（95%）与紧急（98%）三级阈值。',
              '实时滑窗预测：每分钟滑动计算当前15分钟窗口的平均功率，并在AI预测版中提前预判周期末冻结需量。',
              '储能与柔性负荷联动：当触发98%紧急预警时，系统向消息中心发送告警，并自动联动厂区储能放电削峰或下调非核心空调负荷。',
            ],
          },
        ],
      },
      {
        id: 'art-2-5',
        code: '2.5',
        title: '重点设备诊断与AI寻优控制',
        updatedAt: '2026-08-19',
        blocks: [
          {
            heading: '功能简介',
            paragraphs: [
              '聚焦厂区高耗能公辅车间（空压机站、中央空调冷源站、循环水泵房），在线监测设备运行效率并提供AI闭环控制参数推荐。',
            ],
          },
          {
            heading: '典型应用场景',
            bullets: [
              '空压机站寻优：实时计算站房比功率与气电比（kWh/Nm³），根据末端用气压力波动自动调整工频/变频空压机加载组合。',
              '中央空调冷站寻优：实时核算冷水机组与水泵综合COP，结合室外温湿度动态优化冷冻水出水温度设定值。',
              '待机空转识别：自动统计产线交接班或午休时段设备高功率空转时长，定位待机能耗浪费点。',
            ],
          },
        ],
      },
      {
        id: 'art-2-6',
        code: '2.6',
        title: '用能定额考核与报表中心',
        updatedAt: '2026-08-12',
        blocks: [
          {
            heading: '功能简介',
            paragraphs: [
              '提供全厂及各车间日、周、月、年标准能耗报表自动生成与班组用能定额考核管理，支持一键导出用于财务成本核算与能源审计。',
            ],
          },
          {
            heading: '报表与定额管理',
            bullets: [
              '综合能耗报表：自动汇总水、电、气、热消耗量并折算标准煤（tce），生成同环比分析表。',
              '分时用电与电费分摊表：按车间或成本中心统计尖峰平谷用电明细及应分摊电费金额。',
              '单位产品电耗考核：结合车间产量数据计算单位产品综合电耗（kWh/件），对比定额基线评估班组绩效。',
            ],
          },
        ],
      },
    ],
  },
];

const ENERGY_VERSION_HISTORY: VersionHistoryEntry[] = [
  {
    version: 'v1.2.8 Standard',
    date: '2026-08-20',
    editionTag: 'AI预测版 / 高级版',
    changes: [
      '能效总览看板：上线融合气象温湿度耦合的未来72小时短期厂区负荷AI预测模型。',
      '最大需量监测：新增月度最高需量达申报值98.8%时的紧急预警推送与储能削峰联动建议。',
      '分时电价复核：新增峰谷电价差达0.86元/kWh时的日内储能套利调度建议通知。',
      '工作台服务卡片：优化今日发电量、上网电量、下网电量与发电效率实时翻牌器及数据看板悬停切换。',
    ],
  },
  {
    version: 'v1.2.5',
    date: '2026-07-02',
    editionTag: '高级版',
    changes: [
      '分时电价与电费复核：更新全国31省市2026年最新尖峰电价浮动比例与执行月份规则。',
      '多能流拓扑：支持自定义三级计量支路不平衡率（线损率）告警阈值。',
    ],
  },
  {
    version: 'v1.2.0',
    date: '2026-05-10',
    editionTag: '高级版 / AI预测版',
    changes: [
      '最大需量监测与防越限：正式上线15分钟滑窗需量实时追踪与三级预警机制。',
      '重点设备诊断与AI寻优：新增空压机站气电比监测与中央空调冷站COP寻优控制菜单。',
      '多能流拓扑：新增全厂水电气热多能流桑基图（Sankey）可视化视图。',
    ],
  },
  {
    version: 'v1.1.0',
    date: '2026-02-18',
    editionTag: '高级版',
    changes: [
      '用能定额考核与报表中心：新增车间/班组单位产品综合电耗定额对标与报表定时导出功能。',
      '分时电价与电费复核：新增基本电费“按容量”与“按最大需量”经济性对比测算。',
    ],
  },
  {
    version: 'v1.0.0',
    date: '2025-11-15',
    editionTag: '基础版',
    changes: [
      '能效总览看板：首发全厂水电气热综合能耗看板与15分钟级负荷曲线监测。',
      '多能流拓扑与分项计量：支持三级计量表计挂载、DL/T 645与Modbus规约接入及远程自动抄表。',
    ],
  },
];

const SERVICE_MANUAL_LIST: ServiceManualConfig[] = [
  {
    serviceKey: 'energy',
    serviceName: '能源管理',
    hasContent: true,
    chapters: ENERGY_MANAGEMENT_CHAPTERS,
    versionHistory: ENERGY_VERSION_HISTORY,
  },
  {
    serviceKey: 'enterprise',
    serviceName: '企业管理',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
  {
    serviceKey: 'microgrid',
    serviceName: '智能微网',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
  {
    serviceKey: 'vpp',
    serviceName: '虚拟电厂',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
  {
    serviceKey: 'asset',
    serviceName: '资产管理',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
  {
    serviceKey: 'zerocarbon',
    serviceName: '零碳园区',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
  {
    serviceKey: 'storage',
    serviceName: '智慧充储',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
  {
    serviceKey: 'greentrade',
    serviceName: '绿电交易',
    hasContent: false,
    chapters: [],
    versionHistory: [],
  },
];

const FLAT_ENERGY_ARTICLES: ManualArticle[] = ENERGY_MANAGEMENT_CHAPTERS.flatMap(
  (ch) => ch.articles
);

// ─── 2. 常见问题 (FAQ) 数据结构 ──────────────────────────────────────────────

type FaqCategoryKey = 'all' | 'tools' | 'dashboard' | 'device' | 'account';

const FAQ_CATEGORIES: { key: FaqCategoryKey; label: string }[] = [
  { key: 'all', label: '全部问题' },
  { key: 'tools', label: '能效百宝箱' },
  { key: 'dashboard', label: '工作台与监测' },
  { key: 'device', label: '告警与设备接入' },
  { key: 'account', label: '账号与系统指引' },
];

interface FaqItem {
  id: string;
  category: Exclude<FaqCategoryKey, 'all'>;
  question: string;
  answer: string;
  bullets?: string[];
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'tools',
    question: '“理论发电测算”小工具是如何计算各省分布式光伏发电量的？',
    answer:
      '理论发电测算工具内置了全国31个省、直辖市及自治区的标准年等效满负荷利用小时数。选择项目所在省份并输入装机容量与系统综合效率后，系统会自动匹配该省各月日照分布权重，计算首年理论总发电量及1~12月逐月发电柱状图。',
    bullets: [
      '年理论发电量 (万kWh) = 装机容量 (MWp) × 省份标准等效利用小时数 (h) × 系统综合效率修正系数',
      '等效利用小时数由系统按省份自动初始化，无需手动修改等效小时或组件转化效率',
    ],
  },
  {
    id: 'faq-2',
    category: 'tools',
    question: '“政策法规查询”如何按地区筛选并下载原始政策文件与附表？',
    answer:
      '政策法规数据库收录了国家部委及各省市能源主管部门发布的政策法规、标准规范、规划指南与市场数据。',
    bullets: [
      '适用地区单选：支持通过下拉框或快捷标签单选“全部”、“全国”或具体省份（如江苏、广东、浙江、山东等）',
      '整卡点击展开：直接点击右侧任意政策卡片即可展开或收起详情，无需单独点击详情按钮',
      '多文件下载：展开后直接列出该政策包含的正式通知文件及附表名称，点击对应文件右侧“下载”即可获取原件，或点击“访问原始发布页”打开官方发布页',
    ],
  },
  {
    id: 'faq-3',
    category: 'dashboard',
    question: '左侧企业列表与“全国企业地图模式”如何配合使用？',
    answer:
      '左侧边栏汇总了集团接入的所有工业园区。您可以在下拉列表中搜索企业名称，或点击“地图模式”打开全国分布视图：左侧企业树按省份分组定位企业，地图卡片顶部合并展示所属地区与详细地址，并实时呈现装机容量、储能规模与碳减排量。',
  },
  {
    id: 'faq-4',
    category: 'dashboard',
    question: '如何在左侧“我的服务”卡片上查看实时指标或进入“数据看板”？',
    answer:
      '对于包含实时监测指标的服务模块（如智慧能管、智能微网、虚拟电厂、资产管理、零碳园区），卡片左下方默认每 5.5 秒轮播核心运行指标；当鼠标悬停在指标区域时，会自动切换显示“数据看板”按钮。',
  },
  {
    id: 'faq-5',
    category: 'tools',
    question: '如何使用“储能/光伏静态投资回收期（ROI）”与“分时电价”工具评估收益？',
    answer:
      '可先通过“分时电价查询”核对目标省份最新的尖峰、高峰、平段与低谷电价及时段划分，再在投资回报测算器中输入建设成本、充放电策略或自发自用比例，系统将自动输出静态投资回收年限及现金流曲线。',
  },
  {
    id: 'faq-6',
    category: 'device',
    question: '收到“月度最高需量功率越限预警”或“10kV母线过流跳闸”时系统如何处置？',
    answer:
      '右上角“消息中心”会实时推送告警通知并与现场边缘控制器协同：进线柜过流跳闸时储能毫秒级切入保供；月度最高需量接近申报值98%时联动储能放电削峰；储能电芯温差超限时自动提速液冷环路降温。',
  },
  {
    id: 'faq-7',
    category: 'device',
    question: '平台支持接入哪些工业规约？断网会丢失历史能效数据吗？',
    answer:
      '智能边缘网关支持 IEC 60870-5-104、IEC 61850、DL/T 645、DL/T 698.45、Modbus RTU/TCP、MQTT 与 OPC UA 等标准协议。外网中断时网关支持本地缓存长达 30 天的历史曲线，网络恢复后自动断点续传。',
  },
  {
    id: 'faq-8',
    category: 'account',
    question: '“正式账号”与“体验模式”有什么区别？如何重新打开新手引导？',
    answer:
      '正式账号展示企业真实边缘网关采集数据；体验模式加载示范园区沙箱数据供投前体验。点击顶部导航栏右侧的“问号图标（系统指引）”即可随时重新启动新手引导。',
  },
];

// ─── 主组件：无Card、纯分割线干净文档布局 ───────────────────────────────────

export function HelpCenterPage({ onBack }: HelpCenterPageProps) {
  const [mainTab, setMainTab] = useState<MainTab>('manual');

  // 用户手册状态
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>('energy');
  const [manualSubTab, setManualSubTab] = useState<ManualSubTab>('docs');
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(['ch-overview', 'ch-menus'])
  );
  const [activeArticleId, setActiveArticleId] = useState<string>('art-1-1');
  const [manualSearch, setManualSearch] = useState<string>('');
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // FAQ状态
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<FaqCategoryKey>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(
    new Set(['faq-1', 'faq-2'])
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      next.has(chapterId) ? next.delete(chapterId) : next.add(chapterId);
      return next;
    });
  };

  const selectArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    const parentChapter = ENERGY_MANAGEMENT_CHAPTERS.find((ch) =>
      ch.articles.some((a) => a.id === articleId)
    );
    if (parentChapter) {
      setExpandedChapters((prev) => new Set(prev).add(parentChapter.id));
    }
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentService = useMemo(
    () =>
      SERVICE_MANUAL_LIST.find((s) => s.serviceKey === selectedServiceKey) ||
      SERVICE_MANUAL_LIST[0],
    [selectedServiceKey]
  );

  const currentArticleIndex = useMemo(
    () => FLAT_ENERGY_ARTICLES.findIndex((a) => a.id === activeArticleId),
    [activeArticleId]
  );

  const currentArticle = useMemo(
    () => FLAT_ENERGY_ARTICLES[currentArticleIndex] || FLAT_ENERGY_ARTICLES[0],
    [currentArticleIndex]
  );

  const prevArticle =
    currentArticleIndex > 0 ? FLAT_ENERGY_ARTICLES[currentArticleIndex - 1] : null;
  const nextArticle =
    currentArticleIndex >= 0 && currentArticleIndex < FLAT_ENERGY_ARTICLES.length - 1
      ? FLAT_ENERGY_ARTICLES[currentArticleIndex + 1]
      : null;

  const filteredEnergyChapters = useMemo(() => {
    const q = manualSearch.trim().toLowerCase();
    if (!q) return ENERGY_MANAGEMENT_CHAPTERS;
    return ENERGY_MANAGEMENT_CHAPTERS.map((ch) => ({
      ...ch,
      articles: ch.articles.filter(
        (art) =>
          art.title.toLowerCase().includes(q) || art.code.toLowerCase().includes(q)
      ),
    })).filter((ch) => ch.articles.length > 0);
  }, [manualSearch]);

  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredFaqs = useMemo(() => {
    const q = faqSearchQuery.trim().toLowerCase();
    return FAQ_LIST.filter((item) => {
      if (selectedFaqCategory !== 'all' && item.category !== selectedFaqCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.bullets && item.bullets.some((b) => b.toLowerCase().includes(q)))
      );
    });
  }, [selectedFaqCategory, faqSearchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0 w-full overflow-hidden">
      {/* ─── 顶部栏：返回工作台 + 两大类切换（纯底部分割线） ─── */}
      <div className="w-full px-6 h-12 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            返回工作台
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-slate-900">帮助中心</span>
        </div>

        {/* 两大类切换：1. 用户手册 / 2. 常见问题 */}
        <div className="flex items-center gap-6 h-full">
          <button
            type="button"
            onClick={() => setMainTab('manual')}
            className={`h-full inline-flex items-center gap-1.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              mainTab === 'manual'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="size-3.5" />
            用户手册
          </button>
          <button
            type="button"
            onClick={() => setMainTab('faq')}
            className={`h-full inline-flex items-center gap-1.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              mainTab === 'faq'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="size-3.5" />
            常见问题
          </button>
        </div>
      </div>

      {mainTab === 'manual' ? (
        /* =====================================================================
           第一大类：用户手册（无Card，纯分割线布局）
           ===================================================================== */
        <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
          {/* ─── 独立一层：服务模块选择层（左侧服务模块标签，最右侧包含“功能说明”和“版本历史”两个tab） ─── */}
          <div className="w-full px-6 py-2.5 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-medium mr-2">服务模块：</span>
              {SERVICE_MANUAL_LIST.map((svc) => {
                const active = selectedServiceKey === svc.serviceKey;
                return (
                  <button
                    key={svc.serviceKey}
                    type="button"
                    onClick={() => setSelectedServiceKey(svc.serviceKey)}
                    className={`px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                    }`}
                  >
                    {svc.serviceName}
                  </button>
                );
              })}
            </div>

            {/* 最右侧：功能说明 & 版本历史 两个 tab */}
            <div className="flex items-center gap-1 bg-slate-200/60 p-0.5 rounded-lg flex-shrink-0">
              <button
                type="button"
                onClick={() => setManualSubTab('docs')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  manualSubTab === 'docs'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="size-3.5" />
                功能说明
              </button>
              <button
                type="button"
                onClick={() => setManualSubTab('history')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  manualSubTab === 'history'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="size-3.5" />
                版本历史
              </button>
            </div>
          </div>

          {/* ─── 下方主体：根据“功能说明”或“版本历史”tab展示对应内容 ─── */}
          {manualSubTab === 'docs' ? (
            <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden">
              {/* 左侧树状结构（仅包含当前选中服务的功能说明目录，无版本历史） */}
              <aside className="w-full md:w-[260px] lg:w-[280px] flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col min-h-0 bg-white">
                {/* 搜索框 */}
                <div className="p-3 border-b border-slate-100">
                  <div className="relative">
                    <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={manualSearch}
                      onChange={(e) => setManualSearch(e.target.value)}
                      disabled={!currentService.hasContent}
                      placeholder={`搜索${currentService.serviceName}目录...`}
                      className="w-full pl-8 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 disabled:opacity-50"
                    />
                    {manualSearch && (
                      <button
                        type="button"
                        onClick={() => setManualSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 树节点列表 */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  {!currentService.hasContent ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                      暂无目录
                    </div>
                  ) : (
                    filteredEnergyChapters.map((chapter) => {
                      const isChapOpen = expandedChapters.has(chapter.id);

                      return (
                        <div key={chapter.id} className="space-y-0.5">
                          {/* 一级树节点：章节 */}
                          <button
                            type="button"
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                          >
                            <ChevronRight
                              className={`size-3.5 text-slate-400 flex-shrink-0 transition-transform ${
                                isChapOpen ? 'rotate-90 text-slate-700' : ''
                              }`}
                            />
                            <span className="truncate">{chapter.title}</span>
                          </button>

                          {/* 二级树节点：具体文章 */}
                          {isChapOpen && (
                            <div className="pl-4 ml-2 border-l border-slate-200 space-y-0.5 py-0.5">
                              {chapter.articles.map((art) => {
                                const isArtActive = currentArticle.id === art.id;
                                return (
                                  <button
                                    key={art.id}
                                    type="button"
                                    onClick={() => selectArticle(art.id)}
                                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer ${
                                      isArtActive
                                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                  >
                                    <FileText
                                      className={`size-3.5 flex-shrink-0 ${
                                        isArtActive ? 'text-indigo-600' : 'text-slate-400'
                                      }`}
                                    />
                                    <span className="truncate">
                                      {art.code} {art.title}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* 右侧独立文章页面（无Card包裹，纯分割线与常规标题+文本+图片排版） */}
              <div
                ref={contentScrollRef}
                className="flex-1 min-w-0 overflow-y-auto px-6 sm:px-10 lg:px-14 py-8 bg-white"
              >
                {!currentService.hasContent ? (
                  <div className="py-24 text-center space-y-2">
                    <p className="text-sm font-bold text-slate-500">暂无用户手册内容</p>
                    <p className="text-xs text-slate-400">
                      「{currentService.serviceName}」模块的功能说明正在编写中
                    </p>
                  </div>
                ) : (
                  <article className="w-full">
                    {/* 文章标题与更新时间（底部分割线） */}
                    <div className="pb-4 border-b border-slate-200">
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {currentArticle.code} {currentArticle.title}
                      </h1>
                      <p className="text-xs text-slate-400 mt-2">
                        更新时间：{currentArticle.updatedAt}
                      </p>
                    </div>

                    {/* 文章正文（常规标题 + 文本段落 + 要点列表 + 配图，小节间使用分割线） */}
                    <div className="divide-y divide-slate-100">
                      {currentArticle.blocks.map((block, bIdx) => (
                        <section key={bIdx} className="py-6 space-y-4">
                          {block.heading && (
                            <h2 className="text-base font-bold text-slate-900">
                              {block.heading}
                            </h2>
                          )}

                          {block.paragraphs &&
                            block.paragraphs.map((p, pIdx) => (
                              <p
                                key={pIdx}
                                className="text-sm text-slate-600 leading-7"
                              >
                                {p}
                              </p>
                            ))}

                          {block.bullets && block.bullets.length > 0 && (
                            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-7">
                              {block.bullets.map((item, iIdx) => (
                                <li key={iIdx}>{item}</li>
                              ))}
                            </ul>
                          )}

                          {block.image && (
                            <figure className="pt-2 space-y-2">
                              <img
                                src={block.image.url}
                                alt={block.image.caption}
                                className="w-full max-h-[420px] object-cover rounded-lg border border-slate-200"
                                loading="lazy"
                              />
                              <figcaption className="text-xs text-slate-400 text-center">
                                {block.image.caption}
                              </figcaption>
                            </figure>
                          )}
                        </section>
                      ))}
                    </div>

                    {/* 底部上一篇 / 下一篇切换（纯顶部分割线） */}
                    <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                      {prevArticle ? (
                        <button
                          type="button"
                          onClick={() => selectArticle(prevArticle.id)}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="size-4" />
                          <span>
                            上一篇：{prevArticle.code} {prevArticle.title}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300 select-none">
                          上一篇：无
                        </span>
                      )}

                      {nextArticle ? (
                        <button
                          type="button"
                          onClick={() => selectArticle(nextArticle.id)}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <span>
                            下一篇：{nextArticle.code} {nextArticle.title}
                          </span>
                          <ArrowRight className="size-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300 select-none">
                          下一篇：无
                        </span>
                      )}
                    </div>
                  </article>
                )}
              </div>
            </div>
          ) : (
            /* ─── 版本历史 Tab 独立视图（无Card，纯分割线排版） ─── */
            <div className="flex-1 min-w-0 overflow-y-auto px-6 sm:px-10 lg:px-14 py-8 bg-white">
              {!currentService.hasContent || currentService.versionHistory.length === 0 ? (
                <div className="py-24 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-500">暂无版本历史</p>
                  <p className="text-xs text-slate-400">
                    「{currentService.serviceName}」模块的版本发布记录正在整理中
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="pb-4 border-b border-slate-200">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {currentService.serviceName} · 版本历史
                    </h1>
                    <p className="text-xs text-slate-400 mt-2">
                      按发布时间倒序记录「{currentService.serviceName}」模块历次版本的更新内容与功能演进
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {currentService.versionHistory.map((item) => (
                      <section key={item.version} className="py-6 space-y-3">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <h2 className="text-base font-bold text-slate-900">
                            {item.version}
                          </h2>
                          <span className="text-xs text-slate-400 font-mono">
                            {item.date}
                          </span>
                          <span className="text-xs text-indigo-600 font-medium">
                            {item.editionTag}
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-7">
                          {item.changes.map((chg, cIdx) => (
                            <li key={cIdx}>{chg}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* =====================================================================
           第二大类：常见问题 (FAQ，同样无Card，采用纯分割线列表)
           ===================================================================== */
        <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden">
          {/* 左侧：FAQ分类（右分割线） */}
          <aside className="w-full md:w-[240px] lg:w-[260px] flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-200 p-4 space-y-1 bg-white">
            <div className="px-2.5 pb-2 text-xs font-bold text-slate-400">
              问题分类
            </div>
            {FAQ_CATEGORIES.map((cat) => {
              const active = selectedFaqCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedFaqCategory(cat.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </aside>

          {/* 右侧：FAQ搜索与分割线问答列表 */}
          <div className="flex-1 min-w-0 overflow-y-auto px-6 sm:px-10 lg:px-14 py-6 bg-white">
            {/* 顶部搜索框 */}
            <div className="pb-5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="搜索常见问题关键词..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-400">
                共 {filteredFaqs.length} 条问题
              </span>
            </div>

            {/* 纯分割线问答列表 */}
            {filteredFaqs.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                未找到匹配的常见问题
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqIds.has(faq.id);
                  return (
                    <div key={faq.id} className="py-4">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                      >
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          Q：{faq.question}
                        </span>
                        <ChevronDown
                          className={`size-4 text-slate-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-indigo-600' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="mt-3 pl-5 border-l-2 border-slate-200 space-y-2">
                          <p className="text-sm text-slate-600 leading-7">
                            {faq.answer}
                          </p>
                          {faq.bullets && faq.bullets.length > 0 && (
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 leading-7">
                              {faq.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function HelpCenterModal({ onClose }: { onClose: () => void }) {
  return <HelpCenterPage onBack={onClose} />;
}
