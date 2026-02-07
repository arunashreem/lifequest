
import React, { useState, useEffect } from 'react';
import { Skull, Timer, Zap, ShieldAlert, Target, Trash2, CheckCircle2 } from 'lucide-react';

interface CountdownWidgetProps {
  title?: string;
  subtitle?: string;
  targetDate: string; // ISO format or "YYYY-MM-DD"
  color?: 'orange' | 'blue' | 'purple' | 'red';
  onDelete?: () => void;
  isStatic?: boolean;
}

const CountdownWidget: React.FC<CountdownWidgetProps> = ({ 
  title = "THE ACADEMIC SIEGE", 
  subtitle = "STARTS: FEB 2, 2026", 
  targetDate, 
  color = 'orange',
  onDelete,
  isStatic = false
}) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    let target = new Date(targetDate);
    
    const difference = target.getTime() - now.getTime();
    
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const colorConfig = {
    orange: { border: 'border-orange-500/40', text: 'text-orange-500', glow: 'text-orange-500', shadow: 'shadow-orange-900/30', bg: 'from-orange-600 to-red-700', active: 'bg-orange-500/10' },
    blue: { border: 'border-blue-500/40', text: 'text-blue-500', glow: 'text-blue-500', shadow: 'shadow-blue-900/30', bg: 'from-blue-600 to-indigo-700', active: 'bg-blue-500/10' },
    purple: { border: 'border-purple-500/40', text: 'text-purple-500', glow: 'text-purple-500', shadow: 'shadow-purple-900/30', bg: 'from-purple-600 to-fuchsia-700', active: 'bg-purple-500/10' },
    red: { border: 'border-red-500/40', text: 'text-red-500', glow: 'text-red-500', shadow: 'shadow-red-900/30', bg: 'from-red-600 to-rose-700', active: 'bg-red-500/10' },
  }[color];

  if (!timeLeft) {
    return (
      <div className={`rpg-card rounded-[2rem] border-2 border-emerald-500/50 bg-slate-900 p-6 shadow-2xl relative overflow-hidden group min-h-[180px] flex items-center w-full`}>
        {onDelete && !isStatic && (
          <button onClick={onDelete} className="absolute top-4 right-4 p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Trash2 size={16} />
          </button>
        )}
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/30 animate-pulse ring-4 ring-emerald-500/20">
            {isStatic ? <ShieldAlert size={32} className="text-white" /> : <CheckCircle2 size={32} className="text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">
              {isStatic ? "THE SIEGE IS ACTIVE" : `${title} HAS BEGUN`}
            </h3>
            <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mt-2">
              {isStatic ? "Direct Combat Operations: Ongoing" : "Objective Status: Synchronized"}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: timeLeft.days, suffix: 'D' },
    { label: 'HOURS', value: timeLeft.hours, suffix: 'H' },
    { label: 'MINS', value: timeLeft.minutes, suffix: 'M' },
    { label: 'SECS', value: timeLeft.seconds, suffix: 'S' }
  ];

  return (
    <div className={`relative overflow-hidden rpg-card rounded-[2.5rem] border-2 ${colorConfig.border} bg-slate-950 p-5 md:p-8 shadow-3xl group transition-all duration-500 hover:border-white/20 w-full`}>
      {/* Background Watermark */}
      <div className={`absolute top-1/2 right-[-20px] -translate-y-1/2 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000`}>
        <Skull size={200} className={colorConfig.glow} />
      </div>

      {onDelete && !isStatic && (
        <button onClick={onDelete} className="absolute top-4 right-4 p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Trash2 size={16} />
        </button>
      )}
      
      <div className="flex flex-col gap-6 md:gap-8 relative z-10 h-full">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mb-2 leading-none">BATTLE CLOCK</h3>
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tight leading-none group-hover:text-white transition-colors">
              {title}
            </h2>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-black/60 shrink-0 h-fit`}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
            <span className="text-[7px] md:text-[8px] font-black text-orange-400 uppercase tracking-[0.2em] whitespace-nowrap italic">TRACKING</span>
          </div>
        </div>

        <div className="bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 border border-white/5 shadow-[inset_0_4px_24px_rgba(0,0,0,0.9)] group-hover:border-white/10 transition-all duration-500">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 md:gap-y-10 md:gap-x-12 w-full h-full items-center">
            {units.map((unit, i) => (
              <div key={i} className="flex flex-col items-center justify-center min-w-0 relative">
                <div className="flex items-start justify-center w-full relative">
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_8px_20px_rgba(0,0,0,1)] leading-none">
                    {unit.label === 'DAYS' ? unit.value : String(unit.value).padStart(2, '0')}
                  </span>
                  <span className={`text-[10px] md:text-xs lg:text-base font-black ${colorConfig.text} uppercase tabular-nums italic ml-0.5 mt-0.5 lg:mt-1 shrink-0 drop-shadow-md`}>
                    {unit.suffix}
                  </span>
                </div>
                <span className="text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mt-2 md:mt-3 text-center whitespace-nowrap leading-none">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-900 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorConfig.bg} transition-all duration-1000 relative`} 
          style={{ width: `${Math.max(5, Math.min(100, (365 - timeLeft.days) / 3.65))}%` }}
        >
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default CountdownWidget;
