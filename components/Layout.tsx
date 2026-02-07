
import React from 'react';
import { Sword, LayoutDashboard, Trophy, Settings, Calendar, Wallet, Clock, ClipboardList, Dumbbell, Sparkles, Map, Library, PenTool, Scan, MessageSquareCode, Hammer, LogOut, Flame, Target, Wind } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gold: number;
  isBlackout?: boolean;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, gold, isBlackout = false, onLogout }) => {
  const tabs = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={18} />, color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    { id: 'oracle', label: 'The Oracle', icon: <MessageSquareCode size={18} />, color: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20' },
    { id: 'focus', label: 'Focus Forge', icon: <Wind size={18} />, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    { id: 'chores', label: 'Base Ops', icon: <Hammer size={18} />, color: 'text-orange-400', glow: 'shadow-orange-500/20' },
    { id: 'habits', label: 'Aura Forge', icon: <Sparkles size={18} />, color: 'text-lime-400', glow: 'shadow-lime-500/20' },
    { id: 'scriptorium', label: 'Scriptorium', icon: <PenTool size={18} />, color: 'text-sky-400', glow: 'shadow-sky-500/20' },
    { id: 'stance', label: 'Stance Sync', icon: <Scan size={18} />, color: 'text-rose-400', glow: 'shadow-rose-500/20' },
    { id: 'archive', label: 'Great Archive', icon: <Library size={18} />, color: 'text-blue-400', glow: 'shadow-blue-500/20' },
    { id: 'routine', label: 'Quest Log', icon: <Clock size={18} />, color: 'text-purple-400', glow: 'shadow-purple-500/20' },
    { id: 'academy', label: 'Academy Campaign', icon: <Map size={18} />, color: 'text-teal-400', glow: 'shadow-teal-500/20' },
    { id: 'training', label: 'Training Grounds', icon: <Dumbbell size={18} />, color: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    { id: 'calendar', label: 'Battle Map', icon: <Calendar size={18} />, color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    { id: 'shop', label: 'Treasury', icon: <Trophy size={18} />, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { id: 'settings', label: 'Identity', icon: <Settings size={18} />, color: 'text-slate-400', glow: 'shadow-slate-500/20' },
  ];

  if (isBlackout) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row pb-24 md:pb-0">
      {/* RPG HUD Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-black/60 border-r border-white/5 p-6 sticky top-0 h-screen z-50 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-10 px-2 group cursor-default">
          <div className="bg-cyan-500/20 p-3 rounded-2xl border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,255,0.2)] group-hover:scale-110 transition-transform">
            <Sword className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="pixel-font text-[10px] tracking-widest text-white leading-none mb-2 glow-text-blue">LIFEQUEST</h1>
            <p className="text-[7px] font-black text-cyan-900 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-full inline-block">Neural OS v2.5</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? `bg-white/5 text-white border border-white/10 ${tab.glow}` 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-[-1.5rem] w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(0,242,255,1)]" />
                )}
                <div className={`${isActive ? tab.color : 'text-slate-600 group-hover:text-slate-400'}`}>
                  {tab.icon}
                </div>
                <span className={`font-black text-[10px] uppercase tracking-widest transition-all ${isActive ? 'text-white italic' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
          <div className="px-5 py-5 bg-slate-900/40 rounded-[2rem] border border-white/5 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Temporal Assets</span>
              <Wallet size={14} className="text-amber-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white italic tracking-tighter glow-text-gold">{gold.toLocaleString()}</span>
              <span className="text-[9px] font-black text-amber-600 uppercase italic">GP</span>
            </div>
          </div>

          {onLogout && (
            <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all group">
              <LogOut size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-black text-[10px] uppercase tracking-widest">Terminate Link</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile RPG HUD */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-2xl border-t border-cyan-500/20 px-2 py-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 flex-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-2 min-w-[85px] py-2 px-1 transition-all rounded-xl shrink-0 ${
                activeTab === tab.id ? `${tab.color} bg-white/5` : 'text-slate-600'
              }`}
            >
              <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</div>
              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                {tab.id === 'archive' ? 'ARCHIVE' : tab.label.split(' ')[0]}
              </span>
            </button>
          ))}
          <div className="min-w-[40px] shrink-0" />
        </div>
        {/* Scroll hint gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </nav>

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="p-6 md:p-14 lg:p-20 max-w-7xl mx-auto pb-32">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
