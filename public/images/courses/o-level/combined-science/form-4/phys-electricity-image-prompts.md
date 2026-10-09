# electricity teaching images

Generated using the imagegen skill and built-in image_gen tool. Separate landscape raster images, 1536 × 1024, transcoded to WebP without altering image content. Saved in this directory. Original PNGs remain in the tool output directory. Each selected image was visually checked; corrections below address direction arrows, electrical polarity, valve states or labels.

Circuit SVGs are additionally supplied beside the corresponding images in ElectricCircuitDiagram.tsx, as requested. SVGs use deterministic standard symbols and accessible titles.

Reference checks: [motor and generator principles](https://openstax.org/books/college-physics-2e/pages/23-5-electric-generators), [engine principles](https://www.energy.gov/cmei/vehicles/articles/internal-combustion-engine-basics), [lightning safety](https://www.weather.gov/safety/lightning-safety).

## Static charging

Saved file: `phys-electricity-charging.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'Static charging'. Realistic polythene rod rubbed by dry cloth, electrons transfer FROM cloth TO polythene. Rod marked negative, cloth positive; caption 'Electrons move; total charge is conserved'. Second simple perspex rod positive after losing electrons. No protons moving.

## D.c circuit symbols

Saved file: `phys-electricity-circuits.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'D.c circuit symbols'. Large crisp labelled STANDARD schematic raster, main simple single closed loop with one cell, switch CLOSED, lamp (circle with cross), resistor rectangle, all SERIES, no bypass wire. Below isolated symbols with labels 'Cell' one long and short parallel lines, 'Battery' repeated cell pairs, 'Open switch', 'Lamp', 'Resistor' rectangle, 'Variable resistor' rectangle diagonal arrow, 'Fuse' rectangle horizontal line, 'Ammeter' circle A, 'Voltmeter' circle V. Never connect isolated symbols into nonsense. No numerical example.

## Measuring current and voltage

Saved file: `phys-electricity-meters.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'Measuring current and voltage'. One clear STANDARD schematic raster: single cell, closed switch, AMMETER circle A and RESISTOR rectangle in one complete SERIES loop. VOLTMETER circle V in its OWN BRANCH connected across the resistor ONLY, resistor remains present not replaced. Clearly junction dots at resistor terminals. Label 'Ammeter in series', 'Voltmeter in parallel'. No meter across cell for this setup, no direct wire bypass of resistor. Clear white background.

Correction / final replacement prompt:

Keep all apparatus and wiring routes. Close switch blade physically on right terminal to match label. Correct voltmeter polarity: RED positive terminal must connect to RIGHT resistor end (positive supply side); BLACK negative terminal must connect to LEFT resistor end. Swap voltmeter wires only; they may cross cleanly withoutjunction. Ammeter positiveconnection alreadycorrect. Remove resistor colourbands to avoid unintended numerical value. Keep labels.

## Electroscope charging

Saved file: `phys-electricity-electroscope.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'Electroscope charging'. Three side by side faithful goldleaf electroscope cutaways, metal topcap connected conductingrod to thin metalstem and single goldleaf in insulatingglasscase. Left uncharged leaf hangs against stem. Middle negative rod NEAR cap NOTtouching; negativeelectronchargesrepelleddown stem andleaf, positivechargecap, leafdiverges. Right negative rod TOUCHEScap transfers electrons; negativecapstemleaf andleafdiverges. Labels 'Uncharged', 'Induction: rod nearby', 'Contact: rod touching'. Electron marks only, no electrons crossgap middle.

## Series and parallel resistors

Saved file: `phys-electricity-resistors.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'Series and parallel resistors'. Two large correct schematiccircuits. TOP singlecompletecellclosedloop TWO resistorrectanglesoneafteranother marked '2 Ω', '4 Ω', title 'Series: total 6 Ω'. BOTTOM battery and TWO separatebranches eachresistor marked '6 Ω', SAMEtwojunctionnodes, title 'Parallel: total 3 Ω'. No extraresistors, no seriesloopcontainingallparallelresistors. Caption 'Series: same current. Parallel: same voltage'.

Correction / final replacement prompt:

Preserve complete correctseriesparallel wiring and allnumericlabels. Remove ALL colour bands from ALL four resistor bodies; use plain neutral resistor bodies with existing printedlabels 2Ω4Ω6Ω6Ω. Do not change connections or resistance text.

## Three-pin plug

Saved file: `phys-electricity-plug.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'Three-pin plug'. Realistic labelled INTERNAL view UK-style fusedthreepinplug seenwithcoverremoved,cableentersBOTTOM. EarthterminalTOPGREEN/YELLOWstripedwire. NeutralLEFTBLUEwire. LiveRIGHTBROWNwire passes throughFUSEbeforelivepin. CordgripclampsOUTERcablesheathnotindividualwires. Labels 'Earth: green/yellow', 'Neutral: blue', 'Live: brown', 'Fuse in live wire', 'Cable grip'. No switchinsideplug no barecopperoutsideconnector. Small doubleinsulationsymbolsquareinsidesquare.

Correction / final replacement prompt:

Keep plug wiring correct and unchanged. Replace nonsense text '136 A' on fuse with '13 A' clearly. Keep all other labels. Do not alter conductor routes.

## Solar photovoltaic system

Saved file: `phys-electricity-solar.webp`

Prompt:

Create one separate scientifically accurate raster teaching image, landscape1536×1024, white background, navy large readable titles, generous margins, realistic equipment with clear labelled diagrams. No code/SVG, no dense tiny text. Title 'Solar photovoltaic system'. Separate actual landscapeimage rooftopPVpanels -> chargecontroller -> optional battery -> inverter -> AC lamp appliance. DCfrompanelsandbattery,ACfrominverter label. Solarphotovoltaicconverts light directlytoelectricity, NO hotwatertubes. Optionalbatterylabel. Caption 'Light → electrical energy'. No false electricitycreationatnight.

Correction / final replacement prompt:

Preserve accurate PV flowdiagram. Replace battery caption 'Stores DC electricity for later use' with 'Stores energy for later use'. Battery storeschemicalenergy andsuppliesDC; do not implyitstoresaformofcurrent. Othertextunchanged.

