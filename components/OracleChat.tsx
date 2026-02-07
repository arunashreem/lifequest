
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquareCode, Activity, Trash2, Paperclip, FileText, X, Image as ImageIcon, Terminal, Mic, MicOff, Video, MapPin, Search as SearchIcon, ExternalLink, Wand2, Smartphone, ScrollText, History, Plus, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { chatWithOracle, transcribeAudio, getMapsInfo, generateChatTitle } from '../services/gemini';
import { UserStats, Task, Habit } from '../types';

interface Message {
  role: 'user' | 'model';
  parts: { 
    text?: string; 
    inlineData?: { mimeType: string, data: string };
  }[];
  performedActions?: string[];
  grounding?: any[];
}

interface ChatJournal {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

interface OracleChatProps {
  stats: UserStats;
  tasks: Task[];
  habits: Habit[];
  onExecuteAction: (actionName: string, args: any) => void;
}

const ACTION_LABELS: Record<string, string> = {
  'add_boss_raid': 'Boss Raid Initialized',
  'add_quest': 'Quest Forged',
  'update_quest': 'Quest State Updated',
  'delete_quest': 'Quest Purged',
  'update_hydration': 'Hydration Matrix Synced',
  'add_habit': 'Ritual Encoded'
};

const OracleChat: React.FC<OracleChatProps> = ({ stats, tasks, habits, onExecuteAction }) => {
  // Persistence state
  const [sessions, setSessions] = useState<ChatJournal[]>(() => {
    const saved = localStorage.getItem('lifequest_oracle_journals');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const savedId = localStorage.getItem('lifequest_oracle_active_id');
    return savedId || null;
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string, type: string, data: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const activeSession = useMemo(() => 
    sessions.find(s => s.id === activeSessionId) || null, 
  [sessions, activeSessionId]);

  useEffect(() => {
    localStorage.setItem('lifequest_oracle_journals', JSON.stringify(sessions));
    if (activeSessionId) localStorage.setItem('lifequest_oracle_active_id', activeSessionId);
  }, [sessions, activeSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isTyping]);

  const startNewJournal = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newJournal: ChatJournal = {
      id: newId,
      title: "New Dialogue",
      timestamp: new Date().toISOString(),
      messages: []
    };
    setSessions([newJournal, ...sessions]);
    setActiveSessionId(newId);
    setShowArchive(false);
  };

  const deleteJournal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setAttachment({ name: file.name, type: file.type, data: base64Data });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTyping(true);
          try {
            const transcript = await transcribeAudio(base64Audio, 'audio/webm');
            setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
          } catch (err) {
            console.error("Transcription failed", err);
          } finally {
            setIsTyping(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isTyping) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      const newId = Math.random().toString(36).substr(2, 9);
      const newJournal: ChatJournal = {
        id: newId,
        title: "Dialogue Initialization...",
        timestamp: new Date().toISOString(),
        messages: []
      };
      setSessions([newJournal, ...sessions]);
      setActiveSessionId(newId);
      currentSessionId = newId;
    }

    const userInput = input.trim();
    const parts: any[] = [];
    if (userInput) parts.push({ text: userInput });
    if (attachment) {
      parts.push({ inlineData: { mimeType: attachment.type, data: attachment.data } });
    }

    const userMessage: Message = { role: 'user', parts };
    setInput('');
    setAttachment(null);
    setIsTyping(true);

    const targetSession = sessions.find(s => s.id === currentSessionId)!;
    const historyForAI = [...targetSession.messages, userMessage];

    // Optimistically update
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage] } : s
    ));

    try {
      let response;
      const lowerInput = userInput.toLowerCase();

      if (lowerInput.includes('map') || lowerInput.includes('where is') || lowerInput.includes('nearby')) {
        const mapsRes = await getMapsInfo(userInput);
        response = { text: mapsRes.text, grounding: mapsRes.grounding, functionCalls: [] };
      } else {
        response = await chatWithOracle(historyForAI, stats, tasks, habits);
      }
      
      const actionsTaken: string[] = [];
      if (response.functionCalls && response.functionCalls.length > 0) {
        response.functionCalls.forEach((fc: any) => {
          onExecuteAction(fc.name, fc.args);
          if (ACTION_LABELS[fc.name]) {
            actionsTaken.push(ACTION_LABELS[fc.name]);
          }
        });
      }

      const botMessage: Message = { 
        role: 'model', 
        parts: [{ text: response.text }],
        performedActions: actionsTaken.length > 0 ? actionsTaken : undefined,
        grounding: response.grounding
      };

      // Automatic Titling for first message
      let titleUpdate = {};
      if (targetSession.messages.length === 0 && userInput.length > 5) {
         try {
           const newTitle = await generateChatTitle(userInput);
           titleUpdate = { title: newTitle };
         } catch (e) { console.error("Titling failed", e); }
      }

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, ...titleUpdate, messages: [...s.messages, userMessage, botMessage] } : s
      ).filter((v,i,a)=>a.findIndex(t=>(t.id===v.id))===i)); // Filter to prevent duplicates
    } catch (err) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages: [...s.messages, { role: 'model', parts: [{ text: "The Neural Link is unstable. Scribing failed." }] }] } : s
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] space-y-6 animate-in fade-in duration-1000 overflow-hidden">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 shrink-0">
        <div className="flex items-center gap-6">
           <button 
            onClick={() => setShowArchive(!showArchive)}
            className={`p-4 rounded-2xl transition-all shadow-xl active:scale-95 border-2 ${showArchive ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'}`}
           >
             <Menu size={24} />
           </button>
           <div>
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic glow-text-fuchsia">Oracle's Hub</h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-3 flex items-center gap-4">
               <Activity className="text-fuchsia-600 animate-pulse" /> 
               {activeSession ? activeSession.title : 'Neural Dialogue Matrix'}
             </p>
           </div>
        </div>
        
        <button 
          onClick={startNewJournal} 
          className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-fuchsia-600 border-2 border-fuchsia-400 text-white transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 shadow-3xl shrink-0"
        >
          <Plus size={16} /> New Journal
        </button>
      </div>

      <div className="flex-1 flex gap-6 relative min-h-0 px-2 pb-6">
        {/* Dialogue Logs Sidebar */}
        <div className={`absolute lg:relative inset-y-0 left-0 z-50 w-80 bg-slate-950/98 lg:bg-slate-950/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex flex-col transition-all duration-500 shadow-2xl lg:shadow-none ${showArchive ? 'translate-x-0 opacity-100' : '-translate-x-[110%] lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden'}`}>
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3"><History size={16} /> Chronos Logs</h3>
              <button onClick={() => setShowArchive(false)} className="lg:hidden p-2 text-slate-600 hover:text-white"><X size={20} /></button>
           </div>
           <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              {sessions.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setActiveSessionId(s.id); setShowArchive(false); }}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all group relative overflow-hidden ${activeSessionId === s.id ? 'bg-fuchsia-600/10 border-fuchsia-500 shadow-xl' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex flex-col gap-2 relative z-10">
                     <p className={`text-[11px] font-black uppercase tracking-tight leading-tight transition-colors ${activeSessionId === s.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{s.title}</p>
                     <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">{new Date(s.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={(e) => deleteJournal(s.id, e)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  {activeSessionId === s.id && <div className="absolute left-0 top-4 bottom-4 w-1 bg-fuchsia-500 rounded-r-full shadow-[0_0_15px_rgba(217,70,239,1)]" />}
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="py-20 text-center opacity-20">
                  <ScrollText size={32} className="mx-auto mb-4" />
                  <p className="text-[9px] font-black uppercase">Logs Depleted</p>
                </div>
              )}
           </div>
        </div>

        {/* Main Interface Area */}
        <div className="flex-1 flex flex-col min-h-0 rpg-card rounded-[3.5rem] bg-slate-950/40 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden relative border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/[0.03] to-transparent pointer-events-none" />
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto pt-12 pb-8 px-6 md:px-16 space-y-12 no-scrollbar">
            {!activeSession || activeSession.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-pulse">
                <div className="relative">
                  <div className="absolute inset-0 bg-fuchsia-500/10 blur-3xl rounded-full" />
                  <Bot size={80} className="text-fuchsia-500/20 relative z-10" />
                </div>
                <div className="space-y-4 max-w-sm">
                  <p className="text-lg font-black text-slate-600 uppercase tracking-[0.6em] italic">Awaiting Request</p>
                  <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.4em]">Declare your intent to initiate a neural trace.</p>
                </div>
              </div>
            ) : (
              activeSession.messages.map((msg, i) => (
                <div key={i} className={`flex w-full animate-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-6 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all hover:scale-110 ${msg.role === 'user' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400'}`}>
                      {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
                    </div>

                    <div className={`p-6 md:p-8 rounded-[2.5rem] transition-all shadow-3xl border-2 relative ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/10 border-blue-500/30 text-white rounded-br-none' 
                        : 'bg-slate-900/90 border-white/5 text-slate-100 rounded-bl-none'
                    }`}>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {msg.performedActions?.map((action, actionIdx) => (
                          <div key={actionIdx} className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-xl border border-emerald-500/20 uppercase tracking-widest italic animate-in slide-in-from-left">
                            <Terminal size={12} /> {action}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-5">
                        {msg.parts.map((part, pIdx) => (
                          <div key={pIdx}>
                            {part.text && <p className="text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap">{part.text}</p>}
                          </div>
                        ))}
                      </div>
                      
                      {msg.grounding && msg.grounding.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6 animate-in slide-in-from-bottom-2 duration-700">
                          {msg.grounding.map((chunk: any, idx: number) => {
                            const uri = chunk.web?.uri || chunk.maps?.uri;
                            const title = chunk.web?.title || chunk.maps?.title || "Orbital Intel";
                            if (!uri) return null;
                            return (
                              <a 
                                key={idx} 
                                href={uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[9px] font-black text-fuchsia-400 uppercase tracking-widest hover:bg-fuchsia-500/20 hover:border-fuchsia-400 transition-all group/link shadow-xl"
                              >
                                <ExternalLink size={10} className="group-hover/link:rotate-12 transition-transform" />
                                {title.slice(0, 20)}{title.length > 20 ? '...' : ''}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex items-center gap-4 bg-black/40 border-2 border-fuchsia-500/20 px-8 py-4 rounded-full shadow-2xl">
                  <Loader2 size={16} className="text-fuchsia-500 animate-spin" />
                  <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.5em]">Oracle Scribing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Control Bar HUD */}
          <div className="px-6 md:px-16 pt-8 pb-10 bg-[#020205]/95 border-t border-white/5 relative z-20 space-y-8">
            <form onSubmit={handleSend} className="relative group max-w-6xl mx-auto w-full">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div className="relative flex items-center bg-slate-950 border-2 border-white/10 rounded-[3rem] p-3 md:p-5 shadow-3xl focus-within:border-fuchsia-500/60 transition-all group/input ring-4 ring-black/60 min-h-[80px]">
                <div className="flex items-center gap-2 md:gap-3 pl-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-12 h-12 rounded-2xl text-slate-600 hover:text-fuchsia-400 transition-all hover:bg-fuchsia-500/10 active:scale-90 flex items-center justify-center">
                    <Paperclip size={24} className="rotate-45" />
                  </button>
                  <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`w-12 h-12 rounded-2xl transition-all active:scale-90 flex items-center justify-center ${isRecording ? 'text-red-500 bg-red-500/10 animate-pulse border border-red-500/30' : 'text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/10'}`}>
                    {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                </div>
                
                <input 
                  type="text" 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder="Inscribe your inquiry..." 
                  className="flex-1 bg-transparent border-none text-white text-lg md:text-2xl font-medium focus:outline-none focus:ring-0 placeholder:text-slate-800 px-6 h-full" 
                />

                <button type="submit" disabled={(!input.trim() && !attachment) || isTyping} className="w-14 h-14 md:w-16 md:h-16 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-[1.5rem] transition-all active:scale-90 shadow-2xl flex items-center justify-center disabled:opacity-20 disabled:grayscale shrink-0">
                  <Send size={24} className="-rotate-12" />
                </button>
              </div>
              
              {attachment && (
                <div className="absolute -top-14 left-8 bg-fuchsia-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 border-2 border-fuchsia-400">
                  <ImageIcon size={14} /> {attachment.name.slice(0, 20)}...
                  <button onClick={() => setAttachment(null)} className="hover:text-black p-1 transition-colors"><X size={14} /></button>
                </div>
              )}
            </form>

            {/* Matrix Capabilities */}
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 pt-2">
              {[
                { icon: <ImageIcon size={14} />, label: 'VISION SCAN', color: 'text-fuchsia-400' },
                { icon: <Mic size={14} />, label: 'VOICE LINK', color: 'text-emerald-400' },
                { icon: <MapPin size={14} />, label: 'GEO PROXY', color: 'text-sky-400' },
                { icon: <SearchIcon size={14} />, label: 'WEB ORACLE', color: 'text-blue-400' }
              ].map((cap, idx) => (
                <div key={idx} className="flex items-center gap-3 group/cap cursor-default opacity-40 hover:opacity-100 transition-all duration-300">
                  <div className={`p-2.5 bg-slate-900 border border-white/5 rounded-xl transition-all group-hover/cap:border-white/20`}>
                    {React.cloneElement(cap.icon as React.ReactElement<any>, { className: cap.color })}
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover/cap:text-white transition-colors">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleChat;
