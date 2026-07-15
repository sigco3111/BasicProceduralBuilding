/** The generator inputs — Width/Length/Height are the modifier inputs of the
 *  "Geometry Nodes.002" group; seed / groundStyle are configurator extras
 *  (the .blend hard-codes seed=4 and alternates the ground-floor parts). */
export interface BuildingParams {
  width: number;
  length: number;
  height: number;
  seed: number;
  groundStyle: "alternate" | "doors" | "shop windows";
}

export function defaultParams(): BuildingParams {
  return {
    width: 4, // the modifier values saved in the .blend (interface defaults are 6/6/3)
    length: 4,
    height: 4,
    seed: 4,
    groundStyle: "alternate",
  };
}
