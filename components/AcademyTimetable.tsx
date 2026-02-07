
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskCategory, TimetableSlot } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Layers, UserCheck, UserX, MapPin, Sword, Sparkles, CheckCircle2, RefreshCw, ShieldAlert, CalendarDays, User, Edit2, Activity, Target, BookOpen, GraduationCap } from 'lucide-react';

interface AcademyTimetableProps {
  timetable: Record<string, Record<string, TimetableSlot[]>>;
  tasks: Task[];
  onUpdateSlotField: (week: string, day: string, id: string, field: keyof TimetableSlot, value: string) => void;
  onToggleAttendance: (week: string, day: string, id: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKS = ['Week A', 'Week B'];

const cleanSubject = (subject: string) => subject.replace(/\s*[Yy][Rr]8\s*$/, '').trim();

const getSubjectColorClasses = (subject: string, status?: string, isActive?: boolean): string => {
  const s = subject.toLowerCase();
  let base = isActive ? 'bg-slate-950 border-teal-500/50 shadow-[0_0_30px_rgba(45,212,191,0.15)] ring-1 ring-teal-500/20' : 'bg-slate-900/40 border-white/[0.05]';
  if (s.includes('english')) base += ' border-l-yellow-500';
  else if (s.includes('maths')) base += ' border-l-red-500';
  else if (s.includes('science')) base += ' border-l-teal-500';
  else if (s.includes('history') || s.includes('geography')) base += ' border-l-orange-500';
  else if (s.includes('pdhpe')) base += ' border-l-lime-500';
  else if (s.includes('food')) base += ' border-l-purple-500';
  else if (s.includes('languages')) base += ' border-l-blue-500';
  else if (s.includes('visual arts') || s.includes('music')) base += ' border-l-pink-500';
  else base += ' border-l-slate-700';

  if (status === 'attended') return `${base} ring-1 ring-emerald-500/20`;
  if (status === 'missed') return `${base} opacity-40 grayscale`;
  return base;
};

const AcademyTimetable: React.FC<AcademyTimetableProps> = ({ timetable, tasks, onUpdateSlotField, onToggleAttendance }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const currentWeekType = useMemo(() => {
    const d = new Date(Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo % 2 === 0 ? 'Week B' : 'Week A';
  }, [currentTime]);

  const currentDayName = useMemo(() => currentTime.toLocaleDateString('en-US', { weekday: 'long' }), [currentTime]);
  const [selectedWeek, setSelectedWeek] = useState<string>(currentWeekType);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS.includes(currentDayName) ? currentDayName : 'Monday');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentSlot = (startTime: string, endTime: string, slotDay: string, slotWeek: string) => {
    if (selectedWeek !== slotWeek || currentDayName !== slotDay) return false;
    const nowTotal = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return nowTotal >= (startH * 60 + startM) && nowTotal < (endH * 60 + endM);
  };

  const slots = timetable[selectedWeek]?.[selectedDay] || [];

  const academicQuests = useMemo(() => {
    return tasks.filter(t => !t.completed && (t.category === TaskCategory.SCHOOL || t.category === TaskCategory.STUDY || t.category === TaskCategory.HOMEWORK));
  }, [tasks]);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-teal">Academy Campaign</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-teal-500 animate-pulse" /> 
            Executing Daily Institutional Training Sequences
          </p>
        </div>
        <div className="flex p-2 bg-black rounded-[2rem] border-2 border-white/5 shadow-2xl">
          {WEEKS.map(week => (
            <button key={week} onClick={() => setSelectedWeek(week)} className={`px-8 py-4 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest transition-all ${selectedWeek === week ? 'bg-teal-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{week}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-[3rem] border border-white/5 shadow-3xl overflow-x-auto no-scrollbar">
        {DAYS.map((day) => (
          <button key={day} onClick={() => setSelectedDay(day)} className={`flex-1 min-w-[140px] py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 ${selectedDay === day ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-2xl scale-105' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}>{day}</button>
        ))}
      </div>

      {/* Main Schedule Panel - Now Full Width */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-4 px-4">
          <CalendarDays size={20} className="text-teal-500" />
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Daily Mission Roster</h3>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {slots.map((slot) => {
            const active = isCurrentSlot(slot.startTime, slot.endTime, selectedDay, selectedWeek);
            const colors = getSubjectColorClasses(slot.subject || slot.label, slot.status, active);
            return (
              <div key={slot.id} className={`rpg-card rounded-[3.5rem] p-8 md:p-12 border-l-[12px] transition-all duration-500 relative group overflow-visible ${colors}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="bg-black/60 px-6 py-2 rounded-full text-[11px] font-black text-slate-500 w-fit mb-6 border border-white/5 tracking-[0.3em]">{slot.startTime} - {slot.endTime}</div>
                    <h4 className={`text-2xl md:text-4xl font-black uppercase tracking-tight break-words leading-tight transition-colors ${slot.status === 'missed' ? 'line-through opacity-40' : 'text-white glow-text-teal'}`}>{cleanSubject(slot.subject || slot.label)}</h4>
                    {slot.type !== 'break' && (
                      <div className="flex flex-wrap items-start gap-x-12 gap-y-6 mt-8">
                        <div className="flex items-start gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest min-w-0">
                          <MapPin size={18} className="text-teal-500 shrink-0 mt-0.5" /> 
                          <div className="flex flex-col">
                            <span className="opacity-50 text-[9px] mb-1 uppercase tracking-widest">MISSION CHAMBER:</span>
                            <span className="text-white/80 font-bold">{slot.classroom || '---'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest min-w-0">
                          <User size={18} className="text-teal-500 shrink-0 mt-0.5" /> 
                          <div className="flex flex-col">
                            <span className="opacity-50 text-[9px] mb-1 uppercase tracking-widest">ACADEMY SAGE:</span>
                            <span className="text-white/80 font-bold">{slot.teacher || '---'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => onToggleAttendance(selectedWeek, selectedDay, slot.id)} className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] border-4 flex items-center justify-center transition-all shadow-3xl active:scale-90 ${slot.status === 'attended' ? 'bg-emerald-600 border-emerald-400 text-white' : slot.status === 'missed' ? 'bg-red-600 border-red-400 text-white' : 'bg-black/40 border-white/10 text-white/20 hover:text-white'}`}>
                    {slot.status === 'attended' ? <UserCheck size={32} className="md:w-10 md:h-10" /> : slot.status === 'missed' ? <UserX size={32} className="md:w-10 md:h-10" /> : <Sword size={28} className="md:w-8 md:h-8" />}
                  </button>
                </div>
                {active && <div className="absolute -left-3 top-10 bottom-10 w-2 bg-teal-500 rounded-full shadow-[0_0_30px_rgba(45,212,191,1)] animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Academy Quests - Now at the very bottom, full width grid */}
      <div className="space-y-8 pt-10 border-t border-white/5">
        <div className="flex items-center gap-4 px-4">
          <Target size={24} className="text-teal-400" />
          <h3 className="text-xl font-black text-teal-500 uppercase tracking-[0.4em]">Tactical Objectives</h3>
        </div>
        
        <div className="rpg-card rounded-[4rem] p-10 md:p-14 border-teal-500/20 bg-slate-950 shadow-3xl relative overflow-hidden flex flex-col gap-10">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <GraduationCap size={200} className="text-teal-500" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {academicQuests.length > 0 ? (
              academicQuests.map((quest) => (
                <div key={quest.id} className="p-8 rounded-[2.5rem] bg-black/40 border-2 border-white/5 hover:border-teal-500/40 transition-all group/quest shadow-xl flex flex-col justify-between">
                   <div className="flex items-start gap-6">
                      <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400 group-hover/quest:scale-110 transition-transform shadow-lg shrink-0">
                         {CATEGORY_ICONS[quest.category] || <BookOpen size={24} />}
                      </div>
                      <div className="min-w-0 flex-1">
                         <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover/quest:text-teal-400 transition-colors break-words">{quest.title}</h4>
                         <div className="flex items-center gap-3 mt-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">{quest.difficulty}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">+{quest.xpValue} XP</span>
                         </div>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center opacity-30 border-4 border-dashed border-white/5 rounded-[3.5rem]">
                <CheckCircle2 size={56} className="text-slate-500 mx-auto mb-6" />
                <p className="text-sm font-black text-slate-600 uppercase tracking-[0.5em]">Academic Sector Cleared</p>
              </div>
            )}
          </div>

          <div className="mt-4 p-8 bg-teal-500/5 border border-teal-500/10 rounded-[2.5rem] relative z-10 text-center max-w-4xl mx-auto">
             <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed italic">
               "Synchronization between institutional cycles and personal mastery is the mark of a True Scholar. Ensure every mission is transcribed and executed with absolute precision."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AcademyTimetable;
