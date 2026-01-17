
import React from 'react';
import { Task, Difficulty } from '../types';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from '../constants';
import { CheckCircle2, Circle, Trophy, Trash2, ArrowRight } from 'lucide-react';

interface QuestCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ task, onComplete, onDelete }) => {
  return (
    <div className={`group relative rpg-card p-5 rounded-[2rem] border-l-0 transition-all active:scale-[0.98] ${
      task.completed ? 'opacity-40 grayscale pointer-events-none' : 'hover:-translate-y-1'
    }`}>
      {/* Background Accent Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-[2rem] pointer-events-none" />
      
      <div className="flex items-center gap-5 relative z-10">
        <button 
          onClick={() => onComplete(task.id)}
          className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
            task.completed 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
              : 'bg-slate-950/50 border-slate-800 text-slate-600 hover:border-blue-500 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          }`}
        >
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} className="group-hover:scale-110 transition-transform" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
              {CATEGORY_ICONS[task.category]}
            </div>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border tracking-widest uppercase ${DIFFICULTY_COLORS[task.difficulty]}`}>
              {task.difficulty}
            </span>
          </div>
          
          <h4 className={`text-base font-black tracking-tight leading-tight mb-3 ${task.completed ? 'line-through text-slate-500' : 'text-white group-hover:text-blue-200 transition-colors'}`}>
            {task.title}
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-black uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                <Trophy size={12} />
                +{task.xpValue} XP
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-yellow-500 font-black uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                Loot Gold
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-700 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Hover Arrow Indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all text-blue-500/50">
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

export default QuestCard;
