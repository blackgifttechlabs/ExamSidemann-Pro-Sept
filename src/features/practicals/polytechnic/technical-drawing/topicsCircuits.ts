/**
 * Circuit diagrams for the motor vehicle trades: hydraulic power steering,
 * power brakes, a tipping body, a heavy vehicle air brake system, and basic
 * auto-electrical wiring.
 *
 * A circuit diagram says what is connected to what. It is not a picture of the
 * lorry, so the pump is drawn the same size as the valve, and the line between
 * two components tells you nothing about how long the pipe is. What it must get
 * right is the symbols, the order of the components round the circuit, and
 * which lines are working lines and which are pilot or return.
 */

import {
  battery,
  coil,
  cylinder,
  earth,
  filter,
  flowArrow,
  fuse,
  lamp,
  pipe,
  pump,
  ramCylinder,
  receiver,
  reliefValve,
  reservoir,
  switchSymbol,
  valve,
  valveBlocked,
  valveCrossed,
  valveThrough,
} from './drawingCircuitSymbols';
import { pt, type Mark } from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

const label = (x: number, y: number, text: string, size = 2.8): Mark => ({
  kind: 'text',
  at: pt(x, y),
  text,
  size,
  align: 'center',
});

/* ========================================================================= 41
 * Hydraulic power steering
 * ======================================================================= */

const PS_TANK = pt(60, 210);
const PS_PUMP = pt(95, 180);
const PS_VALVE = pt(150, 100);
const PS_RAM = pt(230, 140);

