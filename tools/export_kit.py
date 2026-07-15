"""Export the building part meshes from the .blend to a single GLB kit.

The geometry-nodes graph instances these objects via Object Info / Collection Info
with transform_space=ORIGINAL, i.e. their local-space geometry with the object
transform ignored — so every part is exported with its transform reset to identity.

Usage:
  blender --background "Procedural Building.blend" --python tools/export_kit.py -- public/assets/kit.glb
"""
import bpy
import sys

out_path = sys.argv[sys.argv.index("--") + 1]

# name in .blend -> safe glTF node name (GLTFLoader mangles spaces/dashes)
PARTS = {
    "G-Door": "G_Door",
    "G-Windows": "G_Windows",
    "Pillar": "Pillar",
    "Roof": "Roof",
    "Roof Corner": "Roof_Corner",
    "window1": "window1",
    "window2": "window2",
}

bpy.ops.object.select_all(action="DESELECT")
for src_name, safe_name in PARTS.items():
    obj = bpy.data.objects[src_name]
    obj.name = safe_name
    obj.parent = None
    obj.location = (0.0, 0.0, 0.0)
    obj.rotation_euler = (0.0, 0.0, 0.0)
    obj.scale = (1.0, 1.0, 1.0)
    obj.hide_set(False)
    obj.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    # keep Blender Z-up coordinates — the app applies the graph's Blender-space
    # matrices directly and converts to Y-up with a rotated root group
    export_yup=False,
)
print("KIT_OK ->", out_path)
