import { CombinedScienceExperience } from '../../common/CombinedScienceExperience';
import React from "react";
import {
  ArrowLeft,
  CircuitBoard,
  Droplets,
  Filter,
  Flame,
  FlaskConical,
  Gauge,
  Leaf,
  Lightbulb,
  Sprout,
  TestTubes,
  Timer,
  Wind,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { practicalBack } from '../../common/usePracticalBack';
import { ExperimentGameHeader } from "../../common/ExperimentGameChrome";
import { ExperimentSceneGate } from "../../common/ExperimentSceneLoader";
import SaltSandSeparationSim from "./Separation";
import FoodSubstanceTestsSim from "./FoodTests";
import PhotosynthesisSim from "./Photosynthesis";
import RespirationSim from "./Respiration";
import SimpleElectricitySim from "./SimpleElectricity";
import RatesOfReactionSim from "./RatesOfReaction";
import TitrationSim from "./Titration";
import RustingOfIronSim from "./RustingOfIron";
import ForceAndMotionSim from "./ForceAndMotion";
import OxygenFromPondweedSim from "./OxygenFromPondweed";
import InhaledExhaledAirSim from "./InhaledExhaledAir";
import CandleOxygenSim from "./CandleOxygenTest";

export const CombinedScience: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-white">
      <div className="h-[1.5cm] border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-[#222] dark:bg-[#111]/95">
        <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-10">
          <button
            onClick={() => navigate("/practicals/olevel")}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-gray-400 dark:hover:bg-[#222] dark:hover:text-white"
            aria-label="Back to O Level Practicals"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">O Level Combined Science</h1>
            <p className="truncate text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-400 sm:text-xs">
              Select a practical experiment
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:gap-6 lg:px-10">
        <main className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-6 [&_svg]:brightness-75 dark:[&_svg]:brightness-100 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <button
            onClick={() => navigate("/practicals/olevel/combined-science/separation")}
            className="group w-full rounded-2xl border border-orange-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-orange-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <FlaskConical className="text-orange-400" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Separation of Salt and Sand</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Dissolve salt, filter out sand, dry the residue, then evaporate the filtrate to recover salt crystals.
                </p>
              </div>
              <div className="hidden gap-2 text-orange-300 sm:flex">
                <Filter size={22} />
                <Flame size={22} />
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/food-tests")}
            className="group w-full rounded-2xl border border-cyan-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <TestTubes className="text-cyan-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Food Tests</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Identify starch, reducing sugars, proteins and fats with the correct reagents and observations.
                </p>
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/photosynthesis")}
            className="group w-full rounded-2xl border border-emerald-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Leaf className="text-emerald-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Photosynthesis</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Test a light-exposed leaf for starch by boiling, decolourising, washing and adding iodine.
                </p>
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/oxygen-from-photosynthesis")}
            className="group w-full rounded-2xl border border-teal-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-teal-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-teal-500/20 bg-teal-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Droplets className="text-teal-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Oxygen from Photosynthesis</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Collect the gas bubbling from pondweed under a funnel and prove it is oxygen with a glowing splint.
                </p>
              </div>
              <div className="hidden gap-2 text-teal-300 sm:flex">
                <Lightbulb size={22} />
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/respiration")}
            className="group w-full rounded-2xl border border-lime-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-lime-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-lime-500/20 bg-lime-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Sprout className="text-lime-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Respiration</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Use germinating seeds and limewater to show that carbon dioxide is released during respiration.
                </p>
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/inhaled-exhaled-air")}
            className="group w-full rounded-2xl border border-violet-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-violet-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Wind className="text-violet-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Inhaled and Exhaled Air</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Breathe in and out through two tubes of limewater and count the breaths it takes for one to turn milky.
                </p>
              </div>
              <div className="hidden gap-2 text-violet-300 sm:flex">
                <TestTubes size={22} />
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/candle-oxygen-test")}
            className="group w-full rounded-2xl border border-orange-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-orange-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Flame className="text-orange-400" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Oxygen Content and a Candle</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Time how long a candle burns in a jar of inhaled air and in a jar of exhaled air, then compare.
                </p>
              </div>
              <div className="hidden gap-2 text-orange-300 sm:flex">
                <Timer size={22} />
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/simple-electricity")}
            className="group w-full rounded-2xl border border-amber-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <CircuitBoard className="text-amber-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Simple Electricity</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Build series and parallel bulb circuits, operate the switch and compare current and brightness.
                </p>
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/rates-of-reaction")}
            className="group w-full rounded-2xl border border-rose-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-rose-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Timer className="text-rose-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Rate of Reaction</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  React marble chips with acid and change the surface area, temperature and concentration to see what speeds it up.
                </p>
              </div>
              <div className="hidden gap-2 text-rose-300 sm:flex">
                <FlaskConical size={22} />
                <Flame size={22} />
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/titration")}
            className="group w-full rounded-2xl border border-fuchsia-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-fuchsia-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Droplets className="text-fuchsia-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Testing Acids &amp; Bases with Litmus</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Use both red and blue litmus paper to identify acidic, basic and neutral samples without contaminating the stock.
                </p>
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/rusting")}
            className="group w-full rounded-2xl border border-amber-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Wrench className="text-amber-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Rusting of Iron</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Compare nails in water, boiled water and dry air over a week to find the conditions needed for rusting.
                </p>
              </div>
            </div>
            </button>

            <button
            onClick={() => navigate("/practicals/olevel/combined-science/force-and-motion")}
            className="group w-full rounded-2xl border border-sky-500/25 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-sky-400/70 hover:bg-slate-50 hover:shadow-xl dark:bg-[#161616] dark:hover:bg-[#1a1a1a]"
          >
            <div className="flex w-full items-start justify-between gap-6">
              <div>
                <div className="mb-6 inline-flex rounded-xl border border-sky-500/20 bg-sky-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Gauge className="text-sky-300" size={32} />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Force and Motion</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                  Release a trolley down a ramp and read the ticker tape to see how an unbalanced force causes acceleration.
                </p>
              </div>
            </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export const SeparationPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPaper, setShowPaper] = React.useState(false);
  const [tutorialRequestKey, setTutorialRequestKey] = React.useState(0);
  const [tutorialMode, setTutorialMode] = React.useState<"tour" | "howto">("tour");
  const requestHowTo = () => {
    setShowPaper(false);
    setTutorialMode("howto");
    setTutorialRequestKey((key) => key + 1);
  };

  return (
    <CombinedScienceExperience title="Salt & Sand Separation">
    <div className="flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      <ExperimentGameHeader
        title="Salt & Sand Separation"
        subtitle="Combined Science practical"
        symbol="⚗️"
        backLabel="Back to Combined Science experiments"
        onBack={() => practicalBack(navigate, "/practicals/olevel/combined-science")}
        onRequestHowTo={requestHowTo}
        onRequestPaper={() => setShowPaper(true)}
      />

      <div className="min-h-0 w-full flex-1">
        <ExperimentSceneGate label="Preparing the separation bench">
          <SaltSandSeparationSim
            showPaper={showPaper}
            onClosePaper={() => setShowPaper(false)}
            tutorialRequestKey={tutorialRequestKey}
            tutorialMode={tutorialMode}
            onBack={() => practicalBack(navigate, "/practicals/olevel/combined-science")}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
    </CombinedScienceExperience>
  );
};

