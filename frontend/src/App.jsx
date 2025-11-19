import React, { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const wmoMap = {
  0: { label: 'Clear', effect: 'clear' },
  1: { label: 'Mainly clear', effect: 'clear' },
  2: { label: 'Partly cloudy', effect: 'cloudy' },
  3: { label: 'Overcast', effect: 'cloudy' },
  45: { label: 'Fog', effect: 'fog' },
  48: { label: 'Depositing rime fog', effect: 'fog' },
  51: { label: 'Light drizzle', effect: 'rain' },
  53: { label: 'Drizzle', effect: 'rain' },
  55: { label: 'Dense drizzle', effect: 'rain' },
  61: { label: 'Slight rain', effect: 'rain' },
  63: { label: 'Rain', effect: 'rain' },
  65: { label: 'Heavy rain', effect: 'rain' },
  66: { label: 'Freezing rain', effect: 'rain' },
  67: { label: 'Heavy freezing rain', effect: 'rain' },
  71: { label: 'Slight snow', effect: 'snow' },
  73: { label: 'Snow', effect: 'snow' },
  75: { label: 'Heavy snow', effect: 'snow' },
  80: { label: 'Rain showers', effect: 'rain' },
  81: { label: 'Rain showers', effect: 'rain' },
  82: { label: 'Violent rain showers', effect: 'rain' },
  95: { label: 'Thunderstorm', effect: 'rain' },
  96: { label: 'Thunderstorm w/ hail', effect: 'rain' },
  99: { label: 'Thunderstorm w/ hail', effect: 'rain' },
}

function useMouseMask() {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return ref
}

function useWeather(lat, lon){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if(lat == null || lon == null) return
    const ctrl = new AbortController()
    setLoading(true); setError(null)
    fetch(`${BACKEND}/weather?lat=${lat}&lon=${lon}`)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [lat, lon])
  return { data, loading, error }
}

function useGeolocate(){
  const [pos, setPos] = useState({lat: null, lon: null})
  useEffect(() => {
    if(!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (p)=> setPos({lat: p.coords.latitude, lon: p.coords.longitude}),
      ()=> setPos({lat: 40.7128, lon: -74.0060}) // fallback NYC
    )
  }, [])
  return pos
}

function tempTheme(t){
  if(t == null) return 'theme-neutral'
  if(t >= 24) return 'theme-warm'
  if(t <= 8) return 'theme-cold'
  return 'theme-neutral'
}

function effectFromCode(code){
  const item = wmoMap[code] || { effect: 'clear' }
  return item.effect
}

export default function App(){
  const mouseRef = useMouseMask()
  const { lat, lon } = useGeolocate()
  const { data, loading } = useWeather(lat, lon)
  const effect = useMemo(()=> effectFromCode(data?.weather_code), [data])
  const theme = useMemo(()=> tempTheme(data?.temperature), [data])

  // wind wobble on cards when windy
  const windy = (data?.wind_speed || 0) > 7

  return (
    <div className={`${theme} min-h-screen app-bg relative overflow-hidden`}>      
      <header className="relative z-10">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="font-semibold tracking-tight text-xl">WeatherFlow</div>
          <div className="text-sm opacity-70">{data ? new Date().toLocaleString() : ''}</div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center py-10 lg:py-16">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Feel the weather
            </h1>
            <p className="text-slate-300/80 text-lg max-w-prose">
              A dynamic dashboard that transforms with the sky. Fog reveals with your cursor, rain drizzles across the screen, and wind makes panels sway.
            </p>
            <SearchBox />
          </div>
          <div className="h-[380px] md:h-[520px] rounded-xl overflow-hidden">
            <Spline scene="https://prod.spline.design/wwTRdG1D9CkNs368/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard className={windy ? 'wind-wobble' : ''} label="Temperature" value={fmtTemp(data?.temperature)} accent="🌡️"/>
          <StatCard className={windy ? 'wind-wobble' : ''} label="Feels like" value={fmtTemp(data?.apparent_temperature)} accent="🥵"/>
          <StatCard className={windy ? 'wind-wobble' : ''} label="Wind" value={fmtWind(data?.wind_speed)} accent="🍃"/>
          <StatCard className={windy ? 'wind-wobble' : ''} label="Humidity" value={fmtPct(data?.humidity)} accent="💧"/>
        </section>
      </main>

      {/* Weather overlays */}
      {effect === 'fog' && <FogOverlay refEl={mouseRef} />}
      {effect === 'rain' && <div className="rain-layer" />}

      <GradientBackdrop />
    </div>
  )
}

function fmtTemp(v){ if(v==null) return '—'; return `${Math.round(v)}°C` }
function fmtWind(v){ if(v==null) return '—'; return `${Math.round(v)} m/s` }
function fmtPct(v){ if(v==null) return '—'; return `${Math.round(v)}%` }

function StatCard({ label, value, accent, className='' }){
  return (
    <div className={`glass rounded-xl p-5 transition-all ${className}`}>
      <div className="text-sm uppercase tracking-wide text-slate-300/70">{label}</div>
      <div className="text-3xl font-semibold mt-2 flex items-center gap-3">
        <span>{value}</span>
        <span className="text-xl opacity-70">{accent}</span>
      </div>
    </div>
  )
}

function GradientBackdrop(){
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
           style={{background: 'radial-gradient(circle, rgba(147,51,234,1) 0%, rgba(59,130,246,1) 100%)'}} />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-20"
           style={{background: 'radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(16,185,129,1) 100%)'}} />
    </div>
  )
}

function SearchBox(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)

  const onSearch = async (val)=>{
    setQ(val)
    if(!val){ setResults([]); return }
    const res = await fetch(`${BACKEND}/geocode?q=${encodeURIComponent(val)}`)
      .then(r=>r.json())
    setResults(res.results || [])
    setOpen(true)
  }

  const choose = async (item)=>{
    setOpen(false)
    // Emit custom event with coords for App to pick up
    const ev = new CustomEvent('choose-location', { detail: { lat: item.latitude, lon: item.longitude } })
    window.dispatchEvent(ev)
  }

  useEffect(()=>{
    const handler = (e)=>{
      if(e.key === 'Enter') onSearch(q)
    }
    window.addEventListener('keydown', handler)
    return ()=> window.removeEventListener('keydown', handler)
  }, [q])

  return (
    <div className="relative max-w-md">
      <input value={q} onChange={e=>onSearch(e.target.value)} placeholder="Search city..."
             className="w-full glass rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400/40"/>
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full glass rounded-xl divide-y divide-white/5">
          {results.map((r,i)=> (
            <button key={i} className="w-full text-left px-4 py-3 hover:bg-white/5" onClick={()=>choose(r)}>
              {r.name}{r.admin1 ? `, ${r.admin1}`:''} {r.country ? `• ${r.country}`:''}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FogOverlay({ refEl }){
  // Bind listener for search selection to override geolocated position
  const [coords, setCoords] = useState(null)
  useEffect(()=>{
    const h = (e)=> setCoords(e.detail)
    window.addEventListener('choose-location', h)
    return ()=> window.removeEventListener('choose-location', h)
  }, [])

  // Attach mouse tracking for mask
  useEffect(()=>{
    // nothing, it's global in useMouseMask
  }, [])

  return (
    <div className="fog-mask">
      <div ref={refEl} className="fog-layer"/>
    </div>
  )
}
