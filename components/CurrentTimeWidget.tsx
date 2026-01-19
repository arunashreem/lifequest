
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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="rpg-card rounded-[3rem] p-10 md:p-12 border-cyan-500/20 bg-slate-900/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group transition-all duration-700 hover:border-cyan-400 w-full max-w-full">
      {/* Expansive Background Pulse Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10 w-full">
        {/* Analogue Clock */}
        <div className="relative w-40 h-40 md:w-52 md:h-52 shrink-0 shadow-[0_0_50px_rgba(34,211,238,0.15)] rounded-full bg-slate-950/40">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-8 border-slate-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-[-4px] rounded-full border border-cyan-500/30 group-hover:border-cyan-500/60 transition-colors" />
          
          {/* Ticks */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 origin-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className={`w-full rounded-full ${i % 3 === 0 ? 'bg-cyan-400 h-3.5 shadow-[0_0_12px_rgba(34,211,238,0.8)]' : 'bg-slate-700 h-2'}`} />
            </div>
          ))}

          {/* Hands */}
          <div 
            className="absolute top-1/2 left-1/2 w-2 h-12 bg-white rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-lg"
            style={{ transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-1.5 h-16 bg-cyan-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-[0_0_15px_rgba(34,211,238,0.6)]"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-18 bg-rose-500 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-linear"
            style={{ transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)` }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-500 rounded-full shadow-lg" />
          </div>
          
          {/* Center Cap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-900 border-2 border-white rounded-full z-20 shadow-xl" />
        </div>

        {/* Digital Section */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-6 min-w-0 w-full px-2">
          {/* Sub-header with proper left spacing */}
          <div className="flex items-center gap-4 w-full justify-center lg:justify-start">
            <div className="p-3 bg-cyan-500/10 rounded-[1.2rem] border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all shrink-0">
              <ClockIcon size={22} className="text-cyan-400" />
            </div>
            <h3 className="text-[11px] md:text-[13px] font-black text-cyan-400 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none whitespace-normal md:whitespace-nowrap break-words">
              Chronos Temporal Hub
            </h3>
          </div>

          <div className="space-y-3 w-full text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center lg:items-baseline justify-center lg:justify-start gap-4 flex-wrap">
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter tabular-nums text-glow leading-none whitespace-nowrap drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                {digitalTime.split(' ')[0]} <span className="text-3xl md:text-5xl opacity-40 italic ml-2">{digitalTime.split(' ')[1]}</span>
              </h2>
              <span className="text-3xl md:text-4xl font-black text-slate-800 tabular-nums italic drop-shadow-md select-none hidden sm:inline">{secondsPart}</span>
            </div>
            <p className="text-[14px] md:text-[18px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-normal leading-tight opacity-90 drop-shadow-md">
              {dateString}
            </p>
          </div>

          {/* Bottom Metadata Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 w-full">
            <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-950/80 rounded-[1.5rem] border border-white/5 shadow-inner group/chip hover:border-blue-500/40 transition-all hover:bg-slate-900 shrink-0">
              <Globe size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap group-hover/chip:text-slate-300">GEO: SYDNEY/AU</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-950/80 rounded-[1.5rem] border border-white/5 shadow-inner group/chip hover:border-yellow-500/40 transition-all hover:bg-slate-900 shrink-0">
              <Zap size={14} className="text-yellow-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap group-hover/chip:text-slate-300">SYNC: OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeWidget;