export const FoodTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPaper, setShowPaper] = React.useState(false);
  const [tutorialRequestKey, setTutorialRequestKey] = React.useState(0);
  const [tutorialMode, setTutorialMode] = React.useState<"tour" | "howto">("tour");
  const requestHowTo = () => {
    setShowPaper(false);
    setTutorialMode("howto");
    setTutorialRequestKey((key) => key + 1);
  };

  return (
    <CombinedScienceExperience title="Food Tests">
    <div className="flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      <ExperimentGameHeader
        title="Food Tests"
        subtitle="Combined Science practical"
        symbol="🧪"
        backLabel="Back to Combined Science experiments"
        onBack={() => practicalBack(navigate, "/practicals/olevel/combined-science")}
        onRequestHowTo={requestHowTo}
        onRequestPaper={() => setShowPaper(true)}
      />

      <div className="min-h-0 w-full flex-1">
        <FoodSubstanceTestsSim
          showPaper={showPaper}
          onClosePaper={() => setShowPaper(false)}
          tutorialRequestKey={tutorialRequestKey}
          tutorialMode={tutorialMode}
          onBack={() => practicalBack(navigate, "/practicals/olevel/combined-science")}
          onRequestHowTo={requestHowTo}
          onRequestPaper={() => setShowPaper(true)}
        />
      </div>
    </div>
    </CombinedScienceExperience>
  );
};

interface CombinedScienceSimulationProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

