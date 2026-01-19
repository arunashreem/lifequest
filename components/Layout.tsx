
import React from 'react';
import { Sword, LayoutDashboard, Trophy, Settings, Calendar as CalendarIcon, Wallet, ShieldAlert, Clock, ClipboardList, Dumbbell, Sparkles, Map, Library, PenTool, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gold: number;
  isBlackout?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, gold, isBlackout = false }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]', bg: 'bg-cyan-500' },
    { id: 'habits', label: 'Aura Forge', icon: <Sparkles size={20} />, color: 'text-lime-400', glow: 'shadow-[0_0_15px_rgba(163,230,53,0.5)]', bg: 'bg-lime-500' },
    { id: 'scriptorium', label: 'Scriptorium', icon: <PenTool size={20} />, color: 'text-orange-400', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.5)]', bg: 'bg-orange-500' },
    { id: 'archive', label: 'The Archive', icon: <Library size={20} />, color: 'text-sky-400', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]', bg: 'bg-sky-500' },
    { id: 'routine', label: 'Quest Log', icon: <Map size={20} />, color: 'text-indigo-400', glow: 'shadow-[0_0_15px_rgba(129,140,248,0.5)]', bg: 'bg-indigo-500' },
    { id: 'academy', label: 'Academy', icon: <Clock size={20} />, color: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(251,113,133,0.5)]', bg: 'bg-rose-500' },
    { id: 'assessments', label: 'Yr 8 Plan', icon: <ClipboardList size={20} />, color: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]', bg: 'bg-red-500' },
    { id: 'training', label: 'Training', icon: <Dumbbell size={20} />, color: 'text-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]', bg: 'bg-amber-500' },
    { id: 'operations', label: 'Tactical', icon: <ShieldAlert size={20} />, color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(232,121,249,0.5)]', bg: 'bg-fuchsia-500' },
    { id: 'calendar', label: 'Timeline', icon: <CalendarIcon size={20} />, color: 'text-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]', bg: 'bg-blue-500' },
    { id: 'shop', label: 'Treasury', icon: <Trophy size={20} />, color: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]', bg: 'bg-yellow-500' },
    { id: 'settings', label: 'Profile', icon: <Settings size={20} />, color: 'text-slate-400', glow: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]', bg: 'bg-slate-500' },
  ];

  if (isBlackout) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row pb-24 md:pb-0 selection:bg-cyan-500/50 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 flex-col bg-[#050508] border-r border-white/[0.1] p-8 sticky top-0 h-screen shadow-[25px_0_80px_rgba(0,0,0,1)] z-50">
        <div className="flex items-center gap-5 mb-16 group relative">
          <div className="relative">
            <div className="absolute inset-[-10px] bg-cyan-600 blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="relative bg-gradient-to-br from-cyan-400 to-indigo-600 p-4 rounded-2xl border border-white/40 shadow-[0_0_30px_rgba(0,242,255,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Sword className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]" size={28} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="pixel-font text-[16px] tracking-widest text-white glow-text-blue mb-1">LIFEQUEST</h1>
            <p className="text-[9px] font-black text-cyan-400/70 uppercase tracking-[0.5em]">SYSTEM VERSION X</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 -mr-4 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-white/[0.08] text-white border border-white/20' 
                    : 'text-slate-500 hover:text-slate-100'
                }`}
              >
                {isActive && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${tab.color.replace('text', 'bg')} shadow-[0_0_15px_currentColor]`} />
                )}
                <div className={`transition-all duration-500 ${isActive ? `scale-125 ${tab.color} drop-shadow-[0_0_10px_currentColor]` : 'group-hover:scale-110 group-hover:text-white'}`}>
                  {tab.icon}
                </div>
                <span className={`font-black text-[11px] uppercase tracking-[0.3em] transition-all ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Treasury HUD */}
        <div className="mt-10 relative">
          <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full" />
          <div className="relative p-7 bg-slate-950 border border-yellow-500/30 rounded-[2.5rem] shadow-2xl flex flex-col gap-3 group hover:border-yellow-400 transition-all">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500 border border-yellow-500/40">
                   <Wallet size={16} />
                 </div>
                 <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">TREASURY</span>
               </div>
               <Sparkles size={14} className="text-yellow-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white glow-text-gold tracking-tighter">{gold.toLocaleString()}</span>
              <span className="text-xs font-black text-yellow-600 uppercase tracking-widest">GP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation HUD */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#050508]/90 backdrop-blur-2xl border-t border-white/10 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1.5 min-w-[70px] px-2 py-2 rounded-2xl transition-all duration-300 relative ${
                  isActive ? 'bg-white/5' : 'opacity-40 hover:opacity-100'
                }`}
              >
                {isActive && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${tab.bg} shadow-[0_4px_12px_currentColor]`} />
                )}
                <div className={`transition-all duration-300 ${isActive ? `${tab.color} scale-110 drop-shadow-[0_0_8px_currentColor]` : 'text-slate-400'}`}>
                  {tab.icon}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Mobile Swipe Hint */}
        <div className="flex justify-center mt-2 opacity-20">
          <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="p-6 md:p-16 lg:p-20 max-w-8xl mx-auto pb-32">
          {children}
        </div>
      </main>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
