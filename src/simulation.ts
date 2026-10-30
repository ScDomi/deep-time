export type Trait = { speed: number; resilience: number; fertility: number; aquatic: number }
export type BiomeKind = 'ocean' | 'coast' | 'forest' | 'desert' | 'tundra' | 'volcanic'
export type Biome = { id: number; kind: BiomeKind; name: string; x: number; y: number; capacity: number; temperature: number }
export type Species = { id: number; parentId?: number; name: string; population: number; color: string; trait: Trait; born: number; extinct?: number; biomeId: number }
export type Event = { year: number; kind: 'speciation' | 'extinction' | 'climate' | 'intervention' | 'migration'; text: string }
export type World = { year: number; temperature: number; sea: number; biodiversity: number; species: Species[]; biomes: Biome[]; events: Event[]; seed: number; nextId: number }

const namesA = ['Vel','Oro','Cera','Nym','Thal','Xeno','Astra','Myr','Iri','Kryo','Soma','Vanta']
const namesB = ['pod','form','thera','phyte','drake','morph','ling','zoa','ceros','nema']
const colors = ['#6bf5be','#ffbd69','#ff6b88','#73a7ff','#d58cff','#d8f36a','#56d9e8','#ff8f5a','#a5ffa0']

export function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = Math.imul(1664525, s) + 1013904223 >>> 0) / 4294967296)
}

function makeBiomes(seed: number): Biome[] {
  const r = rng(seed)
  const kinds: BiomeKind[] = ['ocean','coast','forest','desert','tundra','volcanic','forest','coast','ocean']
  const labels = ['Pelagic Abyss','Shatter Coast','Emerald Basin','Glass Expanse','White Crown','Ash Rift','Moss Interior','Western Reaches','Sapphire Trench']
  return kinds.map((kind,id) => ({ id, kind, name: labels[id], x: id%3, y: Math.floor(id/3), capacity: 55+Math.round(r()*40), temperature: [-2,10,17,27,-8,31,16,12,4][id] }))
}

export function createWorld(seed = 42): World {
  return {
    year: 0, temperature: 14, sea: 50, biodiversity: 3, seed, nextId: 4, events: [], biomes: makeBiomes(seed),
    species: [
      { id: 1, name: 'Velopod', population: 58, color: colors[0], trait: { speed: 42, resilience: 68, fertility: 57, aquatic: 24 }, born: 0, biomeId: 2 },
      { id: 2, name: 'Ceraphyte', population: 45, color: colors[1], trait: { speed: 22, resilience: 74, fertility: 63, aquatic: 8 }, born: 0, biomeId: 6 },
      { id: 3, name: 'Astraling', population: 34, color: colors[3], trait: { speed: 71, resilience: 38, fertility: 46, aquatic: 78 }, born: 0, biomeId: 1 },
    ],
  }
}

function habitatFit(s: Species, b: Biome, globalTemp: number) {
  const wet = b.kind === 'ocean' || b.kind === 'coast'
  const mediumFit = wet ? s.trait.aquatic / 100 : 1 - s.trait.aquatic / 120
  const climateFit = 1 - Math.min(1, Math.abs((b.temperature + globalTemp - 14) - 15) / (18 + s.trait.resilience / 3))
  return Math.max(.05, mediumFit * .55 + climateFit * .45)
}

export function advance(input: World, steps = 1): World {
  const world: World = structuredClone(input)
  const random = rng(world.seed + world.year + 991)
  for (let n = 0; n < steps; n++) {
    world.year += 10_000
    world.temperature = Math.max(-3, Math.min(31, world.temperature + (random() - .48) * 1.8))
    world.sea = Math.max(5, Math.min(95, world.sea + (world.temperature - 14) * .08 + (random() - .5) * 3))
    for (const s of world.species.filter(x => !x.extinct)) {
      const biome = world.biomes[s.biomeId]
      const fit = habitatFit(s, biome, world.temperature)
      const crowding = world.species.filter(x => !x.extinct && x.biomeId === s.biomeId).reduce((a,x)=>a+x.population,0) / biome.capacity
      const growth = fit * (s.trait.fertility / 42) - crowding * .58 + (random() - .5) * 1.8
      s.population = Math.max(0, Math.min(100, s.population + growth))
      if (s.population < 2) {
        s.extinct = world.year
        world.events.unshift({ year: world.year, kind: 'extinction', text: `${s.name} vanished in ${biome.name}.` })
      } else if (random() < .012 + s.trait.speed / 15000) {
        const neighbors = world.biomes.filter(b => Math.abs(b.x-biome.x)+Math.abs(b.y-biome.y) === 1)
        const target = neighbors.sort((a,b)=>habitatFit(s,b,world.temperature)-habitatFit(s,a,world.temperature))[0]
        if (target && habitatFit(s,target,world.temperature) > fit + .08) {
          s.biomeId = target.id
          world.events.unshift({ year: world.year, kind: 'migration', text: `${s.name} crossed into ${target.name}.` })
        }
      }
      if (!s.extinct && random() < .02 && world.species.filter(x => !x.extinct).length < 18) {
        const id = world.nextId++
        const trait = Object.fromEntries(Object.entries(s.trait).map(([k,v]) => [k, Math.max(3, Math.min(97, v + (random()-.5)*24))])) as Trait
        const child: Species = { id, parentId:s.id, name: namesA[Math.floor(random()*namesA.length)] + namesB[Math.floor(random()*namesB.length)], population: 10, color: colors[id % colors.length], trait, born: world.year, biomeId:s.biomeId }
        world.species.push(child)
        world.events.unshift({ year: world.year, kind: 'speciation', text: `${child.name} diverged from ${s.name} in ${biome.name}.` })
      }
    }
    if (random() < .025) world.events.unshift({ year: world.year, kind: 'climate', text: world.temperature > 18 ? 'A greenhouse pulse redrew the habitable world.' : 'A long glaciation drove life toward refugia.' })
  }
  world.biodiversity = world.species.filter(s => !s.extinct).length
  world.seed = Math.floor(random() * 1_000_000_000)
  world.events = world.events.slice(0, 50)
  return world
}

export function intervene(input: World, kind: 'meteor' | 'oxygen' | 'islands'): World {
  const w: World = structuredClone(input)
  if (kind === 'meteor') {
    for (const s of w.species.filter(x => !x.extinct)) s.population *= .3 + s.trait.resilience / 160
    w.temperature = Math.max(-3,w.temperature - 5)
    w.events.unshift({ year: w.year, kind: 'intervention', text: 'A meteor darkened the sky. Resilient lineages inherited the silence.' })
  } else if (kind === 'oxygen') {
    for (const s of w.species.filter(x => !x.extinct)) s.population = Math.min(100, s.population * 1.3)
    w.biomes.forEach(b=>b.capacity=Math.min(130,b.capacity+12))
    w.events.unshift({ year: w.year, kind: 'intervention', text: 'Atmospheric oxygen surged. Ecological ceilings lifted.' })
  } else {
    w.sea = Math.min(95, w.sea + 18)
    w.biomes.filter(b=>b.kind==='coast').forEach(b=>b.capacity+=20)
    w.events.unshift({ year: w.year, kind: 'intervention', text: 'Rising seas fragmented continents into evolutionary islands.' })
  }
  return w
}

export function lineagePath(species: Species[], id: number): Species[] {
  const path: Species[] = []
  let current = species.find(s=>s.id===id)
  while(current){ path.unshift(current); current = current.parentId ? species.find(s=>s.id===current!.parentId) : undefined }
  return path
}
