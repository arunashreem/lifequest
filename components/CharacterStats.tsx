
import React, { useEffect, useState, useMemo } from 'react';
import { UserStats } from '../types';
import { Zap, Shield, Brain, Heart, Users, Star, Sparkles, Activity, ShieldCheck, Scan, Crown, Medal, Info, X, Trophy, Gem, Flame, Target } from 'lucide-react';

interface CharacterStatsProps {
  stats: UserStats;
  onScanClick?: () => void;
}

const RANK_THRESHOLDS = [
  { level: 1100, tier: 'Unreal', subRank: null, color: 'text-fuchsia-400', glow: 'glow-text-fuchsia', gradient: 'from-fuchsia-600 to-indigo-600', icon: <Sparkles /> },
  { level: 780, tier: 'Champion', subRank: null, color: 'text-orange-500', glow: 'glow-text-orange', gradient: 'from-orange-600 to-red-600', icon: <Crown /> },
  { level: 460, tier: 'Elite', subRank: null, color: 'text-slate-300', glow: 'glow-text-slate', gradient: 'from-slate-600 to-slate-400', icon: <Medal /> },
  { level: 300, tier: 'Diamond', subRank: 'III', color: 'text-blue-300', glow: 'glow-text-blue', gradient: 'from-blue-600 to-blue-400', icon: <Gem /> },
  { level: 220, tier: 'Diamond', subRank: 'II', color: 'text-blue-300', glow: 'glow-text-blue', gradient: 'from-blue-600 to-blue-400', icon: <Gem /> },
  { level: 180, tier: 'Diamond', subRank: 'I', color: 'text-blue-300', glow: 'glow-text-blue', gradient: 'from-blue-600 to-blue-400', icon: <Gem /> },
  { level: 140, tier: 'Platinum', subRank: 'III', color: 'text-teal-300', glow: 'glow-text-teal', gradient: 'from-teal-600 to-teal-400', icon: <Activity /> },
  { level: 100, tier: 'Platinum', subRank: 'II', color: 'text-teal-300', glow: 'glow-text-teal', gradient: 'from-teal-600 to-teal-400', icon: <Activity /> },
  { level: 80, tier: 'Platinum', subRank: 'I', color: 'text-teal-300', glow: 'glow-text-teal', gradient: 'from-teal-600 to-teal-400', icon: <Activity /> },
  { level: 60, tier: 'Gold', subRank: 'III', color: 'text-yellow-400', glow: 'glow-text-gold', gradient: 'from-yellow-600 to-amber-400', icon: <Trophy /> },
  { level: 50, tier: 'Gold', subRank: 'II', color: 'text-yellow-400', glow: 'glow-text-gold', gradient: 'from-yellow-600 to-amber-400', icon: <Trophy /> },
  { level: 40, tier: 'Gold', subRank: 'I', color: 'text-yellow-400', glow: 'glow-text-gold', gradient: 'from-yellow-600 to-amber-400', icon: <Trophy /> },
  { level: 30, tier: 'Silver', subRank: 'III', color: 'text-slate-400', glow: 'glow-text-slate', gradient: 'from-slate-500 to-slate-300', icon: <ShieldCheck /> },
  { level: 20, tier: 'Silver', subRank: 'II', color: 'text-slate-400', glow: 'glow-text-slate', gradient: 'from-slate-500 to-slate-300', icon: <ShieldCheck /> },
  { level: 15, tier: 'Silver', subRank: 'I', color: 'text-slate-400', glow: 'glow-text-slate', gradient: 'from-slate-500 to-slate-300', icon: <ShieldCheck /> },
  { level: 10, tier: 'Bronze', subRank: 'III', color: 'text-orange-700', glow: 'glow-text-orange', gradient: 'from-orange-800 to-orange-600', icon: <Shield /> },
  { level: 5, tier: 'Bronze', subRank: 'II', color: 'text-orange-700', glow: 'glow-text-orange', gradient: 'from-orange-800 to-orange-600', icon: <Shield /> },
  { level: 3, tier: 'Bronze', subRank: 'I', color: 'text-orange-700', glow: 'glow-text-orange', gradient: 'from-orange-800 to-orange-600', icon: <Shield /> },
  { level: 0, tier: 'Initiate', subRank: null, color: 'text-slate-600', glow: 'glow-text-slate', gradient: 'from-slate-800 to-slate-700', icon: <Star /> }
];

