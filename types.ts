
export enum TaskCategory {
  FITNESS = 'Fitness',
  STUDY = 'Study',
  SCHOOL = 'School',
  HOMEWORK = 'Homework',
  CHORES = 'Chores',
  HEALTH = 'Health',
  SOCIAL = 'Social',
  SCREEN_TIME = 'Screen Time',
  MINDFULNESS = 'Mindfulness',
  WORK = 'Work',
  READING = 'Reading'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EPIC = 'Epic'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  difficulty: Difficulty;
  completed: boolean;
  xpValue: number;
  goldValue: number;
  dueDate: string; // ISO string
  isBoss?: boolean; // For Raids/Assessments
  isSideQuest?: boolean; // For Morning Manifest Checklist
  subTasks?: SubTask[];
  timeSpent?: number; // In minutes
  associatedAttribute?: 'strength' | 'intelligence' | 'wisdom' | 'vitality' | 'charisma';
}

export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO string
  category: 'EVENT' | 'ACHIEVEMENT' | 'DEADLINE' | 'HOLIDAY';
  isYearly?: boolean;
  completed?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  completed: boolean;
  coverUrl?: string;
  dateCompleted?: string;
  difficulty?: Difficulty;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'video' | 'blog' | 'podcast' | 'other';
  notes: string;
  completed: boolean;
  order: number;
  dateAdded: string;
  dateCompleted?: string;
  difficulty?: Difficulty;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: 'blog' | 'video' | 'social' | 'other';
  sourceResourceId?: string;
  dateCreated: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  lastCompleted: string | null; // ISO Date string
  isFormed: boolean;
  category: TaskCategory;
  totalCompletions: number;
}

export interface TimetableSlot {
  id: string;
  label: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  subject: string;
  classroom?: string;
  teacher?: string;
  type: 'class' | 'break' | 'rollcall';
  status?: 'attended' | 'missed' | 'pending';
}

export interface UserStats {
  name: string;
  level: number;
  mastery: number;
  xp: number;
  maxXp: number;
  gold: number;
  streak: number;
  screenTimeBank: number;
  lastPostureCheck: string; // ISO string
  postureStreak: number;
  dailyWater: number; // In ml
  lastWaterUpdate: string; // ISO string
  avatarSeed?: string;
  choreMoney: {
    vault: number;
    goalTitle: string;
    goalAmount: number;
    chores: { id: string; name: string; value: number }[];
    completionGrid: boolean[][]; // Dynamic Rows x 7
  };
  attributes: {
    strength: number;
    intelligence: number;
    wisdom: number;
    vitality: number;
    charisma: number;
  };
}

export interface Countdown {
  id: string;
  title: string;
  targetDate: string; // ISO format
  subtitle?: string;
  color?: 'orange' | 'blue' | 'purple' | 'red';
}

export interface GameState {
  tasks: Task[];
  stats: UserStats;
  milestones: Milestone[];
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  type: 'SCREEN_TIME' | 'FUN' | 'FOOD' | 'OTHER' | string;
  duration?: number;
}

export type AssessmentMap = Record<string, string>;