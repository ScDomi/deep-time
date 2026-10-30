import { describe, expect, it } from 'vitest'
import { advance, createWorld, intervene } from './simulation'

describe('deep-time simulation', () => {
  it('is deterministic for the same seed', () => {
    expect(advance(createWorld(123), 25)).toEqual(advance(createWorld(123), 25))
  })
  it('advances in ten-thousand-year strata', () => {
    expect(advance(createWorld(), 7).year).toBe(70_000)
  })
  it('records interventions', () => {
    const world = intervene(createWorld(), 'meteor')
    expect(world.events[0].kind).toBe('intervention')
    expect(world.temperature).toBe(9)
  })
})
