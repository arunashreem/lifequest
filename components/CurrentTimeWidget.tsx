
import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, Zap, Globe } from 'lucide-react';

const CurrentTimeWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const digitalTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rpg-card rounded-[2.5rem] p-8 border-cyan-500/30 bg-slate-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group transition-all duration-500 hover:border-cyan-400">
      {/* Background Pulse Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000" />

      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* Analogue Clock - The Chronos Dial */}
        <div className="relative w-40 h-40 shrink-0">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-[-4px] rounded-full border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors" />
          
          {/* Ticks */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 origin-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className={`h-2 w-full rounded-full ${i % 3 === 0 ? 'bg-cyan-400 h-3 w-1' : 'bg-slate-700'}`} />
            </div>
          ))}

          {/* Hands */}
          {/* Hour Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-1.5 h-12 bg-white rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-lg"
            style={{ transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)` }}
          />
          {/* Minute Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-16 bg-cyan-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)` }}
          />
          {/* Second Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-18 bg-rose-500 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-linear"
            style={{ transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-500 rounded-full shadow-lg" />
          </div>
          
          {/* Center Cap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 border-2 border-white rounded-full z-20 shadow-xl" />
        </div>

        {/* Digital Section & Metadata */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <ClockIcon size={18} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.3em] italic">The Chronos Dial</h3>
          </div>

          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
              {digitalTime}
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-1">
              {dateString}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-white/5 shadow-inner">
              <Globe size={12} className="text-blue-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time.is Sync: Online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-white/5 shadow-inner">
              <Zap size={12} className="text-yellow-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Realm: Australia/Sydney</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeWidget;
