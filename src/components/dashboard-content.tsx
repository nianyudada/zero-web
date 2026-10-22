import { Leaf, Flame, Zap, Award, ArrowUpRight, ShieldAlert, ChevronRight, Cloud, Droplets, Sun, Wind, Send, ThumbsUp, Eye, ExternalLink, X } from 'lucide-react';
import { EnergyTools } from './energy-tools';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface DashboardContentProps {
  isTrialMode: boolean;
  hideTools?: boolean;
}

const NEWS_DATA = [
  {
    id: 1,
    title: "什么是绿色工厂？和零碳工厂有什么区别？",
    excerpt: "导读：在“双碳”目标的大背景下，“绿色工厂”已成为制造业企业转型升级的标配资质。但究竟什么才是绿色工厂...",
    category: "知识中心",
    date: "2026-08-14 09:57:45",
    views: 15,
    likes: 0,
    isExternal: false,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "迎峰度夏实战检验，江苏负荷快速响应...",
    excerpt: "江苏全省充分挖掘可调负荷潜力，利用市场化方式推动更多用户积极参与电力需求响应",
    category: "行业动态",
    date: "2026-08-11 10:32:17",
    views: 15,
    likes: 0,
    isExternal: true,
    source: "微信公众号",
    url: "https://example.com/news/2",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "着力构建主配微协同的新型电网，电力...",
    excerpt: "“十五五”电网投资超5万亿元，新型电力系统建设开启新周期",
    category: "行业动态",
    date: "2026-08-06 17:42:18",
    views: 13,
    likes: 0,
    isExternal: false,
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "应对气候变化“十五五”规划全解读",
    excerpt: "《国家应对气候变化“十五五”规划》印发，碳排放双控制度全面落地",
    category: "政策解读",
    date: "2026-08-06 10:54:17",
    views: 20,
    likes: 5,
    isExternal: true,
    source: "北极星能源网",
    url: "https://example.com/news/4",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "国务院印发《“十五五”碳达峰行动方案》",
    excerpt: "行动方案为“十五五”时期推进碳达峰工作提供了清晰的路线图和施工图。",
    category: "政策解读",
    date: "2026-07-10 10:45:18",
    views: 45,
    likes: 12,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "什么是绿电直连？",
    excerpt: "绿电直连：让绿色电力“点对点”直达，普通工商业的新机遇。在全球绿色贸易壁垒逐渐高筑...",
    category: "知识中心",
    date: "2026-07-10 10:25:57",
    views: 32,
    likes: 8,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "企业如何把握碳交易市场的新机遇？",
    excerpt: "随着全国碳排放权交易市场的不断完善，企业参与碳交易不仅是履约的需要，更成为了新的盈利增长点...",
    category: "知识中心",
    date: "2026-07-08 14:20:00",
    views: 58,
    likes: 15,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "虚拟电厂：打破传统电力系统边界的“无形之手”",
    excerpt: "虚拟电厂通过先进的通信和控制技术，将分散的分布式能源、储能系统和可调负荷聚合起来...",
    category: "行业动态",
    date: "2026-07-05 09:15:33",
    views: 41,
    likes: 9,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    title: "储能技术在新型电力系统中的核心作用",
    excerpt: "长时储能、固态电池等新兴技术加速突破，为电网提供不可或缺的灵活性资源...",
    category: "知识中心",
    date: "2026-07-02 11:30:45",
    views: 27,
    likes: 4,
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 10,
    title: "发改委发布关于促进新能源消纳的指导意见",
    excerpt: "为提升新能源利用率，多部门联合发文，明确提出加快配电网改造升级和灵活性资源建设...",
    category: "政策解读",
    date: "2026-06-28 16:10:22",
    views: 66,
    likes: 22,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 11,
    title: "工商业分布式光伏并网流程全面解析",
    excerpt: "从项目备案到并网验收，全面梳理最新的分布式光伏接入规范与操作指南...",
    category: "知识中心",
    date: "2026-06-25 10:05:10",
    views: 39,
    likes: 7,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 12,
    title: "绿色金融助力低碳转型，专项贷款利率创历史新低",
    excerpt: "多家国有大行推出专门针对零碳园区和绿色工厂的优惠信贷产品，助力实体经济绿色发展...",
    category: "行业动态",
    date: "2026-06-20 15:45:00",
    views: 52,
    likes: 14,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export function DashboardContent({ isTrialMode, hideTools = false }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("全部资讯");
  const [selectedExternalNews, setSelectedExternalNews] = useState<{title: string, url: string} | null>(null);
  const [dontRemindExternal, setDontRemindExternal] = useState(false);

  const handleNewsClick = (news: typeof NEWS_DATA[0]) => {
    if (news.isExternal && news.url) {
       setSelectedExternalNews({title: news.title, url: news.url});
       setDontRemindExternal(false);
    } else {
       // Optional: Internal news handling
       console.log("Clicked internal news:", news.title);
    }
  };

  const handleContinueToExternal = () => {
    if (selectedExternalNews) {
       window.open(selectedExternalNews.url, '_blank', 'noopener,noreferrer');
    }
    setSelectedExternalNews(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 min-h-[calc(100vh-64px)]">
      {/* Top Banner (Welcome Section) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003846] to-[#046366] text-white">
        {/* Background illustration/solar image placeholder */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-12822183e8fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")' }}
        />
        
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 justify-between z-10">
          <div className="space-y-4">
            <div className="text-sm font-medium text-white/80">天合富家演示 清洁能源 · 智慧未来</div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">欢迎回来，工作愉快！</h1>
            <div className="text-sm text-white/90">今天是 2026年8月24日 星期一</div>
            
            <div className="flex items-center gap-6 text-sm pt-2">
              <span className="flex items-center gap-2 font-medium"><Sun className="size-5 text-yellow-400 fill-yellow-400" /> 33°C</span>
              <span className="flex items-center gap-1.5 font-medium"><Wind className="size-4 opacity-70" /> 东南风 5级</span>
              <span className="flex items-center gap-1.5 font-medium"><Droplets className="size-4 opacity-70" /> 湿度 61%</span>
              <span className="flex items-center gap-1.5 font-medium"><Sun className="size-4 opacity-70" /> 辐照度 --W/m²</span>
            </div>
          </div>
          
          <div className="md:w-[340px] bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl self-start flex-shrink-0">
            <h3 className="font-bold text-base mb-2 text-white">如何简单判断一个地区的太阳能资源好不好？</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              可以看年等效利用小时数，超过1400小时就属于资源丰富地区，非常适合建设光伏电站。
            </p>
            <div className="bg-yellow-500/20 text-yellow-200 text-xs px-3 py-2 rounded-lg flex items-start gap-2">
              <span className="text-yellow-400">💡</span> 
              <span className="leading-relaxed">小贴士：中国西北、华北地区太阳能资源普遍优于南方。</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout below banner */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Content: News Section (Takes up 8 columns on large screens) */}
        <div className="xl:col-span-8 space-y-5">
           {/* Tabs */}
           <div className="flex flex-wrap gap-2">
              {['全部资讯', '政策解读', '行业动态', '知识中心'].map(tab => (
                 <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                       activeTab === tab ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                 >
                    {activeTab === tab && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                    {tab}
                 </button>
              ))}
           </div>
           
           {/* Grid of news cards */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {NEWS_DATA.map(news => (
                 <div 
                   key={news.id} 
                   onClick={() => handleNewsClick(news)}
                   className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                 >
                    <div className="h-40 overflow-hidden relative">
                       <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded text-emerald-600 bg-emerald-50 border border-emerald-100">{news.category}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{news.date}</span>
                       </div>
                       <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{news.title}</h3>
                       <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed">{news.excerpt}</p>
                       <div className="flex items-center gap-3 mt-4 text-[10px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-1"><Eye className="size-3.5" /> {news.views}</span>
                          {news.isExternal ? (
                             <span className="flex items-center gap-1"><ExternalLink className="size-3.5" /> {news.source || '外链'}</span>
                          ) : (
                             <span className="flex items-center gap-1"><ThumbsUp className="size-3.5" /> {news.likes}</span>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
        
        {/* Right Sidebar (Takes up 4 columns) */}
        <div className="xl:col-span-4 space-y-5 sticky top-6 self-start">
           
           {/* 服务问答 (Service Q&A) */}
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-base mb-4">服务问答</h3>
              <div className="relative">
                 <textarea 
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none min-h-[120px] placeholder:text-slate-400"
                    placeholder="请留言您的问题，云管家会尽快回复"
                 />
                 <button className="absolute bottom-3 right-3 bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                    <Send className="size-3.5 -ml-0.5" /> 提交
                 </button>
              </div>
              <div className="mt-4 text-center">
                 <button className="text-emerald-600 text-xs font-bold hover:text-emerald-700 transition-colors">查看全部留言 (0)</button>
              </div>
           </div>
           
           {/* 管理工具 (Management Tools) - Uses EnergyTools component with sidebar variant */}
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-base mb-4">管理工具</h3>
              {!hideTools && <EnergyTools variant="sidebar" />}
           </div>
           
           {/* 智慧服务 (Smart Services) */}
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 text-base mb-2">智慧服务</h3>
              
              {/* VPP Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-50/30 hover:from-indigo-100 hover:to-indigo-50 rounded-xl p-4 border border-indigo-100/50 cursor-pointer transition-all relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="font-bold text-slate-800 text-sm">虚拟电厂咨询</h4>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">虚拟电厂解决方案，提升能源灵活性</p>
                    <span className="text-indigo-600 text-xs font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">了解方案 <ChevronRight className="size-3.5" /></span>
                 </div>
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-100/50 rounded-full blur-xl group-hover:scale-110 transition-transform" />
                 <Cloud className="absolute right-4 bottom-4 size-10 text-indigo-200 opacity-50" />
              </div>
              
              {/* Zero-Carbon Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/30 hover:from-emerald-100 hover:to-emerald-50 rounded-xl p-4 border border-emerald-100/50 cursor-pointer transition-all relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="font-bold text-slate-800 text-sm">零碳园区咨询</h4>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">零碳园区规划建设，助力碳中和</p>
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">了解方案 <ChevronRight className="size-3.5" /></span>
                 </div>
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl group-hover:scale-110 transition-transform" />
                 <Leaf className="absolute right-4 bottom-4 size-10 text-emerald-200 opacity-50" />
              </div>
           </div>
           
        </div>
      </div>

      {/* External Link Modal */}
      {selectedExternalNews && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="size-5 text-amber-500" /> 安全提示
              </h3>
              <button 
                onClick={() => setSelectedExternalNews(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700 font-medium">
                您即将离开天工智云平台，请注意您的账户与财产安全。
              </p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 break-all font-mono">
                {selectedExternalNews.url}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={dontRemindExternal}
                  onChange={(e) => setDontRemindExternal(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                />
                <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">今日不再提醒</span>
              </label>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedExternalNews(null)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleContinueToExternal}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                >
                  继续访问
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

