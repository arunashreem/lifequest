
import React from 'react';
import { Dumbbell, Flame, Zap, Shield, Trophy, ChevronRight, Activity, Sparkles, Wind, Scan } from 'lucide-react';
import { Difficulty } from '../types';

interface TrainingGroundsProps {
  onCompleteWorkout: (xp: number, gold: number, difficulty: Difficulty) => void;
  setActiveTab?: (tab: string) => void;
}

interface Workout {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  xp: number;
  gold: number;
  difficulty: Difficulty;
  icon: React.ReactNode;
  color: string;
  exercises: string[];
  hasAiScanner?: boolean;
}

const WORKOUTS: Workout[] = [
  {
    id: 'warmup',
    title: "Initiate's Quickening",
    subtitle: 'Warm Up & Dynamic Flow',
    description: 'Ignite your internal furnace and prime your joints for the battles ahead. Mandatory for all high-level raiding.',
    xp: 100,
    gold: 25,
    difficulty: Difficulty.EASY,
    icon: <Wind className="w-8 h-8" />,
    color: 'from-amber-400 to-orange-500',
    exercises: ['2m Jog in Place (The Scout\'s Pace)', '15 Arm Circles (The Windmill)', '10 Leg Swings (The Pendulum)', '15 Torso Twists (The Sentinel)', '2m Cat-Cow (The Spine\'s Grace)']
  },
  {
    id: 'posture',
    title: "Vanguard's Pillar",
    subtitle: 'Posture Alignment Quest',
    description: 'Align your skeletal structure to project the aura of a True King. Zero equipment needed.',
    xp: 150,
    gold: 40,
    difficulty: Difficulty.EASY,
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-cyan-400 to-blue-600',
    exercises: ['12 Wall Slides (The Alignment)', '15 Superman Arches (The Wing)', '20 Chin Tucks (The Focus)', '1m Cobra Stretch (The Awakening)'],
    hasAiScanner: true
  },
  {
    id: 'no-db',
    title: 'Path of the Monk',
    subtitle: 'Bodyweight Mastery',
    description: 'Use your own bodyweight as the ultimate weapon. No iron required.',
    xp: 200,
    gold: 50,
    difficulty: Difficulty.MEDIUM,
    icon: <Activity className="w-8 h-8" />,
    color: 'from-emerald-600 to-teal-700',
    exercises: ['20 Diamond Pushups (The Spike)', '30 Prisoner Squats (The Foundation)', '20 Jumping Lunges (The Reflex)', '1m Hollow Hold (The Core)']
  },
  {
    id: 'one-db',
    title: "Squire's Single Hand",
    subtitle: 'Single Dumbbell Discipline',
    description: 'Master the weight with single-arm discipline. Focus on stability.',
    xp: 350,
    gold: 100,
    difficulty: Difficulty.HARD,
    icon: <Dumbbell className="w-8 h-8" />,
    color: 'from-blue-600 to-indigo-700',
    exercises: ['12 Goblet Squats (The Chalice)', '10 Single Arm Snatches (The Rift)', '12 Single Arm Rows (The Pull)', '15 Dumbbell Swings (The Arc)']
  },
  {
    id: 'two-db',
    title: "Twin Blade Mastery",
    subtitle: 'Dual Dumbbell Combat',
    description: 'Double the iron. Focus on floor-based strength without needing a bench.',
    xp: 500,
    gold: 150,
    difficulty: Difficulty.HARD,
    icon: <Shield className="w-8 h-8" />,
    color: 'from-purple-600 to-fuchsia-700',
    exercises: ['12 DB Floor Presses (The Guard)', '10 DB Romanian Deadlifts (The Root)', '12 DB Thrusters (The Blast)', '15 Hammer Curls (The Grip)']
  },
  {
    id: 'hardcore',
    title: 'Legendary Berserker',
    subtitle: 'Hardcore Iron & Will',
    description: 'A test of will. Uses dumbbells and high intensity to crush your limits.',
    xp: 1200,
    gold: 400,
    difficulty: Difficulty.EPIC,
    icon: <Flame className="w-8 h-8" />,
    color: 'from-orange-600 to-red-700',
    exercises: ['20 Devil\'s Presses (The Sacrifice)', '50 Weighted Lunges (The March)', '40 Renegade Rows (The Duel)', 'Max effort Floor Press (The Last Stand)']
  }
];

const TrainingGrounds: React.FC<TrainingGroundsProps> = ({ onCompleteWorkout, setActiveTab }) => {
  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-gold">Training Grounds</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-yellow-500 animate-pulse" /> 
            Forging the Physical Vessel with Floor Space and Iron
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {WORKOUTS.map((workout) => (
          <div 
            key={workout.id}
            className="group relative rpg-card rounded-[3.5rem] overflow-hidden border-white/5 bg-slate-900/40 hover:border-yellow-500/40 transition-all duration-700 flex flex-col hover:shadow-3xl"
          >
            <div className={`h-3 bg-gradient-to-r ${workout.color} opacity-80`} />
            
            <div className="p-10 md:p-12 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-6 rounded-[2rem] bg-black/60 border border-white/10 text-white group-hover:scale-110 transition-transform shadow-2xl group-hover:text-yellow-400`}>
                  {workout.icon}
                </div>
                <div className="text-right space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-black/40 px-4 py-1.5 rounded-full border border-white/5">{workout.difficulty}</span>
                  <div className="flex items-center gap-2 text-yellow-500 font-black text-2xl tracking-tighter italic glow-text-gold">
                    <Trophy size={20} />
                    <span>+{workout.xp} XP</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none group-hover:text-yellow-100 transition-colors">{workout.title}</h3>
                <p className="text-yellow-500 text-[11px] font-black uppercase tracking-[0.3em]">{workout.subtitle}</p>
              </div>

              <p className="text-slate-400 text-lg mb-10 italic leading-relaxed">"{workout.description}"</p>

              <div className="space-y-3 mb-10 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Raid Requirements</p>
                  {workout.hasAiScanner && setActiveTab && (
                    <button 
                      onClick={() => setActiveTab('vanguard')}
                      className="flex items-center gap-2 px-3 py-1 bg-rose-600 text-white font-black text-[8px] uppercase tracking-widest rounded-lg shadow-xl animate-pulse hover:scale-105 transition-transform"
                    >
                      <Scan size={10} /> Launch AI Scanner
                    </button>
                  )}
                </div>
                {workout.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-300 bg-black/40 p-4 rounded-2xl border border-white/5 group-hover:border-yellow-500/20 transition-all">
                    <ChevronRight size={16} className="text-yellow-500" />
                    {ex}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                {workout.hasAiScanner && setActiveTab && (
                  <button 
                    onClick={() => setActiveTab('vanguard')}
                    className="w-full py-6 rounded-[2.5rem] bg-black border-2 border-rose-500/40 text-rose-400 font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-4"
                  >
                    <Scan size={20} /> AI Posture Analysis Mode
                  </button>
                )}
                <button 
                  onClick={() => onCompleteWorkout(workout.xp, workout.gold, workout.difficulty)}
                  className={`w-full py-6 rounded-[2.5rem] bg-gradient-to-r ${workout.color} text-black font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all active:scale-95`}
                >
                  Complete Training Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingGrounds;
