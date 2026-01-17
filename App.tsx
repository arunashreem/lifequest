
import React, { useState, useEffect, useCallback } from 'react';
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
import { Task, UserStats, TaskCategory, Difficulty, Reward, TimetableSlot, AssessmentMap, Habit, Book, Countdown } from './types';
import { INITIAL_STATS, XP_VALUES, DEFAULT_REWARDS, REWARD_ICONS, INITIAL_HABITS, INITIAL_BOOKS } from './constants';
import { Plus, Sparkles, Wand2, Loader2, ScrollText, Trophy, Clock, ShieldCheck, Zap, RefreshCw, Trash2, Hammer, RotateCcw, Medal, Timer, Calendar } from 'lucide-react';
import { generateDailyQuests, getAIAdvice } from './services/gemini';

const createBaseDay = (): TimetableSlot[] => [
  { id: 'rc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: '', type: 'rollcall', status: 'pending', classroom: '', teacher: '' },
  { id: 'p1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'p2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 're', label: 'Recess', startTime: '10:26', endTime: '10:56', subject: 'Stamina Recharge', type: 'break', status: 'pending', classroom: '', teacher: '' },
  { id: 'p3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'p4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'lu', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Grand Feast', type: 'break', status: 'pending', classroom: '', teacher: '' },
  { id: 'p5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'p6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'ht', label: 'Home Time', startTime: '15:00', endTime: '15:15', subject: 'Exit Dungeon', type: 'break', status: 'pending', classroom: '', teacher: '' },
  { id: 'wh', label: 'Walking Home', startTime: '15:15', endTime: '15:45', subject: 'Stamina Quest: Walk Home', type: 'class', status: 'pending', classroom: 'Outdoors', teacher: 'Hero' },
  { id: 'ch1', label: 'Chore Quest', startTime: '16:00', endTime: '16:30', subject: 'Household Objective', type: 'class', status: 'pending', classroom: 'Home Base', teacher: 'Hero Duty' },
];

const createWednesdayDay = (): TimetableSlot[] => [
  { id: 'rc', label: 'Roll Call', startTime: '09:23', endTime: '09:33', subject: '', type: 'rollcall', status: 'pending', classroom: '', teacher: '' },
  { id: 'p2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 're', label: 'Recess', startTime: '10:26', endTime: '10:56', subject: 'Stamina Recharge', type: 'break', status: 'pending', classroom: '', teacher: '' },
  { id: 'p3', label: 'Period 3', startTime: '10:56', endTime: '11:49', subject: 'Academy Study Hall', type: 'class', status: 'pending', classroom: 'Library', teacher: 'Self-Directed' },
  { id: 'p4', label: 'Period 4', startTime: '11:49', endTime: '12:42', subject: 'Library Research Quest', type: 'class', status: 'pending', classroom: 'Library', teacher: 'Self-Directed' },
  { id: 'lu', label: 'Lunch', startTime: '12:42', endTime: '13:12', subject: 'Grand Feast', type: 'break', status: 'pending', classroom: '', teacher: '' },
  { id: 'p5', label: 'Period 5', startTime: '13:12', endTime: '14:05', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'p6', label: 'Period 6', startTime: '14:05', endTime: '14:58', subject: '', type: 'class', status: 'pending', classroom: '', teacher: '' },
  { id: 'ht', label: 'Home Time', startTime: '14:58', endTime: '15:10', subject: 'Exit Dungeon', type: 'break', status: 'pending', classroom: '', teacher: '' },
  { id: 'wh', label: 'Walking Home', startTime: '15:10', endTime: '15:40', subject: 'Stamina Quest: Walk Home', type: 'class', status: 'pending', classroom: 'Outdoors', teacher: 'Hero' },
  { id: 'ch1', label: 'Chore Quest', startTime: '16:00', endTime: '16:30', subject: 'Sanctum Cleanse: Room Reset', type: 'class', status: 'pending', classroom: 'Home Base', teacher: 'Hero Duty' },
];

const INITIAL_TIMETABLE: Record<string, Record<string, TimetableSlot[]>> = {
  'Week A': {
    'Monday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'History & Geography', classroom: 'D.G.10', teacher: 'Ms Rachel Muss' };
      if (s.id === 'p2') return { ...s, subject: 'PDHPE', classroom: 'PRAC.6', teacher: 'Mr Ed Pearce' };
      if (s.id === 'p3') return { ...s, subject: 'Languages', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' };
      if (s.id === 'p4') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p5') return { ...s, subject: 'Food Technology', classroom: 'T.05', teacher: 'Miss Ayna Shah' };
      if (s.id === 'p6') return { ...s, subject: 'Visual Arts', classroom: 'A.G.46', teacher: 'Mrs Kim Clemson' };
      if (s.id === 'ch1') return { ...s, subject: 'Empty Dishwasher', classroom: 'Kitchen', teacher: 'Manual' };
      return s;
    }),
    'Tuesday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'MUSTER.3', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'Maths', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'p2') return { ...s, subject: 'History & Geography', classroom: 'D.G.10', teacher: 'Ms Rachel Muss' };
      if (s.id === 'p3') return { ...s, subject: 'Languages', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' };
      if (s.id === 'p4') return { ...s, subject: 'Science', classroom: 'F.12', teacher: 'Mr Bala Mathy' };
      if (s.id === 'p5') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p6') return { ...s, subject: 'Music', classroom: 'D.1.08', teacher: 'DUGN' };
      if (s.id === 'ch1') return { ...s, subject: 'Hang Clothes', classroom: 'Laundry', teacher: 'Manual' };
      return s;
    }),
    'Wednesday': createWednesdayDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p2') return { ...s, subject: 'PDHPE', classroom: 'D.G.01', teacher: 'Mr Ed Pearce' };
      if (s.id === 'p5') return { ...s, subject: 'History & Geography', classroom: 'D.G.10', teacher: 'Ms Shamma Faruque' };
      if (s.id === 'p6') return { ...s, subject: 'Science', classroom: 'F.11', teacher: 'Mr Bala Mathy' };
      if (s.id === 'ch1') return { ...s, subject: 'Clean Room + Trash', classroom: 'Sanctum', teacher: 'Manual' };
      return s;
    }),
    'Thursday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'PDHPE', classroom: 'D.G.01', teacher: 'Mr Ed Pearce' };
      if (s.id === 'p2') return { ...s, subject: 'Visual Arts', classroom: 'A.G.46', teacher: 'Mr Gary Poulton' };
      if (s.id === 'p3') return { ...s, subject: 'Food Technology', classroom: 'T.05', teacher: 'Miss Ayna Shah' };
      if (s.id === 'p4') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p5') return { ...s, subject: 'Maths', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'p6') return { ...s, subject: 'Languages', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' };
      if (s.id === 'ch1') return { ...s, subject: 'Empty Dishwasher + Fold Clothes', classroom: 'Kitchen/Bedroom', teacher: 'Manual' };
      return s;
    }),
    'Friday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'English', classroom: 'D.1.32', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p2') return { ...s, subject: 'Music', classroom: 'D.1.08', teacher: 'DUGN' };
      if (s.id === 'p3') return { ...s, subject: 'Science', classroom: 'F.11', teacher: 'Mr Bala Mathy' };
      if (s.id === 'p4') return { ...s, subject: 'Science', classroom: 'F.11', teacher: 'Mr Bala Mathy' };
      if (s.id === 'p5') return { ...s, subject: 'Food Technology', classroom: 'T.05', teacher: 'Miss Ayna Shah' };
      if (s.id === 'p6') return { ...s, subject: 'Maths', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'ch1') return { ...s, subject: 'Hang Clothes', classroom: 'Laundry', teacher: 'Manual' };
      return s;
    }),
  },
  'Week B': {
    'Monday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p2') return { ...s, subject: 'Science', classroom: 'A.1.16', teacher: 'Mr Bala Mathy' };
      if (s.id === 'p3') return { ...s, subject: 'Food Technology', classroom: 'T.05', teacher: 'Miss Ayna Shah' };
      if (s.id === 'p4') return { ...s, subject: 'Languages', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' };
      if (s.id === 'p5') return { ...s, subject: 'Music', classroom: 'D.1.08', teacher: 'DUGN' };
      if (s.id === 'p6') return { ...s, subject: 'PDHPE', classroom: 'PRAC.6', teacher: 'Mr Ed Pearce' };
      if (s.id === 'ch1') return { ...s, subject: 'Empty Dishwasher', classroom: 'Kitchen', teacher: 'Manual' };
      return s;
    }),
    'Tuesday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'MUSTER.3', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'Languages', classroom: 'E.30', teacher: 'Ms Sabrina Hoang' };
      if (s.id === 'p2') return { ...s, subject: 'Visual Arts', classroom: 'A.G.46', teacher: 'Mrs Kim Clemson' };
      if (s.id === 'p3') return { ...s, subject: 'Science', classroom: 'F.11', teacher: 'Mr Bala Mathy' };
      if (s.id === 'p4') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p5') return { ...s, subject: 'History & Geography', classroom: 'D.G.18', teacher: 'Ms Rachel Muss' };
      if (s.id === 'p6') return { ...s, subject: 'Maths', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'ch1') return { ...s, subject: 'Hang Clothes', classroom: 'Laundry', teacher: 'Manual' };
      return s;
    }),
    'Wednesday': createWednesdayDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p2') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p5') return { ...s, subject: 'History & Geography', classroom: 'D.G.10', teacher: 'Ms Shamma Faruque' };
      if (s.id === 'p6') return { ...s, subject: 'Science', classroom: 'F.11', teacher: 'Mr Bala Mathy' };
      if (s.id === 'ch1') return { ...s, subject: 'Clean Room + Trash', classroom: 'Sanctum', teacher: 'Manual' };
      return s;
    }),
    'Thursday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'Maths', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'p2') return { ...s, subject: 'Maths', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'p3') return { ...s, subject: 'Food Technology', classroom: 'T.05', teacher: 'Miss Jordana Grow' };
      if (s.id === 'p4') return { ...s, subject: 'Food Technology', classroom: 'T.05', teacher: 'Miss Jordana Grow' };
      if (s.id === 'p5') return { ...s, subject: 'Languages', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' };
      if (s.id === 'p6') return { ...s, subject: 'Home Group', classroom: 'D.G.12', teacher: 'Mrs Lisa Perry' };
      if (s.id === 'ch1') return { ...s, subject: 'Empty Dishwasher + Fold Clothes', classroom: 'Kitchen/Bedroom', teacher: 'Manual' };
      return s;
    }),
    'Friday': createBaseDay().map(s => {
      if (s.id === 'rc') return { ...s, subject: 'Roll Call', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' };
      if (s.id === 'p1') return { ...s, subject: 'PDHPE', classroom: 'PRAC.6', teacher: 'Mr Ed Pearce' };
      if (s.id === 'p2') return { ...s, subject: 'Maths', classroom: 'D.G.36', teacher: 'Mrs Himanshu Sharma' };
      if (s.id === 'p3') return { ...s, subject: 'Music', classroom: 'D.1.08', teacher: 'DUGN' };
      if (s.id === 'p4') return { ...s, subject: 'English', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' };
      if (s.id === 'p5') return { ...s, subject: 'Science', classroom: 'F.06', teacher: 'Mr Bala Mathy' };
      if (s.id === 'p6') return { ...s, subject: 'History & Geography', classroom: 'D.G.10', teacher: 'Ms Shamma Faruque' };
      if (s.id === 'ch1') return { ...s, subject: 'Hang Clothes', classroom: 'Laundry', teacher: 'Manual' };
      return s;
    }),
  },
};

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
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [timetable, setTimetable] = useState<Record<string, Record<string, TimetableSlot[]>>>(INITIAL_TIMETABLE);
  const [assessments, setAssessments] = useState<AssessmentMap>({});
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('Academy sessions have begun, Young Hero. Focus your mental stamina.');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreatingCountdown, setIsCreatingCountdown] = useState(false);
  const [newCountdownTitle, setNewCountdownTitle] = useState('');
  const [newCountdownDate, setNewCountdownDate] = useState('');

  // XP Award States
  const [awardPopup, setAwardPopup] = useState<{ xp: number, message: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lifequest_state_v22');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(parsed.tasks || []);
      setStats(parsed.stats || INITIAL_STATS);
      setBooks(parsed.books || INITIAL_BOOKS);
      setCountdowns(parsed.countdowns || []);
      if (parsed.timetable) setTimetable(parsed.timetable);
      if (parsed.assessments) setAssessments(parsed.assessments);
      if (parsed.rewards) setRewards(parsed.rewards);
      if (parsed.habits) setHabits(parsed.habits);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lifequest_state_v22', JSON.stringify({ tasks, stats, timetable, assessments, rewards, habits, books, countdowns }));
  }, [tasks, stats, timetable, assessments, rewards, habits, books, countdowns]);

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

      // Attribute Logic
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
        gold: s.gold + Math.floor(xp / 2),
        attributes: newAttributes
      };
    });
    setAwardPopup({ xp, message });
    setShowConfetti(true);
    setTimeout(() => {
      setAwardPopup(null);
      setShowConfetti(false);
    }, 4500);
  };

  const handleCreateCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountdownTitle.trim() || !newCountdownDate) return;
    const colors: Array<'orange' | 'blue' | 'purple' | 'red'> = ['orange', 'blue', 'purple', 'red'];
    const newCD: Countdown = {
      id: Math.random().toString(36).substr(2, 9),
      title: newCountdownTitle,
      targetDate: newCountdownDate,
      subtitle: `INITIATED: ${new Date().toLocaleDateString()}`,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setCountdowns([...countdowns, newCD]);
    setNewCountdownTitle('');
    setNewCountdownDate('');
    setIsCreatingCountdown(false);
  };

  const handleDeleteCountdown = (id: string) => {
    setCountdowns(countdowns.filter(c => c.id !== id));
  };

  const handlePurchaseReward = (reward: Reward) => {
    if (stats.gold >= reward.cost) {
      setStats(s => ({ ...s, gold: s.gold - reward.cost }));
      handleManualXpAward(0, `Loot Claimed: ${reward.title}! Enjoy your hard-earned boon.`);
    }
  };

  const handleAddReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: Math.random().toString(36).substr(2, 9),
    };
    setRewards([...rewards, newReward]);
  };

  const handleDeleteReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
  };

  const handleAddBook = (title: string, author: string) => {
    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      title, author, completed: false
    };
    setBooks([...books, newBook]);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };

  const handleCompleteBook = (id: string, xp: number, gold: number, difficulty: Difficulty, feedback: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, completed: true, difficulty, dateCompleted: new Date().toISOString() } : b));
    handleManualXpAward(xp, feedback, TaskCategory.READING);
    setStats(s => ({ ...s, gold: s.gold + gold }));
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id && !t.completed) {
        handleManualXpAward(t.xpValue, "Quest Complete!", t.category);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const handleAiQuestGeneration = async () => {
    setIsGenerating(true);
    try {
      const newQuests = await generateDailyQuests(stats);
      const formattedQuests: Task[] = newQuests.map((q: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: q.title,
        category: q.category as TaskCategory,
        difficulty: q.difficulty as Difficulty,
        completed: false,
        xpValue: XP_VALUES[q.difficulty as Difficulty],
        goldValue: Math.floor(XP_VALUES[q.difficulty as Difficulty] / 2),
        dueDate: new Date().toISOString(),
      }));
      setTasks(prev => [...prev, ...formattedQuests]);
      const advice = await getAIAdvice(tasks);
      setAiAdvice(advice);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      category: TaskCategory.STUDY,
      difficulty: Difficulty.MEDIUM,
      completed: false,
      xpValue: XP_VALUES[Difficulty.MEDIUM],
      goldValue: Math.floor(XP_VALUES[Difficulty.MEDIUM] / 2),
      dueDate: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isToday = h.lastCompleted && new Date(h.lastCompleted).toDateString() === new Date().toDateString();
        if (isToday) return h;
        const newStreak = h.streak + 1;
        const isFormed = newStreak >= 21;
        handleManualXpAward(50, `Habit Streak: ${newStreak} Days!`, h.category);
        return {
          ...h,
          streak: newStreak,
          lastCompleted: new Date().toISOString(),
          isFormed: isFormed || h.isFormed,
          totalCompletions: h.totalCompletions + 1
        };
      }
      return h;
    }));
  };

  const handleAddHabit = (title: string, category: TaskCategory) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      streak: 0,
      lastCompleted: null,
      isFormed: false,
      category,
      totalCompletions: 0
    };
    setHabits([...habits, newHabit]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleBreakHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: 0, lastCompleted: null } : h));
  };

  const handleUpdateSlotField = (week: string, day: string, id: string, field: keyof TimetableSlot, value: string) => {
    setTimetable(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        [day]: prev[week][day].map(s => s.id === id ? { ...s, [field]: value } : s)
      }
    }));
  };

  const handleToggleAttendance = (week: string, day: string, id: string) => {
    setTimetable(prev => {
      const slot = prev[week][day].find(s => s.id === id);
      const currentStatus = slot?.status;
      const nextStatus = currentStatus === 'attended' ? 'missed' : (currentStatus === 'missed' ? 'pending' : 'attended');
      if (nextStatus === 'attended') handleManualXpAward(25, "Academy Attendance Recorded.", TaskCategory.SCHOOL);
      return {
        ...prev,
        [week]: {
          ...prev[week],
          [day]: prev[week][day].map(s => s.id === id ? { ...s, status: nextStatus } : s)
        }
      };
    });
  };

  const handleUpdateAssessment = (key: string, value: string) => {
    setAssessments(prev => ({ ...prev, [key]: value }));
  };

  const handleCompleteWorkout = (xp: number, gold: number, difficulty: Difficulty) => {
    handleManualXpAward(xp, `Workout Complete! Physical Vessel Strengthened.`, TaskCategory.FITNESS);
    setStats(s => ({ ...s, gold: s.gold + gold }));
  };

  const handleCompleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.subTasks) {
        const newSubTasks = t.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st);
        return { ...t, subTasks: newSubTasks };
      }
      return t;
    }));
  };

  const handleAddTime = (taskId: string, mins: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newTime = (t.timeSpent || 0) + mins;
        if (newTime % 30 === 0 && newTime > 0) handleManualXpAward(100, "Grind Milestone Reached!", t.category);
        return { ...t, timeSpent: newTime };
      }
      return t;
    }));
  };

  const handleUpdateStats = (updates: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  };

  const handleResetProgress = () => {
    setStats(INITIAL_STATS);
    setTasks([]);
    setHabits(INITIAL_HABITS);
    setBooks(INITIAL_BOOKS);
    setCountdowns([]);
    setActiveTab('dashboard');
    localStorage.removeItem('lifequest_state_v22');
  };

  const renderDashboard = () => {
    // Siege Clearance Logic: Check if Feb 2, 2026 has passed
    const siegeDate = new Date("2026-02-02");
    const showSiege = new Date() < siegeDate;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CharacterStats stats={stats} />
            <div className="space-y-4">
              <SideQuestList tasks={tasks} onComplete={handleCompleteTask} />

              {/* Create Countdown Button Section - RPG Format */}
              <div className="rpg-card rounded-[2.5rem] p-8 border-blue-500/20 bg-slate-900/40 relative group overflow-hidden shadow-2xl">
                {!isCreatingCountdown ? (
                  <div className="flex flex-col gap-5 items-center text-center relative z-10">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <Timer className="text-white" size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Temporal Marker</h3>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest opacity-80">Chronos Sync Required</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingCountdown(true)}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 border border-blue-400/30 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                    >
                      Initiate Marker
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateCountdown} className="space-y-5 animate-in slide-in-from-top-4 duration-300 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles size={16} className="text-blue-400 animate-pulse" />
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">What is the countdown for?</p>
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Quest Title (e.g. Boss Battle)"
                          value={newCountdownTitle}
                          onChange={e => setNewCountdownTitle(e.target.value)}
                          className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                          autoFocus
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          value={newCountdownDate}
                          onChange={e => setNewCountdownDate(e.target.value)}
                          className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingCountdown(false)}
                        className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-white/5 hover:text-white transition-colors"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] py-3.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 border border-blue-400/30 hover:bg-blue-500 transition-all"
                      >
                        Forge Marker
                      </button>
                    </div>
                  </form>
                )}
                {/* Background Glows */}
                <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-indigo-500/5 blur-2xl pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showSiege && <CountdownWidget targetDate="2026-02-02" isStatic={true} />}
              {countdowns.map(cd => (
                <CountdownWidget
                  key={cd.id}
                  title={cd.title}
                  subtitle={cd.subtitle}
                  targetDate={cd.targetDate}
                  color={cd.color}
                  onDelete={() => handleDeleteCountdown(cd.id)}
                />
              ))}
              <WeatherWidget />
            </div>

            <div className="flex items-center justify-between mt-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Active Raids</h2>
              <button
                onClick={handleAiQuestGeneration}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Summon Quests
              </button>
            </div>

            <form onSubmit={addTask} className="relative group">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Custom Quest..."
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 pr-12 shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-2.5 bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-lg transition-colors">
                <Plus size={18} />
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.filter(t => !t.completed && !t.isBoss && !t.isSideQuest).map(task => (
                <QuestCard key={task.id} task={task} onComplete={handleCompleteTask} onDelete={id => setTasks(tasks.filter(t => t.id !== id))} />
              ))}
            </div>

            <CurrentTimeWidget />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} gold={stats.gold}>
      {showConfetti && <Confetti />}

      {awardPopup && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500" />
          <div className="relative bg-slate-900 border-2 border-blue-500/50 p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(59,130,246,0.3)] text-center animate-in zoom-in-95 duration-500 overflow-hidden max-w-lg">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 p-5 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.6)] border-4 border-slate-900 animate-bounce">
              <Medal size={40} className="text-white" />
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-4xl font-black text-white uppercase tracking-tighter">Oracle's Favor</h4>
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 shadow-inner">
                <p className="text-3xl font-black text-blue-400">+{awardPopup.xp} XP</p>
                <p className="text-lg font-black text-yellow-500/80">+{Math.floor(awardPopup.xp / 2)} GOLD</p>
              </div>
              <p className="text-slate-300 font-bold italic text-lg leading-snug">"{awardPopup.message}"</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'habits' && <HabitTracker habits={habits} onToggleHabit={handleToggleHabit} onAddHabit={handleAddHabit} onDeleteHabit={handleDeleteHabit} onBreakHabit={handleBreakHabit} />}
      {activeTab === 'archive' && <TheGreatArchive books={books} onAddBook={handleAddBook} onDeleteBook={handleDeleteBook} onCompleteBook={handleCompleteBook} />}
      {activeTab === 'routine' && <DailyRoutine tasks={tasks} timetable={timetable} assessments={assessments} habits={habits} />}
      {activeTab === 'academy' && <AcademyTimetable timetable={timetable} onUpdateSlotField={handleUpdateSlotField} onToggleAttendance={handleToggleAttendance} />}
      {activeTab === 'assessments' && <AssessmentPlanner assessments={assessments} onUpdate={handleUpdateAssessment} />}
      {activeTab === 'training' && <TrainingGrounds onCompleteWorkout={handleCompleteWorkout} />}
      {activeTab === 'operations' && <WarRoom tasks={tasks} onCompleteSubTask={handleCompleteSubTask} onCompleteTask={handleCompleteTask} onAddTime={handleAddTime} onManualXpAward={handleManualXpAward} />}
      {activeTab === 'calendar' && <AdventurerCalendar tasks={tasks} />}
      {activeTab === 'shop' && <Treasury gold={stats.gold} rewards={rewards} onPurchase={handlePurchaseReward} onAddReward={handleAddReward} onDeleteReward={handleDeleteReward} />}
      {activeTab === 'settings' && <Profile stats={stats} onUpdateStats={handleUpdateStats} onReset={handleResetProgress} />}
    </Layout>
  );
};

export default App;
