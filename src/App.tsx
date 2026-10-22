import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  User, 
  Signal, 
  Wifi, 
  Battery, 
  MoreHorizontal, 
  ChevronRight, 
  HelpCircle, 
  Sparkles,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/sidebar';
import { Header } from './components/header';
import { DashboardContent } from './components/dashboard-content';
import { LoginPage } from './components/login-page';
import { GuideModal, shouldShowGuide } from './components/guide-modal';
import { EnergyTools } from './components/energy-tools';
import { MessageCenter } from './components/message-center';
import { HelpCenterModal } from './components/help-center-modal';
import { SplashScreen } from './components/splash-screen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  
  // Mobile responsive layout and WeChat tabs
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'profile'>('home');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowGuide(shouldShowGuide());
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

      <AnimatePresence>
        {showMessageCenter && (
          <MessageCenter onClose={() => setShowMessageCenter(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelpCenter && (
          <HelpCenterModal onClose={() => setShowHelpCenter(false)} />
        )}
      </AnimatePresence>

      {/* About App Modal Popup */}
      <AnimatePresence>
        {showAboutPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutPopup(false)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full relative z-10 text-center space-y-4 shadow-xl"
            >
              <div className="size-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto text-xl font-bold">
                天
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">关于天工智云小程序</h4>
                <p className="text-[11px] text-slate-400">系统版本: v1.2.8 Standard</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                天工智云智慧能效管理平台，基于轻量级、响应式高保真微信小程序框架精雕细琢。深度整合实时能耗看板、分时电价查询、理论发电测算、ROI静态投资回收期及CO2低碳资产转化工具，赋能工业企业轻松开启绿色低碳、智效转型。
              </p>
              <button
                onClick={() => setShowAboutPopup(false)}
                className="w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WeChat action sheet bottom slide-up */}
      <AnimatePresence>
        {showActionSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActionSheet(false)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />
            
            {/* Sheet panel */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-slate-50 rounded-t-3xl border-t border-slate-100 w-full max-w-md relative z-10 overflow-hidden pb-safe"
            >
              <div className="bg-white border-b border-slate-100 py-3.5 text-center text-[11px] font-bold text-slate-400">
                天工智云快捷菜单
              </div>
              
              <div className="bg-white divide-y divide-slate-50">
                <button
                  onClick={() => {
                    setIsTrialMode(!isTrialMode);
                    setShowActionSheet(false);
                  }}
                  className="w-full py-4 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors block"
                >
                  切换到: <span className="text-green-600">{isTrialMode ? "正式账号" : "体验账号"}</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowGuide(true);
                    setShowActionSheet(false);
                  }}
                  className="w-full py-4 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors block"
                >
                  重新加载系统指引
                </button>

                <button
                  onClick={() => {
                    setShowAboutPopup(true);
                    setShowActionSheet(false);
                  }}
                  className="w-full py-4 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors block"
                >
                  关于天工智云小程序
                </button>
              </div>

              <div className="h-2 bg-slate-100" />

              <button
                onClick={() => setShowActionSheet(false)}
                className="w-full bg-white py-4 text-center text-xs font-bold text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors block"
              >
                取消
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONDITIONAL LAYOUT BASED ON SCREEN SIZE */}
      {isMobile ? (
        // MOBILE VIEW: 微信小程序风格设计
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
          
          {/* 1. 模拟手机状态栏 & 微信顶部导航栏 */}
          <div className="bg-white flex flex-col border-b border-slate-100 flex-shrink-0 z-30">
            {/* 状态栏 Status Bar */}
            <div className="h-6 flex items-center justify-between px-5 text-[10px] font-bold text-slate-700 select-none">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="size-3 text-slate-700" />
                <Wifi className="size-3 text-slate-700" />
                <div className="flex items-center gap-0.5">
                  <Battery className="size-3.5 text-slate-700" />
                </div>
              </div>
            </div>

            {/* 微信头部 Navigation Bar */}
            <div className="h-11 flex items-center justify-between px-4 relative">
              <div className="flex items-center gap-1.5 select-none">
                <div className="size-5 rounded bg-green-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm shadow-green-500/10">
                  天
                </div>
                <span className="text-xs font-black text-slate-800 tracking-tight">天工智云</span>
              </div>

              {/* 中间页面标题 (微信规范) */}
              <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-slate-800 tracking-wide">
                {activeTab === 'home' && '能效工作台'}
                {activeTab === 'tools' && '能效百宝箱'}
                {activeTab === 'profile' && '个人中心'}
              </div>

              {/* 微信标志性胶囊按钮与消息入口 */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowMessageCenter(true)}
                  className="relative p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Bell className="size-5" />
                  <span className="absolute top-1 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
                <div className="flex items-center gap-2.5 px-2.5 h-[28px] bg-white border border-slate-200 rounded-full text-slate-700 shadow-sm shadow-slate-50 select-none">
                  <button 
                    onClick={() => setShowActionSheet(true)}
                    className="hover:text-slate-900 active:scale-90 transition-transform cursor-pointer p-0.5"
                    title="更多操作"
                  >
                    <MoreHorizontal className="size-3.5 text-slate-800" />
                  </button>
                  <div className="h-3 w-px bg-slate-200" />
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="hover:text-red-500 active:scale-90 transition-transform cursor-pointer p-0.5 flex items-center justify-center"
                    title="退出小程序"
                  >
                    <div className="size-3.5 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <div className="size-1 bg-slate-800 rounded-full" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 主页面内容滚动区 */}
          <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50">
            {activeTab === 'home' && (
              <DashboardContent isTrialMode={isTrialMode} hideTools={true} />
            )}

            {activeTab === 'tools' && (
              <div className="p-4 pb-24">
                <EnergyTools />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-4 space-y-4 pb-24">
                {/* 用户信息卡片 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="size-14 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-green-500/20">
                    天
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-slate-800">天工智云用户</div>
                    <div className="text-xs text-slate-400">Nianyu2012@gmail.com</div>
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100">
                      微信小程序专享版
                    </div>
                  </div>
                </div>

                {/* 快捷数据卡 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold">运行状态</div>
                    <div className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      正常运行中
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold">系统版本</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">v1.2.8 Standard</div>
                  </div>
                </div>

                {/* 菜单列表 */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                  {/* 运行模式切换 */}
                  <div 
                    onClick={() => setIsTrialMode(!isTrialMode)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
                        <Sparkles className="size-4" />
                      </span>
                      <span className="text-xs font-bold text-slate-700">切换账号运行模式</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isTrialMode ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                        {isTrialMode ? "体验模式" : "正式账号"}
                      </span>
                      <ChevronRight className="size-4 text-slate-300" />
                    </div>
                  </div>

                  {/* 系统指引 */}
                  <div 
                    onClick={() => setShowGuide(true)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg bg-amber-50 text-amber-500">
                        <HelpCircle className="size-4" />
                      </span>
                      <span className="text-xs font-bold text-slate-700">查看新手系统指引</span>
                    </div>
                    <ChevronRight className="size-4 text-slate-300" />
                  </div>

                  {/* 关于小程序 */}
                  <div 
                    onClick={() => setShowAboutPopup(true)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg bg-sky-50 text-sky-500">
                        <User className="size-4" />
                      </span>
                      <span className="text-xs font-bold text-slate-700">关于天工智云小程序</span>
                    </div>
                    <ChevronRight className="size-4 text-slate-300" />
                  </div>
                </div>

                {/* 退出登录 */}
                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full bg-white hover:bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold text-xs border border-red-100 shadow-sm transition-colors cursor-pointer text-center"
                >
                  退出登录 / 切换账号
                </button>
              </div>
            )}
          </div>

          {/* 3. 微信小程序底部导航栏 TabBar */}
          <div className="h-14 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-around flex-shrink-0 z-30 pb-safe shadow-sm select-none">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-green-600' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <LayoutDashboard className="size-5" />
              <span className="text-[10px] font-black mt-1">工作台</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
                activeTab === 'tools' ? 'text-green-600' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <Calculator className="size-5" />
              <span className="text-[10px] font-black mt-1">能效工具</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'text-green-600' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <User className="size-5" />
              <span className="text-[10px] font-black mt-1">我</span>
            </button>
          </div>

        </div>
      ) : (
        // DESKTOP VIEW: 原有精美企业级控制台
        <>
          <Header
            onLogout={() => setIsLoggedIn(false)}
            onShowGuide={() => setShowGuide(true)}
            onShowMessageCenter={() => setShowMessageCenter(true)}
            onShowHelpCenter={() => setShowHelpCenter(true)}
          />

          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main className="flex-1 overflow-y-auto bg-slate-50">
              <DashboardContent isTrialMode={isTrialMode} />
            </main>
          </div>
        </>
      )}
    </div>
  );
}
