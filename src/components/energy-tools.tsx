import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Sun, 
  Coins, 
  Leaf, 
  Calculator, 
  Info, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Trees, 
  Layers, 
  HelpCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  X, 
  ArrowRight, 
  TrendingDown, 
  Globe, 
  Award,
  Flame,
  BookOpen,
  RotateCcw,
  Compass
} from "lucide-react";
import { DemandResponsePanel } from "./DemandResponsePanel";
import { DataResourceCenter } from "./DataResourceCenter";
import { 
  CHINA_SOLAR_PROVINCES, 
  POPULAR_SOLAR_PROVINCES,
  POPULAR_SOLAR_CITIES, 
  getProvinceSolarProfile,
  findProvinceAndCity, 
  ProvinceSolarData, 
  CitySolarData 
} from "../data/solar-radiation-data";

// Types for electricity pricing
interface PricePeriod {
  start: number; // hour (0-23)
  end: number;   // hour (1-24)
  type: "deep-peak" | "peak" | "flat" | "valley";
  price: number; // CNY/kWh
}

interface RegionData {
  name: string;
  id: string;
  summer: PricePeriod[];
  nonSummer: PricePeriod[];
}

const REGIONS: RegionData[] = [
  {
    name: "江苏省 (Jiangsu)",
    id: "jiangsu",
    summer: [
      { start: 0, end: 8, type: "valley", price: 0.33 },
      { start: 8, end: 11, type: "peak", price: 1.12 },
      { start: 11, end: 14, type: "flat", price: 0.65 },
      { start: 14, end: 15, type: "deep-peak", price: 1.38 },
      { start: 15, end: 17, type: "flat", price: 0.65 },
      { start: 17, end: 20, type: "peak", price: 1.12 },
      { start: 20, end: 21, type: "deep-peak", price: 1.38 },
      { start: 21, end: 22, type: "peak", price: 1.12 },
      { start: 22, end: 24, type: "flat", price: 0.65 }
    ],
    nonSummer: [
      { start: 0, end: 8, type: "valley", price: 0.33 },
      { start: 8, end: 11, type: "peak", price: 1.05 },
      { start: 11, end: 14, type: "flat", price: 0.63 },
      { start: 14, end: 17, type: "flat", price: 0.63 },
      { start: 17, end: 22, type: "peak", price: 1.05 },
      { start: 22, end: 24, type: "flat", price: 0.63 }
    ]
  },
  {
    name: "浙江省 (Zhejiang)",
    id: "zhejiang",
    summer: [
      { start: 0, end: 8, type: "valley", price: 0.32 },
      { start: 8, end: 9, type: "flat", price: 0.69 },
      { start: 9, end: 11, type: "peak", price: 1.18 },
      { start: 11, end: 13, type: "deep-peak", price: 1.45 },
      { start: 13, end: 15, type: "flat", price: 0.69 },
      { start: 15, end: 17, type: "peak", price: 1.18 },
      { start: 17, end: 19, type: "deep-peak", price: 1.45 },
      { start: 19, end: 21, type: "peak", price: 1.18 },
      { start: 21, end: 22, type: "flat", price: 0.69 },
      { start: 22, end: 24, type: "valley", price: 0.32 }
    ],
    nonSummer: [
      { start: 0, end: 8, type: "valley", price: 0.32 },
      { start: 8, end: 9, type: "flat", price: 0.66 },
      { start: 9, end: 11, type: "peak", price: 1.08 },
      { start: 11, end: 13, type: "peak", price: 1.08 },
      { start: 13, end: 15, type: "flat", price: 0.66 },
      { start: 15, end: 17, type: "peak", price: 1.08 },
      { start: 17, end: 19, type: "peak", price: 1.08 },
      { start: 19, end: 21, type: "peak", price: 1.08 },
      { start: 21, end: 22, type: "flat", price: 0.66 },
      { start: 22, end: 24, type: "valley", price: 0.32 }
    ]
  },
  {
    name: "上海市 (Shanghai)",
    id: "shanghai",
    summer: [
      { start: 0, end: 6, type: "valley", price: 0.35 },
      { start: 6, end: 8, type: "flat", price: 0.72 },
      { start: 8, end: 11, type: "peak", price: 1.25 },
      { start: 11, end: 18, type: "flat", price: 0.72 },
      { start: 18, end: 21, type: "peak", price: 1.25 },
      { start: 21, end: 22, type: "flat", price: 0.72 },
      { start: 22, end: 24, type: "valley", price: 0.35 }
    ],
    nonSummer: [
      { start: 0, end: 6, type: "valley", price: 0.35 },
      { start: 6, end: 8, type: "flat", price: 0.68 },
      { start: 8, end: 11, type: "peak", price: 1.15 },
      { start: 11, end: 18, type: "flat", price: 0.68 },
      { start: 18, end: 21, type: "peak", price: 1.15 },
      { start: 21, end: 22, type: "flat", price: 0.68 },
      { start: 22, end: 24, type: "valley", price: 0.35 }
    ]
  },
  {
    name: "广东省 (Guangdong)",
    id: "guangdong",
    summer: [
      { start: 0, end: 8, type: "valley", price: 0.31 },
      { start: 8, end: 9, type: "flat", price: 0.67 },
      { start: 9, end: 11, type: "peak", price: 1.15 },
      { start: 11, end: 12, type: "deep-peak", price: 1.35 },
      { start: 12, end: 14, type: "flat", price: 0.67 },
      { start: 14, end: 15, type: "peak", price: 1.15 },
      { start: 15, end: 16, type: "deep-peak", price: 1.35 },
      { start: 16, end: 17, type: "peak", price: 1.15 },
      { start: 17, end: 19, type: "flat", price: 0.67 },
      { start: 19, end: 22, type: "peak", price: 1.15 },
      { start: 22, end: 24, type: "flat", price: 0.67 }
    ],
    nonSummer: [
      { start: 0, end: 8, type: "valley", price: 0.31 },
      { start: 8, end: 9, type: "flat", price: 0.64 },
      { start: 9, end: 12, type: "peak", price: 1.05 },
      { start: 12, end: 14, type: "flat", price: 0.64 },
      { start: 14, end: 17, type: "peak", price: 1.05 },
      { start: 17, end: 19, type: "flat", price: 0.64 },
      { start: 19, end: 22, type: "peak", price: 1.05 },
      { start: 22, end: 24, type: "flat", price: 0.64 }
    ]
  }
];

