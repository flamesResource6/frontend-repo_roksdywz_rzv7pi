import React, { useMemo } from 'react';

// Map WMO codes to simple descriptors/effects
const wmoMap = (code) => {
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return code === 0 ? 'clear' : 'clouds';
};

function Scene({ state }) {
  const theme = useMemo(() => {
    if (state.tempC >= 24) return 'warm';
    if (state.tempC <= 8) return 'cold';
    return 'neutral';
  }, [state.tempC]);

  const effect = useMemo(() => wmoMap(state.wmo), [state.wmo]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-blue-500/20 min-h-[380px] md:min-h-[460px] p-0
      ${theme === 'warm' ? 'bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-rose-700/10' : ''}
      ${theme === 'cold' ? 'bg-gradient-to-br from-cyan-600/15 via-blue-800/10 to-indigo-900/10' : ''}
      ${theme === 'neutral' ? 'bg-gradient-to-br from-slate-700/20 via-slate-800/20 to-slate-900/20' : ''}
    `}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -inset-24 blur-3xl opacity-40 ${theme === 'warm' ? 'bg-amber-400/20' : theme === 'cold' ? 'bg-cyan-400/20' : 'bg-blue-400/10'}`}></div>
      </div>

      {/* Rain effect */}
      {effect === 'rain' && (
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(white_40%,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_2px,transparent_2px)] bg-[length:2px_12px] animate-[rain_500ms_linear_infinite]" />
          <style>{`@keyframes rain{from{background-position-y:0}to{background-position-y:12px}}`}</style>
        </div>
      )}

      {/* Fog effect */}
      {effect === 'fog' && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_60%)]" />
        </div>
      )}

      {/* Wind wobble on content */}
      <div className={state.windKph > 25 ? 'animate-[wobble_2s_ease-in-out_infinite]' : ''}>
        <style>{`@keyframes wobble{0%,100%{transform:translateX(0)}50%{transform:translateX(2px)}}`}</style>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-6xl md:text-7xl font-bold text-white drop-shadow">{Math.round(state.tempC)}°</div>
              <div className="text-blue-200/80">Feels like scene: {effect}</div>
            </div>
            <div className="text-right">
              <div className="text-white/90">WMO {state.wmo}</div>
              <div className="text-blue-200/80">Wind {Math.round(state.windKph)} km/h</div>
              <div className="text-blue-200/80">Precip {state.precipMm} mm</div>
              <div className="text-blue-200/70 text-xs">Mode: {state.source}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
}

export default Scene;