const POWER_STEERING: DrawTopic = {
  id: 'hydraulic-power-steering',
  title: 'Hydraulic power steering',
  subtitle: 'Pump, control valve and ram — the circuit that turns the wheels for you.',
  goal: 'Draw the hydraulic circuit of a power steering system with the correct symbols, and trace the oil from the reservoir to the ram and back.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'HB pencil'],
  base: preparedSheet('HYDRAULIC CIRCUIT — POWER STEERING', '41'),
  steps: [
    {
      id: 'ps-idea',
      title: 'What the driver is really doing',
      tool: 'hand',
      focus: { at: pt(180, 150), r: 220 },
      tip: 'In power steering the driver does not turn the wheels — the driver opens a valve.',
      lines: [
        { text: 'On a heavy vehicle the driver cannot turn the front wheels by hand.' },
        { text: 'So the driver does not turn them. The driver opens a valve.' },
        { text: 'The valve lets pump pressure into one side of a ram.' },
        { text: 'The ram turns the wheels. The steering wheel only tells it which way.' },
        { text: 'Four things in the circuit: tank, pump, control valve, ram.' },
      ],
      marks: [],
    },
    {
      id: 'ps-tank-pump',
      title: 'Tank and pump first',
      tool: 'pencil',
      focus: { at: pt(90, 195), r: 90 },
      tip: 'Every hydraulic circuit starts at the reservoir. Draw it at the bottom of the sheet.',
      lines: [
        { text: 'Start at the reservoir, at the bottom of the sheet. Always.' },
        { text: 'An open box. Oil sits in it and it is not under pressure.', at: PS_TANK },
        { text: 'A strainer on the suction line, so grit never reaches the pump.' },
        { text: 'Then the pump — a circle with a solid triangle pointing out.', at: PS_PUMP },
        { text: 'The triangle points the way the oil leaves. That is the delivery side.' },
      ],
      marks: [
        ...reservoir(PS_TANK, 46, 18),
        ...filter(pt(PS_TANK.x + 23, PS_TANK.y - 14), 7),
        pipe([pt(PS_TANK.x + 23, PS_TANK.y + 4), pt(PS_TANK.x + 23, PS_TANK.y - 7)]),
        pipe([pt(PS_TANK.x + 23, PS_TANK.y - 21), pt(PS_TANK.x + 23, PS_PUMP.y), pt(PS_PUMP.x - 10, PS_PUMP.y)]),
        ...pump(PS_PUMP, 10, 90),
        label(PS_TANK.x + 23, PS_TANK.y + 28, 'RESERVOIR'),
        label(PS_PUMP.x + 24, PS_PUMP.y + 2, 'PUMP'),
      ],
    },
    {
      id: 'ps-relief',
      title: 'The relief valve',
      tool: 'pencil',
      focus: { at: pt(112, 148), r: 70 },
      tip: 'A pump cannot be stalled. Without a relief valve, something bursts.',
      lines: [
        { text: 'The pump runs whenever the engine runs.' },
        { text: 'If the steering is straight ahead, the oil has nowhere to go.' },
        { text: 'So we fit a relief valve straight after the pump.', at: pt(112, 148) },
        { text: 'It is held shut by a spring. Past its setting, it opens and dumps oil back to tank.' },
        { text: 'No relief valve, and either a pipe bursts or the pump does.' },
      ],
      marks: [
        pipe([pt(PS_PUMP.x, PS_PUMP.y - 10), pt(PS_PUMP.x, 150)]),
        ...reliefValve(pt(104, 140), 18),
        pipe([pt(104, 149), pt(84, 149), pt(84, PS_TANK.y - 2)], 'thin'),
        label(140, 132, 'RELIEF VALVE'),
      ],
    },
    {
      id: 'ps-valve',
      title: 'The control valve',
      tool: 'pencil',
      focus: { at: pt(PS_VALVE.x + 33, PS_VALVE.y + 11), r: 90 },
      tip: 'Three positions: left, straight ahead and right. Straight ahead, both ram ports are blocked.',
      lines: [
        { text: 'Now the valve the steering wheel operates.' },
        { text: 'Three boxes, because it has three positions.', at: pt(PS_VALVE.x + 33, PS_VALVE.y + 11) },
        { text: 'Left box: oil to one end of the ram. Right box: oil to the other end.' },
        { text: 'Middle box: both ram ports blocked, and the wheels stay where they are.' },
        { text: 'The box that is lined up with the pipes is the position it is in.' },
      ],
      marks: [
        ...valve(PS_VALVE, 3, 22),
        ...valveCrossed(PS_VALVE, 22),
        ...valveBlocked(pt(PS_VALVE.x + 22, PS_VALVE.y), 22),
        ...valveThrough(pt(PS_VALVE.x + 44, PS_VALVE.y), 22),
        pipe([pt(PS_PUMP.x, 150), pt(PS_PUMP.x, PS_VALVE.y + 11), pt(PS_VALVE.x, PS_VALVE.y + 11)]),
        flowArrow(pt(PS_VALVE.x - 3, PS_VALVE.y + 11), 0, 3.4),
        label(PS_VALVE.x + 33, PS_VALVE.y - 8, 'CONTROL VALVE'),
      ],
    },
    {
      id: 'ps-ram',
      title: 'The ram, and the way home',
      tool: 'pencil',
      focus: { at: pt(PS_RAM.x + 30, PS_RAM.y), r: 100 },
      tip: 'Oil into one end of a double-acting ram must come out of the other — always draw both lines.',
      lines: [
        { text: 'The ram is double acting. Oil can push it either way.' },
        { text: 'Two lines from the valve, one to each end of it.', at: PS_RAM },
        { text: 'Whatever goes into one end has to come out of the other.' },
        { text: 'That returning oil goes back through the valve and down to the tank.' },
        { text: 'Trace it round with your finger. Tank, pump, valve, ram, valve, tank.' },
      ],
      marks: [
        ...cylinder(PS_RAM, 62, 22, 0.45, true),
        pipe([pt(PS_VALVE.x + 66, PS_VALVE.y + 5), pt(PS_RAM.x - 8, PS_VALVE.y + 5), pt(PS_RAM.x - 8, PS_RAM.y + 5), pt(PS_RAM.x, PS_RAM.y + 5)]),
        pipe([pt(PS_VALVE.x + 66, PS_VALVE.y + 17), pt(PS_RAM.x + 74, PS_VALVE.y + 17), pt(PS_RAM.x + 74, PS_RAM.y + 17), pt(PS_RAM.x + 62, PS_RAM.y + 17)]),
        pipe([pt(PS_VALVE.x + 33, PS_VALVE.y + 22), pt(PS_VALVE.x + 33, 232), pt(PS_TANK.x + 40, 232), pt(PS_TANK.x + 40, PS_TANK.y + 2)], 'thin'),
        label(PS_RAM.x + 31, PS_RAM.y + 34, 'STEERING RAM'),
        label(PS_VALVE.x + 60, 236, 'RETURN TO TANK'),
      ],
    },
  ],
};

