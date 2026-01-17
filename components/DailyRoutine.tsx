
import React, { useMemo } from 'react';
import { Task, TaskCategory, TimetableSlot, AssessmentMap, Habit } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Clock, Sun, Moon, Sparkles, MapPin, AlertTriangle, Sword, Coffee, Ghost, Trash, Footprints } from 'lucide-react';

interface DailyRoutineProps {
  tasks: Task[];
  timetable: Record<string, Record<string, TimetableSlot[]>>;
  assessments: AssessmentMap;
  habits: Habit[];
}

interface RoutineItem {
  time: string;
  activity: string;
  category: TaskCategory;
  isHabit?: boolean;
  description?: string;
  isSpecial?: boolean;
  type?: 'boss' | 'quest' | 'school' | 'standard' | 'chore' | 'travel';
}

const DailyRoutine: React.FC<DailyRoutineProps> = ({ tasks, timetable, assessments, habits }) => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
  
  // Logic to determine school week (A or B)
  const weekType = useMemo(() => {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo % 2 === 0 ? 'Week B' : 'Week A';
  }, [now]);

  // Generate dynamic routine
  const routine: RoutineItem[] = useMemo(() => {
    const items: RoutineItem[] = [
      { time: '06:30', activity: 'Dawn Patrol: Wake Up', category: TaskCategory.HEALTH, isHabit: true },
      { time: '06:45', activity: 'Ritual Cleansing: Shower', category: TaskCategory.HEALTH },
      { time: '07:00', activity: 'Divine Communion: 5m Prayer', category: TaskCategory.MINDFULNESS, isHabit: true },
      { time: '07:15', activity: 'Sage\'s Scroll: 30m Reading', category: TaskCategory.STUDY, isHabit: true },
    ];

    if (!isWeekend) {
      // Weekday School Block
      items.push({ time: '07:45', activity: 'Stamina Recharge: Breakfast', category: TaskCategory.HEALTH });
      items.push({ time: '08:30', activity: 'Academy Entry: Start School', category: TaskCategory.SCHOOL, type: 'school' });
      
      // Inject current school subjects if available
      const daySchedule = timetable[weekType]?.[dayName] || [];
      const coreSubjects = daySchedule.filter(s => s.type === 'class').map(s => s.subject).filter(Boolean);
      if (coreSubjects.length > 0) {
        items.push({ 
          time: '09:00', 
          activity: `Focus: ${coreSubjects.slice(0, 3).join(', ')}`, 
          category: TaskCategory.SCHOOL,
          description: "Dominating the Academy curriculum.",
          type: 'standard'
        });
      }

      items.push({ time: '15:00', activity: 'Academy Exit: Homebound', category: TaskCategory.SCHOOL });
      items.push({ time: '15:15', activity: 'Stamina Quest: Walking Home', category: TaskCategory.FITNESS, type: 'travel', description: "30m walk. Recovering mental focus through physical movement." });
    } else {
      // Weekend Block
      items.push({ time: '08:30', activity: 'Weekend Free Roam: Side Quests', category: TaskCategory.SOCIAL, description: "Time for hobbies, family, and extra XP." });
      items.push({ time: '11:00', activity: 'Stamina Recovery: Chill / Play', category: TaskCategory.SCREEN_TIME });
    }

    // Boss Raid Check (Assessments)
    const currentWeekAssessments = Object.entries(assessments)
      .filter(([key, val]) => val.trim() !== '' && key.includes('term1'))
      .map(([_, val]) => val);
    
    if (currentWeekAssessments.length > 0) {
      items.push({
        time: '16:00',
        activity: `BOSS ALERT: ${currentWeekAssessments[0]}`,
        category: TaskCategory.STUDY,
        isSpecial: true,
        type: 'boss',
        description: "A major threat detected. Prepare your mind for battle."
      });
    }

    // CHORE QUEST INJECTION
    const choreSchedule: Record<string, string> = {
      'Monday': 'Empty Dishwasher',
      'Tuesday': 'Hang Clothes',
      'Wednesday': 'Clean Room + Trash',
      'Thursday': 'Empty Dishwasher + Fold Clothes',
      'Friday': 'Hang Clothes',
      'Saturday': 'Sanctum Reset (Clean Room)',
      'Sunday': 'Fold Clothes + Terrain Maintenance (Mow)'
    };

    items.push({
      time: '16:00',
      activity: `Chore Quest: ${choreSchedule[dayName] || 'Help at Base'}`,
      category: TaskCategory.CHORES,
      type: 'chore',
      description: "Vital base maintenance required for party morale.",
      isHabit: true
    });

    items.push({ time: '16:30', activity: 'Sonic Pulse: Mrudangam Practice', category: TaskCategory.MINDFULNESS, isHabit: true });

    // Active Quests Integration
    const activeQuests = tasks.filter(t => !t.completed && !t.isBoss).slice(0, 2);
    items.push({ 
      time: '17:30', 
      activity: 'The Grind Zone: Focused Work', 
      category: TaskCategory.HOMEWORK,
      type: 'quest',
      description: activeQuests.length > 0 
        ? `Objectives: ${activeQuests.map(q => q.title).join(', ')}` 
        : "Clear any pending tasks in the Quest Log."
    });

    items.push({ time: '19:00', activity: 'Titan Trek: Gym / 10k Steps', category: TaskCategory.FITNESS, isHabit: true });
    items.push({ time: '20:30', activity: 'Feast: Dinner', category: TaskCategory.HEALTH });
    items.push({ time: '21:00', activity: 'Digital Fast: No Screens', category: TaskCategory.MINDFULNESS, isHabit: true });
    items.push({ time: '21:30', activity: 'Hero Rest: Bedtime', category: TaskCategory.HEALTH, isHabit: true });

    return items;
  }, [isWeekend, tasks, timetable, weekType, dayName, assessments]);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Chronos Routine</h2>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={16} className="text-cyan-400 animate-pulse" />
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              {dayName} • {weekType} • {isWeekend ? 'Restoration Phase' : 'Academy Campaign'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 shadow-lg">
             {isWeekend ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-yellow-500" />}
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{isWeekend ? 'Weekend Mode' : 'Week Day'}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-20" />

        <div className="space-y-6">
          {routine.map((item, idx) => {
            const active = isActive(item.time, routine[idx + 1]?.time);
            
            return (
              <div key={idx} className={`flex gap-6 items-start transition-all duration-500 ${active ? 'scale-[1.03] translate-x-2' : 'opacity-40 grayscale-[0.8] blur-[0.5px] hover:opacity-70 hover:grayscale-0 hover:blur-0'}`}>
                {/* Time Display */}
                <div className="w-20 text-right pt-1 shrink-0">
                  <p className={`text-sm font-black ${active ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-slate-500'}`}>
                    {item.time}
                  </p>
                </div>

                {/* Node */}
                <div className={`relative z-10 w-5 h-5 rounded-full border-4 shrink-0 transition-all duration-700 mt-1 ${
                  active 
                    ? 'bg-blue-500 border-white shadow-[0_0_20px_rgba(59,130,246,1)]' 
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  {active && <div className="absolute inset-[-8px] rounded-full animate-ping bg-blue-400 opacity-20" />}
                </div>

                {/* Content Card */}
                <div className={`flex-1 rpg-card rounded-2xl p-5 border-l-4 transition-all relative overflow-hidden ${
                  active 
                    ? 'border-blue-500 bg-slate-900/80 shadow-2xl ring-2 ring-blue-500/10' 
                    : 'border-slate-800'
                } ${item.type === 'boss' ? 'border-l-red-500 bg-red-950/10' : ''} ${item.type === 'quest' ? 'border-l-indigo-500 bg-indigo-950/10' : ''} ${item.type === 'chore' ? 'border-l-orange-500 bg-orange-950/10' : ''} ${item.type === 'travel' ? 'border-l-cyan-500 bg-cyan-950/10' : ''}`}>
                  
                  {/* Background Icon Watermark */}
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    {item.type === 'boss' && <Ghost size={80} />}
                    {item.type === 'quest' && <Sword size={80} />}
                    {item.type === 'chore' && <Trash size={80} />}
                    {item.type === 'travel' && <Footprints size={80} />}
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${active ? 'text-blue-400' : 'text-slate-500'} ${item.type === 'boss' ? 'text-red-400' : ''} ${item.type === 'chore' ? 'text-orange-400' : ''} ${item.type === 'travel' ? 'text-cyan-400' : ''}`}>
                        {item.type === 'boss' ? <AlertTriangle size={20} /> : item.type === 'quest' ? <Sword size={20} /> : item.type === 'chore' ? <Trash size={20} /> : item.type === 'travel' ? <Footprints size={20} /> : CATEGORY_ICONS[item.category]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-lg font-black uppercase tracking-tight ${active ? 'text-white' : 'text-slate-400'} ${item.type === 'boss' ? 'text-red-400' : ''} ${item.type === 'chore' ? 'text-orange-400' : ''} ${item.type === 'travel' ? 'text-cyan-400' : ''}`}>
                            {item.activity}
                          </h4>
                          {item.isHabit && <Sparkles size={14} className="text-yellow-500 animate-pulse" />}
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.description || item.category}</p>
                      </div>
                    </div>
                    
                    {active && (
                      <div className={`px-3 py-1 rounded-full border ${item.type === 'boss' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-blue-500/20 border-blue-500/30 text-blue-400'}`}>
                        <span className="text-[9px] font-black uppercase animate-pulse">
                          {item.type === 'boss' ? 'CRITICAL ENCOUNTER' : 'ACTIVE OBJECTIVE'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyRoutine;
