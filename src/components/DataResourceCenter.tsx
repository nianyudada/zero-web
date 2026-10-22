import { useMemo, useState } from "react";
import {
  FileText,
  BookMarked,
  Map,
  LineChart,
  ChevronDown,
  Check,
  RotateCcw,
  Filter,
  Download,
  FolderOpen,
  Building2,
  CalendarDays,
  Hash,
  ExternalLink,
  FileDown,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type FileType = "law" | "standard" | "plan" | "marketdata";
type ContentTag = "market" | "carbon" | "manage" | "factory" | "storage" | "vpp" | "scene";

interface FileTypeMeta {
  key: FileType;
  name: string;
  icon: typeof FileText;
  count: number;
  tag: string;
  dot: string;
}

interface TagMeta {
  key: ContentTag;
  name: string;
  count: number;
  chip: string;
}

export interface PolicyAttachment {
  name: string;
  format: "PDF" | "DOCX" | "XLSX" | "ZIP";
  size: string;
}

interface ResItem {
  id: string;
  fileType: FileType;
  tag: ContentTag;
  title: string;
  region: string; // "全国" or province name like "江苏", "广东", "浙江", "山东", etc.
  source: string;
  date: string;
  agency: string;
  docNo: string;
  summary: string;
  scope?: string;
  clauses?: string[];
  link?: string;
  files: PolicyAttachment[];
  // market data
  series?: number[];
  metrics?: { label: string; value: string }[];
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const FILE_TYPES: FileTypeMeta[] = [
  { key: "law", name: "政策法规", icon: FileText, count: 1862, tag: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500" },
  { key: "standard", name: "标准规范", icon: BookMarked, count: 743, tag: "bg-violet-50 text-violet-600 border-violet-200", dot: "bg-violet-500" },
  { key: "plan", name: "规划指南", icon: Map, count: 486, tag: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-500" },
  { key: "marketdata", name: "市场数据", icon: LineChart, count: 528, tag: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
];

const FILE_BY_KEY = Object.fromEntries(FILE_TYPES.map((t) => [t.key, t])) as Record<FileType, FileTypeMeta>;

const CONTENT_TAGS: TagMeta[] = [
  { key: "market", name: "电力市场", count: 858, chip: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "carbon", name: "双碳减排", count: 712, chip: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { key: "manage", name: "能源管理", count: 634, chip: "bg-sky-50 text-sky-600 border-sky-200" },
  { key: "factory", name: "园区工厂", count: 421, chip: "bg-orange-50 text-orange-600 border-orange-200" },
  { key: "storage", name: "光伏储能", count: 507, chip: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  { key: "vpp", name: "虚拟电厂", count: 389, chip: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200" },
  { key: "scene", name: "新型场景", count: 296, chip: "bg-rose-50 text-rose-600 border-rose-200" },
];

const TAG_BY_KEY = Object.fromEntries(CONTENT_TAGS.map((t) => [t.key, t])) as Record<ContentTag, TagMeta>;

// Nationwide + 31 Provinces in China
export const PROVINCES_LIST = [
  "全国",
  "北京", "天津", "河北", "山西", "内蒙古",
  "辽宁", "吉林", "黑龙江",
  "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东",
  "河南", "湖北", "湖南", "广东", "广西", "海南",
  "重庆", "四川", "贵州", "云南", "西藏",
  "陕西", "甘肃", "青海", "宁夏", "新疆"
];

// ─── Data ───────────────────────────────────────────────────────────────────

const ITEMS: ResItem[] = [
  {
    id: "l1",
    fileType: "law",
    tag: "market",
    title: "关于进一步完善分时电价机制的通知",
    region: "全国",
    source: "国家发展改革委",
    date: "2026-09-12",
    agency: "国家发展和改革委员会",
    docNo: "发改价格〔2026〕1201号",
    summary: "进一步拉大峰谷价差，健全尖峰电价机制，鼓励新型储能与需求侧资源参与系统调节，推动电力资源优化配置。",
    link: "https://www.ndrc.gov.cn/xxgk/zcfb/tz/202107/t20210729_1291811.html",
    files: [
      {
        name: "发改价格〔2026〕1201号-国家发改委关于进一步完善分时电价机制的通知.pdf",
        format: "PDF",
        size: "2.4 MB",
      },
      {
        name: "附件1：各省电网尖峰电价实施范围与季节浮动系数表.xlsx",
        format: "XLSX",
        size: "820 KB",
      },
      {
        name: "附件2：新型储能与需求侧响应充放电价格支持实施细则.docx",
        format: "DOCX",
        size: "1.1 MB",
      },
    ],
  },
  {
    id: "l2",
    fileType: "law",
    tag: "market",
    title: "江苏省电力需求侧管理办法（2026年修订版）",
    region: "江苏",
    source: "江苏省发展改革委",
    date: "2026-08-28",
    agency: "江苏省发展和改革委员会",
    docNo: "苏发改能源〔2026〕456号",
    summary: "明确需求响应实施主体、补贴标准与结算流程，支持负荷聚合商开展可调节负荷聚合，构建省级需求响应资源池。",
    link: "https://fzggw.jiangsu.gov.cn/",
    files: [
      {
        name: "苏发改能源〔2026〕456号-江苏省电力需求侧管理办法（2026年版）.pdf",
        format: "PDF",
        size: "1.8 MB",
      },
      {
        name: "附件：负荷聚合商可调节能力认证与补贴申报流程表.docx",
        format: "DOCX",
        size: "640 KB",
      },
    ],
  },
  {
    id: "l3",
    fileType: "law",
    tag: "carbon",
    title: "关于加快建立健全绿色低碳循环发展经济体系的指导意见",
    region: "全国",
    source: "生态环境部",
    date: "2026-07-06",
    agency: "生态环境部",
    docNo: "环综合〔2026〕88号",
    summary: "统筹推进碳达峰碳中和，健全绿电绿证交易机制，推动重点行业节能降碳改造，构建清洁低碳能源体系。",
    link: "https://www.mee.gov.cn/",
    files: [
      {
        name: "环综合〔2026〕88号-关于加快建立健全绿色低碳循环发展经济体系的指导意见.pdf",
        format: "PDF",
        size: "3.2 MB",
      },
      {
        name: "附件：重点行业温室气体协同减排清单及绿电消纳核算规则.pdf",
        format: "PDF",
        size: "1.4 MB",
      },
    ],
  },
  {
    id: "l4",
    fileType: "law",
    tag: "carbon",
    title: "河北省工业领域碳达峰与绿色转型实施方案",
    region: "河北",
    source: "河北省工信厅",
    date: "2026-06-18",
    agency: "河北省发展改革委、工信厅",
    docNo: "冀发改环资〔2026〕302号",
    summary: "聚焦钢铁、有色、建材、化工等重点高载能行业，明确工业碳达峰路径与绿色微电网建设重点工程。",
    link: "https://www.miit.gov.cn/",
    files: [
      {
        name: "冀发改环资〔2026〕302号-河北省工业领域碳达峰与绿色转型方案.pdf",
        format: "PDF",
        size: "2.1 MB",
      },
      {
        name: "附件：重点钢铁用能单位能效提升改造台账模板.xlsx",
        format: "XLSX",
        size: "950 KB",
      },
    ],
  },
  {
    id: "l6",
    fileType: "law",
    tag: "storage",
    title: "浙江省关于支持源网荷储一体化和新型储能协同发展的实施意见",
    region: "浙江",
    source: "浙江省能源局",
    date: "2026-08-16",
    agency: "浙江省发展和改革委员会",
    docNo: "浙发改能源〔2026〕215号",
    summary: "加快新型储能规模化应用，推动工商业园区光储充一体化试点，明确虚拟电厂参与调峰调频交易规则。",
    link: "https://fzggw.zj.gov.cn/",
    files: [
      {
        name: "浙发改能源〔2026〕215号-浙江省关于支持源网荷储一体化实施意见.pdf",
        format: "PDF",
        size: "2.3 MB",
      },
      {
        name: "附件：源网荷储一体化试点项目申报指引与评审细则.docx",
        format: "DOCX",
        size: "780 KB",
      },
    ],
  },
  {
    id: "l7",
    fileType: "law",
    tag: "market",
    title: "山东省新型储能参与电力现货市场交易实施细则",
    region: "山东",
    source: "山东省能源局",
    date: "2026-07-22",
    agency: "山东省能源局",
    docNo: "鲁能源字〔2026〕108号",
    summary: "完善新型储能独立主体身份参与电力现货交易机制，规范储能电站容量补偿与辅助服务出清结算流程。",
    link: "http://nyj.shandong.gov.cn/",
    files: [
      {
        name: "鲁能源字〔2026〕108号-山东省新型储能参与电力现货交易细则.pdf",
        format: "PDF",
        size: "1.9 MB",
      },
      {
        name: "附件：独立储能电站出清报价曲线模板与结算公式.xlsx",
        format: "XLSX",
        size: "860 KB",
      },
    ],
  },
  {
    id: "l8",
    fileType: "law",
    tag: "manage",
    title: "广东省关于深化新型电力系统建设推动绿电就地消纳的通知",
    region: "广东",
    source: "广东省发展改革委",
    date: "2026-06-25",
    agency: "广东省发展改革委、广东省能源局",
    docNo: "粤发改能源函〔2026〕389号",
    summary: "推动分布式新能源配储并网调度，扩大绿电绿证交易覆盖面，支持高载能园区打造零碳制造基地。",
    link: "https://drc.gd.gov.cn/",
    files: [
      {
        name: "粤发改能源函〔2026〕389号-广东省深化新型电力系统建设通知.pdf",
        format: "PDF",
        size: "2.2 MB",
      },
      {
        name: "附件：分布式新能源绿电交易撮合与结算规程.pdf",
        format: "PDF",
        size: "1.1 MB",
      },
    ],
  },
  {
    id: "s1",
    fileType: "standard",
    tag: "vpp",
    title: "GB/T 40000-2026 电力需求响应系统通用技术要求",
    region: "全国",
    source: "国家市场监管总局",
    date: "2026-07-15",
    agency: "国家市场监督管理总局",
    docNo: "标准号：GB/T 40000-2026",
    summary: "规定电力需求响应系统的架构设计、子站终端采集通信、调度响应时延与检测验收规范。",
    scope: "适用于电力需求响应系统的设计、建设、运行与检测，涵盖主站系统、聚合子站与现场调控终端。",
    clauses: [
      "第 5.2 条：终端响应时延应不大于 15 分钟（快速型响应时延不大于 5 分钟）",
      "第 6.1 条：主站与子站通信接口应遵循 IEC 61850 规约及标准加密规范",
      "第 8.3 条：负荷采集精度不低于 0.5S 级，支持秒级状态心跳监测",
    ],
    link: "https://std.samr.gov.cn/",
    files: [
      {
        name: "GB-T_40000-2026_电力需求响应系统通用技术要求.pdf",
        format: "PDF",
        size: "4.5 MB",
      },
      {
        name: "附录文件：终端通信协议与接口测试用例集.docx",
        format: "DOCX",
        size: "1.3 MB",
      },
    ],
  },
  {
    id: "s2",
    fileType: "standard",
    tag: "vpp",
    title: "DL/T 2200-2025 虚拟电厂运营管理技术规范",
    region: "北京",
    source: "中国电力企业联合会",
    date: "2026-05-30",
    agency: "中国电力企业联合会",
    docNo: "标准号：DL/T 2200-2025",
    summary: "规定虚拟电厂聚合可调节资源接入、调度运行、计量结算与网络安全防护技术要求。",
    scope: "适用于第三方虚拟电厂运营商开展多元负荷聚合、调频调峰辅助服务及日前日前交易结算。",
    clauses: [
      "第 4.3 条：单座虚拟电厂聚合总调节能力不小于 5MW 方可参与省级市场出清",
      "第 7.2 条：应具备与电网调度机构的 AGC/AVC 自动发电协同控制通道",
      "第 9.1 条：平台系统网络安全防护等级应不低于国家信息安全等保三级",
    ],
    link: "https://www.cec.org.cn/",
    files: [
      {
        name: "DL-T_2200-2025_虚拟电厂运营管理技术规范.pdf",
        format: "PDF",
        size: "3.8 MB",
      },
    ],
  },
  {
    id: "s3",
    fileType: "standard",
    tag: "carbon",
    title: "GB/T 32150-2026 工业企业温室气体排放核算与报告通则",
    region: "全国",
    source: "国家市场监管总局",
    date: "2026-04-22",
    agency: "国家市场监督管理总局",
    docNo: "标准号：GB/T 32150-2026",
    summary: "规定工业企业温室气体排放核算边界、监测方法、排放因子选用与数据质量控制要求。",
    scope: "适用于各类工矿企业温室气体排放的年度核算、第三方核查与信息披露报告编制。",
    clauses: [
      "第 5.1 条：核算边界应全覆盖企业直接化石燃料燃烧排放与净购入电力热力隐含排放",
      "第 6.4 条：关键活动水平数据应保留原始凭证不少于 5 年，确保计量可追溯",
      "第 7.2 条：排放因子优先采用国家或地方主管部门实测发布值",
    ],
    link: "https://std.samr.gov.cn/",
    files: [
      {
        name: "GB-T_32150-2026_工业企业温室气体排放核算与报告通则.pdf",
        format: "PDF",
        size: "5.1 MB",
      },
      {
        name: "附录表：中国主要化石燃料碳排放因子与热值参考推荐表.xlsx",
        format: "XLSX",
        size: "620 KB",
      },
    ],
  },
  {
    id: "p1",
    fileType: "plan",
    tag: "storage",
    title: "“十五五”现代能源体系发展规划",
    region: "全国",
    source: "国家能源局",
    date: "2026-03-15",
    agency: "国家能源局",
    docNo: "国能发规划〔2026〕15号",
    summary: "明确构建新型电力系统顶层设计，部署大基地风光、新型储能装机目标与智慧微电网示范任务。",
    link: "https://www.nea.gov.cn/",
    files: [
      {
        name: "国能发规划〔2026〕15号-“十五五”现代能源体系规划正式文本.pdf",
        format: "PDF",
        size: "6.3 MB",
      },
    ],
  },
  {
    id: "p2",
    fileType: "plan",
    tag: "manage",
    title: "电力行业数字化转型行动指南（2026-2030）",
    region: "全国",
    source: "中国电力企业联合会",
    date: "2026-02-10",
    agency: "中国电力企业联合会",
    docNo: "中电联〔2026〕07号",
    summary: "指导发电、电网与售电企业应用人工智能、数字孪生与物联网技术推进能源数字化运营。",
    link: "https://www.cec.org.cn/",
    files: [
      {
        name: "中电联〔2026〕07号-电力行业数字化转型行动指南.pdf",
        format: "PDF",
        size: "4.2 MB",
      },
    ],
  },
  {
    id: "p3",
    fileType: "plan",
    tag: "factory",
    title: "广东省工业园区综合能源服务建设导则",
    region: "广东",
    source: "广东省能源局",
    date: "2026-01-20",
    agency: "广东省能源局",
    docNo: "粤能源〔2026〕03号",
    summary: "指导工业园区开展综合能源系统规划、分布式光储充协同控制与多能互补能效提升。",
    link: "https://drc.gd.gov.cn/",
    files: [
      {
        name: "粤能源〔2026〕03号-广东省工业园区综合能源服务建设导则.pdf",
        format: "PDF",
        size: "2.9 MB",
      },
      {
        name: "附件：零碳示范园区综合能效评价指标与验收考评表.docx",
        format: "DOCX",
        size: "720 KB",
      },
    ],
  },
  {
    id: "p4",
    fileType: "plan",
    tag: "storage",
    title: "四川省多能互补清洁能源基地建设方案",
    region: "四川",
    source: "四川省发展改革委",
    date: "2026-04-12",
    agency: "四川省发展和改革委员会、能源局",
    docNo: "川发改能源〔2026〕192号",
    summary: "依托金沙江与雅砻江流域水电外送走廊，推进大型水风光互补示范工程与抽水蓄能电站布局。",
    link: "http://fgw.sc.gov.cn/",
    files: [
      {
        name: "川发改能源〔2026〕192号-四川省水风光多能互补建设方案.pdf",
        format: "PDF",
        size: "3.5 MB",
      },
      {
        name: "附件：流域水风光一体化协调调度控制策略表.xlsx",
        format: "XLSX",
        size: "1.2 MB",
      },
    ],
  },
  {
    id: "l5",
    fileType: "law",
    tag: "scene",
    title: "关于促进车网互动（V2G）规模化应用的实施意见",
    region: "全国",
    source: "国家发展改革委",
    date: "2026-08-05",
    agency: "国家发展改革委、国家能源局",
    docNo: "发改能源〔2026〕980号",
    summary: "推动电动汽车与电网双向充放电互动，培育聚合调控应用场景，挖掘移动储能调节潜力。",
    link: "https://www.nea.gov.cn/",
    files: [
      {
        name: "发改能源〔2026〕980号-关于促进车网互动规模化应用的实施意见.pdf",
        format: "PDF",
        size: "2.6 MB",
      },
      {
        name: "附件：车网互动双向充放电设备并网安全技术规范.pdf",
        format: "PDF",
        size: "1.3 MB",
      },
    ],
  },
  {
    id: "d1",
    fileType: "marketdata",
    tag: "market",
    title: "江苏电力现货市场日前出清均价走势",
    region: "江苏",
    source: "江苏电力交易中心",
    date: "2026-09-18",
    agency: "江苏电力交易中心",
    docNo: "JS-PX-202609",
    summary: "江苏电力现货日前交易分时出清价格、峰谷价差波动与成交电量监测明细数据。",
    link: "https://pmos.js.sgcc.com.cn/",
    files: [
      {
        name: "江苏电力现货市场2026年9月分时出清明细数据.xlsx",
        format: "XLSX",
        size: "780 KB",
      },
      {
        name: "江苏电力现货日前交易月度运行分析月报.pdf",
        format: "PDF",
        size: "1.5 MB",
      },
    ],
    series: trend(17, 0.42, 0.08),
    metrics: [
      { label: "最新价", value: "0.468 元/kWh" },
      { label: "日涨跌幅", value: "+2.6%" },
      { label: "30日均价", value: "0.431 元/kWh" },
      { label: "成交电量", value: "3.82 亿kWh" },
    ],
  },
  {
    id: "d2",
    fileType: "marketdata",
    tag: "carbon",
    title: "全国碳市场 CEA 综合收盘价",
    region: "全国",
    source: "上海环境能源交易所",
    date: "2026-09-18",
    agency: "上海环境能源交易所",
    docNo: "CEA-SH-202609",
    summary: "全国碳排放配额（CEA）近30天挂牌协议与大宗协议综合收盘均价及换手统计。",
    link: "https://www.cmee.com.cn/",
    files: [
      {
        name: "全国碳市场CEA配额交易行情与大宗成交明细表.xlsx",
        format: "XLSX",
        size: "920 KB",
      },
    ],
    series: trend(41, 92, 6),
    metrics: [
      { label: "最新价", value: "98.5 元/吨" },
      { label: "日涨跌幅", value: "-1.2%" },
      { label: "30日均价", value: "94.7 元/吨" },
      { label: "成交量", value: "126 万吨" },
    ],
  },
  {
    id: "d3",
    fileType: "marketdata",
    tag: "vpp",
    title: "广东需求响应竞价出清价格",
    region: "广东",
    source: "广东电力交易中心",
    date: "2026-09-17",
    agency: "广东电力交易中心",
    docNo: "GD-DR-202609",
    summary: "广东削峰填谷需求响应日前竞价出清价格、各地区申报容量与中标结算统计。",
    link: "https://pmos.gd.csg.cn/",
    files: [
      {
        name: "广东削峰填谷需求响应日前竞价出清明细表.xlsx",
        format: "XLSX",
        size: "650 KB",
      },
    ],
    series: trend(63, 1.8, 0.25),
    metrics: [
      { label: "最新价", value: "2.35 元/kWh" },
      { label: "日涨跌幅", value: "+4.1%" },
      { label: "30日均价", value: "2.08 元/kWh" },
      { label: "中标容量", value: "1,240 MW" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trend(seed: number, base: number, vol: number): number[] {
  const out: number[] = [];
  let v = base;
  let s = seed;
  for (let i = 0; i < 30; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280 - 0.5;
    v = Math.max(base * 0.5, v + r * vol);
    out.push(Math.round(v * 100) / 100);
  }
  return out;
}

function MiniLineChart({ data, up }: { data: number[]; up: boolean }) {
  const w = 100;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stroke = up ? "#16a34a" : "#e11d48";
  const fill = up ? "rgba(22,163,74,0.10)" : "rgba(225,29,72,0.10)";
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / span) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-16">
      <polygon points={area} fill={fill} />
      <polyline points={line} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function downloadSingleFile(item: ResItem, file: PolicyAttachment) {
  const content = `===============================================================
文件名称：${file.name}
归属政策：${item.title}
===============================================================

【发文机关 / 归口机构】：${item.agency}
【文号 / 标准编号】：${item.docNo || "官方正式文件"}
【发布 / 实施日期】：${item.date}
【适用地区】：${item.region}
【信息来源】：${item.source}
【原始发布门户】：${item.link || "官方指定发布门户"}
【文件格式】：${file.format}
【文件大小】：${file.size}

---------------------------------------------------------------
一、文件概述与核心摘要
---------------------------------------------------------------
${item.summary || item.scope || "暂无详细摘要"}

${
  item.clauses && item.clauses.length > 0
    ? `---------------------------------------------------------------
二、核心技术条款与规范要求
---------------------------------------------------------------
${item.clauses.map((cl, i) => `${i + 1}. ${cl}`).join("\n\n")}
`
    : ""
}${
  item.metrics && item.metrics.length > 0
    ? `---------------------------------------------------------------
二、最新监测指标与市场数据
---------------------------------------------------------------
${item.metrics.map((m) => `• ${m.label}：${m.value}`).join("\n")}
`
    : ""
}
===============================================================
归档单位：智慧能源管理平台 · 政策法规与标准数据库
归档时间：${new Date().toISOString().slice(0, 10)}
===============================================================
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

function CheckRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-2.5 py-1.5 group text-left cursor-pointer">
      <span
        className={`w-4 h-4 rounded-[5px] border flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300 group-hover:border-blue-400"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DataResourceCenter() {
  const [fileTypes, setFileTypes] = useState<Set<FileType>>(new Set(FILE_TYPES.map((t) => t.key)));
  const [tags, setTags] = useState<Set<ContentTag>>(new Set(CONTENT_TAGS.map((t) => t.key)));
  const [selectedRegion, setSelectedRegion] = useState<string>("全部");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["l1"]));
  const [downloadedKeys, setDownloadedKeys] = useState<Set<string>>(new Set());

  const toggle = <T,>(set: Set<T>, val: T): Set<T> => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDownloadFile = (item: ResItem, file: PolicyAttachment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    downloadSingleFile(item, file);
    const key = `${item.id}-${file.name}`;
    setDownloadedKeys((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setDownloadedKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 2200);
  };

  const resetFilters = () => {
    setFileTypes(new Set(FILE_TYPES.map((t) => t.key)));
    setTags(new Set(CONTENT_TAGS.map((t) => t.key)));
    setSelectedRegion("全部");
    setExpandedIds(new Set(["l1"]));
  };

  const filtered = useMemo(() => {
    return ITEMS.filter((it) => {
      if (!fileTypes.has(it.fileType)) return false;
      if (!tags.has(it.tag)) return false;
      // Single-select region filter
      if (selectedRegion !== "全部") {
        if (it.region !== selectedRegion) return false;
      }
      return true;
    });
  }, [fileTypes, tags, selectedRegion]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ─── Left config ─── */}
      <div className="lg:col-span-4 space-y-4">
        {/* Panel: regions (简化单选) */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Map className="size-3.5 text-slate-400" /> 适用地区
            </h4>
            {selectedRegion !== "全部" && (
              <button
                type="button"
                onClick={() => setSelectedRegion("全部")}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
              >
                重置为全部
              </button>
            )}
          </div>

          {/* 单选下拉选择器 */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer appearance-none pr-8 shadow-2xs"
            >
              <option value="全部">全部地区 (包含全国及各省)</option>
              <option value="全国">全国 (国家级政策法规)</option>
              <optgroup label="各省 / 直辖市 / 自治区">
                {PROVINCES_LIST.filter((p) => p !== "全国").map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 快捷单选标签 */}
          <div className="flex items-center flex-wrap gap-1 pt-0.5">
            {["全部", "全国", "江苏", "广东", "浙江", "山东", "河北", "四川"].map((p) => {
              const active = selectedRegion === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedRegion(p)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 font-bold shadow-2xs"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel: file types */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Filter className="size-3.5 text-slate-400" /> 文件类型
          </h4>
          {FILE_TYPES.map((t) => {
            const Icon = t.icon;
            const checked = fileTypes.has(t.key);
            return (
              <CheckRow key={t.key} checked={checked} onToggle={() => setFileTypes(toggle(fileTypes, t.key))}>
                <span className={`p-1 rounded-md border ${t.tag}`}>
                  <Icon className="size-3.5" />
                </span>
                <span className="flex-1 text-xs font-bold text-slate-700">{t.name}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 tabular-nums">
                  {t.count.toLocaleString()}
                </span>
              </CheckRow>
            );
          })}
        </div>

        {/* Panel: content tags */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            内容标签
          </h4>
          {CONTENT_TAGS.map((t) => {
            const checked = tags.has(t.key);
            return (
              <CheckRow key={t.key} checked={checked} onToggle={() => setTags(toggle(tags, t.key))}>
                <span className="flex-1 text-xs font-medium text-slate-600">{t.name}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 tabular-nums">
                  {t.count.toLocaleString()}
                </span>
              </CheckRow>
            );
          })}
        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="w-full h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <RotateCcw className="size-3.5" /> 重置筛选
        </button>
      </div>

      {/* ─── Right results ─── */}
      <div className="lg:col-span-8 flex flex-col min-h-0">
        {/* Count only (No 全部展开 / 全部收起 buttons) */}
        <div className="flex items-center justify-between py-2 flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-600">
            共 <span className="text-blue-600 font-extrabold">{filtered.length}</span> 条政策与数据资源
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[58vh] space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-3 py-10">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <FolderOpen className="size-9 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">暂无匹配的数据资源，请调整地区或筛选条件</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="size-3.5" /> 重置筛选
              </button>
            </div>
          ) : (
            filtered.map((it) => {
              const meta = FILE_BY_KEY[it.fileType];
              const tagMeta = TAG_BY_KEY[it.tag];
              const Icon = meta.icon;
              const open = expandedIds.has(it.id);

              return (
                <div
                  key={it.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    open
                      ? "border-blue-300 bg-blue-50/20 shadow-xs ring-1 ring-blue-100"
                      : "border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xs"
                  }`}
                >
                  {/* Clickable Card Header (Click to expand/collapse without separate button) */}
                  <div
                    onClick={() => toggleCard(it.id)}
                    className="flex items-start gap-3 p-3.5 cursor-pointer select-none group transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleCard(it.id);
                      }
                    }}
                  >
                    <span className={`p-1.5 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-105 ${meta.tag}`}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${meta.tag}`}>{meta.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${tagMeta.chip}`}>{tagMeta.name}</span>
                        {it.docNo && it.docNo !== "—" && (
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block truncate max-w-[200px]">
                            {it.docNo}
                          </span>
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-slate-800 mt-1 leading-snug group-hover:text-blue-600 transition-colors">
                        {it.title}
                      </h5>
                      <div className="flex items-center gap-x-3 gap-y-0.5 mt-1 flex-wrap text-[11px] text-slate-400">
                        <span className="font-medium text-slate-600">{it.agency}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-medium text-blue-600 bg-blue-50/80 px-1.5 py-0.2 rounded">{it.region}</span>
                        <span className="text-slate-300">·</span>
                        <span>{it.source}</span>
                        <span className="text-slate-300">·</span>
                        <span>{it.date}</span>
                      </div>
                    </div>

                    {/* Expand / Collapse Indicator */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold pl-2 pt-0.5">
                      <span className={`text-[11px] transition-colors ${open ? "text-blue-600 font-bold" : "text-slate-400 group-hover:text-blue-600"}`}>
                        {open ? "收起" : "展开"}
                      </span>
                      <div
                        className={`size-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          open
                            ? "bg-blue-100 text-blue-600 rotate-180"
                            : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <ChevronDown className="size-3.5 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {open && (
                    <div className="border-t border-blue-100/80 px-4 py-4 bg-white/70">
                      <ItemDetail
                        item={it}
                        downloadedKeys={downloadedKeys}
                        onDownloadFile={(file, e) => handleDownloadFile(it, file, e)}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="flex-none pt-3 mt-1 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            已收录 4,565 条政策法规与市场标准数据，覆盖全国与各省市。数据来源：国家发改委、国家能源局、工信部、生态环境部、各省能源局与电力交易中心。
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Component ──────────────────────────────────────────────────────────

function DetailHead({ items }: { items: { icon: typeof Building2; label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
      {items.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.label} className="bg-slate-50/90 rounded-lg px-2.5 py-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Icon className="size-3 text-slate-400" /> {m.label}
            </span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5 leading-snug truncate" title={m.value}>
              {m.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ItemDetail({
  item,
  downloadedKeys,
  onDownloadFile,
}: {
  item: ResItem;
  downloadedKeys: Set<string>;
  onDownloadFile: (file: PolicyAttachment, e: React.MouseEvent) => void;
}) {
  const isStandard = item.fileType === "standard";
  const isMarket = item.fileType === "marketdata";

  return (
    <div className="space-y-3.5 text-left">
      {/* 4-column Meta Grid */}
      <DetailHead
        items={[
          { icon: Building2, label: isStandard ? "归口单位" : isMarket ? "运营机构" : "发文机关", value: item.agency },
          { icon: Hash, label: isStandard ? "标准编号" : isMarket ? "指标代码" : "文件字号", value: item.docNo || "官方正式文件" },
          { icon: CalendarDays, label: isMarket ? "更新时间" : "发布日期", value: item.date },
          { icon: Map, label: "适用区域", value: item.region },
        ]}
      />

      {/* Summary / Scope */}
      <div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {isStandard ? "适用范围与对象" : isMarket ? "数据说明与口径" : "政策核心摘要"}
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/90 p-2.5 rounded-lg border border-slate-100">
          {isStandard ? item.scope || item.summary : item.summary}
        </p>
      </div>

      {/* Clauses if standard (key technical clauses, no general points) */}
      {item.clauses && item.clauses.length > 0 && (
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <BookMarked className="size-3 text-violet-500" /> 关键技术条款
          </div>
          <div className="space-y-1.5">
            {item.clauses.map((cl, i) => (
              <div
                key={i}
                className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50/70 px-3 py-2 rounded-lg border border-slate-100 font-mono text-[11px]"
              >
                <span className="size-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{cl}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market series & metrics if marketdata */}
      {isMarket && (
        <>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">近30天走势分析</span>
              {item.series && item.series.length > 1 && (
                <span className={`text-[11px] font-bold ${item.series[item.series.length - 1] >= item.series[0] ? "text-emerald-600" : "text-rose-600"}`}>
                  {item.series[item.series.length - 1] >= item.series[0] ? "↑ 总体上行" : "↓ 总体下行"}
                </span>
              )}
            </div>
            {item.series && <MiniLineChart data={item.series} up={(item.series[item.series.length - 1] ?? 0) >= (item.series[0] ?? 0)} />}
          </div>

          {item.metrics && item.metrics.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">最新市场成交指标</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {item.metrics.map((m, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-2xs">
                    <div className="text-[10px] text-slate-400 mb-0.5">{m.label}</div>
                    <div className="text-xs font-bold text-slate-800">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 实际文件列表与下载（支持多个实际文件，显示文件名与下载） */}
      {item.files && item.files.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileDown className="size-3.5 text-blue-500" />
              政策原始文件与附件 ({item.files.length} 份)
            </span>
          </div>
          <div className="space-y-1.5">
            {item.files.map((file, i) => {
              const fileKey = `${item.id}-${file.name}`;
              const isDownloaded = downloadedKeys.has(fileKey);
              const formatBadge =
                file.format === "PDF"
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : file.format === "XLSX"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : file.format === "DOCX"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-amber-50 text-amber-700 border-amber-200";

              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${formatBadge} flex-shrink-0`}>
                      {file.format}
                    </span>
                    <span className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap hidden sm:inline-block">
                      {file.size}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onDownloadFile(file, e)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap shadow-2xs flex-shrink-0 ${
                      isDownloaded
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="size-3 text-emerald-600" strokeWidth={2.5} />
                        <span>已下载</span>
                      </>
                    ) : (
                      <>
                        <Download className="size-3 text-slate-400 group-hover:text-blue-600" />
                        <span>下载</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 访问发布页按钮（无需额外描述） */}
      {item.link && (
        <div className="pt-2 border-t border-slate-100 flex items-center">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-lg transition-all shadow-2xs cursor-pointer group/link"
          >
            <ExternalLink className="size-3.5 text-slate-400 group-hover/link:text-blue-600 transition-colors" />
            <span>访问原始发布页</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default DataResourceCenter;
