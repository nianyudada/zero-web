import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Check, AlertCircle, Zap, Building2, Cpu, TriangleAlert, X, Bell } from 'lucide-react';

interface MessageCenterProps {
  onClose: () => void;
  isMobile?: boolean; // kept for compatibility but not used
}

const MESSAGES = [
  {
    id: 1,
    severity: 'urgent',
    source: '智能微网',
    time: '今日 10:24',
    title: '10kV母线过流跳闸告警',
    description: '进线柜过流跳闸，储能已微秒级切入保供。',
    enterprise: '唐山圣中机械装备制造',
    unread: true,
  },
  {
    id: 2,
    severity: 'urgent',
    source: '能源管理',
    time: '今日 09:45',
    title: '月度最高需量功率越限预警',
    description: '需量已达申报值98.8%，建议启动削峰。',
    enterprise: '深圳比亚迪科技研发总部',
    unread: true,
  },
  {
    id: 3,
    severity: 'important',
    source: '能源管理',
    time: '今日 08:30',
    title: '峰谷电价差套利调度建议',
    description: '今日峰谷价差达0.86元，可调度储能获益。',
    enterprise: '唐山圣中机械装备制造',
    unread: true,
  },
  {
    id: 4,
    severity: 'important',
    source: '智能微网',
    time: '今日 07:15',
    title: '储能电池簇单体温差预警',
    description: 'BMS检测到电芯温差4.8℃，液冷已提速。',
    enterprise: '上海临港智能装备产业园',
    unread: false,
  },
];

export function MessageCenter({ onClose }: MessageCenterProps) {
  const [messages, setMessages] = useState(MESSAGES);
  
  const unreadCount = messages.filter(m => m.unread).length;
  
  const handleMarkAllRead = () => {
    setMessages(messages.map(m => ({ ...m, unread: false })));
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-slate-50 z-[100] flex flex-col shadow-2xl border-l border-slate-200"
      >
        {/* Unified Top Header */}
        <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-slate-100 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Bell className="size-4" />
              </div>
              <h2 className="font-black text-slate-800 text-base tracking-wide">消息中心</h2>
            </div>
            
            <div className="h-4 w-px bg-slate-200" />
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-baseline gap-1">
                <span className="text-slate-500 font-medium text-xs">全部</span>
                <span className="font-bold text-slate-800">{messages.length}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-slate-500 font-medium text-xs">未读</span>
                <span className="font-bold text-rose-600">{unreadCount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50 active:scale-95 transition-all px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
            >
              <Check className="size-3.5" />
              全部已读
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-4 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {msg.unread && <span className="size-2 rounded-full bg-rose-500 shrink-0" />}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                    msg.severity === 'urgent' 
                      ? 'bg-rose-50 text-rose-600 border-rose-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {msg.severity === 'urgent' ? <AlertCircle className="size-3" /> : <TriangleAlert className="size-3" />}
                    {msg.severity === 'urgent' ? '紧急' : '重要'}
                  </div>
                  
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold">
                    {msg.source === '智能微网' ? <Zap className="size-3" /> : <Cpu className="size-3" />}
                    {msg.source}
                  </div>
                </div>
                
                <div className="flex items-center text-[11px] text-slate-500 font-medium">
                  {msg.time}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 text-sm mb-1.5">{msg.title}</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{msg.description}</p>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-2.5 border-t border-slate-100 border-dashed">
                <Building2 className="size-3.5 text-slate-400" />
                {msg.enterprise}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
