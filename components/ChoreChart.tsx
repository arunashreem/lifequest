
import React, { useState } from 'react';
import { UserStats } from '../types';
import { Wallet, Target, TrendingUp, CheckCircle2, Circle, Activity, Coins, ShieldAlert, Sparkles, RefreshCw, Plus, Minus, Edit3, Save, X, Rocket, Trash2, Settings2 } from 'lucide-react';
import { INITIAL_CHORES } from '../constants';

interface ChoreChartProps {
  stats: UserStats;
  onUpdateStats: (updates: Partial<UserStats>) => void;
  onManualXpAward: (xp: number, message: string) => void;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const ChoreChart: React.FC<ChoreChartProps> = ({ stats, onUpdateStats, onManualXpAward }) => {
  const { vault, goalTitle, goalAmount, chores = INITIAL_CHORES, completionGrid } = stats.choreMoney;
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [localTitle, setLocalTitle] = useState(goalTitle);
  const [localAmount, setLocalAmount] = useState(goalAmount);
  
  const [isManagingChores, setIsManagingChores] = useState(false);

  const currentEarnedThisWeek = completionGrid.flat().reduce((acc, completed, idx) => {
    if (!completed) return acc;
    const rowIdx = Math.floor(idx / 7);
    const choreValue = chores[rowIdx]?.value || 1;
    return acc + choreValue;
  }, 0);

  const currentTotal = vault;
  const goalProgress = (currentTotal / (goalAmount || 1)) * 100;

  const toggleCell = (rowIdx: number, colIdx: number) => {
    const newGrid = [...completionGrid.map(row => [...row])];
    const wasCompleted = newGrid[rowIdx][colIdx];
    newGrid[rowIdx][colIdx] = !wasCompleted;

    const choreValue = chores[rowIdx]?.value || 1;
    const newVault = wasCompleted ? vault - choreValue : vault + choreValue;
    
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        completionGrid: newGrid,
        vault: newVault // Allowed to go negative
      }
    });

    if (!wasCompleted) {
      onManualXpAward(25, `Duty Fulfilled: ${chores[rowIdx]?.name}. Asset secured: $${choreValue.toFixed(2)}`);
    } else {
      onManualXpAward(-25, `Duty Rescinded: ${chores[rowIdx]?.name}. Asset retracted.`);
    }
  };

  const adjustVault = (amount: number) => {
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        vault: vault + amount // Allowed to go negative
      }
    });
  };

  const resetGrid = () => {
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        completionGrid: chores.map(() => Array(7).fill(false))
      }
    });
  };

  const saveGoal = () => {
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        goalTitle: localTitle,
        goalAmount: localAmount
      }
    });
    setIsEditingGoal(false);
  };

  const addChore = () => {
    const newChore = { id: Math.random().toString(36).substr(2, 9), name: 'New Sector', value: 1.00 };
    const newChores = [...chores, newChore];
    const newGrid = [...completionGrid, Array(7).fill(false)];
    
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        chores: newChores,
        completionGrid: newGrid
      }
    });
  };

  const updateChore = (idx: number, updates: Partial<{ name: string; value: number }>) => {
    const newChores = chores.map((c, i) => i === idx ? { ...c, ...updates } : c);
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        chores: newChores
      }
    });
  };

  const deleteChore = (idx: number) => {
    const newChores = chores.filter((_, i) => i !== idx);
    const newGrid = completionGrid.filter((_, i) => i !== idx);
    onUpdateStats({
      choreMoney: {
        ...stats.choreMoney,
        chores: newChores,
        completionGrid: newGrid
      }
    });
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-teal">Base Maintenance</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-teal-500 animate-pulse" /> 
            Executing Daily Supply Line and Sanctum Maintenance
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsManagingChores(!isManagingChores)}
            className={`flex items-center gap-3 px-6 py-3 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl ${
              isManagingChores ? 'bg-orange-600 border-orange-400 text-white animate-pulse' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-white hover:border-white/20'
            }`}
          >
            <Settings2 size={14} /> {isManagingChores ? 'Exit Sector Forge' : 'Sector Forge'}
          </button>
          <button 
            onClick={resetGrid}
            className="flex items-center gap-3 px-6 py-3 bg-slate-950 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest shadow-2xl"
          >
            <RefreshCw size={14} /> Reset Matrix
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Weekly Efficiency */}
        <div className="xl:col-span-3 rpg-card rounded-[3rem] p-10 bg-slate-950 border-emerald-500/30 relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={120} className="text-emerald-500" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
             <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-8">Weekly Yield</h3>
             <div className="flex items-baseline gap-2">
               <span className="text-7xl font-black text-white italic tracking-tighter glow-text-green">${currentEarnedThisWeek.toFixed(2)}</span>
             </div>
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-10 italic">CURRENT WEEK ACCUMULATION</p>
          </div>
        </div>

        {/* Real World Assets Vault */}
        <div className="xl:col-span-4 rpg-card rounded-[3rem] p-10 bg-black border-yellow-500/20 relative group hover:border-yellow-400/40 transition-all shadow-3xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500 shadow-xl">
                 <Wallet size={20} />
               </div>
               <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">REAL-WORLD ASSETS</span>
             </div>
             <Sparkles size={16} className="text-yellow-500 animate-pulse" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="flex items-baseline gap-2 justify-center lg:justify-start">
               <span className={`text-7xl font-black italic tracking-tighter glow-text-gold ${currentTotal < 0 ? 'text-red-500 glow-text-red' : 'text-white'}`}>
                {currentTotal < 0 ? '-' : ''}${Math.abs(currentTotal).toFixed(2)}
               </span>
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">USD</span>
            </div>

            <div className="grid grid-cols-4 gap-3 w-full">
              <button onClick={() => adjustVault(-5)} className="py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-500 hover:text-red-500 hover:border-red-500/40 transition-all active:scale-95 flex items-center justify-center gap-1 group/minus">
                <Minus size={14} /><span className="text-[10px] font-black">$5</span>
              </button>
              <button onClick={() => adjustVault(-1)} className="py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-500 hover:text-red-400 hover:border-red-400/30 transition-all active:scale-95 flex items-center justify-center gap-1">
                <Minus size={14} /><span className="text-[10px] font-black">$1</span>
              </button>
              <button onClick={() => adjustVault(1)} className="py-4 bg-yellow-600/10 border border-yellow-500/30 rounded-2xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all active:scale-95 flex items-center justify-center gap-1">
                <Plus size={14} /><span className="text-[10px] font-black">$1</span>
              </button>
              <button onClick={() => adjustVault(5)} className="py-4 bg-yellow-600/20 border border-yellow-500/50 rounded-2xl text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all active:scale-95 flex items-center justify-center gap-1 group/plus">
                <Plus size={14} /><span className="text-[10px] font-black">$5</span>
              </button>
            </div>
          </div>
        </div>

        {/* PROCUREMENT TARGET */}
        <div className="xl:col-span-5 rpg-card rounded-[3rem] p-10 md:p-12 bg-gradient-to-br from-indigo-950/40 to-slate-950 border-blue-500/30 relative overflow-hidden shadow-3xl group/target">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/target:opacity-[0.07] transition-opacity pointer-events-none">
            <Target size={220} className="text-blue-400" />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 shadow-2xl border border-blue-500/40">
                <Rocket size={24} />
              </div>
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em] italic">FINAL PROCUREMENT</span>
            </div>
            <button 
              onClick={() => { if(isEditingGoal) saveGoal(); else setIsEditingGoal(true); }}
              className={`p-3 rounded-xl transition-all shadow-xl ${isEditingGoal ? 'bg-emerald-600 text-white animate-pulse' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-blue-600/20'}`}
            >
              {isEditingGoal ? <Save size={20} /> : <Edit3 size={20} />}
            </button>
          </div>
          
          <div className="relative z-10 space-y-10">
            {isEditingGoal ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Target Designation</label>
                  <input 
                    type="text" 
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    placeholder="E.g. Neural Link VR-900..."
                    className="w-full bg-black border-2 border-blue-500/30 rounded-3xl px-8 py-5 text-xl font-black text-white focus:border-blue-500 outline-none shadow-inner"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Asset Value ($)</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500 text-2xl font-black">$</span>
                    <input 
                      type="number" 
                      value={localAmount}
                      onChange={(e) => setLocalAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-black border-2 border-blue-500/30 rounded-3xl pl-16 pr-8 py-5 text-3xl font-black text-white focus:border-blue-500 outline-none shadow-inner tabular-nums"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { setIsEditingGoal(false); setLocalTitle(goalTitle); setLocalAmount(goalAmount); }} className="flex-1 py-5 bg-slate-900 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:text-white transition-all">Cancel</button>
                  <button onClick={saveGoal} className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl">Recalibrate Target</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="space-y-2">
                   <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic glow-text-blue leading-tight break-words">
                    {goalTitle || 'NO TARGET ACQUIRED'}
                   </h4>
                   <div className="flex items-baseline gap-3">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ESTIMATED ASSET COST:</span>
                     <span className="text-3xl font-black text-blue-400 tabular-nums tracking-tighter">${goalAmount.toLocaleString()}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">PROCUREMENT PROGRESS</span>
                     <span className="text-2xl font-black text-white italic">{Math.max(0, Math.min(100, goalProgress)).toFixed(0)}%</span>
                  </div>
                  <div className="h-8 bg-black/80 rounded-[1.2rem] overflow-hidden p-1.5 border border-white/10 relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-400 rounded-[0.8rem] transition-all duration-[2000ms] relative group-hover/target:shadow-[0_0_40px_rgba(59,130,246,0.8)]"
                      style={{ width: `${Math.max(0, Math.min(100, goalProgress))}%` }}
                    >
                       <div className="absolute top-0 bottom-0 right-0 w-2 bg-white/40 blur-[2px] animate-pulse" />
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      ${currentTotal.toFixed(2)} SECURED
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                        DEPLOYMENT IN: {Math.max(0, Math.ceil((goalAmount - currentTotal) / Math.max(0.1, (currentEarnedThisWeek/7))))} DAYS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Maintenance Grid */}
      <div className="rpg-card rounded-[3.5rem] border-white/10 bg-black/40 overflow-hidden shadow-3xl flex flex-col">
        <div className="overflow-x-auto no-scrollbar touch-pan-x">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-8 border-b border-r border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest text-left sticky left-0 bg-black/90 backdrop-blur-md z-20">Sector</th>
                {DAYS.map(day => (
                  <th key={day} className="p-8 border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chores.map((chore, rowIdx) => (
                <tr key={chore.id} className="group">
                  <td className="p-8 border-r border-white/5 bg-slate-950/80 sticky left-0 z-10 backdrop-blur-md">
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      {isManagingChores ? (
                        <div className="space-y-3 animate-in slide-in-from-left duration-300">
                          <input 
                            type="text" 
                            value={chore.name}
                            onChange={(e) => updateChore(rowIdx, { name: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs font-bold focus:border-teal-500 outline-none"
                          />
                          <div className="flex items-center gap-2">
                             <div className="relative flex-1">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 text-[10px] font-black">$</span>
                               <input 
                                 type="number" 
                                 value={chore.value}
                                 onChange={(e) => updateChore(rowIdx, { value: parseFloat(e.target.value) || 0 })}
                                 className="w-full bg-black border border-white/10 rounded-xl pl-6 pr-3 py-2 text-white text-[10px] font-bold focus:border-teal-500 outline-none"
                               />
                             </div>
                             <button onClick={() => deleteChore(rowIdx)} className="p-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl">
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-black text-white uppercase tracking-tight italic">{chore.name}</span>
                          <div className="flex items-center gap-2">
                            <Coins size={12} className="text-teal-500" />
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">${chore.value.toFixed(2)} UNIT</span>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  {DAYS.map((_, colIdx) => {
                    const isCompleted = completionGrid[rowIdx]?.[colIdx] || false;
                    return (
                      <td key={colIdx} className="p-2 border border-white/5 text-center relative overflow-hidden">
                        <button 
                          onClick={() => toggleCell(rowIdx, colIdx)}
                          className={`w-full h-24 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]' 
                              : 'bg-slate-950/40 border border-white/5 text-slate-800 hover:border-teal-500/50'
                          }`}
                        >
                          {isCompleted ? (
                            <div className="flex flex-col items-center gap-1">
                              <CheckCircle2 size={24} />
                              <span className="text-[9px] font-black">SECURED</span>
                            </div>
                          ) : (
                            <Circle size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {isManagingChores && (
                <tr>
                  <td colSpan={8} className="p-6 text-center bg-teal-500/5 border-t border-white/5">
                    <button 
                      onClick={addChore}
                      className="flex items-center gap-3 px-10 py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-3xl mx-auto active:scale-95 group"
                    >
                      <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Initialize New Sector
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-8 shadow-inner">
         <div className="p-5 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-xl">
           <ShieldAlert size={32} />
         </div>
         <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
           "Discipline in the small things builds the character for the great wars. Every sector maintained is a link forged in your suit of armor."
         </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default ChoreChart;
