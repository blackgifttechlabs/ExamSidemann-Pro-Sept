# Yippie maths — image brief and generation prompts

Every picture the ten maths games can use, with the **exact file name to save it
as** and a **complete, self-contained prompt**. Each prompt below already has the
style, palette and do-not-include rules built into it, so you can copy one
blockquote into a brand-new image-generator chat with no other context and it
will come out on-model.

## The most important thing

**Every one of these images is optional.** Each game draws its own scene in code
and puts the emoji stand-in on screen for every object, then lays your artwork
over the top when the file exists. So:

- nothing breaks while a picture is missing — the game is fully playable today;
- pictures can be added one at a time, in any order;
- as soon as a PNG lands in the right folder with the right name it appears. No
  code change, no rebuild of anything else, no list to update.

## Where they go

```
public/images/ecd/maths/topics/<name>.png         the cards on the maths board
public/images/ecd/maths/backgrounds/<name>.png    the scene behind each game
public/images/ecd/maths/characters/<name>.png     Yippies, kitten, Hoppy
public/images/ecd/maths/elements/<name>.png       everything a child taps
```

Create them all in one go:

```bash
mkdir -p public/images/ecd/maths/{topics,backgrounds,characters,elements}
```

## Rules that matter more than they sound

1. **File names are case-sensitive**, all lower-case, hyphen-separated, and must
   match exactly. `star-lit.png`, never `Star-Lit.png` or `star_lit.png`.
2. **Elements and characters must have a genuinely transparent background.**
   Export PNG with alpha. A white background will show as a white square sitting
   on the scene.
3. **Backgrounds must keep their middles empty.** The game pieces are drawn on
   top of the centre; detail there fights witbh them.
4. **No text anywhere, ever.** Where a number appears on a star or a lily pad,
   the game draws it — a number baked into the picture would be wrong half the
   time.
5. **Keep each file under about 300 KB.** Run them through an optimiser
   (`squoosh`, `tinypng`) before committing; there are sixty of them.

## The house style — master reference

Already folded into every prompt below. This copy is only here in case you ever
need to change the wording everywhere at once.

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image.

And the recurring character, also folded in wherever it is needed:

> A Yippie is a small round fluffy creature, about as wide as it is tall, with a soft pastel body (pink, mint, lilac or butter yellow), two big friendly eyes, a tiny smiling mouth, short stubby arms, two little rounded feet, and two soft antenna tufts on top of its head.

---

## Game cards — the pictures on the maths board

Save to `public/images/ecd/maths/topics/`

These are the fourteen cards on `/ecd/maths`. Until a card exists the game's emoji stands in, so the board is never a grid of broken pictures — but a real picture is what a child who cannot read chooses a game with, so these are the ones worth drawing first.

### `present-count.png`

**Used for:** The Present Party card on the maths board

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A pile of three brightly wrapped birthday presents with big ribbon bows, one lid tipping open with a teddy bear and a toy duck peeking out, party bunting strung across the top corners.

### `star-wish.png`

**Used for:** The Wish on the Stars card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A deep blue night sky with five big glowing golden stars in a scattered arc, a crescent moon at the top right, and a small hill silhouette along the bottom edge.

### `trace-numbers.png`

**Used for:** The Trace the Numbers card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A chunky yellow pencil with a friendly face-free plain body, resting on a sheet of cream paper, drawing a thick blue dotted curved line across it.

### `wake-up.png`

**Used for:** The Wake the Sleepy Yippies card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** Three sleeping Yippies curled up together in a soft purple blanket nest, eyes closed, tiny snore puffs above them. A Yippie is a small round fluffy creature, about as wide as it is tall, with a soft pastel body (pink, mint, lilac or butter yellow), two big friendly eyes, a tiny smiling mouth, short stubby arms, two little rounded feet, and two soft antenna tufts on top of its head.

### `subitise.png`

**Used for:** The Quick Eyes card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A friendly ginger kitten peeping out through the open door of a wooden crate-style cage, one paw over the edge, big hopeful eyes.

### `one-more.png`

**Used for:** The Hoppy's River Hop card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A cheerful green cartoon frog mid-jump above a blue river, with three round green lily pads floating below her.

### `count-back.png`

**Used for:** The Rocket Countdown card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A chunky red and white cartoon rocket lifting off a sandy launch pad with a rounded orange flame and two soft smoke puffs beneath it, deep blue starry sky behind.

### `cave-add.png`

**Used for:** The Cave of Glowing Orbs card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** The mouth of a dark blue cave with stalactites, and five round glowing orbs — three cyan, two yellow — floating inside it and lighting the rock.

### `ten-frame.png`

**Used for:** The Fill the Ten Frame card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A wooden tray divided into two rows of five square compartments, with three blue round stones in the top row and two yellow round stones beside them, seen from straight above.

