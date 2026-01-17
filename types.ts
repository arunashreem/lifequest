
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
  isBoss?: boolean; // For Assessments/Exams
  isSideQuest?: boolean; // For Bonus XP Checklist
  subTasks?: SubTask[];
  timeSpent?: number; // In minutes for Work tracker
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

export interface RoutineSlot {
  id: string;
  time: string;
  activity: string;
  category: TaskCategory;
  isHabit?: boolean;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  type: 'SCREEN_TIME' | 'FUN' | 'FOOD' | 'OTHER';
  duration?: number; // minutes
}

export interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  streak: number;
  screenTimeBank: number;
  lastPostureCheck: string; // ISO string
  postureStreak: number;
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

export type AssessmentMap = Record<string, string>; // key format: "termX_weekY"

export interface GameState {
  tasks: Task[];
  stats: UserStats;
  rewards: Reward[];
  timetable: TimetableSlot[];
  assessments: AssessmentMap;
  habits: Habit[];
  routine: RoutineSlot[];
  books: Book[];
}
