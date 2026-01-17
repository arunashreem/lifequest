
import React, { useState } from 'react';
import { UserStats } from '../types';
import { 
  User, 
  Settings, 
  Shield, 
  Zap, 
  Brain, 
  Heart, 
  Users, 
  Trophy, 
  Flame, 
  Coins, 
  RotateCcw, 
  Save, 
  Camera,
  Star,
  Medal,
  Crown
} from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  onUpdateStats: (updates: Partial<UserStats>) => void;
  onReset: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onUpdateStats, onReset }) => {
  const [avatarSeed, setAvatarSeed] = useState('Hero');

  const getTitle = (level: number) => {
    if (level >= 50) return "Transcendental Sovereign";
    if (level >= 30) return "Master of Realms";
    if (level >= 15) return "Elite Vanguard";
    if (level >= 5) return "Seasoned Adventurer";
    return "Fledgling Initiate";
  };

  const AttributeMeter = ({ icon, label, value, color, glow }: any) => (
    <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`${color} p-2.5 rounded-xl text-white shadow-lg ${glow} shrink-0`}>
            {icon}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</span>
        </div>
        <span className="text-xl font-black text-white ml-2">{value}</span>
      </div>
      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className={`${color} h-full transition-all duration-1000 ${glow}`} 
          style={{ width: `${Math.min(100, value * 10)}%` }} 
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-full overflow-hidden">
      {/* Header Card */}
      <div className="rpg-card rounded-[3rem] p-8 md:p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
          {/* Avatar Section */}
          <div className="relative group/avatar shrink-0">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-[4rem] border-4 border-blue-500/30 overflow-hidden bg-slate-800 flex items-center justify-center p-4 shadow-2xl relative z-10 group-hover:border-blue-500/60 transition-all ring-8 ring-slate-950">
              <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=1e293b&radius=20`} 
                alt="Avatar" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              <button 
                onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl text-white shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-all active:scale-90"
              >
                <Camera size={20} />
              </button>
            </div>
          </div>

          {/* Identity Section */}
          <div className="flex-1 text-center lg:text-left space-y-6 min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 whitespace-nowrap">
                  {getTitle(stats.level)}
                </span>
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 whitespace-nowrap">
                  Rank S Hero
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl truncate">
                The Hero
              </h1>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                  <Star className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Mastery</p>
                  <p className="text-2xl font-black text-white">Lvl {stats.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                  <Coins className="text-yellow-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Wealth</p>
                  <p className="text-2xl font-black text-white">{stats.gold.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                  <Flame className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Momentum</p>
                  <p className="text-2xl font-black text-white">{stats.streak}D</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Attributes & Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AttributeMeter icon={<Shield size={18}/>} label="Strength" value={stats.attributes.strength} color="bg-rose-500" glow="shadow-rose-900/40" />
            <AttributeMeter icon={<Brain size={18}/>} label="Intelligence" value={stats.attributes.intelligence} color="bg-indigo-500" glow="shadow-indigo-900/40" />
            <AttributeMeter icon={<Zap size={18}/>} label="Wisdom" value={stats.attributes.wisdom} color="bg-amber-500" glow="shadow-amber-900/40" />
            <AttributeMeter icon={<Heart size={18}/>} label="Vitality" value={stats.attributes.vitality} color="bg-emerald-500" glow="shadow-emerald-900/40" />
            <AttributeMeter icon={<Users size={18}/>} label="Charisma" value={stats.attributes.charisma} color="bg-fuchsia-500" glow="shadow-fuchsia-900/40" />
            
            {/* Ascension Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] flex flex-col justify-center text-white shadow-2xl shadow-blue-900/30 border border-white/10 relative overflow-hidden group/card min-h-[160px]">
              <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover/card:scale-110 transition-transform duration-700">
                <Crown size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Crown size={24} className="text-blue-200" />
                  <h4 className="text-xl font-black uppercase tracking-tight">Ascension Path</h4>
                </div>
                <p className="text-sm font-bold opacity-90 leading-relaxed max-w-[90%]">
                  Each attribute point represents a real-world triumph. Balance your matrix to achieve the state of True Legend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Achievements */}
        <div className="lg:col-span-1">
          <div className="rpg-card rounded-[3rem] p-8 h-full flex flex-col border-white/5">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <Trophy className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Hall of Fame</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { icon: <Medal size={24} />, label: "Initiate", achieved: true, color: "text-slate-400" },
                { icon: <Trophy size={24} />, label: "Gold hoarder", achieved: stats.gold > 1000, color: "text-yellow-500" },
                { icon: <Flame size={24} />, label: "On Fire", achieved: stats.streak >= 7, color: "text-orange-500" },
                { icon: <Brain size={24} />, label: "Scholar", achieved: stats.level >= 10, color: "text-blue-400" },
                { icon: <Star size={24} />, label: "Ascended", achieved: stats.level >= 20, color: "text-purple-400" },
                { icon: <Shield size={24} />, label: "Titan", achieved: stats.attributes.strength >= 10, color: "text-rose-400" },
              ].map((badge, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-500 ${
                    badge.achieved ? `bg-slate-950 ${badge.color} border-white/10 opacity-100 shadow-xl scale-100` : 'bg-slate-900 border-white/5 text-slate-800 opacity-20 grayscale scale-95'
                  }`}
                >
                  <div className={`mb-3 transition-transform duration-500 ${badge.achieved ? 'group-hover:scale-110' : ''}`}>
                    {badge.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rpg-card p-10 rounded-[3rem] border-red-500/20 bg-red-950/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-red-600/10 rounded-3xl border border-red-500/20 text-red-500 shadow-inner shrink-0">
            <RotateCcw size={40} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">The Forbidden Ritual</h4>
            <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-md">
              Permanently reset all levels, gold, and attributes to their initial state. This action is irreversible.
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            if(window.confirm("ARE YOU SURE? All hard-earned progress will be permanently erased from the Archive.")) onReset();
          }}
          className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-red-900/40 active:scale-95 whitespace-nowrap"
        >
          Reset Persona
        </button>
      </div>
    </div>
  );
};

export default Profile;
