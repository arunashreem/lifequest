
import React from 'react';
import { Task } from '../types';
import { Sparkles, CheckCircle2, Plus } from 'lucide-react';
import QuestCard from './QuestCard';

interface SideQuestListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onFocus?: (task: Task) => void;
  onQuickAdd?: () => void;
}

const SideQuestList: React.FC<SideQuestListProps> = ({ tasks, onComplete, onDelete, onFocus, onQuickAdd }) => {
  const sideQuests = tasks.filter(t => t.isSideQuest && !t.completed);

  return (
    <div className="rpg-card rounded-[3rem] p-6 md:p-8 border-emerald-500/20 bg-gradient-to-br from-slate-950 to-emerald-950/10 h-full flex flex-col shadow-2xl min-h-[500px]">
      <div className="flex items-center justify-between mb-8 shrink-0 flex-wrap gap-4">
        <h3 className="flex items-center gap-3 text-xs md:text-sm font-black text-emerald-400 uppercase tracking-[0.4em]">
          <Sparkles size={18} className="animate-pulse" />
          Bonus Checklist
        </h3>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
            <span className="text-[8px] font-black text-emerald-400 tracking-widest uppercase">+25% XP BUFF</span>
          </div>
          {onQuickAdd && (
            <button 
              onClick={onQuickAdd}
              className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/30"
              title="Add Side Quest"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pt-10 pr-2 -mr-2 no-scrollbar">
        {sideQuests.length > 0 ? (
          sideQuests.map(quest => (
            <div key={quest.id} className="animate-in slide-in-from-right-4 duration-500">
              <QuestCard 
                task={quest} 
                onComplete={onComplete} 
                onDelete={onDelete} 
                onFocus={() => onFocus?.(quest)}
              />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30 border-4 border-dashed border-emerald-500/10 rounded-[2.5rem]">
            <CheckCircle2 size={40} className="text-emerald-500 mb-4" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">All Side Quests Cleared!</p>
            <p className="text-[8px] text-slate-700 uppercase tracking-widest mt-2">The Oracle is pleased.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideQuestList;
