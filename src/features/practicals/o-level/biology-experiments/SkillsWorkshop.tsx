"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, BarChart3, ClipboardList, FlaskConical, LineChart, Table2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Paper 3 does not only ask for remembered practicals. Skill B (recording and
 * presenting) and Skill C (analysing and evaluating) are tested on experiments
 * the candidate has never seen, so this module drills the transferable method
 * rather than any single experiment.
 */

const ACCENT = "#f59e0b";
const ACCENT_SOFT = "rgba(245,158,11,0.14)";
const ACCENT_RING = "rgba(251,191,36,0.38)";

type SectionId = "method" | "variables" | "tables" | "graphs" | "evaluating";

const SECTIONS: { id: SectionId; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "method", label: "Planning", Icon: ClipboardList },
  { id: "variables", label: "Variables", Icon: FlaskConical },
  { id: "tables", label: "Tables", Icon: Table2 },
  { id: "graphs", label: "Graphs", Icon: LineChart },
  { id: "evaluating", label: "Evaluating", Icon: BarChart3 },
];

/* ------------------------------------------------------------ Small pieces */

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="rounded-2xl border border-[#222] bg-[#141414] p-5 sm:p-6">
    <h3 className="text-lg font-bold text-white">{title}</h3>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

const NumberedList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ol className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex gap-3 text-sm leading-relaxed text-gray-300">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-black text-black" style={{ background: ACCENT }}>
          {index + 1}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

/** A card whose model answer stays hidden until the learner has had a go. */
const RevealCard: React.FC<{ prompt: React.ReactNode; answer: React.ReactNode; marks?: number }> = ({
  prompt,
  answer,
  marks,
}) => {
  const [shown, setShown] = useState(false);
  return (
    <div className="rounded-xl border border-[#262626] bg-[#181818] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm leading-relaxed text-gray-200">{prompt}</div>
        {marks !== undefined && (
          <span className="shrink-0 rounded-full bg-[#222] px-2 py-0.5 text-[11px] font-bold text-gray-400">
            [{marks}]
          </span>
        )}
      </div>
      <button
        onClick={() => setShown((current) => !current)}
        className="mt-3 rounded-lg px-3 py-1.5 text-xs font-bold transition"
        style={shown ? { background: "#262626", color: "#e5e7eb" } : { background: ACCENT, color: "#1c1206" }}
      >
        {shown ? "Hide model answer" : "Show model answer"}
      </button>
      {shown && (
        <div
          className="mt-3 rounded-lg border p-3 text-sm leading-relaxed text-amber-50"
          style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}
        >
          {answer}
        </div>
      )}
    </div>
  );
};

interface QuizOption {
  text: string;
  correct: boolean;
  why: string;
}