/* ========================================================================= 42
 * Hydraulic power brakes
 * ======================================================================= */

const PB_TANK = pt(58, 205);
const PB_PUMP = pt(92, 175);
const PB_ACC = pt(150, 90);
const PB_VALVE = pt(160, 150);

const POWER_BRAKES: DrawTopic = {
  id: 'hydraulic-power-brakes',
  title: 'Hydraulic power brakes',
  subtitle: 'Stored pressure, a pedal valve, and a cylinder at every wheel.',
  goal: 'Draw a power-assisted hydraulic brake circuit including the accumulator, and explain why the system still stops the vehicle when the engine dies.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('HYDRAULIC CIRCUIT — POWER BRAKES', '42'),
  steps: [
    {
      id: 'pb-idea',
      title: 'Pressure kept ready',
      tool: 'hand',
      focus: { at: pt(180, 150), r: 220 },
      tip: 'An accumulator stores pressure so the brakes still work for several applications after the engine stops.',
      lines: [
        { text: 'Braking cannot wait for a pump to build pressure.' },
        { text: 'So the pressure is stored up before you need it, in an accumulator.' },
        { text: 'It is a bottle with gas above the oil. Pumping oil in squeezes the gas.' },
        { text: 'Press the pedal and that stored pressure goes straight to the wheels.' },
        { text: 'And if the engine stops, there is still enough in the bottle for several stops.' },
      ],
      marks: [],
    },
    {
      id: 'pb-supply',
      title: 'Tank, pump, accumulator',
      tool: 'pencil',
      focus: { at: pt(120, 150), r: 120 },
      tip: 'The accumulator sits on the pressure line, as close to the brake valve as it can be.',
      lines: [
        { text: 'Reservoir and pump, exactly as on the steering circuit.' },
        { text: 'Then the accumulator, standing on the pressure line.', at: PB_ACC },
        { text: 'Draw it as a capsule — round top, round bottom.' },
        { text: 'It sits as close to the brake valve as the pipework allows.' },
      ],
      marks: [
        ...reservoir(PB_TANK, 44, 18),
        ...filter(pt(PB_TANK.x + 22, PB_TANK.y - 14), 7),
        pipe([pt(PB_TANK.x + 22, PB_TANK.y + 4), pt(PB_TANK.x + 22, PB_TANK.y - 7)]),
        pipe([pt(PB_TANK.x + 22, PB_TANK.y - 21), pt(PB_TANK.x + 22, PB_PUMP.y), pt(PB_PUMP.x - 10, PB_PUMP.y)]),
        ...pump(PB_PUMP, 10, 90),
        pipe([pt(PB_PUMP.x, PB_PUMP.y - 10), pt(PB_PUMP.x, 120), pt(PB_ACC.x, 120), pt(PB_ACC.x, PB_ACC.y + 20)]),
        ...receiver(PB_ACC, 24, 42),
        label(PB_ACC.x, PB_ACC.y - 30, 'ACCUMULATOR'),
        label(PB_TANK.x + 22, PB_TANK.y + 28, 'RESERVOIR'),
        label(PB_PUMP.x - 26, PB_PUMP.y, 'PUMP'),
      ],
    },
    {
      id: 'pb-valve',
      title: 'The pedal valve',
      tool: 'pencil',
      focus: { at: pt(PB_VALVE.x + 22, PB_VALVE.y + 11), r: 80 },
      tip: 'The brake valve is proportional: the harder the pedal is pressed, the more pressure it passes.',
      lines: [
        { text: 'The brake pedal works a valve, not the brakes themselves.' },
        { text: 'Two positions. Off, and applying.', at: pt(PB_VALVE.x + 22, PB_VALVE.y + 11) },
        { text: 'But it is not just on or off. The harder you press, the more it lets through.' },
        { text: 'That is why you can brake gently as well as hard.' },
        { text: 'Let the pedal go and it opens the wheel cylinders back to the tank.' },
      ],
      marks: [
        ...valve(PB_VALVE, 2, 22),
        ...valveBlocked(PB_VALVE, 22),
        ...valveThrough(pt(PB_VALVE.x + 22, PB_VALVE.y), 22),
        pipe([pt(PB_ACC.x, PB_ACC.y + 21), pt(PB_ACC.x, PB_VALVE.y + 11), pt(PB_VALVE.x, PB_VALVE.y + 11)]),
        label(PB_VALVE.x + 22, PB_VALVE.y - 8, 'BRAKE VALVE'),
      ],
    },
    {
      id: 'pb-wheels',
      title: 'A cylinder at every wheel',
      tool: 'pencil',
      focus: { at: pt(290, 150), r: 110 },
      tip: 'Front and rear circuits are kept separate, so one burst pipe cannot take all the brakes away.',
      lines: [
        { text: 'From the valve the line splits to the wheel cylinders.' },
        { text: 'Each one pushes the shoes or the pads against the drum or the disc.' },
        { text: 'Notice there are two circuits, front and rear.', at: pt(300, 130) },
        { text: 'Split like that, one burst pipe cannot take all your brakes away.' },
        { text: 'That is a legal requirement, not a nice idea.' },
      ],
      marks: [
        pipe([pt(PB_VALVE.x + 44, PB_VALVE.y + 11), pt(270, PB_VALVE.y + 11)]),
        pipe([pt(270, PB_VALVE.y + 11), pt(270, 118), pt(300, 118)]),
        pipe([pt(270, PB_VALVE.y + 11), pt(270, 190), pt(300, 190)]),
        ...cylinder(pt(300, 110), 34, 16, 0.4, true),
        ...cylinder(pt(300, 182), 34, 16, 0.4, true),
        label(330, 104, 'FRONT BRAKES'),
        label(330, 208, 'REAR BRAKES'),
        pipe([pt(PB_VALVE.x + 22, PB_VALVE.y + 22), pt(PB_VALVE.x + 22, 236), pt(PB_TANK.x + 38, 236), pt(PB_TANK.x + 38, PB_TANK.y + 2)], 'thin'),
      ],
    },
  ],
};

