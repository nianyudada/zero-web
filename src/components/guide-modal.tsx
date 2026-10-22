import { X, Check, Award, Compass, Sparkles } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export function shouldShowGuide(): boolean {
  // Check if shown in this session
  try {
    const shown = sessionStorage.getItem('tgzy_guide_shown');
    if (!shown) {
      sessionStorage.setItem('tgzy_guide_shown', 'true');
      return true;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return false;
}

export function GuideModal({ onClose }: GuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* 头部装饰 */}
        <div className="relative h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-all cursor-pointer"
          >
            <X className="size-4" />
          </button>
          <div className="text-center space-y-1">
            <Sparkles className="size-8 mx-auto text-white animate-bounce" />
            <h3 className="font-black text-lg">欢迎来到天工智云</h3>
          </div>
        </div>

        {/* 步骤内容 */}
        <div className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">实时能效看板</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  系统会自动搜集并展示各车间能耗数据，帮助您快速评估当日用电和用水效率。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">体验与正式账号切换</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  顶部的账号切换按钮可让您随时在“正式账号”与内置的“模拟体验账号”间随意切换。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">异常主动诊断</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  通过高级算法持续对全厂大型用电设备运行进行诊断，发现异常将秒级推送并显示在右侧告警中。
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-95"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
            }}
          >
            开启体验
          </button>
        </div>
      </div>
    </div>
  );
}
