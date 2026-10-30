export type Trait = { speed: number; resilience: number; fertility: number }
export type Species = { id: number; name: string; population: number; color: string; trait: Trait; born: number; extinct?: number }
export type Event = { year: number; kind: 'speciation' | 'extinction' | 'climate' | 'intervention'; text: string }
export type World = { year: number; temperature: number; sea: number; biodiversity: number; species: Species[]; events: Event[]; seed: number; nextId: number }

const namesA = ['Vel','Oro','Cera','Nym','Thal','Xeno','Astra','Myr']
const namesB = ['pod','form','thera','phyte','drake','morph','ling','zoa']
const colors = ['#6bf5be','#ffbd69','#ff6b88','#73a7ff','#d58cff','#d8f36a','#56d9e8']

export function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = Math.imul(1664525, s) + 1013904223 >>> 0) / 4294967296)
}

export function createWorld(seed = 42): World {
  return {
    year: 0, temperature: 14, sea: 50, biodiversity: 3, seed, nextId: 4, events: [],
    species: [
      { id: 1, name: 'Velopod', population: 58, color: colors[0], trait: { speed: 42, resilience: 68, fertility: 57 }, born: 0 },
      { id: 2, name: 'Ceraphyte', population: 45, color: colors[1], trait: { speed: 22, resilience: 74, fertility: 63 }, born: 0 },
      { id: 3, name: 'Astraling', population: 34, color: colors[3], trait: { speed: 71, resilience: 38, fertility: 46 }, born: 0 },
    ],
  }
}

export function advance(input: World, steps = 1): World {
  const world: World = structuredClone(input)
  const random = rng(world.seed + world.year + 991)
  for (let n = 0; n < steps; n++) {
    world.year += 10_000
    world.temperature = Math.max(-3, Math.min(31, world.temperature + (random() - .48) * 1.8))
    world.sea = Math.max(5, Math.min(95, world.sea + (world.temperature - 14) * .08 + (random() - .5) * 3))
    for (const s of world.species.filter(x => !x.extinct)) {
      const climateStress = Math.abs(world.temperature - 15) * (1 - s.trait.resilience / 120)
      const growth = (s.trait.fertility / 55) - climateStress / 10 + (random() - .5) * 1.4
      s.population = Math.max(0, Math.min(100, s.population + growth))
      if (s.population < 2) {
        s.extinct = world.year
        world.events.unshift({ year: world.year, kind: 'extinction', text: `${s.name} vanished from the fossil record.` })
      } else if (random() < .018 && world.species.filter(x => !x.extinct).length < 12) {
        const id = world.nextId++
        const trait = Object.fromEntries(Object.entries(s.trait).map(([k,v]) => [k, Math.max(5, Math.min(95, v + (random()-.5)*22))])) as Trait
        const child: Species = { id, name: namesA[Math.floor(random()*namesA.length)] + namesB[Math.floor(random()*namesB.length)], population: 12, color: colors[id % colors.length], trait, born: world.year }
        world.species.push(child)
        world.events.unshift({ year: world.year, kind: 'speciation', text: `${child.name} diverged from ${s.name}.` })
      }
    }
    if (random() < .025) {
      world.events.unshift({ year: world.year, kind: 'climate', text: world.temperature > 18 ? 'A greenhouse pulse reshaped the continents.' : 'A long glaciation locked the poles in ice.' })
    }
  }
  world.biodiversity = world.species.filter(s => !s.extinct).length
  world.seed = Math.floor(random() * 1_000_000_000)
  world.events = world.events.slice(0, 30)
  return world
}

export function intervene(input: World, kind: 'meteor' | 'oxygen' | 'islands'): World {
  const w: World = structuredClone(input)
  if (kind === 'meteor') {
    for (const s of w.species.filter(x => !x.extinct)) s.population *= .35 + s.trait.resilience / 170
    w.temperature -= 5
    w.events.unshift({ year: w.year, kind: 'intervention', text: 'A meteor darkened the sky. Survival favored resilience.' })
  } else if (kind === 'oxygen') {
    for (const s of w.species.filter(x => !x.extinct)) s.population = Math.min(100, s.population * 1.28)
    w.events.unshift({ year: w.year, kind: 'intervention', text: 'Atmospheric oxygen surged. Complex life expanded.' })
  } else {
    w.sea = Math.min(95, w.sea + 18)
    w.events.unshift({ year: w.year, kind: 'intervention', text: 'Rising seas isolated populations across newborn islands.' })
  }
  return w
}