### `above-below.png`

**Used for:** The Above and Below card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A small wooden table seen from the side, with a red balloon floating above it, a green apple sitting on top of it, and a sleepy grey cat curled underneath it.

### `number-drive.png`

**Used for:** The Number Drive card

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A little red cartoon car seen from directly above, driving up a grey road with white dashes, green grass and round trees on both verges.

### `shapes.png`

**Used for:** The Shape Hunt card (game not built yet — the card is drawn greyed out)

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A friendly pile of three chunky flat shapes — a red circle, a blue square and a yellow triangle — stacked and overlapping slightly.

### `sorting.png`

**Used for:** The Sort and Match card (game not built yet)

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** Two open baskets side by side, one holding three red socks and the other holding three blue socks, with one odd sock lying between them.

### `measuring.png`

**Used for:** The Big, Small, Long, Short card (game not built yet)

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One square 800 × 800 illustration on a plain flat white background, the subject centred and filling about 80% of the frame with a clear white margin all round. It is a game's cover picture, so it must read instantly at thumbnail size: one clear subject, big shapes, strong colour, no fine detail. **SUBJECT:** A tall giraffe and a tiny mouse standing side by side next to a chunky wooden ruler standing on its end, showing how different their heights are.

## Backgrounds — one per game

Save to `public/images/ecd/maths/backgrounds/`

Each of these is laid over a version of the same scene already drawn in code, so a missing background is invisible rather than broken. **Keep the middle empty.** Everything a child taps sits on top of the centre of these pictures.

### `party-room.png`

**Used for:** Behind Present Party

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A cheerful indoor party room: pale pink walls, colourful triangular bunting strung across the top edge, a warm honey-coloured wooden floor along the bottom quarter, a few balloons tied in the bottom left and bottom right corners.

### `night-sky.png`

**Used for:** Behind Wish on the Stars

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A deep indigo-to-violet night sky full of tiny far-off stars, a large pale crescent moon in the top right corner, and dark blue rolling hill silhouettes along the bottom edge only.

### `farm-desk.png`

**Used for:** Behind Trace the Numbers

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A sunny farm field: bright blue sky with two soft white clouds in the top corners, a warm yellow sun in the top left, rolling green grass filling the bottom third, small flowers and a low wooden fence along the very bottom edge.

### `yippie-nest.png`

**Used for:** Behind Wake the Sleepy Yippies

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A cosy moonlit bedroom scene: soft purple night sky with small stars at the top, a big pale moon in the top left, and a huge mound of lilac and violet blankets and pillows filling the bottom half like a giant nest.

### `cat-shelter.png`

**Used for:** Behind Quick Eyes

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** The inside of a bright, friendly animal shelter: pale turquoise walls with faint white paw prints in the upper corners, a warm wooden floor across the bottom quarter, a small water bowl and a rolled ball of yarn in the bottom corners.

### `river.png`

**Used for:** Behind Hoppy's River Hop

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A summer river seen from slightly above: blue sky along the top, a green grassy bank across the upper third, a wide blue river with gentle ripple lines filling the middle and bottom, tall reeds only in the bottom left and bottom right corners.

### `launch-pad.png`

**Used for:** Behind Rocket Countdown

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A desert rocket launch site at dusk: deep blue starry sky at the top fading to warm orange along the horizon, flat sandy ground across the bottom fifth, a grey metal gantry tower standing at the far right edge only.

### `cave.png`

**Used for:** Behind Cave of Glowing Orbs

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** The inside of a friendly cartoon crystal cave: dark blue-violet rock, pointed stalactites hanging from the top edge, two rock ledges at the far left and far right, a still dark pool along the bottom edge, faint magical glow in the air.

### `stone-table.png`

**Used for:** Behind Fill the Ten Frame

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A bright classroom corner: mint green wall across the top two thirds, a warm wooden table top filling the bottom third seen from straight on, a glass jar of blue and yellow round counters standing in the bottom right corner.

### `play-room.png`

**Used for:** Behind Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single background scene, 1920 × 1200 px, 16:10 landscape, drawn right to the edges with no border or frame. The whole middle of the picture must stay calm, open and uncluttered — the game pieces are drawn on top of it — so keep every piece of detail in the outer third, the top edge and the bottom edge. No characters and no loose objects anywhere in the centre. **SUBJECT:** A sunny child's playroom: warm cream and peach walls, a bright window with a blue sky outside in the top left, a wooden floor across the bottom fifth, a small rug in the bottom right corner. The centre of the wall is completely empty.

## Characters

Save to `public/images/ecd/maths/characters/`

Transparent PNGs. Each is drawn over its emoji stand-in, so it must have a fully transparent background — anything opaque behind the character will look like a sticker on the scene.

