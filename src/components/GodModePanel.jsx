import React from 'react';

const PRESETS = [
  { id: 'clear', label: 'Clear • Sunny', wmo: 0, tempC: 26, windKph: 6, precipMm: 0 },
  { id: 'partly', label: 'Partly Cloudy', wmo: 2, tempC: 22, windKph: 10, precipMm: 0 },
  { id: 'fog', label: 'Foggy', wmo: 45, tempC: 12, windKph: 4, precipMm: 0 },
  { id: 'rain', label: 'Rain', wmo: 61, tempC: 14, windKph: 8, precipMm: 3 },
  { id: 'storm', label: 'Thunderstorm', wmo: 95, tempC: 18, windKph: 22, precipMm: 10 },
  { id: 'snow', label: 'Snow', wmo: 71, tempC: -2, windKph: 12, precipMm: 5 },
  { id: 'wind', label: 'Windy', wmo: 1, tempC: 20, windKph: 40, precipMm: 0 },
];

function GodModePanel({ state, onChange }) {
  const setPreset = (p) => onChange({
    wmo: p.wmo,
    tempC: p.tempC,
    windKph: p.windKph,
    precipMm: p.precipMm,
    source: 'god'
  });

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-white font-semibold">God Mode Controls</h2>
        <span className="text-xs text-blue-300/70">Source: {state.source === 'god' ? 'God Mode' : 'Live'}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => setPreset(p)}
            className={`text-left px-3 py-2 rounded-xl border transition-colors text-sm
              ${state.wmo === p.wmo && state.source === 'god' ? 'bg-blue-500/20 border-blue-400/40 text-blue-100' : 'bg-slate-900/40 border-slate-600/40 text-slate-200/90 hover:border-blue-400/30'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-blue-200/70 mb-1">WMO Code</label>
          <input type="number" value={state.wmo}
            onChange={e => onChange({ ...state, wmo: parseInt(e.target.value || '0', 10), source: 'god' })}
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2 text-white"/>
        </div>
        <div>
          <label className="block text-xs text-blue-200/70 mb-1">Temperature (°C)</label>
          <input type="number" value={state.tempC}
            onChange={e => onChange({ ...state, tempC: parseFloat(e.target.value || '0'), source: 'god' })}
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2 text-white"/>
        </div>
        <div>
          <label className="block text-xs text-blue-200/70 mb-1">Wind (km/h)</label>
          <input type="number" value={state.windKph}
            onChange={e => onChange({ ...state, windKph: parseFloat(e.target.value || '0'), source: 'god' })}
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2 text-white"/>
        </div>
        <div>
          <label className="block text-xs text-blue-200/70 mb-1">Precip (mm)</label>
          <input type="number" value={state.precipMm}
            onChange={e => onChange({ ...state, precipMm: parseFloat(e.target.value || '0'), source: 'god' })}
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2 text-white"/>
        </div>
      </div>
    </div>
  );
}

export default GodModePanel;
