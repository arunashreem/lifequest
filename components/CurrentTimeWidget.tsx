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
    hour12: true,
  });

  const secondsPart = seconds.toString().padStart(2, '0');

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="rpg-card rounded-[3.5rem] p-10 md:p-14 lg:p-16 border-cyan-500/20 bg-slate-900/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group transition-all duration-700 hover:border-cyan-400 w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-cyan-500/5 blur-[200px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000" />

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 md:gap-16 relative z-10 w-full max-w-7xl mx-auto">
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 shrink-0 shadow-[0_0_80px_rgba(34,211,238,0.2)] rounded-full bg-slate-950/40">
          <div className="absolute inset-0 rounded-full border-[10px] border-slate-800 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]" />
          <div className="absolute inset-[-6px] rounded-full border border-cyan-500/30 group-hover:border-cyan-500/60 transition-colors" />
          
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 origin-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className={`w-full rounded-full ${i % 3 === 0 ? 'bg-cyan-400 h-5 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-slate-700 h-3'}`} />
            </div>
          ))}

          <div className="absolute top-1/2 left-1/2 w-2.5 h-16 md:h-20 bg-white rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-lg" style={{ transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)` }} />
          <div className="absolute top-1/2 left-1/2 w-2 h-20 md:h-28 bg-cyan-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-[0_0_20px_rgba(34,211,238,0.6)]" style={{ transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)` }} />
          <div className="absolute top-1/2 left-1/2 w-1 h-24 md:h-32 bg-rose-500 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-linear" style={{ transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)` }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-rose-500 rounded-full shadow-lg" />
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-slate-900 border-2 border-white rounded-full z-20 shadow-xl" />
        </div>

        <div className="flex-1 flex flex-col items-center lg:items-start space-y-8 min-w-0 w-full lg:pl-12">
          <div className="flex items-center gap-5 w-full justify-center lg:justify-start">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all shrink-0 shadow-xl">
              <ClockIcon size={28} className="text-cyan-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-[10px] md:text-sm font-black text-cyan-400 uppercase tracking-[0.15em] italic leading-tight">
                Chronos Temporal Hub
              </h3>
              <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-500/40 to-transparent mt-2" />
            </div>
          </div>

          <div className="space-y-4 w-full text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center lg:items-end justify-center lg:justify-start gap-4 md:gap-6">
              <h2 className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter tabular-nums leading-[0.8] drop-shadow-[0_15px_40px_rgba(255,255,255,0.1)] py-2">
                {digitalTime.split(' ')[0]} 
                <span className="text-4xl md:text-6xl opacity-30 italic ml-4 font-bold uppercase">{digitalTime.split(' ')[1]}</span>
              </h2>
              <span className="text-4xl md:text-6xl font-black text-slate-700/80 tabular-nums italic select-none hidden sm:inline animate-pulse mb-2 md:mb-4">
                {secondsPart}
              </span>
            </div>
            <p className="text-xl md:text-3xl font-black text-slate-400 uppercase tracking-[0.15em] leading-relaxed opacity-90 drop-shadow-md text-balance">
              {dateString}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 w-full">
            <div className="flex items-center gap-3 px-8 py-3.5 bg-slate-950/80 rounded-[2rem] border border-white/5 shadow-inner group/chip hover:border-blue-500/40 transition-all hover:bg-slate-900 shrink-0">
              <Globe size={18} className="text-blue-400" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover/chip:text-slate-300">GEO: SYDNEY / AU</span>
            </div>
            <div className="flex items-center gap-3 px-8 py-3.5 bg-slate-950/80 rounded-[2rem] border border-white/5 shadow-inner group/chip hover:border-yellow-500/40 transition-all hover:bg-slate-900 shrink-0">
              <Zap size={18} className="text-yellow-500 animate-pulse" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover/chip:text-slate-300">CORE SYNC: STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeWidget;