
import React from 'react';
import { Task, Difficulty, TaskCategory } from '../types';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from '../constants';
import { CheckCircle2, Circle, Trophy, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface QuestCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ task, onComplete, onDelete }) => {
  const getCategoryTheme = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.FITNESS: return 'border-red-500/50 bg-gradient-to-br from-red-600/20 to-orange-600/10 text-red-400';
      case TaskCategory.STUDY: 
      case TaskCategory.SCHOOL: 
      case TaskCategory.HOMEWORK: return 'border-cyan-500/50 bg-gradient-to-br from-blue-600/20 to-cyan-600/10 text-cyan-400';
      case TaskCategory.MINDFULNESS: return 'border-lime-500/50 bg-gradient-to-br from-emerald-600/20 to-lime-600/10 text-lime-400';
      case TaskCategory.CHORES: return 'border-orange-500/50 bg-gradient-to-br from-orange-600/20 to-yellow-600/10 text-orange-400';
      default: return 'border-slate-500/50 bg-gradient-to-br from-slate-600/20 to-slate-800/10 text-slate-400';
    }
  };

  const theme = getCategoryTheme(task.category);

  return (
    <div className={`group relative rpg-card p-8 md:p-12 rounded-[3.5rem] border-white/10 active:scale-[0.98] ${
      task.completed ? 'opacity-20 grayscale pointer-events-none' : 'hover:-translate-y-4 hover:shadow-[0_40px_100px_rgba(0,0,0,1)]'
    }`}>
      {/* Intense Background Aura */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-transparent to-black/80`} />
      
      <div className="flex items-center gap-10 relative z-10">
        <button 
          onClick={() => onComplete(task.id)}
          className={`shrink-0 w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 border-4 shadow-2xl relative group/btn ${
            task.completed 
              ? 'bg-emerald-600 border-emerald-400 text-white' 
              : 'bg-black border-white/10 text-slate-700 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_40px_rgba(0,242,255,0.6)]'
          }`}
        >
          {task.completed ? <CheckCircle2 size={40} /> : <Circle size={40} className="group-hover:scale-125 transition-transform" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-5">
            <div className={`p-3 rounded-2xl bg-black border border-white/20 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-2xl`}>
              {CATEGORY_ICONS[task.category]}
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border tracking-[0.4em] uppercase shadow-lg ${DIFFICULTY_COLORS[task.difficulty]}`}>
                {task.difficulty}
              </span>
              {task.isBoss && <span className="text-[8px] font-black text-red-500 uppercase mt-2 tracking-[0.5em] animate-pulse">BOSS RAID ALERT</span>}
            </div>
          </div>
          
          <h4 className={`text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-6 break-words ${task.completed ? 'line-through text-slate-700' : 'text-white group-hover:text-cyan-400 transition-colors duration-500'}`}>
            {task.title}
          </h4>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em] bg-cyan-500/10 px-5 py-2.5 rounded-2xl border border-cyan-500/30 shadow-2xl">
              <Trophy size={16} /> +{task.xpValue} XP
            </div>
            <div className="flex items-center gap-3 text-[10px] text-yellow-400 font-black uppercase tracking-[0.3em] bg-yellow-500/10 px-5 py-2.5 rounded-2xl border border-yellow-500/30 shadow-2xl">
              <Sparkles size={16} /> +{task.goldValue} GP
            </div>
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-6 text-slate-800 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-[2rem] shrink-0"
        >
          <Trash2 size={28} />
        </button>
      </div>

      {/* Holographic underline decoration */}
      <div className="absolute bottom-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-1000 shadow-[0_0_15px_rgba(0,242,255,1)]" />
    </div>
  );
};

export default QuestCard;
