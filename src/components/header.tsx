import { HelpCircle, LogOut, Bell, BookOpen } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  onShowGuide: () => void;
  onShowMessageCenter: () => void;
  onShowHelpCenter: () => void;
}

export function Header({ onLogout, onShowGuide, onShowMessageCenter, onShowHelpCenter }: HeaderProps) {
  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-100 bg-white px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-green-500/20">
          天
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-none mb-0.5">
            天工智云
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            智慧能效管理平台
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* 帮助中心入口 */}
        <button
          type="button"
          onClick={onShowHelpCenter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all cursor-pointer"
        >
          <BookOpen className="size-3.5" />
          帮助中心
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-1.5">
          {/* 消息中心 */}
          <button
            type="button"
            onClick={onShowMessageCenter}
            className="relative flex items-center justify-center size-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            title="消息中心"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-1.5 bg-rose-500 rounded-full border border-white" />
          </button>

          {/* 帮助指引 */}
          <button
            type="button"
            onClick={onShowGuide}
            className="flex items-center justify-center size-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            title="系统指引"
          >
            <HelpCircle className="size-5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* 退出登录 */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center size-9 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer border border-transparent hover:border-rose-100"
          title="退出登录"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </header>
  );
}
