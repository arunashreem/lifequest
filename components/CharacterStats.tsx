
import React from 'react';
import { UserStats } from '../types';
import { Zap, Shield, Brain, Heart, Users, Coins, Flame, Star } from 'lucide-react';

interface CharacterStatsProps {
  stats: UserStats;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ stats }) => {
  const xpPercentage = (stats.xp / stats.maxXp) * 100;

  const AttributeRow = ({ icon, label, value, color, glow }: { icon: React.ReactNode, label: string, value: number, color: string, glow: string }) => (
    <div className="flex items-center justify-between group py-2 px-1 rounded-xl hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4">
        <div className={`${color} p-2.5 rounded-xl text-white group-hover:scale-110 transition-all shadow-lg ${glow}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-16 bg-slate-950 rounded-full overflow-hidden hidden sm:block border border-white/[0.03]">
          <div className={`${color} h-full transition-all duration-1000 ${glow}`} style={{ width: `${Math.min(100, value * 10)}%` }} />
        </div>
        <span className="text-xs font-black text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner min-w-[36px] text-center">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="rpg-card rounded-[3rem] p-8 border-white/[0.05] shadow-2xl relative overflow-hidden group">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] pointer-events-none group-hover:bg-blue-600/20 transition-all" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/5 blur-[50px] pointer-events-none" />
      
      {/* Header Section */}
      <div className="flex flex-col gap-8 mb-10 relative z-10">
        <div className="flex flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-24 h-24 rounded-[2rem] border-2 border-blue-500/30 overflow-hidden bg-slate-800 flex items-center justify-center p-2.5 shadow-2xl relative z-10 group-hover:border-blue-500/60 transition-all ring-4 ring-slate-950">
              <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=Hero&backgroundColor=1e293b&radius=20`} 
                alt="Avatar" 
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black px-4 py-1.5 rounded-2xl text-[10px] border-4 border-slate-900 shadow-2xl uppercase tracking-[0.1em] z-20">
              LVL {stats.level}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-white uppercase tracking-tight leading-none mb-3 flex flex-col gap-1">
              <span className="text-[10px] text-blue-400 font-black tracking-[0.4em] opacity-80">LEGENDARY</span>
              <span className="text-2xl sm:text-3xl truncate italic text-glow">The Hero</span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.05] shadow-inner">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                {stats.xp.toLocaleString()} <span className="text-slate-600 mx-1">/</span> {stats.maxXp.toLocaleString()} <span className="text-slate-500 ml-1">XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* XP Bar Container */}
        <div className="space-y-2.5">
          <div className="w-full h-4 bg-slate-950 rounded-full border-2 border-white/[0.05] overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 xp-bar-fill relative z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center px-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
             <span className="group-hover:text-blue-400 transition-colors">Progression Momentum</span>
             <span className="text-blue-400">{Math.round(xpPercentage)}% Complete</span>
          </div>
        </div>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/[0.05] shadow-inner hover:border-yellow-500/20 transition-all">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-lg">
              <Coins size={14} className="text-yellow-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none">{stats.gold.toLocaleString()}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Sovereign</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/[0.05] shadow-inner hover:border-orange-500/20 transition-all">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-lg">
              <Flame size={14} className="text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none">{stats.streak}D</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Momentum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Section */}
      <div className="space-y-4 pt-8 border-t border-white/[0.05]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 text-center opacity-60">Ascension Matrix</h3>
        <div className="grid grid-cols-1 gap-1">
          <AttributeRow icon={<Shield size={14}/>} label="Might" value={stats.attributes.strength} color="bg-rose-500" glow="shadow-rose-900/40" />
          <AttributeRow icon={<Brain size={14}/>} label="Intel" value={stats.attributes.intelligence} color="bg-indigo-500" glow="shadow-indigo-900/40" />
          <AttributeRow icon={<Zap size={14}/>} label="Will" value={stats.attributes.wisdom} color="bg-amber-500" glow="shadow-amber-900/40" />
          <AttributeRow icon={<Heart size={14}/>} label="Core" value={stats.attributes.vitality} color="bg-emerald-500" glow="shadow-emerald-900/40" />
          <AttributeRow icon={<Users size={14}/>} label="Ego" value={stats.attributes.charisma} color="bg-fuchsia-500" glow="shadow-fuchsia-900/40" />
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
