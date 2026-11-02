# DT-03 Geological Memory — implementation contract

DT-03 is planned work. This document fixes the shared contracts between the 12 milestone issues; it does not claim that Geological Memory is implemented.

## Dependency order

```text
#1 data model
├── #2 plate tectonics
├── #3 geological layers ── #4 fossilisation
│                         ├── #5 palaeontology UI
│                         ├── #6 known vs true record ── #7 dual phylogeny
│                         └── #9 extinction boundaries
├── #10 climate history
└── #8 seed sharing (independent after the current world bootstrap is understood)

#11 integration test depends on #1–#4 and #10.
#12 performance budget depends on #1–#4 and should run after #11 is stable.
```

Issues may be implemented in a different order only when their listed contracts are already present. No issue should introduce a temporary incompatible representation that a later issue must silently reinterpret.

## Canonical geological ownership

`World.geo` is optional so the existing DT-02 world remains valid. A geo-enabled world owns one `GeologicalRecord`:

- `plates`: tectonic state;
- `layers`: strata in oldest-to-newest order;
- `fossils`: the canonical store of complete `Fossil` objects, keyed by fossil ID;
- `climateHistory`: sampled global climate state;
- `erosionGaps`: explicit intervals removed or made unobservable by erosion;
- `tectonicAge`: elapsed geological simulation time.

A `GeologicalLayer` stores only `fossilIds`. Every referenced ID must exist in `world.geo.fossils`, and every fossil must be referenced by exactly one retained layer. Trimming a layer must also remove its no-longer-referenced fossils, or retain them only through an explicitly documented archive. DT-03 must choose and test one policy; the default contract is removal with the trimmed layer.

## Fossil age and uncertainty

A fossil has:

- `trueAge`: exact simulation year, retained as ground truth and never exposed by the default palaeontology UI;
- `estimatedAge`: seeded noisy estimate used by the observable record;
- `ageUncertainty`: non-negative half-width in years;
- observable interval `[estimatedAge - ageUncertainty, estimatedAge + ageUncertainty]`.

The interval is clamped to valid simulation time. Replaying the same seed and action sequence must produce byte-equivalent fossil ages and uncertainty values.

Lineage-confidence calculations use interval overlap divided by the smaller interval width. Zero-width intervals use exact equality and never divide by zero.

## Layers and erosion gaps

Layers are stored oldest-to-newest. `depositAge` is the world year at the beginning of the stratum being simulated. Therefore, after a completed advance step, every newly retained layer satisfies `depositAge < world.year`.

Erosion is not represented only by decreasing thickness. Whenever erosion removes an entire layer or makes part of the record unobservable, the engine records an `ErosionGap` with:

- deterministic ID;
- `startAge` inclusive;
- `endAge` exclusive;
- cause/event reference;
- affected layer IDs where available.

Adjacent or overlapping gaps are normalized into one interval. `KnownRecord.missingIntervals` is derived from these explicit gaps, not guessed from array indices.

## Deterministic advance order

One 10,000-year geological step executes in this order:

1. Capture the step's `startYear`, pre-step living-species IDs and pre-step climate.
2. Advance tectonics when the cadence is due; produce step-local collision/separation facts.
3. Apply existing environmental dynamics and queued interventions.
4. Advance populations, migration and speciation; collect extinctions without fossilising yet.
5. Create the layer for `startYear` using the resulting climate plus step-local tectonic facts.
6. Fossilise collected extinctions into that new top layer using the seeded step RNG.
7. Compute the extinction fraction using the pre-step living-species count as denominator and mark the layer when the threshold is met.
8. Apply scheduled erosion and normalize `erosionGaps`.
9. Append the post-step climate sample.
10. Enforce deterministic caps and referential integrity, then increment/finalize `world.year` for the completed step.

The implementation may use immutable intermediate values, but externally observable results must follow this order. `advance(world, n)` must remain chunk-equivalent to calling `advance(world, 1)` `n` times.

## Reproducibility contract

A reproducible run is defined by:

- normalized integer seed;
- initial world version;
- ordered intervention/action sequence;
- number of 10,000-year steps.

No geological function may use `Math.random()`, wall-clock time, object iteration order as entropy, or UI state as simulation input. Random draws must come from the existing seeded progression or a documented deterministic sub-seed derived from the world seed, step and entity ID.

Seed parsing accepts only base-10 safe integers. Invalid, empty, floating-point or out-of-range values fall back to the documented default seed. Sharing a seed must preserve unrelated URL parameters.

## Testing rules

- Construct boundary states directly; do not search for a lucky seed in unit tests.
- Tests involving probabilities inject a deterministic random value or deterministic RNG seam.
- UI issues include focused component or DOM tests for visibility, labels and state transitions.
- Performance tests use fixed fixtures, a warm-up run and multiple measurements. Functional CI must not become flaky because of a single shared-runner timing sample.
- Existing six DT-02 tests remain green throughout the milestone.
