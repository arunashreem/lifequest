
import React from 'react';
import { UserStats } from '../types';
import { Zap, Shield, Brain, Heart, Users, Star, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface CharacterStatsProps { stats: UserStats; }

const CharacterStats: React.FC<CharacterStatsProps> = ({ stats }) => {
  const xpPercentage = (stats.xp / stats.maxXp) * 100;
  const avatarSeed = stats.avatarSeed || 'Hero';

  const AttributeCard = ({ icon, label, value, gradient, textColor, glowClass }: any) => (
    <div className="flex flex-col gap-3 p-5 rounded-[2.5rem] bg-[#020205]/60 border border-white/[0.08] hover:border-white/20 transition-all duration-500 group relative shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex-1">
      {/* Subtle Inner Glow */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${gradient} opacity-[0.02] group-hover:opacity-10 transition-opacity blur-2xl rounded-full`} />
      
      <div className="flex items-center justify-between relative z-10 w-full">
        <div className={`p-2 rounded-xl bg-slate-950 border border-white/10 ${textColor} shadow-2xl group-hover:scale-110 transition-all`}>
          {React.cloneElement(icon, { size: 16 })}
        </div>
        
        <div className="flex items-baseline gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
          <span className={`text-xl font-black italic tracking-tighter tabular-nums leading-none ${textColor} ${glowClass}`}>
            {value}
          </span>
          <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest ml-0.5">LVL</span>
        </div>
      </div>

      <div className="relative z-10">
        <h4 className={`text-[10px] font-black uppercase italic tracking-widest leading-none ${textColor} ${glowClass}`}>
          {label}
        </h4>
      </div>

      <div className="mt-auto pt-2">
        <div className="flex gap-1 h-1 w-full bg-black/60 rounded-full overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-700 ${
                i < value 
                  ? `${gradient} shadow-[0_0_8px_rgba(255,255,255,0.2)]` 
                  : 'bg-slate-900'
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rpg-card rounded-[4.5rem] p-8 md:p-12 border-cyan-500/30 relative group bg-black shadow-[0_0_80px_rgba(0,242,255,0.1)] h-full flex flex-col overflow-hidden">
      {/* Primary Neon Rail */}
      <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-[4.5rem] pointer-events-none group-hover:border-cyan-500/30 transition-all duration-700" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-50 blur-[2px]" />

      {/* Holographic Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-[4.5rem] overflow-hidden" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="flex flex-col gap-10 relative z-10 h-full">
        {/* Identity Cluster */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-[-30px] bg-cyan-500/10 blur-[80px] animate-pulse rounded-full" />
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] border-4 border-white/10 bg-[#030305] flex items-center justify-center p-6 shadow-[0_0_60px_rgba(0,242,255,0.2)] relative z-10 overflow-hidden group-hover:border-cyan-500/40 transition-all">
                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=000000&radius=20`} alt="Hero" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-white font-black px-5 py-1.5 rounded-xl text-[10px] border-4 border-black shadow-2xl z-20 whitespace-nowrap glow-text-blue italic uppercase tracking-[0.2em]">
                LEVEL {stats.level}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left min-w-0">
            <div className="mb-4 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-3">
                <span className="text-[8px] text-cyan-400 font-black tracking-[0.5em] uppercase">SYSTEM CORE LINKED</span>
                <Sparkles size={8} className="text-cyan-400 animate-pulse" />
              </div>
              {/* Added responsive scaling and break-words to prevent name cut-off */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-[0.9] glow-text-blue break-words uppercase">
                {stats.name}
              </h2>
            </div>
            
            <div className="w-full bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5 shadow-inner relative group/xp overflow-hidden">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Neural Potential</span>
                <span className="text-base font-black text-cyan-400 tabular-nums">{stats.xp} <span className="text-slate-800 text-[8px] italic">/ {stats.maxXp}</span></span>
              </div>
              <div className="h-4 bg-black rounded-full border border-white/5 overflow-hidden p-0.5 shadow-2xl">
                <div 
                  className="h-full bg-gradient-to-r from-blue-700 via-cyan-400 to-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,242,255,0.4)]"
                  style={{ width: `${Math.min(100, xpPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attribute HUD Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          <AttributeCard 
            icon={<Shield />} label="Strength" value={stats.attributes.strength} 
            gradient="from-red-600 to-orange-500" textColor="text-red-500" glowClass="glow-text-red"
          />
          <AttributeCard 
            icon={<Brain />} label="Intelligence" value={stats.attributes.intelligence} 
            gradient="from-blue-600 to-cyan-400" textColor="text-blue-500" glowClass="glow-text-blue"
          />
          <AttributeCard 
            icon={<Zap />} label="Wisdom" value={stats.attributes.wisdom} 
            gradient="from-amber-500 to-yellow-400" textColor="text-yellow-500" glowClass="glow-text-gold"
          />
          <AttributeCard 
            icon={<Heart />} label="Vitality" value={stats.attributes.vitality} 
            gradient="from-emerald-600 to-lime-400" textColor="text-emerald-500" glowClass="glow-text-green"
          />
          <AttributeCard 
            icon={<Users />} label="Charisma" value={stats.attributes.charisma} 
            gradient="from-pink-600 to-rose-500" textColor="text-pink-500" glowClass="glow-text-red"
          />
          
          <div className="flex flex-col items-center justify-center p-5 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 shadow-inner group/buff">
            <Sparkles className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Buff</p>
            <p className="text-[11px] font-black text-white uppercase italic text-center">+15% Focus Efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
