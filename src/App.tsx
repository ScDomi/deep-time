import { useEffect, useMemo, useState } from 'react'
import { advance, createWorld, intervene, lineagePath, type BiomeKind, type Species } from './simulation'

const fmt = (n:number) => n === 0 ? 'ORIGIN' : `${(n/1_000_000).toFixed(2)} MY`
const trait = (s:Species) => `SPD ${Math.round(s.trait.speed)} · RES ${Math.round(s.trait.resilience)} · FRT ${Math.round(s.trait.fertility)} · AQU ${Math.round(s.trait.aquatic)}`
const biomeIcon:Record<BiomeKind,string>={ocean:'≈',coast:'◒',forest:'♣',desert:'◇',tundra:'✣',volcanic:'△'}

export default function App() {
  const [world, setWorld] = useState(() => createWorld(731_991))
  const [running, setRunning] = useState(false)
  const [selected, setSelected] = useState<number>(1)
  const alive = useMemo(() => world.species.filter(s => !s.extinct), [world])
  const selectedSpecies = world.species.find(s=>s.id===selected) ?? alive[0]
  const ancestry = selectedSpecies ? lineagePath(world.species, selectedSpecies.id) : []
  const step = (n=1) => setWorld(w => advance(w, n))

  useEffect(()=>{ if(!running)return; const timer=setInterval(()=>setWorld(w=>advance(w,2)),180); return()=>clearInterval(timer)},[running])

  return <main>
    <header>
      <div className="brand"><span className="mark">◉</span><div><b>DEEP TIME</b><small>EVOLUTION OBSERVATORY / DT–02</small></div></div>
      <div className="year"><small>SIMULATION AGE</small><strong>{fmt(world.year)}</strong></div>
    </header>

    <section className="hero compact">
      <div><p className="eyebrow">A PROCEDURAL NATURAL HISTORY</p><h1>Evolution leaves<br/><em>receipts.</em></h1><p className="lede">A spatial biosphere with heritable traits, migration and a complete phylogenetic record. Advance time—or disturb it.</p></div>
      <div className="planet" style={{'--heat': `${Math.max(0,Math.min(100,(world.temperature+3)/34*100))}%`} as React.CSSProperties}><div className="orbit"/><span>{world.biodiversity}</span><small>LIVING LINEAGES</small></div>
    </section>

    <section className="controls panel">
      <button className="primary" onClick={() => step(1)}>ADVANCE 10,000 YEARS</button>
      <button onClick={() => step(10)}>+ 100K</button>
      <button className={running?'active':''} onClick={() => setRunning(!running)}>{running?'PAUSE ERA':'RUN ERA'}</button>
      <button className="reset" onClick={() => {setRunning(false);setWorld(createWorld(Math.floor(Math.random()*999999)));setSelected(1)}}>NEW WORLD</button>
    </section>

    <section className="worldGrid">
      <article className="panel mapPanel"><div className="sectionTitle"><span>BIOME ARRAY</span><small>Click a lineage to inspect its ancestry</small></div>
        <div className="biomeMap">{world.biomes.map(b=>{const residents=alive.filter(s=>s.biomeId===b.id);return <div className={`biome ${b.kind}`} key={b.id}><div className="biomeLabel"><i>{biomeIcon[b.kind]}</i><span>{b.name}<small>{b.kind} · cap {b.capacity}</small></span></div><div className="residents">{residents.map(s=><button key={s.id} className={`creature ${selected===s.id?'selected':''}`} style={{'--species':s.color,'--size':`${Math.max(15,Math.min(38,12+s.population/3))}px`} as React.CSSProperties} onClick={()=>setSelected(s.id)} title={`${s.name} · ${Math.round(s.population)}%`}><i/><small>{s.name}</small></button>)}</div></div>})}</div>
      </article>

      <aside className="stack">
        <article className="panel specimen"><div className="sectionTitle"><span>SPECIMEN</span><small>{selectedSpecies?.extinct?'EXTINCT':'EXTANT'}</small></div>{selectedSpecies&&<><div className="specimenHero"><i style={{background:selectedSpecies.color}}/><div><h2>{selectedSpecies.name}</h2><p>{world.biomes[selectedSpecies.biomeId].name}</p></div></div><div className="traitGrid">{Object.entries(selectedSpecies.trait).map(([k,v])=><div key={k}><span>{k}</span><b>{Math.round(v)}</b><i><em style={{width:`${v}%`,background:selectedSpecies.color}}/></i></div>)}</div><p className="born">Emerged {fmt(selectedSpecies.born)} · population {Math.round(selectedSpecies.population)}%</p></>}</article>
        <article className="panel climate"><div className="sectionTitle"><span>PLANETARY STATE</span></div><div className="gauges"><div><strong>{world.temperature.toFixed(1)}°</strong><small>MEAN TEMP</small></div><div><strong>{world.sea.toFixed(0)}%</strong><small>OCEAN COVER</small></div></div><div className="bar"><i style={{width:`${world.sea}%`}}/></div></article>
      </aside>
    </section>

    <section className="lowerGrid">
      <article className="panel tree"><div className="sectionTitle"><span>PHYLOGENETIC RECORD</span><small>{world.species.length} known lineages</small></div><div className="treeCanvas">
        {world.species.map((s,i)=>{const parent=s.parentId?world.species.find(x=>x.id===s.parentId):undefined;const x=35+(i%9)*100,y=38+Math.floor(i/9)*100;const pi=parent?world.species.indexOf(parent):-1;const px=pi>=0?35+(pi%9)*100:x,py=pi>=0?38+Math.floor(pi/9)*100:y;return <span key={s.id}>{parent&&<svg className="branch"><line x1={px} y1={py} x2={x} y2={y}/></svg>}<button className={`taxon ${s.extinct?'dead':''} ${selected===s.id?'selected':''}`} style={{left:x,top:y,borderColor:s.color}} onClick={()=>setSelected(s.id)}><i style={{background:s.color}}/>{s.name}</button></span>})}
        {ancestry.length>1&&<div className="ancestry">ANCESTRY: {ancestry.map(s=>s.name).join(' → ')}</div>}
      </div></article>
      <article className="panel powers"><div className="sectionTitle"><span>RARE INTERVENTION</span><small>Use irresponsibly.</small></div><button onClick={()=>setWorld(w=>intervene(w,'meteor'))}>☄ METEOR IMPACT</button><button onClick={()=>setWorld(w=>intervene(w,'oxygen'))}>◌ OXYGEN PULSE</button><button onClick={()=>setWorld(w=>intervene(w,'islands'))}>≈ RAISE THE SEAS</button></article>
    </section>

    <section className="panel chronicle"><div className="sectionTitle"><span>FOSSIL RECORD</span><small>Newest strata first</small></div>{world.events.length===0?<p className="empty">The rock is silent. Advance time.</p>:world.events.slice(0,10).map((e,i)=><div className={`event ${e.kind}`} key={`${e.year}-${i}`}><time>{fmt(e.year)}</time><i/><p>{e.text}</p></div>)}</section>
    <footer>SEED {world.seed} · {world.biomes.length} BIOMES · {world.species.length} RECORDED LINEAGES · NO ORACLE KNOWS WHAT COMES NEXT</footer>
  </main>
}
