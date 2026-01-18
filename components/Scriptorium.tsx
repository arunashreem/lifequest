
import React, { useState } from 'react';
import { Resource, ContentIdea, TaskCategory } from '../types';
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
  Trophy
} from 'lucide-react';

interface ScriptoriumProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  ideas: ContentIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<ContentIdea[]>>;
  onManualXpAward: (xp: number, message: string, category?: TaskCategory) => void;
}

const Scriptorium: React.FC<ScriptoriumProps> = ({ resources, setResources, ideas, setIdeas, onManualXpAward }) => {
  // UI State
  const [activeSubTab, setActiveSubTab] = useState<'study' | 'vault' | 'forge' | 'guide'>('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Resource['category'] | 'all'>('all');
  
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
    onManualXpAward(25, "New lore transcribed into the Grimoire.", TaskCategory.READING);
  };

  const handleMasterLore = (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id && !r.completed) {
        onManualXpAward(150, `Mastered lore: ${r.title}. Wisdom attribute increases!`, TaskCategory.STUDY);
        return { ...r, completed: true };
      }
      return r;
    }));
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
      default: return <PenTool size={16} className="text-blue-400" />;
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    const matchesTab = (activeSubTab === 'study' && !r.completed) || (activeSubTab === 'vault' && r.completed);
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">The Scriptorium</h2>
          <div className="flex items-center gap-2 mt-1">
            <PenTool size={16} className="text-blue-400 animate-pulse" />
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Master Lore, Forge Chronicles</p>
          </div>
        </div>

        {/* Tab Container - Fixed Spacing for Mobile */}
        <div className="flex p-1 bg-slate-900 rounded-[2rem] border-2 border-slate-800 shadow-2xl w-full md:w-auto overflow-x-auto scrollbar-hide gap-1.5 no-scrollbar">
          {[
            { id: 'study', label: 'In-Progress', icon: <BookOpen size={14} /> },
            { id: 'vault', label: 'Mastered Lore', icon: <Layout size={14} /> },
            { id: 'forge', label: 'Creation Forge', icon: <Hammer size={14} /> },
            { id: 'guide', label: 'Lore Guide', icon: <ScrollText size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-none md:flex-1 px-6 py-4 rounded-[1.8rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] scale-100'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span className="inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Main Functionality */}
        <div className="lg:col-span-8 space-y-6">
          {activeSubTab === 'guide' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Purpose Card */}
              <div className="rpg-card p-10 rounded-[3rem] border-amber-500/20 bg-gradient-to-br from-slate-950 to-amber-950/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <ScrollText size={150} className="text-amber-500" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                    <Info size={28} className="text-amber-500" /> The Sage's Path
                  </h3>
                  <p className="text-lg text-slate-300 font-medium leading-relaxed">
                    Every great Hero knows that power is found in wisdom. The Scriptorium is your personal library where you transition from a <span className="text-blue-400 font-bold">Student</span> (consuming knowledge) to a <span className="text-purple-400 font-bold">Sage</span> (creating knowledge).
                  </p>
                </div>
              </div>

              {/* Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rpg-card p-6 rounded-3xl border-blue-500/20 bg-slate-900/40">
                  <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <PenTool size={16} /> 1. Transcribe Lore
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Add URLs of blogs, podcasts, or videos to your <span className="text-slate-200">In-Progress</span> list. Use arrows to prioritize your study order.
                  </p>
                </div>

                <div className="rpg-card p-6 rounded-3xl border-emerald-500/20 bg-slate-900/40">
                  <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={16} /> 2. Mastery Ritual
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Open the <span className="text-slate-200">Notes modal</span> to scribe findings. Click the green check to Master the Lore, gaining <span className="text-emerald-400 font-bold">+150 XP</span>.
                  </p>
                </div>

                <div className="rpg-card p-6 rounded-3xl border-purple-500/20 bg-slate-900/40">
                  <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Hammer size={16} /> 3. The Creation Forge
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Turn your Mastered Lore into content ideas (videos, blogs, tweets). Creating ideas generates <span className="text-purple-400 font-bold">+50 XP</span>.
                  </p>
                </div>

                <div className="rpg-card p-6 rounded-3xl border-yellow-500/20 bg-slate-900/40">
                  <h4 className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Trophy size={16} /> The Sacred Ratio
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Balance your wisdom. Aim to Master <span className="text-yellow-400 font-bold">3 Tomes</span> for every <span className="text-white font-bold">1 Chronicle</span> you forge.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl text-center">
                <p className="text-xs text-blue-300 italic font-bold">
                  "Stop doom-scrolling and start strategic-studying. Level up your mind!"
                </p>
              </div>
            </div>
          ) : activeSubTab !== 'forge' ? (
            <>
              {/* Scribe Form */}
              <div className="rpg-card p-6 rounded-[2rem] border-blue-500/20 bg-slate-900/40">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Sparkles size={14} /> Scribe New Lore
                </h3>
                <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Lore Title (e.g. Master React Hooks)" 
                    value={resTitle} onChange={e => setResTitle(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                  />
                  <input 
                    type="text" placeholder="Grimoire URL (https://...)" 
                    value={resUrl} onChange={e => setResUrl(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <select 
                      value={resCat} onChange={e => setResCat(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none appearance-none"
                    >
                      <option value="blog">Scroll (Blog)</option>
                      <option value="video">Mirror (Video)</option>
                      <option value="podcast">Echo (Podcast)</option>
                      <option value="other">Fragment (Other)</option>
                    </select>
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20 py-3 transition-all active:scale-95">
                      Transcribe to List
                    </button>
                  </div>
                </form>
              </div>

              {/* Resource List Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" placeholder="Search Lore Archive..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setFilterCategory('all')} className={`p-3 rounded-xl border ${filterCategory === 'all' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <Filter size={16} />
                  </button>
                  {['blog', 'video', 'podcast'].map(cat => (
                    <button 
                      key={cat} onClick={() => setFilterCategory(cat as any)} 
                      className={`p-3 rounded-xl border ${filterCategory === cat ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                    >
                      {getCategoryIcon(cat as any)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lore List */}
              <div className="space-y-4">
                {filteredResources.map((res, i) => (
                  <div 
                    key={res.id} 
                    className={`rpg-card rounded-2xl p-5 border-l-4 transition-all group ${
                      res.completed ? 'border-l-yellow-500 bg-yellow-500/5' : 'border-l-blue-500 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 min-w-0">
                        <div className="pt-1 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleMoveLore(res.id, 'up')} className="p-1 hover:text-blue-400"><ChevronUp size={14} /></button>
                          <button onClick={() => handleMoveLore(res.id, 'down')} className="p-1 hover:text-blue-400"><ChevronDown size={14} /></button>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(res.category)}
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{res.category}</span>
                          </div>
                          <h4 className={`text-base font-black uppercase tracking-tight truncate leading-tight mb-1 ${res.completed ? 'text-yellow-400' : 'text-white'}`}>
                            {res.title}
                          </h4>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 flex items-center gap-1 hover:underline truncate opacity-70 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={10} /> {res.url}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => { setEditingNotesId(res.id); setTempNotes(res.notes); }}
                          className={`p-3 rounded-xl border transition-all ${res.notes ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-white'}`}
                        >
                          <StickyNote size={18} />
                        </button>
                        {!res.completed ? (
                          <button 
                            onClick={() => handleMasterLore(res.id)}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 hover:bg-emerald-600 hover:border-emerald-400 hover:text-white transition-all"
                          >
                            <CheckCircle size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setActiveSubTab('forge'); setLinkedLoreId(res.id); setIdeaTitle(`Concept from: ${res.title}`); }}
                            className="p-3 rounded-xl bg-yellow-500 text-slate-950 border border-yellow-400 hover:bg-yellow-400 transition-all shadow-lg"
                          >
                            <Hammer size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteLore(res.id)}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 hover:bg-red-600 hover:border-red-400 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredResources.length === 0 && (
                  <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl opacity-30">
                    <BookOpen size={48} className="mx-auto mb-4" />
                    <p className="pixel-font text-[10px] tracking-widest uppercase">No lore found in this archive sector.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Creation Forge Form */}
              <div className="rpg-card p-8 rounded-[2.5rem] border-purple-500/20 bg-slate-900/40 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Hammer size={120} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <Hammer size={24} className="text-purple-400" /> Forge Content Idea
                </h3>
                <form onSubmit={handleAddIdea} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <input 
                        type="text" placeholder="Idea Title (e.g. My Take on React 19)" 
                        value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none"
                      />
                      <select 
                        value={ideaPlatform} onChange={e => setIdeaPlatform(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none appearance-none"
                      >
                        <option value="blog">Manuscript (Blog)</option>
                        <option value="video">Cine-Quest (Video)</option>
                        <option value="social">Tavern Post (Social)</option>
                        <option value="other">Misc Craft</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="Brief Outline / Hook..."
                      value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none h-full min-h-[100px] resize-none"
                    />
                  </div>
                  {linkedLoreId && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex justify-between items-center">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Linked to Lore Source</p>
                      <button type="button" onClick={() => setLinkedLoreId(undefined)} className="text-red-400 text-[10px] font-bold">Unlink</button>
                    </div>
                  )}
                  <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-900/30 transition-all active:scale-95">
                    Forge Chronicle Idea
                  </button>
                </form>
              </div>

              {/* Ideas List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map(idea => (
                  <div key={idea.id} className="rpg-card rounded-2xl p-6 border-purple-500/10 bg-gradient-to-br from-slate-900 to-purple-950/10 hover:border-purple-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-400 uppercase tracking-widest">
                        {idea.platform}
                      </span>
                      <button onClick={() => setIdeas(ideas.filter(i => i.id !== idea.id))} className="text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2 leading-tight">{idea.title}</h4>
                    <p className="text-slate-400 text-xs line-clamp-3 mb-4">{idea.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{new Date(idea.dateCreated).toLocaleDateString()}</span>
                      {idea.sourceResourceId && (
                        <span className="flex items-center gap-1 text-[8px] font-black text-blue-400 uppercase">
                          <BookOpen size={10} /> Source Linked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Section: Stats & Wisdom */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rpg-card p-8 rounded-[3rem] border-white/5 bg-slate-900/60 shadow-2xl relative overflow-hidden">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <Share2 size={14} /> Scriptorium Metadata
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shrink-0">
                  <BookOpen size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{resources.filter(r => !r.completed).length}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Tomes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20 shrink-0">
                  <CheckCircle size={20} className="text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{resources.filter(r => r.completed).length}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Mastered Wisdom</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20 shrink-0">
                  <Hammer size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{ideas.length}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Chronicle Ideas</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl space-y-3">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles size={14} /> Keeper's Advice
              </p>
              <p className="text-xs text-slate-400 leading-relaxed font-bold italic">
                "Master lore to feed the forge. For every three tomes studied, forge one great chronicle to share your wisdom with the realm."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {editingNotesId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setEditingNotesId(null)} />
          <div className="relative w-full max-w-2xl rpg-card p-10 rounded-[3rem] border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.2)] animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Lore Annotations</h3>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Etching Wisdom into the Margins</p>
            
            <textarea 
              value={tempNotes}
              onChange={e => setTempNotes(e.target.value)}
              placeholder="Record your insights, time-stamps, and breakthrough moments here..."
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-white text-base focus:border-amber-500 outline-none h-[400px] resize-none mb-8 shadow-inner"
              autoFocus
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setEditingNotesId(null)}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Close Without Saving
              </button>
              <button 
                onClick={handleSaveNotes}
                className="flex-[2] py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-900/40 flex items-center justify-center gap-3 transition-all"
              >
                <ArrowRight size={18} /> Seal Annotations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scriptorium;
