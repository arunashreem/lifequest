
import React, { useState } from 'react';
import { UserStats } from '../types';
import { Shield, Zap, Brain, Heart, Users, Trophy, Flame, Coins, RotateCcw, Camera, Star, Medal, Crown, PenTool, Save, Activity } from 'lucide-react';

interface ProfileProps { stats: UserStats; onUpdateStats: (updates: Partial<UserStats>) => void; onReset: () => void; }

const Profile: React.FC<ProfileProps> = ({ stats, onUpdateStats, onReset }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.name);
  const avatarSeed = stats.avatarSeed || 'Hero';

  const handleSaveName = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanName = tempName.trim();
    if (cleanName.length >= 3 && cleanName.length <= 18) {
      onUpdateStats({ name: cleanName });
      setIsEditingName(false);
    }
  };

  const TrajectoryChip = ({ icon, label, value, gradient, textColor, glowClass }: any) => (
    <div className="flex flex-col gap-3 p-5 rounded-[2.5rem] bg-[#020205]/60 border border-white/[0.08] hover:border-white/20 transition-all duration-500 group relative shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
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
    <div className="space-y-20 animate-in fade-in duration-700">
      <div className="rpg-card rounded-[4rem] p-10 md:p-16 border-white/15 relative group overflow-hidden bg-black/40">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(188,0,255,0.1),_transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
          <div className="relative group/avatar shrink-0">
            <div className="absolute inset-[-15px] bg-purple-500/20 blur-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-1000" />
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-[4.5rem] border-4 border-white/30 overflow-hidden bg-slate-950 flex items-center justify-center p-4 shadow-[0_0_80px_rgba(188,0,255,0.4)] relative z-10 ring-12 ring-black/50 group-hover:scale-105 transition-all duration-700">
              <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=000000&radius=20`} alt="Avatar" className="w-full h-full object-contain" />
              <button onClick={() => onUpdateStats({ avatarSeed: Math.random().toString(36).substring(7) })} 
                      className="absolute bottom-5 right-5 bg-purple-600 hover:bg-purple-500 p-3.5 rounded-2xl text-white shadow-2xl opacity-0 group-hover/avatar:opacity-100 transition-all transform hover:rotate-12">
                <Camera size={22} />
              </button>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-8 min-w-0 w-full">
            <div className="space-y-4">
               <div className="flex items-center justify-center lg:justify-start gap-3">
                 <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/30 uppercase tracking-[0.4em]">RANK S HERO</span>
                 <Crown size={18} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]" />
               </div>
               
               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-3 w-full max-w-xl">
                    <div className="relative flex-1">
                      <input 
                        autoFocus 
                        type="text" 
                        value={tempName} 
                        onChange={e => setTempName(e.target.value)} 
                        minLength={3}
                        maxLength={18}
                        className="w-full bg-black border-4 border-purple-500 rounded-3xl px-8 py-4 text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter focus:shadow-[0_0_40px_rgba(188,0,255,0.6)] outline-none transition-all"
                      />
                      <span className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase ${tempName.length < 3 || tempName.length > 18 ? 'text-red-500' : 'text-slate-600'}`}>
                        {tempName.length}/18
                      </span>
                    </div>
                    <button 
                      type="submit" 
                      disabled={tempName.length < 3 || tempName.length > 18}
                      className="bg-emerald-600 hover:bg-emerald-500 p-5 rounded-3xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      <Save size={24} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center lg:justify-start gap-4 group/name w-full">
                     <div className="bg-black/60 border-4 border-purple-500/80 rounded-[2.5rem] px-8 py-4 shadow-[0_0_30px_rgba(188,0,255,0.2)] hover:shadow-[0_0_40px_rgba(188,0,255,0.4)] transition-all cursor-pointer overflow-hidden min-w-0" onClick={() => setIsEditingName(true)}>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl uppercase leading-none break-words max-w-full">
                          {stats.name}
                        </h1>
                     </div>
                     <button onClick={() => setIsEditingName(true)} className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl opacity-0 group-hover/name:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-xl">
                      <Save size={24} />
                     </button>
                  </div>
                )}
               </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
              <div className="flex items-center gap-4 bg-black/40 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-blue-500/40 transition-all">
                <Star className="text-blue-400 group-hover:scale-125 transition-transform" size={28} />
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Mastery</p>
                  <p className="text-2xl font-black text-white tracking-tighter leading-none">LVL {stats.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/40 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-yellow-500/40 transition-all">
                <Coins className="text-yellow-400 group-hover:scale-125 transition-transform" size={28} />
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Wealth</p>
                  <p className="text-2xl font-black text-white tracking-tighter leading-none">{stats.gold.toLocaleString()} GP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 rpg-card p-10 md:p-14 rounded-[4rem] border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Activity size={200} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4 relative z-10">
             <Activity className="text-cyan-400" /> Current Trajectory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <TrajectoryChip 
              icon={<Shield />} label="Strength" value={stats.attributes.strength} 
              gradient="from-red-600 to-orange-500" textColor="text-red-500" glowClass="glow-text-red"
            />
            <TrajectoryChip 
              icon={<Brain />} label="Intelligence" value={stats.attributes.intelligence} 
              gradient="from-blue-600 to-cyan-400" textColor="text-blue-500" glowClass="glow-text-blue"
            />
            <TrajectoryChip 
              icon={<Zap />} label="Wisdom" value={stats.attributes.wisdom} 
              gradient="from-amber-500 to-yellow-400" textColor="text-yellow-500" glowClass="glow-text-gold"
            />
            <TrajectoryChip 
              icon={<Heart />} label="Vitality" value={stats.attributes.vitality} 
              gradient="from-emerald-600 to-lime-400" textColor="text-emerald-500" glowClass="glow-text-green"
            />
            <div className="sm:col-span-2">
               <TrajectoryChip 
                icon={<Users />} label="Charisma" value={stats.attributes.charisma} 
                gradient="from-pink-600 to-rose-500" textColor="text-pink-500" glowClass="glow-text-red"
              />
            </div>
          </div>
        </div>

        <div className="rpg-card p-10 md:p-14 rounded-[4rem] border-white/10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-red-600/5 blur-3xl" />
           <div className="p-8 bg-red-600/10 rounded-full border-4 border-red-500/20 text-red-500">
             <RotateCcw size={48} className="animate-spin-slow" />
           </div>
           <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">FORBIDDEN RESET</h4>
           <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest">Wipe your temporal existence and begin as a Fledgling again.</p>
           <button onClick={() => { if(confirm("PERMANENTLY RESET ALL PROGRESS?")) onReset(); }} 
                   className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-900/40 active:scale-95 transition-all">
             EXECUTE WIPE
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
