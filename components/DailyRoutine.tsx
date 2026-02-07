
import React, { useMemo } from 'react';
import { Task, TaskCategory, TimetableSlot, AssessmentMap, Habit, Countdown, Milestone } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Clock, Sun, Moon, Sparkles, MapPin, AlertTriangle, Sword, Coffee, Ghost, Trash, Footprints, Activity, Zap, Target, Star, ShieldAlert, Skull, Flag } from 'lucide-react';

interface RoutineItem {
  time: string;
  activity: string;
  category: TaskCategory;
  isHabit?: boolean;
  description?: string;
  isSpecial?: boolean;
  type?: 'boss' | 'quest' | 'school' | 'standard' | 'chore' | 'travel' | 'event';
  rawTime?: number;
}

interface DailyRoutineProps {
  tasks: Task[];
  timetable: Record<string, Record<string, TimetableSlot[]>>;
  assessments: AssessmentMap;
  habits: Habit[];
  countdowns: Countdown[];
  milestones: Milestone[];
}

const cleanSubject = (subject: string) => subject.replace(/\s*[Yy][Rr]8\s*/g, ' ').trim();

const DailyRoutine: React.FC<DailyRoutineProps> = ({ tasks, timetable, assessments, habits, countdowns, milestones }) => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
  const todayStr = now.toDateString();
  
  const weekType = useMemo(() => {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo % 2 === 0 ? 'Week B' : 'Week A';
  }, [now]);

  const routine: RoutineItem[] = useMemo(() => {
    const items: RoutineItem[] = [
      { time: '06:30', activity: 'Dawn Patrol: Wake Up', category: TaskCategory.HEALTH, isHabit: true, type: 'standard' },
      { time: '07:00', activity: 'Divine Communion: Prayer', category: TaskCategory.MINDFULNESS, isHabit: true, type: 'standard' },
      { time: '07:15', activity: 'Sage\'s Scroll: 30m Reading', category: TaskCategory.STUDY, isHabit: true, type: 'quest' },
    ];

    milestones.forEach(m => {
        if (new Date(m.date).toDateString() === todayStr) {
            items.push({ time: '08:00', activity: `WORLD EVENT: ${m.title}`, category: TaskCategory.SOCIAL, type: 'event' });
        }
    });

    const activeBossesToday = tasks.filter(t => t.isBoss && !t.completed && new Date(t.dueDate).toDateString() === todayStr);
    activeBossesToday.forEach(boss => {
       items.push({ time: '08:15', activity: `FINAL BOSS SIEGE: ${boss.title}`, category: TaskCategory.SCHOOL, type: 'boss' });
    });

    if (!isWeekend) {
      items.push({ time: '08:30', activity: 'Academy Entry', category: TaskCategory.SCHOOL, type: 'school' });
      items.push({ time: '15:15', activity: 'Stamina Quest: Walking Home', category: TaskCategory.FITNESS, type: 'travel' });
    }

    const choreSchedule: Record<string, string> = { 'Monday': 'Empty Dishwasher', 'Tuesday': 'Hang Clothes', 'Wednesday': 'Clean Room', 'Thursday': 'Dishwasher', 'Friday': 'Hang Clothes', 'Saturday': 'Sanctum Reset', 'Sunday': 'Mow Terrain' };
    items.push({ time: '16:00', activity: `Chore Quest: ${choreSchedule[dayName] || 'Base Ops'}`, category: TaskCategory.CHORES, type: 'chore', isHabit: true });
    
    const questsToday = tasks.filter(t => !t.completed && !t.isBoss && !t.isSideQuest && new Date(t.dueDate).toDateString() === todayStr);
    questsToday.forEach((q, i) => {
        items.push({ time: `${17 + i}:00`, activity: `OBJECTIVE: ${q.title}`, category: q.category, type: 'quest' });
    });

    items.push({ time: '19:00', activity: 'Titan Trek: Gym / Steps', category: TaskCategory.FITNESS, isHabit: true, type: 'standard' });
    items.push({ time: '21:30', activity: 'Hero Rest: Bedtime', category: TaskCategory.HEALTH, isHabit: true, type: 'standard' });

    return items.sort((a, b) => parseInt(a.time.replace(':','')) - parseInt(b.time.replace(':','')));
  }, [isWeekend, tasks, timetable, weekType, dayName, todayStr, milestones]);

  const currentTimeVal = now.getHours() * 60 + now.getMinutes();
  const isActive = (timeStr: string, nextTimeStr?: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const startVal = h * 60 + m;
    if (!nextTimeStr) return currentTimeVal >= startVal;
    const [nh, nm] = nextTimeStr.split(':').map(Number);
    const endVal = nh * 60 + nm;
    return currentTimeVal >= startVal && currentTimeVal < endVal;
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24 max-w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-4">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-purple">The Quest Log</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] mt-4 flex items-center gap-4"><Activity className="text-purple-400 animate-pulse" /> Routine Sync Active</p>
        </div>
      </div>
      <div className="space-y-12 px-4 relative">
        <div className="absolute left-10 md:left-24 top-0 bottom-0 w-1 bg-slate-900" />
        {routine.map((item, idx) => {
          const active = isActive(item.time, routine[idx + 1]?.time);
          return (
            <div key={idx} className={`flex gap-8 md:gap-16 items-start transition-all duration-500 ${active ? 'opacity-100 scale-[1.01]' : 'opacity-40'}`}>
              <div className="flex flex-col items-center shrink-0 min-w-[60px] md:min-w-[100px]">
                <p className={`text-sm md:text-2xl font-black italic tabular-nums ${active ? 'text-white' : 'text-slate-600'}`}>{item.time}</p>
                <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 transition-all ${active ? 'bg-purple-500 border-white shadow-[0_0_15px_purple]' : 'bg-black border-slate-800'}`} />
              </div>
              <div className={`flex-1 rpg-card rounded-[2.5rem] p-8 md:p-12 border-l-[10px] transition-all ${item.type === 'boss' ? 'border-l-red-600 bg-red-950/10' : active ? 'border-l-purple-500 bg-slate-900 shadow-2xl' : 'border-l-slate-800 bg-black/40'}`}>
                <h4 className={`text-xl md:text-4xl font-black uppercase tracking-tight italic ${active ? 'text-white' : 'text-slate-500'}`}>{item.activity}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DailyRoutine;
