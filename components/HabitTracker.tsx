
import React, { useState } from 'react';
import { Habit, TaskCategory } from '../types';
import { Sparkles, Trophy, Plus, Trash2, CheckCircle2, Flame, Circle, Info, ScrollText, ZapOff, AlertTriangle, RotateCcw, Activity, ShieldCheck, Zap, History, Coins } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {[...Array(100)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const color = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)];
        const delay = Math.random() * 0.8; 
        const duration = 3 + Math.random() * 3;
        const left = Math.random() * 100;
        const rotationStart = Math.random() * 360;
        const swingX = (Math.random() - 0.5) * 100;
        
        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
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
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translateY(50vh) rotate(180deg) translateX(var(--swing-x)); }
          100% { transform: translateY(120vh) rotate(720deg) translateX(0); opacity: 0; }
        }
        .animate-confetti-fall { animation: confetti-fall cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>
    </div>
  );
};

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (title: string, category: TaskCategory) => void;
  onDeleteHabit: (id: string) => void;
  onBreakHabit: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit, onDeleteHabit, onBreakHabit }) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = (habit: Habit) => {
    const isToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
    if (isToday) return;

    onToggleHabit(habit.id);
    setCompletionMessage(`YOU MASTERED "${habit.title}"`);
    setShowConfetti(true);
    setIsExiting(false);
    
    const exitTimer = setTimeout(() => setIsExiting(true), 2800);
    const clearTimer = setTimeout(() => {
      setShowConfetti(false);
      setCompletionMessage(null);
      setIsExiting(false);
    }, 3500);

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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative pb-20">
      {showConfetti && <Confetti />}
      
      {/* Victory Flash Overlay */}
      {completionMessage && (
        <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-700 ${isExiting ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500" />
          <div className="relative p-12 md:p-24 text-center max-w-4xl w-full">
            <div className="absolute inset-0 bg-yellow-500/10 blur-[150px] animate-pulse" />
            <div className="relative z-10 space-y-8">
              <div className="p-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[3rem] shadow-[0_0_80px_rgba(234,179,8,0.6)] border-4 border-white/20 mx-auto w-fit mb-12">
                <Trophy size={80} className="text-slate-950 animate-bounce" />
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-500 uppercase tracking-tighter drop-shadow-2xl italic leading-none">{completionMessage}</h2>
              <div className="flex items-center justify-center gap-6 pt-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/50" />
                <span className="text-2xl font-black text-yellow-500 uppercase tracking-[0.4em] drop-shadow-lg">+50 XP | +25 GP</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-500/50" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">The Aura Forge</h2>
          <div className="flex items-center gap-3 mt-4">
            <Sparkles size={20} className="text-blue-400 animate-pulse" /> 
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Forging permanent character traits in the void.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddSubmit} className="rpg-card p-8 md:p-12 rounded-[3rem] border-blue-500/10 bg-slate-900/30 shadow-3xl group relative overflow-hidden ring-1 ring-white/5 mx-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5" />
        <h3 className="flex items-center gap-3 text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-10 relative z-10">
          <Plus size={24} className="animate-pulse" /> Scribe New Passive Ritual
        </h3>
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <input 
            type="text" 
            placeholder="Name your ritual (e.g. Shadow Yoga)..." 
            value={newHabitTitle} 
            onChange={e => setNewHabitTitle(e.target.value)} 
            className="flex-1 bg-slate-950/80 border-2 border-slate-800 rounded-2xl px-8 py-5 text-white text-lg focus:border-blue-500 shadow-inner outline-none transition-all placeholder:text-slate-700 placeholder:italic" 
          />
          <button type="submit" className="bg-gradient-to-br from-blue-600 to-indigo-800 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap">Ignite Forge</button>
        </div>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 px-2">
        {habits.map((habit, idx) => {
          const now = new Date();
          const lastDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
          const isToday = lastDate && lastDate.toDateString() === new Date().toDateString();
          const diffInMs = lastDate ? now.getTime() - lastDate.getTime() : 0;
          const diffInDays = lastDate ? Math.floor(diffInMs / (1000 * 60 * 60 * 24)) : 0;
          
          const isGracePeriod = lastDate && !isToday && diffInDays === 1;
          const isShattered = lastDate && !isToday && diffInDays >= 2;
          const progress = (habit.streak / 21) * 100;
          
          return (
            <div 
              key={habit.id} 
              className={`rpg-card rounded-[3.5rem] p-8 md:p-12 border-slate-800 transition-all duration-700 group relative overflow-hidden ${
              habit.isFormed ? 'border-yellow-500/40 shadow-[0_0_80px_rgba(234,179,8,0.15)]' : 
              isShattered ? 'border-red-500/40 bg-red-950/10' : 
              isToday ? 'border-emerald-500/30' : 'hover:border-slate-600'
            }`}>
              {/* Dynamic Aura Gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${
                habit.isFormed ? 'bg-yellow-500' : isShattered ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              
              <div className="flex justify-between items-start mb-12 gap-6 relative z-10">
                <div className="flex items-center gap-6 min-w-0 flex-1">
                  <div className={`p-5 rounded-[2rem] transition-all duration-700 group-hover:scale-110 shadow-2xl shrink-0 ${
                    isToday ? 'bg-emerald-600 text-white shadow-emerald-900/50' : 
                    isShattered ? 'bg-slate-900 text-red-400 border border-red-500/30' : 
                    'bg-slate-900 text-slate-500 border border-white/10'
                  }`}>
                    {CATEGORY_ICONS[habit.category]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-3 truncate ${isToday ? 'text-emerald-400 text-glow' : isShattered ? 'text-red-400' : 'text-white'}`}>{habit.title}</h3>
                    <div className="flex items-center gap-3">
                      <Flame size={18} className={`${habit.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-700'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        Streak Intensity: {habit.streak} Nodes
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleComplete(habit)} 
                  disabled={isToday} 
                  className={`p-4 rounded-3xl transition-all border-4 shrink-0 active:scale-90 ${
                    isToday 
                      ? 'bg-emerald-600 border-emerald-400 text-white cursor-default' 
                      : isShattered ? 'bg-slate-950 border-red-500/40 text-red-500 hover:bg-red-600 hover:text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-blue-500 hover:text-white'
                  }`}
                >
                  {isToday ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.4em]">
                  <span className="text-slate-500">Synaptic Encoding</span>
                  <span className={habit.isFormed ? 'text-yellow-500' : 'text-slate-400'}>{habit.streak}/21</span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full border border-white/10 p-0.5 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1500 ease-out relative ${
                      habit.isFormed ? 'bg-gradient-to-r from-yellow-700 via-yellow-400 to-amber-600' : 
                      isShattered ? 'bg-red-900' : 'bg-gradient-to-r from-blue-800 to-cyan-500'
                    }`} 
                    style={{ width: `${Math.min(100, progress)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                
                {/* Visual Bead Meter */}
                <div className="flex justify-between gap-1.5 pt-2">
                  {[...Array(21)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
                      i < habit.streak 
                        ? habit.isFormed ? 'bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,1)]' : 
                          isShattered ? 'bg-red-600' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]'
                        : 'bg-slate-950 border border-white/5'
                    }`} />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                {!isToday && !habit.isFormed && habit.streak > 0 && (
                  <button onClick={() => onBreakHabit(habit.id)} className="p-3 rounded-2xl bg-red-900/20 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"><ZapOff size={18} /></button>
                )}
                <button onClick={() => onDeleteHabit(habit.id)} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules of the Void */}
      <div className="mx-2 p-10 bg-slate-950/60 border-2 border-white/5 rounded-[3.5rem] shadow-3xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-10">
        <div className="p-6 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 text-blue-400 shrink-0">
          <ShieldCheck size={48} />
        </div>
        <div className="space-y-3">
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Vows of the Forge</h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-4xl font-medium">
            Mastery is found in relentless repetition. A ritual takes <span className="text-blue-400 font-black">21 cycles</span> to manifest as a permanent passive skill. Missing 24 hours triggers the <span className="text-amber-500 font-bold">Vow Tax</span> (-50 XP/Gold), but missing 48 hours <span className="text-red-500 font-black italic shadow-red-500/20">shatters the chain</span> entirely. Safeguard your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
