
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Scan, Sparkles, ShieldCheck, Activity, RefreshCw, AlertCircle, Trophy, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { analyzePosture } from '../services/gemini';
import { TaskCategory } from '../types';

interface PostureScannerProps {
  onManualXpAward: (xp: number, message: string, category?: TaskCategory) => void;
  lastPostureCheck: string;
}

const PostureScanner: React.FC<PostureScannerProps> = ({ onManualXpAward, lastPostureCheck }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const isToday = (dateString: string) => {
    if (!dateString || dateString === new Date(0).toISOString()) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const isAlreadyScannedToday = isToday(lastPostureCheck);

  // Logic to bind the stream to the video element once it is mounted
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Error playing video:", e));
    }
  }, [isCameraActive, stream]);

  const startCamera = async () => {
    if (isAlreadyScannedToday) return;
    try {
      setError(null);
      setIsInitializing(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        } 
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera access denied:", err);
      setError(err.message?.includes('Permission') 
        ? "Camera access denied. Please allow camera permissions in your browser settings." 
        : "Failed to initialize camera. Check if another app is using it.");
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setScanResult(null);
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isAlreadyScannedToday) return;
    
    setIsScanning(true);
    setScanResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      try {
        const result = await analyzePosture(base64Image);
        setScanResult(result);
        
        if (result.score >= 8) {
          onManualXpAward(100, `Perfect Alignment: ${result.rank}! The Sovereign Pillar trait is strong.`, TaskCategory.HEALTH);
        } else if (result.score >= 5) {
          onManualXpAward(25, `Alignment Maintained: ${result.rank}. Keep refining your core.`, TaskCategory.HEALTH);
        }
      } catch (err) {
        console.error("Analysis failed:", err);
        setError("Oracle link unstable. Please try scanning again.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic glow-text-red">Stance Sync</h2>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] mt-6 flex items-center gap-4">
            <Activity className="text-rose-500 animate-pulse" /> 
            Real-time Biometric Alignment Protocol
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className={`rpg-card rounded-[4rem] border-rose-500/20 bg-slate-950 overflow-hidden relative shadow-3xl flex items-center justify-center transition-all duration-500 ${isCameraActive ? 'aspect-video' : 'min-h-[400px] md:min-h-[500px]'}`}>
            {!isCameraActive ? (
              <div className="flex flex-col items-center gap-8 text-center p-12 w-full">
                <div className="relative">
                  <div className={`absolute inset-0 ${isAlreadyScannedToday ? 'bg-emerald-500/20' : 'bg-rose-500/20'} blur-3xl rounded-full animate-pulse`} />
                  <div className={`relative p-10 rounded-[3rem] border-2 shadow-2xl ${isAlreadyScannedToday ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-bounce'}`}>
                    {isAlreadyScannedToday ? <CheckCircle2 size={64} /> : <Camera size={64} />}
                  </div>
                </div>
                <div className="space-y-4 max-w-sm">
                  <h3 className={`text-4xl font-black text-white uppercase tracking-tighter ${isAlreadyScannedToday ? 'glow-text-green' : ''}`}>
                    {isAlreadyScannedToday ? 'Stance Synchronized' : 'Optical Link Offline'}
                  </h3>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
                    {isAlreadyScannedToday 
                      ? 'Daily calibration complete. Your biometric signature is locked until the next temporal cycle.' 
                      : 'Initialize Stance Sensor to begin alignment calibration and claim Sovereign XP.'}
                  </p>
                </div>
                <button 
                  onClick={startCamera}
                  disabled={isInitializing || isAlreadyScannedToday}
                  className={`w-full max-w-xs px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 border-b-4 flex items-center justify-center gap-4 ${
                    isAlreadyScannedToday 
                      ? 'bg-slate-900 border-slate-700 text-slate-600 cursor-not-allowed border-b-0' 
                      : 'bg-rose-600 hover:bg-rose-500 border-rose-800 text-white'
                  }`}
                >
                  {isInitializing ? <Loader2 className="animate-spin" size={20} /> : null}
                  {isAlreadyScannedToday ? 'Scanner Locked (1/1)' : (isInitializing ? 'Connecting...' : 'Enable Optical Link')}
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover grayscale brightness-125 opacity-80"
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-rose-500 rounded-tl-2xl shadow-[-5px_-5px_20px_rgba(244,63,94,0.5)]" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-rose-500 rounded-tr-2xl shadow-[5px_-5px_20px_rgba(244,63,94,0.5)]" />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-rose-500 rounded-bl-2xl shadow-[-5px_5px_20px_rgba(244,63,94,0.5)]" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-rose-500 rounded-br-2xl shadow-[5px_-5px_20px_rgba(244,63,94,0.5)]" />
                  
                  <div className={`absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_20px_rgba(244,63,94,1)] transition-all duration-[3000ms] ease-linear top-0 ${isScanning ? 'animate-scan-line' : 'opacity-0'}`} />
                  
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8">
                     <div className="text-[8px] md:text-[9px] font-black text-rose-500 uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-rose-500/20 whitespace-nowrap">SENSORS: ACTIVE</div>
                     <div className="text-[8px] md:text-[9px] font-black text-rose-500 uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-rose-500/20 whitespace-nowrap">TARGET: SPINE</div>
                  </div>
                </div>

                <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col md:flex-row gap-4 md:gap-6 w-full px-6 md:w-auto">
                  <button 
                    onClick={captureAndScan}
                    disabled={isScanning || isAlreadyScannedToday}
                    className={`flex items-center justify-center gap-4 px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl transition-all active:scale-95 ${
                      isScanning || isAlreadyScannedToday ? 'bg-slate-800 text-slate-500 border-2 border-white/5 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 text-white border-2 border-rose-400'
                    }`}
                  >
                    {isScanning ? <RefreshCw className="animate-spin" size={20} /> : (isAlreadyScannedToday ? <CheckCircle2 size={20} /> : <Scan size={20} />)}
                    {isScanning ? 'Analyzing Stance...' : (isAlreadyScannedToday ? 'Sync Complete' : 'Trigger Stance Sync')}
                  </button>
                  <button onClick={stopCamera} className="hidden md:flex p-6 bg-slate-900 border-2 border-white/10 rounded-3xl text-slate-400 hover:text-white transition-all items-center justify-center"><RefreshCw size={24} /></button>
                  <button onClick={stopCamera} className="md:hidden py-4 bg-slate-900 border-2 border-white/10 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest">Disconnect Link</button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {error && (
            <div className="mt-6 p-6 bg-red-950/20 border-2 border-red-500/30 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-2">
              <AlertCircle className="text-red-500" size={24} />
              <p className="text-red-400 text-sm font-black uppercase tracking-widest">{error}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <div className="rpg-card p-10 md:p-12 rounded-[3.5rem] border-rose-500/10 bg-slate-950 h-full flex flex-col">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
              <Activity size={20} className="text-rose-500" /> Oracle's Assessment
            </h3>

            {scanResult ? (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-2">
                    <p className="text-6xl font-black text-white tracking-tighter tabular-nums leading-none glow-text-red">{scanResult.score}<span className="text-2xl text-rose-500 italic opacity-40">/10</span></p>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Alignment Rating</p>
                  </div>
                  <div className="text-right">
                    <span className="px-5 py-2 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl">{scanResult.rank}</span>
                  </div>
                </div>

                <div className="p-8 bg-black/40 border-2 border-white/5 rounded-[2.5rem] shadow-inner space-y-6">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} className="text-rose-400" /> Divine Insight</p>
                    <p className="text-lg text-white font-bold italic leading-relaxed">"{scanResult.feedback}"</p>
                  </div>
                  <div className="pt-6 border-t border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12} className="text-cyan-400" /> Tactical Correction</p>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed">{scanResult.advice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                    <Trophy className="text-yellow-500 mb-2" size={24} />
                    <span className="text-2xl font-black text-white tracking-tighter leading-none">+{scanResult.score >= 8 ? 100 : 25}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">XP AWARDED</span>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                    <Zap className="text-blue-400 mb-2" size={24} />
                    <span className="text-2xl font-black text-white tracking-tighter leading-none">+{scanResult.score >= 8 ? 50 : 10}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">GOLD PIECES</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
                <div className={`w-24 h-24 border-4 border-dashed rounded-full flex items-center justify-center mb-8 ${isAlreadyScannedToday ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                  {isAlreadyScannedToday ? <CheckCircle2 size={40} className="text-emerald-500" /> : <Scan size={40} className="text-slate-500" />}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  {isAlreadyScannedToday ? 'Daily Calibration Complete' : 'Pending Optical Stance Input...'}
                </p>
                <p className="text-[8px] text-slate-700 uppercase tracking-widest mt-4 leading-relaxed">
                  {isAlreadyScannedToday 
                    ? 'Return in the next cycle to sustain your Sovereign streak.' 
                    : 'Forge your spine into a sovereign pillar to claim the Oracle\'s favour.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line { animation: scan-line 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default PostureScanner;
