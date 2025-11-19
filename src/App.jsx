import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import GodModePanel from './components/GodModePanel';
import Scene from './components/Scene';

function App() {
  const [state, setState] = useState({
    wmo: 2,
    tempC: 20,
    windKph: 8,
    precipMm: 0,
    source: 'god'
  });

  const theme = useMemo(() => {
    if (state.tempC >= 24) return 'theme-warm';
    if (state.tempC <= 8) return 'theme-cold';
    return 'theme-neutral';
  }, [state.tempC]);

  return (
    <div className={`min-h-screen bg-slate-950 ${theme}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.10),transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-14">
        <Header />

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 order-2 md:order-1">
            <Scene state={state} />
          </div>
          <div className="md:col-span-2 order-1 md:order-2">
            <GodModePanel state={state} onChange={setState} />
          </div>
        </div>

        <p className="text-center text-blue-200/70 mt-6 text-sm">
          This mode bypasses live APIs so you can design and test the visuals regardless of server issues.
        </p>
      </div>
    </div>
  );
}

export default App;