/* ========================================================================= 43
 * Tipping mechanism
 * ======================================================================= */

const TIP_TANK = pt(60, 215);
const TIP_PUMP = pt(96, 186);
const TIP_VALVE = pt(150, 140);
const TIP_RAM = pt(280, 205);

const TIPPING: DrawTopic = {
  id: 'hydraulic-tipping',
  title: 'Hydraulic tipping mechanisms',
  subtitle: 'One ram, one lever, and gravity doing the work on the way down.',
  goal: 'Draw the hydraulic circuit of a tipping body, show why the ram is single acting, and include the holding position that stops the body halfway.',
  minutes: 30,
  level: 'Core',
  tools: ['T-square', 'HB pencil'],
  base: preparedSheet('HYDRAULIC CIRCUIT — TIPPING GEAR', '43'),
  steps: [
    {
      id: 'tip-idea',
      title: 'Up under power, down under its own weight',
      tool: 'hand',
      focus: { at: pt(190, 150), r: 220 },
      tip: 'A tipping ram is single acting: oil raises it, and the weight of the body lowers it.',
      lines: [
        { text: 'A tipper body only needs power in one direction. Up.' },
        { text: 'Coming down it has gravity, and a loaded body is heavy enough.' },
        { text: 'So the ram is single acting. Oil goes in one end only.' },
        { text: 'To lower it, you simply let that oil run back to the tank.' },
        { text: 'One pipe to the ram, not two. That is the difference from the steering circuit.' },
      ],
      marks: [],
    },
    {
      id: 'tip-supply',
      title: 'Tank, pump, relief',
      tool: 'pencil',
      focus: { at: pt(110, 190), r: 110 },
      tip: 'The pump is driven off the gearbox power take-off, so it only runs when the driver engages it.',
      lines: [
        { text: 'Reservoir, strainer, pump. The same start as always.' },
        { text: 'This pump is driven off the gearbox, from the power take-off.' },
        { text: 'So it only turns when the driver engages the P T O.' },
        { text: 'Relief valve after it, because the ram will reach the end of its stroke.' },
      ],
      marks: [
        ...reservoir(TIP_TANK, 46, 18),
        ...filter(pt(TIP_TANK.x + 23, TIP_TANK.y - 14), 7),
        pipe([pt(TIP_TANK.x + 23, TIP_TANK.y + 4), pt(TIP_TANK.x + 23, TIP_TANK.y - 7)]),
        pipe([pt(TIP_TANK.x + 23, TIP_TANK.y - 21), pt(TIP_TANK.x + 23, TIP_PUMP.y), pt(TIP_PUMP.x - 10, TIP_PUMP.y)]),
        ...pump(TIP_PUMP, 10, 90),
        ...reliefValve(pt(112, 170), 18),
        pipe([pt(112, 179), pt(84, 179), pt(84, TIP_TANK.y - 2)], 'thin'),
        label(TIP_TANK.x + 23, TIP_TANK.y + 28, 'RESERVOIR'),
        label(TIP_PUMP.x - 24, TIP_PUMP.y - 14, 'PTO PUMP'),
      ],
    },
    {
      id: 'tip-valve',
      title: 'Raise, hold, lower',
      tool: 'pencil',
      focus: { at: pt(TIP_VALVE.x + 33, TIP_VALVE.y + 11), r: 90 },
      tip: 'The middle position blocks the ram line, which is what lets the body be stopped part way up.',
      lines: [
        { text: 'The lever in the cab has three positions.' },
        { text: 'Raise: pump straight to the ram.', at: TIP_VALVE },
        { text: 'Hold: the ram line blocked, so the body stops wherever it is.' },
        { text: 'Lower: the ram line opened back to tank.' },
        { text: 'The hold position is the important one. Without it you cannot tip a half load.' },
      ],
      marks: [
        ...valve(TIP_VALVE, 3, 22),
        ...valveThrough(TIP_VALVE, 22),
        ...valveBlocked(pt(TIP_VALVE.x + 22, TIP_VALVE.y), 22),
        ...valveCrossed(pt(TIP_VALVE.x + 44, TIP_VALVE.y), 22),
        pipe([pt(TIP_PUMP.x, TIP_PUMP.y - 10), pt(TIP_PUMP.x, TIP_VALVE.y + 11), pt(TIP_VALVE.x, TIP_VALVE.y + 11)]),
        flowArrow(pt(TIP_VALVE.x - 3, TIP_VALVE.y + 11), 0, 3.4),
        label(TIP_VALVE.x + 33, TIP_VALVE.y - 8, 'TIPPING VALVE'),
        label(TIP_VALVE.x + 11, TIP_VALVE.y + 30, 'RAISE'),
        label(TIP_VALVE.x + 33, TIP_VALVE.y + 30, 'HOLD'),
        label(TIP_VALVE.x + 55, TIP_VALVE.y + 30, 'LOWER'),
      ],
    },
    {
      id: 'tip-ram',
      title: 'The ram under the body',
      tool: 'pencil',
      focus: { at: pt(TIP_RAM.x, TIP_RAM.y - 40), r: 110 },
      tip: 'One pipe to a single acting ram, and the same pipe carries the oil back on the way down.',
      lines: [
        { text: 'One pipe up to the ram, and that is all it gets.' },
        { text: 'Oil in, and the body goes up.', at: pt(TIP_RAM.x, TIP_RAM.y - 40) },
        { text: 'Put the lever to lower and the same pipe carries it back to the tank.' },
        { text: 'Notice how slowly a loaded body should come down. That is the valve, throttling it.' },
      ],
      marks: [
        ...ramCylinder(TIP_RAM, 66, 22, 0.45),
        pipe([pt(TIP_VALVE.x + 66, TIP_VALVE.y + 11), pt(TIP_RAM.x, TIP_VALVE.y + 11), pt(TIP_RAM.x, TIP_RAM.y)]),
        pipe([pt(TIP_VALVE.x + 33, TIP_VALVE.y + 22), pt(TIP_VALVE.x + 33, 240), pt(TIP_TANK.x + 40, 240), pt(TIP_TANK.x + 40, TIP_TANK.y + 2)], 'thin'),
        label(TIP_RAM.x + 34, TIP_RAM.y - 30, 'TIPPING RAM'),
      ],
    },
  ],
};

