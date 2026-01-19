
import React, { useState } from 'react';
import { Habit, TaskCategory } from '../types';
import { Sparkles, Trophy, Plus, Trash2, CheckCircle2, Flame, Circle, Info, ScrollText, ZapOff, AlertTriangle, RotateCcw, Activity, ShieldCheck, Zap, History, Coins } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {[...Array(100)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const color = ['#00f2ff', '#39ff14', '#bc00ff', '#ff0055', '#ffcc00'][Math.floor(Math.random() * 5)];
        return (
          <div key={i} className="absolute animate-confetti-fall"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${size}px`, height: `${size}px`,
              backgroundColor: color,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              opacity: 0,
            } as React.CSSProperties} />
        );
      })}
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
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const handleComplete = (habit: Habit) => {
    if (habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString()) return;
    onToggleHabit(habit.id);
    setCompletionMessage(`RITUAL MASTERED: ${habit.title}`);
    setTimeout(() => setCompletionMessage(null), 3500);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      {completionMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
           <div className="text-center space-y-10 max-w-4xl">
              <div className="w-32 h-32 bg-lime-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(57,255,20,0.6)] border-4 border-white animate-bounce">
                <ShieldCheck size={64} className="text-black" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-lime-400 uppercase italic tracking-tighter glow-text-green">{completionMessage}</h2>
              <p className="text-2xl font-black text-white/60 tracking-[0.5em] uppercase">Passive Attribute Increased</p>
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

      <form onSubmit={(e) => { e.preventDefault(); if(newHabitTitle.trim()) onAddHabit(newHabitTitle, TaskCategory.HEALTH); setNewHabitTitle(''); }} 
            className="rpg-card p-10 md:p-14 rounded-[4rem] border-lime-500/20 bg-slate-950/80 shadow-3xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 to-transparent pointer-events-none" />
        <h3 className="text-[11px] font-black text-lime-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
          <Plus size={20} className="animate-spin-slow" /> New Ritual Design
        </h3>
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <input type="text" placeholder="Designate Ritual (e.g. Master's Rest)..." value={newHabitTitle} onChange={e => setNewHabitTitle(e.target.value)} 
                 className="flex-1 bg-black border-2 border-white/10 rounded-3xl px-8 py-6 text-xl text-white focus:border-lime-500 outline-none transition-all placeholder:text-slate-800" />
          <button type="submit" className="bg-lime-500 hover:bg-lime-400 text-black px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_40px_rgba(57,255,20,0.4)]">Ignite Core</button>
        </div>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-14">
        {habits.map((habit) => {
          const isToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
          const progress = (habit.streak / 21) * 100;
          
          return (
            <div key={habit.id} className={`rpg-card rounded-[4rem] p-8 md:p-14 border-white/10 transition-all duration-700 group relative overflow-hidden ${
              isToday ? 'border-lime-500/50 bg-lime-500/5' : 'hover:border-white/30'
            }`}>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-lime-500 to-transparent`} />
              
              <div className="flex justify-between items-start mb-12 gap-8 relative z-10">
                <div className="flex items-center gap-6 min-w-0 flex-1">
                  <div className={`p-6 rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:scale-110 ${
                    isToday ? 'bg-lime-500 text-black shadow-lime-500/40' : 'bg-slate-900 text-slate-500 border border-white/10'
                  }`}>
                    {CATEGORY_ICONS[habit.category]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-4 ${isToday ? 'text-lime-400 glow-text-green' : 'text-white'}`}>
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Flame size={18} className={`${habit.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-800'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        {habit.streak} CYCLES LOGGED
                      </span>
                    </div>
                  </div>
                </div>
                
                <button onClick={() => handleComplete(habit)} disabled={isToday} 
                  className={`p-5 rounded-[2rem] transition-all border-4 shrink-0 active:scale-90 ${
                    isToday ? 'bg-lime-500 border-lime-300 text-black' : 'bg-black border-white/10 text-slate-800 hover:border-lime-500 hover:text-lime-500'
                  }`}>
                  {isToday ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.6em]">SYNAPTIC ENCODING</span>
                  <span className="text-sm font-black text-white">{habit.streak}/21</span>
                </div>
                <div className="h-4 bg-black rounded-full border-2 border-white/5 p-1 overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-lime-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(57,255,20,0.6)]" style={{ width: `${Math.min(100, progress)}%` }} />
                </div>
                
                <div className="flex justify-between gap-2 pt-2">
                  {[...Array(21)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-700 ${
                      i < habit.streak ? 'bg-lime-500 shadow-[0_0_10px_rgba(57,255,20,1)]' : 'bg-slate-900 border border-white/5'
                    }`} />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 right-10 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => onDeleteHabit(habit.id)} className="p-3 rounded-2xl bg-black border border-white/10 text-slate-700 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
