
import React from 'react';
import { Sword, LayoutDashboard, Trophy, Settings, Calendar as CalendarIcon, Wallet, ShieldAlert, Clock, ClipboardList, Dumbbell, Sparkles, Map, Library, PenTool } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gold: number;
  isBlackout?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, gold, isBlackout = false }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'habits', label: 'Aura Forge', icon: <Sparkles size={20} /> },
    { id: 'scriptorium', label: 'Scriptorium', icon: <PenTool size={20} /> },
    { id: 'archive', label: 'The Archive', icon: <Library size={20} /> },
    { id: 'routine', label: 'Quest Log', icon: <Map size={20} /> },
    { id: 'academy', label: 'Academy', icon: <Clock size={20} /> },
    { id: 'assessments', label: 'Yr 8 Plan', icon: <ClipboardList size={20} /> },
    { id: 'training', label: 'Training', icon: <Dumbbell size={20} /> },
    { id: 'operations', label: 'Tactical', icon: <ShieldAlert size={20} /> },
    { id: 'calendar', label: 'Timeline', icon: <CalendarIcon size={20} /> },
    { id: 'shop', label: 'Treasury', icon: <Trophy size={20} /> },
    { id: 'settings', label: 'Profile', icon: <Settings size={20} /> },
  ];

  if (isBlackout) {
    return (
      <div className="min-h-screen bg-black transition-colors duration-1000 overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row pb-24 md:pb-0 selection:bg-blue-500/30 selection:text-blue-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-80 flex-col bg-slate-950/80 backdrop-blur-[40px] border-r border-white/[0.05] p-8 sticky top-0 h-screen shadow-[15px_0_50px_rgba(0,0,0,0.9)] z-50 overflow-hidden">
        {/* Decorative scanline for sidebar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-scan" />
        
        <div className="flex items-center gap-5 mb-16 px-1 group cursor-pointer relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-900 p-4 rounded-2xl shadow-2xl border border-white/30 group-hover:scale-110 transition-transform duration-500">
              <Sword className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" size={28} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="pixel-font text-[13px] tracking-[0.2em] text-white leading-none mb-1 text-glow">LIFEQUEST</h1>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">V.2.5 CORE</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 -mr-4 no-scrollbar relative z-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-900/10 text-white border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent'
                }`}
              >
                {isActive && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                  </>
                )}
                <div className={`transition-all duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                  {tab.icon}
                </div>
                <span className={`font-bold text-[11px] uppercase tracking-[0.25em] transition-all ${isActive ? 'text-white' : 'group-hover:text-slate-100'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Global Wealth Hud */}
        <div className="mt-8 relative group">
          <div className="absolute inset-[-2px] bg-gradient-to-r from-yellow-500 to-amber-700 blur-lg opacity-10 group-hover:opacity-30 transition-all duration-700" />
          <div className="relative p-6 bg-slate-900/80 rounded-[2rem] border border-yellow-500/20 flex flex-col gap-3 shadow-2xl overflow-hidden group-hover:border-yellow-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20 shadow-lg">
                <Wallet className="text-yellow-500" size={16} />
              </div>
              <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Treasury</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tighter tabular-nums text-glow">
                {gold.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest italic opacity-60">GP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative transition-all">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 bg-slate-950/95 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-3 rounded-xl shadow-xl border border-white/20">
              <Sword className="text-white" size={20} />
            </div>
            <h1 className="pixel-font text-[10px] text-white tracking-widest">LIFEQUEST</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-yellow-500/20 rounded-xl shadow-lg">
            <Wallet size={14} className="text-yellow-500" />
            <span className="text-sm font-black text-white">{gold}</span>
          </div>
        </header>

        <div className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto relative z-10 pb-32 md:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-950/95 border border-white/10 flex overflow-x-auto no-scrollbar p-2 z-[1000] backdrop-blur-3xl rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,1)] gap-1 ring-1 ring-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[85px] h-16 rounded-[2rem] transition-all duration-300 relative ${
                isActive 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-xl shadow-blue-500/20 scale-105' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`${isActive ? 'scale-110 mb-0.5' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <style>{`
        @keyframes scan {
          from { transform: translateY(0); opacity: 0.1; }
          to { transform: translateY(100vh); opacity: 0; }
        }
        .animate-scan { animation: scan 8s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
