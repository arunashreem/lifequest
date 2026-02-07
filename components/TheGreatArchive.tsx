import React, { useState, useMemo } from 'react';
import { Book, Difficulty } from '../types';
import { Library, BookOpen, BookCheck, Plus, Trash2, Wand2, Loader2, Sparkles, Trophy, ArrowUpDown, Clock, Activity } from 'lucide-react';
import { evaluateBookCompletion } from '../services/gemini';

interface TheGreatArchiveProps {
  books: Book[];
  onAddBook: (title: string, author: string) => void;
  onDeleteBook: (id: string) => void;
  onCompleteBook: (id: string, xp: number, gold: number, difficulty: Difficulty, feedback: string) => void;
}

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  [Difficulty.EASY]: 1,
  [Difficulty.MEDIUM]: 2,
  [Difficulty.HARD]: 3,
  [Difficulty.EPIC]: 4
};

const getDifficultyColor = (difficulty: Difficulty | string | undefined) => {
  const d = difficulty as Difficulty;
  switch (d) {
    case Difficulty.EASY: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case Difficulty.MEDIUM: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case Difficulty.HARD:
    case Difficulty.EPIC: return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-slate-800/40 text-slate-400 border-white/5';
  }
};

const BookCover: React.FC<{ book: Book }> = ({ book }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="absolute inset-0 bg-black">
      <div className={`absolute inset-0 transition-opacity duration-700 ${isLoaded && !hasError ? 'opacity-10' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.1)_0%,_transparent_70%)]" />
         <div className="absolute inset-0 flex items-center justify-center opacity-20">
           <BookOpen size={120} className="text-slate-800" />
         </div>
      </div>
      {!hasError && (
        <img 
          src={book.coverUrl || 'https://images.unsplash.com/photo-1543004218-2fe308c6666a?auto=format&fit=crop&w=400&q=80'} 
          alt={book.title}
          className={`absolute inset-0 w-full h-full object-cover object-[center_top_15%] transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

const TheGreatArchive: React.FC<TheGreatArchiveProps> = ({ books, onAddBook, onDeleteBook, onCompleteBook }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [masterySort, setMasterySort] = useState<'recent' | 'difficulty'>('recent');

  const ANNUAL_GOAL = 40; 
  const collectionCount = books.length;
  const progressPercent = (collectionCount / ANNUAL_GOAL) * 100;

  const masteredBooks = useMemo(() => {
    const list = books.filter(b => b.completed);
    if (masterySort === 'difficulty') {
      return [...list].sort((a, b) => {
        const weightA = DIFFICULTY_WEIGHT[a.difficulty || Difficulty.EASY];
        const weightB = DIFFICULTY_WEIGHT[b.difficulty || Difficulty.EASY];
        return weightB - weightA; 
      });
    }
    return list;
  }, [books, masterySort]);

  const handleComplete = async (book: Book) => {
    setIsAnalyzing(book.id);
    try {
      const isOverLimit = collectionCount >= ANNUAL_GOAL;
      const result = await evaluateBookCompletion(book.title, book.author, isOverLimit);
      onCompleteBook(book.id, result.xp, result.gold, result.difficulty, result.feedback);
    } catch (e) { console.error(e); } finally { setIsAnalyzing(null); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddBook(newTitle, newAuthor || 'Unknown Author');
    setNewTitle('');
    setNewAuthor('');
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-blue">The Great Archive</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-cyan-400 animate-pulse" /> 
            Scribing Universal Lore into Digital Existence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           <form onSubmit={handleSubmit} className="rpg-card p-10 md:p-14 rounded-[4rem] border-white/10 bg-slate-950/80 shadow-3xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
            <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
              <Plus size={20} /> New Lore Acquisition
            </h3>
            <div className="flex flex-col md:flex-row gap-6 relative z-10 w-full">
              <input type="text" placeholder="Tome Title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} 
                     className="flex-[2] min-w-0 bg-black border-2 border-white/10 rounded-3xl px-8 py-6 text-xl text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-800" />
              <input type="text" placeholder="Author..." value={newAuthor} onChange={e => setNewAuthor(e.target.value)} 
                     className="flex-1 min-w-0 bg-black border-2 border-white/10 rounded-3xl px-8 py-6 text-xl text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-800" />
              <button type="submit" className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.4)] active:scale-95">
                Seal Grimoire
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4">
          <div className="rpg-card p-8 md:p-10 rounded-[3.5rem] border-white/5 bg-slate-900/40 h-full flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <span className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-normal leading-tight">Archive Progress</span>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-3xl md:text-4xl font-black text-white glow-text-blue tracking-tighter tabular-nums leading-none">
                  {collectionCount}
                </span>
                <span className="text-slate-700 text-[10px] md:text-[12px] font-black uppercase tracking-widest">/ {ANNUAL_GOAL}</span>
              </div>
            </div>
            <div className="h-4 bg-black rounded-full border-2 border-white/5 p-1 overflow-hidden shadow-inner relative mb-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${collectionCount >= ANNUAL_GOAL ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 'bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
            {collectionCount > ANNUAL_GOAL && (
              <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.4em] flex items-center gap-2 animate-pulse justify-center">
                <Trophy size={14} /> Scholarly Limit Broken
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {books.filter(b => !b.completed).map((book) => (
          <div key={book.id} className="relative h-[32rem] rounded-[4rem] overflow-hidden border-2 border-white/5 group transition-all duration-700 hover:border-cyan-500/40 hover:shadow-3xl bg-black">
            <BookCover book={book} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/20 transition-all duration-700" />
            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-cyan-400 shadow-2xl">
                  <BookOpen size={24} />
                </div>
                <button onClick={() => onDeleteBook(book.id)} className="p-3 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 bg-black/40 rounded-xl border border-white/5"><Trash2 size={20} /></button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-none group-hover:text-cyan-400 transition-colors drop-shadow-2xl">{book.title}</h4>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-3">BY {book.author}</p>
                </div>
                <button 
                  onClick={() => handleComplete(book)} disabled={isAnalyzing === book.id}
                  className={`w-full flex items-center justify-center gap-4 py-6 rounded-3xl font-black text-[12px] uppercase tracking-widest transition-all backdrop-blur-md border ${isAnalyzing === book.id ? 'bg-slate-900 text-slate-600 border-white/5' : 'bg-cyan-600 text-white border-cyan-400 hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'}`}
                >
                  {isAnalyzing === book.id ? <Loader2 size={22} className="animate-spin" /> : <Wand2 size={22} />}
                  Master Lore Path
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {masteredBooks.length > 0 && (
        <div className="pt-20 border-t border-white/5 space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-4">
            <h3 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.6em]">Grimoires of Mastered Wisdom</h3>
            <div className="flex bg-slate-950 rounded-2xl p-2 border border-white/5 shadow-2xl">
              <button onClick={() => setMasterySort('recent')} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${masterySort === 'recent' ? 'bg-white/10 text-cyan-400 shadow-xl border border-white/10' : 'text-slate-600 hover:text-slate-400'}`}><Clock size={14} /> Recent</button>
              <button onClick={() => setMasterySort('difficulty')} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${masterySort === 'difficulty' ? 'bg-white/10 text-cyan-400 shadow-xl border border-white/10' : 'text-slate-600 hover:text-slate-400'}`}><ArrowUpDown size={14} /> Difficulty</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {masteredBooks.map((book) => (
              <div key={book.id} className="relative h-48 rounded-[2.5rem] overflow-hidden border border-white/10 group hover:border-cyan-500/40 transition-all hover:scale-105 bg-slate-950 shadow-2xl">
                <BookCover book={book} />
                <div className="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-all" />
                <div className="relative p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20"><BookCheck size={18} /></div>
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full border uppercase tracking-[0.2em] ${getDifficultyColor(book.difficulty)}`}>{book.difficulty || 'Scholar'}</span>
                  </div>
                  <div className="drop-shadow-2xl">
                    <h5 className="text-base font-black text-white truncate uppercase tracking-tight">{book.title}</h5>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">BY {book.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default TheGreatArchive;