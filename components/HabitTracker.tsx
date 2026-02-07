
import React, { useState, useRef } from 'react';
import { Habit, TaskCategory, UserStats } from '../types';
import { Sparkles, Trophy, Plus, Trash2, CheckCircle2, Flame, Circle, Info, ScrollText, ZapOff, AlertTriangle, RotateCcw, Activity, ShieldCheck, Zap, History, Coins, Droplets, TrendingUp, Star } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';
import WaterWidget from './WaterWidget';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (title: string, category: TaskCategory) => void;
  onDeleteHabit: (id: string) => void;
  onBreakHabit: (id: string) => void;
  stats: UserStats;
  onUpdateWater: (amount: number) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit, onDeleteHabit, onBreakHabit, stats, onUpdateWater }) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [celebration, setCelebration] = useState<{ title: string; streak: number } | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleComplete = (habit: Habit) => {
    if (habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString()) return;
    
    setAnimatingId(habit.id);
    setTimeout(() => setAnimatingId(null), 1000);

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }

    onToggleHabit(habit.id);
    setCelebration({ title: habit.title, streak: habit.streak + 1 });
    
    completionTimeoutRef.current = setTimeout(() => {
      setCelebration(null);
      completionTimeoutRef.current = null;
    }, 4500);
  };

  const dismissCelebration = () => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    setCelebration(null);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      {celebration && (
        <div 
          onClick={dismissCelebration}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in zoom-in-95 duration-500 cursor-pointer select-none overflow-hidden"
        >
           <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-lime-500/40 rounded-full animate-pulse"
                  style={{
                    width: Math.random() * 200 + 50 + 'px',
                    height: Math.random() * 200 + 50 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    filter: 'blur(100px)',
                    animationDelay: i * 0.2 + 's'
                  }}
                />
              ))}
           </div>

           <div className="text-center space-y-12 max-w-4xl relative z-10 pointer-events-none">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-lime-500 blur-[80px] opacity-40 animate-pulse" />
                <div className="w-32 h-32 md:w-48 md:h-48 bg-lime-500 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-[0_0_120px_rgba(57,255,20,0.8)] border-8 border-white/20 animate-bounce relative z-10">
                  <ShieldCheck size={80} className="text-black md:w-24 md:h-24" />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lime-500 text-lg md:text-2xl font-black tracking-[0.8em] uppercase italic opacity-80 animate-in slide-in-from-top-4 duration-700">Ritual Mastery Attained</p>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none glow-text-green break-words px-4">
                  {celebration.title}
                </h2>
              </div>

              <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-700 delay-300">
                <div className="bg-black/60 border-2 border-lime-500/40 px-12 py-6 rounded-[2.5rem] shadow-3xl flex items-center gap-8 backdrop-blur-xl">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-lime-500/60 uppercase tracking-widest mb-1">STREAK</span>
                    <span className="text-5xl md:text-7xl font-black text-white italic tabular-nums leading-none">{celebration.streak}</span>
                  </div>
                  <div className="w-px h-16 bg-white/10" />
                  <div className="flex flex-col items-start">
                    <span className="text-2xl md:text-3xl font-black text-lime-400 uppercase italic tracking-tighter">CYCLE COMPLETE</span>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp size={16} className="text-lime-500 animate-pulse" />
                      <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Aura Density +15%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase animate-pulse mt-8">Click to re-enter reality</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-green">The Aura Forge</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-lime-400 animate-pulse" /> 
            Forging Permanent Mental Circuits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={(e) => { e.preventDefault(); if(newHabitTitle.trim()) onAddHabit(newHabitTitle, TaskCategory.HEALTH); setNewHabitTitle(''); }} 
                className="rpg-card p-10 md:p-12 rounded-[3rem] border-lime-500/20 bg-slate-950/80 shadow-3xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 to-transparent pointer-events-none" />
            <h3 className="text-[11px] font-black text-lime-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <Plus size={20} className="animate-spin-slow" /> New Ritual Design
            </h3>
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              <input type="text" placeholder="Designate Ritual (e.g. Master's Rest)..." value={newHabitTitle} onChange={e => setNewHabitTitle(e.target.value)} 
                     className="flex-1 bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-lime-500 outline-none transition-all placeholder:text-slate-800" />
              <button type="submit" className="bg-lime-500 hover:bg-lime-400 text-black px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_40px_rgba(57,255,20,0.4)]">Ignite Core</button>
            </div>
          </form>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
            {habits.map((habit) => {
              const isToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
              const progress = (habit.streak / 21) * 100;
              const isAnimating = animatingId === habit.id;
              
              return (
                <div key={habit.id} className={`rpg-card rounded-[3.5rem] p-8 border-white/10 transition-all duration-700 group relative overflow-hidden ${
                  isToday ? 'border-lime-500/50 bg-lime-500/5 shadow-[0_20px_50px_rgba(57,255,20,0.1)]' : 'hover:border-white/30'
                } ${isAnimating ? 'animate-shockwave' : ''}`}>
                  
                  {isToday && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
                  )}
                  
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-lime-500 to-transparent`} />
                  
                  <div className="flex items-start justify-between mb-8 gap-6 relative z-10">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`p-3.5 rounded-2xl shadow-2xl transition-all duration-700 shrink-0 group-hover:scale-105 ${
                        isToday ? 'bg-lime-500 text-black shadow-lime-500/40 ring-4 ring-lime-500/20' : 'bg-slate-900 text-slate-500 border border-white/10'
                      }`}>
                        {React.cloneElement(CATEGORY_ICONS[habit.category] as React.ReactElement<any>, { className: 'w-4 h-4' })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-base font-black uppercase tracking-tight leading-tight mb-1 whitespace-normal break-words ${isToday ? 'text-lime-400 glow-text-green' : 'text-white'}`}>
                          {habit.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Flame size={12} className={`${habit.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-800'}`} />
                          <span className={`text-[7px] font-black uppercase tracking-[0.4em] transition-colors ${isToday ? 'text-lime-500/60' : 'text-slate-500'}`}>
                            {habit.streak} CYCLES LOGGED
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <button onClick={() => handleComplete(habit)} disabled={isToday} 
                        className={`p-3 rounded-xl transition-all border-2 shrink-0 active:scale-90 relative ${
                          isToday ? 'bg-lime-500 border-lime-300 text-black shadow-lg shadow-lime-900/40' : 'bg-black border-white/10 text-slate-800 hover:border-lime-500 hover:text-lime-500'
                        }`}>
                        {isToday ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        {isAnimating && <div className="absolute inset-0 bg-lime-500 rounded-xl animate-ping opacity-40" />}
                      </button>
                      
                      {isToday && (
                        <div className="flex items-center gap-1 text-[8px] font-black text-lime-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                          <Star size={8} fill="currentColor" /> DONE
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                      <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.5em]">SYNAPTIC ENCODING</span>
                      <div className="flex items-center gap-2">
                        {habit.streak >= 7 && <Trophy size={10} className="text-yellow-500 animate-pulse" />}
                        <span className={`text-[10px] font-black ${isToday ? 'text-lime-400' : 'text-white'}`}>{habit.streak}/21</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-black rounded-full border border-white/5 p-0.5 overflow-hidden shadow-inner relative">
                      <div className={`h-full bg-gradient-to-r from-lime-600 via-lime-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(57,255,20,0.6)] relative`} style={{ width: `${Math.min(100, progress)}%` }}>
                         <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%,transparent)] bg-[length:0.75rem_0.75rem] animate-[move-bg_1.5s_linear_infinite]" />
                         {/* Flow point */}
                         <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-white blur-[2px] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {habit.streak >= 14 && (
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-500/10 rotate-45 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-all" />
                  )}

                  <div className="absolute bottom-4 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => onDeleteHabit(habit.id)} className="p-2 rounded-lg bg-black border border-white/10 text-slate-700 hover:text-red-500 transition-all active:scale-90"><Trash2 size={12} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <WaterWidget currentWater={stats.dailyWater} onUpdateWater={onUpdateWater} />
          
          <div className="rpg-card p-10 rounded-[3rem] border-white/10 bg-slate-950 shadow-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <RotateCcw size={120} className="text-lime-500" />
             </div>
             <h3 className="text-[11px] font-black text-lime-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
               <History size={18} /> Ritual Stats
             </h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 group hover:border-orange-500/40 transition-all">
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-orange-500/10 rounded-lg">
                       <Flame size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Streaks</span>
                   </div>
                   <span className="text-3xl font-black text-white">{habits.filter(h => h.streak > 0).length}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 group hover:border-lime-500/40 transition-all">
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-lime-500/10 rounded-lg">
                       <ShieldCheck size={24} className="text-lime-500 group-hover:scale-110 transition-transform" />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastered Forms</span>
                   </div>
                   <span className="text-3xl font-black text-white">{habits.filter(h => h.isFormed).length}</span>
                </div>
             </div>
             <div className="mt-10 p-6 bg-lime-500/10 border border-lime-500/20 rounded-2xl">
               <p className="text-xs text-slate-400 leading-relaxed italic font-medium">
                 "Consistency is the forge of greatness. A ritual repeated for 21 cycles becomes an unbreakable thread in your destiny's tapestry."
               </p>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes move-bg {
          0% { background-position: 0 0; }
          100% { background-position: 1rem 0; }
        }
        .animate-shockwave {
          animation: shockwave-effect 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes shockwave-effect {
          0% { transform: scale(1); filter: brightness(1); }
          20% { transform: scale(0.98); filter: brightness(1.5); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); filter: brightness(1); }
        }
      `}</style>
    </div>
  );
};

export default HabitTracker;
