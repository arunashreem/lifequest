
import React, { useState } from 'react';
import { UserStats } from '../types';
import { 
  Shield, 
  Zap, 
  Brain, 
  Heart, 
  Users, 
  Trophy, 
  Flame, 
  Coins, 
  RotateCcw, 
  Camera,
  Star,
  Medal,
  Crown,
  PenTool,
  Save
} from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  onUpdateStats: (updates: Partial<UserStats>) => void;
  onReset: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onUpdateStats, onReset }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.name);
  const avatarSeed = stats.avatarSeed || 'Hero';

  const getTitle = (level: number) => {
    if (level >= 50) return "Transcendental Sovereign";
    if (level >= 30) return "Master of Realms";
    if (level >= 15) return "Elite Vanguard";
    if (level >= 5) return "Seasoned Adventurer";
    return "Fledgling Initiate";
  };

  const AttributeMeter = ({ icon, label, value, color, glow }: any) => (
    <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all flex flex-col justify-between h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`${color} p-2.5 rounded-xl text-white shadow-lg ${glow} shrink-0`}>
            {icon}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</span>
        </div>
        <span className="text-xl font-black text-white shrink-0">{value}</span>
      </div>
      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className={`${color} h-full transition-all duration-1000 ${glow}`} 
          style={{ width: `${Math.min(100, value * 10)}%` }} 
        />
      </div>
    </div>
  );

  const handleChangeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    onUpdateStats({ avatarSeed: newSeed });
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateStats({ name: tempName.trim() });
      setIsEditingName(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-full overflow-hidden">
      {/* Header Card */}
      <div className="rpg-card rounded-[3rem] p-6 md:p-12 overflow-hidden relative group max-w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center lg:items-start relative z-10 min-w-0">
          {/* Avatar Section */}
          <div className="relative group/avatar shrink-0 scale-[0.9] md:scale-100">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20" />
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] border-4 border-blue-500/30 overflow-hidden bg-slate-800 flex items-center justify-center p-3 md:p-4 shadow-2xl relative z-10 group-hover:border-blue-500/60 transition-all ring-4 md:ring-8 ring-slate-950">
              <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=1e293b&radius=20`} 
                alt="Avatar" 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={handleChangeAvatar}
                className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-500 p-2.5 rounded-xl text-white shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-all z-20"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Identity Section */}
          <div className="flex-1 text-center lg:text-left space-y-6 min-w-0 w-full overflow-hidden">
            <div className="space-y-3 overflow-hidden">
              <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 whitespace-nowrap">
                  {getTitle(stats.level)}
                </span>
                <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 whitespace-nowrap">
                  Rank S Hero
                </span>
              </div>
              
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex flex-row items-center gap-3 justify-center lg:justify-start w-full">
                  <input 
                    autoFocus
                    type="text" 
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="bg-slate-950 border-2 border-blue-500 rounded-xl px-4 py-2 text-white text-xl md:text-3xl font-black italic uppercase tracking-tighter outline-none flex-1 min-w-0 max-w-md shadow-2xl"
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl text-white shadow-xl transition-all shrink-0">
                    <Save size={20} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center lg:justify-start gap-4 group/name min-w-0 overflow-hidden">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl truncate leading-tight py-1">
                    {stats.name}
                  </h1>
                  <button onClick={() => setIsEditingName(true)} className="p-2.5 bg-slate-950/50 text-blue-400 rounded-xl opacity-0 group-hover/name:opacity-100 transition-all hover:bg-blue-600 hover:text-white shrink-0">
                    <PenTool size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                  <Star className="text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Mastery</p>
                  <p className="text-xl font-black text-white">Lvl {stats.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                  <Coins className="text-yellow-500" size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Wealth</p>
                  <p className="text-xl font-black text-white">{stats.gold.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                  <Flame className="text-orange-500" size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Momentum</p>
                  <p className="text-xl font-black text-white">{stats.streak}D</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes & Hall of Fame Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AttributeMeter icon={<Shield size={18}/>} label="Might" value={stats.attributes.strength} color="bg-rose-500" glow="shadow-rose-900/40" />
            <AttributeMeter icon={<Brain size={18}/>} label="Intel" value={stats.attributes.intelligence} color="bg-indigo-500" glow="shadow-indigo-900/40" />
            <AttributeMeter icon={<Zap size={18}/>} label="Will" value={stats.attributes.wisdom} color="bg-amber-500" glow="shadow-amber-900/40" />
            <AttributeMeter icon={<Heart size={18}/>} label="Core" value={stats.attributes.vitality} color="bg-emerald-500" glow="shadow-emerald-900/40" />
            <AttributeMeter icon={<Users size={18}/>} label="Ego" value={stats.attributes.charisma} color="bg-fuchsia-500" glow="shadow-fuchsia-900/40" />
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] flex flex-col justify-center text-white shadow-2xl border border-white/10 relative overflow-hidden min-h-[140px]">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Crown size={20} className="text-blue-200" />
                  <h4 className="text-lg font-black uppercase tracking-tight">Ascension Path</h4>
                </div>
                <p className="text-xs font-bold opacity-90 leading-relaxed">
                  Every attribute point represents a real-world triumph. Balance your matrix to achieve legend status.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rpg-card rounded-[2.5rem] p-8 h-full flex flex-col border-white/5 overflow-hidden">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <Trophy className="text-yellow-500" size={20} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter">Hall of Fame</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { icon: <Medal size={20} />, label: "Initiate", achieved: true, color: "text-slate-400" },
                { icon: <Trophy size={20} />, label: "Hoarder", achieved: stats.gold > 1000, color: "text-yellow-500" },
                { icon: <Flame size={20} />, label: "On Fire", achieved: stats.streak >= 7, color: "text-orange-500" },
                { icon: <Brain size={20} />, label: "Scholar", achieved: stats.level >= 10, color: "text-blue-400" },
                { icon: <Star size={20} />, label: "Ascended", achieved: stats.level >= 20, color: "text-purple-400" },
                { icon: <Shield size={20} />, label: "Titan", achieved: stats.attributes.strength >= 10, color: "text-rose-400" },
              ].map((badge, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-500 ${
                    badge.achieved ? `bg-slate-950 ${badge.color} border-white/10 opacity-100 shadow-xl` : 'bg-slate-900 border-white/5 text-slate-800 opacity-20'
                  }`}
                >
                  <div className="mb-2">{badge.icon}</div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight truncate w-full">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rpg-card p-6 md:p-10 rounded-[2.5rem] border-red-500/20 bg-red-950/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 max-w-full">
        <div className="flex items-center gap-6 md:gap-8 min-w-0">
          <div className="p-4 bg-red-600/10 rounded-2xl border border-red-500/20 text-red-500 shrink-0">
            <RotateCcw size={32} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1">The Forbidden Ritual</h4>
            <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-md truncate md:whitespace-normal">
              Permanently reset all levels, gold, and attributes. This is irreversible.
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            if(window.confirm("ARE YOU SURE? All hard-earned progress will be permanently erased.")) onReset();
          }}
          className="w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 whitespace-nowrap"
        >
          Reset Persona
        </button>
      </div>
    </div>
  );
};

export default Profile;
