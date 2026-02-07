
import React from 'react';
import { 
  Dumbbell, 
  BookOpen, 
  Trash2, 
  Heart, 
  Users, 
  Monitor, 
  Zap,
  Gamepad2,
  IceCream,
  Clock,
  Gift,
  School,
  Pencil,
  Briefcase,
  Trash,
  Library,
  Sparkles,
  Trophy,
  Rocket
} from 'lucide-react';
import { TaskCategory, Difficulty, Reward, Habit, Book, TimetableSlot, AssessmentMap, UserStats } from './types';

export const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  [TaskCategory.FITNESS]: <Dumbbell className="w-5 h-5 text-red-500" />,
  [TaskCategory.STUDY]: <BookOpen className="w-5 h-5 text-blue-500" />,
  [TaskCategory.SCHOOL]: <School className="w-5 h-5 text-indigo-500" />,
  [TaskCategory.HOMEWORK]: <Pencil className="w-5 h-5 text-emerald-500" />,
  [TaskCategory.CHORES]: <Trash className="w-5 h-5 text-orange-500" />,
  [TaskCategory.HEALTH]: <Heart className="w-5 h-5 text-green-500" />,
  [TaskCategory.SOCIAL]: <Users className="w-5 h-5 text-purple-500" />,
  [TaskCategory.SCREEN_TIME]: <Monitor className="w-5 h-5 text-slate-500" />,
  [TaskCategory.MINDFULNESS]: <Zap className="w-5 h-5 text-yellow-500" />,
  [TaskCategory.WORK]: <Briefcase className="w-5 h-5 text-slate-600" />,
  [TaskCategory.READING]: <Library className="w-5 h-5 text-cyan-500" />
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'bg-green-100 text-green-700 border-green-200',
  [Difficulty.MEDIUM]: 'bg-blue-100 text-blue-700 border-blue-200',
  [Difficulty.HARD]: 'bg-purple-100 text-purple-700 border-purple-200',
  [Difficulty.EPIC]: 'bg-orange-100 text-orange-700 border-orange-200'
};

export const XP_VALUES: Record<Difficulty, number> = {
  [Difficulty.EASY]: 50,
  [Difficulty.MEDIUM]: 150,
  [Difficulty.HARD]: 300,
  [Difficulty.EPIC]: 1000
};

export const INITIAL_CHORES = [
  { id: 'c1', name: 'Sanctum Reset', value: 1.00 },
  { id: 'c2', name: 'Utility Management', value: 1.00 },
  { id: 'c3', name: 'Waste Disposal', value: 1.00 }
];

export const INITIAL_STATS: UserStats = {
  name: 'Abhi Pondala',
  level: 1,
  mastery: 0,
  xp: 0,
  maxXp: 1000,
  gold: 50,
  streak: 0,
  screenTimeBank: 0,
  lastPostureCheck: new Date(0).toISOString(),
  postureStreak: 0,
  dailyWater: 0,
  lastWaterUpdate: new Date(0).toISOString(),
  avatarSeed: 'Abhi',
  choreMoney: {
    vault: 0,
    goalTitle: 'Legendary Acquisition',
    goalAmount: 100,
    chores: INITIAL_CHORES,
    completionGrid: Array(3).fill(null).map(() => Array(7).fill(false))
  },
  attributes: {
    strength: 0,
    intelligence: 0,
    wisdom: 0,
    vitality: 0,
    charisma: 0
  }
};

export const INITIAL_BOOKS: Book[] = [];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', title: 'Dawn Patrol: Wake up 6:30', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.HEALTH, totalCompletions: 0 },
  { id: 'h2', title: 'Titan Trek: 10,000 Steps', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.FITNESS, totalCompletions: 0 },
  { id: 'h3', title: 'Sage\'s Scroll: 30m Reading', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.STUDY, totalCompletions: 0 },
  { id: 'h4', title: 'Sonic Pulse: 45m Mrudangam Practice', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.MINDFULNESS, totalCompletions: 0 },
  { id: 'h7', title: 'Divine Communion: 5m Prayer', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.MINDFULNESS, totalCompletions: 0 },
  { id: 'h5', title: 'Digital Fast: No Screens 1hr pre-sleep', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.MINDFULNESS, totalCompletions: 0 },
];

export const INITIAL_ASSESSMENTS: AssessmentMap = {};

