# Reusable science laboratory

Open `science-lab.blend` in Blender 5.x. The scene uses metres and Blender's Z-up coordinates. The room is 12 × 10 × 3.7 m; student work surfaces are 0.9575 m above the floor.

## Reuse

- Append a collection named `ASSET • …` from the blend file, or add this folder as an Asset Library in Blender Preferences. Apparatus collections are marked as assets and have their origin on the base.
- The assembled classroom is exported to `../../public/models/science-lab/science-lab.glb`.
- Individual apparatus exports are in `../../public/models/science-lab/props/`.
- `manifest.json` beside the GLBs records asset IDs, placements, room size, and worktop height. Placement coordinates use Blender's Z-up axes; the GLBs are converted to Y-up (`x, z, -y`).
- Copies of apparatus share their source mesh data. Each placed item has a named parent and an `asset_id` custom property, so it can be moved or controlled independently.

## Scene organization

1. Architecture: tiled floor, walls, three glazed window bays, blinds and trim.
2. Benches and seating: four student workstations with drawers, outlets, gas fittings and stools.
3. Fixed services and storage: preparation counter, recessed sinks, taps, glazed cupboards, drying rack, fume cupboard and trolley.
4. Placed laboratory equipment: glassware, racks, burners, tripods, stands, microscopes, balances and bench accessories.
5. Wall learning resources: periodic table, lab-practice, scientific-method and atomic-model displays, clock and labels.
6. Lighting and cameras: daylight, suspended bench lights, overview, eye-level and apparatus cameras.
7. Optional front wall and ceiling: enable viewport and render visibility for a fully enclosed room.

The project opens at student eye level with a finished acoustic ceiling, recessed light panels and ventilation grilles. The front and most of the right side remain open for scene inspection. Burners are unlit and their hoses are shown disconnected.

The `.blend` contains packed poster textures and the generator text. The filesystem source is `../../scripts/blender/create_science_lab.py`; run it with Blender 5.x from this repository. It creates a new scene rather than deleting existing scenes.

Glass transmission and fine procedural surface detail are richest in Blender Cycles. Web renderers should support glTF transmission and use appropriate environment lighting. The file contains asset geometry, not experiment simulation logic.

## Independent animated equipment

`props/` contains 27 individual Blender asset libraries, including the ceiling, beakers, burner, water volume, meniscus, boiling bubble, flame and steam puff. Matching GLBs are in the public models folder. Water and bubbles use normalised dimensions; steam is an illustrative condensed-droplet effect, not a fluid solver.

The O Level indoor laboratories share `BlenderLabEnvironment`. Existing experiment worktop heights, controls and physics coordinates are preserved. `BlenderLabApparatus` connects the separate assets to the separation experiment's heat, liquid level and stirring state. Pondweed uses the additional Blender apparatus described below; the remaining experiments retain their existing interactive apparatus. The outdoor projectile scene remains outdoors.

Generation uses both `create_science_lab.py` and `science_lab_details.py`. Exports select only the active scene to exclude unrelated objects. The frontend uses reduced environment intensity and softened shadows; the Blender project uses lower daylight/fill energy.

The pondweed-rate practical also uses Blender glassware, water, a reflector lamp, a glass heat shield, a clamp stand and an alcohol thermometer. Rebuild its four specialised props with `scripts/blender/create_pondweed_equipment.py` after the main lab generator. Shared ceiling panels have real area lights in the web renderer, and worktop colors now follow the lesson's bench setting. Local development unregisters the app's offline worker so old code cannot mask updated equipment.
