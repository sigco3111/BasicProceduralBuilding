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

## Environment & look

The building sits on a stylized floating **diorama pedestal** that resizes with
it — grass top, soil sides, a plaza slab + curb under the footprint, and
deterministic low-poly props in the building's palette (green + pink-blossom
trees, bushes, teal street lamps). Everything is generated in
[src/environment.ts](src/environment.ts); no textures or external assets.

- **Time-of-day presets** (environment folder): *golden hour* (default), *day*,
  and *night* — each drives the gradient sky dome (with sun glow and night
  stars), fog, sun/fill/ambient rig, drifting low-poly clouds, street-lamp
  glow, window-glass emissive (windows light up at night), exposure, and the
  post grade.
- **Cinematic post stack** ([src/postfx.ts](src/postfx.ts)): bloom → tone map →
  film grade (vignette, animated grain, chromatic aberration, saturation /
  contrast), all adjustable under environment ▸ cinematic.
- **Auto-orbit** turntable + clouds toggle in the same folder.

## Weather (ported from BuildingGeneratorThreeJS)

The GUI has **snow** and **rain** folders (mutually exclusive master toggles),
each with its full set of live settings:

- **Snow** — *snowfall* (density, fall speed, flake size, sway, opacity, color,
  fall height, wind strength/direction) and *accumulation* (coverage, patch
  scale/softness, height variation, seed, flatness, color, roughness, relief
  strength/scale, sparkle). Snow settles as a shell pass that shares the
  building's geometry + instance buffers (zero extra memory) and only shows on
  upward faces — [src/snow.ts](src/snow.ts), [src/snowAccum.ts](src/snowAccum.ts).
- **Rain** — *rainfall* (density, fall speed, streak length/width, opacity,
  color, fall height, wind strength/direction) and *wetness* (coverage, mask
  scale/softness, height variation, seed, surface wetness, wet darkness,
  reflection roughness, droplet beading/density, top puddles, flatness, ripple
  strength/scale/speed/density). Wetness is injected in place into every
  building material via `onBeforeCompile` — no extra geometry —
  [src/rain.ts](src/rain.ts), [src/wet.ts](src/wet.ts).

Both effects key off world-up, so they follow the building at any size. The
diorama is a full weather target too: rain leaves glossy puddle patches on the
plaza and grass, and every diorama mesh (grass top, plaza, curb, tree canopies,
bushes, trunks, lamp posts) carries a snow-shell duplicate — only the emissive
lamp bulbs and the contact-shadow decal opt out (clouds are separate and never
shelled).

## How the port works

- Each facade is a grid of 1×1 cells: top row → roof rim (corner piece at the
  end), last column → corner pillar, ground row → alternating door/shop window,
  the rest → `window1`/`window2` picked by Blender's Random Value INT
  (bit-exact `BLI_hash_int_2d` reimplementation in [src/rng.ts](src/rng.ts)).
- [src/generator.ts](src/generator.ts) emits Blender Z-up matrices; a root
  group rotated -90° X converts to Y-up. [src/kit.ts](src/kit.ts) renders each
  part as one InstancedMesh per mesh/material.

## Blender tooling (Blender 4.2+)

All commands are run from the project root
(`C:\Users\chiro\Documents\GitHub\BasicProceduralBuilding>`), Windows PowerShell
or cmd. Adjust the Blender path to your installed version.

```powershell
# re-export the asset kit after editing part meshes in the .blend
& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background "Procedural Building.blend" --python tools\export_kit.py -- public\assets\kit.glb

# dump the node graph to JSON (for inspecting graph changes)
& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background "Procedural Building.blend" --python tools\dump_blend.py -- dump.json

# dump evaluated instances (ground truth) for a given Width Length Height
& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background "Procedural Building.blend" --python tools\dump_instances.py -- inst.json 5 7 6
```

In cmd.exe, drop the leading `&` (it is PowerShell's call operator).

## Verifying the port against Blender

After a re-export or generator change, check that the app still matches the
.blend instance-for-instance (needs Chrome installed):

```powershell
npm run build
npm run preview        # serves on http://localhost:4173, keep it running
# in a second terminal:
node tools\verify_placements.mjs http://localhost:4173 inst.json 5 7 6
```

`PLACEMENTS MATCH` means every instance position, rotation, and window variant
is identical to Blender's evaluated depsgraph.
