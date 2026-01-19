
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Loader2, ThermometerSun, Droplets, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { getWeatherForecast } from '../services/gemini';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<'NONE' | 'QUOTA' | 'GENERIC'>('NONE');

  const fetchWeather = async (force = false) => {
    setLoading(true);
    setErrorType('NONE');
    const data = await getWeatherForecast(force);
    
    if (data?.error === 'QUOTA_REACHED') {
      setErrorType('QUOTA');
      const cached = localStorage.getItem('lifequest_weather_v2');
      if (cached) {
        setWeather(JSON.parse(cached).data);
      }
    } else if (!data) {
      setErrorType('GENERIC');
    } else {
      setWeather(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getIcon = (type: string, size: number = 32) => {
    const iconType = type?.toLowerCase() || 'sun';
    switch (iconType) {
      case 'sun': return <Sun className="text-yellow-400 animate-spin-slow" size={size} />;
      case 'cloud': return <Cloud className="text-slate-400" size={size} />;
      case 'rain': return <CloudRain className="text-blue-400" size={size} />;
      case 'storm': return <CloudLightning className="text-purple-400 animate-pulse" size={size} />;
      default: return <Sun className="text-yellow-400" size={size} />;
    }
  };

  if (loading && !weather) {
    return (
      <div className="rpg-card p-6 rounded-[2.5rem] border-slate-800 flex flex-col items-center justify-center h-full min-h-[300px] opacity-50 space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
        </div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Sensors...</p>
      </div>
    );
  }

  if (errorType === 'QUOTA' && !weather) {
    return (
      <div className="rpg-card p-6 rounded-[2.5rem] border-amber-500/30 bg-amber-950/10 flex flex-col items-center justify-center h-full min-h-[300px] space-y-6 text-center">
        <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/40">
          <AlertCircle className="text-amber-500" size={32} />
        </div>
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-tighter italic">Link Exhausted</h3>
          <p className="text-slate-400 text-[10px] mt-2 max-w-[180px] mx-auto">Sensors reached limit. Sync offline.</p>
        </div>
        <button 
          onClick={() => fetchWeather(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`rpg-card rounded-[2.5rem] border-2 h-full flex flex-col ${errorType === 'QUOTA' ? 'border-amber-500/40' : 'border-blue-500/20'} bg-slate-950/40 shadow-2xl animate-in fade-in zoom-in duration-700 relative overflow-hidden group w-full`}>
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.06),_transparent_70%)] pointer-events-none" />

      {/* Header Info */}
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <ThermometerSun size={18} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] italic leading-none">Atmospheric Scanner</h3>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full ${errorType === 'QUOTA' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                  Sydney Sync
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Weather Cluster - Removed mb-auto to move stats UP */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="relative">
            <div className="absolute inset-[-15px] bg-blue-500/15 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-slate-900/80 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {getIcon(weather.icon_type, 64)}
            </div>
          </div>

          <div className="flex flex-col items-center text-center w-full min-w-0">
            <div className="flex items-start justify-center gap-0.5 min-w-0">
              <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {weather.temp_current || weather.temp_max}
              </span>
              <span className="text-3xl font-black text-blue-500 mt-1">°</span>
            </div>
            
            <div className="mt-4 px-2 w-full">
              <p className="text-[14px] font-black text-white uppercase tracking-tight leading-snug break-words">
                {weather.summary}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 opacity-80">
                Feels like <span className="text-blue-400 font-black">{weather.feels_like}°</span>
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Stats Strip - Pushed up as empty space removed above */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <div className="bg-black/40 p-4 rounded-3xl border border-white/5 shadow-inner hover:border-blue-500/30 transition-all flex flex-col items-center group/stat">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1 group-hover/stat:text-blue-400">
              <Activity size={10} className="text-blue-500" /> Range
            </span>
            <span className="text-lg font-black text-white tracking-tighter tabular-nums">{weather.temp_max}° / {weather.temp_min}°</span>
          </div>

          <div className="bg-black/40 p-4 rounded-3xl border border-white/5 shadow-inner hover:border-cyan-500/30 transition-all flex flex-col items-center group/stat">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1 group-hover/stat:text-cyan-400">
              <Droplets size={10} className="text-cyan-500" /> Rain
            </span>
            <span className="text-lg font-black text-cyan-400 tracking-tighter truncate w-full text-center tabular-nums">{weather.rain_range}</span>
          </div>
        </div>
        
        {/* Spacer to push Temporal Trace to the very bottom */}
        <div className="flex-1" />
      </div>

      {/* Hourly Trace - Significantly taller and larger icons/text */}
      <div className="border-t border-white/5 bg-slate-950/60 pt-5 pb-6">
        <div className="px-6 flex items-center justify-between mb-4">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Temporal Trace</span>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide flex gap-4 px-6 no-scrollbar pb-2">
          {weather.hourly?.slice(0, 8).map((hour: any, i: number) => (
            <div key={i} className="flex flex-col items-center justify-between shrink-0 px-4 py-6 bg-slate-900/40 rounded-3xl border border-white/5 min-w-[85px] min-h-[140px] hover:bg-blue-900/20 hover:border-blue-500/30 transition-all group/hour shadow-lg">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover/hour:text-blue-400">{hour.time}</span>
              <div className="my-2 group-hover/hour:scale-110 transition-transform">
                {getIcon(hour.icon, 28)}
              </div>
              <p className="text-xl font-black text-white leading-none tracking-tighter tabular-nums">{hour.temp}°</p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
