
import React from 'react';
import { AssessmentMap } from '../types';
import { Skull, ShieldAlert, Sparkles, Target } from 'lucide-react';

interface AssessmentPlannerProps {
  assessments: AssessmentMap;
  onUpdate: (key: string, value: string) => void;
}

const TERMS = [1, 2, 3, 4];
const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const AssessmentPlanner: React.FC<AssessmentPlannerProps> = ({ assessments, onUpdate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Yr 8 Assessment Planner</h2>
          <p className="text-slate-400 text-sm italic">"Map out the major bosses of the academic year."</p>
        </div>
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl">
          <Skull className="text-red-500" size={20} />
          <span className="text-xs font-black text-red-400 uppercase tracking-widest">Boss Radar Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TERMS.map(term => (
          <div key={term} className="space-y-4">
            <div className={`p-4 rounded-2xl border-2 text-center shadow-lg transition-all ${
              term === 1 ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' :
              term === 2 ? 'bg-blue-950/20 border-blue-800 text-blue-400' :
              term === 3 ? 'bg-amber-950/20 border-amber-800 text-amber-400' :
              'bg-rose-950/20 border-rose-800 text-rose-400'
            }`}>
              <h3 className="text-xl font-black uppercase tracking-tighter">Term {term}</h3>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Campaign Phase</p>
            </div>

            <div className="space-y-2">
              {WEEKS.map(week => {
                const key = `term${term}_week${week}`;
                const value = assessments[key] || '';
                const hasValue = value.trim().length > 0;

                return (
                  <div 
                    key={week} 
                    className={`rpg-card rounded-xl p-3 border transition-all flex flex-col gap-2 group ${
                      hasValue ? 'border-red-500/50 bg-red-950/5' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        hasValue ? 'text-red-400' : 'text-slate-500'
                      }`}>
                        Week {week}
                      </span>
                      {hasValue && <Target size={12} className="text-red-500 animate-pulse" />}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Boss Raid..."
                      value={value}
                      onChange={(e) => onUpdate(key, e.target.value)}
                      className="bg-transparent border-none text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:ring-0 w-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center gap-6">
        <div className="bg-blue-600/20 p-4 rounded-2xl">
          <ShieldAlert className="text-blue-400" size={32} />
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tighter">Strategic Intelligence</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Major assessments are marked as <span className="text-red-400 font-bold">Boss Raids</span>. 
            Update your tracker early to ensure your Hero party is prepared for the mental siege. 
            XP rewards for these are <span className="text-yellow-500 font-bold">LEGENDARY</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPlanner;
