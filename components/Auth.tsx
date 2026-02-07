
import React, { useState, useEffect } from 'react';
import { Sword, Chrome, Loader2, Check, UserCircle2, ChevronRight, AlertTriangle, Settings2, ExternalLink, RefreshCw, Lock, ShieldCheck, ArrowUpDown, MousePointer2, Globe, ShieldAlert } from 'lucide-react';
import { auth, googleProvider, isConfigValid } from '../services/firebase';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

interface AuthProps {
  onLogin: (userData: { name: string; email: string; provider: string }) => void;
}

interface RememberedAccount {
  name: string;
  email: string;
  initial: string;
  color: string;
}

const COLORS = ['bg-purple-700', 'bg-pink-600', 'bg-blue-600', 'bg-emerald-600', 'bg-orange-600', 'bg-indigo-600'];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'chooser' | 'password'>('landing');
  const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<RememberedAccount | null>(null);
  
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'NONE' | 'API_KEY' | 'DOMAIN' | 'GENERIC'>('NONE');

  useEffect(() => {
    const saved = localStorage.getItem('lifequest_identities');
    if (saved) {
      setRememberedAccounts(JSON.parse(saved));
      setView('chooser');
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (!isConfigValid) {
      setView('password');
      return;
    }

    setIsLoading(true);
    setError(null);
    setErrorDetails(null);
    setErrorType('NONE');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin({ 
        name: result.user.displayName || 'Hero', 
        email: result.user.email || '', 
        provider: 'Firebase/Google' 
      });
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      
      if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        setError("API Key Restrictions Error");
        setErrorDetails("The 'Identity Toolkit API' is missing from your GCP Key Restrictions.");
        setErrorType('API_KEY');
      } else if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setError("Domain Link Blocked");
        const domain = window.location.hostname;
        setErrorDetails(`The domain '${domain}' is not whitelisted in your Firebase project.`);
        setErrorType('DOMAIN');
      } else {
        setError("Neural Link Failed");
        setErrorDetails(err.message || "Unknown uplink error.");
        setErrorType('GENERIC');
      }
      setIsLoading(false);
    }
  };

  const handleIdentitySelection = (account: RememberedAccount) => {
    setSelectedAccount(account);
    setEmailInput(account.email);
    setView('password');
  };

  const renderLanding = () => (
    <div className="animate-in zoom-in-95 w-full">
      <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-12 shadow-3xl">
        <h2 className="text-2xl font-bold text-white tracking-tight text-center mb-10">Neural Authentication</h2>

        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-[1.5rem] space-y-3">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert size={20} />
              <p className="text-xs font-black uppercase tracking-widest">{error}</p>
            </div>
            {errorDetails && <p className="text-[10px] text-slate-400 leading-relaxed pl-8">{errorDetails}</p>}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-zinc-700 rounded-full font-bold text-[11px] uppercase tracking-tighter transition-all active:scale-[0.98] shadow-lg hover:bg-zinc-50 mb-8"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {isConfigValid ? 'Sync with Google' : 'Continue (Sandbox)'}
        </button>

        {errorType === 'DOMAIN' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 mb-8">
            <div className="bg-orange-500/10 p-6 rounded-2xl border-2 border-orange-500/40 space-y-4">
              <div className="flex items-center gap-3 text-orange-400 mb-2">
                <Globe size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Protocol: Domain Authorization</h4>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed font-bold uppercase tracking-wider">
                1. Open Firebase Console -> Authentication -> Settings -> Authorized Domains<br/>
                2. Add this specific value: <span className="text-orange-400 select-all">{window.location.hostname}</span>
              </p>
              <div className="pt-2 flex gap-3">
                <a 
                  href={`https://console.firebase.google.com/project/${auth?.app?.options?.projectId}/authentication/settings`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 py-3 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase text-center shadow-lg hover:bg-orange-500"
                >
                  Go to Settings
                </a>
              </div>
            </div>
          </div>
        )}

        {errorType === 'API_KEY' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 mb-8">
            <div className="bg-black/60 p-6 rounded-2xl border-2 border-orange-500/40 space-y-4">
              <div className="flex items-center gap-3 text-orange-400 mb-2">
                <Settings2 size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Manual Fix Sequence</h4>
              </div>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                <li className="flex items-start gap-3 text-emerald-400">
                  <Check size={14} className="mt-0.5" /> 1. Enable "Identity Toolkit API" in GCP
                </li>
                <li className="flex items-start gap-3 text-orange-500 animate-pulse">
                  <ArrowUpDown size={14} className="mt-0.5" /> 2. SCROLL TO BOTTOM & CLICK "SAVE"
                </li>
              </ul>
              <div className="pt-4 flex gap-3">
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 py-3 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase text-center shadow-lg hover:bg-orange-500"
                >
                  Open Dashboard
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.05]"></div></div>
          <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em]"><span className="bg-[#09090b] px-4 text-zinc-600">DIRECT ACCESS</span></div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setView('password'); }} className="space-y-6">
          <input 
            type="email" required placeholder="Neural ID (Email)" 
            value={emailInput} onChange={e => setEmailInput(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          />
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-xs tracking-widest shadow-xl transition-all">INITIALIZE</button>
        </form>
      </div>
    </div>
  );

  const renderChooser = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200">
        <div className="p-10 text-center border-b border-zinc-100">
          <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-6 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Select Neural Trace</h2>
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {rememberedAccounts.map((acc, idx) => (
            <button key={idx} onClick={() => handleIdentitySelection(acc)} className="w-full flex items-center gap-5 px-10 py-6 hover:bg-zinc-50 border-b border-zinc-100 text-left group">
              <div className={`w-12 h-12 rounded-full ${acc.color} flex items-center justify-center text-white font-bold text-xl`}>{acc.initial}</div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-zinc-900 truncate">{acc.name}</p>
                <p className="text-xs text-zinc-500 truncate">{acc.email}</p>
              </div>
              <ChevronRight size={18} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
          <button onClick={() => setView('landing')} className="w-full flex items-center gap-5 px-10 py-6 hover:bg-zinc-50 text-left">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400"><UserCircle2 size={28} /></div>
            <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Add New Trace</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 p-10 text-center">
        <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-6 mx-auto mb-8" />
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-8">Confirm Identity</h2>
        <form onSubmit={(e) => { e.preventDefault(); onLogin({ name: emailInput.split('@')[0], email: emailInput, provider: 'Local' }); }} className="space-y-8 text-left">
          <input 
            type="password" required placeholder="Access Code" 
            value={password} onChange={e => setPassword(e.target.value)} autoFocus
            className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl px-6 py-5 text-lg outline-none focus:border-blue-500 transition-all" 
          />
          <div className="flex gap-4">
            <button type="button" onClick={() => setView('chooser')} className="px-6 py-5 text-blue-600 font-bold uppercase text-xs tracking-widest">Back</button>
            <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Execute</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[10000] bg-[#09090b] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.03)_0%,_transparent_70%)]" />
      <div className="relative w-full max-w-[480px]">
        <div className="text-center mb-12">
          <div className="inline-block bg-zinc-900 border-2 border-white/10 p-5 rounded-[2rem] shadow-2xl mb-6">
            <Sword size={32} className="text-blue-500" />
          </div>
          <h1 className="pixel-font text-2xl text-white tracking-[0.2em] uppercase">LifeQuest</h1>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="text-blue-500 animate-spin" size={64} />
            <p className="text-xs font-black text-white uppercase tracking-[0.4em] animate-pulse">Syncing Neural Trace...</p>
          </div>
        ) : (
          <>
            {view === 'landing' && renderLanding()}
            {view === 'chooser' && renderChooser()}
            {view === 'password' && renderPassword()}
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
