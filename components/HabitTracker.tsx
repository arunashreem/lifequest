
import React, { useState, useEffect } from 'react';
import { Habit, TaskCategory } from '../types';
import { Sparkles, Trophy, Plus, Trash2, CheckCircle2, Flame, Circle, Info, ScrollText, ZapOff } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (title: string, category: TaskCategory) => void;
  onDeleteHabit: (id: string) => void;
  onBreakHabit: (id: string) => void;
}

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {[...Array(100)].map((_, i) => {
        const size = Math.random() * 8 + 4;
        const color = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)];
        const delay = Math.random() * 0.5; // Tighter burst delay
        const duration = 2.5 + Math.random() * 2.5;
        const left = Math.random() * 100;
        const rotationStart = Math.random() * 360;
        const swingX = (Math.random() - 0.5) * 60; // Sway amount
        
        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '1px',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotationStart}deg)`,
              opacity: 0,
              '--swing-x': `${swingX}px`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { 
            transform: translateY(-10vh) rotate(0deg) translateX(0); 
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(var(--swing-x));
          }
          100% { 
            transform: translateY(115vh) rotate(720deg) translateX(0); 
            opacity: 0; 
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit, onDeleteHabit, onBreakHabit }) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = (habit: Habit) => {
    const isToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
    if (isToday) return;

    onToggleHabit(habit.id);
    setCompletionMessage(`You have completed "${habit.title}" for ${habit.streak + 1} days!`);
    setShowConfetti(true);
    setIsExiting(false);
    
    // Clear after 3.5s to allow for full exit animation
    const exitTimer = setTimeout(() => setIsExiting(true), 3000);
    const clearTimer = setTimeout(() => {
      setShowConfetti(false);
      setCompletionMessage(null);
      setIsExiting(false);
    }, 3600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(clearTimer);
    };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    onAddHabit(newHabitTitle, TaskCategory.HEALTH);
    setNewHabitTitle('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {showConfetti && <Confetti />}
      
      {/* Enhanced Completion Overlay */}
      {completionMessage && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
          {/* Backdrop Blur with smooth fade */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500" />
          
          <div className="relative bg-slate-900 border-2 border-yellow-500/40 p-10 md:p-16 rounded-[3rem] shadow-[0_0_100px_rgba(234,179,8,0.25)] text-center animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 overflow-hidden">
            {/* Glossy Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-yellow-500 p-6 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.6)] border-4 border-slate-900 animate-bounce">
              <Trophy size={52} className="text-slate-950" />
            </div>
            
            <div className="mt-8 space-y-6">
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-500 delay-200 fill-mode-both">
                <h3 className="text-2xl font-black text-yellow-500/80 uppercase tracking-widest italic pixel-font text-[10px]">Evo-Chain Progress!</h3>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full" />
              </div>
              
              <h4 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-500 uppercase tracking-tighter drop-shadow-lg animate-in fade-in zoom-in-75 duration-700 delay-300 fill-mode-both">
                Quest Cleared
              </h4>
              
              <p className="text-2xl text-slate-100 font-bold max-w-sm mx-auto leading-tight animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 fill-mode-both">
                {completionMessage}
              </p>
              
              <div className="pt-6 flex items-center justify-center gap-4 animate-in fade-in duration-1000 delay-700 fill-mode-both">
                <div className="h-px w-12 bg-slate-800" />
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-500 animate-pulse" size={24} />
                  <span className="text-sm font-black text-yellow-500 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                    +50 XP | +10 GOLD
                  </span>
                  <Sparkles className="text-yellow-500 animate-pulse" size={24} />
                </div>
                <div className="h-px w-12 bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Evolution Chamber</h2>
          <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400 animate-pulse" />
            Stay disciplined for 21 days to forge a Legendary Passive Skill.
          </p>
        </div>
      </div>

      {/* Habit Scribe */}
      <form onSubmit={handleAddSubmit} className="rpg-card p-8 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h3 className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 relative z-10">
          <Plus size={18} className="animate-pulse" />
          Scribe New Passive Skill
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <input 
            type="text" 
            placeholder="E.g. Morning Meditation, 10k Steps Ritual..."
            value={newHabitTitle}
            onChange={e => setNewHabitTitle(e.target.value)}
            className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-600"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/30 active:scale-95 transition-all hover:translate-y-[-2px]">
            Forge Skill
          </button>
        </div>
      </form>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {habits.map((habit, idx) => {
          const isToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
          const progress = (habit.streak / 21) * 100;
          
          return (
            <div 
              key={habit.id}
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`rpg-card rounded-[2rem] p-8 border-slate-800 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 ${
                habit.isFormed ? 'border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.15)]' : 'hover:border-slate-700 shadow-xl'
              }`}
            >
              {habit.isFormed && (
                <div className="absolute top-0 right-0 p-3 bg-yellow-500 text-slate-950 font-black text-[9px] uppercase tracking-widest rounded-bl-2xl shadow-lg z-10 animate-pulse">
                  Legendary Skill
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[1.25rem] bg-slate-800 border-2 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 ${
                    isToday ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-slate-700'
                  }`}>
                    {CATEGORY_ICONS[habit.category]}
                  </div>
                  <div>
                    <h3 className={`text-xl font-black uppercase tracking-tight transition-colors duration-500 ${isToday ? 'text-emerald-400' : 'text-white'}`}>
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Flame size={14} className={`transition-all duration-500 ${habit.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                        {habit.streak} Day Chain
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {!isToday && !habit.isFormed && habit.streak > 0 && (
                    <button 
                      onClick={() => onBreakHabit(habit.id)}
                      className="p-4 rounded-2xl border border-red-900/40 bg-red-950/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-90"
                      title="Shatter Chain"
                    >
                      <ZapOff size={26} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleComplete(habit)}
                    disabled={isToday}
                    className={`p-4 rounded-2xl transition-all border-2 group/btn ${
                      isToday 
                        ? 'bg-emerald-600 border-emerald-400 text-white cursor-default' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-blue-600/10 hover:text-white active:scale-90 shadow-xl'
                    }`}
                  >
                    {isToday ? <CheckCircle2 size={26} /> : <Circle size={26} className="group-hover/btn:scale-110 transition-transform duration-300" />}
                  </button>
                </div>
              </div>

              {/* Progress 0/21 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span className="flex items-center gap-2">
                    Evolutionary Rank <Sparkles size={10} className={progress > 50 ? 'text-blue-400 animate-spin-slow' : ''} />
                  </span>
                  <span className={habit.isFormed ? 'text-yellow-500' : ''}>{habit.streak} / 21 Cycles</span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full border-2 border-slate-900 overflow-hidden shadow-inner p-0.5">
                  <div 
                    className={`h-full transition-all duration-1500 ease-out rounded-full ${
                      habit.isFormed ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    }`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  >
                    <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                
                {/* Visual Pips - Smaller and cleaner */}
                <div className="flex justify-between gap-1 pt-3">
                  {[...Array(21)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
                        i < habit.streak 
                          ? habit.isFormed ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]'
                          : 'bg-slate-900'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onDeleteHabit(habit.id)}
                className="absolute bottom-3 right-3 p-2 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-125"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="py-32 text-center rpg-card border-dashed border-2 border-slate-800 rounded-[3rem] opacity-30 animate-pulse">
           <ScrollText size={64} className="mx-auto mb-6 text-slate-600" />
           <p className="pixel-font text-[12px] tracking-widest text-slate-500">Evolution chamber dormant...</p>
        </div>
      )}

      <div className="p-8 bg-slate-900/60 border-2 border-slate-800 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 shadow-2xl backdrop-blur-md">
        <div className="bg-blue-600/10 p-6 rounded-[1.5rem] border border-blue-500/20 shadow-inner">
          <Info className="text-blue-400" size={40} />
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Lore of Perpetual Growth</h4>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            Legends tell of the <span className="text-blue-400 font-bold underline decoration-blue-500/30 decoration-2 underline-offset-4">21-Day Ritual</span>. 
            Maintain the chain to bake discipline into your mental code. 
            A completed evolution unlocks a <span className="text-yellow-500 font-bold drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">Legendary +1000 XP Bonus</span>. 
            Use <span className="text-red-400 font-bold">Shatter</span> only if the vow was truly broken.
          </p>
        </div>
      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HabitTracker;
