
import React from 'react';
import { AssessmentMap } from '../types';
import { Skull, ShieldAlert, Sparkles, Target, Activity, Zap } from 'lucide-react';

interface AssessmentPlannerProps {
  assessments: AssessmentMap;
  onUpdate: (key: string, value: string) => void;
}

const TERMS = [1, 2, 3, 4];
const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const AssessmentPlanner: React.FC<AssessmentPlannerProps> = ({ assessments, onUpdate }) => {
  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-red">Yr 8 Plan</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-red-500 animate-pulse" /> 
            Mapping Major Academic Bosses and Tactical Deadlines
          </p>
        </div>
        <div className="flex items-center gap-3 bg-red-500/10 border-2 border-red-500/30 px-8 py-4 rounded-[2rem] shadow-3xl">
          <Skull className="text-red-500" size={24} />
          <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Boss Radar Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TERMS.map(term => (
          <div key={term} className="space-y-6">
            <div className={`p-6 rounded-[2.5rem] border-2 text-center shadow-2xl transition-all ${
              term === 1 ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' :
              term === 2 ? 'bg-blue-950/20 border-blue-500/40 text-blue-400' :
              term === 3 ? 'bg-amber-950/20 border-amber-500/40 text-amber-400' :
              'bg-rose-950/20 border-rose-500/40 text-rose-400'
            }`}>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Term {term}</h3>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.3em] mt-1">Campaign Phase</p>
            </div>

            <div className="space-y-3">
              {WEEKS.map(week => {
                const key = `term${term}_week${week}`;
                const value = assessments[key] || '';
                const hasValue = value.trim().length > 0;

                return (
                  <div 
                    key={week} 
                    className={`rpg-card rounded-[2rem] p-5 border-2 transition-all flex flex-col gap-3 group overflow-hidden ${
                      hasValue ? 'border-red-500/50 bg-red-950/20 shadow-xl' : 'border-white/5 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                        hasValue ? 'text-red-400' : 'text-slate-600'
                      }`}>
                        Week {week}
                      </span>
                      {hasValue && <Target size={14} className="text-red-500 animate-pulse" />}
                    </div>
                    <input
                      type="text"
                      placeholder="Input Boss..."
                      value={value}
                      onChange={(e) => onUpdate(key, e.target.value)}
                      className="bg-transparent border-none text-base font-bold text-white placeholder:text-slate-800 focus:outline-none focus:ring-0 w-full p-0"
                    />
                    {hasValue && <div className="h-1 w-full bg-red-600 rounded-full mt-1 opacity-40 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rpg-card p-10 md:p-14 rounded-[4rem] border-white/10 bg-slate-900/40 flex flex-col md:flex-row items-center gap-10 shadow-3xl">
        <div className="bg-red-600/20 p-8 rounded-[2.5rem] border-2 border-red-500/30 shadow-2xl relative">
          <ShieldAlert className="text-red-500" size={48} />
          <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse -z-10" />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic glow-text-red">Strategic Intelligence</h4>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Major assessments are designated as <span className="text-red-400 font-bold">Boss Raids</span>. 
            Update your tracker early to ensure your party is prepared for the mental siege. 
            Clearing these bosses awards <span className="text-yellow-500 font-bold">LEGENDARY XP</span> and increases your standing in the realm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPlanner;
