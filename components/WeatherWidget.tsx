
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Loader2, ExternalLink, ThermometerSun, Droplets, Wind, Activity, ArrowDown, ArrowUp } from 'lucide-react';
import { getWeatherForecast } from '../services/gemini';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getWeatherForecast();
      setWeather(data);
      setLoading(false);
    };
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

  if (loading) {
    return (
      <div className="rpg-card p-8 rounded-[2.5rem] border-slate-800 flex flex-col items-center justify-center min-h-[300px] opacity-50 space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Atmospheric Data...</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="rpg-card rounded-[2.5rem] border-2 border-blue-500/20 bg-slate-950/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in duration-700 relative overflow-hidden group">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.08),_transparent_70%)] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000" />

      {/* Header Info */}
      <div className="p-8 pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform">
              <ThermometerSun size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em] italic leading-none">Atmospheric Scanner</h3>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Satellite Sync: Sydney / Kingsford Smith
              </p>
            </div>
          </div>
          <a 
            href="https://www.bom.gov.au/location/australia/new-south-wales/metropolitan/bnsw_pt131-sydney"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/60 hover:bg-blue-600/20 rounded-xl border border-white/5 text-[9px] font-black text-slate-500 hover:text-blue-400 transition-all uppercase tracking-widest group/link"
          >
            Live BOM Trace
            <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Primary Weather Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Temperature Display */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative shrink-0">
              <div className="absolute inset-[-10px] bg-blue-500/10 blur-2xl rounded-full animate-pulse" />
              <div className="relative bg-slate-900/80 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-center">
                {getIcon(weather.icon_type, 64)}
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left pt-2">
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                  {weather.temp_current || weather.temp_max}<span className="text-blue-500">°</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-blue-400 tracking-tighter -mb-1">C</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global</span>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2 max-w-xs line-clamp-2">
                  {weather.summary}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Feels like <span className="text-blue-400 font-black">{weather.feels_like}°</span>
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-black/40 p-5 rounded-[1.5rem] border border-white/5 shadow-inner flex flex-col justify-between group/stat hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-blue-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Daily Range</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Max</span>
                  <span className="text-xl font-black text-white tracking-tighter">{weather.temp_max}°</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Min</span>
                  <span className="text-lg font-black text-slate-400 tracking-tighter">{weather.temp_min}°</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-5 rounded-[1.5rem] border border-white/5 shadow-inner flex flex-col justify-between group/stat hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Droplets size={14} className="text-cyan-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rainfall</span>
              </div>
              <div className="mt-auto">
                <p className="text-2xl font-black text-cyan-400 tracking-tighter leading-none">{weather.rain_range}</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">Predicted Range</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Trace - Scrollable Strip */}
      <div className="mt-8 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
        <div className="px-8 pt-5 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Temporal Prediction Trace</span>
            <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-30" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
            <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-widest">Real-time Stream</span>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide flex gap-4 p-8 pt-4 mask-linear-fade">
          {weather.hourly?.map((hour: any, i: number) => (
            <div key={i} className="flex flex-col items-center gap-4 shrink-0 px-5 py-6 bg-slate-900/30 rounded-3xl border border-white/5 min-w-[110px] hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-300 group/hour shadow-lg">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/hour:text-blue-400 transition-colors">{hour.time}</span>
              
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner group-hover/hour:scale-110 transition-transform">
                {getIcon(hour.icon, 24)}
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-xl font-black text-white leading-none tracking-tighter">{hour.temp}°</p>
                <div className="flex flex-col items-center gap-1 opacity-50 group-hover/hour:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Feels {hour.feels_like}°</span>
                  {hour.rain_amount && hour.rain_amount !== '0mm' && (
                    <span className="text-[8px] font-black text-cyan-500 flex items-center gap-1 uppercase">
                      <Droplets size={8} /> {hour.rain_amount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Grounding Info */}
      <div className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/20 gap-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {weather.sources?.slice(0, 1).map((chunk: any, i: number) => (
            chunk.web && (
              <div key={i} className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest truncate max-w-[180px]">
                  Ref: {chunk.web.title}
                </span>
              </div>
            )
          ))}
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <Activity size={10} className="text-emerald-500" /> Sensor Network: Nominal
          </span>
          <div className="h-3 w-px bg-slate-800" />
          <span className="text-slate-400 italic">"Plan your raids accordingly."</span>
        </div>
      </div>
      
      <style>{`
        .mask-linear-fade {
          -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
