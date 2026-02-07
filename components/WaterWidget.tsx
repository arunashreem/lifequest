
import React from 'react';
import { Droplets, Plus, Minus, Sparkles, Waves } from 'lucide-react';

interface WaterWidgetProps {
  currentWater: number;
  onUpdateWater: (amount: number) => void;
  compact?: boolean;
}

const WaterWidget: React.FC<WaterWidgetProps> = ({ currentWater, onUpdateWater, compact = false }) => {
  const goal = 2000; // 2 Liters
  const percentage = Math.min(100, (currentWater / goal) * 100);
  
  return (
    <div className="rpg-card rounded-[2.5rem] border-blue-500/20 bg-slate-950 shadow-2xl relative overflow-hidden group flex flex-col p-6 md:p-10 min-h-[300px]">
      {/* Background Fluid Effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/15 via-blue-500/5 to-transparent transition-all duration-[2000ms] ease-out z-0" 
        style={{ height: `${percentage}%` }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-blue-400/30 blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full flex-1">
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-blue-400 shadow-xl group-hover:scale-110 transition-transform">
              <Droplets size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em] italic leading-none">VITAL ESSENCE</h3>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1.5">Hydration Matrix</p>
            </div>
          </div>
          {percentage >= 100 && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full text-emerald-400 flex items-center gap-2 animate-bounce shadow-lg">
              <Sparkles size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">LIMIT BREAK</span>
            </div>
          )}
        </div>

        {/* Central HUD */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 flex-1">
          {/* Main Readout */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter tabular-nums leading-none glow-text-blue">
                {(currentWater / 1000).toFixed(1)}
              </span>
              <span className="text-2xl lg:text-3xl font-black text-blue-500/60 uppercase italic">/ 2.0L</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="bg-blue-500/10 px-4 py-1.5 rounded-xl border border-blue-500/20 flex items-center gap-2">
                <Waves size={12} className="text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                  {percentage.toFixed(0)}% SYNCED
                </span>
              </div>
            </div>
          </div>

          {/* Action Module */}
          <div className="flex flex-col gap-4 w-full md:w-auto min-w-0 lg:min-w-[220px]">
             {/* Dynamic Bar */}
             <div className="w-full h-3 bg-black/60 rounded-full border border-white/5 overflow-hidden shadow-inner relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-800 via-blue-400 to-cyan-500 transition-all duration-[1500ms] shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move-bg_3s_linear_infinite]" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onUpdateWater(-250)}
                  disabled={currentWater <= 0}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-900 border border-white/10 rounded-2xl text-slate-500 hover:text-white hover:border-blue-500/40 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center shadow-xl group/minus shrink-0"
                >
                  <Minus size={20} className="group-hover/minus:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => onUpdateWater(250)}
                  className="flex-1 h-12 lg:h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 border border-blue-400 group/plus"
                >
                  <Plus size={16} className="group-hover/plus:rotate-90 transition-transform duration-300" />
                  <span>Hydrate</span>
                </button>
              </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes move-bg {
          0% { background-position: 0 0; }
          100% { background-position: 1rem 0; }
        }
      `}</style>
    </div>
  );
};

export default WaterWidget;