/** A self-marking question. Multi-select when more than one option is correct. */
const Quiz: React.FC<{ question: string; options: QuizOption[]; hint?: string }> = ({ question, options, hint }) => {
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const multi = options.filter((option) => option.correct).length > 1;

  const allCorrect = useMemo(
    () => options.every((option, index) => option.correct === picked.includes(index)),
    [options, picked],
  );

  const toggle = (index: number) => {
    if (checked) return;
    setPicked((current) => {
      if (multi) {
        return current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      }
      return [index];
    });
  };

  return (
    <div className="rounded-xl border border-[#262626] bg-[#181818] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-relaxed text-gray-100">{question}</p>
        {multi && <span className="shrink-0 rounded-full bg-[#222] px-2 py-0.5 text-[10px] font-bold text-gray-400">select all</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}

      <div className="mt-3 space-y-1.5">
        {options.map((option, index) => {
          const isPicked = picked.includes(index);
          const showResult = checked && (isPicked || option.correct);
          const good = option.correct;
          return (
            <button
              key={option.text}
              onClick={() => toggle(index)}
              disabled={checked}
              className="flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition disabled:cursor-default"
              style={{
                borderColor: showResult ? (good ? "rgba(52,211,153,0.5)" : "rgba(248,113,113,0.5)") : isPicked ? ACCENT_RING : "#2a2a2a",
                background: showResult ? (good ? "rgba(16,185,129,0.1)" : "rgba(220,38,38,0.1)") : isPicked ? ACCENT_SOFT : "#1c1c1c",
              }}
            >
              <span
                className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-black"
                style={{
                  background: showResult ? (good ? "#10b981" : "#dc2626") : isPicked ? ACCENT : "#333",
                  color: showResult || isPicked ? "#0b0b0b" : "#888",
                }}
              >
                {checked ? (good ? "✓" : "✕") : isPicked ? "•" : ""}
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-gray-200">{option.text}</span>
                {checked && (isPicked || option.correct) && (
                  <span className="mt-1 block text-xs leading-relaxed text-gray-400">{option.why}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={picked.length === 0}
            className="rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-40"
            style={{ background: ACCENT, color: "#1c1206" }}
          >
            Check answer
          </button>
        ) : (
          <>
            <span
              className="rounded-lg px-3 py-1.5 text-xs font-bold"
              style={
                allCorrect
                  ? { background: "rgba(16,185,129,0.16)", color: "#6ee7b7" }
                  : { background: "rgba(220,38,38,0.16)", color: "#fca5a5" }
              }
            >
              {allCorrect ? "Correct" : "Not quite — read the notes"}
            </span>
            <button
              onClick={() => {
                setChecked(false);
                setPicked([]);
              }}
              className="rounded-lg bg-[#262626] px-3 py-1.5 text-xs font-bold text-gray-300"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------- Section: planning */

const PlanningSection: React.FC = () => (
  <div className="space-y-5">
    <SectionCard
      title="Planning an investigation"
      subtitle="The same seven steps work for any experiment, including one you have never seen before."
    >
      <NumberedList
        items={[
          <>
            <strong className="text-white">Write the question as a variable pair.</strong> "How does <em>X</em> affect{" "}
            <em>Y</em>?" X is what you change, Y is what you measure.
          </>,
          <>
            <strong className="text-white">State a hypothesis with a reason.</strong> Not just "the rate will increase",
            but "the rate will increase because…". The biology in the reason is where the marks are.
          </>,
          <>
            <strong className="text-white">Decide how to change X.</strong> Give at least five values, spread over a
            sensible range, and say how you will produce each one.
          </>,
          <>
            <strong className="text-white">Decide how to measure Y.</strong> Name the instrument and the unit, and say
            how often you will read it.
          </>,
          <>
            <strong className="text-white">List the variables you will control</strong> and say <em>how</em> you will
            control each one. "Keep the temperature the same" scores less than "keep all tubes in a water bath at 30 °C".
          </>,
          <>
            <strong className="text-white">Include a control experiment</strong> — an identical set-up with the factor
            you are testing removed, so you can be sure it caused the result.
          </>,
          <>
            <strong className="text-white">Repeat and average.</strong> Three readings at each value, discard any
            anomaly, then calculate a mean.
          </>,
        ]}
      />
    </SectionCard>

    <SectionCard title="Control experiment vs controlled variable" subtitle="These score differently. Do not mix them up.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#262626] bg-[#181818] p-4">
          <div className="text-xs font-black uppercase tracking-wide" style={{ color: ACCENT }}>
            Controlled variable
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            A factor you deliberately keep the <strong className="text-white">same</strong> in every test, so it cannot
            affect your result. Temperature, pH, volume, mass, time.
          </p>
        </div>
        <div className="rounded-xl border border-[#262626] bg-[#181818] p-4">
          <div className="text-xs font-black uppercase tracking-wide" style={{ color: ACCENT }}>
            Control experiment
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            A whole extra set-up run <strong className="text-white">without</strong> the thing being tested — boiled
            enzyme, dead seeds, a leaf kept in the dark. It shows what happens when the factor is absent.
          </p>
        </div>
      </div>
    </SectionCard>

    <SectionCard title="Practise on an unfamiliar experiment" subtitle="You are not expected to have done these before.">
      <div className="space-y-3">
        <RevealCard
          marks={4}
          prompt={
            <>
              A student wants to find out whether the <strong>colour of light</strong> affects how fast pondweed
              photosynthesises. Plan an investigation. Include the variable you change, the variable you measure, two
              variables you would control and how, and one safety point.
            </>
          }
          answer={
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Change:</strong> the colour of the light, using coloured filters (red, green, blue, clear) over
                the same lamp.
              </li>
              <li>
                <strong>Measure:</strong> the number of bubbles of oxygen released per minute (or the volume of gas
                collected in a set time).
              </li>
              <li>
                <strong>Control — light intensity:</strong> keep the lamp at the same distance and use filters of the
                same thickness so only the colour differs.
              </li>
              <li>
                <strong>Control — temperature:</strong> place a glass tank of water between the lamp and the tube, and
                check with a thermometer that it stays at the same temperature.
              </li>
              <li>Also control: same piece of pondweed, same volume and concentration of sodium hydrogencarbonate.</li>
              <li>
                <strong>Safety:</strong> keep the lamp and its cable away from the water to avoid an electrical hazard.
              </li>
            </ul>
          }
        />
        <RevealCard
          marks={3}
          prompt={
            <>
              A student investigates whether <strong>maggots</strong> move away from light. Describe how they could make
              the results reliable, and state one ethical point.
            </>
          }
          answer={
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Use a reasonable number of maggots (for example ten) rather than one, and record how many are on each
                side after a fixed time.
              </li>
              <li>
                Repeat the whole test at least three times, returning the maggots to the centre each time, and calculate
                a mean.
              </li>
              <li>
                Keep everything except the light the same — same temperature, same humidity, same surface — and cover
                half the dish so only light differs.
              </li>
              <li>
                <strong>Ethics:</strong> the animals must not be harmed, dried out or overheated, and must be returned to
                suitable conditions afterwards.
              </li>
            </ul>
          }
        />
      </div>
    </SectionCard>
  </div>
);

/* ------------------------------------------------------- Section: variables */

interface Scenario {
  title: string;
  text: string;
  independent: string;
  dependent: string;
  controlled: string[];
  control: string;
}

const SCENARIOS: Scenario[] = [
  {
    title: "Woodlice and humidity",
    text: "Ten woodlice are placed in a choice chamber. One half is kept dry with silica gel and the other half is kept damp with wet cotton wool. After ten minutes the number of woodlice on each side is counted. The test is repeated three times.",
    independent: "The humidity of the air in each half of the chamber (dry or damp)",
    dependent: "The number of woodlice on each side after ten minutes",
    controlled: [
      "Same number and size of woodlice",
      "Same temperature in both halves",
      "Same light level in both halves",
      "Same time allowed (ten minutes)",
    ],
    control: "A chamber with both halves at the same humidity — if the woodlice then split evenly, the response really is to humidity.",
  },
  {
    title: "Milk and rennet",
    text: "Five test tubes each hold 10 cm³ of milk. Each is kept at a different temperature and 1 cm³ of rennet is added. The time taken for the milk to clot is recorded.",
    independent: "The temperature of the milk (°C)",
    dependent: "The time taken for the milk to clot (s)",
    controlled: [
      "Volume and type of milk (10 cm³ of the same milk)",
      "Volume and concentration of rennet (1 cm³)",
      "pH of the milk",
      "How the end point is judged",
    ],
    control: "A tube of milk with boiled rennet added — no clotting shows the enzyme is responsible.",
  },
  {
    title: "Leaf surface and water loss",
    text: "Four similar leaves are weighed. The first is left untreated, the second has vaseline on the upper surface, the third on the lower surface, and the fourth on both. All four hang in the same room and are re-weighed every hour for six hours.",
    independent: "Which leaf surface is blocked with vaseline",
    dependent: "The loss in mass of the leaf each hour (g)",
    controlled: [
      "Same species, size and age of leaf",
      "Same temperature, humidity and air movement",
      "Same thickness of vaseline",
      "Same weighing balance and time intervals",
    ],
    control: "The untreated leaf — it shows the normal rate of water loss for comparison.",
  },
];

const VariablesSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const scenario = SCENARIOS[index];

  return (
    <div className="space-y-5">
      <SectionCard
        title="The three kinds of variable"
        subtitle="Almost every Paper 3 question opens with these. Get them right and the rest follows."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "Independent", body: "The one thing you deliberately change. Only ever one.", tag: "you change it" },
            { name: "Dependent", body: "The thing you measure or observe, because it depends on the independent variable.", tag: "you measure it" },
            { name: "Controlled", body: "Everything else that could affect the result, kept the same throughout.", tag: "you keep it the same" },
          ].map((item) => (
            <div key={item.name} className="rounded-xl border border-[#262626] bg-[#181818] p-4">
              <div className="text-xs font-black uppercase tracking-wide" style={{ color: ACCENT }}>
                {item.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{item.body}</p>
              <div className="mt-2 inline-block rounded-full bg-[#232323] px-2 py-0.5 text-[10px] font-bold text-gray-400">
                {item.tag}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Sort the variables" subtitle="Read the method, work them out, then check yourself.">
        <div className="flex flex-wrap gap-1.5">
          {SCENARIOS.map((item, itemIndex) => (
            <button
              key={item.title}
              onClick={() => setIndex(itemIndex)}
              className="rounded-lg px-3 py-1.5 text-xs font-bold transition"
              style={
                index === itemIndex
                  ? { background: ACCENT, color: "#1c1206" }
                  : { background: "#232323", color: "#d1d5db" }
              }
            >
              {item.title}
            </button>
          ))}
        </div>

        <p className="mt-4 rounded-xl border border-[#262626] bg-[#181818] p-4 text-sm leading-relaxed text-gray-300">
          {scenario.text}
        </p>

        <div className="mt-3 space-y-3">
          <RevealCard
            marks={1}
            prompt="State the independent variable."
            answer={scenario.independent}
          />
          <RevealCard marks={1} prompt="State the dependent variable." answer={scenario.dependent} />
          <RevealCard
            marks={2}
            prompt="Give two variables that must be controlled."
            answer={
              <ul className="list-disc space-y-1 pl-5">
                {scenario.controlled.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            }
          />
          <RevealCard marks={2} prompt="Suggest a suitable control experiment and say what it shows." answer={scenario.control} />
        </div>
      </SectionCard>

      <SectionCard title="Check your understanding">
        <div className="space-y-3">
          <Quiz
            question="A student changes the concentration of sucrose AND the temperature between tubes, then measures the mass change of potato cylinders. Why are the results not valid?"
            options={[
              {
                text: "Two independent variables were changed, so you cannot tell which one caused the change in mass.",
                correct: true,
                why: "Correct. A fair test changes one variable at a time; otherwise the effects cannot be separated.",
              },
              {
                text: "Because the potato cylinders were not weighed accurately enough.",
                correct: false,
                why: "Nothing in the question suggests the balance was at fault.",
              },
              {
                text: "Because there were not enough repeats.",
                correct: false,
                why: "Repeats improve reliability, but the fatal problem here is changing two variables at once.",
              },
              {
                text: "Because temperature has no effect on osmosis.",
                correct: false,
                why: "Temperature does affect the rate of osmosis — that is exactly why it must be controlled.",
              },
            ]}
          />
          <Quiz
            question="Which of these are genuine controlled variables in an experiment on the effect of light intensity on pondweed?"
            options={[
              { text: "Temperature of the water", correct: true, why: "Yes — a heat shield is used to keep it constant." },
              {
                text: "Concentration of sodium hydrogencarbonate solution",
                correct: true,
                why: "Yes — it supplies carbon dioxide, which would otherwise become a second variable.",
              },
              { text: "Distance of the lamp from the tube", correct: false, why: "This is the independent variable — it is what you change." },
              { text: "Number of bubbles per minute", correct: false, why: "This is the dependent variable — it is what you measure." },
              { text: "The same piece of pondweed throughout", correct: true, why: "Yes — different shoots photosynthesise at different rates." },
            ]}
          />
        </div>
      </SectionCard>
    </div>
  );
};

/* ---------------------------------------------------------- Section: tables */

const TablesSection: React.FC = () => (
  <div className="space-y-5">
    <SectionCard title="How a results table must be built" subtitle="Marks are given for the table itself, before any reading is taken.">
      <NumberedList
        items={[
          <>
            Draw the table with a <strong className="text-white">ruler</strong>, with a full outside border and lines
            between every row and column.
          </>,
          <>
            Put the <strong className="text-white">independent variable in the first column</strong>, in order, and the
            dependent variable in the columns to its right.
          </>,
          <>
            Put the <strong className="text-white">quantity and unit in the heading</strong>, separated by a solidus:
            "Time / s", "Mass / g", "Temperature / °C".
          </>,
          <>
            <strong className="text-white">Never write units next to the readings.</strong> "12.4" in the body, not
            "12.4 g".
          </>,
          <>
            Give every reading in a column the <strong className="text-white">same number of decimal places</strong>,
            matching the precision of the instrument.
          </>,
          <>
            Add columns for <strong className="text-white">repeats and a mean</strong>, and a column for any processed
            value you need (rate, percentage change, 1/time).
          </>,
          <>Record raw readings as you take them — never rewrite the table "neatly" afterwards and lose the originals.</>,
        ]}
      />
    </SectionCard>

    <SectionCard title="Spot the faults" subtitle="This table would lose most of its marks. Six things are wrong with it.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-[#3a3a3a] bg-[#1f1f1f] p-2 text-left text-gray-300">time</th>
              <th className="border border-[#3a3a3a] bg-[#1f1f1f] p-2 text-left text-gray-300">volume of gas</th>
              <th className="border border-[#3a3a3a] bg-[#1f1f1f] p-2 text-left text-gray-300">rate</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            <tr>
              <td className="border border-[#3a3a3a] p-2">30 secs</td>
              <td className="border border-[#3a3a3a] p-2">4 cm3</td>
              <td className="border border-[#3a3a3a] p-2">0.13</td>
            </tr>
            <tr>
              <td className="border border-[#3a3a3a] p-2">1 minute</td>
              <td className="border border-[#3a3a3a] p-2">9.5 cm3</td>
              <td className="border border-[#3a3a3a] p-2">0.158</td>
            </tr>
            <tr>
              <td className="border border-[#3a3a3a] p-2">90 secs</td>
              <td className="border border-[#3a3a3a] p-2">13 cm3</td>
              <td className="border border-[#3a3a3a] p-2">0.1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <RevealCard
          prompt="Write down as many faults as you can find, then check."
          answer={
            <ol className="list-decimal space-y-1 pl-5">
              <li>Headings have no units. They should read "Time / s", "Volume of gas / cm³", "Rate / cm³ s⁻¹".</li>
              <li>Units are written next to the readings instead of in the headings.</li>
              <li>The units are inconsistent — seconds in two rows and minutes in another. Use one unit throughout.</li>
              <li>"cm3" is written wrongly; it must be cm³.</li>
              <li>
                Decimal places are inconsistent: 4, 9.5 and 13 in one column, and 0.13, 0.158, 0.1 in another. Each column
                should be to a fixed number of decimal places.
              </li>
              <li>There are no repeat readings and no mean, so the results cannot be shown to be reliable.</li>
              <li>Headings should also start with a capital letter, and the table needs a title.</li>
            </ol>
          }
        />
      </div>
    </SectionCard>

    <SectionCard title="How it should look" subtitle="The same data, presented so it would gain full credit.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <caption className="caption-top pb-2 text-left text-xs font-bold text-gray-300">
            Table 1: Volume of oxygen released by catalase over time
          </caption>
          <thead>
            <tr>
              <th className="border p-2 text-left text-white" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
                Time / s
              </th>
              <th className="border p-2 text-center text-white" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
                Volume of oxygen / cm³
                <br />
                <span className="text-[11px] font-normal text-gray-400">1st</span>
              </th>
              <th className="border p-2 text-center text-white" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
                <span className="text-[11px] font-normal text-gray-400">2nd</span>
              </th>
              <th className="border p-2 text-center text-white" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
                <span className="text-[11px] font-normal text-gray-400">3rd</span>
              </th>
              <th className="border p-2 text-center text-white" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
                Mean volume / cm³
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {[
              ["30", "4.0", "4.4", "4.2", "4.2"],
              ["60", "9.5", "9.1", "9.3", "9.3"],
              ["90", "13.0", "13.4", "13.2", "13.2"],
              ["120", "15.6", "15.2", "15.4", "15.4"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-[#3a3a3a] p-2 ${cellIndex === 0 ? "text-left" : "text-center"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-gray-400">
        Note the fixed one decimal place in every volume column, units only in the headings, the independent variable on
        the left, three repeats with a mean, and a title.
      </p>
    </SectionCard>

    <SectionCard title="Check your understanding">
      <Quiz
        question="Which heading is written correctly for a results table?"
        options={[
          { text: "Mass / g", correct: true, why: "Correct — quantity, solidus, unit, and no unit repeated in the body." },
          { text: "Mass (grams)", correct: false, why: "Acceptable in some books, but the solidus form with the unit symbol is what is expected." },
          { text: "Mass in g of the potato cylinder after soaking / g", correct: false, why: "The unit appears twice and the heading is far too long." },
          { text: "mass", correct: false, why: "No unit and no capital letter." },
        ]}
      />
    </SectionCard>
  </div>
);

/* ---------------------------------------------------------- Section: graphs */

/** A deliberately poor graph, used for fault-finding. */
const BadGraph: React.FC = () => (
  <svg viewBox="0 0 220 170" className="w-full" role="img" aria-label="A poorly drawn graph with several faults">
    <rect x={0} y={0} width={220} height={170} fill="#1a1a1a" />
    {/* Axes with no labels */}
    <line x1={40} y1={140} x2={200} y2={140} stroke="#666" strokeWidth={1} />
    <line x1={40} y1={140} x2={40} y2={100} stroke="#666" strokeWidth={1} />
    {/* Cramped plot in the top corner only */}
    <polyline points="45,138 70,132 95,120 120,112 145,104 170,102" fill="none" stroke="#f87171" strokeWidth={1.2} />
    {[
      [45, 138],
      [70, 132],
      [95, 120],
      [120, 112],
      [145, 104],
      [170, 102],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill="#f87171" />
    ))}
    {/* Uneven scale numbers */}
    {["0", "5", "20", "25", "60"].map((label, index) => (
      <text key={label} x={45 + index * 31} y={152} fill="#777" fontSize={7} textAnchor="middle">
        {label}
      </text>
    ))}
    <text x={110} y={166} fill="#888" fontSize={7} textAnchor="middle">
      (no axis label)
    </text>
  </svg>
);

/** The same data, plotted correctly. */
const GoodGraph: React.FC = () => {
  const points: [number, number][] = [
    [0, 0],
    [10, 4.2],
    [20, 9.3],
    [30, 13.2],
    [40, 15.4],
    [50, 16.2],
  ];
  const padLeft = 38;
  const padBottom = 30;
  const padTop = 10;
  const padRight = 8;
  const width = 220;
  const height = 170;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const maxX = 50;
  const maxY = 20;

  const toPx = (x: number, y: number) => ({
    px: padLeft + (x / maxX) * plotWidth,
    py: padTop + plotHeight - (y / maxY) * plotHeight,
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="The same data plotted correctly">
      <rect x={0} y={0} width={width} height={height} fill="#1a1a1a" />
      {/* Recessive gridlines */}
      {[0.25, 0.5, 0.75, 1].map((fraction) => (
        <line
          key={fraction}
          x1={padLeft}
          y1={padTop + plotHeight - fraction * plotHeight}
          x2={width - padRight}
          y2={padTop + plotHeight - fraction * plotHeight}
          stroke="#2a2a2a"
          strokeWidth={0.6}
        />
      ))}
      {/* Axes */}
      <line x1={padLeft} y1={padTop + plotHeight} x2={width - padRight} y2={padTop + plotHeight} stroke="#8a8a8a" strokeWidth={1} />
      <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + plotHeight} stroke="#8a8a8a" strokeWidth={1} />
      {/* Even scales */}
      {[0, 10, 20, 30, 40, 50].map((value) => (
        <text key={value} x={toPx(value, 0).px} y={padTop + plotHeight + 10} fill="#9ca3af" fontSize={7} textAnchor="middle">
          {value}
        </text>
      ))}
      {[0, 5, 10, 15, 20].map((value) => (
        <text key={value} x={padLeft - 4} y={toPx(0, value).py + 2.5} fill="#9ca3af" fontSize={7} textAnchor="end">
          {value}
        </text>
      ))}
      {/* Smooth curve of best fit */}
      <polyline
        points={points.map((point) => {
          const { px, py } = toPx(point[0], point[1]);
          return `${px},${py}`;
        }).join(" ")}
        fill="none"
        stroke={ACCENT}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {/* Points marked with neat crosses, as required */}
      {points.map(([x, y]) => {
        const { px, py } = toPx(x, y);
        return (
          <g key={`${x}-${y}`} stroke="#fff" strokeWidth={1.1}>
            <line x1={px - 2.6} y1={py - 2.6} x2={px + 2.6} y2={py + 2.6} />
            <line x1={px - 2.6} y1={py + 2.6} x2={px + 2.6} y2={py - 2.6} />
          </g>
        );
      })}
      {/* Axis labels with units */}
      <text x={padLeft + plotWidth / 2} y={height - 4} fill="#d1d5db" fontSize={7.5} textAnchor="middle">
        Time / s
      </text>
      <text
        x={9}
        y={padTop + plotHeight / 2}
        fill="#d1d5db"
        fontSize={7.5}
        textAnchor="middle"
        transform={`rotate(-90 9 ${padTop + plotHeight / 2})`}
      >
        Volume of oxygen / cm³
      </text>
    </svg>
  );
};

const GraphsSection: React.FC = () => (
  <div className="space-y-5">
    <SectionCard title="Which type of graph?" subtitle="Choosing wrongly costs marks before you plot a single point.">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            name: "Line graph",
            when: "Both variables are continuous numbers — time, temperature, concentration, distance.",
            example: "Volume of oxygen against time.",
          },
          {
            name: "Bar chart",
            when: "The independent variable is in separate categories, not a number scale.",
            example: "Rate of reaction for liver, potato and celery.",
          },
          {
            name: "Histogram",
            when: "Continuous data grouped into classes, with the bars touching.",
            example: "Number of leaves in each length range.",
          },
        ].map((item) => (
          <div key={item.name} className="rounded-xl border border-[#262626] bg-[#181818] p-4">
            <div className="text-xs font-black uppercase tracking-wide" style={{ color: ACCENT }}>
              {item.name}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{item.when}</p>
            <p className="mt-2 text-xs italic text-gray-500">{item.example}</p>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard title="The graph checklist" subtitle="Work down this list every time and you will not lose easy marks.">
      <NumberedList
        items={[
          <>
            <strong className="text-white">Independent variable on the x-axis</strong>, dependent variable on the y-axis.
          </>,
          <>
            <strong className="text-white">Label both axes with the quantity and unit</strong>, exactly as in the table
            heading.
          </>,
          <>
            <strong className="text-white">Choose scales that use more than half the grid</strong> in both directions,
            and go up in easy steps of 1, 2, 5 or 10 — never in 3s or 7s.
          </>,
          <>
            Plot each point with a <strong className="text-white">small neat cross or an encircled dot</strong>, accurate
            to half a small square.
          </>,
          <>
            Draw a <strong className="text-white">single smooth curve or a straight ruled line of best fit</strong>. Do
            not join the points dot-to-dot, and do not extend the line beyond your data.
          </>,
          <>Ignore an obvious anomaly when drawing the line, but circle it and mention it in your answer.</>,
          <>
            Give the graph a <strong className="text-white">title</strong>, and add a key if there is more than one line.
          </>,
        ]}
      />
    </SectionCard>

    <SectionCard title="Before and after" subtitle="The same readings, plotted badly and then properly.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-500/30 bg-[#181818] p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-red-300">
              would lose marks
            </span>
          </div>
          <BadGraph />
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-400">
            <li>• Axes not labelled and no units given.</li>
            <li>• Scale is uneven (0, 5, 20, 25, 60) so the shape is meaningless.</li>
            <li>• Points squashed into a small part of the grid.</li>
            <li>• Points joined dot-to-dot instead of a line of best fit.</li>
            <li>• No title.</li>
          </ul>
        </div>
        <div className="rounded-xl p-3" style={{ borderWidth: 1, borderStyle: "solid", borderColor: ACCENT_RING, background: "#181818" }}>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase" style={{ background: ACCENT_SOFT, color: "#fcd34d" }}>
              full marks
            </span>
          </div>
          <GoodGraph />
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-400">
            <li>• Both axes labelled with quantity and unit.</li>
            <li>• Even scales in steps of 10 and 5, filling the grid.</li>
            <li>• Points marked with neat crosses.</li>
            <li>• One smooth curve of best fit through the points.</li>
            <li>• Titled: "Volume of oxygen released against time".</li>
          </ul>
        </div>
      </div>
    </SectionCard>

    <SectionCard title="Reading values off a graph">
      <div className="space-y-3">
        <RevealCard
          marks={3}
          prompt={
            <>
              Using the graph above, find the <strong>rate of oxygen production over the first 20 seconds</strong>. Show
              your working and give the unit.
            </>
          }
          answer={
            <>
              <p>Read the volume at 20 s: 9.3 cm³. At 0 s the volume is 0 cm³.</p>
              <p className="mt-1">rate = change in volume ÷ change in time = (9.3 − 0) ÷ (20 − 0)</p>
              <p className="mt-1">
                rate = <strong>0.47 cm³/s</strong> (2 significant figures). The unit mark is lost if you leave it out.
              </p>
            </>
          }
        />
        <RevealCard
          marks={3}
          prompt="Describe the shape of the curve and explain why it has that shape."
          answer={
            <>
              <p>
                The curve rises steeply at first, then the gradient gradually decreases, and finally it becomes
                horizontal (levels off).
              </p>
              <p className="mt-1">
                At the start there is plenty of hydrogen peroxide, so many successful collisions with the active sites
                and a fast rate. As the reaction proceeds the hydrogen peroxide is used up, so the rate falls. The graph
                is flat when all the substrate has been broken down and no more oxygen can be produced.
              </p>
              <p className="mt-1">
                <strong>Marking tip:</strong> "describe" needs the shape plus figures from the graph; "explain" needs the
                biology.
              </p>
            </>
          }
        />
      </div>
    </SectionCard>

    <SectionCard title="Check your understanding">
      <div className="space-y-3">
        <Quiz
          question="A student compares the rate of oxygen production by liver, potato and celery. Which graph should they draw?"
          options={[
            { text: "A bar chart, with a gap between each bar", correct: true, why: "Correct — the tissues are separate categories, so bars with gaps are right." },
            { text: "A line graph joining the three points", correct: false, why: "There are no in-between values between 'liver' and 'potato', so a line is meaningless." },
            { text: "A histogram with the bars touching", correct: false, why: "Histograms are for continuous data grouped into classes." },
            { text: "A pie chart", correct: false, why: "Pie charts show parts of a whole, not rates being compared." },
          ]}
        />
        <Quiz
          question="Which of these are faults that would lose graph marks?"
          options={[
            { text: "Using a scale that goes up in 3s", correct: true, why: "Yes — awkward scales make points hard to plot and read." },
            { text: "Plotting the independent variable on the y-axis", correct: true, why: "Yes — the independent variable always goes on the x-axis." },
            { text: "Drawing a smooth curve of best fit", correct: false, why: "This is exactly what is wanted for continuous data." },
            { text: "Leaving the units off the axis labels", correct: true, why: "Yes — the quantity and its unit are both needed." },
            { text: "Circling an anomalous point and ignoring it when drawing the line", correct: false, why: "This is good practice and often gains a mark." },
          ]}
        />
      </div>
    </SectionCard>
  </div>
);

/* ------------------------------------------------------ Section: evaluating */

const EvaluatingSection: React.FC = () => (
  <div className="space-y-5">
    <SectionCard title="Describing a trend" subtitle="Use this sentence pattern and you will pick up the marks every time.">
      <div className="rounded-xl border p-4" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
        <p className="text-sm leading-relaxed text-amber-50">
          "As the <em>independent variable</em> increased from <em>value</em> to <em>value</em>, the{" "}
          <em>dependent variable</em> increased/decreased from <em>value</em> to <em>value</em>. Above/below{" "}
          <em>value</em> it then <em>…</em>"
        </p>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-gray-300">
        <li>• Always quote figures with units taken from your own results.</li>
        <li>• Say where the pattern changes — a peak, a plateau, or a point where it crosses zero.</li>
        <li>• "Describe" means say what happens. "Explain" means say why, using biology.</li>
        <li>• Do not write "it goes up" — that earns nothing on its own.</li>
      </ul>
    </SectionCard>

    <SectionCard title="Anomalies, reliability and accuracy" subtitle="These words have precise meanings in the mark scheme.">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            term: "Anomalous result",
            body: "A reading that does not fit the pattern of the others. Circle it, leave it out of the mean and out of the line of best fit, and say why it might have happened.",
          },
          {
            term: "Reliable",
            body: "Repeats give closely similar values. You improve reliability by repeating and taking a mean — not by using a better instrument.",
          },
          {
            term: "Accurate",
            body: "Close to the true value. You improve accuracy with a more suitable instrument or a better technique.",
          },
          {
            term: "Precise",
            body: "The instrument can measure to a fine division — a balance reading to 0.01 g is more precise than one reading to 0.1 g. Precise is not the same as accurate.",
          },
          {
            term: "Random error",
            body: "Scatters readings either side of the true value — human reaction time, judging a colour change. Reduced by repeating and averaging.",
          },
          {
            term: "Systematic error",
            body: "Shifts every reading the same way — a balance not zeroed, a leaking bung, a ruler read from the wrong end. Repeats will NOT fix it.",
          },
        ].map((item) => (
          <div key={item.term} className="rounded-xl border border-[#262626] bg-[#181818] p-4">
            <div className="text-xs font-black uppercase tracking-wide" style={{ color: ACCENT }}>
              {item.term}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{item.body}</p>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard title="Writing improvements that actually score" subtitle="Vague improvements get nothing. Name the problem, then the fix.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-[#3a3a3a] bg-[#1f1f1f] p-2 text-left text-gray-300">Scores nothing</th>
              <th className="border border-[#3a3a3a] bg-[#1f1f1f] p-2 text-left text-gray-300">Scores the mark</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {[
              ["\"Be more careful.\"", "\"Use a colorimeter instead of judging the colour by eye, because the end point is subjective.\""],
              ["\"Do more repeats.\"", "\"Repeat each concentration three times and calculate a mean, to reduce the effect of random error.\""],
              ["\"Use better equipment.\"", "\"Use a burette reading to 0.05 cm³ rather than a measuring cylinder reading to 1 cm³.\""],
              ["\"Keep everything the same.\"", "\"Keep all the tubes in a water bath at 30 °C so the temperature does not change between them.\""],
              ["\"The results were wrong.\"", "\"The reading at 40 °C is anomalous — the tube may not have reached the bath temperature before the enzyme was added.\""],
            ].map((row) => (
              <tr key={row[0]}>
                <td className="border border-[#3a3a3a] p-2 align-top text-gray-500">{row[0]}</td>
                <td className="border border-[#3a3a3a] p-2 align-top">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>

    <SectionCard title="Full-question practice" subtitle="Unfamiliar experiments, answered with the general method.">
      <div className="space-y-3">
        <RevealCard
          marks={4}
          prompt={
            <>
              A student measured how long five different fabrics took to dry, as a model of transpiration from leaves.
              Their results for one fabric were 12, 13, 12 and 24 minutes. Identify the anomaly, explain what they should
              do with it, and suggest two reasons for it.
            </>
          }
          answer={
            <ul className="list-disc space-y-1 pl-5">
              <li>
                The anomalous result is <strong>24 minutes</strong>; the other three readings are close together at 12–13
                minutes.
              </li>
              <li>
                It should be left out of the mean, so the mean is (12 + 13 + 12) ÷ 3 = 12.3 minutes, and it should be
                circled on any graph and commented on.
              </li>
              <li>Possible reason: that piece of fabric was soaked with more water than the others at the start.</li>
              <li>
                Possible reason: it was dried in a different position — further from the fan, or in a cooler or more humid
                spot.
              </li>
            </ul>
          }
        />
        <RevealCard
          marks={5}
          prompt={
            <>
              A student put five equal-sized discs cut from a fresh leaf into a syringe of sodium hydrogencarbonate
              solution and timed how long each took to float. Explain why the discs sink at first and later float, and
              give two ways to make the results more reliable.
            </>
          }
          answer={
            <ul className="list-disc space-y-1 pl-5">
              <li>
                The discs sink at first because the air has been drawn out of the air spaces in the leaf, so the disc is
                denser than the solution.
              </li>
              <li>
                In the light the leaf photosynthesises and produces oxygen, which collects in the air spaces. This lowers
                the density of the disc until it is less dense than the solution, so it floats.
              </li>
              <li>The time to float is therefore a measure of the rate of photosynthesis.</li>
              <li>
                <strong>Reliability:</strong> use more discs at each condition (at least five) and take the mean time, so
                one unusual disc has less effect.
              </li>
              <li>
                <strong>Reliability:</strong> cut every disc from the same leaf with the same cork borer, avoiding the
                midrib, so their thickness and area are the same.
              </li>
              <li>
                <strong>Also:</strong> keep the temperature, the light intensity and the concentration of sodium
                hydrogencarbonate the same for every disc.
              </li>
            </ul>
          }
        />
        <RevealCard
          marks={3}
          prompt="A student concludes: 'Enzymes work best at 37 °C, so all enzymes have an optimum of 37 °C.' Criticise this conclusion."
          answer={
            <ul className="list-disc space-y-1 pl-5">
              <li>
                The conclusion goes beyond the data. Only one enzyme was tested, so nothing can be said about all
                enzymes.
              </li>
              <li>
                Different enzymes have different optima — for example, enzymes in the human stomach work best at about pH
                2, and enzymes in bacteria from hot springs have optima well above 37 °C.
              </li>
              <li>
                The readings were taken at 10 °C intervals, so the true optimum could lie anywhere between 30 and 45 °C.
                Smaller intervals near the peak would be needed before claiming exactly 37 °C.
              </li>
            </ul>
          }
        />
      </div>
    </SectionCard>

    <SectionCard title="Check your understanding">
      <div className="space-y-3">
        <Quiz
          question="A balance was never zeroed and read 0.15 g too high for every measurement. What kind of error is this, and does repeating help?"
          options={[
            {
              text: "A systematic error — repeating and averaging will not remove it.",
              correct: true,
              why: "Correct. Every reading is shifted the same way, so the mean is shifted too. Zero the balance instead.",
            },
            { text: "A random error — repeating will remove it.", correct: false, why: "Random errors scatter either side of the true value; this one is always in the same direction." },
            { text: "An anomalous result.", correct: false, why: "An anomaly is one odd reading. Here every reading is affected." },
            { text: "A reliability problem.", correct: false, why: "The readings would be very consistent — consistently wrong. That is accuracy, not reliability." },
          ]}
        />
        <Quiz
          question="Which statements about reliability and accuracy are correct?"
          options={[
            { text: "Repeating a reading three times and taking a mean improves reliability.", correct: true, why: "Yes — that is the standard definition." },
            { text: "A more precise instrument always makes results more reliable.", correct: false, why: "Precision affects the fineness of a reading, not the agreement between repeats." },
            { text: "Results can be reliable but not accurate.", correct: true, why: "Yes — a systematic error gives consistent readings that are all wrong." },
            { text: "An anomaly should be included in the mean so that no data is lost.", correct: false, why: "An anomaly should be identified, excluded from the mean, and commented on." },
          ]}
        />
      </div>
    </SectionCard>
  </div>
);

/* --------------------------------------------------------------------- Main */

export const BiologySkillsWorkshop: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<SectionId>("method");

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white">
      <div className="h-[1.5cm] border-b border-[#222] bg-[#111]">
        <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-10">
          <button
            onClick={() => navigate("/practicals/olevel/biology")}
            className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#222] hover:text-white"
            aria-label="Back to Biology experiments"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">Experimental Skills &amp; Data Handling</h1>
            <p className="truncate text-[10px] uppercase tracking-wider text-gray-400 sm:text-xs">
              Paper 3 · Skill B and Skill C
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border p-5" style={{ borderColor: ACCENT_RING, background: ACCENT_SOFT }}>
            <h2 className="text-base font-bold text-white">Why this section exists</h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-50/90">
              Paper 3 will describe experiments you have never done. You cannot revise those individually — but the
              method never changes. Learn to identify the variables, build a table, plot a graph and evaluate the data,
              and you can answer a question on any apparatus at all.
            </p>
          </div>

          {/* Section tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {SECTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className="flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition"
                style={
                  section === id
                    ? { borderColor: ACCENT_RING, background: ACCENT, color: "#1c1206" }
                    : { borderColor: "#262626", background: "#161616", color: "#d1d5db" }
                }
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {section === "method" && <PlanningSection />}
            {section === "variables" && <VariablesSection />}
            {section === "tables" && <TablesSection />}
            {section === "graphs" && <GraphsSection />}
            {section === "evaluating" && <EvaluatingSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiologySkillsWorkshop;
