import {
  ACESFilmicToneMapping, Color, DirectionalLight, Fog, Group, HemisphereLight,
  Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene,
  SRGBColorSpace, Vector3, WebGLRenderer, DoubleSide,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { defaultParams, type BuildingParams } from "./params";
import { generateBuilding, roofPlate } from "./generator";
import { Kit } from "./kit";

const app = document.getElementById("app")!;
const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = SRGBColorSpace;
renderer.shadowMap.enabled = true;
app.appendChild(renderer.domElement);

const scene = new Scene();
scene.background = new Color(0x9fb4c7);
scene.fog = new Fog(0x9fb4c7, 80, 300);

const camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 600);
camera.position.set(12, 7, 14);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxPolarAngle = Math.PI * 0.52; // keep the camera above the ground
controls.minDistance = 2;
controls.maxDistance = 200;

// lights
const hemi = new HemisphereLight(0xcfe4f7, 0x54524a, 0.9);
scene.add(hemi);
const sun = new DirectionalLight(0xfff1dd, 2.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004;
scene.add(sun);
scene.add(sun.target);

/** fit the sun's shadow frustum + camera target to the current building size */
function frame(p: BuildingParams, moveCamera: boolean): void {
  const radius = 0.7 * Math.hypot(p.width, p.length, p.height);
  sun.position.copy(new Vector3(1, 1.4, 0.6).normalize().multiplyScalar(radius * 3));
  const c = sun.shadow.camera;
  c.left = -radius * 1.3;
  c.right = radius * 1.3;
  c.top = radius * 1.3;
  c.bottom = -radius * 1.3;
  c.near = radius;
  c.far = radius * 6;
  c.updateProjectionMatrix();
  controls.target.set(0, (p.height - 0.4) / 2, 0);
  if (moveCamera) {
    camera.position.set(radius * 1.9, radius * 1.15, radius * 2.2);
  }
  controls.update();
}

// ground
const ground = new Mesh(
  new PlaneGeometry(600, 600),
  new MeshStandardMaterial({ color: 0x62655f, roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Blender is Z-up: the generator works in Blender space inside a rotated root
const root = new Group();
root.rotation.x = -Math.PI / 2;
scene.add(root);

// flat roof plate — "top roof" material in the .blend (plain black Principled)
const roofMat = new MeshStandardMaterial({ color: 0x000000, roughness: 0.5, side: DoubleSide });

const kit = new Kit();
const params: BuildingParams = defaultParams();
let building: Group | null = null;

function regenerate(): void {
  if (building) {
    root.remove(building);
    building.traverse(o => {
      const im = o as { isInstancedMesh?: boolean; dispose?: () => void };
      if (im.isInstancedMesh) im.dispose?.();
    });
  }
  building = kit.buildGroup(generateBuilding(params));
  const plate = roofPlate(params);
  const plateMesh = new Mesh(new PlaneGeometry(plate.sizeX, plate.sizeY), roofMat);
  plateMesh.position.z = plate.z;
  plateMesh.receiveShadow = true;
  building.add(plateMesh);
  root.add(building);
  frame(params, false);
}

// ---- GUI ----
const gui = new GUI({ title: "building configurator" });
gui.add(params, "width", 2, 30, 1);
gui.add(params, "length", 2, 30, 1);
gui.add(params, "height", 2, 30, 1);
gui.add(params, "seed", 0, 100, 1).name("window seed");
gui.add(params, "groundStyle", ["alternate", "doors", "shop windows"]).name("ground floor");
gui.onChange(() => regenerate());

// dev hooks for headless verification
const devWindow = window as unknown as {
  __setParams?: (p: Partial<BuildingParams>) => void;
  __setCamera?: (px: number, py: number, pz: number, tx: number, ty: number, tz: number) => void;
  __placements?: () => { key: string; pos: number[]; rotZ: number }[];
  __ready?: boolean;
};
// Blender-space placement list (position + Z rotation), for verifying the port
// against the .blend's evaluated depsgraph
devWindow.__placements = () =>
  generateBuilding(params).map(pl => {
    const e = pl.matrix.elements; // column-major
    return {
      key: pl.key,
      pos: [e[12], e[13], e[14]],
      rotZ: Math.atan2(e[1], e[0]) * (180 / Math.PI),
    };
  });
devWindow.__setParams = p => {
  Object.assign(params, p);
  gui.controllersRecursive().forEach(c => c.updateDisplay());
  regenerate();
};
devWindow.__setCamera = (px, py, pz, tx, ty, tz) => {
  camera.position.set(px, py, pz);
  controls.target.set(tx, ty, tz);
  controls.update();
};

kit.load("assets/kit.glb").then(() => {
  document.getElementById("loading")?.remove();
  regenerate();
  frame(params, true);
  devWindow.__ready = true;
}).catch(err => {
  const el = document.getElementById("loading");
  if (el) el.textContent = `FAILED TO LOAD KIT: ${err}`;
  console.error(err);
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
