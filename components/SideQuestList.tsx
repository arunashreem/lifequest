
import React from 'react';
import { Task } from '../types';
import { Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface SideQuestListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
}

const SideQuestList: React.FC<SideQuestListProps> = ({ tasks, onComplete }) => {
  const sideQuests = tasks.filter(t => t.isSideQuest && !t.completed);

  return (
    <div className="rpg-card rounded-2xl p-6 border-slate-800 bg-gradient-to-br from-slate-900 to-emerald-950/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <Sparkles size={16} />
          Side Quest Bonus List
        </h3>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">+25% BONUS XP</span>
      </div>

      <div className="space-y-3">
        {sideQuests.length > 0 ? sideQuests.map(quest => (
          <button 
            key={quest.id}
            onClick={() => onComplete(quest.id)}
            className="flex items-center gap-3 w-full p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-left hover:border-emerald-500/50 group transition-all"
          >
            <div className="text-slate-600 group-hover:text-emerald-500 transition-colors">
              <Circle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white leading-tight">{quest.title}</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Reward: {Math.floor(quest.xpValue * 1.25)} XP</p>
            </div>
          </button>
        )) : (
          <p className="text-center text-xs text-slate-600 py-4 font-bold uppercase">All Side Quests Cleared!</p>
        )}
      </div>
    </div>
  );
};

export default SideQuestList;
