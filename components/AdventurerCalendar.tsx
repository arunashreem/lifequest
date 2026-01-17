
import React, { useState } from 'react';
import { Task } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdventurerCalendarProps {
  tasks: Task[];
}

const AdventurerCalendar: React.FC<AdventurerCalendarProps> = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
  // Padding for start
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }
  // Actual days
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Monthly Battle Map</h2>
          <p className="text-slate-400 text-sm">Strategize your upcoming raids and deadlines.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-xl border border-slate-800">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="pixel-font text-[10px] text-blue-400 min-w-[120px] text-center">{monthYear}</span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-black text-slate-500 uppercase py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="h-24 md:h-32 bg-slate-950/30 rounded-xl border border-slate-900/50" />;
          
          const isToday = date.toDateString() === new Date().toDateString();
          const dayTasks = getTasksForDay(date);
          const hasUncompleted = dayTasks.some(t => !t.completed);

          return (
            <div 
              key={idx} 
              className={`h-24 md:h-32 rpg-card rounded-xl p-2 flex flex-col transition-all overflow-hidden border-t-2 relative ${
                isToday ? 'border-t-blue-500 bg-slate-900 ring-2 ring-blue-500/20' : 'border-t-slate-800 opacity-90'
              } ${dayTasks.length > 0 && !hasUncompleted ? 'grayscale opacity-50' : ''}`}
            >
              <span className={`text-xs font-bold mb-1 ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                {date.getDate()}
              </span>
              
              <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`text-[9px] p-1 rounded border flex items-center gap-1 truncate ${
                      task.completed 
                        ? 'bg-slate-800 border-slate-700 text-slate-500 line-through' 
                        : 'bg-blue-900/20 border-blue-800 text-blue-300'
                    }`}
                  >
                    <div className="shrink-0 scale-75">{CATEGORY_ICONS[task.category]}</div>
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>

              {dayTasks.length > 3 && (
                <div className="absolute bottom-1 right-2 text-[8px] font-black text-blue-400">
                  +{dayTasks.length - 3} MORE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdventurerCalendar;
