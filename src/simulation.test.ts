import { describe, expect, it } from 'vitest'
import { advance, createWorld, intervene, lineagePath } from './simulation'

describe('deep-time simulation', () => {
  it('is deterministic for the same seed', () => {
    expect(advance(createWorld(123), 25)).toEqual(advance(createWorld(123), 25))
  })
  it('advances in ten-thousand-year strata', () => {
    expect(advance(createWorld(), 7).year).toBe(70_000)
  })
  it('produces the same history regardless of advance chunk size', () => {
    const initial = createWorld(456)
    const oneJump = advance(initial, 10)
    let repeated = initial
    for (let i = 0; i < 10; i++) repeated = advance(repeated, 1)
    expect(oneJump).toEqual(repeated)
  })
  it('creates a spatial world with valid habitats', () => {
    const world = createWorld(9)
    expect(world.biomes).toHaveLength(9)
    expect(world.species.every(s => world.biomes.some(b => b.id === s.biomeId))).toBe(true)
  })
  it('records interventions and changes ecology', () => {
    const initial = createWorld()
    const world = intervene(initial, 'oxygen')
    expect(world.events[0].kind).toBe('intervention')
    expect(world.biomes[0].capacity).toBeGreaterThan(initial.biomes[0].capacity)
  })
  it('reconstructs ancestry from parent ids', () => {
    const world = createWorld()
    world.species.push({...world.species[0], id: 4, parentId: 1, name:'Child'})
    expect(lineagePath(world.species, 4).map(s=>s.id)).toEqual([1,4])
  })
})
