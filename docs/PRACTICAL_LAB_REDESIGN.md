# Practical lab redesign

The 46 O-level practicals have experiment-owned rooms or an outdoor range, apparatus and control modules. The shared first-person experience wrapper and unused shared laboratory environments were removed. Each desktop practical uses a right-hand guide with a current instruction, relevant controls and a primary step action. Mobile practicals retain their compact controls. See runs the demonstration; Learn returns to interaction.

All 46 practicals now use experiment-owned presentation settings. The 45 enclosed labs use darker wall and floor finishes, architectural trim and focused bench lighting; the projectile range retains outdoor lighting with subdued surroundings. Obstructive floating captions move into an expandable label list in the sidebar. Opening the list reveals small numbered scene markers; closing it clears them. Instrument graduations, unit symbols and interactive apparatus controls remain visible. Pale glass shells use transmission with full material opacity to avoid fading twice.

The 34 physics, biology and chemistry practicals have individual room, lighting, reflection and camera settings. Combined-science rooms were enlarged individually, with camera distances capped inside their walls. Projectile motion uses its own enlarged outdoor range. The force/ticker-tape wall posters and experiment-goal cards were removed.

Physics corrections include nonlinear pendulum and centre-of-gravity motion, contact-time momentum conservation, incline travel timing, viscous terminal velocity, Joule heating, heat-loss and latent-heat accounting, loaded potential-divider endpoints, thermal expansion and magnetic field tracing. Biology corrections include mass/volume osmosis geometry, finite-substrate enzyme reactions, diffusion scaling and transpiration measurements. Chemistry corrections include capillary solvent-front motion, diluted acid/base charge balance, indicator endpoints, gas evolution and precipitate settling.

These are instructional simulations. Reaction constants and material properties are representative, and simplified models do not replace experimental measurements. The projectile model assumes negligible air resistance.

Validation:

- `node scripts/verifyPracticalModels.mjs`: 840 numerical checks, 34 independent implementations and 362,637 camera positions within 33 enclosed rooms.
- TypeScript syntax validation across all O-level practical files and a scoped TypeScript check of practicals with their dependencies.
- The full application check reports an unrelated existing icon-prop type error in `src/features/dashboard/StudentProfileHub.tsx:689`.
- Browser checks: all 46 desktop practicals expose working See/Learn controls without horizontal overflow. Seven representative scenes render successfully; Pendulum, Hooke’s law and force/motion step transitions were exercised. Phone and landscape checks are recorded under `artifacts/science-lab/review`.

Experiment-owned code remains separate; framework components for paper views, narration, tutorials and mobile drawers remain reusable application infrastructure.
