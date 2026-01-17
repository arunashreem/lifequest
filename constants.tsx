
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
  Accessibility,
  Briefcase,
  Moon,
  Footprints,
  Droplets,
  Music,
  Flame,
  Wind,
  Wand2,
  Trash,
  Library
} from 'lucide-react';
import { TaskCategory, Difficulty, Reward, Habit, Book } from './types';

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
  level: 1,
  xp: 0,
  maxXp: 1000,
  gold: 50,
  streak: 0,
  screenTimeBank: 0,
  lastPostureCheck: new Date(0).toISOString(),
  postureStreak: 0,
  attributes: {
    strength: 0,
    intelligence: 0,
    wisdom: 0,
    vitality: 0,
    charisma: 0
  }
};

// Start with an empty archive so progress begins at 0/40
export const INITIAL_BOOKS: Book[] = [];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', title: 'Dawn Patrol: Wake up 6:30', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.HEALTH, totalCompletions: 0 },
  { id: 'h2', title: 'Titan Trek: 10,000 Steps', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.FITNESS, totalCompletions: 0 },
  { id: 'h3', title: 'Sage\'s Scroll: 30m Reading', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.STUDY, totalCompletions: 0 },
  { id: 'h4', title: 'Sonic Pulse: 45m Mrudangam Practice', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.MINDFULNESS, totalCompletions: 0 },
  { id: 'h7', title: 'Divine Communion: 5m Prayer', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.MINDFULNESS, totalCompletions: 0 },
  { id: 'h5', title: 'Digital Fast: No Screens 1hr pre-sleep', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.MINDFULNESS, totalCompletions: 0 },
  { id: 'ch1', title: 'Dishwasher Duty: Empty/Fill', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.CHORES, totalCompletions: 0 },
  { id: 'ch2', title: 'Laundry Logistics: Hang/Fold', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.CHORES, totalCompletions: 0 },
  { id: 'ch3', title: 'Sanctum Cleanse: Room Reset', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.CHORES, totalCompletions: 0 },
  { id: 'ch4', title: 'Terrain Maintenance: Mow Lawn', streak: 0, lastCompleted: null, isFormed: false, category: TaskCategory.CHORES, totalCompletions: 0 },
];

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
