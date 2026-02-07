
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Loader2, ThermometerSun, Droplets, Activity, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { getWeatherForecast } from '../services/gemini';
import Skeleton from './Skeleton';

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

  const cleanTemp = (val: any) => {
    if (val === undefined || val === null || val === '') return '--';
    const match = String(val).match(/\d+/);
    return match ? match[0] : '--';
  };

  if (loading && !weather) {
    return (
      <div className="rpg-card rounded-[2.5rem] border-2 border-white/5 bg-slate-950 p-6 flex flex-col gap-4 min-h-[280px]">
        <div className="flex items-center justify-between">
          <Skeleton className="w-32 h-4" variant="text" />
          <Skeleton className="w-8 h-8" variant="circle" />
        </div>
        <div className="flex gap-8 items-center flex-1">
          <Skeleton className="w-24 h-24" variant="circle" />
          <div className="flex-1 space-y-3">
             <Skeleton className="w-full h-12" />
             <Skeleton className="w-1/2 h-4" />
          </div>
        </div>
      </div>
    );
  }

  if (errorType === 'QUOTA' && !weather) {
    return (
      <div className="rpg-card p-8 rounded-[2.5rem] border-amber-500/30 bg-amber-950/10 flex flex-col items-center justify-center min-h-[280px] space-y-4 text-center">
        <AlertCircle className="text-amber-500" size={32} />
        <p className="text-slate-400 text-[10px] font-black uppercase">Atmospheric sensors limited. Offline sync active.</p>
        <button onClick={() => fetchWeather(true)} className="px-6 py-2 bg-amber-600 text-white rounded-xl font-black text-[9px] uppercase">Retry</button>
      </div>
    );
  }

  if (!weather) return null;

  const feelsLike = cleanTemp(weather.feels_like);
  const currentTemp = cleanTemp(weather.temp_current || weather.temp_max);
  const maxTemp = cleanTemp(weather.temp_max);
  const minTemp = cleanTemp(weather.temp_min);

  return (
    <div className={`rpg-card rounded-[2.5rem] border-2 flex flex-col ${errorType === 'QUOTA' ? 'border-amber-500/40' : 'border-blue-500/20'} bg-slate-950 shadow-2xl animate-in fade-in zoom-in duration-700 relative overflow-hidden group w-full min-h-[280px]`}>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.05),_transparent_70%)] pointer-events-none" />

      <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shrink-0">
              <ThermometerSun size={20} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] italic leading-tight">ATMOSPHERIC SCANNER</h3>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">SYDNEY CORE</p>
            </div>
          </div>
          {weather.grounding_urls?.length > 0 && (
            <a href={weather.grounding_urls[0]} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-blue-400 transition-all"><ExternalLink size={14} /></a>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
          <div className="flex items-center gap-6 md:flex-1">
            <div className="relative p-5 bg-slate-900/60 rounded-[2rem] border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
              {getIcon(weather.icon_type, 56)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-start">
                <span className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums leading-none">{currentTemp}</span>
                <span className="text-2xl font-black text-blue-500 ml-1 mt-1 italic">°C</span>
              </div>
              <p className="text-sm font-black text-white uppercase tracking-widest mt-2 italic truncate max-w-[150px]">{weather.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-col gap-3 w-full md:w-auto shrink-0">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-2"><Activity size={10} /> RANGE</span>
              <span className="text-lg font-black text-white italic">{maxTemp}° / {minTemp}°</span>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-2"><Droplets size={10} /> PRECIP</span>
              <span className="text-lg font-black text-cyan-400 italic">{weather.rain_range || '--'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-950/80 px-6 py-4">
        <div className="overflow-x-auto flex gap-4 no-scrollbar">
          {weather.hourly?.slice(0, 10).map((hour: any, i: number) => (
            <div key={i} className="flex flex-col items-center shrink-0 p-3 bg-slate-900/40 rounded-2xl border border-white/5 min-w-[80px] hover:border-blue-500/30 transition-all">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">{hour.time}</span>
              {getIcon(hour.icon, 20)}
              <p className="text-sm font-black text-white mt-2 italic">{cleanTemp(hour.temp)}°</p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