### `yippie-asleep.png`

**Used for:** Every sleeping creature in Wake the Sleepy Yippies

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single character, centred, facing the viewer, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no props beyond what is described. **SUBJECT:** A Yippie fast asleep, sitting curled up with its eyes closed in two happy arcs, a tiny smile, its head tipped to one side and a small blanket over its feet. A Yippie is a small round fluffy creature, about as wide as it is tall, with a soft pastel body (pink, mint, lilac or butter yellow), two big friendly eyes, a tiny smiling mouth, short stubby arms, two little rounded feet, and two soft antenna tufts on top of its head. Make this one soft mint green.

### `yippie-awake.png`

**Used for:** A woken creature in Wake the Sleepy Yippies

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single character, centred, facing the viewer, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no props beyond what is described. **SUBJECT:** The same Yippie wide awake and delighted: eyes wide open and bright, big happy open smile, both stubby arms thrown up in the air, antenna tufts standing up. A Yippie is a small round fluffy creature, about as wide as it is tall, with a soft pastel body (pink, mint, lilac or butter yellow), two big friendly eyes, a tiny smiling mouth, short stubby arms, two little rounded feet, and two soft antenna tufts on top of its head. Make this one soft mint green, exactly the same creature as the sleeping one.

### `kitten-caged.png`

**Used for:** The kitten waiting in Quick Eyes

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single character, centred, facing the viewer, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no props beyond what is described. **SUBJECT:** A small ginger kitten sitting patiently with its tail curled around its paws, looking up hopefully at the viewer, ears slightly back. Sweet and calm, never sad or frightened.

### `kitten-free.png`

**Used for:** The freed kitten in Quick Eyes

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single character, centred, facing the viewer, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no props beyond what is described. **SUBJECT:** The same small ginger kitten, now delighted and free: front paws lifted, tail straight up, eyes closed in a happy squint, mouth open in a joyful meow.

### `hoppy.png`

**Used for:** The frog crossing the river in Hoppy's River Hop

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single character, centred, facing the viewer, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no props beyond what is described. **SUBJECT:** Hoppy the frog: a cheerful bright green cartoon frog sitting upright, big round friendly eyes on top of her head, a wide smile, cream tummy, strong back legs ready to jump.

## Elements — the things a child touches

Save to `public/images/ecd/maths/elements/`

Transparent PNGs, square, all of them things the child taps. Several of these have a numeral printed over the top by the game — the star, the lily pad — so their middles must stay plain.

### `present-closed.png`

**Used for:** The unopened box in Present Party

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One closed birthday present: a bright pink cube-shaped box with a wide yellow ribbon crossing it and a big soft bow on top.

### `duck.png`

**Used for:** The toy counted in Present Party round 1

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One yellow rubber bath duck with an orange beak, seen from the side.

### `teddy.png`

**Used for:** Counted in Present Party; also the teddy on the chair in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One soft brown teddy bear sitting upright with a cream muzzle, round ears and stubby arms out to the sides.

### `ball.png`

**Used for:** Counted in Present Party; also the ball under the chair in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One classic round football with black and white panels.

### `car.png`

**Used for:** Counted in Present Party round 4

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One chunky red toy car seen from the side, with big black wheels and a bright blue window.

### `cupcake.png`

**Used for:** Counted in Present Party round 5

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One cupcake in a pink paper case with a tall swirl of cream frosting and a single red cherry on top.

### `drum.png`

**Used for:** Counted in Present Party round 6

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small toy drum with a red and yellow striped body, a cream skin and two crossed drumsticks resting on top.

### `star-lit.png`

**Used for:** A star already counted in Wish on the Stars. A numeral is drawn over the middle of this picture by the game, so keep the centre of the star clear, plain and flat.

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One five-pointed star, bright golden yellow, glowing with a warm halo of light around it and a few small sparkles at its points.

### `star-dim.png`

**Used for:** A star not yet counted in Wish on the Stars. Same shape and size as `star-lit.png`; a numeral is drawn over the middle, so keep the centre clear and flat.

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One five-pointed star, pale and dim, in soft dusty grey-blue, with no glow — the same star shape as the bright one but not yet lit.

### `lily-pad.png`

**Used for:** The pads Hoppy jumps between. A numeral is drawn over the middle, so keep the centre clear and flat.

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One round green lily pad floating flat on water, seen from slightly above, with the classic single notch cut into one side and a lighter green rim.

### `rocket.png`

**Used for:** The rocket that climbs the sky in Rocket Countdown

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One chunky cartoon rocket standing upright, pointing straight up: a white body with a red nose cone, three red fins, a round porthole window, and a rounded orange and yellow flame coming out of the bottom.

