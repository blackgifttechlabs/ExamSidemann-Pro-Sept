import React from "react";
import { useNavigate } from "react-router-dom";
import { practicalBack } from '../../common/usePracticalBack';
import { ExperimentGameHeader } from "../../common/ExperimentGameChrome";
import { ExperimentSceneGate } from "../../common/ExperimentSceneLoader";

/* Biology-specific simulations */
import EnzymeActivitySim from "./EnzymeActivity";
import CatalaseActivitySim from "./CatalaseActivity";
import LimitingFactorsSim from "./LimitingFactors";
import PondweedRateSim from "./PondweedRate";
import SeedRespirationSim from "./SeedRespiration";
import OsmosisSim from "./Osmosis";
import DiffusionSim from "./Diffusion";
import PotometerSim from "./Potometer";
import MicroscopySim from "./Microscopy";

/**
 * Three of the Biology practicals are the same experiment as an existing
 * Combined Science simulation — the four food tests, the leaf starch test, and
 * detecting carbon dioxide from germinating seeds with limewater. Those sims are
 * reused here rather than duplicated, with the back navigation pointed at the
 * Biology landing page.
 */
import FoodSubstanceTestsSim from "../combined-science/FoodTests";
import PhotosynthesisSim from "../combined-science/Photosynthesis";
import RespirationSim from "../combined-science/Respiration";

const BIOLOGY_LANDING_ROUTE = "/practicals/olevel/biology";

interface BiologySimulationProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

interface BiologyScenePageProps {
  title: string;
  subtitle: string;
  symbol: React.ReactNode;
  loaderLabel: string;
  Simulation: React.ComponentType<BiologySimulationProps>;
  /** The newer sims draw their own HUD, so the outer header is hidden. */
  immersiveHeader?: boolean;
}

const BiologyScenePage: React.FC<BiologyScenePageProps> = ({
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

  const goBack = () => practicalBack(navigate, BIOLOGY_LANDING_ROUTE);

  return (
    <div className="flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      {!immersiveHeader && (
        <ExperimentGameHeader
          title={title}
          subtitle={subtitle}
          symbol={symbol}
          backLabel="Back to Biology experiments"
          onBack={goBack}
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
            onBack={goBack}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
  );
};

/* ------------------------------------------------ Food tests (biochemistry) */

export const BiologyFoodTestsPage: React.FC = () => (
  <BiologyScenePage
    title="Food Tests"
    subtitle="Benedict's, iodine, Biuret and the ethanol emulsion test"
    symbol="🧪"
    loaderLabel="Setting out the food-test reagents"
    Simulation={FoodSubstanceTestsSim}
  />
);

/* ------------------------------------------------------ Enzyme experiments */

export const BiologyEnzymeActivityPage: React.FC = () => (
  <BiologyScenePage
    title="Enzyme Activity"
    subtitle="Effect of temperature and pH on amylase"
    symbol="🧬"
    loaderLabel="Preparing the water baths and spotting tile"
    Simulation={EnzymeActivitySim}
    immersiveHeader
  />
);

export const BiologyCatalasePage: React.FC = () => (
  <BiologyScenePage
    title="Catalase & Hydrogen Peroxide"
    subtitle="Measuring the rate of oxygen production"
    symbol="🫧"
    loaderLabel="Connecting the gas syringe"
    Simulation={CatalaseActivitySim}
    immersiveHeader
  />
);

/* --------------------------------------------------------- Photosynthesis */

export const BiologyLeafStarchTestPage: React.FC = () => (
  <BiologyScenePage
    title="Testing a Leaf for Starch"
    subtitle="Destarching, decolourising and the iodine test"
    symbol="🌿"
    loaderLabel="Preparing the leaf starch test"
    Simulation={PhotosynthesisSim}
    immersiveHeader
  />
);

export const BiologyLimitingFactorsPage: React.FC = () => (
  <BiologyScenePage
    title="Requirements for Photosynthesis"
    subtitle="Light, chlorophyll and carbon dioxide"
    symbol="🍃"
    loaderLabel="Setting up the bell jars and variegated plants"
    Simulation={LimitingFactorsSim}
    immersiveHeader
  />
);

export const BiologyPondweedRatePage: React.FC = () => (
  <BiologyScenePage
    title="Light Intensity & Photosynthesis"
    subtitle="Counting oxygen bubbles from pondweed"
    symbol="🫧"
    loaderLabel="Setting the lamp along the metre rule"
    Simulation={PondweedRateSim}
    immersiveHeader
  />
);

/* --------------------------------------------------------------- Respiration */

export const BiologyRespirationCO2Page: React.FC = () => (
  <BiologyScenePage
    title="Carbon Dioxide from Germinating Seeds"
    subtitle="Detecting respiration with limewater"
    symbol="🌱"
    loaderLabel="Preparing the limewater apparatus"
    Simulation={RespirationSim}
  />
);

export const BiologySeedRespirationPage: React.FC = () => (
  <BiologyScenePage
    title="Respiration in Germinating vs Dead Seeds"
    subtitle="Comparing carbon dioxide and heat released"
    symbol="🌡️"
    loaderLabel="Filling the vacuum flasks"
    Simulation={SeedRespirationSim}
    immersiveHeader
  />
);

/* ------------------------------------------------------ Osmosis & diffusion */

export const BiologyOsmosisPage: React.FC = () => (
  <BiologyScenePage
    title="Osmosis"
    subtitle="Potato cylinders in sucrose, and visking tubing"
    symbol="💧"
    loaderLabel="Cutting the potato cylinders"
    Simulation={OsmosisSim}
    immersiveHeader
  />
);

export const BiologyDiffusionPage: React.FC = () => (
  <BiologyScenePage
    title="Diffusion"
    subtitle="Potassium manganate(VII) and ammonia vs HCl"
    symbol="🌫️"
    loaderLabel="Setting up the diffusion demonstrations"
    Simulation={DiffusionSim}
    immersiveHeader
  />
);

/* -------------------------------------------------------------- Transpiration */

export const BiologyPotometerPage: React.FC = () => (
  <BiologyScenePage
    title="Transpiration"
    subtitle="Measuring water uptake with a potometer"
    symbol="💦"
    loaderLabel="Assembling the potometer under water"
    Simulation={PotometerSim}
    immersiveHeader
  />
);

/* ----------------------------------------------------------------- Microscopy */

export const BiologyMicroscopyPage: React.FC = () => (
  <BiologyScenePage
    title="Microscopy & Cells"
    subtitle="Onion epidermis and cheek cell slides"
    symbol="🔬"
    loaderLabel="Setting out slides and coverslips"
    Simulation={MicroscopySim}
    immersiveHeader
  />
);
