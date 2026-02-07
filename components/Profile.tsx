
import React, { useState, useEffect } from 'react';
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
  Save, 
  Activity, 
  ShieldAlert, 
  X, 
  AlertTriangle, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Info, 
  ChevronRight, 
  Rocket, 
  Scan, 
  Target, 
  ExternalLink, 
  Dumbbell, 
  Gem,
  Droplets,
  Timer,
  ShieldCheck,
  Copy,
  Download,
  Share2,
  Check,
  Smartphone,
  Cloud,
  Link,
  Globe,
  Terminal,
  Server,
  Lock,
  RefreshCw,
  Search,
  Code2,
  Cpu,
  BarChart3,
  CreditCard,
  Key
} from 'lucide-react';

interface ProfileProps { 
  stats: UserStats; 
  onUpdateStats: (updates: Partial<UserStats>) => void; 
  onReset: () => void; 
  neuralCode?: string;
  onImportCode?: (code: string) => boolean;
}

const COLOR_MAP: Record<string, { icon: string, bar: string, border: string, glow: string }> = {
  orange: { icon: 'text-orange-400', bar: 'bg-orange-500', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
  blue: { icon: 'text-blue-400', bar: 'bg-blue-500', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  cyan: { icon: 'text-cyan-400', bar: 'bg-cyan-500', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
  rose: { icon: 'text-rose-400', bar: 'bg-rose-500', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' },
};

// Fixed typing issue: Defined interface for GlossarySection props and moved component outside Profile
interface GlossarySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tip?: string;
}

// Reusable GlossarySection component defined with explicit typing for children
const GlossarySection: React.FC<GlossarySectionProps> = ({ icon, title, children, tip }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-900 rounded-2xl border border-white/10 text-cyan-400">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">{title}</h4>
    </div>
    <div className="space-y-4 text-slate-400 text-sm leading-relaxed font-medium">
      {children}
    </div>
    {tip && (
      <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex gap-4 items-start group/tip hover:bg-yellow-500/10 transition-colors">
        <Lightbulb className="text-yellow-500 shrink-0 group-hover/tip:animate-pulse" size={18} />
        <p className="text-[11px] font-bold text-yellow-500/80 uppercase tracking-wide leading-relaxed">
          <span className="text-yellow-400">MASTERY TIP:</span> {tip}
        </p>
      </div>
    )}
  </div>
);

// Fixed typing issue: Defined interface for TrajectoryChip props and moved component outside Profile
interface TrajectoryChipProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  progress?: number;
}

// Reusable TrajectoryChip component moved outside Profile for better typing stability
const TrajectoryChip: React.FC<TrajectoryChipProps> = ({ icon, label, value, subValue, color, progress }) => {
  const config = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className={`bg-black/80 border ${config.border} rounded-3xl p-6 hover:border-white/40 transition-all group/chip relative overflow-hidden shadow-2xl`}>
      <div className={`absolute top-0 left-0 w-1.5 h-full ${config.bar} ${config.glow} opacity-60`} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-4 bg-slate-900/80 rounded-2xl ${config.icon} group-hover/chip:scale-110 transition-transform border border-white/5`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight italic leading-none">{value}</span>
            {subValue && <span className="text-[11px] font-bold text-slate-500 uppercase">{subValue}</span>}
          </div>
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className={`h-full ${config.bar} rounded-full transition-all duration-[1500ms] shadow-[0_0_10px_currentColor]`} 
            style={{ width: `${Math.min(100, progress)}%` }} 
          />
        </div>
      )}
    </div>
  );
};

const Profile: React.FC<ProfileProps> = ({ stats, onUpdateStats, onReset, neuralCode, onImportCode }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.name);
  const [resetArmed, setResetArmed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cloudProvider, setCloudProvider] = useState<'local' | 'supabase' | 'firebase'>('local');
  const [showTechDossier, setShowTechDossier] = useState(false);
  const avatarSeed = stats.avatarSeed || 'Hero';

  useEffect(() => {
    let timer: any;
    if (resetArmed) {
      timer = setTimeout(() => setResetArmed(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [resetArmed]);

  const handleSaveName = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanName = tempName.trim();
    if (cleanName.length >= 3 && cleanName.length <= 18) {
      onUpdateStats({ name: cleanName });
      setIsEditingName(false);
    }
  };

  const handleCopyCode = () => {
    if (neuralCode) {
      navigator.clipboard.writeText(neuralCode);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleImport = () => {
    if (onImportCode && importCode) {
      const success = onImportCode(importCode);
      setImportStatus(success ? 'success' : 'error');
      if (success) setImportCode('');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-slate">Character Profile</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-slate-400 animate-pulse" /> 
            Linking Temporal Identity to Heroic Core
          </p>
        </div>
      </div>

      <div className="rpg-card rounded-[4rem] p-10 md:p-16 border-white/15 relative group overflow-hidden bg-black/40 shadow-3xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(148,163,184,0.1),_transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
          <div className="relative group/avatar shrink-0">
            <div className="absolute inset-[-15px] bg-slate-500/20 blur-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-1000" />
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-[4.5rem] border-4 border-white/30 overflow-hidden bg-slate-950 flex items-center justify-center p-4 shadow-[0_0_80px_rgba(148,163,184,0.3)] relative z-10 ring-12 ring-black/50 group-hover:scale-105 transition-all duration-700">
              <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=000000&radius=20`} alt="Avatar" className="w-full h-full object-contain" />
              <button onClick={() => onUpdateStats({ avatarSeed: Math.random().toString(36).substring(7) })} 
                      className="absolute bottom-5 right-5 bg-slate-700 hover:bg-slate-600 p-3.5 rounded-2xl text-white shadow-2xl opacity-0 group-hover/avatar:opacity-100 transition-all transform hover:rotate-12 border border-white/20">
                <Camera size={22} />
              </button>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-8 min-w-0 w-full">
            <div className="space-y-4">
               <div className="flex items-center justify-center lg:justify-start gap-3">
                 <span className="text-[9px] font-black text-slate-400 bg-slate-500/10 px-4 py-1.5 rounded-full border border-slate-500/30 uppercase tracking-[0.4em]">RANK S HERO</span>
                 <Crown size={18} className="text-yellow-400 drop-shadow-[0_0_100px_rgba(250,204,21,1)]" />
               </div>
               
               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-3 w-full max-w-xl">
                    <div className="relative flex-1">
                      <input autoFocus type="text" value={tempName} onChange={e => setTempName(e.target.value)} minLength={3} maxLength={18} className="w-full bg-black border-4 border-slate-500 rounded-3xl px-8 py-4 text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter focus:shadow-[0_0_40px_rgba(148,163,184,0.4)] outline-none transition-all" />
                      <span className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase ${tempName.length < 3 || tempName.length > 18 ? 'text-red-500' : 'text-slate-600'}`}>
                        {tempName.length}/18
                      </span>
                    </div>
                    <button type="submit" disabled={tempName.length < 3 || tempName.length > 18} className="bg-emerald-600 hover:bg-emerald-500 p-5 rounded-3xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale">
                      <Save size={24} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center lg:justify-start gap-4 group/name w-full">
                     <div className="bg-black/60 border-4 border-slate-500/80 rounded-[2.5rem] px-8 py-4 shadow-[0_0_30px_rgba(148,163,184,0.1)] hover:shadow-[0_0_40px_rgba(148,163,184,0.3)] transition-all cursor-pointer overflow-hidden min-w-0" onClick={() => setIsEditingName(true)}>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl uppercase leading-none break-words max-w-full">
                          {stats.name}
                        </h1>
                     </div>
                     <button onClick={() => setIsEditingName(true)} className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl opacity-0 group-hover/name:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-xl">
                      <PenTool size={24} />
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 rpg-card p-10 md:p-14 rounded-[4rem] border-white/10 overflow-hidden relative shadow-3xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Activity size={200} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4 relative z-10">
             <Activity className="text-cyan-400" /> Current Trajectory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <TrajectoryChip 
              icon={<Flame />} 
              label="Momentum Multiplier" 
              value={stats.streak} 
              subValue="Days" 
              color="orange" 
              progress={Math.min(100, (stats.streak / 30) * 100)} 
            />
            <TrajectoryChip 
              icon={<Zap />} 
              label="Potential Saturation" 
              value={stats.xp} 
              subValue={`/ ${stats.maxXp} XP`} 
              color="blue" 
              progress={(stats.xp / stats.maxXp) * 100} 
            />
            <TrajectoryChip 
              icon={<Droplets />} 
              label="Vitality Sync" 
              value={(stats.dailyWater / 1000).toFixed(1)} 
              subValue="Litres" 
              color="cyan" 
              progress={Math.min(100, (stats.dailyWater / 2000) * 100)} 
            />
            <TrajectoryChip 
              icon={<ShieldCheck />} 
              label="Sovereign Alignment" 
              value={stats.postureStreak} 
              subValue="Active" 
              color="rose" 
              progress={Math.min(100, (stats.postureStreak / 7) * 100)} 
            />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="rpg-card p-10 md:p-12 rounded-[4rem] border-blue-500/20 bg-slate-950 shadow-3xl flex flex-col space-y-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Cloud size={140} className="text-blue-500" />
             </div>
             <div className="relative z-10 space-y-2">
               <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                 <Globe className="text-blue-400" /> Neural Cloud Provider
               </h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Multi-Device Synchronization Vector</p>
             </div>
             
             <div className="space-y-4 flex-1">
                {[
                  { id: 'local', label: 'Local Memory Core', sub: 'Single Device Offline Mode', icon: <Smartphone size={20} /> },
                  { id: 'supabase', label: 'Supabase Nexus', sub: 'Real-time Postgres Backend', icon: <Link size={20} />, disabled: false },
                  { id: 'firebase', label: 'Firebase Citadel', sub: 'NoSQL Cloud Synchronization', icon: <Cloud size={20} />, disabled: false }
                ].map(p => (
                  <button 
                    key={p.id} onClick={() => setCloudProvider(p.id as any)}
                    className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all group/prov ${
                      cloudProvider === p.id 
                        ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)]' 
                        : 'bg-black/60 border-white/5 hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                       <div className={`p-3 rounded-xl ${cloudProvider === p.id ? 'bg-white text-blue-600' : 'bg-slate-900 text-slate-500'}`}>{p.icon}</div>
                       <div className="text-left">
                          <p className={`text-sm font-black uppercase tracking-tight ${cloudProvider === p.id ? 'text-white' : 'text-slate-300'}`}>{p.label}</p>
                          <p className={`text-[8px] font-bold uppercase tracking-widest ${cloudProvider === p.id ? 'text-blue-200' : 'text-slate-600'}`}>{p.sub}</p>
                       </div>
                    </div>
                    {cloudProvider === p.id && <Check size={20} className="text-white animate-in zoom-in" />}
                  </button>
                ))}
             </div>

             {cloudProvider !== 'local' && (
               <div className="p-6 bg-blue-500/10 border-2 border-blue-500/20 rounded-[2.5rem] animate-in slide-in-from-bottom-2 duration-500">
                  <p className="text-[9px] text-blue-400 font-black leading-relaxed uppercase tracking-widest text-center">
                    To activate {cloudProvider.toUpperCase()}, input your API Key in the environment secrets.
                  </p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Neural Tech Stack Dossier */}
      <div className="rpg-card p-10 md:p-14 rounded-[4rem] border-purple-500/30 bg-slate-950 shadow-3xl relative overflow-hidden group/dossier">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/dossier:opacity-10 transition-opacity">
          <Terminal size={180} className="text-purple-500" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 mb-12">
           <div className="flex items-center gap-6">
             <div className="p-5 bg-purple-500/20 rounded-[2rem] text-purple-400 border border-purple-500/40 shadow-2xl">
               <Brain size={32} />
             </div>
             <div>
               <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic glow-text-purple">Neural Architecture</h3>
               <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mt-2">Dossier: The Sacred Handshake Protocol</p>
             </div>
           </div>
           <button 
             onClick={() => setShowTechDossier(!showTechDossier)}
             className="px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3"
           >
             {showTechDossier ? <RotateCcw size={16} /> : <Search size={16} />}
             {showTechDossier ? 'ENCRYPT DOSSIER' : 'DECRYPT SYSTEM LORE'}
           </button>
        </div>

        {showTechDossier ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 p-8 rounded-[2.5rem] bg-black/60 border border-white/5">
                   <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                      <Terminal size={24} />
                   </div>
                   <h5 className="text-lg font-black text-white uppercase tracking-tight">The Redirect</h5>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">When you click "Google Login" on other sites, you are moved to a domain controlled by the giant. The original site is forbidden from seeing your password entry.</p>
                </div>
                <div className="space-y-4 p-8 rounded-[2.5rem] bg-black/60 border border-white/5">
                   <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                      <RefreshCw size={24} />
                   </div>
                   <h5 className="text-lg font-black text-white uppercase tracking-tight">The Code Swap</h5>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">Google sends you back with a temporary code. The site's server must then swap this code with Google's mainframe to verify your identity.</p>
                </div>
                <div className="space-y-4 p-8 rounded-[2.5rem] bg-black/60 border border-white/5">
                   <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                      <ShieldCheck size={24} />
                   </div>
                   <h5 className="text-lg font-black text-white uppercase tracking-tight">The Passport</h5>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">Finally, the site receives a 'Token'—a secure digital passport. It never sees your password, only a verified proof that you are who you claim to be.</p>
                </div>
             </div>

             {/* Implementation Path Section */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6">
               <div className="lg:col-span-7 p-10 bg-fuchsia-500/5 border-2 border-fuchsia-500/20 rounded-[3rem] space-y-8 relative overflow-hidden group/path">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/path:opacity-20 transition-opacity">
                    <Code2 size={120} className="text-fuchsia-500" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-fuchsia-500/20 rounded-2xl text-fuchsia-400 shadow-xl">
                      <Cpu size={24} />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Firebase Ascension (The Handshake Path)</h4>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      To bridge the gap between simulation and reality, you can use <b>Firebase Authentication</b>. It acts as the "Secret Server" to handle the swap for you.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2"><CreditCard size={14} className="text-emerald-500" /> "Free-ish" Clarity</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">Firebase's Spark Plan allows unlimited Google Identity logins for $0. It's essentially "Forever Free" until you have millions of users.</p>
                        </div>
                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2"><BarChart3 size={14} className="text-blue-500" /> Energy Quotas</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">Google provides 50,000 DB reads daily. For a single hero, this is effectively an infinite mana pool.</p>
                        </div>
                    </div>
                    <ul className="text-[11px] font-black text-slate-500 uppercase tracking-widest space-y-3">
                      <li className="flex items-center gap-3"><Check size={14} className="text-fuchsia-500" /> 1. Create Firebase Console Project</li>
                      <li className="flex items-center gap-3"><Check size={14} className="text-fuchsia-500" /> 2. Enable Google Sign-In Provider</li>
                      <li className="flex items-center gap-3"><Check size={14} className="text-fuchsia-500" /> 3. Initialize Firebase SDK in App</li>
                      <li className="flex items-center gap-3"><Check size={14} className="text-fuchsia-500" /> 4. Invoke "signInWithPopup" Ritual</li>
                    </ul>
                  </div>
               </div>

               {/* Vault Synchronization Section */}
               <div className="lg:col-span-5 flex flex-col gap-6">
                 <div className="p-10 bg-blue-500/5 border-2 border-blue-500/20 rounded-[3rem] space-y-6 relative overflow-hidden group/iso">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/iso:opacity-20 transition-opacity">
                      <Server size={80} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 shadow-xl">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Current Sandbox</h4>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      In this prototype, we use <b>Local Sandbox Memory</b>. This is the safest way to develop without a registered domain or private API secrets. Your data stays strictly on this device, isolated from the public net.
                    </p>
                    <div className="pt-4">
                       <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full uppercase tracking-widest">STATUS: SECURE ISOLATION</span>
                    </div>
                 </div>

                 <div className="p-10 bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[3rem] space-y-6 relative overflow-hidden group/vault">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/vault:opacity-20 transition-opacity">
                      <Key size={80} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-xl">
                        <Key size={24} />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Vault Sync</h4>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      <b>Google Password Manager</b> will likely ask to save your credentials in this Sandbox mode. If you move to the <b>Firebase Path</b>, the browser will stop asking—because you'll be using your Google Identity directly, leaving no password to "save"!
                    </p>
                 </div>
               </div>
             </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center opacity-30">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-slate-500/10 blur-xl rounded-full animate-pulse" />
              <Lock size={48} className="text-slate-700 relative z-10" />
            </div>
            <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Dossier Locked. Clear authorization to view.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Legacy Manual Sync HUD */}
        <div className="lg:col-span-8 rpg-card p-10 md:p-12 rounded-[4rem] border-cyan-500/20 bg-slate-950 shadow-3xl flex flex-col space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Share2 size={120} className="text-cyan-500" />
           </div>
           <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
             <Smartphone className="text-cyan-400" /> Legacy Neural Sync (Manual)
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Export Code</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-4 overflow-hidden text-ellipsis">
                      <p className="text-[8px] font-mono text-slate-500 truncate">{neuralCode || '---'}</p>
                    </div>
                    <button onClick={handleCopyCode} className={`p-4 rounded-2xl transition-all shadow-xl ${hasCopied ? 'bg-emerald-600 text-white' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white'}`}>
                      {hasCopied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
                <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">Copy this code from your primary device and paste it on your secondary device to import your timeline.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Import Neural Trace</p>
                  <textarea 
                    value={importCode} onChange={e => setImportCode(e.target.value)}
                    placeholder="Paste Code from Device A..."
                    className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-[9px] font-mono text-white h-24 resize-none focus:border-cyan-500 outline-none"
                  />
                  <button onClick={handleImport} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${importStatus === 'success' ? 'bg-emerald-600 text-white' : importStatus === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                    {importStatus === 'success' ? 'SYNC COMPLETE' : importStatus === 'error' ? 'SYNC FAILED' : 'EXECUTE IMPORT'}
                  </button>
                </div>
              </div>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="lg:col-span-4">
          <div className={`h-full rpg-card p-10 md:p-14 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden transition-all duration-500 z-30 shadow-3xl ${resetArmed ? 'border-red-500 bg-red-950/20' : 'border-white/10'}`}>
             <div className={`absolute inset-0 bg-red-600/10 blur-[100px] transition-opacity duration-500 pointer-events-none ${resetArmed ? 'opacity-100' : 'opacity-0'}`} />
             <div className={`p-8 rounded-full border-4 transition-all duration-500 z-10 pointer-events-none ${resetArmed ? 'bg-red-600 text-white border-white scale-110 shadow-[0_0_60px_rgba(255,0,0,0.6)] animate-pulse' : 'bg-red-600/10 border-red-500/20 text-red-500'}`}>
               {resetArmed ? <ShieldAlert size={48} /> : <RotateCcw size={48} className="animate-spin-slow" />}
             </div>
             <div className="relative z-10 space-y-2 pointer-events-none">
               <h4 className={`text-2xl font-black uppercase tracking-tighter italic transition-colors ${resetArmed ? 'text-white glow-text-red' : 'text-white'}`}>
                 {resetArmed ? 'CRITICAL ALERT' : 'FORBIDDEN RESET'}
               </h4>
               <p className="text-[10px] font-black text-red-500/60 uppercase tracking-[0.4em]">Sub-Space Purge Protocol</p>
             </div>
             <div className="w-full flex flex-col gap-6 relative z-40 pointer-events-auto">
              <button type="button" onClick={() => { if (resetArmed) onReset(); else setResetArmed(true); }} className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 cursor-pointer ring-4 ring-black/50 block select-none ${resetArmed ? 'bg-rose-50 text-red-600 shadow-red-500/40 hover:bg-white scale-105 border-2 border-red-500/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'}`}>
                {resetArmed ? 'FIRE NUCLEAR RESET' : 'EXECUTE WIPE'}
              </button>
              {resetArmed && (
                <button type="button" onClick={() => setResetArmed(false)} className="w-full py-4 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer">
                  <X size={14} className="shrink-0" /> ABORT COMMAND
                </button>
              )}
             </div>
          </div>
        </div>
      </div>

      <div className="pt-20 border-t border-white/5 space-y-16">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic glow-text-blue">System Documentation</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">LifeQuest Operative Manual v2.5.0</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 md:gap-20 px-4 md:px-10">
          <GlossarySection 
            icon={<BarChart3 />} 
            title="The Nexus Economy" 
            tip="Your digital mana (database reads) resets every 24 hours. The 'Spark Plan' energy is more than enough for a solo campaign."
          >
            <p>Scaling a digital realm requires resources. In the real world, "Free-ish" tech stacks like Firebase or Supabase allow you to manage thousands of Hero profiles without spending GP. You only begin to pay tribute to the Cloud Giants (Google) if your party grows into a massive guild of tens of thousands.</p>
            <p>The <span className="text-cyan-400 font-bold">Spark Plan</span> provides a stable foundation for individual mastery, offering unlimited Identity handshakes and ample storage for all lore and quest logs.</p>
          </GlossarySection>

          <GlossarySection 
            icon={<Gem />} 
            title="The Manifest Ranks" 
            tip="Ascending to 'Unreal' requires Level 1100. It is the peak of human temporal discipline."
          >
            <p>Manifest Ranks provide a visual indicator of your current standing within the LifeQuest ecosystem. Based on your Level, you transition through several tiers: <span className="text-orange-700 font-bold">Bronze</span>, <span className="text-slate-400 font-bold">Silver</span>, <span className="text-yellow-400 font-bold">Gold</span>, <span className="text-teal-300 font-bold">Platinum</span>, <span className="text-blue-300 font-bold">Diamond</span>, and the legendary triumvirate of <span className="text-slate-200 font-bold">Elite</span>, <span className="text-orange-500 font-bold">Champion</span>, and <span className="text-fuchsia-400 font-bold">Unreal</span>.</p>
            <p>Each tier (except the top three) is divided into three Roman numeral sub-ranks (I, II, III). Advancing these ranks marks significant milestones in your growth journey. You can inspect the Level requirements for all ranks by clicking the 'i' icon on your Rank card.</p>
          </GlossarySection>

          <GlossarySection 
            icon={<Star />} 
            title="The Growth Matrix (XP)" 
            tip="High-difficulty quests provide a multiplier to your XP gain. Focus on 'Epic' quests for massive level jumps."
          >
            <p>Experience Points (XP) represent your literal evolution within the LifeQuest environment. Every time you complete a quest, ritual, or institutional training session, your Potential Core absorbs energy. When the Core reaches its maximum threshold, you trigger a Level Up event, expanding your influence and unlocking higher-tier rewards.</p>
            <p>The <span className="text-cyan-400 font-bold">Max XP</span> threshold increases as you level up, reflecting the increasing complexity of high-level survival and self-mastery.</p>
          </GlossarySection>

          <GlossarySection 
            icon={<Shield />} 
            title="Sovereign Pillars" 
            tip="Postural alignment checks reset every 24 hours. Missing a check resets your alignment streak."
          >
            <p>Real-world fitness and health are tracked via <span className="text-rose-400 font-bold">Stance Sync</span> and <span className="text-cyan-400 font-bold">Vital Essence</span> tracking. Using the AI Optical Link, you can calibrate your skeletal alignment, while the Hydration Matrix ensures your internal systems are running at peak efficiency.</p>
            <p>Maintaining these physical metrics provides passive buffs to your XP generation and gold acquisition across all other sectors of the system.</p>
          </GlossarySection>

          <GlossarySection 
            icon={<BookOpen />} 
            title="Scholarly Grimoires" 
            tip="Mastering 3 Lore tomes for every 1 Chronicle forged is the ideal creation-consumption ratio."
          >
            <p>The <span className="text-orange-400 font-bold">Scriptorium</span> and <span className="text-sky-400 font-bold">The Great Archive</span> track your intellectual expansion. Mastered books and lore URLs are transcribed into permanent digital lore, awarding Wisdom and Intelligence attributes.</p>
            <p>By transforming lore into Chronicle Ideas in the <span className="text-purple-400 font-bold">Creation Forge</span>, you complete the loop from consumer to architect of your own reality.</p>
          </GlossarySection>
        </div>
      </div>
    </div>
  );
};

export default Profile;
