
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
    orange: { border: 'border-orange-500/40', text: 'text-orange-400', glow: 'text-orange-500', shadow: 'shadow-orange-900/30', bg: 'from-orange-600 to-red-700', active: 'bg-orange-500/10' },
    blue: { border: 'border-blue-500/40', text: 'text-blue-400', glow: 'text-blue-500', shadow: 'shadow-blue-900/30', bg: 'from-blue-600 to-indigo-700', active: 'bg-blue-500/10' },
    purple: { border: 'border-purple-500/40', text: 'text-purple-400', glow: 'text-purple-500', shadow: 'shadow-purple-900/30', bg: 'from-purple-600 to-fuchsia-700', active: 'bg-purple-500/10' },
    red: { border: 'border-red-500/40', text: 'text-red-400', glow: 'text-red-500', shadow: 'shadow-red-900/30', bg: 'from-red-600 to-rose-700', active: 'bg-red-500/10' },
  }[color];

  if (!timeLeft) {
    return (
      <div className={`rpg-card rounded-[2.5rem] border-2 border-emerald-500/50 bg-slate-900 p-8 shadow-2xl relative overflow-hidden group min-h-[220px] flex items-center w-full`}>
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
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
              {isStatic ? "THE SIEGE IS ACTIVE" : `${title} HAS BEGUN`}
            </h3>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              {isStatic ? "Direct Combat Operations: Ongoing" : "Objective Status: Synchronized"}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rpg-card rounded-[2.5rem] border-2 ${colorConfig.border} bg-slate-900 p-8 shadow-2xl group transition-all duration-500 hover:border-${color}-500/80 min-h-[220px] w-full`}>
      {/* Background Watermark */}
      <div className={`absolute top-1/2 right-[-20px] -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover:opacity-08 transition-opacity duration-1000`}>
        <Skull size={240} className={colorConfig.glow} />
      </div>

      {onDelete && !isStatic && (
        <button onClick={onDelete} className="absolute top-4 right-4 p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Trash2 size={16} />
        </button>
      )}
      
      <div className="flex flex-col gap-8 relative z-10 h-full">
        <div className="flex items-center gap-6">
          <div className={`p-5 bg-gradient-to-br ${colorConfig.bg} rounded-2xl shadow-xl shrink-0 border border-white/10 group-hover:rotate-2 transition-transform`}>
            <Timer className="text-white" size={32} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-2 text-glow truncate">{title}</h3>
            <div className="flex items-center gap-2">
              <Zap size={14} className={`${colorConfig.text} fill-current animate-pulse`} />
              <p className={`${colorConfig.text} text-[10px] font-black uppercase tracking-[0.2em] opacity-80 truncate`}>{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 shadow-inner group-hover:border-white/10 transition-all duration-500 flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-4 px-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Battle Clock</span>
            <span className={`flex items-center gap-1.5 text-[8px] font-black ${colorConfig.text} uppercase tracking-widest ${colorConfig.active} px-2 py-1 rounded-lg`}>
              <Target size={10} /> Active Tracking
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter transition-colors">
                    {unit.label === 'Days' ? unit.value : String(unit.value).padStart(2, '0')}
                  </span>
                  <span className={`text-[10px] font-black ${colorConfig.text} uppercase mb-1`}>{unit.label[0]}</span>
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-2 w-full bg-slate-950 overflow-hidden">
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