/* ========================================================================= 44
 * Air brakes
 * ======================================================================= */

const AB_COMP = pt(70, 190);
const AB_TANK = pt(150, 190);
const AB_VALVE = pt(215, 150);

const AIR_BRAKES: DrawTopic = {
  id: 'pneumatic-air-brakes',
  title: 'Heavy vehicle air brakes',
  subtitle: 'Compressor, reservoirs, brake valve and chambers — and the spring brake.',
  goal: 'Draw a heavy vehicle air brake circuit, name each component, and explain why a burst air line puts the brakes on instead of taking them off.',
  minutes: 35,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('PNEUMATIC CIRCUIT — AIR BRAKES', '44'),
  steps: [
    {
      id: 'ab-idea',
      title: 'Air, not oil',
      tool: 'hand',
      focus: { at: pt(190, 150), r: 220 },
      tip: 'Air can be stored and it is free — but it is springy, so an air system is slower to respond than oil.',
      lines: [
        { text: 'A big lorry brakes on air, not oil.' },
        { text: 'Air is free, you can store a lot of it, and a leak makes no mess.' },
        { text: 'But air is springy. Squeeze it and it squashes.' },
        { text: 'That is why air brakes take a moment to come on and let go with a hiss.' },
        { text: 'And it is why the reservoirs have to be big.' },
      ],
      marks: [],
    },
    {
      id: 'ab-supply',
      title: 'Compressor and reservoirs',
      tool: 'pencil',
      focus: { at: pt(120, 185), r: 110 },
      tip: 'The unloader valve stops the compressor pumping once the reservoirs are up to pressure.',
      lines: [
        { text: 'The compressor is driven by the engine, all the time it runs.' },
        { text: 'It fills the reservoirs.', at: AB_TANK },
        { text: 'When they are full, an unloader valve lets it pump to atmosphere instead.' },
        { text: 'Wet tank first, to catch the water. Then the dry tanks for the brakes.' },
        { text: 'Drain the wet tank every day. Water in the lines freezes and the brakes stay on.' },
      ],
      marks: [
        ...pump(AB_COMP, 11, 0),
        ...receiver(AB_TANK, 26, 44),
        ...receiver(pt(AB_TANK.x + 42, AB_TANK.y), 26, 44),
        pipe([pt(AB_COMP.x + 11, AB_COMP.y), pt(AB_TANK.x - 13, AB_TANK.y)]),
        pipe([pt(AB_TANK.x + 13, AB_TANK.y), pt(AB_TANK.x + 29, AB_TANK.y)]),
        flowArrow(pt(AB_TANK.x - 15, AB_TANK.y), 0, 3.4),
        label(AB_COMP.x, AB_COMP.y + 22, 'COMPRESSOR'),
        label(AB_TANK.x, AB_TANK.y + 32, 'WET TANK'),
        label(AB_TANK.x + 42, AB_TANK.y + 32, 'DRY TANK'),
      ],
    },
    {
      id: 'ab-valve',
      title: 'The foot valve',
      tool: 'pencil',
      focus: { at: pt(AB_VALVE.x + 22, AB_VALVE.y + 11), r: 80 },
      tip: 'The foot valve meters air to the chambers in proportion to how hard the pedal is pressed.',
      lines: [
        { text: 'The pedal works a foot valve, the same idea as the hydraulic brake valve.' },
        { text: 'Press it and air goes from the tanks to the brake chambers.', at: AB_VALVE },
        { text: 'Let it go and the chambers are opened to atmosphere.' },
        { text: 'That is the hiss you hear at every bus stop.' },
      ],
      marks: [
        ...valve(AB_VALVE, 2, 22),
        ...valveBlocked(AB_VALVE, 22),
        ...valveThrough(pt(AB_VALVE.x + 22, AB_VALVE.y), 22),
        pipe([pt(AB_TANK.x + 55, AB_TANK.y), pt(AB_VALVE.x - 10, AB_TANK.y), pt(AB_VALVE.x - 10, AB_VALVE.y + 11), pt(AB_VALVE.x, AB_VALVE.y + 11)]),
        label(AB_VALVE.x + 22, AB_VALVE.y - 8, 'FOOT VALVE'),
      ],
    },
    {
      id: 'ab-chambers',
      title: 'Brake chambers',
      tool: 'pencil',
      focus: { at: pt(310, 150), r: 100 },
      tip: 'A brake chamber is a diaphragm and a push rod — air pressure on a large area gives a big force.',
      lines: [
        { text: 'At each wheel there is a brake chamber.' },
        { text: 'Air pushes a rubber diaphragm, the diaphragm pushes a rod.' },
        { text: 'The area is large, so even sixty pounds of air gives a big push.' },
        { text: 'That rod works the slack adjuster, and the slack adjuster twists the cam.' },
      ],
      marks: [
        pipe([pt(AB_VALVE.x + 44, AB_VALVE.y + 11), pt(285, AB_VALVE.y + 11)]),
        pipe([pt(285, AB_VALVE.y + 11), pt(285, 120), pt(300, 120)]),
        pipe([pt(285, AB_VALVE.y + 11), pt(285, 195), pt(300, 195)]),
        ...cylinder(pt(300, 112), 30, 18, 0.35, true),
        ...cylinder(pt(300, 187), 30, 18, 0.35, true),
        label(332, 104, 'FRONT CHAMBER'),
        label(332, 214, 'REAR CHAMBER'),
      ],
    },
    {
      id: 'ab-failsafe',
      title: 'Why a burst pipe stops you',
      tool: 'pencil',
      focus: { at: pt(200, 230), r: 160 },
      tip: 'The spring brake is held off by air. Lose the air and the spring applies the brakes.',
      lines: [
        { text: 'Here is the clever part, and it is examined every year.' },
        { text: 'The parking brake is a powerful spring inside the chamber.' },
        { text: 'Air pressure holds that spring compressed — holds the brake off.' },
        { text: 'Lose the air and the spring is released. The brakes go on.' },
        { text: 'So a burst air line stops the lorry. It does not run away.' },
        { text: 'That is why you cannot move a lorry with no air in the tanks.' },
      ],
      marks: [
        { kind: 'text', at: pt(70, 236), text: 'SPRING BRAKE: AIR HOLDS IT OFF — LOSE AIR, BRAKES APPLY', size: 3, align: 'left', bold: true },
      ],
    },
  ],
};

