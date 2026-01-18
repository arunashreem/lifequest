
import React, { useState } from 'react';
import { Task, Milestone } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { ChevronLeft, ChevronRight, Plus, Flag, X, Trash2, Sparkles, Calendar as CalendarIcon, Medal, RefreshCw } from 'lucide-react';

interface AdventurerCalendarProps {
  tasks: Task[];
  milestones: Milestone[];
  onAddMilestone: (title: string, date: string, category: Milestone['category'], isYearly?: boolean) => void;
  onDeleteMilestone: (id: string) => void;
}

const AdventurerCalendar: React.FC<AdventurerCalendarProps> = ({ tasks, milestones = [], onAddMilestone, onDeleteMilestone }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneCat, setNewMilestoneCat] = useState<Milestone['category']>('EVENT');
  const [isYearly, setIsYearly] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const startOffset = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getMilestonesForDay = (date: Date) => {
    return (milestones || []).filter(m => {
      const mDate = new Date(m.date);
      // Yearly logic: check if day and month match
      if (m.isYearly) {
        return mDate.getDate() === date.getDate() && mDate.getMonth() === date.getMonth();
      }
      return mDate.toDateString() === date.toDateString();
    });
  };

  const handleDayClick = (date: Date) => {
    setNewMilestoneDate(date.toISOString().split('T')[0]);
    setShowAddMilestone(true);
  };

  const handleForgeMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newMilestoneDate) return;
    onAddMilestone(newMilestoneTitle, newMilestoneDate, newMilestoneCat, isYearly);
    setNewMilestoneTitle('');
    setIsYearly(false);
    setShowAddMilestone(false);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 relative">
      {/* Milestone Scribing Modal - REFINED UI */}
      {showAddMilestone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowAddMilestone(false)} />
          <div className="relative w-full max-w-lg bg-[#020617] border border-cyan-500/40 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(34,211,238,0.15)] animate-in zoom-in-95 duration-500 overflow-hidden ring-1 ring-white/10">
            <button onClick={() => setShowAddMilestone(false)} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-all"><X size={24} /></button>
            
            <div className="relative z-10 space-y-10">
              <div className="text-center space-y-2">
                <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">FORGE MILESTONE</h3>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.6em]">Mark a Point of Destiny</p>
              </div>

              <form onSubmit={handleForgeMilestone} className="space-y-8 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Designation</label>
                  <input 
                    type="text" value={newMilestoneTitle} onChange={e => setNewMilestoneTitle(e.target.value)} autoFocus placeholder="E.g. Great Siege of Finals"
                    className="w-full bg-slate-950 border border-cyan-500/50 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Temporal Node</label>
                    <div className="relative">
                      <input 
                        type="date" value={newMilestoneDate} onChange={e => setNewMilestoneDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none text-sm"
                      />
                      <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={newMilestoneCat} onChange={e => setNewMilestoneCat(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none text-sm"
                    >
                      <option value="EVENT">Generic Event</option>
                      <option value="ACHIEVEMENT">Achievement</option>
                      <option value="DEADLINE">Crucial Deadline</option>
                      <option value="HOLIDAY">Holiday / Break</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Temporal Frequency</label>
                  <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
                    <button 
                      type="button"
                      onClick={() => setIsYearly(false)}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!isYearly ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      One-Time Event
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsYearly(true)}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isYearly ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      <RefreshCw size={12} className={isYearly ? 'animate-spin-slow' : ''} />
                      Yearly Repeat
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={!newMilestoneTitle.trim() || !newMilestoneDate} className="w-full py-5 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 disabled:opacity-20 text-blue-100 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 border border-white/5">
                    SEAL MARKER
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">The Monthly Battle Map</h2>
          <div className="flex items-center gap-2 mt-2">
            <CalendarIcon size={16} className="text-blue-500 animate-pulse" />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing temporal nodes and upcoming raids.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddMilestone(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-400 rounded-xl text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all shadow-xl active:scale-95">
            <Plus size={16} className="text-cyan-500 group-hover:text-white" /> Forge Marker
          </button>
          
          <div className="flex items-center gap-4 bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-800 shadow-2xl">
            <button onClick={handlePrevMonth} className="p-3 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={20} /></button>
            <span className="pixel-font text-[10px] text-blue-400 min-w-[150px] text-center uppercase tracking-widest">{monthYear}</span>
            <button onClick={handleNextMonth} className="p-3 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[11px] font-black text-slate-600 uppercase py-4 tracking-[0.3em]">{day}</div>
        ))}
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="h-32 md:h-44 bg-slate-950/20 rounded-3xl border border-slate-900/50 opacity-40" />;
          
          const isToday = date.toDateString() === new Date().toDateString();
          const dayTasks = getTasksForDay(date);
          const dayMilestones = getMilestonesForDay(date);
          const hasUncompleted = dayTasks.some(t => !t.completed);
          const hasMilestones = dayMilestones.length > 0;

          return (
            <div 
              key={idx} 
              onClick={() => handleDayClick(date)}
              className={`group h-32 md:h-44 rpg-card rounded-3xl p-3 flex flex-col transition-all overflow-hidden border-t-4 relative cursor-pointer ${
                isToday ? 'border-t-blue-500 bg-slate-900 ring-4 ring-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-t-slate-800 hover:border-t-cyan-500/50'
              } ${dayTasks.length > 0 && !hasUncompleted && !hasMilestones ? 'opacity-30 grayscale' : ''} ${hasMilestones ? 'ring-2 ring-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[12px] font-black ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>{date.getDate()}</span>
                {isToday && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />}
                <Plus size={14} className="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity" />
              </div>
              
              <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar relative">
                {dayMilestones.map(m => (
                  <div key={m.id} className={`group/milestone relative flex items-center gap-2 p-2 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-lg ${m.isYearly ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200'}`}>
                    {m.isYearly ? <RefreshCw size={10} className="text-cyan-400 shrink-0" /> : <Flag size={10} className="text-yellow-400 shrink-0" />}
                    <span className="truncate">{m.title}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteMilestone(m.id); }}
                      className="absolute right-1 opacity-0 group-hover/milestone:opacity-100 p-0.5 hover:text-red-400"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`text-[9px] p-2 rounded-xl border flex items-center gap-2 truncate shadow-sm ${
                      task.completed 
                        ? 'bg-slate-900 border-slate-800 text-slate-600 line-through opacity-60' 
                        : task.isBoss ? 'bg-red-900/20 border-red-500/40 text-red-300' : 'bg-blue-900/20 border-blue-500/40 text-blue-300'
                    }`}
                  >
                    <div className={`shrink-0 ${task.completed ? 'opacity-30' : ''}`}>{CATEGORY_ICONS[task.category]}</div>
                    <span className="truncate font-bold">{task.title}</span>
                  </div>
                ))}
              </div>

              {dayTasks.length + dayMilestones.length > 3 && (
                <div className="absolute bottom-2 right-3 text-[8px] font-black text-blue-500 bg-slate-950/80 px-1.5 py-0.5 rounded-full shadow-lg border border-white/5">+ MORE</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="rpg-card p-6 rounded-[2.5rem] border-slate-800 bg-slate-900/20 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center">
        {[
          { icon: <Flag size={14} />, color: 'text-yellow-400', label: 'One-Time Milestone' },
          { icon: <RefreshCw size={14} />, color: 'text-cyan-400', label: 'Yearly Repeat' },
          { icon: <Medal size={14} />, color: 'text-red-400', label: 'Boss Raid Due' },
          { icon: <CalendarIcon size={14} />, color: 'text-cyan-400', label: 'Today\'s Node' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 bg-slate-950/60 rounded-2xl border border-white/5">
            <div className={item.color}>{item.icon}</div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdventurerCalendar;
