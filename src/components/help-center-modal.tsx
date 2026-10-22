import { useState } from 'react';
import { motion } from 'motion/react';
import { X, FileText, Info, History } from 'lucide-react';

interface HelpCenterModalProps {
  onClose: () => void;
}

const RELEASE_NOTES = [
  {
    version: 'v1.2.8 Standard',
    date: '2026-08-20',
    content: '全新升级消息中心交互，优化未读消息提示；修复已知样式体验问题。',
  },
  {
    version: 'v1.2.7',
    date: '2026-07-15',
    content: '上线企业能效分析工具；增加多维度ROI计算，完善绿色低碳资产测算引擎。',
  },
  {
    version: 'v1.2.0',
    date: '2026-05-10',
    content: '重大重构：全面拥抱轻量级现代化UI，重写底层大屏架构；支持响应式小程序无缝切屏。',
  },
];

const HELP_TOPICS = [
  {
    title: '能效工作台 (实时大屏)',
    desc: '提供企业全局电量、需量和碳排的综合看板，数据每分钟自动刷新，帮助您一览当前企业微网的运行状态。',
  },
  {
    title: '能效百宝箱 (计算工具)',
    desc: '集合了投资回收期(ROI)计算、分布式光伏发电量预测、碳减排计算器等，方便您在投前快速模拟评估。',
  },
  {
    title: '消息告警中心',
    desc: '实时推送系统内各设备的运行预警及紧急故障通知，依据紧急程度提供不同颜色标识及弹窗提示，支持一键已读处理。',
  },
];

export function HelpCenterModal({ onClose }: HelpCenterModalProps) {
  const [activeTab, setActiveTab] = useState<'release' | 'help'>('release');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Info className="size-4" />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-wide">
              帮助与更新中心
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('release')}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === 'release' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <History className="size-4" />
                版本说明
              </div>
              {activeTab === 'release' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === 'help' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FileText className="size-4" />
                帮助中心
              </div>
              {activeTab === 'help' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {activeTab === 'release' && (
            <div className="space-y-6">
              {RELEASE_NOTES.map((note, index) => (
                <div key={index} className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] before:w-px before:bg-slate-200 last:before:hidden">
                  <div className="absolute left-0 top-1.5 size-[24px] rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center">
                    <div className="size-2 rounded-full bg-indigo-500" />
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm ml-2">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-sm font-bold text-slate-800">{note.version}</h3>
                      <span className="text-xs font-medium text-slate-400">{note.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-base font-black text-slate-800 mb-2">欢迎使用天工智云</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  本平台为您提供一站式的企业微电网监测、数据计算及智能告警能力。以下是当前系统的主要服务功能说明：
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {HELP_TOPICS.map((topic, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-indigo-500" />
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed pl-3.5 border-l-2 border-slate-50">
                      {topic.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
