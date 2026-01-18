
import React from 'react';
import { Task, Difficulty } from '../types';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from '../constants';
import { CheckCircle2, Circle, Trophy, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface QuestCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ task, onComplete, onDelete }) => {
  return (
    <div className={`group relative rpg-card p-6 md:p-8 rounded-[2.8rem] transition-all duration-500 active:scale-[0.98] border-white/[0.05] ring-1 ring-white/5 ${
      task.completed ? 'opacity-40 grayscale pointer-events-none' : 'hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/40'
    }`}>
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-indigo-500/[0.02] rounded-[2.8rem] pointer-events-none" />
      
      <div className="flex items-center gap-6 md:gap-8 relative z-10">
        <button 
          onClick={() => onComplete(task.id)}
          className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-[1.6rem] flex items-center justify-center transition-all duration-500 border-2 shadow-2xl ${
            task.completed 
              ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300' 
              : 'bg-slate-950/80 border-slate-800 text-slate-600 hover:border-blue-400 hover:text-blue-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]'
          }`}
        >
          {task.completed ? <CheckCircle2 size={32} /> : <Circle size={32} className="group-hover:scale-110 transition-transform" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-950/80 rounded-xl border border-white/10 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all">
              {CATEGORY_ICONS[task.category]}
            </div>
            <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border tracking-[0.2em] uppercase shadow-sm ${DIFFICULTY_COLORS[task.difficulty]}`}>
              {task.difficulty}
            </span>
            {task.isBoss && <Sparkles size={12} className="text-yellow-400 animate-pulse" />}
          </div>
          
          <h4 className={`text-xl md:text-2xl font-black tracking-tight leading-tight mb-4 ${task.completed ? 'line-through text-slate-600' : 'text-white group-hover:text-blue-300 transition-colors'}`}>
            {task.title}
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[9px] text-blue-300 font-black uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-400/20 shadow-lg">
                <Trophy size={14} className="text-blue-400" />
                +{task.xpValue} XP
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[9px] text-yellow-300 font-black uppercase tracking-widest bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-400/20 shadow-lg">
                +{task.goldValue} GOLD
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-4 text-slate-700 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-2xl shrink-0"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Decorative side indicator */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-blue-400">
        <ArrowRight size={24} />
      </div>
    </div>
  );
};

export default QuestCard;