### `table.png`

**Used for:** The furniture in two Above and Below rounds

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small wooden table seen straight from the side, with a flat top and four legs, in warm honey-coloured wood.

### `chair.png`

**Used for:** The furniture in one Above and Below round

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small wooden chair seen straight from the side, with a tall back, a flat seat and four legs, in warm honey-coloured wood.

### `shelf.png`

**Used for:** The furniture in two Above and Below rounds

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One simple wooden wall shelf seen straight from the side: a single flat plank with two small brackets underneath.

### `box.png`

**Used for:** The furniture in one Above and Below round

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One cardboard box seen from the side with its flaps closed, in warm brown card with a lighter tape line down the middle.

### `balloon.png`

**Used for:** The thing above the table in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One red party balloon with a short curly string hanging beneath it.

### `apple.png`

**Used for:** The thing on the table in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One shiny red apple with a short brown stalk and one green leaf.

### `cat.png`

**Used for:** The thing under the table in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One grey tabby cat curled up asleep in a circle, eyes closed, tail wrapped around its body.

### `butterfly.png`

**Used for:** The thing above the table in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One butterfly seen from above with wings spread, in orange and yellow with simple dark markings.

### `cake.png`

**Used for:** The thing on the table in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One slice of birthday cake on a small white plate, with cream sponge, a pink frosting layer and a strawberry on top.

### `dog.png`

**Used for:** The thing under the table in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small brown puppy sitting upright, floppy ears, happy open mouth, tail curled to one side.

### `bird.png`

**Used for:** The thing above the shelf in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small white dove flying with its wings spread wide, seen from the side.

### `chick.png`

**Used for:** The thing on the box in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One fluffy yellow chick standing upright with tiny orange feet and a small orange beak.

### `books.png`

**Used for:** The thing on the shelf in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** A neat stack of three closed hardback books, one red, one blue and one green, seen from the side.

### `socks.png`

**Used for:** The thing under the shelf in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One pair of striped socks, red and white, folded together in a soft heap.

### `kite.png`

**Used for:** The thing above the box in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One diamond kite in bright blue and yellow, with a long tail of small ribbon bows curling beneath it.

### `mouse.png`

**Used for:** The thing under the box in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small grey mouse standing on all fours, big round ears, tiny pink nose, long thin tail.

### `cloud.png`

**Used for:** The thing above the chair in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One soft white fluffy cloud, plump and rounded, the kind drawn in a picture book.

### `moon.png`

**Used for:** The thing above the shelf in the night-time Above and Below round

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One pale golden crescent moon with a gentle glow around it.

### `plant.png`

**Used for:** The thing on the shelf in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One small green houseplant in a terracotta pot, with four or five broad rounded leaves.

### `boots.png`

**Used for:** The thing under the shelf in Above and Below

> **STYLE:** Bright modern children's-app cartoon illustration for a learning game aimed at three to six year olds. Bold clean outlines, flat vibrant colours, soft simple one-step shading, big friendly rounded shapes, generous chunky proportions. Cheerful and warm. No photorealism, no 3D render, no watercolour or pencil texture, no gritty detail, nothing scary, sad, dark or sharp. **PALETTE (internal colour reference only — never print colour names or hex codes in the picture):** sky blue (#3fd0f7), deep blue (#2f2fbe), grass green (#4fb63a), leaf green (#12b45c), sunny yellow (#ffd54a), orange (#ff9f1c), pink (#ff8fa3), magenta (#e05fbd), purple (#8a6bd1), cream (#fffaf0), warm brown (#c98a4b). **DO NOT INCLUDE:** any text, letters, numbers, words, digits, watermarks, signatures, logos, borders, frames, buttons, user-interface elements, speech bubbles, arrows, or any writing of any kind anywhere in the image. **FORMAT:** One single object, centred, filling about 85% of a square 512 × 512 canvas, on a fully transparent background (PNG with alpha). Nothing else in frame — no ground, no shadow cast onto a surface, no backdrop, no scenery, no second object. **SUBJECT:** One pair of yellow rubber wellington boots standing side by side.

---

## The count

| Folder | Files |
|---|---|
| `topics/` | 14 |
| `backgrounds/` | 10 |
| `characters/` | 5 |
| `elements/` | 31 |
| **Total** | **60** |

## Checking your work

Run the site and open `/ecd/maths`, then play each game. Anything still showing
as an emoji has no file yet, or the name does not match. The paths the code
looks for are written in the game files under `src/features/ecd/maths/` — search
for `/images/ecd/maths/` to see every one of them in place.

Sound and voice for the same games are in `docs/ECD_MATHS_SOUND_ASSETS.md` and
`docs/ECD_MATHS_VOICE_SCRIPTS.md`.
