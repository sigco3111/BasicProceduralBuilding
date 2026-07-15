/**
 * Loads the exported asset kit (public/assets/kit.glb) and renders placement
 * lists as InstancedMeshes — one per unique mesh/material in each part.
 * Materials come straight from the GLB (simple Principled colors in the .blend).
 */
import { Group, InstancedMesh, Matrix4, Mesh, Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Placement } from "./generator";

export class Kit {
  private parts = new Map<string, Object3D>();
  private warned = new Set<string>();

  async load(glbUrl: string): Promise<void> {
    const gltf = await new GLTFLoader().loadAsync(glbUrl);
    for (const child of [...gltf.scene.children]) {
      this.parts.set(child.name, child);
      child.updateMatrixWorld(true);
    }
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
      });
    }
    return group;
  }
}
