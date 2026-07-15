# Basic Procedural Building — Three.js Configurator

A web building configurator ported from the geometry-nodes graph in
`Procedural Building.blend` ("Geometry Nodes.002" on the *Procedural Building*
object). The part meshes (doors, shop windows, windows, pillars, roof pieces)
are exported to an instanced asset kit (`public/assets/kit.glb`); the placement
logic is a faithful TypeScript port, **verified instance-for-instance against
Blender's evaluated depsgraph** (positions, rotations, and window-variant picks
are identical for the same seed).

## Run

```sh
npm install
npm run dev
```

Controls: **width / length / height** (the graph's modifier inputs), **window
seed** (the Random Value node's seed, 4 in the .blend), and **ground floor**
style (the .blend alternates door / shop window via the implicit index).

## How the port works

- Each facade is a grid of 1×1 cells: top row → roof rim (corner piece at the
  end), last column → corner pillar, ground row → alternating door/shop window,
  the rest → `window1`/`window2` picked by Blender's Random Value INT
  (bit-exact `BLI_hash_int_2d` reimplementation in [src/rng.ts](src/rng.ts)).
- [src/generator.ts](src/generator.ts) emits Blender Z-up matrices; a root
  group rotated -90° X converts to Y-up. [src/kit.ts](src/kit.ts) renders each
  part as one InstancedMesh per mesh/material.

## Blender tooling (Blender 4.2+)

```sh
# re-export the asset kit after editing part meshes
blender --background "Procedural Building.blend" --python tools/export_kit.py -- public/assets/kit.glb

# dump the node graph to JSON
blender --background "Procedural Building.blend" --python tools/dump_blend.py -- dump.json

# dump evaluated instances (ground truth) and check the port against them
blender --background "Procedural Building.blend" --python tools/dump_instances.py -- inst.json 5 7 6
npm run build && npx vite preview &
node tools/verify_placements.mjs http://localhost:4173 inst.json 5 7 6
```
