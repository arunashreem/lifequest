
import React, { useState } from 'react';
import { Reward } from '../types';
import { REWARD_ICONS } from '../constants';
import { Coins, ShoppingBag, Lock, CheckCircle, Sparkles, Trophy, Plus, Trash2, Clock, Gamepad2, IceCream, Gift, Activity } from 'lucide-react';

interface TreasuryProps {
  gold: number;
  rewards: Reward[];
  onPurchase: (reward: Reward) => void;
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onDeleteReward: (id: string) => void;
}

const Treasury: React.FC<TreasuryProps> = ({ gold, rewards, onPurchase, onAddReward, onDeleteReward }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState<number>(100);
  const [newType, setNewType] = useState<Reward['type']>('FUN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReward({ title: newTitle, cost: newCost, type: newType });
    setNewTitle(''); setNewCost(100); setIsAdding(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-gold">The Royal Treasury</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-yellow-500 animate-pulse" /> 
            Exchange Earned Temporal Capital for Real-World Boons
          </p>
        </div>
        <div className="flex items-center gap-6 bg-slate-950 border-2 border-yellow-500/20 p-8 rounded-[3rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/40 shadow-2xl relative z-10">
            <Coins size={32} className="text-yellow-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[12px] font-black text-yellow-600 uppercase tracking-widest mb-1">Total Assets</p>
            <p className="text-5xl font-black text-white tracking-tighter italic glow-text-gold">{gold.toLocaleString()} <span className="text-xl text-yellow-500 not-italic">GP</span></p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-4 px-10 py-6 bg-slate-900 border-2 border-white/5 hover:border-yellow-500/40 rounded-[2rem] text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all shadow-xl active:scale-95">
          <Plus size={20} className="text-yellow-500" />
          {isAdding ? 'Close Creation Forge' : 'Scribe New Reward'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="rpg-card p-12 md:p-16 rounded-[4rem] border-yellow-500/30 bg-slate-950/80 shadow-3xl animate-in zoom-in-95 duration-500">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4">
            <Trophy size={28} className="text-yellow-500" /> Forge a New Boon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Boon Designation</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="E.g. Extra Hour Gaming..." className="w-full bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-yellow-500 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">GP Requirement</label>
              <input type="number" value={newCost} onChange={e => setNewCost(parseInt(e.target.value) || 0)} className="w-full bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-yellow-500 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Aura Type</label>
              <select value={newType} onChange={e => setNewType(e.target.value as Reward['type'])} className="w-full bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-yellow-500 outline-none appearance-none">
                <option value="SCREEN_TIME">Screen Time</option>
                <option value="FUN">Fun & Hobbies</option>
                <option value="FOOD">Treats</option>
                <option value="OTHER">Misc Boon</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-12 w-full py-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95">Commit to Archive</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {rewards.map((reward) => {
          const canAfford = gold >= reward.cost;
          return (
            <div key={reward.id} className={`group rpg-card p-10 rounded-[4rem] border-t-8 transition-all duration-700 relative overflow-hidden ${canAfford ? 'border-t-yellow-500 bg-slate-900 shadow-3xl hover:-translate-y-4' : 'opacity-40 grayscale border-t-slate-800'}`}>
              <button onClick={() => onDeleteReward(reward.id)} className="absolute top-6 right-8 p-3 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-black/40 rounded-xl"><Trash2 size={18} /></button>
              <div className="flex flex-col items-center text-center space-y-8">
                <div className={`p-8 rounded-[2.5rem] bg-black/40 border-2 transition-all duration-700 ${canAfford ? 'border-yellow-500/40 text-yellow-500 group-hover:scale-110 shadow-2xl shadow-yellow-900/40' : 'border-slate-800 text-slate-700'}`}>
                  {REWARD_ICONS[reward.type]}
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{reward.title}</h4>
                  <p className="text-[12px] font-black text-yellow-500 uppercase tracking-widest">{reward.cost} GOLD PIECES</p>
                </div>
                <button onClick={() => onPurchase(reward)} disabled={!canAfford} className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${canAfford ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white hover:brightness-110' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                  {canAfford ? 'CLAIM REWARD' : 'INSUFFICIENT ASSETS'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Treasury;
