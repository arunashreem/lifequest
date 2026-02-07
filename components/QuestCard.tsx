
import React from 'react';
import { Task, Difficulty, TaskCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { CheckCircle2, Circle, Trophy, Trash2, Rocket, Sparkles, Sword } from 'lucide-react';

interface QuestCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onFocus?: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ task, onComplete, onDelete, onFocus }) => {
  const isCompleted = task.completed;

  return (
    <div className={`group relative flex items-start gap-4 p-3 md:p-4 rounded-2xl border transition-all duration-300 ${
      isCompleted 
        ? 'bg-black/20 border-white/5 opacity-40 grayscale pointer-events-none' 
        : 'bg-slate-950/40 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/60 hover:shadow-xl'
    }`}>
      {/* Checkbox Pillar */}
      <button 
        onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border-2 mt-0.5 ${
          isCompleted 
            ? 'bg-emerald-600 border-emerald-500 text-white' 
            : 'bg-black border-white/20 text-slate-700 group-hover:border-cyan-400 group-hover:text-cyan-400'
        }`}
      >
        {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-sm bg-current opacity-20 group-hover:opacity-100 transition-opacity" />}
      </button>

      {/* Info Block */}
      <div className="flex-1 min-w-0 flex items-start gap-4">
        <div className={`p-1.5 rounded-md bg-black border border-white/10 shrink-0 hidden sm:block mt-0.5 ${isCompleted ? 'opacity-20' : 'text-slate-400 group-hover:text-cyan-400 transition-colors'}`}>
          {React.cloneElement(CATEGORY_ICONS[task.category] as React.ReactElement<any>, { size: 14 })}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm md:text-base font-bold tracking-tight break-words transition-all duration-300 ${
            isCompleted ? 'line-through text-slate-700' : 'text-slate-100 group-hover:text-white'
          }`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
             <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/5 bg-black/40 shrink-0 ${
               task.difficulty === Difficulty.EASY ? 'text-emerald-500' : 
               task.difficulty === Difficulty.MEDIUM ? 'text-blue-500' : 
               task.difficulty === Difficulty.HARD ? 'text-orange-500' : 'text-red-500'
             }`}>
               {task.difficulty}
             </span>
             <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                <div className="flex items-center gap-1 text-[9px] font-black text-cyan-400 uppercase tracking-tighter italic">
                  <Trophy size={10} /> +{task.xpValue}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <div className="flex items-center gap-1 text-[9px] font-black text-yellow-500 uppercase tracking-tighter italic">
                  <Sparkles size={10} /> +{task.goldValue}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Action Pillar */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1 shrink-0 mt-0.5">
        {!isCompleted && onFocus && (
          <button 
            onClick={(e) => { e.stopPropagation(); onFocus(); }}
            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Focus"
          >
            <Rocket size={14} />
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default QuestCard;
