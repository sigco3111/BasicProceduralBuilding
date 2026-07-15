/**
 * Headless screenshot of the running dev/preview server.
 * Usage: node tools/screenshot.mjs <url> <outDir> [width length height seed]
 */
import puppeteer from "puppeteer-core";

const [, , url = "http://localhost:4173", outDir = ".", w, l, h, seed] = process.argv;

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=default", "--window-size=1400,900"],
  defaultViewport: { width: 1400, height: 900 },
});
const page = await browser.newPage();
page.on("console", m => console.log("[page]", m.text()));
page.on("pageerror", e => console.log("[pageerror]", e.message));
await page.goto(url, { waitUntil: "networkidle0" });
await page.waitForFunction("window.__ready === true", { timeout: 30000 });

if (w) {
  await page.evaluate((W, L, H, S) => {
    window.__setParams({ width: W, length: L, height: H, seed: S });
  }, +w, +l, +h, +(seed ?? 4));
}
await new Promise(r => setTimeout(r, 800));
const name = w ? `shot_${w}x${l}x${h}_s${seed ?? 4}` : "shot_default";
await page.screenshot({ path: `${outDir}/${name}.png` });
console.log("saved", `${outDir}/${name}.png`);
await browser.close();
