
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
  Library
} from 'lucide-react';
import { TaskCategory, Difficulty, Reward, Habit, Book, TimetableSlot } from './types';

export const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  [TaskCategory.FITNESS]: <Dumbbell className="w-5 h-5 text-red-400" />,
  [TaskCategory.STUDY]: <BookOpen className="w-5 h-5 text-blue-400" />,
  [TaskCategory.SCHOOL]: <School className="w-5 h-5 text-indigo-400" />,
  [TaskCategory.HOMEWORK]: <Pencil className="w-5 h-5 text-emerald-400" />,
  [TaskCategory.CHORES]: <Trash className="w-5 h-5 text-orange-400" />,
  [TaskCategory.HEALTH]: <Heart className="w-5 h-5 text-green-400" />,
  [TaskCategory.SOCIAL]: <Users className="w-5 h-5 text-purple-400" />,
  [TaskCategory.SCREEN_TIME]: <Monitor className="w-5 h-5 text-slate-400" />,
  [TaskCategory.MINDFULNESS]: <Zap className="w-5 h-5 text-yellow-400" />,
  [TaskCategory.WORK]: <Briefcase className="w-5 h-5 text-gray-400" />,
  [TaskCategory.READING]: <Library className="w-5 h-5 text-cyan-400" />
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'bg-green-900/50 text-green-300 border-green-700',
  [Difficulty.MEDIUM]: 'bg-blue-900/50 text-blue-300 border-blue-700',
  [Difficulty.HARD]: 'bg-purple-900/50 text-purple-300 border-purple-700',
  [Difficulty.EPIC]: 'bg-orange-900/50 text-orange-300 border-orange-700'
};

export const XP_VALUES: Record<Difficulty, number> = {
  [Difficulty.EASY]: 50,
  [Difficulty.MEDIUM]: 150,
  [Difficulty.HARD]: 300,
  [Difficulty.EPIC]: 1000
};

export const INITIAL_STATS = {
  name: 'The Hero',
  level: 1,
  xp: 0,
  maxXp: 1000,
  gold: 50,
  streak: 0,
  screenTimeBank: 0,
  lastPostureCheck: new Date(0).toISOString(),
  postureStreak: 0,
  avatarSeed: 'Hero',
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

const standardTimes = [
  { start: '08:30', end: '08:40', label: 'Roll Call', type: 'rollcall' },
  { start: '08:40', end: '09:33', label: 'Period 1', type: 'class' },
  { start: '09:33', end: '10:26', label: 'Period 2', type: 'class' },
  { start: '10:26', end: '10:57', label: 'Recess', type: 'break' },
  { start: '10:57', end: '11:50', label: 'Period 3', type: 'class' },
  { start: '11:50', end: '12:43', label: 'Period 4', type: 'class' },
  { start: '12:43', end: '13:14', label: 'Lunch', type: 'break' },
  { start: '13:14', end: '14:07', label: 'Period 5', type: 'class' },
  { start: '14:07', end: '15:00', label: 'Period 6', type: 'class' },
];

const wednesdayTimes = [
  { start: '09:23', end: '09:33', label: 'Roll Call', type: 'rollcall' },
  { start: '09:33', end: '10:26', label: 'Period 2', type: 'class' },
  { start: '10:26', end: '10:57', label: 'Recess', type: 'break' },
  { start: '10:57', end: '11:50', label: 'Period 3', type: 'class' },
  { start: '11:50', end: '12:43', label: 'Period 4', type: 'class' },
  { start: '12:43', end: '13:14', label: 'Lunch', type: 'break' },
  { start: '13:14', end: '14:07', label: 'Period 5', type: 'class' },
  { start: '14:07', end: '15:00', label: 'Period 6', type: 'class' },
];

const buildDay = (data: Array<{subject: string, room?: string, teacher?: string}>, isWed = false): TimetableSlot[] => {
  const times = isWed ? wednesdayTimes : standardTimes;
  return times.map((t, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    startTime: t.start,
    endTime: t.end,
    label: t.label,
    type: t.type as any,
    subject: data[i]?.subject || t.label,
    classroom: data[i]?.room || '',
    teacher: data[i]?.teacher || ''
  }));
};

