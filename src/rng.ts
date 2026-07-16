/**
 * Blender's Random Value node (INT), bit-exact.
 *
 * Blender computes `noise::hash(id, seed) % (max - min + 1) + min`, where
 * noise::hash is Bob Jenkins' lookup3 final mix (BLI_hash_int_2d). The graph
 * leaves the ID input unlinked, so it receives the implicit point index.
 * Verified against evaluated Random Value outputs from the .blend's Blender.
 */

function rot(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

/** noise::hash(kx, ky) — Jenkins lookup3 final mix */
export function hashInt2d(kx: number, ky: number): number {
  let a = (0xdeadbeef + (2 << 2) + 13) >>> 0;
  let b = a;
  let c = a;
  a = (a + (kx >>> 0)) >>> 0;
  b = (b + (ky >>> 0)) >>> 0;
  c = (c ^ b) >>> 0; c = (c - rot(b, 14)) >>> 0;
  a = (a ^ c) >>> 0; a = (a - rot(c, 11)) >>> 0;
  b = (b ^ a) >>> 0; b = (b - rot(a, 25)) >>> 0;
  c = (c ^ b) >>> 0; c = (c - rot(b, 16)) >>> 0;
  a = (a ^ c) >>> 0; a = (a - rot(c, 4)) >>> 0;
  b = (b ^ a) >>> 0; b = (b - rot(a, 14)) >>> 0;
  c = (c ^ b) >>> 0; c = (c - rot(b, 24)) >>> 0;
  return c;
}

/** hash mapped to [0,1] — used for deterministic environment scatter */
export function hash01(id: number, seed: number): number {
  return hashInt2d(id, seed) / 4294967295;
}

/** Random Value (Int): hash(id, seed) % range + min, exactly like Blender */
export function randInt(min: number, max: number, id: number, seed: number): number {
  const range = max - min + 1;
  return min + (hashInt2d(id, seed) % range);
}