interface CombinedScienceScenePageProps {
  title: string;
  subtitle: string;
  symbol: React.ReactNode;
  loaderLabel: string;
  Simulation: React.ComponentType<CombinedScienceSimulationProps>;
  immersiveHeader?: boolean;
}

const CombinedScienceScenePage: React.FC<CombinedScienceScenePageProps> = ({
  title,
  subtitle,
  symbol,
  loaderLabel,
  Simulation,
  immersiveHeader = false,
}) => {
  const navigate = useNavigate();
  const [showPaper, setShowPaper] = React.useState(false);
  const [tutorialRequestKey, setTutorialRequestKey] = React.useState(0);
  const [tutorialMode, setTutorialMode] = React.useState<"tour" | "howto">("tour");

  const requestHowTo = () => {
    setShowPaper(false);
    setTutorialMode("howto");
    setTutorialRequestKey((key) => key + 1);
  };

  return (
    <CombinedScienceExperience title={title}>
    <div className="flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      {!immersiveHeader && (
        <ExperimentGameHeader
          title={title}
          subtitle={subtitle}
          symbol={symbol}
          backLabel="Back to Combined Science experiments"
          onBack={() => practicalBack(navigate, "/practicals/olevel/combined-science")}
          onRequestHowTo={requestHowTo}
          onRequestPaper={() => setShowPaper(true)}
        />
      )}

      <div className="min-h-0 w-full flex-1">
        <ExperimentSceneGate label={loaderLabel}>
          <Simulation
            showPaper={showPaper}
            onClosePaper={() => setShowPaper(false)}
            tutorialRequestKey={tutorialRequestKey}
            tutorialMode={tutorialMode}
            onBack={() => practicalBack(navigate, "/practicals/olevel/combined-science")}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
    </CombinedScienceExperience>
  );
};

export const PhotosynthesisPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Photosynthesis"
    subtitle="Leaf starch test"
    symbol="🌿"
    loaderLabel="Preparing the photosynthesis bench"
    Simulation={PhotosynthesisSim}
    immersiveHeader
  />
);

export const OxygenFromPhotosynthesisPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Oxygen from Photosynthesis"
    subtitle="Pondweed and the glowing splint test"
    symbol="🫧"
    loaderLabel="Setting up the pondweed apparatus"
    Simulation={OxygenFromPondweedSim}
    immersiveHeader
  />
);

export const InhaledExhaledAirPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Inhaled and Exhaled Air"
    subtitle="Comparing carbon dioxide with limewater"
    symbol="🫁"
    loaderLabel="Preparing the limewater tubes"
    Simulation={InhaledExhaledAirSim}
    immersiveHeader
  />
);

export const CandleOxygenTestPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Oxygen Content and a Candle"
    subtitle="Timing a candle in two gas jars"
    symbol="🕯️"
    loaderLabel="Setting up the gas jars"
    Simulation={CandleOxygenSim}
    immersiveHeader
  />
);

export const RespirationPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Respiration"
    subtitle="Respiration in germinating seeds"
    symbol="🌱"
    loaderLabel="Preparing the respiration apparatus"
    Simulation={RespirationSim}
  />
);

export const SimpleElectricityPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Simple Electricity"
    subtitle="Series and parallel circuits"
    symbol="⚡"
    loaderLabel="Building the electricity bench"
    Simulation={SimpleElectricitySim}
  />
);

export const RatesOfReactionPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Rate of Reaction"
    subtitle="Marble chips and hydrochloric acid"
    symbol="⚗️"
    loaderLabel="Preparing the rates of reaction bench"
    Simulation={RatesOfReactionSim}
    immersiveHeader
  />
);

export const TitrationPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Testing Acids & Bases with Litmus"
    subtitle="Red and blue litmus paper"
    symbol="🧪"
    loaderLabel="Preparing the litmus testing bench"
    Simulation={TitrationSim}
    immersiveHeader
  />
);

export const RustingOfIronPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Rusting of Iron"
    subtitle="Conditions needed for rusting"
    symbol="🧫"
    loaderLabel="Setting up the rusting test tubes"
    Simulation={RustingOfIronSim}
    immersiveHeader
  />
);

export const ForceAndMotionPage: React.FC = () => (
  <CombinedScienceScenePage
    title="Force and Motion"
    subtitle="Ticker tape on a ramp"
    symbol="🚗"
    loaderLabel="Setting up the ramp and ticker-timer"
    Simulation={ForceAndMotionSim}
    immersiveHeader
  />
);