export const INITIAL_TIMETABLE: Record<string, Record<string, TimetableSlot[]>> = {
  'Week A': {
    'Monday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'History & Geography', room: 'D.G.10', teacher: 'Ms Rachel Muss' },
      { subject: 'PDHPE', room: 'PRAC.6', teacher: 'Mr Ed Pearce' },
      { subject: 'Recess' },
      { subject: 'Languages', room: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Lunch' },
      { subject: 'Food Technology', room: 'T.05', teacher: 'Miss Ayna Shah' },
      { subject: 'Visual Arts', room: 'A.G.46', teacher: 'Mrs Kim Clemson' },
    ]),
    'Tuesday': buildDay([
      { subject: 'Roll Call', room: 'MUSTER.3', teacher: 'Mr Christopher Ewen' },
      { subject: 'Maths', room: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { subject: 'History & Geography', room: 'D.G.10', teacher: 'Ms Rachel Muss' },
      { subject: 'Recess' },
      { subject: 'Languages', room: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { subject: 'Science', room: 'F.12', teacher: 'Mr Bala Mathy' },
      { subject: 'Lunch' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Music', room: 'D.1.08', teacher: 'DUGN' },
    ]),
    'Wednesday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'PDHPE', room: 'D.G.01', teacher: 'Mr Ed Pearce' },
      { subject: 'Recess' },
      { subject: 'Empty' },
      { subject: 'Empty' },
      { subject: 'Lunch' },
      { subject: 'History & Geography', room: 'D.G.10', teacher: 'Ms Shamma Faruque' },
      { subject: 'Science', room: 'F.11', teacher: 'Mr Bala Mathy' },
    ], true),
    'Thursday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'PDHPE', room: 'D.G.01', teacher: 'Mr Ed Pearce' },
      { subject: 'Visual Arts', room: 'A.G.46', teacher: 'Mr Gary Poulton' },
      { subject: 'Recess' },
      { subject: 'Food Technology', room: 'T.05', teacher: 'Miss Ayna Shah' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Lunch' },
      { subject: 'Maths', room: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { subject: 'Languages', room: 'E.27', teacher: 'Ms Sabrina Hoang' },
    ]),
    'Friday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'English', room: 'D.1.32', teacher: 'ENG1' },
      { subject: 'Music', room: 'D.1.08', teacher: 'DUGN' },
      { subject: 'Recess' },
      { subject: 'Science', room: 'F.11', teacher: 'Mr Bala Mathy' },
      { subject: 'Science', room: 'F.11', teacher: 'Mr Bala Mathy' },
      { subject: 'Lunch' },
      { subject: 'Food Technology', room: 'T.05', teacher: 'Miss Ayna Shah' },
      { subject: 'Maths', room: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
    ]),
  },
  'Week B': {
    'Monday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Science', room: 'A.1.16', teacher: 'Mr Bala Mathy' },
      { subject: 'Recess' },
      { subject: 'Food Technology', room: 'T.05', teacher: 'Miss Ayna Shah' },
      { subject: 'Languages', room: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { subject: 'Lunch' },
      { subject: 'Music', room: 'D.1.08', teacher: 'DUGN' },
      { subject: 'PDHPE', room: 'PRAC.6', teacher: 'Mr Ed Pearce' },
    ]),
    'Tuesday': buildDay([
      { subject: 'Roll Call', room: 'MUSTER.3', teacher: 'Mr Christopher Ewen' },
      { subject: 'Languages', room: 'E.30', teacher: 'Ms Sabrina Hoang' },
      { subject: 'Visual Arts', room: 'A.G.46', teacher: 'Mrs Kim Clemson' },
      { subject: 'Recess' },
      { subject: 'Science', room: 'F.11', teacher: 'Mr Bala Mathy' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Lunch' },
      { subject: 'History & Geography', room: 'D.G.18', teacher: 'Ms Rachel Muss' },
      { subject: 'Maths', room: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
    ]),
    'Wednesday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Recess' },
      { subject: 'Empty' },
      { subject: 'Empty' },
      { subject: 'Lunch' },
      { subject: 'History & Geography', room: 'D.G.10', teacher: 'Ms Shamma Faruque' },
      { subject: 'Science', room: 'F.11', teacher: 'Mr Bala Mathy' },
    ], true),
    'Thursday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'Maths', room: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { subject: 'Maths', room: 'D.G.30', teacher: 'Mrs Himanshu Sharma' },
      { subject: 'Recess' },
      { subject: 'Food Technology', room: 'T.05', teacher: 'Miss Jordana Grow' },
      { subject: 'Food Technology', room: 'T.05', teacher: 'Miss Jordana Grow' },
      { subject: 'Lunch' },
      { subject: 'Languages', room: 'E.27', teacher: 'Ms Sabrina Hoang' },
      { subject: 'Home Group', room: 'D.G.12', teacher: 'Mrs Lisa Perry' },
    ]),
    'Friday': buildDay([
      { subject: 'Roll Call', room: 'D.G.09', teacher: 'Mr Christopher Ewen' },
      { subject: 'PDHPE', room: 'PRAC.6', teacher: 'Mr Ed Pearce' },
      { subject: 'Maths', room: 'D.G.36', teacher: 'Mrs Himanshu Sharma' },
      { subject: 'Recess' },
      { subject: 'Music', room: 'D.1.08', teacher: 'DUGN' },
      { subject: 'English', room: 'D.1.36', teacher: 'Miss Anne Carroll' },
      { subject: 'Lunch' },
      { subject: 'Science', room: 'F.06', teacher: 'Mr Bala Mathy' },
      { subject: 'History & Geography', room: 'D.G.10', teacher: 'Ms Shamma Faruque' },
    ]),
  }
};

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: '30 Min Gaming', cost: 100, type: 'SCREEN_TIME', duration: 30 },
  { id: 'r2', title: '1 Hour YouTube', cost: 180, type: 'SCREEN_TIME', duration: 60 },
  { id: 'r3', title: 'No Chores Pass', cost: 800, type: 'FUN' },
  { id: 'r4', title: 'Pizza Night', cost: 1200, type: 'FOOD' },
  { id: 'r5', title: 'Social Media Unlock (15m)', cost: 50, type: 'SCREEN_TIME', duration: 15 },
  { id: 'r6', title: 'Lego Set / Hobby Item', cost: 5000, type: 'OTHER' },
];

export const REWARD_ICONS: Record<string, React.ReactNode> = {
  SCREEN_TIME: <Clock className="w-6 h-6 text-cyan-400" />,
  FUN: <Gamepad2 className="w-6 h-6 text-purple-400" />,
  FOOD: <IceCream className="w-6 h-6 text-pink-400" />,
  OTHER: <Gift className="w-6 h-6 text-yellow-400" />
};