/* ========================================================================= 45
 * Auto-electrical
 * ======================================================================= */

const AE_BATT = pt(80, 200);
const AE_RAIL_Y = 90;

const AUTO_ELECTRICAL: DrawTopic = {
  id: 'auto-electrical',
  title: 'Basic auto-electrical circuits',
  subtitle: 'Battery, fuse, switch, load, earth — and the body as the return.',
  goal: 'Draw a basic vehicle lighting circuit with the correct symbols, use the vehicle body as the earth return, and place the fuse where it protects the circuit.',
  minutes: 30,
  level: 'Core',
  tools: ['T-square', 'HB pencil'],
  base: preparedSheet('AUTO-ELECTRICAL CIRCUIT', '45'),
  steps: [
    {
      id: 'ae-idea',
      title: 'Every circuit is the same five things',
      tool: 'hand',
      focus: { at: pt(190, 150), r: 220 },
      tip: 'Supply, protection, control, load, return. Every vehicle circuit has all five.',
      lines: [
        { text: 'Every circuit on a vehicle is the same five things in a row.' },
        { text: 'A supply. Protection. A control. A load. And a return.' },
        { text: 'Battery, fuse, switch, lamp, earth.' },
        { text: 'Find those five and you can read any wiring diagram in any manual.' },
      ],
      marks: [],
    },
    {
      id: 'ae-battery',
      title: 'Battery and the earth return',
      tool: 'pencil',
      focus: { at: pt(AE_BATT.x, AE_BATT.y), r: 90 },
      tip: 'On a vehicle the body is one of the two wires. Only the positive side is wired.',
      lines: [
        { text: 'The battery: long thin plate positive, short fat plate negative.', at: AE_BATT },
        { text: 'Now the part that confuses everybody.' },
        { text: 'The negative goes straight onto the body of the vehicle.' },
        { text: 'The body is the return wire. It is called the earth.' },
        { text: 'So every circuit only needs one wire run. The metal does the rest.' },
      ],
      marks: [
        ...battery(AE_BATT, 3),
        ...earth(pt(AE_BATT.x - 26, AE_BATT.y + 14)),
        pipe([pt(AE_BATT.x - 8, AE_BATT.y), pt(AE_BATT.x - 26, AE_BATT.y), pt(AE_BATT.x - 26, AE_BATT.y + 14)]),
        label(AE_BATT.x + 6, AE_BATT.y + 22, '12 V BATTERY'),
        label(AE_BATT.x - 26, AE_BATT.y + 26, 'EARTH'),
      ],
    },
    {
      id: 'ae-fuse',
      title: 'Fuse first, always',
      tool: 'pencil',
      focus: { at: pt(AE_BATT.x + 40, 140), r: 90 },
      tip: 'A fuse protects the wire, not the lamp. It goes as near the supply as possible.',
      lines: [
        { text: 'From the positive, straight up to the fuse box.' },
        { text: 'The fuse goes first, as near the battery as you can get it.', at: pt(AE_BATT.x + 30, 140) },
        { text: 'It is there to protect the wire, not the lamp.' },
        { text: 'A shorted wire with no fuse is how vehicles burn out.' },
      ],
      marks: [
        pipe([pt(AE_BATT.x + 12, AE_BATT.y), pt(AE_BATT.x + 30, AE_BATT.y), pt(AE_BATT.x + 30, 148)]),
        ...fuse(pt(AE_BATT.x + 30, 140), 16, 8),
        pipe([pt(AE_BATT.x + 30, 132), pt(AE_BATT.x + 30, AE_RAIL_Y), pt(300, AE_RAIL_Y)]),
        label(AE_BATT.x + 56, 140, 'FUSE 10 A'),
        label(200, AE_RAIL_Y - 8, 'SUPPLY RAIL'),
      ],
    },
    {
      id: 'ae-switch',
      title: 'The switch and the lamps',
      tool: 'pencil',
      focus: { at: pt(200, 140), r: 110 },
      tip: 'Switch the live side, never the earth side — an unswitched live is a fire waiting to start.',
      lines: [
        { text: 'The switch goes in the live wire, before the lamp.' },
        { text: 'Never in the earth wire. Switch the live, always.', at: pt(160, AE_RAIL_Y + 24) },
        { text: 'Then the lamps, drawn as a circle with a cross in it.' },
        { text: 'Two lamps side by side, each with its own path to earth.' },
        { text: 'Side by side like that is parallel. Both get the full twelve volts.' },
      ],
      marks: [
        pipe([pt(160, AE_RAIL_Y), pt(160, AE_RAIL_Y + 20)]),
        ...switchSymbol(pt(160, AE_RAIL_Y + 20), 18, false),
        pipe([pt(178, AE_RAIL_Y + 20), pt(178, 150), pt(240, 150)]),
        ...lamp(pt(250, 150), 9),
        ...lamp(pt(300, 150), 9),
        pipe([pt(259, 150), pt(291, 150)]),
        label(160, AE_RAIL_Y + 44, 'SWITCH'),
        label(250, 132, 'LAMP'),
        label(300, 132, 'LAMP'),
      ],
    },
    {
      id: 'ae-earth-return',
      title: 'Back to earth',
      tool: 'pencil',
      focus: { at: pt(275, 190), r: 110 },
      tip: 'A bad earth is the commonest electrical fault on a vehicle — dim lights, slow wipers, odd faults.',
      lines: [
        { text: 'Each lamp gets its own earth onto the body.' },
        { text: 'Draw the earth symbol under each one.', at: pt(250, 178) },
        { text: 'Now the circuit is complete: battery, fuse, switch, lamp, body, battery.' },
        { text: 'And here is the fault you will meet most often in the workshop.' },
        { text: 'A rusty earth. Dim lights, slow wipers, and everybody blames the battery.' },
      ],
      marks: [
        pipe([pt(250, 159), pt(250, 172)]),
        pipe([pt(300, 159), pt(300, 172)]),
        ...earth(pt(250, 172)),
        ...earth(pt(300, 172)),
        { kind: 'text', at: pt(70, 236), text: 'BATTERY → FUSE → SWITCH → LAMP → BODY → BATTERY', size: 3, align: 'left', bold: true },
      ],
    },
  ],
};

export const CIRCUIT_TOPICS: DrawTopic[] = [
  POWER_STEERING,
  POWER_BRAKES,
  TIPPING,
  AIR_BRAKES,
  AUTO_ELECTRICAL,
];
