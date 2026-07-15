/**
 * TypeScript port of the "Geometry Nodes.002" modifier graph on the
 * "Procedural Building" object (see tools/export_kit.py for the asset kit).
 *
 * How the graph works (all coordinates Blender Z-up):
 *
 *  - Two facade grids are built with the Grid node and rotated upright (rot X 90°):
 *      front/back: Width  × Height vertices, spacing 1
 *      left/right: Length × Height vertices, spacing 1
 *  - A chain of Separate Geometry nodes classifies every grid vertex:
 *      top row (z > H/2-1)            -> "Roof" piece; its right end -> "Roof Corner"
 *      right column (x >= W/2-1)      -> "Pillar"
 *      bottom row (z <= -H/2+1.2)     -> Ground Floor collection; the Instance Index
 *                                        socket is unlinked, so Blender's implicit
 *                                        id/index field alternates the two children
 *                                        (even cell -> "G-Door", odd -> "G-Windows")
 *      everything else                -> "windows" collection, child picked by
 *                                        Random Value INT(0..100, seed 4) per point
 *  - The Width facade is placed twice (front y=L/2+5; back rotated 180°, y=-L/2+6),
 *    the Length facade twice (right rotZ 90°, x=W/2-0.5; left rotZ -90°, x=-W/2+0.5,
 *    both y=5.5), plus a (W-1)×(L-1) roof plate at z=H/2-0.1 ("top roof" material).
 *  - Finally everything is shifted by (0, 0, H/2-0.5) and (0, -5.5, 0) so the
 *    building sits on the ground, centered. Those offsets are folded in below.
 */
import { Matrix4 } from "three";
import { randInt } from "./rng";
import type { BuildingParams } from "./params";

export interface Placement {
  key: string;
  matrix: Matrix4; // Blender Z-up space
}

/** the "windows" / "Ground Floor" collection children, in collection order */
const WINDOWS = ["window1", "window2"];
const GROUND = ["G_Door", "G_Windows"];

interface Cell {
  key: string;
  x: number;
  z: number;
}

/**
 * One upright facade of cols×rows cells centered on the origin.
 * Window randomness matches the graph: the Random Value node hashes the point
 * index *after* the Separate Geometry chain, so ids are renumbered over the
 * window subset only. Blender's Grid emits vertices column-major (y fastest),
 * so the subset index is xi * windowRows + (zi - 1) — verified against the
 * evaluated depsgraph.
 */
function facadeCells(cols: number, rows: number, seed: number, groundStyle: string): Cell[] {
  const cells: Cell[] = [];
  const windowRows = rows - 2; // rows minus ground and roof
  for (let zi = 0; zi < rows; zi++) {
    for (let xi = 0; xi < cols; xi++) {
      let key: string;
      if (zi === rows - 1) key = xi === cols - 1 ? "Roof_Corner" : "Roof";
      else if (xi === cols - 1) key = "Pillar";
      else if (zi === 0) {
        if (groundStyle === "doors") key = GROUND[0];
        else if (groundStyle === "shop windows") key = GROUND[1];
        else key = GROUND[xi % GROUND.length]; // the .blend's implicit-index pick
      } else {
        const windowId = xi * windowRows + (zi - 1);
        key = WINDOWS[randInt(0, 100, windowId, seed) % WINDOWS.length];
      }
      cells.push({ key, x: xi - (cols - 1) / 2, z: zi - (rows - 1) / 2 });
    }
  }
  return cells;
}

export function generateBuilding(p: BuildingParams): Placement[] {
  const { width: W, length: L, height: H } = p;
  const facadeW = facadeCells(W, H, p.seed, p.groundStyle);
  const facadeL = facadeCells(L, H, p.seed, p.groundStyle);

  // vertical offset of Transform.006; the ±5.5 y offsets cancel against Transform.008
  const zBase = H / 2 - 0.5;
  // verified against the evaluated depsgraph (tools/dump_instances.py): the
  // unrotated facade faces -Y, the 180°-rotated copy +Y
  const groups = [
    { cells: facadeW, rot: 0, tx: 0, ty: -L / 2 + 0.5 }, // front  (Transform.001: y=-L/2+6)
    { cells: facadeW, rot: Math.PI, tx: 0, ty: L / 2 - 0.5 }, // back   (Transform.002: y=L/2+5, rotZ 180)
    { cells: facadeL, rot: Math.PI / 2, tx: W / 2 - 0.5, ty: 0 }, // right  (Transform.004)
    { cells: facadeL, rot: -Math.PI / 2, tx: -W / 2 + 0.5, ty: 0 }, // left   (Transform.005)
  ];

  const placements: Placement[] = [];
  const cellM = new Matrix4();
  for (const g of groups) {
    // Blender's Transform node translates after rotating: M = T · R
    const groupM = new Matrix4().makeRotationZ(g.rot).setPosition(g.tx, g.ty, zBase);
    for (const c of g.cells) {
      placements.push({
        key: c.key,
        matrix: new Matrix4().copy(groupM).multiply(cellM.makeTranslation(c.x, 0, c.z)),
      });
    }
  }
  return placements;
}

/** the flat roof plate (Grid.002 + "top roof" material), in Blender Z-up space */
export function roofPlate(p: BuildingParams): { sizeX: number; sizeY: number; z: number } {
  return { sizeX: p.width - 1, sizeY: p.length - 1, z: p.height - 0.6 };
}
