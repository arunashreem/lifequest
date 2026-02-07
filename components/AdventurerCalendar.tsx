
import React, { useState, useMemo } from 'react';
import { Task, Milestone } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { ChevronLeft, ChevronRight, Plus, Flag, X, Trash2, Sparkles, Calendar as CalendarIcon, Medal, RefreshCw, Map, Landmark, Activity, CheckCircle2, Skull } from 'lucide-react';

interface AdventurerCalendarProps {
  tasks: Task[];
  milestones: Milestone[];
  onAddMilestone: (title: string, date: string, category: Milestone['category'], isYearly?: boolean) => void;
  onDeleteMilestone: (id: string) => void;
  onToggleMilestone: (id: string) => void;
}

const NSW_PUBLIC_HOLIDAYS_2025 = [
  { date: '2025-01-01', title: "New Year's Day" },
  { date: '2025-01-26', title: "Australia Day" },
  { date: '2025-04-18', title: "Good Friday" },
  { date: '2025-04-21', title: "Easter Monday" },
  { date: '2025-04-25', title: "Anzac Day" },
  { date: '2025-06-09', title: "King's Birthday" },
  { date: '2025-10-06', title: "Labour Day" },
  { date: '2025-12-25', title: "Christmas Day" },
  { date: '2025-12-26', title: "Boxing Day" },
];

const AdventurerCalendar: React.FC<AdventurerCalendarProps> = ({ tasks, milestones = [], onAddMilestone, onDeleteMilestone, onToggleMilestone }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneCat, setNewMilestoneCat] = useState<Milestone['category']>('EVENT');
  const [isYearly, setIsYearly] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const calendarDays = Array.from({ length: totalDays }, (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1));

  const formatDateToLocalISO = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDayClick = (e: React.MouseEvent, date: Date) => {
    if (e.target === e.currentTarget) {
      setNewMilestoneDate(formatDateToLocalISO(date));
      setShowAddMilestone(true);
    }
  };

  const handleForgeMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newMilestoneDate) return;
    onAddMilestone(newMilestoneTitle, newMilestoneDate, newMilestoneCat, isYearly);
    setNewMilestoneTitle(''); setIsYearly(false); setShowAddMilestone(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-blue">The Battle Map</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-blue-500 animate-pulse" /> Orchestrating Temporal Timeline Operations
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-[2rem] border-2 border-white/5 shadow-2xl">
          <button onClick={handlePrevMonth} className="p-4 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={24} /></button>
          <span className="pixel-font text-[12px] text-blue-400 min-w-[200px] text-center uppercase tracking-widest">{monthYear}</span>
          <button onClick={handleNextMonth} className="p-4 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><ChevronRight size={24} /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {calendarDays.map((date, idx) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const dateStr = formatDateToLocalISO(date);
          const dayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === date.toDateString());
          const dayMilestones = milestones.filter(m => m.isYearly ? (new Date(m.date).getDate() === date.getDate() && new Date(m.date).getMonth() === date.getMonth()) : new Date(m.date).toDateString() === date.toDateString());
          const publicHolidays = NSW_PUBLIC_HOLIDAYS_2025.filter(h => h.date === dateStr);
          
          return (
            <div key={idx} onClick={(e) => handleDayClick(e, date)} className={`rpg-card rounded-[2.5rem] p-6 flex flex-col transition-all duration-500 min-h-[200px] border-t-8 cursor-pointer relative ${isToday ? 'border-t-blue-500 bg-slate-900 shadow-3xl' : 'border-t-slate-800 hover:border-t-cyan-500/50'}`}>
              <div className="flex justify-between items-start mb-6 pointer-events-none">
                <span className={`text-3xl font-black ${isToday ? 'text-blue-400 glow-text-blue' : 'text-white'}`}>{date.getDate()}</span>
                {isToday && <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping shadow-[0_0_15px_rgba(59,130,246,1)]" />}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pointer-events-none">
                {publicHolidays.map((h, i) => <div key={i} className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[8px] font-black uppercase truncate"><Landmark size={10} className="inline mr-1" /> {h.title}</div>)}
                {dayMilestones.map(m => <div key={m.id} className={`p-2 rounded-xl border text-[8px] font-black uppercase truncate ${m.completed ? 'bg-slate-900 border-white/5 text-slate-700' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200'}`}><Flag size={10} className="inline mr-1" /> {m.title}</div>)}
                {dayTasks.map(t => <div key={t.id} className={`p-2 rounded-xl border text-[8px] font-black uppercase truncate ${t.completed ? 'opacity-40 line-through' : t.isBoss ? 'bg-red-900/20 border-red-500/40 text-red-300' : 'bg-blue-900/20 border-blue-500/40 text-blue-300'}`}><Skull size={10} className="inline mr-1" /> {t.title}</div>)}
              </div>
            </div>
          );
        })}
      </div>

      {showAddMilestone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddMilestone(false)} />
          <div className="relative w-full max-w-2xl bg-black border-2 border-blue-500/40 p-12 rounded-[4rem] animate-in zoom-in-95">
             <form onSubmit={handleForgeMilestone} className="space-y-8">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic glow-text-blue text-center">Forge Milestone</h3>
                <input type="text" value={newMilestoneTitle} onChange={e => setNewMilestoneTitle(e.target.value)} autoFocus placeholder="Designation..." className="w-full bg-[#050508] border-2 border-white/5 rounded-3xl px-8 py-6 text-xl text-white focus:border-blue-500 outline-none" />
                <input type="date" value={newMilestoneDate} onChange={e => setNewMilestoneDate(e.target.value)} className="w-full bg-[#050508] border-2 border-white/5 rounded-3xl px-8 py-6 text-white focus:border-blue-500 outline-none" />
                <div className="flex gap-4"><button type="button" onClick={() => setShowAddMilestone(false)} className="flex-1 py-6 bg-slate-900 text-slate-500 font-black text-xs uppercase rounded-3xl">Abort</button><button type="submit" className="flex-[2] py-6 bg-blue-600 text-white font-black text-xs uppercase rounded-3xl shadow-xl">Seal Marker</button></div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdventurerCalendar;
