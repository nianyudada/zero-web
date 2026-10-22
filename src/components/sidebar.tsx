import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown,
  MonitorPlay,
  ChevronRightCircle,
  Headset,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Search,
  MapPin,
  Check,
  Map
} from 'lucide-react';
import { ALL_COMPANIES, CompanyLocation } from '../data/company-locations';
import { CompanyMapModal } from './company-map-modal';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const COMPANIES = ALL_COMPANIES;
const SERVICES_WITH_METRICS = new Set(['智慧能管', '智能微网', '资产管理', '虚拟电厂', '零碳园区']);

interface ServiceMetricTickerProps {
  metrics?: { label: string; value: string }[];
}

function ServiceMetricTicker({ metrics }: ServiceMetricTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!metrics || metrics.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % metrics.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [metrics]);

  if (!metrics || metrics.length === 0) return null;

  const currentMetric = metrics[currentIndex % metrics.length];

  return (
    <div className="h-9 relative overflow-hidden flex flex-col justify-center min-w-0 flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col justify-center min-w-0"
        >
          <span className="text-[10px] font-medium text-slate-500 truncate leading-tight">
            {currentMetric.label}
          </span>
          <span className="text-sm font-black text-emerald-700 tracking-tight leading-tight truncate">
            {currentMetric.value}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


const SERVICES = [
  { id: '1', title: '智慧能管', bg: 'from-[#eaf5ef] to-[#dcf0e3]', decorativeBg: 'bg-green-100/40' },
  { id: '2', title: '企业管理', bg: 'from-[#f4eeff] to-[#ece1fa]', decorativeBg: 'bg-purple-100/40', hasDashboard: false },
  { id: '3', title: '智能微网', bg: 'from-[#e2f6f1] to-[#d1eee8]', decorativeBg: 'bg-emerald-100/40' },
  { id: '4', title: '虚拟电厂', subtitle: '聚合商端', bg: 'from-[#eef2fe] to-[#dfe7fc]', decorativeBg: 'bg-indigo-100/40' },
  { id: '5', title: '资产管理', bg: 'from-[#ebf4fa] to-[#dbebf6]', decorativeBg: 'bg-blue-100/40', hasDashboard: false },
  { id: '6', title: '零碳园区', bg: 'from-[#f1eefa] to-[#e7e1f6]', decorativeBg: 'bg-indigo-100/30' },
  { id: '7', title: '资产管理', subtitle: 'Demo', bg: 'from-[#faefe0] to-[#f4e2cb]', decorativeBg: 'bg-orange-100/40', hasDashboard: false },
  { id: '8', title: '虚拟电厂', subtitle: 'Demo', bg: 'from-[#e2f7f1] to-[#cff0e7]', decorativeBg: 'bg-emerald-100/40' },
];

function MarqueeText({ text, className }: { text: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.offsetWidth;
        if (textWidth > containerWidth) {
          setIsOverflowing(true);
          setScrollDistance(textWidth);
        } else {
          setIsOverflowing(false);
          setScrollDistance(0);
        }
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    if (textRef.current) observer.observe(textRef.current);

    const timer = setTimeout(() => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.offsetWidth;
        if (textWidth > containerWidth) {
          setIsOverflowing(true);
          setScrollDistance(textWidth);
        }
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [text]);

  const spaceGap = '\u00A0\u00A0\u00A0\u00A0';

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap flex w-full relative ${className}`}>
      <motion.div
        className="flex"
        animate={isOverflowing ? { x: [0, 0, -scrollDistance] } : { x: 0 }}
        transition={isOverflowing ? {
          duration: 15,
          ease: "linear",
          times: [0, 0.133, 1], // 0-2s wait (2/15 ≈ 0.133), then smooth scroll left
          repeat: Infinity,
          repeatType: "loop"
        } : {}}
      >
        <span ref={textRef} className="inline-block flex-shrink-0">
          {text}{isOverflowing ? spaceGap : ''}
        </span>
        {isOverflowing && (
          <span className="inline-block flex-shrink-0">
            {text}{spaceGap}
          </span>
        )}
      </motion.div>
    </div>
  );
}

function CompanyLogo({ colorClass, size = 'normal' }: { colorClass: string, size?: 'normal' | 'small' }) {
  const containerSize = size === 'small' ? 'size-8 rounded-lg' : 'size-10 rounded-xl';
  const padding = size === 'small' ? 'p-1' : 'p-1.5';
  const gap = size === 'small' ? 'gap-0.5' : 'gap-0.5';
  const innerRadius = size === 'small' ? 'rounded-[6px]' : 'rounded-[10px]';
  const bgRadius = size === 'small' ? 'rounded-[1px]' : 'rounded-sm';
  
  return (
    <div className={`${containerSize} bg-gradient-to-br ${colorClass} p-0.5 shadow-sm flex-shrink-0 cursor-pointer`}>
      <div className={`w-full h-full bg-white/20 ${innerRadius} flex flex-wrap ${padding} ${gap}`}>
        <div className={`w-[calc(50%-1px)] h-[calc(50%-1px)] bg-white/80 ${bgRadius}`} />
        <div className={`w-[calc(50%-1px)] h-[calc(50%-1px)] bg-white/80 ${bgRadius}`} />
        <div className={`w-[calc(50%-1px)] h-[calc(50%-1px)] bg-white/80 ${bgRadius}`} />
        <div className={`w-[calc(50%-1px)] h-[calc(50%-1px)] bg-white/80 ${bgRadius}`} />
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyLocation>(COMPANIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCompanies = COMPANIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.province.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const servicesToDisplay = selectedCompany.services && selectedCompany.services.length > 0 
    ? selectedCompany.services 
    : SERVICES;

  return (
    <>
      <CompanyMapModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedCompanyId={selectedCompany.id}
        onSelectCompany={(company) => {
          setSelectedCompany(company);
        }}
      />

      <aside 
        className={`border-r border-slate-100 bg-white h-full flex flex-col justify-between transition-all duration-300 relative z-40 ${
          collapsed ? "w-16" : "w-[280px]"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Header Area */}
          {!collapsed ? (
            <div ref={dropdownRef}>
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-3 w-full overflow-hidden pr-2">
                  <CompanyLogo colorClass={selectedCompany.logoColor} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <MarqueeText 
                      text={selectedCompany.name} 
                      className="font-bold text-slate-800 text-sm" 
                    />
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5 truncate">
                      <MapPin className="size-3 flex-shrink-0" /> {selectedCompany.province} {selectedCompany.city} · {selectedCompany.district}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`size-4 text-slate-400 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-[72px] left-3 right-3 bottom-3 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-300/40 z-50 overflow-hidden flex flex-col">
                  {/* Map Mode Banner */}
                  <div className="px-3 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <span>全国企业 ({filteredCompanies.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMapModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 transition-colors cursor-pointer"
                    >
                      <Map className="size-3 text-slate-400" />
                      <span>地图模式</span>
                    </button>
                  </div>

                  {/* Search */}
                  <div className="p-2.5 border-b border-slate-100 relative bg-slate-50/50 flex-shrink-0">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="输入企业、省份、城市或区县" 
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {/* List */}
                  <div className="flex-1 overflow-y-auto hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-2 space-y-1">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map(company => (
                        <div 
                          key={company.id}
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                            selectedCompany.id === company.id 
                              ? 'bg-emerald-50 border border-emerald-100/50' 
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full overflow-hidden">
                            <CompanyLogo colorClass={company.logoColor} size="small" />
                            <div className="flex flex-col min-w-0 flex-1">
                              <MarqueeText 
                                text={company.name} 
                                className={`text-xs font-bold ${selectedCompany.id === company.id ? 'text-emerald-700' : 'text-slate-700'}`}
                              />
                              <span className={`text-[10px] flex items-center gap-0.5 mt-0.5 truncate ${selectedCompany.id === company.id ? 'text-emerald-600/70' : 'text-slate-400'}`}>
                                <MapPin className="size-2.5 flex-shrink-0" /> {company.province} {company.city} · {company.district}
                              </span>
                            </div>
                          </div>
                          {selectedCompany.id === company.id && (
                            <Check className="size-4 text-emerald-600 ml-1 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                        <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center">
                          <Search className="size-4 text-slate-300" />
                        </div>
                        <span className="text-xs text-slate-400 font-medium">未找到匹配的企业</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 flex justify-center">
              <CompanyLogo colorClass={selectedCompany.logoColor} size="small" />
            </div>
          )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {!collapsed ? (
            <div className="space-y-6 mt-2">
              
              {/* 我的服务 */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[11px] font-bold text-slate-400">我的服务</h3>
                  <span className="text-[10px] text-slate-400 font-medium">{servicesToDisplay.length} 项</span>
                </div>
                <div className="space-y-3">
                  {servicesToDisplay.map((svc) => {
                    const isDemo = svc.subtitle?.toLowerCase() === 'demo';
                    const versionText = (svc as any).version || (
                      isDemo ? '演示版' :
                      svc.id === '1' || svc.id === '4' || svc.id === '7' ? 'AI预测版' :
                      svc.id === '3' || svc.id === '6' || svc.id === '8' ? '高级版' : '基础版'
                    );
                    
                    return (
                      <div 
                        key={svc.id} 
                        className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${svc.bg} border border-slate-100/80 p-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between cursor-pointer`}
                      >
                        {/* Decorative Background Blur */}
                        <div className={`absolute -bottom-8 -right-8 size-32 rounded-full ${svc.decorativeBg} blur-2xl opacity-60 group-hover:scale-125 transition-transform duration-700 pointer-events-none`} />

                        {/* Top Row: Service Title & Version Tag */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0 pr-2">
                            <h4 className="text-xs font-black text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                              {svc.title}
                            </h4>
                            {(svc.title === '资产管理' || isDemo) && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold tracking-wider bg-amber-100/90 text-amber-700 border border-amber-300/80 uppercase shadow-3xs leading-tight flex-shrink-0 select-none">
                                DEMO
                              </span>
                            )}
                          </div>

                          {/* 右上角仅显示服务版本，弱化为纯信息展示属性标签 */}
                          <span className="text-[10px] font-medium text-slate-400/90 tracking-wide select-none flex-shrink-0 flex items-center gap-1">
                            <span className="size-1 rounded-full bg-slate-300/80"></span>
                            {versionText}
                          </span>
                        </div>

                        {/* Bottom Row: Left side is Metric ticker & Dashboard Button (mutually exclusive on hover), Right side is Enter indicator */}
                        <div className="relative z-10 mt-2.5 pt-2 border-t border-white/60 flex items-center justify-between gap-2 min-h-[44px]">
                          {/* 左侧区域：有数值时默认显示数值，hover时互斥切换为数据看板；无数值时默认显示数据看板 */}
                          <div className="flex-1 min-w-0 pr-2">
                            {SERVICES_WITH_METRICS.has(svc.title) && (svc as any).metrics && (svc as any).metrics.length > 0 ? (
                              <div className="relative h-9 flex items-center group/metric">
                                {/* 默认显示翻牌器，当鼠标hover该区域时淡出隐藏 */}
                                <div className="w-full transition-opacity duration-200 group-hover/metric:opacity-0 group-hover/metric:pointer-events-none">
                                  <ServiceMetricTicker metrics={(svc as any).metrics} />
                                </div>

                                {/* 数据看板按钮：平时隐藏，hover数值区域时淡入显示并可点击 */}
                                {svc.hasDashboard !== false && (
                                  <div className="absolute inset-0 flex items-center opacity-0 group-hover/metric:opacity-100 pointer-events-none group-hover/metric:pointer-events-auto transition-all duration-200">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Optional dashboard open action
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-emerald-700 bg-white/90 hover:bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs transition-all duration-200 cursor-pointer"
                                      title="打开数据看板"
                                    >
                                      <MonitorPlay className="size-3.5 text-slate-500 hover:text-emerald-600 transition-colors shrink-0" />
                                      <span className="text-xs font-semibold leading-none whitespace-nowrap">数据看板</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* 没有数值区域的服务：默认显示数据看板入口 */
                              svc.hasDashboard !== false ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Optional dashboard open action
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-emerald-700 bg-white/70 hover:bg-white border border-slate-200/70 hover:border-emerald-300 shadow-2xs transition-all duration-200 cursor-pointer"
                                  title="打开数据看板"
                                >
                                  <MonitorPlay className="size-3.5 text-slate-500 hover:text-emerald-600 transition-colors shrink-0" />
                                  <span className="text-xs font-semibold leading-none whitespace-nowrap">数据看板</span>
                                </button>
                              ) : (
                                <div className="h-9" />
                              )
                            )}
                          </div>

                          {/* 右侧：进入服务指示器（hover卡片时展开） */}
                          <div className="flex items-center text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0">
                            <span className="w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:opacity-100 group-hover:mr-0.5 transition-all duration-300 whitespace-nowrap text-[10px] font-medium text-emerald-700">
                              进入
                            </span>
                            <div className="size-5 rounded-full bg-white/50 group-hover:bg-white/90 flex items-center justify-center transition-colors shadow-2xs shrink-0">
                              <ChevronRight className="size-3.5 group-hover:translate-x-[1px] transition-transform text-slate-400 group-hover:text-emerald-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 更多服务 */}
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 mb-3 px-1">更多服务</h3>
                <div className="rounded-xl bg-[#eaf6ef] border border-green-50 p-4 flex items-center gap-3 cursor-pointer hover:bg-[#dff2e7] transition-colors">
                  <div className="size-10 rounded-full bg-[#4bbd7c] flex items-center justify-center flex-shrink-0 text-white shadow-sm shadow-green-200">
                    <Headset className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">云服务管家</h4>
                    <span className="text-[11px] font-bold text-[#4bbd7c] flex items-center">
                      立即咨询 &gt;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4 flex flex-col items-center">
              <button title="我的服务" className="size-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-700 transition-colors">
                <LayoutGrid className="size-5" />
              </button>
              <button title="云服务管家" className="size-10 rounded-full bg-[#4bbd7c] flex items-center justify-center flex-shrink-0 text-white shadow-sm hover:scale-105 transition-transform">
                 <Headset className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 bg-white">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight className="size-4" /> : (
            <>
              <ChevronLeft className="size-4" />
              <span className="text-xs font-medium">折叠侧边栏</span>
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  );
}


