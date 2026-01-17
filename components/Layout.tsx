
import React from 'react';
import { Sword, LayoutDashboard, Trophy, Settings, Calendar as CalendarIcon, Wallet, ShieldAlert, Clock, ClipboardList, Dumbbell, Sparkles, Map, Library } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gold: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, gold }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'habits', label: 'Aura Forge', icon: <Sparkles size={20} /> },
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

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row pb-24 md:pb-0 selection:bg-blue-500/30 selection:text-blue-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-80 flex-col bg-slate-900/40 backdrop-blur-3xl border-r border-white/[0.04] p-8 sticky top-0 h-screen shadow-[10px_0_40px_rgba(0,0,0,0.5)] z-50">
        <div className="flex items-center gap-4 mb-16 px-1 group cursor-default">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(37,99,235,0.4)] animate-float border border-white/20">
              <Sword className="text-white drop-shadow-lg" size={28} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="pixel-font text-[11px] tracking-[0.1em] text-white leading-none mb-1 text-glow">LIFEQUEST</h1>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] opacity-80">Ascend Beyond</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 -mr-4 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600/90 to-indigo-700/90 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] border border-white/10' 
                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-400 rounded-full blur-[2px]" />
                )}
                <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                  {tab.icon}
                </div>
                <span className={`font-bold text-[11px] uppercase tracking-[0.15em] transition-colors ${isActive ? 'text-white' : 'group-hover:text-slate-200'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 relative group">
          <div className="absolute inset-0 bg-yellow-500/5 blur-xl group-hover:bg-yellow-500/10 transition-colors" />
          <div className="relative p-6 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-[2.5rem] border border-yellow-500/10 flex flex-col gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                <Wallet className="text-yellow-500" size={16} />
              </div>
              <span className="text-[10px] font-black text-yellow-500/70 uppercase tracking-[0.2em]">Inventory Gold</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-500 tracking-tighter drop-shadow-md">
                {gold.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">GP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#020617]">
        {/* Animated background highlights */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-80 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] pointer-events-none" />
        
        <header className="md:hidden flex items-center justify-between p-6 bg-slate-950/80 backdrop-blur-2xl border-b border-white/[0.03] sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/30">
              <Sword className="text-white" size={20} />
            </div>
            <h1 className="pixel-font text-[10px] text-white tracking-widest text-glow">LIFEQUEST</h1>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-inner">
            <Wallet size={14} className="text-yellow-500" />
            <span className="text-xs font-black text-yellow-500 tracking-tight">{gold}</span>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900/80 border border-white/10 flex overflow-x-auto scrollbar-hide p-2 z-50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] gap-1.5 ring-1 ring-white/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[84px] h-16 rounded-[2rem] transition-all duration-300 relative group active:scale-95 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 transition-all ${
                isActive ? 'opacity-100' : 'opacity-40'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
