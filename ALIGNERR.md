# Deep Time — Alignerr Project Description

## Project name

Deep Time

## Repository

https://github.com/ScDomi/deep-time

## One-line summary

A deterministic procedural evolution simulator where interventions reshape millions of years of natural history, reconstructable through fossils and geological strata.

---

## What the project does

Deep Time advances a synthetic planet through geological time. At each 10,000-year step, species heritably adapt, migrate between biomes, speciate into new lineages and occasionally go extinct. The player can trigger rare geological or cosmic events — a meteor impact, an oxygen surge, rising seas — and watch how these perturbations ripple through the evolutionary tree.

The simulation is fully deterministic: the same seed always produces the same history. Every species that ever existed is recorded with its traits, ancestry and extinction time, making the full phylogenetic record inspectable at any point.

The current build (DT-02) is a working browser app: no backend, no personal data, load and play in seconds.

---

## Technology stack

- **Language:** TypeScript (strict mode)
- **Framework:** React 19 + Vite
- **Tests:** Vitest (6 unit tests, 100 % of exported engine functions covered)
- **CI:** GitHub Actions — test + build on every push and pull request
- **Deployment:** GitHub Pages (build artifact)
- **Architecture:** pure-function simulation engine (`simulation.ts`) completely separated from the React UI (`App.tsx`)

---

## Current capabilities (DT-02)

- Nine spatial biomes (ocean, coast, forest, desert, tundra, volcanic, …) with distinct carrying capacities and temperatures
- Four heritable traits per species: speed, resilience, fertility, aquatic affinity
- Habitat fitness function: each species is scored against its current biome and the global temperature
- Population dynamics with crowding pressure, habitat fit and random noise
- Deterministic migration: species move to better biomes when fit enough to survive the crossing
- Probabilistic speciation: daughter lineages inherit parent traits with mutation
- Phylogenetic record: every species links to its parent; `lineagePath` reconstructs the ancestry chain
- Interventions: meteor (mass kill + cooling), oxygen pulse (capacity lift), rising seas (coastal expansion)
- Chunk-parity guarantee: `advance(world, 10)` is identical to calling `advance(world, 1)` ten times (fixed in DT-03 prep, covered by a new test)

---

## Next milestone: DT-03 — Geological Memory

The simulation will gain a reconstructable geological past. All 12 implementation issues are live on GitHub under the [DT-03 milestone](https://github.com/ScDomi/deep-time/milestone/1).

### Feature breakdown

| # | Feature | What it adds |
|---|---|---|
| #1 | Geological data model | `Plate`, `GeologicalLayer`, `Fossil`, `GeologicalRecord` types; `World.geo` |
| #2 | Plate tectonics | Deterministic continental drift, mountain formation, rift events |
| #3 | Layer accumulation | Sedimentation + erosion; datable stratigraphic column |
| #4 | Fossilisation | Probabilistic preservation with trait snapshot and age uncertainty |
| #5 | Palaeontology Mode UI | Layer inspector, excavation, fossil trait display |
| #6 | Scientific uncertainty | `KnownRecord` vs ground truth; inferred lineages; missing intervals |
| #7 | Phylogenetic dual view | Fossil-derived tree with togglable true-lineage overlay |
| #8 | Seed sharing | `?seed=N` URL param for reproducible world sharing |
| #9 | Mass-extinction strata | Geological boundary detection and Palaeontology panel highlight |
| #10 | Climate history | Persistent temperature/sea time series + line chart |
| #11 | Integration test | 1 MY run asserting full geological record consistency |
| #12 | Performance budget | 10 MY advance < 2 s regression guard |

### What makes DT-03 interesting to implement with an AI coding assistant

Each issue is independent and has explicit acceptance criteria, but the features compose into a coherent system. Interesting engineering challenges:

- **Epistemics as a first-class feature.** `KnownRecord` explicitly separates what exists in the simulation from what a hypothetical scientist could observe. This is not a display trick — it requires thinking carefully about information flow and purity.
- **Determinism under composition.** Per-stratum RNG seeding must be maintained through plate movements, fossilisation noise and layer accumulation without introducing any path-dependence.
- **Data structure growth under real-time constraints.** Layer capping, climate history trimming and fossil indexing all need to stay within the performance budget, even during browser animation loops.

---

## Why this project is a good fit for Alignerr

- **Solo ownership from day one.** Every commit is authored by ScDomi. No co-authors, no forks, no external dependencies beyond the declared npm packages.
- **MIT licensed.** Free to use, study and extend.
- **Genuinely novel idea.** Not a tutorial, not a clone. The separation between simulation ground truth and player-reconstructible scientific record is an original design decision.
- **Already working.** DT-02 builds and passes tests in CI; the live version was deployed to GitHub Pages. DT-03 is a forward-looking milestone, not a fix for a broken prototype.
- **Hard problems preserved.** The DT-03 issues are real engineering work: geological data modelling, deterministic physics, UI for epistemic uncertainty, performance contracts. They are not pre-solved.

---

## Repository health (as of DT-03 preparation)

| Check | Result |
|---|---|
| Tests | 6 / 6 passing |
| Build | Clean, zero TS errors, zero warnings |
| CI | All runs green |
| License | MIT, single author (ScDomi / Dominik Schwagerl) |
| Open issues | 12 (all DT-03, milestone set, labels applied) |
| Dependencies | 0 vulnerabilities (`npm audit`) |
| Commit authorship | 100 % ScDomi |
