# Deep Time

**A procedural evolution observatory where tiny interventions reshape a million years of natural history.**

Deep Time is an experimental browser simulation: advance a synthetic planet through geological eras, watch lineages adapt, split and disappear, then leave one rare intervention in the fossil record. The same seed produces the same history, making every world reproducible.

## Current prototype

- Deterministic seeded simulation
- Nine spatial biomes with different climates and carrying capacities
- Habitat fitness, crowding and migration between neighboring regions
- Four heritable traits (`speed`, `resilience`, `fertility`, `aquatic`)
- Procedural speciation, extinction and persistent parent-child ancestry
- Interactive phylogenetic record and specimen inspector
- Meteor, oxygen and sea-level interventions
- Fossil-record event timeline
- Zero backend and zero personal data

## Run locally

```bash
npm install
npm run dev
```

Verification:

```bash
npm test
npm run build
```

## Research direction

Deep Time explores how understandable local rules produce histories that are difficult to predict. The roadmap includes continental geography, ecological niches, heritable body plans, phylogenetic trees, fossils, mass-extinction strata and shareable world seeds.

This is an agent-based simulation project, not an AI model training or evaluation system.

## Stack

React, TypeScript, Vite and Vitest. Simulation logic lives independently of the interface in `src/simulation.ts`.

## License

MIT — build strange worlds with it.
