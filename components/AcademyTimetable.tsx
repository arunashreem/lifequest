
import React, { useState, useEffect } from 'react';
import { TimetableSlot } from '../types';
import { 
  Book, 
  Coffee, 
  Utensils, 
  Home, 
  BellRing, 
  Layers, 
  UserCheck, 
  UserX, 
  MapPin, 
  User, 
  Sword, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Clock 
} from 'lucide-react';

interface AcademyTimetableProps {
  timetable: Record<string, Record<string, TimetableSlot[]>>;
  onUpdateSlotField: (week: string, day: string, id: string, field: keyof TimetableSlot, value: string) => void;
  onToggleAttendance: (week: string, day: string, id: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKS = ['Week A', 'Week B'];

const getSubjectColorClasses = (subject: string, status?: string): string => {
  const s = subject.toLowerCase();
  let base = '';
  if (s.includes('english')) base = 'border-l-yellow-400 bg-yellow-400/5 text-yellow-200';
  else if (s.includes('maths')) base = 'border-l-red-400 bg-red-400/5 text-red-200';
  else if (s.includes('science')) base = 'border-l-teal-400 bg-teal-400/5 text-teal-200';
  else if (s.includes('history') || s.includes('geography')) base = 'border-l-orange-400 bg-orange-400/5 text-orange-200';
  else if (s.includes('pdhpe')) base = 'border-l-lime-400 bg-lime-400/5 text-lime-200';
  else if (s.includes('food')) base = 'border-l-purple-400 bg-purple-400/5 text-purple-200';
  else if (s.includes('languages')) base = 'border-l-blue-400 bg-blue-400/5 text-blue-200';
  else if (s.includes('visual arts') || s.includes('music')) base = 'border-l-pink-400 bg-pink-400/5 text-pink-200';
  else if (s.includes('roll call') || s.includes('mtg')) base = 'border-l-slate-400 bg-slate-400/5 text-slate-300';
  else if (s.includes('walk home')) base = 'border-l-cyan-500 bg-cyan-500/5 text-cyan-200';
  else base = 'border-l-slate-700 bg-slate-800/20 text-slate-400';

  if (status === 'attended') return `${base} border-l-emerald-500 ring-1 ring-emerald-500/10 opacity-100`;
  if (status === 'missed') return `${base} border-l-red-500 opacity-30 grayscale`;
  return base;
};

const AcademyTimetable: React.FC<AcademyTimetableProps> = ({ timetable, onUpdateSlotField, onToggleAttendance }) => {
  const [selectedWeek, setSelectedWeek] = useState<string>('Week A');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastToggledId, setLastToggledId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentSlot = (startTime: string, endTime: string, slotDay: string, slotWeek: string) => {
    if (selectedWeek !== slotWeek) return false;
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    if (dayName !== slotDay) return false;
    const nowTotal = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return nowTotal >= (startH * 60 + startM) && nowTotal < (endH * 60 + endM);
  };

  const getIcon = (type: string, label: string) => {
    if (label.includes('Roll')) return <BellRing size={14} />;
    if (label === 'Recess') return <Coffee size={14} />;
    if (label === 'Lunch') return <Utensils size={14} />;
    if (label === 'Home Time') return <Home size={14} />;
    return <Book size={14} />;
  };

  const handleAttendanceToggle = (day: string, slotId: string) => {
    setLastToggledId(slotId);
    onToggleAttendance(selectedWeek, day, slotId);
    setTimeout(() => setLastToggledId(null), 600);
  };

  const todayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <style>{`
        @keyframes stamp-pop {
          0% { transform: scale(3); opacity: 0; filter: blur(5px); }
          50% { transform: scale(1.1); opacity: 0.8; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-stamp { animation: stamp-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[1.5rem] shadow-2xl shadow-indigo-900/40 rotate-[-1deg] border border-white/10">
             <Layers className="text-white" size={36} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Academy Campaign Map</h2>
            <div className="flex items-center gap-3 mt-1">
               <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Sparkles size={12} className="text-yellow-500 animate-pulse" />
                Year 8 Strategic View
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert("Gemini Oracle: The stars are shifting... Wait for the next Great Conjunction to re-scribe the Academy lines.")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
          >
            <RefreshCw size={14} className="text-blue-500" />
            Re-Scribe Cycle
          </button>
          
          <div className="flex p-1 bg-slate-900 rounded-[1.25rem] border-2 border-slate-800 shadow-xl w-64">
            {WEEKS.map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`flex-1 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
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

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {DAYS.map((day) => {
          const isToday = todayName === day;
          const slots = timetable[selectedWeek]?.[day] || [];
          
          return (
            <div 
              key={day} 
              className={`flex flex-col gap-4 transition-all duration-500 ${
                isToday ? 'scale-[1.02] z-10' : 'opacity-100'
              }`}
            >
              {/* Day Header - Highly Visible Red Re-skin */}
              <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between shadow-xl ${
                isToday 
                  ? 'bg-gradient-to-br from-rose-500 to-red-600 border-white text-white shadow-[0_10px_40px_rgba(225,29,72,0.6)] ring-4 ring-rose-500/20' 
                  : 'bg-rose-500/90 border-rose-400/50 text-white hover:bg-rose-500 hover:border-rose-300'
              }`}>
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 drop-shadow-sm">
                  {isToday && <Sparkles size={14} className="text-yellow-400 animate-pulse" />}
                  {day}
                </h3>
                {isToday && (
                  <div className="px-2 py-0.5 bg-white/30 rounded-md text-[8px] font-black uppercase border border-white/50 animate-pulse">
                    Today
                  </div>
                )}
              </div>

              {/* Day Slots */}
              <div className="space-y-3">
                {slots.map((slot) => {
                  const active = isCurrentSlot(slot.startTime, slot.endTime, day, selectedWeek);
                  const colors = getSubjectColorClasses(slot.subject || slot.label, slot.status);
                  const subjectName = slot.subject || slot.label;

                  return (
                    <div 
                      key={slot.id}
                      className={`rpg-card rounded-2xl p-4 border transition-all duration-300 relative group overflow-visible ${
                        active ? 'ring-2 ring-blue-500 shadow-blue-900/20 bg-slate-800/50' : ''
                      } ${colors}`}
                    >
                      {/* Tooltip Popup */}
                      <div className="absolute bottom-[calc(100%+8px)] left-0 w-full min-w-[160px] bg-slate-950/95 border-2 border-blue-500/50 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] pointer-events-none backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
                            {getIcon(slot.type, slot.label)}
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{slot.label}</p>
                        </div>
                        <h5 className="text-xs font-black text-white uppercase tracking-tight mb-2">{subjectName}</h5>
                        <div className="h-px w-full bg-slate-800 mb-2" />
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">
                            <Clock size={10} className="text-blue-500" /> <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                          {slot.classroom && (
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">
                              <MapPin size={10} className="text-orange-500" /> <span>{slot.classroom}</span>
                            </div>
                          )}
                          {slot.teacher && (
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">
                              <User size={10} className="text-purple-500" /> <span>{slot.teacher}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 left-6 w-3 h-3 bg-slate-950 border-r-2 border-b-2 border-blue-500/50 rotate-45" />
                      </div>

                      {/* Current Indicator */}
                      {active && (
                        <div className="absolute top-0 left-0 h-1.5 w-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                      )}

                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 max-w-[calc(100%-36px)]">
                           <div className={`p-2 rounded-lg bg-black/30 shrink-0 ${active ? 'text-blue-400' : 'text-slate-500'}`}>
                            {getIcon(slot.type, slot.label)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 truncate">{slot.startTime} - {slot.endTime}</p>
                            <h4 className={`text-xs font-black uppercase tracking-tight transition-all duration-300 truncate ${slot.status === 'missed' ? 'line-through opacity-50' : ''}`}>
                              {subjectName}
                            </h4>
                          </div>
                        </div>
                        
                        {slot.type !== 'break' && (
                          <button 
                            onClick={() => handleAttendanceToggle(day, slot.id)}
                            className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                              slot.status === 'attended' ? 'bg-emerald-600 border-emerald-400 text-white' : 
                              slot.status === 'missed' ? 'bg-red-600 border-red-400 text-white' :
                              'bg-black/20 border-white/5 text-white/30 hover:border-white/20 hover:text-white'
                            }`}
                          >
                             {slot.status === 'attended' ? <UserCheck size={14} /> : slot.status === 'missed' ? <UserX size={14} /> : <Sword size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 opacity-60">
                           {slot.classroom && (
                             <div className="flex items-center gap-1 text-[8px] font-bold">
                               <MapPin size={8} /> <span className="truncate max-w-[60px]">{slot.classroom}</span>
                             </div>
                           )}
                        </div>
                        
                        {slot.status === 'attended' && (
                          <div className="animate-stamp">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="rpg-card p-6 rounded-[2rem] border-slate-800 bg-slate-900/40 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center">
        {[
          { color: 'bg-yellow-400', label: 'English' },
          { color: 'bg-red-400', label: 'Maths' },
          { color: 'bg-teal-400', label: 'Science' },
          { color: 'bg-blue-400', label: 'Languages' },
          { color: 'bg-orange-400', label: 'HSIE' },
          { color: 'bg-purple-400', label: 'Tech' },
          { color: 'bg-pink-400', label: 'Creative' },
          { color: 'bg-lime-400', label: 'PDHPE' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-950/40 rounded-full border border-white/5">
            <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_5px_rgba(255,255,255,0.2)]`} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademyTimetable;
