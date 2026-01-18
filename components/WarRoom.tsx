
import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { ShieldAlert, Flame, CheckCircle2, Circle, Clock, Sword, Plus, Wand2, Loader2, Trophy, Send, X, Calendar } from 'lucide-react';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../constants';
import { evaluateGrindSession } from '../services/gemini';

interface WarRoomProps {
  tasks: Task[];
  onCompleteSubTask: (taskId: string, subTaskId: string) => void;
  onCompleteTask: (id: string) => void;
  onAddTime: (taskId: string, mins: number) => void;
  onManualXpAward: (xp: number, message: string) => void;
  onAddBoss: (title: string, dueDate: string) => void;
}

const WarRoom: React.FC<WarRoomProps> = ({ tasks, onCompleteSubTask, onCompleteTask, onAddTime, onManualXpAward, onAddBoss }) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAddBoss, setShowAddBoss] = useState(false);
  const [grindInput, setGrindInput] = useState('');
  
  // New Boss Form State
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
      setGrindInput('');
      setShowPrompt(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCreateBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBossTitle.trim() || !newBossDate) return;
    onAddBoss(newBossTitle, newBossDate);
    setNewBossTitle('');
    setNewBossDate('');
    setShowAddBoss(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500 relative">
      {/* Manual Grind Entry Modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowPrompt(false)} />
          <div className="relative w-full max-w-lg rpg-card p-8 rounded-[2rem] border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-500">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">The Oracle's Inquiry</h3>
            <p className="text-slate-400 text-sm mb-6 font-bold italic">"Speak, Hero. What legendary grind have you conquered this cycle?"</p>
            
            <form onSubmit={handleManualGrind} className="space-y-4">
              <textarea 
                value={grindInput}
                onChange={e => setGrindInput(e.target.value)}
                autoFocus
                placeholder="E.g. I did some quality work on my English assessment..."
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:border-blue-500 outline-none h-32 resize-none transition-all"
              />
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowPrompt(false)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Retreat
                </button>
                <button 
                  type="submit" 
                  disabled={isEvaluating || !grindInput.trim()}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isEvaluating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Submit for Judgment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Boss Modal */}
      {showAddBoss && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowAddBoss(false)} />
          <div className="relative w-full max-w-lg rpg-card p-10 rounded-[3rem] border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert size={140} className="text-red-500" />
            </div>
            
            <button onClick={() => setShowAddBoss(false)} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-all"><X size={24} /></button>
            
            <div className="relative z-10 space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Plus size={32} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Forge Boss Raid</h3>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mt-2">Scribe a Major Objective</p>
              </div>

              <form onSubmit={handleCreateBoss} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Raid Designation</label>
                  <input 
                    type="text" 
                    value={newBossTitle}
                    onChange={e => setNewBossTitle(e.target.value)}
                    autoFocus
                    placeholder="E.g. Term 1 History Dissertation"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-5 text-white focus:border-red-500 outline-none transition-all shadow-inner"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Timeline Culmination</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500 opacity-40" size={20} />
                    <input 
                      type="date" 
                      value={newBossDate}
                      onChange={e => setNewBossDate(e.target.value)}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl pl-16 pr-6 py-5 text-white focus:border-red-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={!newBossTitle.trim() || !newBossDate}
                    className="w-full py-5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-30 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-900/40 transition-all active:scale-95"
                  >
                    Seal the Vow
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Planner / Boss Raids */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Boss Raids</h2>
              <p className="text-slate-400 text-sm">Major assessments and projects. Complete all phases to win.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddBoss(true)}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-red-600 border border-slate-800 hover:border-red-400 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Plus size={18} className="text-red-500 group-hover:text-white" />
            Forge Raid
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bosses.length > 0 ? bosses.map(boss => (
            <div key={boss.id} className="rpg-card rounded-2xl p-6 border-red-900/30 bg-gradient-to-br from-slate-900 to-red-950/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={120} className="text-red-500" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[boss.difficulty]}`}>
                      {boss.difficulty} BOSS
                    </span>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                      DUE: {new Date(boss.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-red-400 transition-colors">{boss.title}</h3>
                  
                  {/* Phases/Subtasks */}
                  <div className="space-y-3 mt-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Raid Phases</p>
                    {boss.subTasks?.map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => onCompleteSubTask(boss.id, sub.id)}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border transition-all bg-slate-950/50 border-slate-800 text-slate-300 hover:border-red-500/50 hover:bg-red-500/5"
                        style={sub.completed ? { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(51, 65, 85, 1)', color: 'rgba(100, 116, 139, 1)' } : {}}
                      >
                        {sub.completed ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} />}
                        <span className={`text-sm font-bold ${sub.completed ? 'line-through' : ''}`}>{sub.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:w-48 flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800 text-center shrink-0">
                   <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Victory Loot</p>
                    <p className="text-2xl font-black text-yellow-500">+{boss.xpValue} XP</p>
                    <p className="text-lg font-black text-yellow-600">+{boss.goldValue} G</p>
                   </div>
                   <button 
                    onClick={() => onCompleteTask(boss.id)}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/20"
                   >
                    Finish Raid
                   </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-16 text-center rpg-card border-dashed border-slate-800 rounded-[2.5rem] opacity-40 max-w-3xl mx-auto w-full">
              <Sword size={48} className="mx-auto mb-6 text-slate-600" />
              <p className="pixel-font text-[11px] tracking-widest text-slate-500 uppercase">No Boss Raids detected.</p>
            </div>
          )}
        </div>
      </section>

      {/* Work Tracker / Grind Zone */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">The Grind Zone</h2>
              <p className="text-slate-400 text-sm">Track effort on focused work. Earn bonus XP for every 30 mins.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowPrompt(true)}
            className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
            Declare Grind Victory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workInProgress.map(task => (
            <div key={task.id} className="rpg-card p-4 rounded-2xl border-blue-900/20 flex justify-between items-center group transition-all hover:border-blue-500/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                  {CATEGORY_ICONS[task.category] || <Clock size={18} />}
                </div>
                <div>
                  <h4 className="font-black text-white text-sm uppercase">{task.title}</h4>
                  <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.15em]">
                    Time Invested: {task.timeSpent || 0}m
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onAddTime(task.id, 15)}
                  className="p-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1 border border-slate-700"
                >
                  <Plus size={14} />
                  <span className="text-[9px] font-black uppercase">15m</span>
                </button>
                <button 
                  onClick={() => onCompleteTask(task.id)}
                  className="p-2 bg-slate-800 hover:bg-green-600 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700"
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {workInProgress.length === 0 && (
             <div className="md:col-span-2 py-10 text-center bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[2rem] opacity-40 max-w-3xl mx-auto w-full">
               <p className="pixel-font text-[11px] tracking-widest text-slate-500 uppercase">No Active Grinds.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WarRoom;
