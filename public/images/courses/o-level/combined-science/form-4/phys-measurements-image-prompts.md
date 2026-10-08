# Measurements: generated teaching images

Created using the built-in image_gen tool and the imagegen skill. Nine actual raster illustrations, each 1536 × 1024, replace the earlier code-drawn SVGs. They are exported as WebP and linked in Measurements.tsx. The drawings are teaching aids; the supplied document does not require drawing or labelling diagrams in Measurements.

## Saved images

- `phys-measurements-tools.webp` — Measuring tools.
- `phys-measurements-parallax.webp` — Parallax error.
- `phys-measurements-zero-error.webp` — Zero error.
- `phys-measurements-meniscus.webp` — Reading the meniscus.
- `phys-measurements-displacement.webp` — Displacement.
- `phys-measurements-small-objects.webp` — Small-object thickness.
- `phys-measurements-vernier.webp` — Vernier callipers.
- `phys-measurements-density.webp` — Density.
- `phys-measurements-current-voltage.webp` — Current and voltage.

## Checks

- All nine images are individual landscape raster assets and fit desktop and mobile viewports.
- The tools image includes the metre rule, thermometer, balance, stopwatch, measuring cylinder, overflow can, mechanical vernier callipers, ammeter and voltmeter.
- Zero error: +2.0 g is subtracted from 52.0 g, yielding 50.0 g.
- Displacement: the object is fully submerged; volume rises from 30 to 50 cm³, giving 20 cm³.
- Meniscus: the eye and sight line are at the bottom of the concave water surface. No exact numerical reading is claimed for that illustration.
- Small thickness: 100 sheets total 20 mm, so average thickness is 0.20 mm.
- Vernier: the picture identifies the mechanical parts. The separate worked example is 24.0 + 0.3 = 24.3 mm. The lesson now uses a 0.02 mm example least count and 15 aligned sub-divisions, matching the instrument type shown.
- Density: 54 g ÷ 20 cm³ = 2.7 g/cm³.
- The final electrical image was checked by tracing each cable: battery positive → ammeter positive → ammeter negative → lamp left; lamp right → battery negative. Voltmeter positive connects to lamp left and negative to lamp right. This makes A series and V parallel.
- Lesson TypeScript and browser checks passed. No SVG illustration is used in the Measurements lesson.

## Final generation prompts

### Measuring tools

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Tools for measurement'. An attractive arranged laboratory workbench view with correctly recognizable instruments, each individually labeled: 'Metre rule — length', 'Thermometer — temperature', 'Balance — mass', 'Stopwatch — time', 'Measuring cylinder — volume', 'Overflow can — displacement', 'Vernier callipers — thickness and diameter', 'Ammeter — current', 'Voltmeter — voltage'. Show a thin string beside a small irregular stone near the overflow can and a clear glass beaker of water. Ammeter face marked A, voltmeter V; these are separate instruments, not multimeters mislabeled. No connecting arrows between independent tools. All nine labels readable, large instruments, rectangular landscape.

### Parallax error

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Parallax error'. Realistic close-up of an analogue pointer instrument, with a scale behind the pointer so they are separated in depth, and THREE illustrated eye positions: above, straight in front, below. Dashed sight lines from all eyes converge on the same pointer then meet the scale at different apparent positions. Label 'Above: wrong view', 'Straight on: correct view', 'Below: wrong view'. Show oblique rays resulting in different readings; do not assign numerical values to them. Mark 'Read straight in front of the pointer'. Keep scientific geometry clear with no misleading duplicate pointer. Use a small perspective cross-section inset if needed. Actual instrument and eyes, clear explanatory artwork.

### Zero error

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Zero error'. A realistic EMPTY electronic laboratory balance, empty pan clearly visible, display exactly '+2.0 g'. Label 'Empty balance should read 0 g'. Beside it a second view of the same balance weighing a sample, display exactly '52.0 g'. Large equation callout 'Corrected mass = 52.0 − 2.0 = 50.0 g'. Footer 'Check or reset zero before measuring'. Sample on second pan only, first pan absolutely empty. No coins added to empty balance, no reversed correction signs, crisp accurate digits.

### Reading the meniscus

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Reading a measuring cylinder'. Realistic clear graduated glass cylinder of water on a level bench. Clearly visible concave meniscus, its lowest point at center. An eye icon at exactly that LOWEST point's height with a horizontal dashed sight line ending at bottom of meniscus. Label 'Eye level', 'Bottom of meniscus', 'Water'. A small magnified callout shows concave surface and arrow pointing to lowest point, not upper edge. No numerical reading exercise or exact volume number: scale ticks can be unnumbered. Footer 'Read the bottom of the curve at eye level'. Large readable labels and realistic glass, no angled reading shown as correct.

