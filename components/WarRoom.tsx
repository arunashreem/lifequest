
import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { ShieldAlert, Flame, CheckCircle2, Circle, Clock, Sword, Plus, Wand2, Loader2, Trophy, Send, X, Calendar, Activity, Zap, Edit2 } from 'lucide-react';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../constants';
import { evaluateGrindSession } from '../services/gemini';

interface WarRoomProps {
  tasks: Task[];
  onCompleteSubTask: (taskId: string, subTaskId: string) => void;
  onCompleteTask: (id: string) => void;
  onAddTime: (taskId: string, mins: number) => void;
  onManualXpAward: (xp: number, message: string) => void;
  onAddBoss: (title: string, dueDate: string) => void;
  onUpdateBoss: (id: string, updates: Partial<Task>) => void;
}

const WarRoom: React.FC<WarRoomProps> = ({ tasks, onCompleteSubTask, onCompleteTask, onAddTime, onManualXpAward, onAddBoss, onUpdateBoss }) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAddBoss, setShowAddBoss] = useState(false);
  const [editingBoss, setEditingBoss] = useState<Task | null>(null);
  const [grindInput, setGrindInput] = useState('');
  const [newBossTitle, setNewBossTitle] = useState('');
  const [newBossDate, setNewBossDate] = useState('');

  const bosses = tasks.filter(t => t.isBoss && !t.completed);
  const workInProgress = tasks.filter(t => (t.category === TaskCategory.WORK || t.category === TaskCategory.STUDY || t.category === TaskCategory.HOMEWORK) && !t.completed && !t.isBoss);

  const handleManualGrind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grindInput.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateGrindSession(grindInput);
      onManualXpAward(result.xp, result.feedback);
      setGrindInput(''); setShowPrompt(false);
    } catch (e) { console.error(e); } finally { setIsEvaluating(false); }
  };

  const handleForgeBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBossTitle.trim() || !newBossDate) return;
    onAddBoss(newBossTitle, newBossDate);
    setNewBossTitle('');
    setNewBossDate('');
    setShowAddBoss(false);
  };

  const handleUpdateExistingBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoss || !newBossTitle.trim() || !newBossDate) return;
    onUpdateBoss(editingBoss.id, { 
      title: newBossTitle, 
      dueDate: new Date(newBossDate).toISOString() 
    });
    setEditingBoss(null);
    setNewBossTitle('');
    setNewBossDate('');
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-fuchsia">Tactical Operations</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-fuchsia-600 animate-pulse" /> 
            Orchestrating High-Value Strikes and Boss Raid Protocol
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
           <div className="flex items-center justify-between px-4">
              <h3 className="text-[12px] font-black text-fuchsia-600 uppercase tracking-[0.5em] flex items-center gap-4"><ShieldAlert size={20} /> Active Boss Raids</h3>
              <button onClick={() => { setNewBossTitle(''); setNewBossDate(''); setShowAddBoss(true); }} className="p-4 bg-slate-900 border-2 border-white/5 rounded-2xl text-fuchsia-600 hover:text-white hover:bg-fuchsia-600 transition-all shadow-md"><Plus size={24} /></button>
           </div>
           
           <div className="space-y-8">
             {bosses.map(boss => (
               <div key={boss.id} className="rpg-card rounded-[4rem] p-10 md:p-14 border-fuchsia-500/20 bg-black/60 shadow-xl group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Flame size={180} className="text-fuchsia-600" /></div>
                 
                 <button 
                  onClick={() => {
                    setEditingBoss(boss);
                    setNewBossTitle(boss.title);
                    setNewBossDate(new Date(boss.dueDate).toISOString().split('T')[0]);
                  }}
                  className="absolute top-8 right-8 p-3 bg-white/5 border border-white/10 rounded-xl text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                 >
                   <Edit2 size={16} />
                 </button>

                 <div className="relative z-10 space-y-10">
                   <div>
                     <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1 bg-fuchsia-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-md">BOSS RAID</span>
                        <span className="text-[10px] font-bold text-fuchsia-500/60 uppercase tracking-[0.3em]">TARGET DATE: {new Date(boss.dueDate).toLocaleDateString()}</span>
                     </div>
                     <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic glow-text-fuchsia">{boss.title}</h4>
                   </div>
                   <div className="space-y-4">
                      {boss.subTasks?.map(sub => (
                        <button key={sub.id} onClick={() => onCompleteSubTask(boss.id, sub.id)} className={`w-full flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all ${sub.completed ? 'bg-black/40 border-white/5 opacity-40' : 'bg-black/60 border-white/10 hover:border-fuchsia-500/40'}`}>
                          {sub.completed ? <CheckCircle2 className="text-emerald-500" size={24} /> : <Circle className="text-slate-700" size={24} />}
                          <span className={`text-xl font-black uppercase tracking-tight ${sub.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>{sub.title}</span>
                        </button>
                      ))}
                   </div>
                   <button onClick={() => onCompleteTask(boss.id)} className="w-full py-6 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-lg transition-all active:scale-95">EXECUTE FINAL STRIKE</button>
                 </div>
               </div>
             ))}
             {bosses.length === 0 && (
               <div className="py-20 text-center border-4 border-dashed border-white/5 rounded-[4rem] opacity-40">
                 <ShieldAlert size={48} className="mx-auto mb-4 text-slate-800" />
                 <p className="pixel-font text-[10px] uppercase tracking-widest text-slate-700">No active raids. All sectors secure.</p>
               </div>
             )}
           </div>
        </div>

        <div className="space-y-10">
           <div className="flex items-center justify-between px-4">
              <h3 className="text-[12px] font-black text-sky-500 uppercase tracking-[0.5em] flex items-center gap-4"><Zap size={20} /> The Grind Zone</h3>
              <button onClick={() => setShowPrompt(true)} className="px-8 py-4 bg-sky-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-sky-500 transition-all">Declare Victory</button>
           </div>

           <div className="space-y-6">
              {workInProgress.map(task => (
                <div key={task.id} className="rpg-card rounded-[3.5rem] p-8 border-white/5 bg-slate-950/40 flex items-center justify-between group transition-all hover:border-sky-500/40 shadow-md">
                   <div className="flex items-center gap-8">
                      <div className="p-6 bg-black rounded-[2rem] border border-white/10 text-sky-400 group-hover:scale-110 transition-transform shadow-sm">{CATEGORY_ICONS[task.category] || <Clock size={28} />}</div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-3">{task.title}</h4>
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SESSION TIME: {task.timeSpent || 0} MINS</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => onAddTime(task.id, 15)} className="w-16 h-16 rounded-2xl bg-black border-2 border-white/10 flex items-center justify-center text-slate-600 hover:text-sky-400 hover:border-sky-500/40 transition-all"><Plus size={24} /></button>
                      <button onClick={() => onCompleteTask(task.id)} className="w-16 h-16 rounded-2xl bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white transition-all shadow-lg active:scale-95"><CheckCircle2 size={24} /></button>
                   </div>
                </div>
              ))}
              {workInProgress.length === 0 && (
                <div className="py-20 text-center border-4 border-dashed border-white/5 rounded-[4rem] opacity-40">
                  <Zap size={48} className="mx-auto mb-4 text-slate-800" />
                  <p className="pixel-font text-[10px] uppercase tracking-widest text-slate-700">Grind required. Transcribe some lore.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Manual Evaluation Modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => setShowPrompt(false)} />
          <div className="relative w-full max-w-2xl bg-black border-2 border-sky-500/40 p-12 md:p-16 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300 overflow-hidden ring-1 ring-white/10">
             <div className="text-center space-y-10">
                <div className="space-y-4">
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic glow-text-blue leading-none">Declare Victory</h3>
                   <p className="text-sky-400 text-[11px] font-black uppercase tracking-[0.6em]">Submit your progress to the Oracle for XP Evaluation</p>
                </div>
                <form onSubmit={handleManualGrind} className="space-y-8">
                  <textarea 
                    value={grindInput} 
                    onChange={e => setGrindInput(e.target.value)} 
                    placeholder="Scribe what you have accomplished in this session..." 
                    className="w-full bg-[#050508] border-2 border-white/5 rounded-3xl p-8 text-lg text-white focus:border-sky-500 outline-none h-48 resize-none placeholder:text-slate-800 shadow-inner transition-all"
                  />
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setShowPrompt(false)} className="flex-1 py-6 bg-slate-900 text-slate-500 font-black text-xs uppercase tracking-widest rounded-3xl border border-white/5 hover:text-white transition-colors">Abort</button>
                    <button type="submit" disabled={isEvaluating} className="flex-[2] py-6 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                      {isEvaluating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      {isEvaluating ? 'Oracle Analyzing...' : 'Transmit Success'}
                    </button>
                  </div>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* Add/Edit Boss Raid Modal */}
      {(showAddBoss || editingBoss) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => { setShowAddBoss(false); setEditingBoss(null); }} />
          <div className="relative w-full max-w-2xl bg-black border-2 border-fuchsia-500/40 p-12 md:p-16 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300 overflow-hidden ring-1 ring-white/10">
             <div className="text-center space-y-10">
                <div className="space-y-4">
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic glow-text-fuchsia leading-none">{editingBoss ? 'Recalibrate Raid' : 'Declare Raid'}</h3>
                   <p className="text-fuchsia-400 text-[11px] font-black uppercase tracking-[0.6em]">{editingBoss ? 'Adjusting target vector' : 'Identifying a major academic boss'}</p>
                </div>
                <form onSubmit={editingBoss ? handleUpdateExistingBoss : handleForgeBoss} className="space-y-8">
                  <div className="space-y-6">
                    <input 
                      type="text" 
                      value={newBossTitle} 
                      onChange={e => setNewBossTitle(e.target.value)} 
                      autoFocus 
                      placeholder="Boss Designation..." 
                      className="w-full bg-[#050508] border-2 border-white/5 rounded-3xl px-8 py-6 text-xl text-white focus:border-fuchsia-500 outline-none transition-all placeholder:text-slate-800 shadow-inner" 
                    />
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block text-left ml-6">Siege Date (Deadline)</label>
                      <input 
                        type="date" 
                        value={newBossDate} 
                        onChange={e => setNewBossDate(e.target.value)} 
                        className="w-full bg-[#050508] border-2 border-white/5 rounded-3xl px-8 py-6 text-white focus:border-fuchsia-500 outline-none shadow-inner" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => { setShowAddBoss(false); setEditingBoss(null); }} className="flex-1 py-6 bg-slate-900 text-slate-500 font-black text-xs uppercase tracking-widest rounded-3xl border border-white/5 hover:text-white transition-colors">Abort</button>
                    <button type="submit" className="flex-[2] py-6 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl active:scale-95">
                      {editingBoss ? 'Commit Changes' : 'Initialize Raid Sequence'}
                    </button>
                  </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WarRoom;
