"""Dump the evaluated geometry-nodes instances of 'Procedural Building' to JSON.

Each entry: instanced object name + 4x4 world matrix. Used to verify the
TypeScript port produces identical placements.

Usage:
  blender --background "Procedural Building.blend" --python tools/dump_instances.py -- out.json [W L H]
"""
import bpy
import json
import sys

args = sys.argv[sys.argv.index("--") + 1:]
out_path = args[0]

obj = bpy.data.objects["Procedural Building"]
if len(args) > 3:
    mod = obj.modifiers["GeometryNodes"]
    names = {i.name: i.identifier for i in mod.node_group.interface.items_tree
             if i.item_type == "SOCKET" and i.in_out == "INPUT"}
    mod[names["Width"]] = int(args[1])
    mod[names["Length"]] = int(args[2])
    mod[names["Height"]] = int(args[3])
    obj.update_tag()

deps = bpy.context.evaluated_depsgraph_get()
result = []
for inst in deps.object_instances:
    if not inst.is_instance:
        continue
    if inst.parent is None or inst.parent.original != obj:
        continue
    result.append({
        "name": inst.instance_object.original.name,
        "matrix": [list(row) for row in inst.matrix_world],
    })

with open(out_path, "w") as f:
    json.dump(result, f)
print("INST_OK", len(result))
