
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import CharacterStats from './components/CharacterStats';
import QuestCard from './components/QuestCard';
import AdventurerCalendar from './components/AdventurerCalendar';
import AcademyTimetable from './components/AcademyTimetable';
import DailyRoutine from './components/DailyRoutine';
import HabitTracker from './components/HabitTracker';
import WeatherWidget from './components/WeatherWidget';
import TheGreatArchive from './components/TheGreatArchive';
import Treasury from './components/Treasury';
import Profile from './components/Profile';
import CurrentTimeWidget from './components/CurrentTimeWidget';
import Scriptorium from './components/Scriptorium';
import PostureScanner from './components/PostureScanner';
import WaterWidget from './components/WaterWidget';
import OracleChat from './components/OracleChat';
import ChoreChart from './components/ChoreChart';
import TrainingGrounds from './components/TrainingGrounds';
import FocusForge from './components/FocusForge';
import { Task, UserStats, TaskCategory, Difficulty, Reward, TimetableSlot, Habit, Book, Countdown, Resource, ContentIdea, Milestone } from './types';
import { INITIAL_STATS, DEFAULT_REWARDS, INITIAL_HABITS, INITIAL_BOOKS, INITIAL_TIMETABLE, XP_VALUES } from './constants';
import { Plus, Loader2, Activity, CheckCircle2, ShieldAlert, Trophy, Target, LayoutDashboard, Calendar, Rocket, Flame, Skull, X, Sword, Zap, ArrowUpDown, SortAsc, SortDesc, AlertTriangle, Trash2, Cloud, Wifi, Code2, Terminal, ChevronRight, Globe, Layers } from 'lucide-react';
import { db, isConfigValid } from './services/firebase';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; provider?: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Character Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [resources, setResources] = useState<Resource[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [timetable, setTimetable] = useState<Record<string, Record<string, TimetableSlot[]>>>(INITIAL_TIMETABLE);
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  
  // UI States
  const [awardPopup, setAwardPopup] = useState<{ xp: number, message: string } | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  // Form States for Modals
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddRaid, setShowAddRaid] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>(TaskCategory.STUDY);
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);

  // LOAD USER SESSION
  useEffect(() => {
    const savedUser = localStorage.getItem('lifequest_active_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // DATA RECONCILIATION
  const reconcileData = useCallback((newData: any) => {
    setTasks(newData.tasks || []);
    setMilestones(newData.milestones || []);
    setStats(newData.stats || { ...INITIAL_STATS, name: user?.name || INITIAL_STATS.name });
    setBooks(newData.books || []);
    setCountdowns(newData.countdowns || []);
    setResources(newData.resources || []);
    setIdeas(newData.ideas || []);
    if (newData.timetable) setTimetable(newData.timetable);
    if (newData.rewards) setRewards(newData.rewards);
    if (newData.habits) setHabits(newData.habits);
    setIsDataLoaded(true);
    setLastSyncTime(new Date());
  }, [user]);

  // LOAD PERSISTENT (CLOUD OR LOCAL)
  useEffect(() => {
    if (!user) return;
    const initializeData = async () => {
      setIsCloudSyncing(true);
      
      if (isConfigValid && db) {
        try {
          const userDocRef = doc(db, "users", user.email);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            reconcileData(docSnap.data());
            setIsCloudSyncing(false);
            return;
          }
        } catch (err) {
          console.error("Cloud Retrieval Failed. Using local backups.", err);
        }
      }

      // FALLBACK TO LOCAL
      const userKey = `lifequest_state_${user.email}`;
      const saved = localStorage.getItem(userKey);
      await new Promise(resolve => setTimeout(resolve, 800));
      if (saved) reconcileData(JSON.parse(saved));
      else reconcileData({ stats: { ...INITIAL_STATS, name: user.name } });
      setIsCloudSyncing(false);
    };
    initializeData();
  }, [user, reconcileData]);

  // AUTO-SYNC TO CLOUD (WATCHES ALL DATA CHANGES)
  useEffect(() => {
    if (!user || !isDataLoaded) return;
    
    const syncData = async () => {
      setIsPulsing(true);
      const userKey = `lifequest_state_${user.email}`;
      const payload = { tasks, milestones, stats, timetable, rewards, habits, books, countdowns, resources, ideas };
      
      // Update Local Backup
      localStorage.setItem(userKey, JSON.stringify(payload));

      if (isConfigValid && db) {
        try {
          // Push to Firebase Citadel
          await setDoc(doc(db, "users", user.email), payload);
          setLastSyncTime(new Date());
        } catch (err) {
          console.warn("Cloud Sync Dropped. Retrying on next state change.", err);
        }
      }
      
      setTimeout(() => setIsPulsing(false), 1000);
    };

    syncData();
  }, [user, tasks, milestones, stats, timetable, rewards, habits, books, countdowns, resources, ideas, isDataLoaded]);

  const handleLogin = (userData: { name: string; email: string; provider: string }) => {
    setUser(userData);
    localStorage.setItem('lifequest_active_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lifequest_active_user');
  };

  const handleManualXpAward = (xp: number, message: string, category?: TaskCategory, attr?: Task['associatedAttribute']) => {
    if (xp === 0) return;
    setStats(s => {
      if (xp < 0) return { ...s, xp: Math.max(0, s.xp + xp), gold: Math.max(0, s.gold + Math.floor(xp / 2)) };
      let newXp = s.xp + xp;
      let newLevel = s.level;
      let newMaxXp = s.maxXp;
      if (newXp >= s.maxXp) {
        newLevel += 1;
        newXp -= s.maxXp;
        newMaxXp = Math.floor(s.maxXp * 1.5);
      }
      return { ...s, xp: newXp, level: newLevel, maxXp: newMaxXp, gold: s.gold + Math.floor(xp / 2) };
    });
    setAwardPopup({ xp, message });
    setTimeout(() => setAwardPopup(null), 3000);
  };

  const handleCreateTask = (isBoss: boolean) => {
    if (!newTitle.trim()) return;
    const xpValue = XP_VALUES[newDifficulty];
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      completed: false,
      xpValue,
      goldValue: Math.floor(xpValue / 2),
      dueDate: new Date(newDueDate).toISOString(),
      isBoss,
      isSideQuest: !isBoss
    };
    setTasks([...tasks, newTask]);
    setNewTitle('');
    setShowAddTask(false);
    setShowAddRaid(false);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const manifestItems = useMemo(() => {
    const filtered = tasks.filter(t => t.isSideQuest && !t.completed);
    return filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [tasks, sortOrder]);

  const renderDashboard = () => {
    const activeRaids = tasks.filter(t => t.isBoss && !t.completed);
    
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-700">
        {/* Visual Sync HUD */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
          {isCloudSyncing ? (
             <div className="bg-black border border-cyan-500/40 px-6 py-2 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                <Loader2 className="text-cyan-400 animate-spin" size={16} />
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">Neural Retrieval Active</span>
             </div>
          ) : isPulsing ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 px-6 py-2 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(57,255,20,0.2)] animate-pulse">
                <Wifi className="text-emerald-400 animate-bounce" size={16} />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em]">Cloud Sync: Pulsing</span>
            </div>
          ) : isConfigValid ? (
             <div className="bg-black/60 border border-emerald-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md transition-opacity duration-1000 opacity-60">
                <Cloud className="text-emerald-500" size={10} />
                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">NEXUS LINK SECURED {lastSyncTime ? `• LAST SYNC: ${lastSyncTime.toLocaleTimeString()}` : ''}</span>
             </div>
          ) : null}
        </div>
        
        <div className="space-y-6">
          <div className="px-2">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-blue leading-none">Command Center</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] mt-3 flex items-center gap-3">
              <Activity className="text-cyan-400 animate-pulse" size={14} /> Linked to Neural Citadel Node
            </p>
          </div>
          <CharacterStats stats={stats} onScanClick={() => setActiveTab('stance')} />
        </div>

        <div className="w-full"><CurrentTimeWidget /></div>

        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter glow-text-red flex items-center gap-4"><Skull size={24} className="text-red-500" /> Tactical Raids</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowAddRaid(true)} className="p-3 bg-red-600 rounded-xl text-white shadow-xl border-b-2 border-red-800 active:scale-95 transition-all"><Plus size={20} /></button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRaids.map(raid => (
                <div key={raid.id} className="rpg-card rounded-[2.5rem] p-8 border-red-500/20 bg-slate-950/60 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Flame size={120} className="text-red-600" /></div>
                   <div className="relative z-10 flex justify-between items-center gap-6">
                      <div className="min-w-0">
                         <span className="px-3 py-0.5 bg-red-600 text-white font-black text-[8px] uppercase tracking-widest rounded-full mb-3 inline-block">BOSS LEVEL</span>
                         <h4 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none truncate">{raid.title}</h4>
                         <p className="text-[9px] text-slate-500 mt-3 font-black uppercase tracking-widest">DEADLINE: {new Date(raid.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setTaskToDelete(raid)} className="shrink-0 p-4 bg-slate-900 border border-white/5 text-slate-500 hover:text-red-500 rounded-2xl transition-all shadow-lg active:scale-95"><Trash2 size={18} /></button>
                        <button onClick={() => {
                          setTasks(tasks.map(t => t.id === raid.id ? {...t, completed: true} : t));
                          handleManualXpAward(raid.xpValue, `Boss Terminated: ${raid.title}`);
                        }} className="shrink-0 px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Strike</button>
                      </div>
                   </div>
                </div>
              ))}
              {activeRaids.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
                  <CheckCircle2 size={40} className="text-slate-800 mx-auto mb-4" />
                  <p className="pixel-font text-[8px] uppercase tracking-widest text-slate-700">All Sectors Secure. Raids Cleared.</p>
                </div>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
           <WeatherWidget />
           <WaterWidget currentWater={stats.dailyWater} onUpdateWater={m => setStats({...stats, dailyWater: Math.max(0, stats.dailyWater + m)})} />
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter glow-text-blue flex items-center gap-4"><Rocket size={24} className="text-cyan-400" /> Daily Manifest</h3>
             <div className="flex items-center gap-3">
               <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all shadow-md"
                title={`Sort by Due Date (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
               >
                 {sortOrder === 'asc' ? <SortAsc size={14} className="text-cyan-400" /> : <SortDesc size={14} className="text-cyan-400" />}
                 <span className="hidden sm:inline">Timeline: {sortOrder === 'asc' ? 'Soonest' : 'Latest'}</span>
               </button>
               <button onClick={() => setShowAddTask(true)} className="p-3 bg-cyan-600 rounded-xl text-white shadow-xl border-b-2 border-cyan-800 active:scale-95 transition-all"><Plus size={20} /></button>
             </div>
           </div>
           <div className="rpg-card rounded-[3rem] p-8 border-cyan-500/20 bg-slate-950/60 shadow-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {manifestItems.map(item => (
                   <QuestCard key={item.id} task={item} onComplete={id => {
                     setTasks(tasks.map(t => t.id === id ? {...t, completed: true} : t));
                     handleManualXpAward(item.xpValue, `Objective Cleared: ${item.title}`);
                   }} onDelete={id => setTaskToDelete(tasks.find(t => t.id === id) || null)} />
                 ))}
                 {manifestItems.length === 0 && (
                   <div className="col-span-full py-12 text-center opacity-30">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No Active Manifest Objectives</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {taskToDelete && (
          <div className="fixed inset-0 z-[10003] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
             <div className="relative w-full max-w-md bg-slate-950 border-2 border-red-500/40 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(255,0,0,0.2)] animate-in zoom-in-95 duration-300">
               <div className="text-center space-y-8">
                 <div className="flex justify-center">
                    <div className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-red-500 shadow-2xl">
                      <AlertTriangle size={48} className="animate-pulse" />
                    </div>
                 </div>
                 <div className="space-y-3">
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter glow-text-red">Abandon Quest?</h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                     De-initializing objective: <span className="text-white">"{taskToDelete.title}"</span>. This action will purge this entry from the temporal matrix forever.
                   </p>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => setTaskToDelete(null)} className="flex-1 py-5 bg-slate-900 border-2 border-white/5 rounded-2xl text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Keep Quest</button>
                   <button onClick={confirmDeleteTask} className="flex-1 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 border-b-4 border-red-800">Destroy Quest</button>
                 </div>
               </div>
             </div>
          </div>
        )}

        {(showAddTask || showAddRaid) && (
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`relative w-full max-w-xl bg-slate-950 border-2 rounded-[3.5rem] p-10 md:p-14 shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300 ${showAddRaid ? 'border-red-500/40' : 'border-cyan-500/40'}`}>
              <button onClick={() => { setShowAddTask(false); setShowAddRaid(false); }} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors bg-black/40 rounded-xl border border-white/5">
                <X size={24} />
              </button>

              <div className="text-center space-y-10">
                <div className="space-y-3">
                  <div className="flex justify-center mb-6">
                    <div className={`p-5 rounded-[1.5rem] border-2 shadow-2xl ${showAddRaid ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500'}`}>
                      {showAddRaid ? <Skull size={40} /> : <Sword size={40} />}
                    </div>
                  </div>
                  <h3 className={`text-4xl font-black text-white uppercase italic tracking-tighter leading-none ${showAddRaid ? 'glow-text-red' : 'glow-text-blue'}`}>
                    {showAddRaid ? 'Forge Raid' : 'Forge Quest'}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Initialize new temporal objective</p>
                </div>

                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Designation</label>
                    <input 
                      type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      placeholder="Enter objective name..." 
                      className="w-full bg-black border-2 border-white/5 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-800 shadow-inner"
                      autoFocus
                    />
                  </div>

                  {!showAddRaid && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Sector</label>
                        <select 
                          value={newCategory} onChange={e => setNewCategory(e.target.value as TaskCategory)}
                          className="w-full bg-black border-2 border-white/5 rounded-[1.5rem] px-6 py-4 text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                        >
                          {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Challenge Class</label>
                        <select 
                          value={newDifficulty} onChange={e => setNewDifficulty(e.target.value as Difficulty)}
                          className="w-full bg-black border-2 border-white/5 rounded-[1.5rem] px-6 py-4 text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                        >
                          {Object.values(Difficulty).map(diff => <option key={diff} value={diff}>{diff}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Temporal Target (Due Date)</label>
                    <input 
                      type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
                      className="w-full bg-black border-2 border-white/5 rounded-[1.5rem] px-8 py-4 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => { setShowAddTask(false); setShowAddRaid(false); }} className="flex-1 py-6 bg-slate-900 border-2 border-white/5 rounded-[2rem] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Abort</button>
                  <button onClick={() => handleCreateTask(showAddRaid)} className={`flex-[2] py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 ${showAddRaid ? 'bg-red-600 text-white shadow-red-900/40' : 'bg-cyan-600 text-white shadow-cyan-900/40'}`}>
                    Initialize Objective
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} gold={stats.gold} onLogout={handleLogout}>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'oracle' && <OracleChat stats={stats} tasks={tasks} habits={habits} onExecuteAction={() => {}} />}
      {activeTab === 'focus' && <FocusForge onManualXpAward={handleManualXpAward} />}
      {activeTab === 'chores' && <ChoreChart stats={stats} onUpdateStats={u => setStats({...stats, ...u})} onManualXpAward={handleManualXpAward} />}
      {activeTab === 'habits' && <HabitTracker habits={habits} onToggleHabit={id => setHabits(habits.map(h => h.id === id ? {...h, streak: h.streak+1, lastCompleted: new Date().toISOString()} : h))} onAddHabit={(t, c) => setHabits([...habits, {id: Math.random().toString(), title: t, streak: 0, lastCompleted: null, isFormed: false, category: c, totalCompletions: 0}])} onDeleteHabit={id => setHabits(habits.filter(h => h.id !== id))} onBreakHabit={() => {}} stats={stats} onUpdateWater={m => setStats({...stats, dailyWater: Math.max(0, stats.dailyWater + m)})} />}
      {activeTab === 'scriptorium' && <Scriptorium resources={resources} setResources={setResources} ideas={ideas} setIdeas={setIdeas} onManualXpAward={handleManualXpAward} />}
      {activeTab === 'stance' && <PostureScanner onManualXpAward={handleManualXpAward} lastPostureCheck={stats.lastPostureCheck} />}
      {activeTab === 'archive' && <TheGreatArchive books={books} onAddBook={(t, a) => setBooks([...books, {id: Math.random().toString(), title: t, author: a, completed: false}])} onDeleteBook={id => setBooks(books.filter(b => b.id !== id))} onCompleteBook={(id, x, g, d, f) => { setBooks(books.map(b => b.id === id ? {...b, completed: true, difficulty: d} : b)); handleManualXpAward(x, f); }} />}
      {activeTab === 'routine' && <DailyRoutine tasks={tasks} timetable={timetable} assessments={{}} habits={habits} countdowns={countdowns} milestones={milestones} />}
      {activeTab === 'academy' && <AcademyTimetable timetable={timetable} tasks={tasks} onUpdateSlotField={() => {}} onToggleAttendance={() => {}} />}
      {activeTab === 'training' && <TrainingGrounds onCompleteWorkout={(x, g, d) => handleManualXpAward(x, "Training Cycle Secured.")} setActiveTab={setActiveTab} />}
      {activeTab === 'calendar' && <AdventurerCalendar tasks={tasks} milestones={milestones} onAddMilestone={(t, d, c, y) => setMilestones([...milestones, {id: Math.random().toString(), title: t, date: d, category: c, isYearly: y, completed: false}])} onDeleteMilestone={id => setMilestones(milestones.filter(m => m.id !== id))} onToggleMilestone={id => setMilestones(milestones.map(m => m.id === id ? {...m, completed: !m.completed} : m))} />}
      {activeTab === 'shop' && <Treasury gold={stats.gold} rewards={rewards} onPurchase={r => setStats({...stats, gold: stats.gold - r.cost})} onAddReward={r => setRewards([...rewards, {...r, id: Math.random().toString()}])} onDeleteReward={id => setRewards(rewards.filter(r => r.id !== id))} />}
      
      {activeTab === 'settings' && (
        <div className="space-y-12">
          <Profile stats={stats} onUpdateStats={u => setStats({...stats, ...u})} onReset={() => { localStorage.clear(); window.location.reload(); }} />
          
          {/* EXPANSION AND DEPLOYMENT HUB */}
          <div className="rpg-card p-10 md:p-14 rounded-[4rem] border-emerald-500/30 bg-slate-950 shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Code2 size={180} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-6 mb-12 relative z-10">
              <div className="p-4 bg-emerald-500/20 rounded-[1.5rem] text-emerald-400 border border-emerald-500/40">
                <Terminal size={32} />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic glow-text-green">Expansion Protocol</h3>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-2">Dossier: The Sacred Deployment Ritual</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
               {/* STEP 1: LINKING CODE */}
               <div className="space-y-8 p-8 rounded-[3rem] bg-black/40 border border-white/5">
                  <div className="flex items-center gap-4">
                    <Layers size={24} className="text-emerald-400" />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Phase 1: The Neural Link</h4>
                  </div>
                  <div className="space-y-4 text-sm text-slate-400 font-medium leading-relaxed">
                    <p>To connect this code to your personal Firebase Citadel:</p>
                    <ol className="space-y-3 list-decimal list-inside text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      <li>Open <span className="text-emerald-500">services/firebase.ts</span></li>
                      <li>Go to Firebase Console &gt; Project Settings</li>
                      <li>Copy your <span className="text-white">firebaseConfig</span> object</li>
                      <li>Paste the values into the placeholders</li>
                    </ol>
                  </div>
               </div>

               {/* STEP 2: DEPLOYING CODE */}
               <div className="space-y-8 p-8 rounded-[3rem] bg-black/40 border border-white/5">
                  <div className="flex items-center gap-4">
                    <Globe size={24} className="text-blue-400" />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Phase 2: Global Ascension</h4>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Run these commands to push local changes live:</p>
                    {[
                      { step: "npm run build", desc: "Forges your TSX lore into a dist bundle." },
                      { step: "firebase deploy", desc: "Broadcasts your dist bundle to the global net." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                        <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg font-black text-[10px]">{i+1}</div>
                        <div>
                          <p className="text-white font-mono text-xs mb-1">{item.step}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="mt-10 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed text-center">
                 Changes made to your Hero data (XP/Gold) are saved <span className="text-emerald-400">immediately</span> to the database. <br/>
                 Changes made to the code (UI/Features) require the <span className="text-blue-400">Deployment Ritual</span>.
               </p>
            </div>
          </div>
        </div>
      )}

      {awardPopup && (
        <div className="fixed bottom-24 right-12 z-[5000] animate-in slide-in-from-right duration-700">
          <div className="rpg-card rounded-[2.5rem] p-8 border-cyan-500/40 bg-black/90 shadow-[0_0_50px_rgba(0,242,255,0.3)] flex items-center gap-6">
            <div className="p-4 bg-cyan-600 rounded-2xl text-white shadow-xl animate-bounce"><Trophy size={28} /></div>
            <div>
              <p className="text-3xl font-black text-cyan-400 leading-none">+{awardPopup.xp} XP</p>
              <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest italic">{awardPopup.message}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default App;
