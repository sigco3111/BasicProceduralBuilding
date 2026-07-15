/**
 * Compare the app's placements (window.__placements) with the .blend's evaluated
 * instances (tools/dump_instances.py output).
 *
 * Blender's realized Object Info geometry (Pillar / Roof / Roof Corner) reports the
 * parent object name, so those three are compared as one pooled set. The instanced
 * .blend names (G-Door, window1…) map to the kit's sanitized names.
 *
 * Usage: node tools/verify_placements.mjs <url> <instances.json> [W L H]
 */
import { readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const [, , url, jsonPath, w, l, h] = process.argv;
const blender = JSON.parse(readFileSync(jsonPath, "utf8"));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0" });
await page.waitForFunction("window.__ready === true", { timeout: 30000 });
if (w) {
  await page.evaluate((W, L, H) => window.__setParams({ width: W, length: L, height: H }), +w, +l, +h);
}
const app = await page.evaluate(() => window.__placements());
await browser.close();

// the object's scene transform, present in Blender's world matrices only
const OFF = [0, -0.5074813365936279, 0.0010000000474974513];
const POOL = new Set(["Pillar", "Roof", "Roof_Corner"]);
const NAME = { "G-Door": "G_Door", "G-Windows": "G_Windows", window1: "window1", window2: "window2" };

const norm = a => ((a % 360) + 540) % 360 - 180; // -> (-180, 180]
const cell = (key, pos, rotZ) =>
  `${key}|${pos.map(v => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2)).join(",")}|${norm(rotZ).toFixed(0)}`;

const bSet = new Map();
for (const i of blender.sort(() => 0)) {
  const m = i.matrix;
  const pos = [m[0][3] - OFF[0], m[1][3] - OFF[1], m[2][3] - OFF[2]];
  const rotZ = Math.atan2(m[1][0], m[0][0]) * (180 / Math.PI);
  const key = NAME[i.name] ?? (i.name === "Procedural Building" ? "POOL" : i.name);
  const c = cell(key, pos, rotZ);
  bSet.set(c, (bSet.get(c) ?? 0) + 1);
}
const aSet = new Map();
for (const p of app) {
  const key = POOL.has(p.key) ? "POOL" : p.key;
  const c = cell(key, p.pos, p.rotZ);
  aSet.set(c, (aSet.get(c) ?? 0) + 1);
}

let missing = 0, extra = 0;
for (const [c, n] of bSet) {
  const a = aSet.get(c) ?? 0;
  if (a < n) { missing += n - a; console.log("MISSING in app:", c, `x${n - a}`); }
}
for (const [c, n] of aSet) {
  const b = bSet.get(c) ?? 0;
  if (n > b) { extra += n - b; console.log("EXTRA in app:  ", c, `x${n - b}`); }
}
console.log(`blender=${blender.length} app=${app.length} missing=${missing} extra=${extra}`);
console.log(missing + extra === 0 ? "PLACEMENTS MATCH" : "MISMATCH");