const CharacterStats: React.FC<CharacterStatsProps> = ({ stats, onScanClick }) => {
  const [showRankInfo, setShowRankInfo] = useState(false);
  const xpPercentage = (stats.xp / stats.maxXp) * 100;
  const avatarSeed = stats.avatarSeed || 'Hero';

  const currentRank = useMemo(() => {
    return RANK_THRESHOLDS.find(r => stats.level >= r.level) || RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
  }, [stats.level]);

  const AttributeCard = ({ icon, label, value, gradient, textColor, glowClass, subLabel = "LVL" }: any) => {
    return (
      <div className="flex flex-col justify-between p-6 md:p-8 rounded-[2.5rem] bg-[#020205]/95 border border-white/10 hover:border-white/25 transition-all duration-500 group relative shadow-[0_25px_50px_rgba(0,0,0,0.8)] h-full min-h-[190px] w-full overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full pointer-events-none`} />
        <div className="flex items-start justify-between relative z-10 w-full">
          <div className={`p-4 rounded-2xl bg-black border border-white/15 ${textColor} shadow-xl group-hover:scale-110 transition-all duration-500`}>
            {React.cloneElement(icon as any, { size: 24 })}
          </div>
          <div className="flex items-baseline gap-1.5 bg-black/60 px-5 py-2 rounded-2xl border border-white/10 shadow-inner">
            <span className={`text-3xl md:text-4xl font-black italic tracking-tighter tabular-nums leading-none ${textColor} ${glowClass}`}>
              {value.toFixed(0)}
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{subLabel}</span>
          </div>
        </div>
        <div className="relative z-10 mt-8 w-full">
          <h4 className={`text-[13px] md:text-[14px] font-black uppercase italic tracking-[0.25em] leading-none mb-6 ${textColor} ${glowClass} truncate`}>
            {label}
          </h4>
          <div className="flex gap-1.5 h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`flex-1 rounded-full transition-all duration-500 ease-out shadow-sm ${i < value ? `${gradient}` : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RankCard = () => {
    const showNumeralBox = currentRank.subRank !== null;

    return (
      <div className="flex flex-col justify-between p-6 md:p-8 rounded-[2.5rem] bg-[#020205]/95 border border-white/10 hover:border-white/25 transition-all duration-500 group relative shadow-[0_25px_50px_rgba(0,0,0,0.8)] h-full min-h-[190px] w-full overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${currentRank.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full pointer-events-none`} />

        <button onClick={() => setShowRankInfo(true)} className="absolute top-4 right-4 p-2 text-slate-600 hover:text-white transition-colors z-20">
          <Info size={18} />
        </button>

        <div className="flex items-start justify-between relative z-10 w-full">
          <div className={`p-4 rounded-2xl bg-black border-2 border-white/15 ${currentRank.color} shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:scale-110 transition-all duration-500`}>
            {React.cloneElement(currentRank.icon as any, { size: 28, strokeWidth: 2.5 })}
          </div>

          {showNumeralBox && (
            <div className="flex items-baseline gap-1.5 bg-black/60 px-6 py-2.5 rounded-2xl border border-white/10 shadow-inner ring-1 ring-white/5">
              <span className={`text-3xl md:text-4xl font-black italic tracking-tighter tabular-nums leading-none ${currentRank.color} ${currentRank.glow}`}>
                {currentRank.subRank}
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RANK</span>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-8 w-full">
          <h4 className={`text-[15px] md:text-[16px] font-black uppercase italic tracking-[0.3em] leading-none mb-6 ${currentRank.color} ${currentRank.glow} truncate`}>
            {currentRank.tier}
          </h4>
          <div className="flex gap-1.5 h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
            {[...Array(10)].map((_, i) => {
              const idx = RANK_THRESHOLDS.findIndex(r => r === currentRank);
              const nextVal = idx > 0 ? RANK_THRESHOLDS[idx - 1].level : currentRank.level + 100;
              const prevVal = currentRank.level;
              const diff = nextVal - prevVal || 1;
              const progress = ((stats.level - prevVal) / diff) * 10;
              return (
                <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i < progress ? currentRank.gradient : 'bg-white/5'}`} />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rpg-card rounded-[4.5rem] p-10 md:p-16 border-cyan-500/30 relative group bg-black shadow-[0_0_100px_rgba(0,242,255,0.15)] h-full flex flex-col overflow-hidden">
      <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-[4.5rem] pointer-events-none group-hover:border-cyan-500/30 transition-all duration-700" />

      <div className="flex flex-col gap-16 relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-[-40px] bg-cyan-500/10 blur-[90px] animate-pulse rounded-full" />
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-[4.5rem] border-4 border-white/20 bg-[#030305] flex items-center justify-center p-8 shadow-[0_0_80px_rgba(0,242,255,0.25)] relative z-10 overflow-hidden group-hover:border-cyan-500/50 transition-all duration-700">
                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=000000&radius=20`} alt="Hero" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-cyan-600 text-white font-black px-10 py-4 rounded-2xl text-sm md:text-base border-4 border-black shadow-2xl z-20 whitespace-nowrap glow-text-blue italic uppercase tracking-[0.25em]">
                LVL {stats.level}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left min-w-0 w-full overflow-hidden space-y-12 pt-4">
            <div className="w-full">
              <div className="flex items-center justify-center lg:justify-between gap-6 mb-8">
                <div className="inline-flex items-center gap-4 px-5 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full shadow-lg">
                  <span className="text-[11px] text-cyan-400 font-black tracking-[0.5em] uppercase">NEURAL LINK ACTIVE</span>
                  <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                </div>
                {onScanClick && (
                  <button onClick={onScanClick} className="p-4 bg-rose-600/20 rounded-2xl text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all shadow-xl group/scan active:scale-95" title="Biometric Alignment Scan">
                    <Scan size={24} className="group-hover/scan:scale-110 transition-transform" />
                  </button>
                )}
              </div>
              <h2 className="text-6xl md:text-7xl lg:text-[6.5rem] font-black text-white italic tracking-tighter leading-[0.85] glow-text-blue break-words uppercase w-full">
                {stats.name}
              </h2>
            </div>

            <div className="w-full bg-slate-950/95 py-14 px-12 rounded-[4.5rem] border-2 border-white/10 shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)] relative group/xp overflow-hidden ring-4 ring-black/60">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8 relative z-10">
                <div className="flex flex-col items-center md:items-start gap-3">
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-cyan-400 animate-pulse" />
                    <span className="text-sm md:text-base font-black text-cyan-500/80 uppercase tracking-[0.7em] leading-none">Potential Core</span>
                  </div>
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-600 uppercase tracking-[0.4em] ml-0 md:ml-8">Temporal Growth Matrix</span>
                </div>
                <div className="flex items-baseline gap-4 md:gap-6 bg-black/40 px-8 py-4 rounded-[2rem] border border-white/5 shadow-2xl">
                  <span className="text-6xl md:text-8xl font-black text-cyan-400 tabular-nums glow-text-blue leading-none italic tracking-tighter">{stats.xp}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-slate-500 text-xl md:text-2xl font-black italic tracking-tighter opacity-40">/ {stats.maxXp}</span>
                    <span className="text-cyan-600/60 text-[10px] font-black uppercase tracking-widest mt-1">XP TOTAL</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="h-10 bg-black rounded-full border-2 border-white/10 overflow-hidden p-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative transition-colors">
                  <div className="h-full bg-gradient-to-r from-blue-800 via-cyan-400 to-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_30px_rgba(0,242,255,0.4)] relative" style={{ width: `${Math.min(100, xpPercentage)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
          <AttributeCard icon={<Shield />} label="Strength" value={stats.attributes.strength} gradient="from-red-600 to-orange-500" textColor="text-red-500" glowClass="glow-text-red" />
          <AttributeCard icon={<Brain />} label="Intelligence" value={stats.attributes.intelligence} gradient="from-blue-600 to-cyan-400" textColor="text-blue-500" glowClass="glow-text-blue" />
          <AttributeCard icon={<Zap />} label="Wisdom" value={stats.attributes.wisdom} gradient="from-amber-500 to-yellow-400" textColor="text-yellow-500" glowClass="glow-text-gold" />
          <AttributeCard icon={<Heart />} label="Vitality" value={stats.attributes.vitality} gradient="from-emerald-600 to-lime-400" textColor="text-emerald-500" glowClass="glow-text-green" />
          <AttributeCard icon={<Users />} label="Charisma" value={stats.attributes.charisma} gradient="from-pink-600 to-rose-500" textColor="text-pink-500" glowClass="glow-text-red" />
          <RankCard />
        </div>
      </div>

      {showRankInfo && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-[#020205]/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-5xl bg-slate-950 border border-white/10 rounded-[4rem] p-10 md:p-16 shadow-[0_0_150px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-hidden flex flex-col">
            <button onClick={() => setShowRankInfo(false)} className="absolute top-8 right-8 p-4 text-slate-500 hover:text-white transition-all bg-black/40 rounded-2xl border border-white/5 shadow-xl hover:bg-red-500/10 z-30">
              <X size={28} />
            </button>

            <div className="mb-12 text-center relative z-20">
              <h3 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter glow-text-blue mb-4">Rank Hierarchy</h3>
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em]">Neural Level Requirements for Temporal Ascension</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 space-y-6 no-scrollbar relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {[...RANK_THRESHOLDS].filter(r => r.tier !== 'Initiate').reverse().map((r, i) => {
                  const isReached = stats.level >= r.level;
                  return (
                    <div key={i} className={`flex items-center justify-between p-8 rounded-[3.5rem] border-2 transition-all duration-500 group/item relative overflow-hidden ${isReached ? 'bg-slate-900 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[1.02]' : 'bg-black/40 border-white/5 opacity-20 grayscale'
                      }`}>
                      <div className="flex items-center gap-8 relative z-10">
                        <div className={`p-5 rounded-[1.8rem] bg-slate-950 border-2 border-white/10 ${r.color} shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover/item:scale-110 transition-transform`}>
                          {React.cloneElement(r.icon as any, { size: 28, strokeWidth: 2.5 })}
                        </div>
                        <div>
                          <h5 className={`text-2xl font-black uppercase italic tracking-tighter leading-none mb-2 ${r.color} ${r.glow}`}>
                            {r.tier} {r.subRank || ''}
                          </h5>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">THRESHOLD</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end relative z-10">
                        <div className="flex items-baseline gap-1.5 bg-black/40 px-5 py-2 rounded-2xl border border-white/5">
                          <span className={`text-4xl font-black italic tracking-tighter tabular-nums leading-none ${isReached ? 'text-white' : 'text-slate-700'}`}>{r.level}</span>
                          <span className="text-[11px] font-black text-slate-700 italic uppercase">LVL</span>
                        </div>
                        {isReached && (
                          <div className="mt-3 flex items-center gap-2 px-4 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[8px] font-black uppercase tracking-widest">SECURED</span>
                          </div>
                        )}
                      </div>

                      {isReached && <div className={`absolute -right-8 -bottom-8 w-48 h-48 bg-gradient-to-br ${r.gradient} opacity-[0.08] blur-[60px] rounded-full group-hover/item:opacity-20 transition-opacity`} />}
                      {isReached && <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${r.gradient}`} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 p-10 bg-blue-500/5 border border-blue-500/10 rounded-[3rem] text-center relative group shrink-0">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[3rem]" />
              <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed italic relative z-10 max-w-3xl mx-auto">
                "A Hero is not measured by the crown they wear, but by the discipline required to earn it. Every level is a heartbeat in the temporal landscape."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterStats;