export function EnergyTools({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const [activeModal, setActiveModal] = useState<"price" | "solar" | "revenue" | "carbon" | "demand" | "policy" | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (activeModal !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeModal]);

  // Tab 2: Solar states & Nationwide Province-level selection
  const [solarProvinceId, setSolarProvinceId] = useState<string>("jiangsu");

  // Provincial Solar Profile (权威气象与理论等效发电基准，不可手动篡改等效小时，自动绑定所选省份)
  const currentProvinceProfile = useMemo(() => {
    return getProvinceSolarProfile(solarProvinceId);
  }, [solarProvinceId]);

  const [solarCapacity, setSolarCapacity] = useState<number>(150); // in kWp
  const [tiltFactor, setTiltFactor] = useState<number>(0.95); // tilt correction factor (0.8 - 1.0)
  const SYSTEM_PR = 0.80; // 固定行业基准综合PR能效比 80% (标准N型光伏系统)

  // Handle province change: update province
  const handleSelectProvince = (provId: string) => {
    setSolarProvinceId(provId);
  };
  
  // Tab 1: Pricing states
  const [selectedRegionId, setSelectedRegionId] = useState<string>("jiangsu");
  const [isSummer, setIsSummer] = useState<boolean>(true);
  const [queryKwh, setQueryKwh] = useState<number>(2000);
  const [loadType, setLoadType] = useState<"normal" | "night" | "day">("normal");

  // Tab 3: Revenue states
  const [unitCost, setUnitCost] = useState<number>(3.6); // CNY/W
  const [selfUseRatio, setSelfUseRatio] = useState<number>(75); // % self consumed
  const [gridPrice, setGridPrice] = useState<number>(0.39); // Grid sell price (feed-in tariff)
  const [factoryPrice, setFactoryPrice] = useState<number>(0.85); // Normal factory price saved
  const [maintenancePercent, setMaintenancePercent] = useState<number>(1.2); // Annual maintenance as % of initial investment

  // Tab 4: Carbon states
  const [customKwhSaved, setCustomKwhSaved] = useState<number>(180000);
  const [isSyncedWithSolar, setIsSyncedWithSolar] = useState<boolean>(true);

  // --- Calculations ---

  // Selected Region Pricing Array
  const currentRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];
  const activePeriods = isSummer ? currentRegion.summer : currentRegion.nonSummer;

  // Pricing Helpers
  const getPeriodForHour = (hour: number): PricePeriod => {
    return activePeriods.find(p => hour >= p.start && hour < p.end) || activePeriods[0];
  };

  // Calculate Average Pricing & Distribution for Query Kwh
  const getRatioForPeriodType = (type: "deep-peak" | "peak" | "flat" | "valley"): number => {
    if (loadType === "night") {
      if (type === "valley") return 0.65;
      if (type === "flat") return 0.25;
      if (type === "peak") return 0.10;
      return 0.0;
    }
    if (loadType === "day") {
      if (type === "deep-peak") return 0.15;
      if (type === "peak") return 0.45;
      if (type === "flat") return 0.30;
      return 0.10;
    }
    // Normal load
    if (type === "deep-peak") return 0.05;
    if (type === "peak") return 0.35;
    if (type === "flat") return 0.35;
    return 0.25;
  };

  const calculatedCosts = () => {
    let totalCost = 0;
    const details = {
      "deep-peak": { kwh: 0, cost: 0, price: 0 },
      "peak": { kwh: 0, cost: 0, price: 0 },
      "flat": { kwh: 0, cost: 0, price: 0 },
      "valley": { kwh: 0, cost: 0, price: 0 },
    };

    Object.keys(details).forEach(key => {
      const type = key as "deep-peak" | "peak" | "flat" | "valley";
      const ratio = getRatioForPeriodType(type);
      const kwh = queryKwh * ratio;
      const period = activePeriods.find(p => p.type === type);
      const price = period ? period.price : 0.6;
      const cost = kwh * price;
      
      details[type] = { kwh, cost, price };
      totalCost += cost;
    });

    const avgPrice = queryKwh > 0 ? totalCost / queryKwh : 0;
    return { totalCost, avgPrice, details };
  };

  const costResults = calculatedCosts();

  // Tab 2 Math: Solar Generation (严格依据省级权威基准等效日照与80%标称系统PR)
  const sunshineHours = currentProvinceProfile.dailyHours;
  const dailySolarGeneration = solarCapacity * sunshineHours * SYSTEM_PR * tiltFactor;
  const annualSolarGeneration = dailySolarGeneration * 365;
  
  const monthlyWeights = (currentProvinceProfile.monthlyWeights && currentProvinceProfile.monthlyWeights.length === 12)
    ? currentProvinceProfile.monthlyWeights
    : [0.06, 0.07, 0.09, 0.10, 0.11, 0.11, 0.10, 0.09, 0.09, 0.08, 0.06, 0.04];
  const monthlySolarData = monthlyWeights.map((weight, index) => {
    const monthKwh = annualSolarGeneration * weight;
    return {
      month: `${index + 1}月`,
      kwh: Math.round(monthKwh),
      daysOfSun: Math.round(15 + weight * 120),
      weight
    };
  });

  // Tab 3 Math: ROI & Cash Flow
  const totalInvestment = solarCapacity * 1000 * unitCost; // CNY
  const annualSolarKwh = annualSolarGeneration;
  const solarSelfConsumed = annualSolarKwh * (selfUseRatio / 100);
  const solarOnGrid = annualSolarKwh * (1 - selfUseRatio / 100);
  
  const annualSavingsSelf = solarSelfConsumed * factoryPrice;
  const annualRevenueOnGrid = solarOnGrid * gridPrice;
  const grossAnnualRevenue = annualSavingsSelf + annualRevenueOnGrid;
  const annualMaintenanceCost = totalInvestment * (maintenancePercent / 100);
  const netAnnualRevenue = grossAnnualRevenue - annualMaintenanceCost;
  
  const paybackPeriod = netAnnualRevenue > 0 ? totalInvestment / netAnnualRevenue : 99;
  const returnOnInvestment = totalInvestment > 0 ? (netAnnualRevenue / totalInvestment) * 100 : 0;

  const cashFlows = Array.from({ length: 15 }, (_, i) => {
    const year = i + 1;
    let totalRevenueSoFar = 0;
    for (let y = 1; y <= year; y++) {
      const degradation = Math.pow(0.992, y - 1);
      totalRevenueSoFar += netAnnualRevenue * degradation;
    }
    const cumulativeValue = totalRevenueSoFar - totalInvestment;
    return {
      year: `第${year}年`,
      yearIndex: year,
      totalRevenue: Math.round(totalRevenueSoFar),
      balance: Math.round(cumulativeValue),
      isPositive: cumulativeValue >= 0,
      isPaybackYear: Math.ceil(paybackPeriod) === year
    };
  });

  // Tab 4 Math: Carbon Calculations
  const targetKwh = isSyncedWithSolar ? annualSolarGeneration : customKwhSaved;
  const co2Savings = targetKwh * 0.5703 / 1000; // Tons
  const coalSavings = targetKwh * 0.328 / 1000; // Tons
  const equivalentTrees = (co2Savings * 1000) / 18.3; // 18.3 kg CO2 annually per tree
  const equivalentCarTours = co2Savings / 4.8; // 4.8 tons CO2 annually per car

  return (
    <div className={variant === "sidebar" ? "w-full" : "space-y-6"} id="energy-tools-section">
      
      {/* Title block */}
      {isMobile && activeModal !== null ? (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm shadow-slate-100/40">
          <button
            onClick={() => setActiveModal(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 active:text-slate-900 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl transition-all hover:bg-slate-100 active:scale-95"
          >
            <ChevronRight className="size-4 rotate-180 text-slate-400" />
            返回工具箱
          </button>
          
          <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100/40 px-3 py-1.5 rounded-xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold">
              核算容量: <span className="text-emerald-600 font-black">{solarCapacity} kWp</span>
            </span>
          </div>
        </div>
      ) : variant !== "sidebar" ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-green-50 text-green-600">
                <Calculator className="size-5" />
              </span>
              <h3 className="text-base font-bold text-slate-800">能效核算百宝箱</h3>
            </div>
            <p className="text-xs text-slate-500">
              精细化电网价格、光伏理论模拟、投资回收期及低碳生态转化等多维分析工具。
            </p>
          </div>
          
          {/* Dynamic global settings indicator */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-500 font-bold">
              共享核算容量: <span className="text-emerald-600 font-black">{solarCapacity} kWp</span>
            </span>
          </div>
        </div>
      ) : null}

      {/* Grid of 6 Independent Widget Cards */}
      {(!isMobile || activeModal === null) && variant !== "sidebar" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: 需求响应测算 */}
        <div 
          onClick={() => setActiveModal("demand")}
          className="bg-white hover:bg-slate-50/35 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-100/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[175px] relative overflow-hidden"
          id="btn-demand-tool"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
                <Flame className="size-5" />
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">收益测算</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                需求响应测算
                <ArrowRight className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                覆盖江苏、广东、重庆等多地政策，实时测算削峰填谷与容量补贴收益。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-[11px] font-bold text-slate-500">
            <span>政策收益最高达</span>
            <span className="text-rose-600 font-extrabold">15.00 元/kWh</span>
          </div>
        </div>

        {/* Card 2: 政策与数据查询 */}
        <div 
          onClick={() => setActiveModal("policy")}
          className="bg-white hover:bg-slate-50/35 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-100/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[175px] relative overflow-hidden"
          id="btn-policy-tool"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <BookOpen className="size-5" />
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">标准法规</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                政策法规查询
                <ArrowRight className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                全库收录4,500+条电力市场、双碳减排、能管规范及现货出清数据。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-[11px] font-bold text-slate-500">
            <span>已收录政策数据</span>
            <span className="text-blue-600 font-extrabold">4,565+ 条</span>
          </div>
        </div>

        {/* Card 3: 电价时段查询 */}
        <div 
          onClick={() => setActiveModal("price")}
          className="bg-white hover:bg-slate-50/35 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-100/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[175px] relative overflow-hidden"
          id="btn-price-tool"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
                <Zap className="size-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">分时费率</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                分时电价查询
                <ArrowRight className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                实时对比尖峰平谷时段电费，精准推演工厂在不同用电时段的最佳负荷。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-[11px] font-bold text-slate-500">
            <span>当前时段均价</span>
            <span className="text-amber-600">￥{costResults.avgPrice.toFixed(2)} /度</span>
          </div>
        </div>

        {/* Card 4: 理论发电量 */}
        <div 
          onClick={() => setActiveModal("solar")}
          className="bg-white hover:bg-slate-50/35 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-100/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[175px] relative overflow-hidden"
          id="btn-solar-tool"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
                <Sun className="size-5" />
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                  {currentProvinceProfile.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                  {currentProvinceProfile.zone}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                理论发电测算
                <ArrowRight className="size-3.5 text-slate-400 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                覆盖全国34个省级行政区气象基准，年等效约 {currentProvinceProfile.annualHours}h，推导全年理论绿电产能。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-[11px] font-bold text-slate-500">
            <span>测算年总产电 ({solarCapacity}kWp)</span>
            <span className="text-orange-600 font-extrabold">{Math.round(annualSolarGeneration).toLocaleString()} 度</span>
          </div>
        </div>

        {/* Card 5: 收益测算 */}
        <div 
          onClick={() => setActiveModal("revenue")}
          className="bg-white hover:bg-slate-50/35 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-100/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[175px] relative overflow-hidden"
          id="btn-revenue-tool"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
                <Coins className="size-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">ROI测算</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                项目收益评估
                <ArrowRight className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                结合单瓦造价与自用消纳比例，动态预估静态回本周期及累积现金流。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-[11px] font-bold text-slate-500">
            <span>预估回收周期</span>
            <span className="text-emerald-600">{paybackPeriod.toFixed(1)} 年回本</span>
          </div>
        </div>

        {/* Card 6: 减排测算 */}
        <div 
          onClick={() => setActiveModal("carbon")}
          className="bg-white hover:bg-slate-50/35 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-100/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[175px] relative overflow-hidden"
          id="btn-carbon-tool"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-green-50 text-green-600 group-hover:scale-110 transition-transform">
                <Leaf className="size-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">环境指标</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                节能减排分析
                <ArrowRight className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                精准计算CO₂减排吨数，标煤节约量，并还原为植树生态等效值。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-[11px] font-bold text-slate-500">
            <span>年吸碳等效植树</span>
            <span className="text-green-600">{Math.round(equivalentTrees).toLocaleString()} 棵杉树</span>
          </div>
        </div>

      </div>
      )}

      {/* Sidebar Variant Grid */}
      {(!isMobile || activeModal === null) && variant === "sidebar" && (
        <div className="grid grid-cols-2 gap-2.5">
          <button 
            onClick={() => setActiveModal("demand")}
            className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-rose-50/50 border border-slate-100 hover:border-rose-100 p-2.5 md:p-3 rounded-xl transition-all cursor-pointer group text-left"
          >
            <span className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:scale-110 transition-transform">
              <Flame className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-700 block truncate">需求响应</span>
              <span className="text-[10px] text-slate-400 block truncate">收益测算</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal("policy")}
            className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-100 p-2.5 md:p-3 rounded-xl transition-all cursor-pointer group text-left"
          >
            <span className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
              <BookOpen className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-700 block truncate">政策法规</span>
              <span className="text-[10px] text-slate-400 block truncate">智库查询</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal("price")}
            className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-100 p-2.5 md:p-3 rounded-xl transition-all cursor-pointer group text-left"
          >
            <span className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
              <Zap className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-700 block truncate">电价查询</span>
              <span className="text-[10px] text-slate-400 block truncate">分时费率</span>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveModal("solar")}
            className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-orange-50/50 border border-slate-100 hover:border-orange-100 p-2.5 md:p-3 rounded-xl transition-all cursor-pointer group text-left"
          >
            <span className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform">
              <Sun className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-700 block truncate">理论发电</span>
              <span className="text-[10px] text-slate-400 block truncate">气象模拟</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal("revenue")}
            className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-100 p-2.5 md:p-3 rounded-xl transition-all cursor-pointer group text-left"
          >
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
              <Coins className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-700 block truncate">收益测算</span>
              <span className="text-[10px] text-slate-400 block truncate">ROI回本</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal("carbon")}
            className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-green-50/50 border border-slate-100 hover:border-green-100 p-2.5 md:p-3 rounded-xl transition-all cursor-pointer group text-left"
          >
            <span className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:scale-110 transition-transform">
              <Leaf className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-700 block truncate">减排测算</span>
              <span className="text-[10px] text-slate-400 block truncate">生态指标</span>
            </div>
          </button>
        </div>
      )}

      {/* --- Overlay Modals for Individual Tools (Portalled to document.body for global backdrop covering header & sidebar) --- */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeModal !== null && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
              onClick={(e) => {
                if (e.target === e.currentTarget) setActiveModal(null);
              }}
            >
              {/* Modal Backdrop overlay covering entire window, sidebar, and header */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                id="modal-backdrop"
              />

              {/* Modal Body Container */}
              <motion.div 
                initial={{ scale: 0.96, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className={`bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-2xl relative w-full ${
                  activeModal === "demand" || activeModal === "policy" ? "max-w-5xl" : "max-w-4xl"
                } max-h-[90vh] overflow-y-auto z-10 flex flex-col`}
                id="tool-modal-body"
              >
              {/* Sticky Header inside modal */}
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between z-30">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  {activeModal === "demand" && (
                    <>
                      <span className="p-1.5 md:p-2 rounded-xl bg-rose-50 text-rose-500 flex-shrink-0">
                        <Flame className="size-4 md:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 truncate">电力需求响应与负荷调节收益测算</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 truncate">全国重点省市多档次需求响应补贴政策库与精准收益测算</p>
                      </div>
                    </>
                  )}
                  {activeModal === "policy" && (
                    <>
                      <span className="p-1.5 md:p-2 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                        <BookOpen className="size-4 md:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 truncate">政策法规与市场数据智能资源库</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 truncate">收录4,500+项国家及地方标准、电力交易与碳市场出清走势</p>
                      </div>
                    </>
                  )}
                  {activeModal === "price" && (
                    <>
                      <span className="p-1.5 md:p-2 rounded-xl bg-amber-50 text-amber-500 flex-shrink-0">
                        <Zap className="size-4 md:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 truncate">分时电价时段查询与成本测算</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 truncate">实时计算各省市峰谷电价差及总电费占比</p>
                      </div>
                    </>
                  )}
                  {activeModal === "solar" && (
                    <>
                      <span className="p-1.5 md:p-2 rounded-xl bg-orange-50 text-orange-500 flex-shrink-0">
                        <Sun className="size-4 md:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 truncate">理论光伏发电测算 (全国各省气象等效库)</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                            {currentProvinceProfile.name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            {currentProvinceProfile.zone} (基准 {currentProvinceProfile.annualHours}h)
                          </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 truncate">覆盖全国34个省级行政区，内置权威年等效利用小时与日均辐射，支持容量与综合PR动态仿真</p>
                      </div>
                    </>
                  )}
                  {activeModal === "revenue" && (
                    <>
                      <span className="p-1.5 md:p-2 rounded-xl bg-emerald-50 text-emerald-500 flex-shrink-0">
                        <Coins className="size-4 md:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 truncate">项目投资回报与收益推演</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 truncate">依据消纳比例和成本评估项目的静态回收期</p>
                      </div>
                    </>
                  )}
                  {activeModal === "carbon" && (
                    <>
                      <span className="p-1.5 md:p-2 rounded-xl bg-green-50 text-green-600 flex-shrink-0">
                        <Leaf className="size-4 md:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 truncate">节能减排与社会生态指标</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 truncate">核算社会环保生态效益及二氧化碳减排贡献</p>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer flex-shrink-0 ml-2"
                  aria-label="Close"
                >
                  <X className="size-4 md:size-5" />
                </button>
              </div>

              {/* Modal Contents Scroll Box */}
              <div className={isMobile ? "p-4 space-y-5" : "p-6 md:p-8"}>
                
                {/* 0. 需求响应测算工具 */}
                {activeModal === "demand" && (
                  <DemandResponsePanel />
                )}

                {/* 0.1 政策法规与市场数据查询工具 */}
                {activeModal === "policy" && (
                  <DataResourceCenter />
                )}

                {/* 1. Price tool */}
                {activeModal === "price" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Params */}
                    <div className="lg:col-span-4 space-y-5">
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-slate-400" /> 区域与季节定价
                        </h4>
                        
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">选择省市费率</label>
                          <select 
                            value={selectedRegionId} 
                            onChange={(e) => setSelectedRegionId(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-green-500 text-slate-700"
                          >
                            {REGIONS.map(r => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 block">执行时段/季节</label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <button
                              onClick={() => setIsSummer(true)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isSummer 
                                  ? "bg-amber-50 text-amber-700 border-amber-200" 
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              夏季 (7-8月)
                            </button>
                            <button
                              onClick={() => setIsSummer(false)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                !isSummer 
                                  ? "bg-sky-50 text-sky-700 border-sky-200" 
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              非夏季 (其他)
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Calculator className="size-3.5 text-slate-400" /> 用能测算设置
                        </h4>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                            <span>用电负荷（测试单周期）</span>
                            <span className="text-green-600 font-extrabold">{queryKwh.toLocaleString()} 度/kWh</span>
                          </label>
                          <input
                            type="range"
                            min="500"
                            max="10000"
                            step="500"
                            value={queryKwh}
                            onChange={(e) => setQueryKwh(Number(e.target.value))}
                            className="w-full accent-amber-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                          />
                          <div className="flex gap-2">
                            {[1000, 3000, 5000, 8000].map(val => (
                              <button 
                                key={val}
                                onClick={() => setQueryKwh(val)}
                                className={`flex-1 text-[10px] py-1 border rounded font-bold transition-all cursor-pointer ${
                                  queryKwh === val 
                                    ? "bg-slate-800 text-white border-slate-800" 
                                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {val >= 1000 ? `${val/1000}千` : val}度
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">工厂生产排班负荷</label>
                          <select 
                            value={loadType} 
                            onChange={(e) => setLoadType(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-green-500 text-slate-700"
                          >
                            <option value="normal">标准平稳型 (峰谷负荷均摊)</option>
                            <option value="night">夜间生产型 (峰谷低夜间加工)</option>
                            <option value="day">日间办公型 (日间密集白班生产)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Right Viz */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Clock className="size-4 text-amber-500" />
                            24小时峰谷平尖时段分布谱图
                          </h5>
                          <div className="flex items-center gap-3 text-[10px] font-bold">
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> 尖峰</span>
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500"></span> 高峰</span>
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-400"></span> 平段</span>
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-300"></span> 低谷</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-1 h-36 pt-6 relative w-full border-b border-slate-200">
                          {Array.from({ length: 24 }).map((_, h) => {
                            const period = getPeriodForHour(h);
                            const colorMap = {
                              "deep-peak": "bg-red-500 hover:bg-red-400",
                              "peak": "bg-amber-500 hover:bg-amber-400",
                              "flat": "bg-blue-400 hover:bg-blue-300",
                              "valley": "bg-slate-300 hover:bg-slate-200"
                            };
                            const barHeight = (period.price / 1.55) * 100;

                            return (
                              <div key={h} className="flex-1 group relative flex flex-col justify-end items-center h-full">
                                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20">
                                  <div className="bg-slate-800 text-white text-[9px] py-1 px-1.5 rounded shadow-lg whitespace-nowrap text-center font-bold">
                                    <div>{h}:00 - {h+1}:00</div>
                                    <div className="text-amber-300 mt-0.5">{period.price.toFixed(2)} 元/度</div>
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mt-1" />
                                </div>
                                <div 
                                  className={`w-full rounded-t-sm transition-all duration-300 ${colorMap[period.type]}`}
                                  style={{ height: `${barHeight}%` }}
                                />
                                <span className="text-[9px] font-semibold text-slate-400 scale-90 mt-1">{h}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">估算总支出电费</span>
                          <div className="mt-1.5">
                            <span className="text-2xl font-black text-slate-800">
                              ￥{Math.round(costResults.totalCost).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            测试用电: {queryKwh.toLocaleString()} kWh
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">测算均价费率</span>
                          <div className="mt-1.5">
                            <span className="text-2xl font-black text-slate-800">
                              {costResults.avgPrice.toFixed(4)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 ml-1">元/度</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            执行标准: {isSummer ? "夏季尖分时" : "常规分时"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl space-y-1.5 text-[11px]">
                          <div className="font-bold text-slate-700 border-b border-slate-200 pb-1">测算电费账单构成</div>
                          <div className="flex justify-between text-slate-500">
                            <span>尖峰 (￥{costResults.details["deep-peak"].price})</span>
                            <span className="font-bold">￥{Math.round(costResults.details["deep-peak"].cost)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>高峰 (￥{costResults.details["peak"].price})</span>
                            <span className="font-bold">￥{Math.round(costResults.details["peak"].cost)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>平段 (￥{costResults.details["flat"].price})</span>
                            <span className="font-bold">￥{Math.round(costResults.details["flat"].cost)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>低谷 (￥{costResults.details["valley"].price})</span>
                            <span className="font-bold">￥{Math.round(costResults.details["valley"].cost)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Solar Yield tool */}
                {activeModal === "solar" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left params - compact height */}
                    <div className="lg:col-span-5 flex flex-col gap-3.5">
                      
                      {/* 省级气象基准选择模块 */}
                      <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-orange-500" /> 省级气象等效基准
                          </h4>
                          <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            全国34省全覆盖
                          </span>
                        </div>

                        {/* 省级单级选择器 */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">选择省份 / 直辖市 / 自治区</label>
                          <select
                            value={solarProvinceId}
                            onChange={(e) => handleSelectProvince(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors shadow-xs"
                          >
                            {(["直辖市", "华东", "华南", "华北", "华中", "西北", "西南", "东北", "港澳台"] as const).map(regionName => {
                              const list = CHINA_SOLAR_PROVINCES.filter(p => p.region === regionName);
                              if (list.length === 0) return null;
                              return (
                                <optgroup key={regionName} label={`📍 ${regionName}`}>
                                  {list.map(p => (
                                    <option key={p.id} value={p.id}>
                                      {p.name} · 等效 {p.avgAnnualHours}h ({p.zone.slice(0, 3)})
                                    </option>
                                  ))}
                                </optgroup>
                              );
                            })}
                          </select>
                        </div>

                        {/* 重点省份快捷标签 (仅显示省份名称) */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                              <Sparkles className="size-3 text-orange-500" /> 常用省份快捷直选
                            </span>
                            <span className="text-[9px] text-slate-400">点击即选</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_SOLAR_PROVINCES.map(hot => {
                              const isSelected = solarProvinceId === hot.provinceId;
                              return (
                                <button
                                  key={hot.provinceId}
                                  type="button"
                                  onClick={() => handleSelectProvince(hot.provinceId)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                    isSelected
                                      ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                                      : "bg-white text-slate-600 border-slate-200 hover:bg-orange-50 hover:border-orange-200"
                                  }`}
                                >
                                  {hot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 光伏系统工况配置 (紧凑紧贴，无冗余高度) */}
                      <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="size-3.5 text-slate-400" /> 系统安装与工况参数
                          </h4>
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                            PR {Math.round(SYSTEM_PR * 100)}% 标称
                          </span>
                        </div>

                        {/* 装机容量 */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                            <span>拟装机总容量</span>
                            <span className="text-orange-600 font-extrabold text-xs">{solarCapacity} kWp</span>
                          </div>
                          <div className="flex gap-1">
                            {[50, 100, 200, 500, 1000].map(kw => (
                              <button
                                key={kw}
                                type="button"
                                onClick={() => setSolarCapacity(kw)}
                                className={`flex-1 py-1 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                                  solarCapacity === kw
                                    ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {kw}k
                              </button>
                            ))}
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="2000"
                            step="10"
                            value={solarCapacity}
                            onChange={(e) => setSolarCapacity(Number(e.target.value))}
                            className="w-full accent-orange-500 h-1 bg-slate-200 rounded-lg cursor-pointer mt-1"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>10 kWp</span>
                            <span>1000 kWp</span>
                            <span>2000 kWp</span>
                          </div>
                        </div>

                        {/* 安装倾角与阴影修正 */}
                        <div className="space-y-1 pt-0.5">
                          <label className="text-[11px] font-bold text-slate-500 block mb-1">安装倾角与阴影修正</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { label: "最优倾角", factor: 1.0, desc: "全无遮挡" },
                              { label: "中度偏角", factor: 0.92, desc: "轻微偏差" },
                              { label: "彩钢平铺", factor: 0.81, desc: "平铺有影" }
                            ].map(opt => (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => setTiltFactor(opt.factor)}
                                className={`py-1.5 px-1 border rounded-lg text-[10px] font-bold text-center flex flex-col justify-between transition-all cursor-pointer ${
                                  tiltFactor === opt.factor 
                                    ? "bg-orange-50 border-orange-200 text-orange-700 shadow-xs" 
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                <span>{opt.label}</span>
                                <span className="opacity-60 font-semibold mt-0.5">{Math.round(opt.factor * 100)}%</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 省级等效日照展示 (固定基准不可手动修改) */}
                        <div className="flex items-center justify-between text-[11px] bg-slate-100/70 px-3 py-2 rounded-xl text-slate-600 border border-slate-200/70 mt-1">
                          <span className="font-bold flex items-center gap-1.5 text-slate-600">
                            <Sun className="size-3.5 text-orange-500" /> 省级基准等效日照
                          </span>
                          <span className="font-extrabold text-orange-600 text-xs">
                            {currentProvinceProfile.dailyHours} <span className="font-normal text-slate-400 text-[10px]">h/天</span>
                            <span className="mx-1.5 text-slate-300">|</span>
                            <span className="font-normal text-slate-400 text-[10px]">年等效</span> {currentProvinceProfile.annualHours} <span className="font-normal text-slate-400 text-[10px]">h</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right chart & results - 撑满右侧，纵向自适应伸展 */}
                    <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
                      {/* 12个月月度走势图卡片 */}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex-1 flex flex-col justify-between min-h-[300px]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                          <div>
                            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <TrendingUp className="size-4 text-orange-500" />
                              12个月月度理论发电走势 (度)
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              依据【{currentProvinceProfile.name}】权威气象基准与月度分布特征仿真
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-xl px-3.5 py-1.5 text-right border border-orange-100">
                            <span className="text-[10px] text-orange-600 font-bold block">预估首年总发电量</span>
                            <span className="text-base font-black text-orange-700">
                              {Math.round(annualSolarGeneration).toLocaleString()} <span className="text-[10px] font-semibold">kWh</span>
                            </span>
                          </div>
                        </div>

                        {/* 柱状图：撑满并底部绝对对齐 */}
                        <div className="flex-1 min-h-[190px] h-48 md:h-56 flex items-end justify-between gap-1.5 md:gap-2 pt-6 relative border-b border-slate-200">
                          {monthlySolarData.map((data) => {
                            const maxVal = Math.max(...monthlySolarData.map(d => d.kwh));
                            const isMaxMonth = data.kwh === maxVal;
                            const percentage = maxVal > 0 ? (data.kwh / maxVal) * 100 : 0;
                            return (
                              <div key={data.month} className="flex-1 flex flex-col justify-end items-center h-full relative group cursor-pointer">
                                {/* Hover Tooltip */}
                                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[9px] py-1 px-1.5 rounded pointer-events-none transition-all font-bold z-10 whitespace-nowrap shadow-md text-center">
                                  <div>{data.month}：{data.kwh.toLocaleString()}度</div>
                                  <div className="text-[8px] text-orange-300 font-normal">
                                    占全年 {(data.weight * 100).toFixed(1)}% · 晴日约{data.daysOfSun}天
                                  </div>
                                </div>
                                {/* Bar: strictly bottom anchored, smooth transition */}
                                <div 
                                  className={`w-full rounded-t-sm transition-all duration-300 ${
                                    isMaxMonth 
                                      ? "bg-gradient-to-t from-orange-400 to-orange-500 shadow-xs" 
                                      : "bg-orange-200 group-hover:bg-orange-400"
                                  }`}
                                  style={{ height: `${Math.max(10, percentage * 0.95)}%` }}
                                />
                                <span className={`text-[10px] font-bold select-none mt-1.5 ${isMaxMonth ? "text-orange-600 font-extrabold" : "text-slate-400"}`}>
                                  {data.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4-Grid 测算关键指标 (撑满右侧底部，无任何指引提示) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block truncate">日平均产绿电</span>
                          <div className="text-lg font-black text-slate-800 mt-0.5">
                            {Math.round(dailySolarGeneration).toLocaleString()} <span className="text-[10px] font-normal text-slate-500">kWh</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">满足工厂日间负荷</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block truncate">系统年满发小时</span>
                          <div className="text-lg font-black text-orange-700 mt-0.5">
                            {solarCapacity > 0 ? Math.round(annualSolarGeneration / solarCapacity).toLocaleString() : 0} <span className="text-[10px] font-normal text-slate-500">h/年</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                            省级基准: {currentProvinceProfile.annualHours}h
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block truncate">年等效节约标煤</span>
                          <div className="text-lg font-black text-slate-800 mt-0.5">
                            {(annualSolarGeneration * 0.32 / 1000).toFixed(1)} <span className="text-[10px] font-normal text-slate-500">吨</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">以0.32kg/度煤耗计</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block truncate">年CO₂减排贡献</span>
                          <div className="text-lg font-black text-emerald-700 mt-0.5">
                            {(annualSolarGeneration * 0.581 / 1000).toFixed(1)} <span className="text-[10px] font-normal text-slate-500">吨</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">国标排放因子核算</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. ROI Evaluation tool */}
                {activeModal === "revenue" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Params */}
                    <div className="lg:col-span-4 space-y-5">
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <DollarSign className="size-3.5 text-slate-400" /> 项目造价与消纳
                          </h4>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                            <span>系统综合总包单瓦造价</span>
                            <span className="text-emerald-600 font-extrabold">{unitCost.toFixed(2)} 元/W</span>
                          </label>
                          <input
                            type="range"
                            min="2.5"
max="5.5"
                            step="0.1"
                            value={unitCost}
                            onChange={(e) => setUnitCost(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                          />
                          <div className="text-[9px] text-slate-400 font-bold flex justify-between">
                            <span>￥2.5/W (平价)</span>
                            <span>￥5.5/W (高质)</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                            <span>工厂自用比例 (消纳率)</span>
                            <span className="text-emerald-600 font-extrabold">{selfUseRatio}%</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={selfUseRatio}
                            onChange={(e) => setSelfUseRatio(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                          />
                          <div className="text-[9px] text-slate-400 font-bold flex justify-between">
                            <span>10% (多上网)</span>
                            <span>100% (全自用)</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">脱硫煤标杆上网电价 (元/度)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={gridPrice}
                            onChange={(e) => setGridPrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 text-slate-700 mt-1"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">工厂原平均买电电费 (元/度)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={factoryPrice}
                            onChange={(e) => setFactoryPrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 text-slate-700 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Chart */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                          <div>
                            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Coins className="size-4 text-emerald-500" />
                              15年周期累积平衡资产现金流 (万元)
                            </h5>
                            <p className="text-[9px] text-slate-400">总包初投资: ￥{Math.round(totalInvestment).toLocaleString()} 元</p>
                          </div>
                          <div className="bg-emerald-50 rounded-xl px-3 py-1 text-right border border-emerald-100">
                            <span className="text-[10px] text-emerald-600 font-bold block">静态收回期</span>
                            <span className="text-sm font-black text-emerald-700">
                              {paybackPeriod.toFixed(1)} <span className="text-xs">年</span>
                            </span>
                          </div>
                        </div>

                        {(() => {
                          const maxRevenue = Math.max(
                            ...cashFlows.map(d => d.totalRevenue),
                            totalInvestment * 1.05,
                            10000
                          );
                          const breakEvenHeightPercent = maxRevenue > 0 ? (totalInvestment / maxRevenue) * 85 : 0;

                          return (
                            <>
                              <div className="h-48 pt-6 relative border-b border-slate-200">
                                {/* Break Even Payback Reference Line */}
                                {breakEvenHeightPercent > 0 && breakEvenHeightPercent <= 90 && (
                                  <div 
                                    className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/70 z-10 pointer-events-none transition-all duration-300" 
                                    style={{ bottom: `calc(${breakEvenHeightPercent}% + 20px)` }}
                                  >
                                    <span className="absolute -top-4 left-0 text-[8px] font-extrabold text-emerald-700 bg-emerald-100/95 px-1.5 py-0.5 rounded shadow-xs border border-emerald-300/60">
                                      初投回本线 ￥{(totalInvestment / 10000).toFixed(1)}万 (第{paybackPeriod.toFixed(1)}年)
                                    </span>
                                  </div>
                                )}

                                {/* Bars - strictly anchored at bottom baseline */}
                                <div className="h-full flex items-end justify-between gap-1 sm:gap-1.5 pb-0">
                                  {cashFlows.map((flow) => {
                                    const barHeight = maxRevenue > 0 ? Math.max((flow.totalRevenue / maxRevenue) * 85, 3) : 3;
                                    const isPastPayback = flow.isPositive;

                                    return (
                                      <div key={flow.year} className="flex-1 flex flex-col justify-end items-center h-full relative group cursor-pointer">
                                        {/* Hover Tooltip */}
                                        <div className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[9px] py-1 px-2 rounded-lg pointer-events-none transition-all font-bold z-20 whitespace-nowrap shadow-md flex flex-col items-center gap-0.5">
                                          <span>{flow.year} · 累计￥{(flow.totalRevenue / 10000).toFixed(1)}万</span>
                                          <span className={isPastPayback ? "text-emerald-400" : "text-amber-300"}>
                                            {isPastPayback ? `已回本 · 纯利+￥${(flow.balance / 10000).toFixed(1)}万` : `回本中 · 差￥${(Math.abs(flow.balance) / 10000).toFixed(1)}万`}
                                          </span>
                                        </div>

                                        {/* Bar: strictly anchored to bottom, height transitions upwards */}
                                        <div 
                                          className={`w-full rounded-t-sm transition-all duration-300 ${
                                            isPastPayback 
                                              ? "bg-emerald-500 hover:bg-emerald-600 shadow-xs shadow-emerald-500/20" 
                                              : "bg-emerald-200 hover:bg-emerald-300 border border-emerald-300/50"
                                          }`}
                                          style={{
                                            height: `${barHeight}%`,
                                          }}
                                        />

                                        {/* Year Label */}
                                        <span className={`text-[8px] font-bold scale-90 mt-1 select-none transition-colors ${
                                          flow.isPaybackYear ? "text-emerald-600 font-extrabold" : "text-slate-400"
                                        }`}>
                                          {flow.yearIndex}年
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Chart Legend */}
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 mt-3 pt-1">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <span className="size-2 rounded-xs bg-emerald-200 border border-emerald-300/50 inline-block" />
                                    <span>投资回收期</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="size-2 rounded-xs bg-emerald-500 inline-block" />
                                    <span className="text-emerald-600 font-bold">已回本纯利阶段</span>
                                  </div>
                                </div>
                                <span className="text-[9px] text-slate-400">底部基线对齐 · 柱高随单瓦造价与自用消纳率实时联动</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block">年均净效益节约</span>
                          <div className="text-lg font-black text-slate-800 mt-1">
                            ￥{Math.round(netAnnualRevenue).toLocaleString()}
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">已扣减年均运维维护费用</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block">预计年均投资回报比</span>
                          <div className="text-lg font-black text-emerald-600 mt-1 flex items-center gap-1">
                            <span>{returnOnInvestment.toFixed(1)}%</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">远超行业平均定存资产利息</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block">25年周期累计纯利润</span>
                          <div className="text-lg font-black text-slate-800 mt-1">
                            ￥{Math.round(netAnnualRevenue * 25 * 0.9).toLocaleString()}
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">已计入年化光衰与运维开销</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Emission calculator tool */}
                {activeModal === "carbon" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Params */}
                    <div className="lg:col-span-4 space-y-5">
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Leaf className="size-3.5 text-slate-400" /> 减排换算源配置
                          </h4>
                          <button
                            onClick={() => setIsSyncedWithSolar(!isSyncedWithSolar)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                              isSyncedWithSolar 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-white border-slate-200 text-slate-500"
                            }`}
                          >
                            {isSyncedWithSolar ? "已同步光伏" : "独立手动输入"}
                          </button>
                        </div>

                        {isSyncedWithSolar ? (
                          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">当前关联组件预测量</div>
                            <div className="text-lg font-black text-slate-800">
                              {Math.round(annualSolarGeneration).toLocaleString()} <span className="text-xs">kWh/年</span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              由 <b>理论发电量</b> 所算而来，实时协同。
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                              <span>手动配置节电量/绿电量</span>
                              <span className="text-green-600 font-extrabold">{customKwhSaved.toLocaleString()} kWh</span>
                            </label>
                            <input
                              type="range"
                              min="10000"
                              max="1000000"
                              step="10000"
                              value={customKwhSaved}
                              onChange={(e) => setCustomKwhSaved(Number(e.target.value))}
                              className="w-full accent-green-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                              <span>10k度</span>
                              <span>500k度</span>
                              <span>1M度</span>
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                          <div className="text-[11px] font-bold text-slate-700">
                            💡 减排指标折算系数基准
                          </div>
                          <div className="text-[10px] text-slate-500 leading-relaxed space-y-1">
                            <div>• 二氧化碳排放因子: <b>0.5703 kg/kWh</b></div>
                            <div>• 节约标煤系数: <b>0.3280 kg/kWh</b></div>
                            <div>• 成年树吸碳系数: <b>18.30 kg/年/棵</b></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right ecology view */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                      <div className="bg-green-50/20 border border-green-100/40 p-6 rounded-3xl flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                            <Trees className="size-4 text-green-600" />
                            森林级绿色生态环境还原看板
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            您创造的节能能耗或分布式绿电等效于如下对自然母亲的保护，创造真实可量化的低碳奇迹。
                          </p>
                        </div>

                        {/* Ecology items row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                          
                          <div className="bg-white/80 p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 md:gap-3 min-w-0">
                            <span className="p-2 md:p-3 rounded-xl bg-green-50 text-green-600 flex-shrink-0">
                              <Trees className="size-5 md:size-6" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 block uppercase truncate">相当于年化植树</span>
                              <span className="text-sm sm:text-base md:text-xl font-black text-slate-800 block truncate">
                                {Math.round(equivalentTrees).toLocaleString()} <span className="text-[10px] md:text-xs font-bold text-slate-500">棵树</span>
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/80 p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 md:gap-3 min-w-0">
                            <span className="p-2 md:p-3 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
                              <Globe className="size-5 md:size-6" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 block uppercase truncate">减少二氧化碳排放</span>
                              <span className="text-sm sm:text-base md:text-xl font-black text-slate-800 block truncate">
                                {co2Savings.toFixed(1)} <span className="text-[10px] md:text-xs font-bold text-slate-500">吨 CO₂</span>
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/80 p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 md:gap-3 min-w-0">
                            <span className="p-2 md:p-3 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
                              <Layers className="size-5 md:size-6" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 block uppercase truncate">节约标准煤消耗</span>
                              <span className="text-sm sm:text-base md:text-xl font-black text-slate-800 block truncate">
                                {coalSavings.toFixed(1)} <span className="text-[10px] md:text-xs font-bold text-slate-500">吨标煤</span>
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/80 p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 md:gap-3 min-w-0">
                            <span className="p-2 md:p-3 rounded-xl bg-sky-50 text-sky-600 flex-shrink-0">
                              <Award className="size-5 md:size-6" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 block uppercase truncate">相当于家车减行</span>
                              <span className="text-sm sm:text-base md:text-xl font-black text-slate-800 block truncate">
                                {Math.round(equivalentCarTours * 15000).toLocaleString()} <span className="text-[10px] md:text-xs font-bold text-slate-500">公里</span>
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* Quote card */}
                        <div className="bg-white/60 p-4 rounded-2xl border border-green-100/30 text-xs text-green-700 italic text-center">
                          “ 每一度清洁绿色能源，都是我们送给蓝色星球与繁荣子孙的一片清新树叶。 ”
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

    </div>
  );
}
