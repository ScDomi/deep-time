import { useMemo, useState } from 'react'
import { advance, createWorld, intervene, type Species } from './simulation'

const fmt = (n:number) => n === 0 ? 'ORIGIN' : `${(n/1_000_000).toFixed(2)} MY`
const trait = (s:Species) => `SPD ${Math.round(s.trait.speed)} · RES ${Math.round(s.trait.resilience)} · FRT ${Math.round(s.trait.fertility)}`

export default function App() {
  const [world, setWorld] = useState(() => createWorld(731_991))
  const [running, setRunning] = useState(false)
  const alive = useMemo(() => world.species.filter(s => !s.extinct), [world])
  const step = (n=1) => setWorld(w => advance(w, n))

  return <main>
    <header>
      <div className="brand"><span className="mark">◉</span><div><b>DEEP TIME</b><small>EVOLUTION OBSERVATORY / DT–01</small></div></div>
      <div className="year"><small>SIMULATION AGE</small><strong>{fmt(world.year)}</strong></div>
    </header>

    <section className="hero">
      <div><p className="eyebrow">A PROCEDURAL NATURAL HISTORY</p><h1>Watch a world become<br/><em>unrecognizable.</em></h1><p className="lede">Advance ten thousand years at a time. Species adapt, split and vanish. Your interventions are rare; their consequences are not.</p></div>
      <div className="planet" style={{'--heat': `${Math.max(0,Math.min(100,(world.temperature+3)/34*100))}%`} as React.CSSProperties}>
        <div className="orbit"/><span>{world.biodiversity}</span><small>LIVING LINEAGES</small>
      </div>
    </section>

    <section className="controls panel">
      <button className="primary" onClick={() => step(1)}>ADVANCE 10,000 YEARS</button>
      <button onClick={() => step(10)}>+ 100K</button>
      <button onClick={() => { setRunning(!running); if(!running){ let i=0; const id=setInterval(()=>{step(5);if(++i>18)clearInterval(id)},90)}}}>{running?'OBSERVING…':'RUN ERA'}</button>
      <button className="reset" onClick={() => setWorld(createWorld(Math.floor(Math.random()*999999)))}>NEW WORLD</button>
    </section>

    <section className="grid">
      <article className="panel ecology"><div className="sectionTitle"><span>BIOSPHERE</span><small>{alive.length} / {world.species.length} lineages extant</small></div>
        <div className="speciesMap">{alive.map((s,i) => <div className="organism" key={s.id} style={{left:`${10+(i*37)%78}%`,top:`${16+(i*53)%68}%`,borderColor:s.color,transform:`scale(${.7+s.population/130})`}} title={s.name}><i style={{background:s.color}}/><span>{s.name}</span></div>)}</div>
        <div className="cards">{alive.slice(0,5).map(s=><div className="speciesCard" key={s.id}><span className="dot" style={{background:s.color}}/><div><b>{s.name}</b><small>{trait(s)}</small></div><strong>{Math.round(s.population)}%</strong></div>)}</div>
      </article>

      <aside className="stack">
        <article className="panel climate"><div className="sectionTitle"><span>PLANETARY STATE</span></div>
          <div className="gauges"><div><strong>{world.temperature.toFixed(1)}°</strong><small>MEAN TEMP</small></div><div><strong>{world.sea.toFixed(0)}%</strong><small>OCEAN COVER</small></div></div>
          <div className="bar"><i style={{width:`${world.sea}%`}}/></div>
        </article>
        <article className="panel powers"><div className="sectionTitle"><span>RARE INTERVENTION</span><small>Use irresponsibly.</small></div>
          <button onClick={()=>setWorld(w=>intervene(w,'meteor'))}>☄ METEOR IMPACT</button>
          <button onClick={()=>setWorld(w=>intervene(w,'oxygen'))}>◌ OXYGEN PULSE</button>
          <button onClick={()=>setWorld(w=>intervene(w,'islands'))}>≈ RAISE THE SEAS</button>
        </article>
      </aside>
    </section>

    <section className="panel chronicle"><div className="sectionTitle"><span>FOSSIL RECORD</span><small>Newest strata first</small></div>
      {world.events.length===0?<p className="empty">The rock is silent. Advance time.</p>:world.events.slice(0,8).map((e,i)=><div className={`event ${e.kind}`} key={`${e.year}-${i}`}><time>{fmt(e.year)}</time><i/><p>{e.text}</p></div>)}
    </section>
    <footer>DETERMINISTIC SEED {world.seed} · LOCAL SIMULATION · NO ORACLE KNOWS WHAT COMES NEXT</footer>
  </main>
}