export const REWARD_ICONS: Record<string, React.ReactNode> = {
  SCREEN_TIME: <Monitor className="w-8 h-8" />,
  FUN: <Gamepad2 className="w-8 h-8" />,
  FOOD: <IceCream className="w-8 h-8" />,
  OTHER: <Gift className="w-8 h-8" />,
  LEGENDARY: <Trophy className="w-8 h-8" />,
  EPIC_QUEST: <Rocket className="w-8 h-8" />,
};

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: '1 Hour Screen Time', cost: 1200, type: 'SCREEN_TIME', duration: 60 },
  { id: 'r2', title: 'Game Session (30m)', cost: 800, type: 'FUN', duration: 30 },
  { id: 'r3', title: 'Tactical Treat', cost: 400, type: 'FOOD' },
  { id: 'r4', title: 'Side Quest: Outing', cost: 5000, type: 'OTHER' },
  { id: 'r5', title: 'The Weekend Binge', cost: 10000, type: 'LEGENDARY', duration: 480 },
  { id: 'r6', title: 'Digital Relic Acquisition', cost: 15000, type: 'EPIC_QUEST' },
];

export const INITIAL_TIMETABLE: Record<string, Record<string, TimetableSlot[]>> = {
  'Week A': {
    'Monday': [
      { id: 'wa-mrc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wa-m1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'History & Geography Yr8', type: 'class', classroom: 'D.G.10', teacher: 'Ms Rachel Muss' },
      { id: 'wa-m2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'PDHPE Yr8', type: 'class', classroom: 'PRAC.6', teacher: 'Mr Ed Pearce' },
      { id: 'wa-mr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wa-m3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Languages Yr8', type: 'class', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { id: 'wa-m4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wa-ml', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wa-m5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Ayna Shah' },
      { id: 'wa-m6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Visual Arts Yr8', type: 'class', classroom: 'A.G.46', teacher: 'Mrs Kim Clemson' },
    ],
    'Tuesday': [
      { id: 'wa-trc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'MUSTER.3', teacher: 'Mr Christopher Ewen' },
      { id: 'wa-t1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { id: 'wa-t2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'History & Geography Yr8', type: 'class', classroom: 'D.G.10', teacher: 'Ms Rachel Muss' },
      { id: 'wa-tr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wa-t3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Languages Yr8', type: 'class', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { id: 'wa-t4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'Science Yr8', type: 'class', classroom: 'F.12', teacher: 'Mr Bala Mathy' },
      { id: 'wa-tl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wa-t5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wa-t6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Music Yr8', type: 'class', classroom: 'D.1.08', teacher: 'DUGN' },
    ],
    'Wednesday': [
      { id: 'wa-wmtg', label: 'MTG', startTime: '08:15', endTime: '09:15', subject: 'MTG', type: 'class' },
      { id: 'wa-wrc', label: 'Roll Call', startTime: '09:23', endTime: '09:33', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wa-w2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'PDHPE Yr8', type: 'class', classroom: 'D.G.01', teacher: 'Mr Ed Pearce' },
      { id: 'wa-wr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wa-w3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Ayna Shah' },
      { id: 'wa-w4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wa-wl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wa-w5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'History & Geography Yr8', type: 'class', classroom: 'D.G.10', teacher: 'Ms Shamma Faruque' },
      { id: 'wa-w6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Science Yr8', type: 'class', classroom: 'F.11', teacher: 'Mr Bala Mathy' },
    ],
    'Thursday': [
      { id: 'wa-thrc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wa-th1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'PDHPE Yr8', type: 'class', classroom: 'D.G.01', teacher: 'Mr Ed Pearce' },
      { id: 'wa-th2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'Visual Arts Yr8', type: 'class', classroom: 'A.G.46', teacher: 'Mr Gary Poulton' },
      { id: 'wa-thr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wa-th3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Ayna Shah' },
      { id: 'wa-th4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wa-thl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wa-th5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { id: 'wa-th6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Languages Yr8', type: 'class', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' },
    ],
    'Friday': [
      { id: 'wa-frc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wa-f1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'English Yr8', type: 'class', classroom: 'D.1.32', teacher: 'ENG1' },
      { id: 'wa-f2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'Music Yr8', type: 'class', classroom: 'D.1.08', teacher: 'DUGN' },
      { id: 'wa-fr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wa-f3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Science Yr8', type: 'class', classroom: 'F.11', teacher: 'Mr Bala Mathy' },
      { id: 'wa-f4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'Science Yr8', type: 'class', classroom: 'F.11', teacher: 'Mr Bala Mathy' },
      { id: 'wa-fl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wa-f5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Ayna Shah' },
      { id: 'wa-f6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
    ]
  },
  'Week B': {
    'Monday': [
      { id: 'wb-mrc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wb-m1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wb-m2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'Science Yr8', type: 'class', classroom: 'A.1.16', teacher: 'Mr Bala Mathy' },
      { id: 'wb-mr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wb-m3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Ayna Shah' },
      { id: 'wb-m4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'Languages Yr8', type: 'class', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { id: 'wb-ml', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wb-m5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'Music Yr8', type: 'class', classroom: 'D.1.08', teacher: 'DUGN' },
      { id: 'wb-m6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'PDHPE Yr8', type: 'class', classroom: 'PRAC.6', teacher: 'Mr Ed Pearce' },
    ],
    'Tuesday': [
      { id: 'wb-trc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'MUSTER.3', teacher: 'Mr Christopher Ewen' },
      { id: 'wb-t1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'Languages Yr8', type: 'class', classroom: 'E.30', teacher: 'Ms Sabrina Hoang' },
      { id: 'wb-t2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'Visual Arts Yr8', type: 'class', classroom: 'A.G.46', teacher: 'Mrs Kim Clemson' },
      { id: 'wb-tr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wb-t3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Science Yr8', type: 'class', classroom: 'F.11', teacher: 'Mr Bala Mathy' },
      { id: 'wb-t4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wb-tl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wb-t5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'History & Geography Yr8', type: 'class', classroom: 'D.G.18', teacher: 'Ms Rachel Muss' },
      { id: 'wb-t6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
    ],
    'Wednesday': [
      { id: 'wb-wmtg', label: 'MTG', startTime: '08:15', endTime: '09:15', subject: 'MTG', type: 'class' },
      { id: 'wb-wrc', label: 'Roll Call', startTime: '09:23', endTime: '09:33', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wb-w2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wb-wr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wb-w5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'History & Geography Yr8', type: 'class', classroom: 'D.G.10', teacher: 'Ms Shamma Faruque' },
      { id: 'wb-w6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Science Yr8', type: 'class', classroom: 'F.11', teacher: 'Mr Bala Mathy' },
    ],
    'Thursday': [
      { id: 'wb-thrc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wb-th1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { id: 'wb-th2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { id: 'wb-thr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wb-th3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Jordana Grow' },
      { id: 'wb-th4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'Food Technology Yr8', type: 'class', classroom: 'T.05', teacher: 'Miss Jordana Grow' },
      { id: 'wb-thl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wb-th5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'Languages Yr8', type: 'class', classroom: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { id: 'wb-th6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'Home Group Yr8', type: 'class', classroom: 'D.G.12', teacher: 'Mrs Lisa Perry' },
    ],
    'Friday': [
      { id: 'wb-frc', label: 'Roll Call', startTime: '08:30', endTime: '08:40', subject: 'Roll Call Yr8', type: 'rollcall', classroom: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { id: 'wb-f1', label: 'Period 1', startTime: '08:40', endTime: '09:33', subject: 'PDHPE Yr8', type: 'class', classroom: 'PRAC.6', teacher: 'Mr Ed Pearce' },
      { id: 'wb-f2', label: 'Period 2', startTime: '09:33', endTime: '10:26', subject: 'Maths Yr8', type: 'class', classroom: 'D.G.36', teacher: 'Mrs Himanshu Sharma' },
      { id: 'wb-fr', label: 'Recess', startTime: '10:26', endTime: '10:57', subject: 'Recess', type: 'break' },
      { id: 'wb-f3', label: 'Period 3', startTime: '10:57', endTime: '11:50', subject: 'Music Yr8', type: 'class', classroom: 'D.1.08', teacher: 'DUGN' },
      { id: 'wb-f4', label: 'Period 4', startTime: '11:50', endTime: '12:43', subject: 'English Yr8', type: 'class', classroom: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { id: 'wb-fl', label: 'Lunch', startTime: '12:43', endTime: '13:14', subject: 'Lunch', type: 'break' },
      { id: 'wb-f5', label: 'Period 5', startTime: '13:14', endTime: '14:07', subject: 'Science Yr8', type: 'class', classroom: 'F.06', teacher: 'Mr Bala Mathy' },
      { id: 'wb-f6', label: 'Period 6', startTime: '14:07', endTime: '15:00', subject: 'History & Geography Yr8', type: 'class', classroom: 'D.G.10', teacher: 'Ms Shamma Faruque' },
    ]
  }
};