/**
 * Loads the exported asset kit (public/assets/kit.glb) and renders placement
 * lists as InstancedMeshes — one per unique mesh/material in each part.
 * Materials come straight from the GLB (simple Principled colors in the .blend).
 */
import { Group, InstancedMesh, Material, Matrix4, Mesh, Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Placement } from "./generator";

export class Kit {
  private parts = new Map<string, Object3D>();
  private warned = new Set<string>();
  /** when set, buildGroup adds a snow-shell pass (child group "snowShell") that
   *  shares geometry + instanceMatrix with the opaque meshes — zero extra memory */
  snowShellMaterial: Material | null = null;

  async load(glbUrl: string): Promise<void> {
    const gltf = await new GLTFLoader().loadAsync(glbUrl);
    for (const child of [...gltf.scene.children]) {
      this.parts.set(child.name, child);
      child.updateMatrixWorld(true);
    }
  }

  /** every unique material across the loaded parts — main.ts injects the wet
   *  shader into these so rain wets the whole building in place */
  uniqueMaterials(): Material[] {
    const set = new Set<Material>();
    for (const part of this.parts.values()) {
      part.traverse(o => {
        const mesh = o as Mesh;
        if (!mesh.isMesh) return;
        const m = mesh.material;
        if (Array.isArray(m)) m.forEach(x => set.add(x));
        else if (m) set.add(m);
      });
    }
    return [...set];
  }

  /** Build a Group of InstancedMeshes from placements (matrices in Blender Z-up space). */
  buildGroup(placements: Placement[]): Group {
    const group = new Group();
    const byPart = new Map<string, Matrix4[]>();
    for (const pl of placements) {
      let list = byPart.get(pl.key);
      if (!list) byPart.set(pl.key, (list = []));
      list.push(pl.matrix);
    }

    // separate layer of duplicated (buffer-shared) meshes that the snow shader
    // extrudes — the base building geometry stays untouched
    const snowLayer = new Group();
    snowLayer.name = "snowShell";
    snowLayer.visible = false;

    const tmp = new Matrix4();
    for (const [key, matrices] of byPart) {
      const part = this.parts.get(key);
      if (!part) {
        if (!this.warned.has(key)) {
          this.warned.add(key);
          console.warn(`kit: missing part ${key}`);
        }
        continue;
      }
      const rootInv = new Matrix4().copy(part.matrixWorld).invert();
      part.traverse(o => {
        const mesh = o as Mesh;
        if (!mesh.isMesh) return;
        // mesh transform relative to the part root — the root carries the
        // glTF Y-up conversion, which the Blender-space root group re-applies
        const meshLocal = new Matrix4().copy(rootInv).multiply(mesh.matrixWorld);
        const im = new InstancedMesh(mesh.geometry, mesh.material, matrices.length);
        im.name = key;
        im.castShadow = true;
        im.receiveShadow = true;
        for (let i = 0; i < matrices.length; i++) {
          im.setMatrixAt(i, tmp.copy(matrices[i]).multiply(meshLocal));
        }
        im.instanceMatrix.needsUpdate = true;
        group.add(im);

        // snow shell pass: same geometry, SAME instanceMatrix buffer — only the
        // vertex shader extrudes it, and fragments off the snow cap are discarded
        if (this.snowShellMaterial) {
          const shell = new InstancedMesh(mesh.geometry, this.snowShellMaterial, matrices.length);
          shell.instanceMatrix = im.instanceMatrix;
          shell.castShadow = false;
          shell.receiveShadow = true;
          snowLayer.add(shell);
        }
      });
    }
    if (snowLayer.children.length) group.add(snowLayer);
    return group;
  }
}
