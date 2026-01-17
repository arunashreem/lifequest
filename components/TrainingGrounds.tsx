
import React from 'react';
import { Dumbbell, Flame, Zap, Shield, Trophy, ChevronRight, Activity, Sparkles, Wind } from 'lucide-react';
import { Difficulty } from '../types';

interface TrainingGroundsProps {
  onCompleteWorkout: (xp: number, gold: number, difficulty: Difficulty) => void;
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
    exercises: ['12 Wall Slides (The Alignment)', '15 Superman Arches (The Wing)', '20 Chin Tucks (The Focus)', '1m Cobra Stretch (The Awakening)']
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

const TrainingGrounds: React.FC<TrainingGroundsProps> = ({ onCompleteWorkout }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">The Training Grounds</h2>
          <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            Forge your physical vessel with nothing but floor space and iron.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKOUTS.map((workout) => (
          <div 
            key={workout.id}
            className="group relative rpg-card rounded-2xl overflow-hidden border-slate-800 hover:border-blue-500/50 transition-all flex flex-col"
          >
            <div className={`h-2 bg-gradient-to-r ${workout.color}`} />
            
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-xl bg-slate-900 border border-slate-800 text-white group-hover:scale-110 transition-transform shadow-lg`}>
                  {workout.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{workout.difficulty}</span>
                  <div className="flex items-center gap-2 text-yellow-500 font-black mt-1">
                    <Trophy size={14} />
                    <span>+{workout.xp} XP</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{workout.title}</h3>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">{workout.subtitle}</p>
              <p className="text-slate-400 text-sm mb-6 italic">"{workout.description}"</p>

              <div className="space-y-2 mb-8">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Raid Requirements</p>
                {workout.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-black/20 p-2 rounded-lg border border-white/5">
                    <ChevronRight size={12} className="text-blue-500" />
                    {ex}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onCompleteWorkout(workout.xp, workout.gold, workout.difficulty)}
                className={`w-full py-4 rounded-xl bg-gradient-to-r ${workout.color} text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-black/40 hover:brightness-110 transition-all active:scale-95`}
              >
                Complete Training Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingGrounds;
