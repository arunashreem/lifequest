
import React, { useState } from 'react';
import { Reward } from '../types';
import { REWARD_ICONS } from '../constants';
import { Coins, ShoppingBag, Lock, CheckCircle, Sparkles, Trophy, Plus, Trash2, Clock, Gamepad2, IceCream, Gift } from 'lucide-react';

interface TreasuryProps {
  gold: number;
  rewards: Reward[];
  onPurchase: (reward: Reward) => void;
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onDeleteReward: (id: string) => void;
}

const Treasury: React.FC<TreasuryProps> = ({ gold, rewards, onPurchase, onAddReward, onDeleteReward }) => {
  const [isAdding, setIsAdding] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState<number>(100);
  const [newType, setNewType] = useState<Reward['type']>('FUN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReward({
      title: newTitle,
      cost: newCost,
      type: newType
    });
    setNewTitle('');
    setNewCost(100);
    setIsAdding(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-[1.5rem] shadow-2xl shadow-yellow-900/40 rotate-[-1deg] border border-white/10">
             <ShoppingBag className="text-white" size={36} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic leading-none tracking-tight">The Royal Treasury</h2>
            <div className="flex items-center gap-4 mt-2">
               <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Sparkles size={12} className="text-yellow-500 animate-pulse" />
                Exchange your spoils for legendary boons
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={16} className="text-yellow-500" />
            {isAdding ? 'Close Forge' : 'Scribe New Boon'}
          </button>

          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-yellow-500/20 shadow-2xl">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20 shadow-lg shrink-0">
              <Coins size={24} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest leading-none mb-1">Available Balance</p>
              <p className="text-3xl font-black text-white tracking-tighter italic">{gold.toLocaleString()} <span className="text-sm text-yellow-500 not-italic">GP</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reward Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="rpg-card p-8 rounded-[2rem] border-yellow-500/20 bg-slate-900/40 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
            <Trophy size={20} className="text-yellow-500" />
            Forge a Custom Reward
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Boon Name</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="E.g. Extra Hour Gaming..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cost (GP)</label>
              <input 
                type="number" 
                value={newCost}
                onChange={e => setNewCost(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
              <select 
                value={newType}
                onChange={e => setNewType(e.target.value as Reward['type'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none appearance-none"
              >
                <option value="SCREEN_TIME">Screen Time</option>
                <option value="FUN">Fun & Hobbies</option>
                <option value="FOOD">Food & Treats</option>
                <option value="OTHER">Other Boon</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-6 w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-yellow-900/20 transition-all active:scale-95">
            Scribe Boon to Treasury
          </button>
        </form>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const canAfford = gold >= reward.cost;
          return (
            <div 
              key={reward.id}
              className={`group rpg-card p-6 rounded-[2.5rem] transition-all duration-500 border-t-2 relative ${
                canAfford 
                  ? 'border-t-yellow-500/30 hover:shadow-[0_20px_50px_rgba(234,179,8,0.15)] hover:-translate-y-1' 
                  : 'opacity-60 grayscale border-t-slate-800'
              }`}
            >
              {/* Delete Button */}
              <button 
                onClick={() => onDeleteReward(reward.id)}
                className="absolute top-4 right-4 p-2 text-slate-700 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 z-20"
                title="Shatter Reward"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-slate-950/80 border transition-all duration-500 shadow-xl ${
                  canAfford ? 'border-yellow-500/20 text-yellow-500 group-hover:scale-110 group-hover:rotate-3' : 'border-slate-800 text-slate-600'
                }`}>
                  {REWARD_ICONS[reward.type]}
                </div>
                <div className={`px-4 py-1.5 rounded-full border font-black text-[10px] tracking-widest uppercase shadow-inner ${
                  canAfford ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {reward.cost} Gold
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-yellow-400 transition-colors">
                  {reward.title}
                </h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={10} />
                  Tier: {reward.cost > 1000 ? 'Epic Boon' : reward.cost > 500 ? 'Rare Perk' : 'Common Utility'}
                </p>
              </div>

              <button 
                onClick={() => onPurchase(reward)}
                disabled={!canAfford}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                  canAfford 
                    ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-yellow-900/20 hover:from-yellow-500 hover:to-amber-500 hover:shadow-yellow-500/20' 
                    : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {canAfford ? (
                  <>
                    <ShoppingBag size={16} />
                    Claim Boon
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Insufficient Gold
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="rpg-card p-8 rounded-[3rem] border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
          <Coins className="text-yellow-500" size={32} />
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight">Gold is the Proof of Effort</h4>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Gold is minted through focused work, habit completion, and physical mastery. Unlike typical loot, this gold represents time earned back. Use it wisely to unlock rest phases and entertainment boons without the burden of guilt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
