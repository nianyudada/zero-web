import { useState, useEffect, useRef, useMemo, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Check, 
  ExternalLink, 
  Sparkles,
  Zap,
  Activity,
  Phone,
  User,
  ShieldCheck,
  RefreshCw,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Filter,
  LocateFixed,
  MonitorPlay
} from 'lucide-react';
import { 
  CompanyLocation, 
  ALL_COMPANIES, 
  BASE_SERVICES,
  buildAdministrativeTree, 
  ProvinceNode,
  formatCapacityNumber,
  formatCompanyCode
} from '../data/company-locations';

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
    <div className="h-10 relative overflow-hidden flex flex-col justify-center min-w-0 flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col justify-center min-w-0"
        >
          <span className="text-[10px] font-medium text-slate-500 truncate leading-tight">
            {currentMetric.label}
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-700 tracking-tight leading-tight truncate">
            {currentMetric.value}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface CompanyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanyId?: string;
  onSelectCompany: (company: CompanyLocation) => void;
}

// AMap Global declaration
declare global {
  interface Window {
    AMap?: any;
    _AMapSecurityConfig?: any;
  }
}

export function CompanyMapModal({ 
  isOpen, 
  onClose, 
  selectedCompanyId, 
  onSelectCompany 
}: CompanyMapModalProps) {
  const [activeCompany, setActiveCompany] = useState<CompanyLocation>(() => {
    return ALL_COMPANIES.find(c => c.id === selectedCompanyId) || ALL_COMPANIES[0];
  });
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [isServiceFilterOpen, setIsServiceFilterOpen] = useState(false);
  const [showAllServicesInDetail, setShowAllServicesInDetail] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});
  
  // Right detail drawer state (visible by default or toggled)
  const [isDetailOpen, setIsDetailOpen] = useState(true);

  // Reset showAllServicesInDetail when filter changes
  useEffect(() => {
    setShowAllServicesInDetail(false);
  }, [selectedServiceId]);
  
  // Map settings
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Count companies per service
  const serviceStats = useMemo(() => {
    const stats: Record<string, number> = { all: ALL_COMPANIES.length };
    BASE_SERVICES.forEach(svc => {
      stats[svc.id] = ALL_COMPANIES.filter(c => c.services.some(s => s.id === svc.id || s.title === svc.title)).length;
    });
    return stats;
  }, []);

  // Filtered companies based on search keyword and selected service
  const filteredCompanies = useMemo(() => {
    let result = ALL_COMPANIES;

    // Filter by service if not 'all'
    if (selectedServiceId && selectedServiceId !== 'all') {
      result = result.filter(c => 
        c.services.some(s => s.id === selectedServiceId || s.title === selectedServiceId)
      );
    }

    // Filter by search keyword
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(kw) ||
        c.province.toLowerCase().includes(kw) ||
        c.city.toLowerCase().includes(kw) ||
        c.district.toLowerCase().includes(kw) ||
        c.industry.toLowerCase().includes(kw)
      );
    }

    return result;
  }, [searchKeyword, selectedServiceId]);

  // Services to display in the right panel (filtered or all)
  const displayedServices = useMemo(() => {
    if (!activeCompany) return [];
    if (selectedServiceId === 'all' || showAllServicesInDetail) {
      return activeCompany.services;
    }
    const filtered = activeCompany.services.filter(
      s => s.id === selectedServiceId || s.title === selectedServiceId
    );
    return filtered.length > 0 ? filtered : activeCompany.services;
  }, [activeCompany, selectedServiceId, showAllServicesInDetail]);

  // Hierarchical administrative division tree
  const administrativeTree = useMemo<ProvinceNode[]>(() => {
    return buildAdministrativeTree(filteredCompanies);
  }, [filteredCompanies]);

  // Expand all when searching or filtering by service
  useEffect(() => {
    if (searchKeyword.trim() || selectedServiceId !== 'all') {
      const expP: Record<string, boolean> = {};
      const expC: Record<string, boolean> = {};
      administrativeTree.forEach(p => {
        expP[p.province] = true;
        p.cities.forEach(c => {
          expC[`${p.province}-${c.city}`] = true;
        });
      });
      setExpandedProvinces(expP);
      setExpandedCities(expC);
    }
  }, [searchKeyword, selectedServiceId, administrativeTree]);

  // Sync activeCompany if not in filtered list
  useEffect(() => {
    if (filteredCompanies.length > 0) {
      const exists = filteredCompanies.some(c => c.id === activeCompany?.id);
      if (!exists) {
        setActiveCompany(filteredCompanies[0]);
      }
    }
  }, [filteredCompanies, activeCompany]);

  // Initialize expansion for active company's province and city
  useEffect(() => {
    if (activeCompany) {
      setExpandedProvinces(prev => ({ ...prev, [activeCompany.province]: true }));
      setExpandedCities(prev => ({ ...prev, [`${activeCompany.province}-${activeCompany.city}`]: true }));
    }
  }, []);

  // Load AMap JS API v2.0
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const initMap = () => {
      if (!mapContainerRef.current || !window.AMap) return;

      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }

        // Standard Autonavi raster tile layer (style=7: roads, places, boundaries, land, water)
        const standardLayer = new window.AMap.TileLayer({
          getTileUrl: (x: number, y: number, z: number) => {
            const sub = (Math.abs(x + y) % 4) + 1;
            return `https://webrd0${sub}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x=${x}&y=${y}&z=${z}`;
          },
          zIndex: 1
        });

        const map = new window.AMap.Map(mapContainerRef.current, {
          zoom: 5,
          center: [108.95, 34.27], // Center of China
          viewMode: '2D',
          layers: [standardLayer]
        });

        if (map.getLayers && map.getLayers().length === 0) {
          map.add(standardLayer);
        }

        mapInstanceRef.current = map;
        if (isMounted) setIsMapLoaded(true);

        renderMarkers(map);

        // If an active company is already set, pan to it
        if (activeCompany) {
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoomAndCenter(12, activeCompany.coordinates, true, 800);
            }
          }, 400);
        }
      } catch (err) {
        console.error("AMap init error:", err);
        if (isMounted) setMapLoadError(true);
      }
    };

    if (window.AMap) {
      initMap();
    } else {
      // Inject AMap script
      const scriptId = 'amap-sdk-script';
      if (!document.getElementById(scriptId)) {
        window._AMapSecurityConfig = { securityJsCode: '' };
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://webapi.amap.com/maps?v=2.0&key=74861c8502f6432b4b4578b9b8b17849';
        script.async = true;
        script.onload = () => {
          if (isMounted) initMap();
        };
        script.onerror = () => {
          if (isMounted) setMapLoadError(true);
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.AMap) {
            clearInterval(checkInterval);
            if (isMounted) initMap();
          }
        }, 100);
        return () => clearInterval(checkInterval);
      }
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isOpen]);

  // Render or update markers on AMap
  const renderMarkers = (map: any) => {
    if (!map || !window.AMap) return;

    // Clear old markers
    if (markersRef.current.length > 0) {
      map.remove(markersRef.current);
      markersRef.current = [];
    }

    const newMarkers: any[] = [];

    filteredCompanies.forEach(company => {
      const isSelected = activeCompany?.id === company.id;

      // Custom marker content with AMap badge & pulse
      const markerContent = document.createElement('div');
      markerContent.className = 'custom-amap-marker group cursor-pointer';
      markerContent.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all duration-200 ${
            isSelected 
              ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/60 scale-110 z-30' 
              : 'bg-white text-slate-800 border border-slate-200 hover:border-emerald-400 hover:scale-105 z-10'
          }">
            <span class="size-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-emerald-500'}"></span>
            <span class="max-w-[120px] truncate">${company.shortName}</span>
          </div>
          <div class="w-2 h-2 -mt-1 rotate-45 ${isSelected ? 'bg-emerald-600' : 'bg-white border-r border-b border-slate-200'}"></div>
        </div>
      `;

      const marker = new window.AMap.Marker({
        position: company.coordinates,
        content: markerContent,
        offset: new window.AMap.Pixel(-50, -35),
        title: company.name,
        extData: { companyId: company.id },
        zIndex: isSelected ? 120 : 100
      });

      marker.on('click', () => {
        handleSelectCompany(company);
      });

      map.add(marker);
      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;
  };

  // Re-render markers when activeCompany or filteredCompanies change
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      renderMarkers(mapInstanceRef.current);
    }
  }, [activeCompany?.id, filteredCompanies, isMapLoaded]);

  // Select company handler: centers map & opens detail
  const handleSelectCompany = (company: CompanyLocation) => {
    setActiveCompany(company);
    setIsDetailOpen(true);

    // Expand tree path
    setExpandedProvinces(prev => ({ ...prev, [company.province]: true }));
    setExpandedCities(prev => ({ ...prev, [`${company.province}-${company.city}`]: true }));

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoomAndCenter(13, company.coordinates, true, 800);
    }
  };

  // Pan to administrative district / city / province
  const handleZoomToDivision = (coords: [number, number], zoomLevel: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoomAndCenter(zoomLevel, coords, true, 800);
    }
  };

  // Locate and zoom to a specific region (province, city, or district) without collapsing/expanding
  const handleLocateRegion = (e: MouseEvent, companies: CompanyLocation[], zoomLevel: number) => {
    e.stopPropagation();
    if (!companies || companies.length === 0) return;

    const avgLng = companies.reduce((sum, c) => sum + c.coordinates[0], 0) / companies.length;
    const avgLat = companies.reduce((sum, c) => sum + c.coordinates[1], 0) / companies.length;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoomAndCenter(zoomLevel, [avgLng, avgLat], true, 700);
    }

    if (companies.length > 0) {
      setActiveCompany(companies[0]);
    }
  };

  // Reset to full view of China
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoomAndCenter(5, [108.95, 34.27], true, 800);
    }
  };

  // Toggle tree expansions
  const toggleProvince = (prov: string) => {
    setExpandedProvinces(prev => ({ ...prev, [prov]: !prev[prov] }));
  };

  const toggleCity = (provCityKey: string) => {
    setExpandedCities(prev => ({ ...prev, [provCityKey]: !prev[provCityKey] }));
  };

  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Main Modal Shell */}
      <motion.div 
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`bg-white rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col relative z-10 w-full overflow-hidden ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'h-[92vh] max-w-7xl'
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-14 px-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Map Mode Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              地图模式
            </div>
            
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>企业全国分布数字化全景</span>
            </h2>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 ml-3">
              <span>覆盖 <strong className="text-slate-800 font-semibold">{administrativeTree.length}</strong> 个省份</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>接入企业 <strong className="text-emerald-600 font-bold">{ALL_COMPANIES.length}</strong> 家</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>运行服务 <strong className="text-slate-800 font-semibold">68</strong> 项</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset View Button */}
            <button
              type="button"
              onClick={handleResetView}
              title="复位全国视图"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <Compass className="size-4 text-emerald-600" />
              <span className="hidden sm:inline">复位全国</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "退出全屏" : "全屏查看"}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hidden md:block"
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* Modal Main Body: Left 3-Level Administrative Tree + Right Map & Detail Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT SIDE: 3-Level Administrative Division Tree */}
          <aside className="w-[310px] md:w-[340px] flex-shrink-0 border-r border-slate-100 bg-white flex flex-col z-10 shadow-sm">
            
            {/* Search Input & Service Filter */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0 space-y-2.5">
              {/* Keyword Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索省/市/区县或企业名称" 
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-8 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <button 
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {/* Service Filter (Collapsible, default collapsed) */}
              <div className="bg-white rounded-lg border border-slate-200/90 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsServiceFilterOpen(!isServiceFilterOpen)}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Filter className="size-3 text-emerald-600 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-slate-700">服务过滤</span>
                    {selectedServiceId !== 'all' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 truncate max-w-[120px]">
                        {BASE_SERVICES.find(s => s.id === selectedServiceId)?.title}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">全部服务</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {selectedServiceId !== 'all' && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedServiceId('all');
                        }}
                        className="text-[10px] text-slate-400 hover:text-emerald-700 px-1 py-0.5 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                        title="重置为全部"
                      >
                        重置
                      </span>
                    )}
                    <ChevronDown className={`size-3 text-slate-400 transition-transform duration-200 ${isServiceFilterOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </div>
                </button>

                {isServiceFilterOpen && (
                  <div className="p-2 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedServiceId('all')}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-all text-center truncate cursor-pointer ${
                          selectedServiceId === 'all'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        全部 ({ALL_COMPANIES.length})
                      </button>
                      {BASE_SERVICES.map(svc => {
                        const isSelected = selectedServiceId === svc.id;
                        const count = serviceStats[svc.id] || 0;
                        return (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => setSelectedServiceId(isSelected ? 'all' : svc.id)}
                            title={`${svc.title} (${count})`}
                            className={`px-1.5 py-1 rounded-md text-[10px] transition-all text-center truncate cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200'
                            }`}
                          >
                            {svc.title} <span className="opacity-80">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Collapse/Expand */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                <span className="truncate mr-1 text-[10px]">
                  共 <strong className="text-emerald-700 font-bold">{filteredCompanies.length}</strong>
                  {selectedServiceId !== 'all' && (
                    <span className="text-emerald-600 ml-1">
                      · {BASE_SERVICES.find(s => s.id === selectedServiceId)?.title}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0 text-[10px]">
                  <button 
                    type="button"
                    onClick={() => {
                      const allP: Record<string, boolean> = {};
                      const allC: Record<string, boolean> = {};
                      administrativeTree.forEach(p => {
                        allP[p.province] = true;
                        p.cities.forEach(c => allC[`${p.province}-${c.city}`] = true);
                      });
                      setExpandedProvinces(allP);
                      setExpandedCities(allC);
                    }}
                    className="text-slate-400 hover:text-emerald-600 font-normal transition-colors cursor-pointer text-[10px]"
                  >
                    展开
                  </button>
                  <span className="text-slate-300 scale-75">/</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setExpandedProvinces({});
                      setExpandedCities({});
                    }}
                    className="text-slate-400 hover:text-emerald-600 font-normal transition-colors cursor-pointer text-[10px]"
                  >
                    折叠
                  </button>
                </div>
              </div>
            </div>

            {/* Tree Scroll List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 space-y-2">
              {administrativeTree.length > 0 ? (
                administrativeTree.map(provinceNode => {
                  const isProvExpanded = !!expandedProvinces[provinceNode.province];
                  const provCompanies = provinceNode.cities.flatMap(c => c.districts.flatMap(d => d.companies));

                  return (
                    <div key={provinceNode.province} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/40">
                      {/* 1级行政区划: 省份 */}
                      <div 
                        onClick={() => toggleProvince(provinceNode.province)}
                        className="group/prov p-2.5 hover:bg-slate-100/70 cursor-pointer transition-colors select-none"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <ChevronRight className={`size-3.5 text-slate-400 transition-transform ${isProvExpanded ? 'rotate-90 text-emerald-600' : ''}`} />
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {provinceNode.province}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleLocateRegion(e, provCompanies, 7)}
                              title={`快速定位至${provinceNode.province}`}
                              className="opacity-0 group-hover/prov:opacity-100 p-1 rounded hover:bg-emerald-100/80 text-slate-400 hover:text-emerald-700 transition-all cursor-pointer"
                            >
                              <LocateFixed className="size-3.5" />
                            </button>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/80">
                              {provinceNode.count} 家
                            </span>
                          </div>
                        </div>

                        {/* 省级资源合计 */}
                        <div className="mt-1.5 pl-5.5 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                          <span className="flex items-center gap-0.5">
                            <span className="text-slate-400">光伏:</span>
                            <span className="text-emerald-700 font-semibold">{formatCapacityNumber(provinceNode.pvCapacity)} MWp</span>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-0.5">
                            <span className="text-slate-400">储能:</span>
                            <span className="text-blue-700 font-semibold">{formatCapacityNumber(provinceNode.storageCapacity)} MW</span>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-0.5">
                            <span className="text-slate-400">配额:</span>
                            <span className="text-amber-700 font-semibold">{formatCapacityNumber(provinceNode.storageQuota)} MWh</span>
                          </span>
                        </div>
                      </div>

                      {/* 2级行政区划: 城市 */}
                      {isProvExpanded && (
                        <div className="pl-3 pr-2 pb-2 space-y-1.5 border-t border-slate-100/60 bg-white pt-1.5">
                          {provinceNode.cities.map(cityNode => {
                            const provCityKey = `${provinceNode.province}-${cityNode.city}`;
                            const isCityExpanded = !!expandedCities[provCityKey];
                            const cityCompanies = cityNode.districts.flatMap(d => d.companies);

                            return (
                              <div key={cityNode.city} className="rounded-lg border border-slate-100/70 overflow-hidden bg-slate-50/20">
                                {/* 2级行政区划 Header */}
                                <div 
                                  onClick={() => toggleCity(provCityKey)}
                                  className="group/city px-2.5 py-1.5 hover:bg-slate-100/60 cursor-pointer transition-colors select-none"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <ChevronRight className={`size-3 text-slate-400 transition-transform ${isCityExpanded ? 'rotate-90 text-emerald-600' : ''}`} />
                                      <span className="text-xs font-semibold text-slate-700 truncate">
                                        {cityNode.city}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => handleLocateRegion(e, cityCompanies, 10)}
                                        title={`快速定位至${cityNode.city}`}
                                        className="opacity-0 group-hover/city:opacity-100 p-0.5 rounded hover:bg-emerald-100/80 text-slate-400 hover:text-emerald-700 transition-all cursor-pointer"
                                      >
                                        <LocateFixed className="size-3" />
                                      </button>
                                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        {cityNode.count} 家
                                      </span>
                                    </div>
                                  </div>

                                  {/* 市级资源合计 */}
                                  <div className="mt-1 pl-4.5 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[9.5px] text-slate-500">
                                    <span className="flex items-center gap-0.5">
                                      <span className="text-slate-400">光伏:</span>
                                      <span className="text-emerald-700 font-semibold">{formatCapacityNumber(cityNode.pvCapacity)} MWp</span>
                                    </span>
                                    <span className="text-slate-300">·</span>
                                    <span className="flex items-center gap-0.5">
                                      <span className="text-slate-400">储能:</span>
                                      <span className="text-blue-700 font-semibold">{formatCapacityNumber(cityNode.storageCapacity)} MW</span>
                                    </span>
                                    <span className="text-slate-300">·</span>
                                    <span className="flex items-center gap-0.5">
                                      <span className="text-slate-400">配额:</span>
                                      <span className="text-amber-700 font-semibold">{formatCapacityNumber(cityNode.storageQuota)} MWh</span>
                                    </span>
                                  </div>
                                </div>

                                {/* 3级行政区划: 区/县及企业具体名称 */}
                                {isCityExpanded && (
                                  <div className="pl-3 pr-1.5 pb-2 pt-1 space-y-2 border-t border-slate-100 bg-white">
                                    {cityNode.districts.map(districtNode => (
                                      <div key={districtNode.district} className="space-y-1">
                                        {/* 3级行政区划 Title */}
                                        <div className="group/dist px-1 pt-1">
                                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                                            <span className="flex items-center gap-1 text-slate-600">
                                              <MapPin className="size-2.5 text-slate-400" />
                                              {districtNode.district}
                                            </span>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                              <button
                                                type="button"
                                                onClick={(e) => handleLocateRegion(e, districtNode.companies, 13)}
                                                title={`快速定位至${districtNode.district}`}
                                                className="opacity-0 group-hover/dist:opacity-100 p-0.5 rounded hover:bg-emerald-100/80 text-slate-400 hover:text-emerald-700 transition-all cursor-pointer"
                                              >
                                                <LocateFixed className="size-2.5" />
                                              </button>
                                              <span className="text-[10px] text-slate-400">{districtNode.count} 家</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* 第3级具体企业名称列表 */}
                                        <div className="space-y-1.5 pt-0.5">
                                          {districtNode.companies.map(comp => {
                                            const isSelected = activeCompany?.id === comp.id;

                                            return (
                                              <div
                                                key={comp.id}
                                                onClick={() => handleSelectCompany(comp)}
                                                className={`p-2 rounded-lg cursor-pointer transition-all flex items-start gap-2 border ${
                                                  isSelected 
                                                    ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                                                    : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                                                }`}
                                              >
                                                {/* Logo Tag */}
                                                <div className={`size-6 rounded-md bg-gradient-to-br ${comp.logoColor} p-0.5 flex-shrink-0 mt-0.5 shadow-xs`}>
                                                  <div className="w-full h-full bg-white/30 rounded flex items-center justify-center text-[9px] font-bold text-slate-800">
                                                    {comp.shortName.charAt(0)}
                                                  </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                  <div className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-emerald-800' : 'text-slate-800'}`}>
                                                    {comp.name}
                                                  </div>

                                                  <div className="mt-1 flex items-center text-[10px]">
                                                    <span className="text-emerald-600 font-medium">
                                                      {comp.services.length} 项服务
                                                    </span>
                                                  </div>
                                                </div>

                                                {isSelected && (
                                                  <div className="size-4 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                                                    <Check className="size-2.5" />
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  未匹配到相关行政区划或企业
                </div>
              )}
            </div>
          </aside>

          {/* CENTER: Gaode Map View */}
          <main className="flex-1 relative h-full bg-slate-100 overflow-hidden flex">
            {/* AMap Container */}
            <div 
              ref={mapContainerRef} 
              className="absolute inset-0 w-full h-full z-0" 
            />

            {/* Fallback View if AMap JS API fails or is loading */}
            {mapLoadError && (
              <div className="absolute inset-0 z-0 bg-slate-900/90 text-white flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="size-10 text-amber-400 mb-3" />
                <h3 className="text-base font-bold mb-1">地图加载受限</h3>
                <p className="text-xs text-slate-300 max-w-md mb-4">
                  当前处于高安全沙箱环境，但您依然可以无缝使用左侧完整的3级行政区划联动体系和右侧全量服务面板。
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors"
                >
                  刷新重试
                </button>
              </div>
            )}

            {/* Map Overlay Quick Indicator Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              当前聚焦：{activeCompany ? `${activeCompany.province} · ${activeCompany.city} · ${activeCompany.shortName}` : '全国全景'}
            </div>

            {/* Map Control Tools (Bottom Left) */}
            <div className="absolute bottom-5 left-4 z-10 flex flex-col gap-1.5 shadow-sm bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomIn();
                  }
                }}
                className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-base cursor-pointer"
                title="放大"
              >
                +
              </button>
              <div className="h-[1px] bg-slate-200 w-full" />
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomOut();
                  }
                }}
                className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-base cursor-pointer"
                title="缩小"
              >
                -
              </button>
            </div>

            {/* Detail Panel Toggle Tab (when drawer is closed) */}
            {!isDetailOpen && (
              <button
                type="button"
                onClick={() => setIsDetailOpen(true)}
                className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Layers className="size-4 text-emerald-600" />
                展开企业详情及服务 ({activeCompany?.services.length})
              </button>
            )}

            {/* RIGHT SIDE: Enterprise Details & All Services Panel */}
            <AnimatePresence>
              {isDetailOpen && activeCompany && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 280 }}
                  className="absolute top-3 right-3 bottom-3 w-[270px] sm:w-[285px] md:w-[300px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl z-20 flex flex-col overflow-hidden"
                >
                  {/* Detail Panel Header */}
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1.5">
                      {/* 左侧企业 Logo */}
                      <div className={`size-9 rounded-xl bg-gradient-to-br ${activeCompany.logoColor} p-1 shadow-sm flex-shrink-0`}>
                        <div className="w-full h-full bg-white/30 rounded-lg flex items-center justify-center text-xs font-black text-slate-800">
                          {activeCompany.shortName.charAt(0)}
                        </div>
                      </div>

                      {/* 右侧：上方企业名称，下方企业编号 */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-black text-slate-900 leading-snug truncate" title={activeCompany.name}>
                          {activeCompany.name}
                        </h3>
                        <div className="text-[10px] font-mono font-medium text-slate-400 tracking-wider mt-0.5 flex items-center gap-1.5">
                          <span>{formatCompanyCode(activeCompany.id)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDetailOpen(false)}
                      className="size-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* Detail Panel Content Scroll */}
                  <div className="flex-1 overflow-y-auto hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 space-y-3.5">
                    
                    {/* Basic Meta: 合并 地区(省·市·区) 与 详细地址 为单一紧凑区域 */}
                    <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 text-xs flex items-start gap-2 text-slate-600">
                      <MapPin className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 leading-relaxed">
                        <div className="font-bold text-slate-800 text-[11px] truncate">
                          {activeCompany.province} · {activeCompany.city} · {activeCompany.district}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2" title={activeCompany.address}>
                          {activeCompany.address}
                        </div>
                      </div>
                    </div>

                    {/* Operational Capacity Indicators */}
                    <div>
                      <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
                        <Zap className="size-3.5 text-amber-500" />
                        企业静态指标与配置
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-emerald-700 font-medium">光伏装机</div>
                          <div className="text-xs font-black text-emerald-800 mt-0.5 truncate">{activeCompany.installedCapacity}</div>
                        </div>
                        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-blue-700 font-medium">储能装机</div>
                          <div className="text-xs font-black text-blue-800 mt-0.5 truncate">{activeCompany.storageCapacity}</div>
                        </div>
                        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-amber-700 font-medium">储能配额</div>
                          <div className="text-xs font-black text-amber-800 mt-0.5 truncate">{activeCompany.storageQuota}</div>
                        </div>
                      </div>
                    </div>

                    {/* ALL SERVICES SECTION: 当前企业下的服务 */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Activity className="size-3.5 text-emerald-600" />
                          {selectedServiceId !== 'all' && !showAllServicesInDetail ? (
                            <span>已筛选服务 ({displayedServices.length})</span>
                          ) : (
                            <span>企业服务 ({activeCompany.services.length})</span>
                          )}
                        </h4>
                        {selectedServiceId !== 'all' && (
                          <button
                            type="button"
                            onClick={() => setShowAllServicesInDetail(prev => !prev)}
                            className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {showAllServicesInDetail ? '仅筛选' : '全部显示'}
                          </button>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {displayedServices.map((service, idx) => (
                          <div 
                            key={service.id || idx}
                            onClick={() => {
                              onSelectCompany(activeCompany);
                              onClose();
                            }}
                            className={`rounded-xl border p-3.5 bg-gradient-to-r ${service.bg} border-slate-100/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer flex flex-col justify-between`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                <h5 className="text-xs font-black text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                                  {service.title}
                                </h5>
                                {(service.title === '资产管理' || service.subtitle?.toLowerCase() === 'demo') && (
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold tracking-wider bg-amber-100/90 text-amber-700 border border-amber-300/80 uppercase shadow-3xs leading-tight flex-shrink-0 select-none">
                                    DEMO
                                  </span>
                                )}
                              </div>

                              {/* 右上角仅显示服务版本，弱化为纯信息展示属性标签 */}
                              <span className="text-[10px] font-medium text-slate-400/90 tracking-wide select-none flex-shrink-0 flex items-center gap-1">
                                <span className="size-1 rounded-full bg-slate-300/80"></span>
                                {service.version || (
                                  service.id === '1' || service.id === '4' || service.id === '7' ? 'AI预测版' :
                                  service.id === '3' || service.id === '6' || service.id === '8' ? '高级版' : '基础版'
                                )}
                              </span>
                            </div>

                            {/* Bottom Row: Left side is Metric ticker & Dashboard Button (mutually exclusive on hover), Right side is Enter indicator */}
                            <div className="mt-2.5 pt-2 border-t border-white/60 flex items-center justify-between gap-3 min-h-[44px]">
                              {/* 左侧区域：有数值时默认显示数值，hover时互斥切换为数据看板；无数值时默认显示数据看板 */}
                              <div className="flex-1 min-w-0 pr-2">
                                {SERVICES_WITH_METRICS.has(service.title) && service.metrics && service.metrics.length > 0 ? (
                                  <div className="relative h-10 flex items-center group/metric">
                                    {/* 默认显示翻牌器，当鼠标hover该区域时淡出隐藏 */}
                                    <div className="w-full transition-opacity duration-200 group-hover/metric:opacity-0 group-hover/metric:pointer-events-none">
                                      <ServiceMetricTicker metrics={service.metrics} />
                                    </div>

                                    {/* 数据看板按钮：平时隐藏，hover数值区域时淡入显示并可点击 */}
                                    {service.hasDashboard !== false && (
                                      <div className="absolute inset-0 flex items-center opacity-0 group-hover/metric:opacity-100 pointer-events-none group-hover/metric:pointer-events-auto transition-all duration-200">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectCompany(activeCompany);
                                            onClose();
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
                                  service.hasDashboard !== false ? (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectCompany(activeCompany);
                                        onClose();
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-emerald-700 bg-white/70 hover:bg-white border border-slate-200/70 hover:border-emerald-300 shadow-2xs transition-all duration-200 cursor-pointer"
                                      title="打开数据看板"
                                    >
                                      <MonitorPlay className="size-3.5 text-slate-500 hover:text-emerald-600 transition-colors shrink-0" />
                                      <span className="text-xs font-semibold leading-none whitespace-nowrap">数据看板</span>
                                    </button>
                                  ) : (
                                    <div className="h-10" />
                                  )
                                )}
                              </div>

                              {/* 右侧：进入样式与工作台侧边栏一致，仅hover时显示 */}
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
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </motion.div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}
