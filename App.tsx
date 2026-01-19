
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import CharacterStats from './components/CharacterStats';
import QuestCard from './components/QuestCard';
import AdventurerCalendar from './components/AdventurerCalendar';
import WarRoom from './components/WarRoom';
import SideQuestList from './components/SideQuestList';
import AcademyTimetable from './components/AcademyTimetable';
import DailyRoutine from './components/DailyRoutine';
import AssessmentPlanner from './components/AssessmentPlanner';
import CountdownWidget from './components/CountdownWidget';
import TrainingGrounds from './components/TrainingGrounds';
import HabitTracker from './components/HabitTracker';
import WeatherWidget from './components/WeatherWidget';
import TheGreatArchive from './components/TheGreatArchive';
import Treasury from './components/Treasury';
import Profile from './components/Profile';
import CurrentTimeWidget from './components/CurrentTimeWidget';
import Scriptorium from './components/Scriptorium';
import { Task, UserStats, TaskCategory, Difficulty, Reward, TimetableSlot, AssessmentMap, Habit, Book, Countdown, Resource, ContentIdea, Milestone } from './types';
import { INITIAL_STATS, XP_VALUES, DEFAULT_REWARDS, REWARD_ICONS, INITIAL_HABITS, INITIAL_BOOKS, INITIAL_TIMETABLE, INITIAL_ASSESSMENTS } from './constants';
import { Plus, Sparkles, Wand2, Loader2, ScrollText, Trophy, Clock, ShieldCheck, Zap, RefreshCw, Trash2, Hammer, RotateCcw, Medal, Timer, Calendar, X, Rocket } from 'lucide-react';
import { generateDailyQuests, getAIAdvice } from './services/gemini';

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {[...Array(100)].map((_, i) => {
        const size = Math.random() * 8 + 4;
        const color = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)];
        const delay = Math.random() * 0.5; 
        const duration = 2.5 + Math.random() * 2.5;
        const left = Math.random() * 100;
        const rotationStart = Math.random() * 360;
        const swingX = (Math.random() - 0.5) * 60;
        
        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '1px',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotationStart}deg)`,
              opacity: 0,
              '--swing-x': `${swingX}px`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) rotate(180deg) translateX(var(--swing-x)); }
          100% { transform: translateY(115vh) rotate(720deg) translateX(0); opacity: 0; }
        }
        .animate-confetti-fall { animation: confetti-fall cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [resources, setResources] = useState<Resource[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [timetable, setTimetable] = useState<Record<string, Record<string, TimetableSlot[]>>>(INITIAL_TIMETABLE);
  const [assessments, setAssessments] = useState<AssessmentMap>(INITIAL_ASSESSMENTS);
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreatingCountdown, setIsCreatingCountdown] = useState(false);
  const [newCountdownTitle, setNewCountdownTitle] = useState('');
  const [newCountdownDate, setNewCountdownDate] = useState('');
  
  // Blackout Mode State
  const [blackoutTask, setBlackoutTask] = useState<Task | null>(null);
  const [blackoutTime, setBlackoutTime] = useState(0);

  // XP Award States
  const [awardPopup, setAwardPopup] = useState<{ xp: number, message: string } | null>(null);
  const [isAwardExiting, setIsAwardExiting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Boss Alert Memo
  const isSystemAlert = useMemo(() => {
    const bossDueSoon = tasks.some(t => {
      if (!t.isBoss || t.completed) return false;
      const diff = new Date(t.dueDate).getTime() - Date.now();
      return diff > 0 && diff < 24 * 60 * 60 * 1000;
    });
    return bossDueSoon;
  }, [tasks]);

  // Handle Parallax and Theme Application
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const layer = document.getElementById('parallax-layer');
      if (layer) {
        layer.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isSystemAlert) {
      document.body.classList.add('system-alert');
    } else {
      document.body.classList.remove('system-alert');
    }
  }, [isSystemAlert]);

  // Blackout Timer Effect
  useEffect(() => {
    let interval: any;
    if (blackoutTask) {
      interval = setInterval(() => {
        setBlackoutTime(prev => prev + 1);
      }, 1000);
    } else {
      setBlackoutTime(0);
    }
    return () => clearInterval(interval);
  }, [blackoutTask]);

  useEffect(() => {
    const saved = localStorage.getItem('lifequest_state_v24');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(parsed.tasks || []);
      setMilestones(parsed.milestones || []);
      setStats(parsed.stats || INITIAL_STATS);
      setBooks(parsed.books || []);
      setCountdowns(parsed.countdowns || []);
      setResources(parsed.resources || []);
      setIdeas(parsed.ideas || []);
      if (parsed.timetable) setTimetable(parsed.timetable);
      if (parsed.assessments) setAssessments(parsed.assessments);
      if (parsed.rewards) setRewards(parsed.rewards);
      if (parsed.habits) setHabits(parsed.habits);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lifequest_state_v24', JSON.stringify({ 
      tasks, milestones, stats, timetable, assessments, rewards, habits, books, countdowns, resources, ideas 
    }));
  }, [tasks, milestones, stats, timetable, assessments, rewards, habits, books, countdowns, resources, ideas]);

  const handleManualXpAward = (xp: number, message: string, category?: TaskCategory) => {
    setStats(s => {
      let newXp = s.xp + xp;
      let newLevel = s.level;
      let newMaxXp = s.maxXp;
      if (newXp >= s.maxXp) {
        newLevel += 1;
        newXp -= s.maxXp;
        newMaxXp = Math.floor(s.maxXp * 1.5);
      }
      const newAttributes = { ...s.attributes };
      if (category) {
        if (category === TaskCategory.FITNESS) newAttributes.strength += 1;
        else if ([TaskCategory.STUDY, TaskCategory.SCHOOL, TaskCategory.HOMEWORK, TaskCategory.READING, TaskCategory.WORK].includes(category)) newAttributes.intelligence += 1;
        else if (category === TaskCategory.MINDFULNESS) newAttributes.wisdom += 1;
        else if (category === TaskCategory.HEALTH) newAttributes.vitality += 1;
        else if ([TaskCategory.SOCIAL, TaskCategory.CHORES].includes(category)) newAttributes.charisma += 1;
      }
      return { 
        ...s, 
        xp: newXp, 
        level: newLevel, 
        maxXp: newMaxXp, 
        gold: s.gold + (xp < 0 ? xp : Math.floor(xp/2)), 
        attributes: newAttributes 
      };
    });
    setAwardPopup({ xp, message });
    setIsAwardExiting(false);
    if (xp > 0) setShowConfetti(true);
    const exitTimer = setTimeout(() => setIsAwardExiting(true), 3800);
    const clearTimer = setTimeout(() => {
      setAwardPopup(null);
      setShowConfetti(false);
      setIsAwardExiting(false);
    }, 4500);
    return () => { clearTimeout(exitTimer); clearTimeout(clearTimer); };
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const now = new Date();
        const lastDate = h.lastCompleted ? new Date(h.lastCompleted) : null;
        if (lastDate && lastDate.toDateString() === now.toDateString()) return h;
        const diffInDays = lastDate ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        let newStreak = (lastDate && diffInDays === 1) ? h.streak + 1 : 1;
        handleManualXpAward(50, `Ritual Step: ${newStreak} cycles!`, h.category);
        return { ...h, streak: newStreak, lastCompleted: now.toISOString(), isFormed: newStreak >= 21 || h.isFormed };
      }
      return h;
    }));
  };

  const handleAddHabit = (title: string, category: TaskCategory) => {
    setHabits([...habits, { id: Math.random().toString(36).substr(2, 9), title, streak: 0, lastCompleted: null, isFormed: false, category, totalCompletions: 0 }]);
  };

  const handleDeleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));
  const handleBreakHabit = (id: string) => {
    handleManualXpAward(-50, "Vow Tax Applied. Ritual fragmented.", TaskCategory.MINDFULNESS);
    setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: 0, lastCompleted: null } : h));
  };

  const handleUpdateSlotField = (week: string, day: string, id: string, field: keyof TimetableSlot, value: string) => {
    setTimetable(prev => ({ ...prev, [week]: { ...prev[week], [day]: prev[week][day].map(s => s.id === id ? { ...s, [field]: value } : s) } }));
  };

  const handleToggleAttendance = (week: string, day: string, id: string) => {
    setTimetable(prev => {
      const slot = prev[week][day].find(s => s.id === id);
      const nextStatus = slot?.status === 'attended' ? 'missed' : (slot?.status === 'missed' ? 'pending' : 'attended');
      if (nextStatus === 'attended') handleManualXpAward(25, "Academy attendance logged.", TaskCategory.SCHOOL);
      return { ...prev, [week]: { ...prev[week], [day]: prev[week][day].map(s => s.id === id ? { ...s, status: nextStatus } : s) } };
    });
  };

  const handleUpdateAssessment = (key: string, value: string) => setAssessments(prev => ({ ...prev, [key]: value }));
  const handleCompleteWorkout = (xp: number, gold: number) => {
    handleManualXpAward(xp, "Vessel strengthened.", TaskCategory.FITNESS);
    setStats(s => ({ ...s, gold: s.gold + gold }));
  };

  const handleCompleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, subTasks: t.subTasks?.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st) } : t));
  };

  const handleUpdateStats = (updates: Partial<UserStats>) => setStats(prev => ({ ...prev, ...updates }));
  const handleResetProgress = () => { setStats(INITIAL_STATS); setTasks([]); setMilestones([]); setTimetable(INITIAL_TIMETABLE); setActiveTab('dashboard'); localStorage.removeItem('lifequest_state_v24'); };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id && !t.completed) {
        handleManualXpAward(t.xpValue, `Quest Cleared: ${t.title}`, t.category);
        if (blackoutTask?.id === id) setBlackoutTask(null);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const handleAddTime = (taskId: string, mins: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const currentMins = t.timeSpent || 0;
        const nextMins = currentMins + mins;
        
        if (Math.floor(nextMins / 30) > Math.floor(currentMins / 30)) {
          handleManualXpAward(25, `Grind Milestone: 30m extra effort on ${t.title}`, t.category);
        }
        
        return { ...t, timeSpent: nextMins };
      }
      return t;
    }));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([{ id: Math.random().toString(36).substr(2, 9), title: newTaskTitle, category: TaskCategory.SCHOOL, difficulty: Difficulty.MEDIUM, completed: false, xpValue: XP_VALUES[Difficulty.MEDIUM], goldValue: 75, dueDate: new Date().toISOString() }, ...tasks]);
    setNewTaskTitle('');
  };

  const handleAddBoss = (title: string, dueDate: string) => {
    const newBoss: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      category: TaskCategory.SCHOOL,
      difficulty: Difficulty.EPIC,
      completed: false,
      xpValue: 1000,
      goldValue: 500,
      dueDate: new Date(dueDate).toISOString(),
      isBoss: true,
      subTasks: [
        { id: Math.random().toString(36).substr(2, 4), title: 'Research & Reconnaissance', completed: false },
        { id: Math.random().toString(36).substr(2, 4), title: 'Draft Prototype / Strategy', completed: false },
        { id: Math.random().toString(36).substr(2, 4), title: 'Final Review & Submission', completed: false }
      ]
    };
    setTasks([newBoss, ...tasks]);
    handleManualXpAward(100, `Boss Raid Scribed: ${title}! Strategy mapped.`, TaskCategory.SCHOOL);
  };

  const handleAddMilestone = (title: string, date: string, category: Milestone['category'], isYearly?: boolean) => {
    const newMilestone: Milestone = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date: new Date(date).toISOString(),
      category,
      isYearly
    };
    setMilestones([newMilestone, ...milestones]);
    handleManualXpAward(25, `Temporal Marker Set: ${title}! History in the making.`, TaskCategory.SOCIAL);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleCreateCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountdownTitle || !newCountdownDate) return;
    setCountdowns([...countdowns, { id: Math.random().toString(36).substr(2, 9), title: newCountdownTitle, targetDate: newCountdownDate, color: 'blue' }]);
    setIsCreatingCountdown(false);
  };

  const handleAddBook = (title: string, author: string) => {
    setBooks([...books, { id: Math.random().toString(36).substr(2, 9), title, author, completed: false }]);
  };

  const handleDeleteBook = (id: string) => setBooks(books.filter(b => b.id !== id));

  const handleCompleteBook = (id: string, xp: number, gold: number, difficulty: Difficulty, feedback: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, completed: true, difficulty, dateCompleted: new Date().toISOString() } : b));
    handleManualXpAward(xp, feedback, TaskCategory.READING);
    setStats(s => ({ ...s, gold: s.gold + gold }));
  };

  const handlePurchaseReward = (reward: Reward) => {
    if (stats.gold >= reward.cost) {
      setStats(s => ({ ...s, gold: s.gold - reward.cost }));
      handleManualXpAward(0, `Acquired: ${reward.title}! Enjoy your reward.`, TaskCategory.SCREEN_TIME);
    }
  };

  const handleAddReward = (reward: Omit<Reward, 'id'>) => {
    setRewards([...rewards, { ...reward, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleDeleteReward = (id: string) => setRewards(rewards.filter(r => r.id !== id));

  const formatBlackoutTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderDashboard = () => {
    const siegeDate = new Date("2026-02-02");
    const showSiege = new Date() < siegeDate;
    
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          <div className="xl:col-span-5 w-full flex flex-col h-full">
            <CharacterStats stats={stats} />
          </div>
          
          <div className="xl:col-span-4 flex flex-col gap-8 w-full h-full">
            {showSiege && <CountdownWidget targetDate="2026-02-02" isStatic={true} />}
            {countdowns.map(cd => (
              <CountdownWidget 
                key={cd.id} 
                title={cd.title} 
                targetDate={cd.targetDate} 
                color={cd.color} 
                onDelete={() => setCountdowns(countdowns.filter(c => c.id !== cd.id))} 
              />
            ))}
            
            <div className="rpg-card rounded-[2.5rem] p-8 bg-slate-950/40 relative group overflow-hidden border border-white/5 min-h-[220px] flex items-center justify-center flex-1">
               {!isCreatingCountdown ? (
                 <div className="flex flex-col gap-5 items-center text-center">
                   <div className="p-4 bg-gradient-to-br from-blue-600/20 to-indigo-700/20 rounded-2xl border border-white/10 group-hover:scale-105 transition-all">
                     <Timer className="text-blue-400 opacity-60" size={36} />
                   </div>
                   <button 
                    onClick={() => setIsCreatingCountdown(true)} 
                    className="px-8 py-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white"
                   >
                    Forge Temporal Node
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleCreateCountdown} className="space-y-4 w-full">
                    <input type="text" placeholder="Quest Title" value={newCountdownTitle} onChange={e => setNewCountdownTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    <input type="date" value={newCountdownDate} onChange={e => setNewCountdownDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setIsCreatingCountdown(false)} className="flex-1 py-3 bg-slate-900 text-slate-500 text-[10px] font-black uppercase rounded-lg">Abort</button>
                      <button type="submit" className="flex-1 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg">Seal</button>
                    </div>
                 </form>
               )}
            </div>
          </div>

          <div className="xl:col-span-3 w-full h-full flex flex-col">
            <WeatherWidget />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Active Battlegrounds</h2>
              <button 
                onClick={async () => { setIsGenerating(true); const q = await generateDailyQuests(stats); setTasks([...q.map((t:any)=>({...t, id:Math.random().toString(36).substr(2,9), completed:false, xpValue:150, goldValue:75, dueDate:new Date().toISOString()})), ...tasks]); setIsGenerating(false); }} 
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} Summon Quests
              </button>
            </div>

            <form onSubmit={addTask} className="px-2 relative flex items-center">
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                placeholder="Declare a new objective..." 
                className="w-full bg-slate-950/50 border-2 border-slate-800/50 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none pr-16 shadow-inner text-lg placeholder:text-slate-700" 
              />
              <button type="submit" className="absolute right-5 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 active:scale-90 transition-all">
                <Plus size={24} />
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              {tasks.filter(t => !t.completed && !t.isBoss && !t.isSideQuest).map(task => (
                <div key={task.id} className="relative group">
                  <QuestCard task={task} onComplete={handleCompleteTask} onDelete={id => setTasks(tasks.filter(t => t.id !== id))} />
                  <button onClick={() => setBlackoutTask(task)} className="absolute bottom-4 right-14 p-2 bg-slate-950/80 rounded-lg text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-white/10" title="Enter Focus Mode"><Rocket size={16} /></button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-8">
            <SideQuestList tasks={tasks} onComplete={handleCompleteTask} />
          </div>

          <div className="lg:col-span-12 mt-8">
            <CurrentTimeWidget />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} gold={stats.gold}>
      {showConfetti && <Confetti />}
      
      {blackoutTask && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent-primary-glow)_0%,_transparent_70%)] opacity-20" />
          <button onClick={() => setBlackoutTask(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white p-4 rounded-full border border-white/10 transition-all"><X size={32} /></button>
          
          <div className="relative z-10 text-center space-y-12 max-w-4xl w-full">
            <div className="space-y-4">
              <span className="text-blue-400 font-black text-xl uppercase tracking-[0.6em] animate-pulse">Deep Focus Activated</span>
              <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">{blackoutTask.title}</h2>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="text-9xl font-black text-white tabular-nums tracking-tighter text-glow">{formatBlackoutTime(blackoutTime)}</div>
              <p className="text-slate-500 font-black uppercase tracking-[0.4em]">Time in flow state</p>
            </div>

            <div className="pt-12">
              <button 
                onClick={() => handleCompleteTask(blackoutTask.id)}
                className="px-16 py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[3rem] font-black text-2xl uppercase tracking-widest shadow-[0_0_60px_rgba(37,99,235,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                Objective Cleared
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-10 text-slate-800 text-sm font-black uppercase tracking-widest">Scriptorum Protocol 04 // No Distractions</div>
        </div>
      )}
      
      {awardPopup && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-6 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAwardExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-700" />
          <div className={`relative bg-slate-900 border-4 ${awardPopup.xp < 0 ? 'border-red-500 shadow-[0_0_120px_rgba(239,68,68,0.4)]' : 'border-blue-500 shadow-[0_0_120px_rgba(59,130,246,0.4)]'} p-14 rounded-[4rem] text-center animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 overflow-hidden max-w-2xl ring-8 ring-slate-950`}>
             <div className={`absolute inset-0 bg-gradient-to-br ${awardPopup.xp < 0 ? 'from-red-500/10' : 'from-blue-500/10'} via-transparent to-white/5 pointer-events-none`} />
             <div className={`absolute -top-16 left-1/2 -translate-x-1/2 ${awardPopup.xp < 0 ? 'bg-gradient-to-br from-red-500 to-rose-700' : 'bg-gradient-to-br from-blue-500 to-indigo-700'} p-8 rounded-full shadow-2xl border-4 border-slate-950 animate-bounce`}>
                {awardPopup.xp < 0 ? <ShieldCheck size={52} className="text-white drop-shadow-md" /> : <Medal size={52} className="text-white drop-shadow-md" />}
             </div>
             <div className="mt-10 space-y-8">
                <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl">{awardPopup.xp < 0 ? "Vow Penalty" : "Oracle's Reward"}</h4>
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border-2 border-white/10 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <p className={`text-6xl font-black ${awardPopup.xp < 0 ? 'text-red-500' : 'text-blue-400'} tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]`}>{awardPopup.xp > 0 ? '+' : ''}{awardPopup.xp} XP</p>
                  <p className={`text-2xl font-black mt-3 ${awardPopup.xp < 0 ? 'text-red-600' : 'text-yellow-400'} uppercase tracking-[0.2em]`}>{awardPopup.xp > 0 ? '+' : ''}{awardPopup.xp < 0 ? awardPopup.xp : Math.floor(awardPopup.xp/2)} GOLD</p>
                </div>
                <p className="text-slate-200 font-bold italic text-2xl leading-relaxed max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500 fill-mode-both">"{awardPopup.message}"</p>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'habits' && <HabitTracker habits={habits} onToggleHabit={handleToggleHabit} onAddHabit={handleAddHabit} onDeleteHabit={handleDeleteHabit} onBreakHabit={handleBreakHabit} />}
      {activeTab === 'scriptorium' && <Scriptorium resources={resources} setResources={setResources} ideas={ideas} setIdeas={setIdeas} onManualXpAward={handleManualXpAward} />}
      {activeTab === 'archive' && <TheGreatArchive books={books} onAddBook={handleAddBook} onDeleteBook={handleDeleteBook} onCompleteBook={handleCompleteBook} />}
      {activeTab === 'routine' && <DailyRoutine tasks={tasks} timetable={timetable} assessments={assessments} habits={habits} />}
      {activeTab === 'academy' && <AcademyTimetable timetable={timetable} onUpdateSlotField={handleUpdateSlotField} onToggleAttendance={handleToggleAttendance} />}
      {activeTab === 'assessments' && <AssessmentPlanner assessments={assessments} onUpdate={handleUpdateAssessment} />}
      {activeTab === 'training' && <TrainingGrounds onCompleteWorkout={handleCompleteWorkout} />}
      {activeTab === 'operations' && <WarRoom tasks={tasks} onCompleteSubTask={handleCompleteSubTask} onCompleteTask={handleCompleteTask} onAddTime={handleAddTime} onManualXpAward={handleManualXpAward} onAddBoss={handleAddBoss} />}
      {activeTab === 'calendar' && <AdventurerCalendar tasks={tasks} milestones={milestones} onAddMilestone={handleAddMilestone} onDeleteMilestone={handleDeleteMilestone} />}
      {activeTab === 'shop' && <Treasury gold={stats.gold} rewards={rewards} onPurchase={handlePurchaseReward} onAddReward={handleAddReward} onDeleteReward={handleDeleteReward} />}
      {activeTab === 'settings' && <Profile stats={stats} onUpdateStats={handleUpdateStats} onReset={handleResetProgress} />}
    </Layout>
  );
};

export default App;