### Displacement

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Volume by displacement'. Two identical realistic glass measuring cylinders side by side. LEFT cylinder water only, meniscus labeled 'Initial volume: 30 cm³'; RIGHT cylinder same cylinder with fully submerged irregular stone suspended by thin string, water higher, meniscus labeled 'Final volume: 50 cm³'. The right meniscus must be visibly higher than the left. Use simple unnumbered graduation ticks, and arrows from each volume label point to corresponding lowest meniscus. Stone fully below water, no trapped air. Footer 'Object volume = 50 − 30 = 20 cm³'. Small separate labeled overflow can and collection cylinder as an alternative setup. The overflow can has a spout, object immersed, displaced water collected. No partly submerged object.

### Small-object thickness

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Measuring a small thickness'. A realistic stack of 100 paper sheets with book covers excluded, beside a millimetre ruler. Use a dimension bracket from bottom to top of stack labeled '20 mm', label stack '100 sheets'. Large explanatory box 'Thickness per sheet = 20 mm ÷ 100 = 0.20 mm'. Draw ruler and paper faithfully; ruler numeric labels are not required. At bottom small correctly labeled samples 'Seeds: weigh many together' and 'Pins: measure several similar objects'. Do not confuse pages with sheets. White background, large realistic tools and paper textures.

### Vernier callipers

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Vernier callipers'. One large realistic metal mechanical VERNIER caliper, not digital, diagonally or horizontally displayed against white. Accurately label 'Outside jaws', 'Inside jaws', 'Fixed jaw', 'Sliding jaw', 'Main scale', 'Vernier scale', 'Depth rod'. Arrowheads land on correct parts: larger lower jaws outside, smaller upper jaws inside, depth rod protrudes from right end, vernier short scale on moving slider. Small sample reading box, separate from tool, text 'Example: main scale 24.0 mm', 'Vernier contribution 0.3 mm', 'Total 24.3 mm'. Do not draw a fake enlarged numerical scale; numerical markings on photographed tool incidental, not a worked exercise. Footer 'Check zero and the instrument's least count'. Main objective accurate recognizable physical instrument.

### Density

Use case: scientific-educational. Generate ONE genuine raster landscape image, 1536x1024, in a polished realistic textbook illustration style: realistic glass, metal and instrument details with clear large dark labels, white background and generous margins. No SVG-style flat wireframes, no code, no contact sheet, no watermark. All objects contained in image. Title 'Finding density'. Realistic electronic balance with irregular stone, reading '54 g', paired with realistic water displacement measuring setup with label 'Object volume: 20 cm³'. Large clean formula triangle above right: mass at TOP, density at BOTTOM LEFT, volume at BOTTOM RIGHT, horizontal dividing line below mass, vertical line between density and volume. Below triangle large 'Density = mass ÷ volume', then '54 g ÷ 20 cm³ = 2.7 g/cm³'. Footer 'Use matching units'. No triangle placing volume above mass, no false density 2.8, no invented numbered cylinder reading that conflicts with displacement.

### Current and voltage

Use case: scientific-educational. Generate ONE new realistic textbook photograph-style laboratory image, LANDSCAPE 1536x1024, white background, title 'Measuring current and voltage'. Simplify layout to make wiring scientifically correct. Arrange THREE physical devices in a left-to-right chain: BATTERY on far left, ANALOGUE AMMETER in middle, SMALL LAMP on right. Put an ANALOGUE VOLTMETER directly ABOVE the lamp. Every connection visible with cables spaced apart, no crossing junctions. Main series circuit must be EXACTLY: battery positive terminal → ammeter positive terminal → ammeter internal mechanism → ammeter negative terminal → lamp LEFT terminal → lamp filament → lamp RIGHT terminal → battery negative terminal. Main return wire from lamp right to battery negative runs along the VERY BOTTOM of the image, apart from the other cables. Two voltmeter leads connect only to lamp terminals: voltmeter positive to lamp LEFT, voltmeter negative to lamp RIGHT. No direct battery positive-to-lamp lead. No ammeter across the lamp. This has FIVE separate connecting cables total: battery+ to A+, A- to lampLeft, lampRight to battery-, V+ to lampLeft, V- to lampRight. Label battery 'Low-voltage DC', ammeter 'A — in series', voltmeter 'V — in parallel'. Clearly mark all +/− meter terminals. No device numerical readings needed, avoid decorative arrows. Realistic bench instruments, glass bulb, metal clips, actual coloured insulated wires. Footer 'Current in amperes (A); voltage in volts (V)'. No contact sheet, no watermark.

## Teaching references

- [BIPM: SI base units](https://www.bipm.org/en/measurement-units/si-base-units)
- [RSC: making measurements](https://edu.rsc.org/cpd/making-measurements-teaching-practical-science/3009329.article)
- [RSC: measuring density](https://edu.rsc.org/experiments/measuring-density/524.article)

