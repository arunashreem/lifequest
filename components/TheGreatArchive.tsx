
import React, { useState, useMemo } from 'react';
import { Book, Difficulty } from '../types';
import { Library, BookOpen, BookCheck, Plus, Trash2, Wand2, Loader2, Sparkles, Trophy, ArrowUpDown, Clock } from 'lucide-react';
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

// Easy in light green, Medium in light yellow, Difficult/Epic in light red
const getDifficultyColor = (difficulty: Difficulty | string | undefined) => {
  const d = difficulty as Difficulty;
  switch (d) {
    case Difficulty.EASY:
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case Difficulty.MEDIUM:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case Difficulty.HARD:
    case Difficulty.EPIC:
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const BookCover: React.FC<{ book: Book }> = ({ book }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 bg-slate-900">
      <div className={`absolute inset-0 transition-opacity duration-700 ${isLoaded && !hasError ? 'opacity-20' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
         <div className="absolute inset-0 flex items-center justify-center opacity-10">
           <BookOpen size={120} className="text-white" />
         </div>
      </div>

      {!hasError && (
        <img 
          src={book.coverUrl || 'https://images.unsplash.com/photo-1543004218-2fe308c6666a?auto=format&fit=crop&w=400&q=80'} 
          alt={book.title}
          className={`absolute inset-0 w-full h-full object-cover object-[center_top_15%] transition-all duration-1000 group-hover:scale-110 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
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
  const completedCount = books.filter(b => b.completed).length;
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddBook(newTitle, newAuthor || 'Unknown Author');
    setNewTitle('');
    setNewAuthor('');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header & Goal Tracker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[1.5rem] shadow-2xl shadow-cyan-900/40 rotate-[-1deg] border border-white/10">
             <Library className="text-white" size={36} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">The Great Archive</h2>
            <div className="flex items-center gap-4 mt-2">
               <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Sparkles size={12} className="text-cyan-500 animate-pulse" />
                Scribing lore into your library
              </span>
              <div className="h-4 w-px bg-slate-800" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {completedCount} Mastered
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive Collection Goal</span>
            <span className="text-lg font-black text-cyan-400">{collectionCount} <span className="text-slate-600 text-xs">/ {ANNUAL_GOAL} TOMES</span></span>
          </div>
          <div className="h-4 bg-slate-900 rounded-full border-2 border-slate-800 p-1 overflow-hidden shadow-inner relative">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                collectionCount >= ANNUAL_GOAL 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-400'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            >
              <div className="w-full h-full bg-white/20 animate-pulse" />
            </div>
          </div>
          {collectionCount > ANNUAL_GOAL && (
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2 animate-bounce">
              <Trophy size={12} /> Limit Broken: +50% Scholar's Bonus Active
            </p>
          )}
        </div>
      </div>

      {/* Scribe Section */}
      <form onSubmit={handleSubmit} className="rpg-card p-6 rounded-[2rem] border-slate-800 bg-slate-900/40 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <input 
            type="text" 
            placeholder="Tome Title..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <input 
            type="text" 
            placeholder="The Author..."
            value={newAuthor}
            onChange={e => setNewAuthor(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 outline-none"
          />
        </div>
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 h-full py-3 transition-all active:scale-95">
          <Plus size={16} /> Scribe Tome
        </button>
      </form>

      {/* Reading List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.filter(b => !b.completed).map((book) => (
          <div 
            key={book.id} 
            className="relative h-96 rounded-2xl overflow-hidden border border-slate-800 group transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-slate-900"
          >
            <BookCover book={book} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/20 group-hover:via-slate-950/40 transition-all duration-500" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950/80 backdrop-blur-xl rounded-lg border border-white/10 text-cyan-400 shadow-xl">
                    <BookOpen size={18} />
                  </div>
                  <div className="drop-shadow-2xl">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-cyan-200 transition-colors">{book.title}</h4>
                    <p className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mt-1 opacity-90 drop-shadow-md">By {book.author}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteBook(book.id)}
                  className="p-1.5 text-white/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 bg-black/60 rounded-lg backdrop-blur-sm border border-white/5"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleComplete(book)}
                  disabled={isAnalyzing === book.id}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all backdrop-blur-md border ${
                    isAnalyzing === book.id 
                      ? 'bg-slate-800/80 text-slate-500 border-slate-700' 
                      : 'bg-cyan-600/50 text-white border-cyan-400 shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:bg-cyan-500 hover:border-white hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                  }`}
                >
                  {isAnalyzing === book.id ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                  Complete Lore Study
                </button>
              </div>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 py-32 text-center border-2 border-dashed border-slate-800 rounded-[3rem] opacity-30">
            <Library size={64} className="mx-auto mb-6 text-slate-600" />
            <p className="pixel-font text-[12px] tracking-widest text-slate-500 uppercase">Archive dormant. Scribe your first tome to begin lore progress.</p>
          </div>
        )}
        
        {/* Completed Section */}
        {masteredBooks.length > 0 && (
          <div className="md:col-span-2 lg:col-span-3 pt-8 border-t border-slate-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Archive of Mastery</h3>
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                <button 
                  onClick={() => setMasterySort('recent')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                    masterySort === 'recent' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Clock size={12} /> Recent
                </button>
                <button 
                  onClick={() => setMasterySort('difficulty')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                    masterySort === 'difficulty' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ArrowUpDown size={12} /> Difficulty
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {masteredBooks.map((book) => (
                <div key={book.id} className="relative h-36 rounded-xl overflow-hidden border border-slate-800 group opacity-80 hover:opacity-100 transition-all shadow-lg bg-slate-900">
                  <BookCover book={book} />
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] group-hover:bg-slate-950/60 transition-all" />
                  <div className="relative p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30 shrink-0">
                        <BookCheck size={16} />
                      </div>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${getDifficultyColor(book.difficulty)}`}>
                        {book.difficulty || 'Scholar'}
                      </span>
                    </div>
                    <div className="min-w-0 drop-shadow-lg mt-2">
                      <h5 className="text-xs font-black text-white truncate uppercase tracking-tight">{book.title}</h5>
                      <p className="text-[9px] font-bold text-slate-400 uppercase truncate tracking-tighter opacity-70">By {book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheGreatArchive;
