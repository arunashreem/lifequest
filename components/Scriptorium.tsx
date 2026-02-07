
import React, { useState, useMemo } from 'react';
import { Resource, ContentIdea, TaskCategory, Difficulty } from '../types';
import { 
  PenTool, 
  ExternalLink, 
  BookOpen, 
  Video, 
  Mic, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle, 
  ChevronUp, 
  ChevronDown, 
  StickyNote, 
  Sparkles, 
  Hammer,
  Layout,
  Share2,
  Filter,
  ArrowRight,
  ScrollText,
  Info,
  Zap,
  Flame,
  Trophy,
  History,
  Target,
  Maximize2,
  Activity,
  Clock,
  ArrowUpDown,
  Loader2,
  Wand2
} from 'lucide-react';
import { evaluateLoreCompletion } from '../services/gemini';

interface ScriptoriumProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  ideas: ContentIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<ContentIdea[]>>;
  onManualXpAward: (xp: number, message: string, category?: TaskCategory) => void;
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
    case Difficulty.HARD: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case Difficulty.EPIC: return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-slate-800/40 text-slate-400 border-white/5';
  }
};

const Scriptorium: React.FC<ScriptoriumProps> = ({ resources, setResources, ideas, setIdeas, onManualXpAward }) => {
  // UI State
  const [activeSubTab, setActiveSubTab] = useState<'study' | 'vault' | 'forge' | 'guide'>('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Resource['category'] | 'all'>('all');
  const [filterAnnotated, setFilterAnnotated] = useState<boolean | null>(null); // null = all, true = annotated only
  const [masterySort, setMasterySort] = useState<'recent' | 'difficulty'>('recent');
  const [isAnalyzingLore, setIsAnalyzingLore] = useState<string | null>(null);
  
  // Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resCat, setResCat] = useState<Resource['category']>('blog');

  // Idea Form State
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [ideaPlatform, setIdeaPlatform] = useState<ContentIdea['platform']>('blog');
  const [linkedLoreId, setLinkedLoreId] = useState<string | undefined>();

  // Notes Modal State
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Actions
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim()) return;
    const newRes: Resource = {
      id: Math.random().toString(36).substr(2, 9),
      title: resTitle,
      url: resUrl,
      description: resDesc,
      category: resCat,
      notes: '',
      completed: false,
      order: resources.length,
      dateAdded: new Date().toISOString()
    };
    setResources([...resources, newRes]);
    setResTitle('');
    setResUrl('');
    setResDesc('');
    // Removed popup for setting task/resource
    onManualXpAward(0, "Lore transcribed.", TaskCategory.READING);
  };

  const handleMasterLore = async (lore: Resource) => {
    if (lore.completed) return;
    setIsAnalyzingLore(lore.id);
    
    try {
      const result = await evaluateLoreCompletion(lore.title, lore.url);
      setResources(prev => prev.map(r => {
        if (r.id === lore.id) {
          return { 
            ...r, 
            completed: true, 
            difficulty: result.difficulty as Difficulty, 
            dateCompleted: new Date().toISOString() 
          };
        }
        return r;
      }));
      onManualXpAward(result.xp, result.feedback, TaskCategory.STUDY);
    } catch (err) {
      // Fallback
      setResources(prev => prev.map(r => r.id === lore.id ? { ...r, completed: true, dateCompleted: new Date().toISOString() } : r));
      onManualXpAward(100, "Lore mastery recorded.", TaskCategory.STUDY);
    } finally {
      setIsAnalyzingLore(null);
    }
  };

  const handleDeleteLore = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const handleMoveLore = (id: string, direction: 'up' | 'down') => {
    const idx = resources.findIndex(r => r.id === id);
    if (idx === -1) return;
    const newResources = [...resources];
    if (direction === 'up' && idx > 0) {
      [newResources[idx], newResources[idx - 1]] = [newResources[idx - 1], newResources[idx]];
    } else if (direction === 'down' && idx < resources.length - 1) {
      [newResources[idx], newResources[idx + 1]] = [newResources[idx + 1], newResources[idx]];
    }
    setResources(newResources);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;
    const newIdea: ContentIdea = {
      id: Math.random().toString(36).substr(2, 9),
      title: ideaTitle,
      description: ideaDesc,
      platform: ideaPlatform,
      sourceResourceId: linkedLoreId,
      dateCreated: new Date().toISOString()
    };
    setIdeas([newIdea, ...ideas]);
    setIdeaTitle('');
    setIdeaDesc('');
    setLinkedLoreId(undefined);
    onManualXpAward(50, "Content idea forged in the fire of creation!", TaskCategory.WORK);
  };

  const handleSaveNotes = () => {
    if (!editingNotesId) return;
    setResources(prev => prev.map(r => r.id === editingNotesId ? { ...r, notes: tempNotes } : r));
    setEditingNotesId(null);
  };

  const getCategoryIcon = (cat: Resource['category']) => {
    switch (cat) {
      case 'video': return <Video size={16} className="text-red-400" />;
      case 'blog': return <BookOpen size={16} className="text-emerald-400" />;
      case 'podcast': return <Mic size={16} className="text-purple-400" />;
      default: return <PenTool size={16} className="text-orange-400" />;
    }
  };

  const filteredResources = useMemo(() => {
    let list = resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
      const matchesAnnotated = filterAnnotated === null || (filterAnnotated ? r.notes.trim().length > 0 : r.notes.trim().length === 0);
      const matchesTab = (activeSubTab === 'study' && !r.completed) || (activeSubTab === 'vault' && r.completed);
      return matchesSearch && matchesCategory && matchesTab && matchesAnnotated;
    });

    if (activeSubTab === 'vault') {
      if (masterySort === 'difficulty') {
        return [...list].sort((a, b) => {
          const weightA = DIFFICULTY_WEIGHT[a.difficulty || Difficulty.EASY];
          const weightB = DIFFICULTY_WEIGHT[b.difficulty || Difficulty.EASY];
          return weightB - weightA;
        });
      } else {
        return [...list].sort((a, b) => {
          const dateA = new Date(a.dateCompleted || 0).getTime();
          const dateB = new Date(b.dateCompleted || 0).getTime();
          return dateB - dateA;
        });
      }
    }

    return list;
  }, [resources, searchQuery, filterCategory, filterAnnotated, activeSubTab, masterySort]);

  const masteredLoreList = resources.filter(r => r.completed);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-orange">The Scriptorium</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-orange-500 animate-pulse" /> 
            Mastering Universal Lore, Forging Digital Chronicles
          </p>
        </div>

        {/* Tab Container */}
        <div className="flex p-2 bg-slate-950 rounded-[2rem] border-2 border-white/5 shadow-2xl w-full md:w-auto overflow-x-auto no-scrollbar gap-1.5">
          {[
            { id: 'study', label: 'In-Progress', icon: <BookOpen size={14} /> },
            { id: 'vault', label: 'Mastered Vault', icon: <Layout size={14} /> },
            { id: 'forge', label: 'Creation Forge', icon: <Hammer size={14} /> },
            { id: 'guide', label: 'Lore Guide', icon: <ScrollText size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-none md:flex-1 px-6 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-orange-600 text-white shadow-xl scale-100'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span className="inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Section: Main Functionality */}
        <div className="lg:col-span-8 space-y-10">
          {activeSubTab === 'guide' ? (
            <div className="space-y-10 animate-in fade-in duration-700">
              {/* Purpose Card */}
              <div className="rpg-card p-12 md:p-16 rounded-[4rem] border-orange-500/20 bg-gradient-to-br from-slate-950 to-orange-950/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <ScrollText size={220} className="text-orange-500" />
                </div>
                <div className="relative z-10 space-y-8">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                    <Info size={32} className="text-orange-500" /> The Sage's Path
                  </h3>
                  <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                    Every great Hero knows that power is found in wisdom. The Scriptorium is your personal library where you transition from a <span className="text-orange-400 font-bold">Student</span> (consuming knowledge) to a <span className="text-purple-400 font-bold">Sage</span> (creating knowledge).
                  </p>
                </div>
              </div>

              {/* Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rpg-card p-8 rounded-[2.5rem] border-orange-500/20 bg-slate-900/40">
                  <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <PenTool size={18} /> 1. Transcribe Lore
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Add URLs of blogs, podcasts, or videos to your <span className="text-slate-200">In-Progress</span> list. Use arrows to prioritize your study order.
                  </p>
                </div>

                <div className="rpg-card p-8 rounded-[2.5rem] border-emerald-500/20 bg-slate-900/40">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={18} /> 2. Mastery Ritual
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Open the <span className="text-slate-200">Notes modal</span> to scribe findings. Click the green check to Master the Lore, gaining <span className="text-emerald-400 font-bold">+150 XP</span>.
                  </p>
                </div>

                <div className="rpg-card p-8 rounded-[2.5rem] border-purple-500/20 bg-slate-900/40">
                  <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Hammer size={18} /> 3. The Creation Forge
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Turn your Mastered Lore into content ideas (videos, blogs, tweets). Creating ideas generates <span className="text-purple-400 font-bold">+50 XP</span>.
                  </p>
                </div>

                <div className="rpg-card p-8 rounded-[2.5rem] border-yellow-500/20 bg-slate-900/40">
                  <h4 className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Trophy size={18} /> The Sacred Ratio
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Balance your wisdom. Aim to Master <span className="text-yellow-400 font-bold">3 Tomes</span> for every <span className="text-white font-bold">1 Chronicle</span> you forge.
                  </p>
                </div>
              </div>
            </div>
          ) : activeSubTab !== 'forge' ? (
            <>
              {/* Scribe Form */}
              <div className="rpg-card p-10 md:p-12 rounded-[3.5rem] border-orange-500/20 bg-slate-950/80 shadow-3xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
                <h3 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
                  <Plus size={20} className="animate-spin-slow" /> New Lore Transcription
                </h3>
                <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <input 
                    type="text" placeholder="Lore Title (e.g. Master React Hooks)" 
                    value={resTitle} onChange={e => setResTitle(e.target.value)}
                    className="bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-800"
                  />
                  <input 
                    type="text" placeholder="Grimoire URL (https://...)" 
                    value={resUrl} onChange={e => setResUrl(e.target.value)}
                    className="bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-800"
                  />
                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-6">
                    <select 
                      value={resCat} onChange={e => setResCat(e.target.value as any)}
                      className="bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-orange-500 outline-none appearance-none flex-1"
                    >
                      <option value="blog">Scroll (Blog)</option>
                      <option value="video">Mirror (Video)</option>
                      <option value="podcast">Echo (Podcast)</option>
                      <option value="other">Fragment (Other)</option>
                    </select>
                    <button type="submit" className="flex-[2] bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl py-6 transition-all active:scale-95">
                      Transcribe to Grimoire
                    </button>
                  </div>
                </form>
              </div>

              {/* Resource List Controls */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="text" placeholder="Search Lore Archive..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-white focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 px-1">
                  {activeSubTab === 'vault' && (
                    <div className="flex bg-slate-950 rounded-[1.5rem] p-1 border-2 border-white/5 shadow-2xl shrink-0">
                      <button 
                        onClick={() => setMasterySort('recent')} 
                        className={`flex items-center gap-3 px-6 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${masterySort === 'recent' ? 'bg-orange-600/20 text-orange-400 shadow-xl border border-orange-500/30' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        <Clock size={14} /> Recent
                      </button>
                      <button 
                        onClick={() => setMasterySort('difficulty')} 
                        className={`flex items-center gap-3 px-6 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${masterySort === 'difficulty' ? 'bg-orange-600/20 text-orange-400 shadow-xl border border-orange-500/30' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        <ArrowUpDown size={14} /> Difficulty
                      </button>
                    </div>
                  )}
                  <button onClick={() => setFilterAnnotated(prev => prev === true ? null : true)} className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] border-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterAnnotated === true ? 'bg-amber-600 border-amber-400 text-white shadow-xl' : 'bg-slate-950 border-white/5 text-slate-500'}`}>
                    <StickyNote size={16} /> Annotated Only
                  </button>
                  <button onClick={() => setFilterCategory('all')} className={`p-5 rounded-[1.5rem] border-2 transition-all ${filterCategory === 'all' ? 'bg-orange-600 border-orange-400 text-white shadow-xl' : 'bg-slate-950 border-white/5 text-slate-500'}`}>
                    <Filter size={20} />
                  </button>
                  {['blog', 'video', 'podcast'].map(cat => (
                    <button 
                      key={cat} onClick={() => setFilterCategory(cat as any)} 
                      className={`p-5 rounded-[1.5rem] border-2 transition-all ${filterCategory === cat ? 'bg-orange-600 border-orange-400 text-white shadow-xl' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'}`}
                    >
                      {getCategoryIcon(cat as any)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lore List */}
              <div className="space-y-6">
                {filteredResources.map((res, i) => (
                  <div 
                    key={res.id} 
                    className={`rpg-card rounded-[3rem] p-8 border-l-[12px] transition-all group hover:scale-[1.01] ${
                      res.completed ? 'border-l-yellow-500 bg-yellow-500/5' : 'border-l-orange-500 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex gap-8 min-w-0">
                        <div className="pt-2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleMoveLore(res.id, 'up')} className="p-2 hover:text-orange-400 transition-colors"><ChevronUp size={18} /></button>
                          <button onClick={() => handleMoveLore(res.id, 'down')} className="p-2 hover:text-orange-400 transition-colors"><ChevronDown size={18} /></button>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-2 bg-black rounded-lg border border-white/10">
                              {getCategoryIcon(res.category)}
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{res.category}</span>
                            {res.completed && res.difficulty && (
                              <span className={`text-[8px] font-black px-3 py-1 rounded-full border uppercase tracking-[0.2em] shadow-lg ${getDifficultyColor(res.difficulty)}`}>
                                {res.difficulty}
                              </span>
                            )}
                          </div>
                          <h4 className={`text-2xl font-black uppercase tracking-tight leading-tight mb-4 ${res.completed ? 'text-yellow-400' : 'text-white'}`}>
                            {res.title}
                          </h4>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-400 flex items-center gap-2 hover:underline truncate opacity-70 group-hover:opacity-100 transition-opacity italic">
                            <ExternalLink size={14} /> {res.url}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-3 shrink-0">
                        <button 
                          onClick={() => { setEditingNotesId(res.id); setTempNotes(res.notes); }}
                          className={`p-5 rounded-[1.5rem] border-2 transition-all relative ${res.notes ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-xl' : 'bg-black border-white/5 text-slate-700 hover:text-white'}`}
                        >
                          <StickyNote size={24} />
                          {res.notes && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-pulse border-2 border-black" />}
                        </button>
                        {!res.completed ? (
                          <button 
                            onClick={() => handleMasterLore(res)}
                            disabled={isAnalyzingLore === res.id}
                            className={`p-5 rounded-[1.5rem] bg-black border-2 border-white/5 transition-all shadow-xl active:scale-90 flex items-center justify-center ${isAnalyzingLore === res.id ? 'opacity-50 cursor-wait' : 'text-slate-700 hover:bg-emerald-600 hover:border-emerald-400 hover:text-white'}`}
                          >
                            {isAnalyzingLore === res.id ? <Loader2 size={24} className="animate-spin text-emerald-400" /> : <CheckCircle size={24} />}
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setActiveSubTab('forge'); setLinkedLoreId(res.id); setIdeaTitle(`Concept from: ${res.title}`); }}
                            className="p-5 rounded-[1.5rem] bg-yellow-500 text-slate-950 border-2 border-yellow-400 hover:bg-yellow-400 transition-all shadow-2xl active:scale-90"
                          >
                            <Hammer size={24} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteLore(res.id)}
                          className="p-5 rounded-[1.5rem] bg-black border-2 border-white/5 text-slate-700 hover:bg-red-600 hover:border-red-400 hover:text-white transition-all active:scale-90"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredResources.length === 0 && (
                  <div className="py-32 text-center border-4 border-dashed border-white/5 rounded-[4rem] opacity-30">
                    <BookOpen size={64} className="mx-auto mb-6 text-slate-500" />
                    <p className="pixel-font text-[10px] tracking-[0.4em] uppercase text-slate-600">No lore found in this archive sector.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-10 animate-in fade-in duration-700">
              {/* Creation Forge Header Info */}
              <div className="flex items-center gap-6 bg-purple-500/5 border-2 border-purple-500/10 p-10 rounded-[3.5rem] shadow-3xl">
                <div className="p-5 bg-purple-500/20 rounded-[1.5rem] text-purple-400 shadow-2xl">
                  <Target size={36} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic glow-text-red">Tactical Output Mode</h3>
                  <p className="text-[11px] font-black text-purple-500 uppercase tracking-[0.5em] mt-2">Converting Passive Wisdom into Digital Power</p>
                </div>
              </div>

              {/* Forge Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Input Form */}
                <div className="rpg-card p-10 md:p-12 rounded-[4rem] border-purple-500/30 bg-slate-900/60 shadow-3xl relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Hammer size={180} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <Hammer size={28} className="text-purple-400" /> Forge Content Idea
                  </h3>
                  <form onSubmit={handleAddIdea} className="space-y-8 relative z-10 flex-1 flex flex-col">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Chronicler's Hook</label>
                        <input 
                          type="text" placeholder="Idea Title (e.g. My Take on React 19)" 
                          value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)}
                          className="w-full bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-purple-500 outline-none transition-all"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Transmission Medium</label>
                        <select 
                          value={ideaPlatform} onChange={e => setIdeaPlatform(e.target.value as any)}
                          className="w-full bg-black border-2 border-white/10 rounded-[2rem] px-8 py-5 text-lg text-white focus:border-purple-500 outline-none appearance-none"
                        >
                          <option value="blog">Manuscript (Blog)</option>
                          <option value="video">Cine-Quest (Video)</option>
                          <option value="social">Tavern Post (Social)</option>
                          <option value="other">Misc Craft</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">The Strategy (Outline)</label>
                      <textarea 
                        placeholder="Brief Outline / Hook / Key Points..."
                        value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)}
                        className="w-full bg-black border-2 border-white/10 rounded-[2rem] px-8 py-6 text-lg text-white focus:border-purple-500 outline-none h-64 resize-none leading-relaxed transition-all"
                      />
                    </div>

                    {linkedLoreId && (
                      <div className="p-6 bg-blue-500/10 border-2 border-blue-500/20 rounded-[2rem] flex justify-between items-center animate-in zoom-in duration-300">
                        <div className="flex items-center gap-4">
                          <BookOpen size={20} className="text-blue-400" />
                          <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Source Lore Synced</p>
                        </div>
                        <button type="button" onClick={() => setLinkedLoreId(undefined)} className="text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest border-2 border-red-500/30 px-4 py-2 rounded-xl transition-all">Unlink</button>
                      </div>
                    )}

                    <button type="submit" className="w-full py-7 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-3xl transition-all active:scale-95 group">
                      Forge Chronicle Idea
                      <ArrowRight size={20} className="inline ml-3 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </form>
                </div>

                {/* Right: Lore Picker Sidebar */}
                <div className="space-y-8">
                  <div className="rpg-card p-8 md:p-10 rounded-[3rem] border-blue-500/10 bg-slate-950/40">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                      <History size={20} /> Mastered Lore Picker
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2 px-1">
                      {masteredLoreList.length > 0 ? masteredLoreList.map(lore => (
                        <div key={lore.id} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group/item ${linkedLoreId === lore.id ? 'bg-blue-600 border-blue-400 shadow-2xl' : 'bg-slate-900 border-white/5 hover:border-blue-500/50'}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <h5 className={`text-base font-black uppercase tracking-tight leading-tight mb-2 ${linkedLoreId === lore.id ? 'text-white' : 'text-slate-300 group-hover/item:text-white'}`}>{lore.title}</h5>
                              <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${linkedLoreId === lore.id ? 'text-blue-200' : 'text-slate-600'}`}>{lore.category}</p>
                            </div>
                            <button 
                              onClick={() => {
                                setLinkedLoreId(lore.id);
                                if (!ideaTitle) setIdeaTitle(`Idea from: ${lore.title}`);
                              }}
                              className={`p-3 rounded-xl transition-all ${linkedLoreId === lore.id ? 'bg-white text-blue-600 shadow-xl' : 'bg-black border border-white/10 text-blue-400 opacity-0 group-hover/item:opacity-100 hover:bg-blue-600 hover:text-white'}`}
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="py-20 text-center opacity-20">
                          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">No Mastered Lore found to link.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Ideas Summary List (Scrollable) */}
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-event-0.5em px-4 flex items-center gap-3">
                      <Layout size={18} /> Chronos Idea Stream ({ideas.length})
                    </h3>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2 px-1">
                      {ideas.map(idea => (
                        <div key={idea.id} className="rpg-card rounded-[2.5rem] p-7 border-2 border-purple-500/10 bg-slate-900/60 group hover:border-purple-500/40 transition-all shadow-xl">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[9px] font-black text-purple-400 uppercase tracking-widest">
                              {idea.platform}
                            </span>
                            <button onClick={() => setIdeas(ideas.filter(i => i.id !== idea.id))} className="p-2 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-black/40 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight mb-4">{idea.title}</h4>
                          <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{new Date(idea.dateCreated).toLocaleDateString()}</span>
                            {idea.sourceResourceId && (
                              <span className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                <BookOpen size={10} /> SOURCE SYNCED
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Metadata & Wisdom */}
        <div className="lg:col-span-4 space-y-10">
          <div className="rpg-card p-10 md:p-12 rounded-[4rem] border-white/5 bg-slate-950 shadow-3xl relative overflow-hidden">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
              <Share2 size={18} /> Scriptorium Telemetry
            </h3>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 bg-black/40 p-6 rounded-[2rem] border border-white/5 group hover:border-orange-500/40 transition-all cursor-default shadow-xl">
                <div className="w-16 h-16 bg-orange-500/10 rounded-[1.2rem] flex items-center justify-center border border-orange-500/20 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xl shadow-orange-950/40">
                  <BookOpen size={28} className="text-orange-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black text-white leading-none tracking-tighter tabular-nums">{resources.filter(r => !r.completed).length}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Active Tomes</p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-black/40 p-6 rounded-[2rem] border border-white/5 group hover:border-emerald-500/40 transition-all cursor-default shadow-xl">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.2rem] flex items-center justify-center border border-emerald-500/20 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xl shadow-emerald-950/40">
                  <CheckCircle size={28} className="text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black text-white leading-none tracking-tighter tabular-nums">{resources.filter(r => r.completed).length}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Mastered Lore</p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-black/40 p-6 rounded-[2rem] border border-white/5 group hover:border-purple-500/40 transition-all cursor-default shadow-xl">
                <div className="w-16 h-16 bg-purple-500/10 rounded-[1.2rem] flex items-center justify-center border border-purple-500/20 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xl shadow-purple-950/40">
                  <Hammer size={28} className="text-purple-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black text-white leading-none tracking-tighter tabular-nums">{ideas.length}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Forged Ideas</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-orange-600/10 border-2 border-orange-500/20 rounded-[3rem] space-y-4 shadow-inner">
              <p className="text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <Sparkles size={18} /> Keeper's Doctrine
              </p>
              <p className="text-sm text-slate-400 leading-relaxed font-bold italic">
                "Cease passive consumption and embrace active creation. For every three tomes mastered, forge one great chronicle to echo your wisdom across the realm."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal - Enhanced with Orange Focus Mode */}
      {editingNotesId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setEditingNotesId(null)} />
          <div className="relative w-full max-w-5xl rpg-card p-12 md:p-20 rounded-[4.5rem] border-orange-500/40 shadow-[0_0_150px_rgba(255,107,0,0.25)] animate-in zoom-in-95 duration-500 overflow-hidden ring-8 ring-slate-950">
            {/* Background Zen Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,107,0,0.08)_0%,_transparent_70%)] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="space-y-3">
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none glow-text-orange">Lore Annotation</h3>
                <p className="text-orange-500 text-[12px] font-black uppercase tracking-[0.6em] flex items-center gap-3">
                  <Maximize2 size={16} className="animate-pulse" /> Focus Ritual Active
                </p>
              </div>
              <button onClick={() => setEditingNotesId(null)} className="p-5 rounded-2xl border-2 border-white/5 hover:bg-red-600/10 hover:border-red-500/30 transition-all text-slate-500 hover:text-red-500 shadow-xl"><Trash2 size={28} /></button>
            </div>
            
            <div className="relative z-10 group">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-2 h-48 bg-orange-500 rounded-full opacity-30 group-focus-within:opacity-100 group-focus-within:h-64 transition-all duration-700" />
              <textarea 
                value={tempNotes}
                onChange={e => setTempNotes(e.target.value)}
                placeholder="Transcribe the core wisdom here. What did you learn that can be forged into chronicles?..."
                className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[3rem] p-10 text-white text-2xl md:text-3xl font-medium focus:border-orange-500 outline-none h-[500px] resize-none mb-12 shadow-inner transition-all leading-relaxed placeholder:italic placeholder:opacity-10"
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-8 relative z-10">
              <button 
                onClick={() => setEditingNotesId(null)}
                className="flex-1 py-7 bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-slate-300 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all border-2 border-white/5 shadow-xl"
              >
                Abort Ritual
              </button>
              <button 
                onClick={handleSaveNotes}
                className="flex-[2] py-7 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-orange-900/40 flex items-center justify-center gap-6 transition-all group active:scale-95"
              >
                <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" /> Seal Divine Annotations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scriptorium;
