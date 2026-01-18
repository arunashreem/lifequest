
import React, { useState, useEffect, useMemo } from 'react';
import { TimetableSlot } from '../types';
import { 
  Layers, 
  UserCheck, 
  UserX, 
  MapPin, 
  Sword, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert,
  CalendarDays,
  User,
  Edit2
} from 'lucide-react';

interface AcademyTimetableProps {
  timetable: Record<string, Record<string, TimetableSlot[]>>;
  onUpdateSlotField: (week: string, day: string, id: string, field: keyof TimetableSlot, value: string) => void;
  onToggleAttendance: (week: string, day: string, id: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKS = ['Week A', 'Week B'];

const cleanSubject = (subject: string) => {
  return subject.replace(/\s*[Yy][Rr]8\s*$/, '').trim();
};

const getSubjectColorClasses = (subject: string, status?: string, isActive?: boolean): string => {
  const s = subject.toLowerCase();
  // Base classes - using a slightly more opaque background for active slots as requested ("darker")
  let base = isActive 
    ? 'bg-slate-950 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' 
    : 'bg-slate-900/40 border-white/[0.05]';

  if (s.includes('english')) base += ' border-l-yellow-500';
  else if (s.includes('maths')) base += ' border-l-red-500';
  else if (s.includes('science')) base += ' border-l-teal-500';
  else if (s.includes('history') || s.includes('geography')) base += ' border-l-orange-500';
  else if (s.includes('pdhpe')) base += ' border-l-lime-500';
  else if (s.includes('food')) base += ' border-l-purple-500';
  else if (s.includes('languages')) base += ' border-l-blue-500';
  else if (s.includes('visual arts') || s.includes('music')) base += ' border-l-pink-500';
  else if (s.includes('roll call') || s.includes('mtg')) base += ' border-l-slate-400';
  else if (s.includes('walk home')) base += ' border-l-cyan-500';
  else base += ' border-l-slate-700';

  if (status === 'attended') return `${base} ring-1 ring-emerald-500/20`;
  if (status === 'missed') return `${base} opacity-40 grayscale`;
  
  return base;
};

const AcademyTimetable: React.FC<AcademyTimetableProps> = ({ timetable, onUpdateSlotField, onToggleAttendance }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const currentWeekType = useMemo(() => {
    const d = new Date(Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo % 2 === 0 ? 'Week B' : 'Week A';
  }, [currentTime]);

  const currentDayName = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  }, [currentTime]);

  const [selectedWeek, setSelectedWeek] = useState<string>(currentWeekType);
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    return DAYS.includes(currentDayName) ? currentDayName : 'Monday';
  });

  const [editingField, setEditingField] = useState<{id: string, field: string} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentSlot = (startTime: string, endTime: string, slotDay: string, slotWeek: string) => {
    if (selectedWeek !== slotWeek) return false;
    if (currentDayName !== slotDay) return false;
    const nowTotal = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return nowTotal >= (startH * 60 + startM) && nowTotal < (endH * 60 + endM);
  };

  const handleAttendanceToggle = (day: string, slotId: string) => {
    onToggleAttendance(selectedWeek, day, slotId);
  };

  const slots = timetable[selectedWeek]?.[selectedDay] || [];
  const isToday = currentDayName === selectedDay;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-full overflow-hidden">
      <style>{`
        @keyframes stamp-pop {
          0% { transform: scale(3); opacity: 0; filter: blur(5px); }
          50% { transform: scale(1.1); opacity: 0.8; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-stamp { animation: stamp-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-2xl border border-white/10 shrink-0">
             <Layers className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Academy Campaign</h2>
            <p className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              <Sparkles size={12} className="text-yellow-500 animate-pulse" />
              Strategic Timetable View
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => {
              const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
              if (DAYS.includes(today)) setSelectedDay(today);
              setSelectedWeek(currentWeekType);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all shrink-0"
          >
            <RefreshCw size={14} className="text-blue-500" />
            Sync to Today
          </button>
          
          <div className="flex p-1 bg-slate-900 rounded-xl border-2 border-slate-800 shadow-xl shrink-0">
            {WEEKS.map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
                  selectedWeek === week
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day Selection Panel */}
      <div className="px-2">
        <div className="flex items-center gap-2 p-2 bg-slate-950/50 rounded-[2rem] border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
          {DAYS.map((day) => {
            const isActualToday = currentDayName === day;
            const isActive = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative flex-1 min-w-[120px] py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_10px_25px_rgba(225,29,72,0.3)] scale-105 z-10' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {day}
                  {isActualToday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single Day View Area */}
      <div className="px-2 animate-in fade-in slide-in-from-right-4 duration-500" key={`${selectedWeek}-${selectedDay}`}>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-rose-500" size={20} />
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">{selectedDay}</h3>
            </div>
          </div>

          <div className="space-y-4 min-h-[400px]">
            {slots.length > 0 ? slots.map((slot) => {
              const active = isCurrentSlot(slot.startTime, slot.endTime, selectedDay, selectedWeek);
              const colors = getSubjectColorClasses(slot.subject || slot.label, slot.status, active);
              const subjectName = slot.subject || slot.label;
              const isBreak = slot.type === 'break';

              return (
                <div 
                  key={slot.id}
                  className={`rpg-card rounded-2xl p-6 md:p-8 border-l-[6px] transition-all duration-300 relative group overflow-visible ${colors}`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Time Pill */}
                      <div className="bg-black/40 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 w-fit mb-4 border border-white/5 tracking-widest">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      
                      {/* Subject Name - Large and Bold */}
                      {editingField?.id === slot.id && editingField?.field === 'subject' ? (
                        <input
                          autoFocus
                          className="w-full bg-slate-950 border border-blue-500 rounded-lg px-3 py-1 text-white text-3xl font-black uppercase outline-none"
                          value={slot.subject}
                          onBlur={() => setEditingField(null)}
                          onChange={(e) => onUpdateSlotField(selectedWeek, selectedDay, slot.id, 'subject', e.target.value)}
                        />
                      ) : (
                        <h4 
                          onClick={() => setEditingField({id: slot.id, field: 'subject'})}
                          className={`text-3xl md:text-4xl font-extrabold uppercase tracking-tight truncate leading-none cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-3 ${slot.status === 'missed' ? 'line-through opacity-40' : 'text-white text-glow'}`}
                        >
                          {cleanSubject(subjectName)}
                          <Edit2 size={16} className="opacity-0 group-hover:opacity-40" />
                        </h4>
                      )}

                      {/* Metadata Row */}
                      {!isBreak && (
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6">
                          <div 
                            onClick={() => setEditingField({id: slot.id, field: 'classroom'})}
                            className="flex items-center gap-3 cursor-pointer group/meta"
                          >
                            <MapPin size={16} className="text-red-500" />
                            {editingField?.id === slot.id && editingField?.field === 'classroom' ? (
                              <input 
                                autoFocus
                                className="bg-slate-950 border border-blue-500 rounded px-1 text-white uppercase outline-none text-[10px]"
                                value={slot.classroom}
                                onBlur={() => setEditingField(null)}
                                onChange={(e) => onUpdateSlotField(selectedWeek, selectedDay, slot.id, 'classroom', e.target.value)}
                              />
                            ) : (
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/meta:text-slate-300">
                                ROOM: {slot.classroom || '---'}
                              </span>
                            )}
                          </div>

                          <div 
                            onClick={() => setEditingField({id: slot.id, field: 'teacher'})}
                            className="flex items-center gap-3 cursor-pointer group/meta"
                          >
                            <User size={16} className="text-blue-500" />
                            {editingField?.id === slot.id && editingField?.field === 'teacher' ? (
                              <input 
                                autoFocus
                                className="bg-slate-950 border border-blue-500 rounded px-1 text-white uppercase outline-none text-[10px]"
                                value={slot.teacher}
                                onBlur={() => setEditingField(null)}
                                onChange={(e) => onUpdateSlotField(selectedWeek, selectedDay, slot.id, 'teacher', e.target.value)}
                              />
                            ) : (
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/meta:text-slate-300">
                                TEACHER: {slot.teacher || '---'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {slot.type !== 'break' && (
                      <button 
                        onClick={() => handleAttendanceToggle(selectedDay, slot.id)}
                        className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex items-center justify-center transition-all shadow-2xl active:scale-90 ${
                          slot.status === 'attended' ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-900/40' : 
                          slot.status === 'missed' ? 'bg-red-600 border-red-400 text-white shadow-red-900/40' :
                          'bg-black/40 border-white/10 text-white/20 hover:border-white/40 hover:text-white'
                        }`}
                      >
                         {slot.status === 'attended' ? <UserCheck size={28} /> : slot.status === 'missed' ? <UserX size={28} /> : <Sword size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
                      </button>
                    )}
                  </div>

                  {slot.status === 'attended' && (
                    <div className="absolute -right-3 -top-3 animate-stamp z-20">
                      <div className="p-2 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-2xl">
                        <CheckCircle2 size={18} className="text-white" />
                      </div>
                    </div>
                  )}

                  {active && (
                    <div className="absolute -left-1.5 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
                  )}
                </div>
              );
            }) : (
              <div className="py-24 px-4 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center opacity-40">
                <ShieldAlert size={48} className="text-slate-600 mb-4" />
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No Raids Scribed for this Chronos Node</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="rpg-card p-6 rounded-[2.5rem] border-slate-800 bg-slate-900/40 flex flex-wrap gap-x-6 gap-y-3 items-center justify-center">
        {[
          { color: 'bg-yellow-500', label: 'English' },
          { color: 'bg-red-500', label: 'Maths' },
          { color: 'bg-teal-500', label: 'Science' },
          { color: 'bg-blue-500', label: 'Languages' },
          { color: 'bg-orange-500', label: 'History/Geo' },
          { color: 'bg-purple-500', label: 'Tech' },
          { color: 'bg-pink-500', label: 'Arts/Music' },
          { color: 'bg-lime-500', label: 'PDHPE' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 bg-slate-950/40 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
            <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademyTimetable;
