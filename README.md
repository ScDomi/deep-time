# Deep Time

**A procedural evolution observatory where tiny interventions reshape a million years of natural history.**

Deep Time is an experimental browser simulation: advance a synthetic planet through geological eras, watch lineages adapt, split and disappear, then leave one rare intervention in the fossil record. The same seed produces the same history, making every world reproducible.

[![CI](https://github.com/ScDomi/deep-time/actions/workflows/ci.yml/badge.svg)](https://github.com/ScDomi/deep-time/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Current features — DT-02

- Deterministic seeded simulation with per-stratum RNG
- Nine spatial biomes with different climates and carrying capacities
- Habitat fitness, crowding and migration between neighboring regions
- Four heritable traits (`speed`, `resilience`, `fertility`, `aquatic`)
- Procedural speciation, extinction and persistent parent-child ancestry
- Interactive phylogenetic record and specimen inspector
- Meteor, oxygen and sea-level interventions
- Fossil-record event timeline
- Zero backend and zero personal data

## Next milestone — DT-03: Geological Memory

The simulation will gain a reconstructable geological past:

- **Plate tectonics** — continents drift, mountain ranges form, rifts open new habitats
- **Geological layers** — sedimentation and erosion build a datable stratigraphic column
- **Fossilisation** — probabilistic preservation of real extinct species in real strata
- **Palaeontology Mode** — excavate layers, discover fossils, read trait data with scientific uncertainty
- **Known vs. true record** — explicit separation between simulation ground truth and what a scientist could reconstruct

All 12 implementation issues are tracked in the [DT-03 milestone](https://github.com/ScDomi/deep-time/milestone/1).

## Run locally

```bash
npm ci
npm run dev
```

Verification:

```bash
npm test       # 6 unit tests, should be green
npm run typecheck
npm run build  # TypeScript + Vite, zero warnings
```

## Architecture

Simulation logic lives in `src/simulation.ts` as a set of pure functions — `createWorld`, `advance`, `intervene`, `lineagePath` — with no React dependency. The UI in `src/App.tsx` is a thin shell that holds state and calls those functions. This separation makes the engine independently testable and enables future headless runs or server-side seeds.

## Contributing

The `dt-03` label marks all Geological Memory work. Every milestone issue has explicit acceptance criteria and test expectations.

## License

MIT — build strange worlds with it.
