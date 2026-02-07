
import React, { useState, useEffect } from 'react';
import { Wind, Zap, Timer, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface FocusForgeProps {
  onManualXpAward: (xp: number, message: string) => void;
}

const FocusForge: React.FC<FocusForgeProps> = ({ onManualXpAward }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeepBreath = () => {
    if (seconds >= 60) {
      onManualXpAward(25, "Focus Manifested: 1 Minute of Stillness.");
      setSeconds(0);
      setIsActive(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-green">Focus Forge</h2>
        <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] flex items-center gap-4">
          <Wind className="text-emerald-500 animate-pulse" /> 
          Practicing the Art of Stillness
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="rpg-card rounded-[4rem] p-12 md:p-20 border-emerald-500/20 bg-slate-950/60 flex flex-col items-center justify-center text-center space-y-12 shadow-3xl overflow-hidden relative">
            <div className={`absolute inset-0 bg-emerald-500/5 blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className="relative">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-emerald-500/20 flex items-center justify-center transition-all duration-[3000ms] ${isActive ? 'scale-110 border-emerald-500 animate-pulse' : 'scale-100'}`}>
                <span className="text-6xl md:text-8xl font-black text-white italic tracking-tighter tabular-nums">{formatTime(seconds)}</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">{isActive ? 'EMBRACING THE VOID' : 'CHAMBER OF STILLNESS'}</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">Maintain focus for 60 seconds to forge 25 XP of Pure Will.</p>
            </div>

            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-full max-w-sm py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 ${isActive ? 'bg-slate-900 text-slate-400 border-2 border-white/5' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/40'}`}
            >
              {isActive ? 'BREAK CONCENTRATION' : 'ENTER MEDITATION'}
            </button>
            
            {seconds >= 60 && (
              <button onClick={handleDeepBreath} className="w-full max-w-sm py-6 bg-yellow-500 text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] animate-bounce shadow-xl">
                CLAIM WILLPOWER XP
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="rpg-card p-10 rounded-[3rem] border-white/10 bg-black/40 flex items-center gap-6">
              <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-lg">Mental Fortitude</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Level 1 Practitioner</p>
              </div>
           </div>
           <div className="p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 italic text-slate-400 text-sm leading-relaxed">
             "The busiest mind is often the weakest. Mastery begins when the noise ends."
           </div>
        </div>
      </div>
    </div>
  );
};

export default FocusForge;
