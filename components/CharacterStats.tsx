
import React from 'react';
import { UserStats } from '../types';
import { Zap, Shield, Brain, Heart, Users, Coins, Flame, Star } from 'lucide-react';

interface CharacterStatsProps {
  stats: UserStats;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ stats }) => {
  const xpPercentage = (stats.xp / stats.maxXp) * 100;
  const avatarSeed = stats.avatarSeed || 'Hero';

  const AttributeRow = ({ icon, label, value, color, glow }: { icon: React.ReactNode, label: string, value: number, color: string, glow: string }) => (
    <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-slate-950/40 border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 group">
      <div className="flex items-center justify-between min-w-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`relative ${color} p-1.5 sm:p-2 rounded-lg text-white group-hover:scale-105 transition-all shadow-lg ${glow} shrink-0`}>
            <div className="relative z-10 scale-90 sm:scale-100">{icon}</div>
          </div>
          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</span>
        </div>
        <span className="text-xs sm:text-sm font-black text-white italic tracking-tighter tabular-nums">{value}</span>
      </div>
      <div className="flex gap-1 h-1 w-full">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full transition-all duration-700 ${
              i < value ? `${color} ${glow} shadow-[0_0_6px_currentColor]` : 'bg-slate-900 opacity-20'
            }`} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="rpg-card rounded-[2.5rem] p-5 sm:p-8 md:p-10 border-white/[0.05] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group w-full max-w-full">
      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none group-hover:bg-blue-600/15 transition-all duration-1000" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/5 blur-[80px] pointer-events-none" />
      
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 relative z-10">
        {/* Header HUD Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8 min-w-0">
          {/* Avatar Area */}
          <div className="relative shrink-0">
            <div className="relative">
              <div className="absolute inset-[-10px] bg-blue-500/15 blur-2xl animate-pulse" />
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[2.5rem] border border-white/10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex items-center justify-center p-3 shadow-2xl relative z-10 group-hover:border-blue-400/40 transition-all ring-4 ring-slate-950/50">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=1e293b&radius=20`} 
                  alt="Avatar" 
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black px-4 py-1.5 rounded-xl text-[9px] sm:text-[10px] border-2 border-slate-950 shadow-xl uppercase tracking-widest z-20 whitespace-nowrap">
                LVL {stats.level}
              </div>
            </div>
          </div>
          
          {/* Identity & Progress Area */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 w-full pt-1">
            <span className="text-[8px] sm:text-[9px] text-blue-400 font-black tracking-[0.3em] uppercase text-glow mb-1 block opacity-80">
              {stats.level >= 50 ? 'DIVINE SOVEREIGN' : stats.level >= 20 ? 'MASTER VANGUARD' : 'LEGENDARY HERO'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-tight text-glow break-words w-full mb-5">
              {stats.name}
            </h2>
            
            {/* Experience Unit - Redesigned to fix overlap */}
            <div className="w-full flex items-center gap-3 bg-slate-950/60 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/[0.05] shadow-xl group-hover:border-blue-500/20 transition-all">
              <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/15 shrink-0">
                <Star size={16} className="text-yellow-400 animate-spin-slow" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5 overflow-hidden">
                  <span className="text-sm sm:text-base font-black text-white tabular-nums tracking-widest leading-none whitespace-nowrap">
                    {stats.xp.toLocaleString()} 
                  </span>
                  <span className="text-[10px] font-black text-slate-600 leading-none">/</span>
                  <span className="text-xs sm:text-sm font-black text-slate-400 tabular-nums leading-none whitespace-nowrap">
                    {stats.maxXp.toLocaleString()}
                  </span>
                </div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1.5 opacity-60">Exp Manifested</span>
              </div>
            </div>
          </div>
        </div>

        {/* HUD Progress Bar */}
        <div className="relative px-0.5">
          <div className="w-full h-4 sm:h-5 bg-slate-950/80 rounded-xl border border-white/[0.03] overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-800 via-blue-500 to-cyan-400 relative z-10 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              style={{ width: `${Math.min(100, xpPercentage)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>
          </div>
        </div>

        {/* Vital Stats Cluster */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-950/50 p-4 sm:p-5 rounded-[2rem] border border-white/[0.03] shadow-lg hover:border-yellow-500/20 transition-all flex flex-col items-center sm:flex-row gap-3 group/stat">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/5 flex items-center justify-center border border-yellow-500/10 shrink-0 group-hover/stat:rotate-6 transition-all">
              <Coins size={18} className="text-yellow-500" />
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tighter tabular-nums leading-none block truncate">
                {stats.gold.toLocaleString()}
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Spoils</span>
            </div>
          </div>
          
          <div className="bg-slate-950/50 p-4 sm:p-5 rounded-[2rem] border border-white/[0.03] shadow-lg hover:border-orange-500/20 transition-all flex flex-col items-center sm:flex-row gap-3 group/stat">
            <div className="w-10 h-10 rounded-lg bg-orange-500/5 flex items-center justify-center border border-orange-500/10 shrink-0 group-hover/stat:rotate-6 transition-all">
              <Flame size={18} className="text-orange-400 animate-pulse" />
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tighter tabular-nums leading-none block truncate">
                {stats.streak}D
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Streak</span>
            </div>
          </div>
        </div>

        {/* Attributes Matrix Section */}
        <div className="pt-6 border-t border-white/[0.05] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#020617] px-6 py-1 rounded-full border border-white/5 shadow-lg z-10">
             <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest italic opacity-70">Ascension Matrix</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <AttributeRow icon={<Shield size={14}/>} label="Might" value={stats.attributes.strength} color="bg-rose-500" glow="shadow-rose-600/30" />
            <AttributeRow icon={<Brain size={14}/>} label="Intel" value={stats.attributes.intelligence} color="bg-indigo-500" glow="shadow-indigo-600/30" />
            <AttributeRow icon={<Zap size={14}/>} label="Will" value={stats.attributes.wisdom} color="bg-amber-500" glow="shadow-amber-600/30" />
            <AttributeRow icon={<Heart size={14}/>} label="Core" value={stats.attributes.vitality} color="bg-emerald-500" glow="shadow-emerald-600/30" />
            <div className="sm:col-span-2">
              <AttributeRow icon={<Users size={14}/>} label="Charisma" value={stats.attributes.charisma} color="bg-fuchsia-500" glow="shadow-fuchsia-600/30" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-shimmer { animation: shimmer 3s infinite linear; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CharacterStats;
