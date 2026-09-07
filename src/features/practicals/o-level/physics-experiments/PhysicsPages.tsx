import React from "react";
import { useNavigate } from "react-router-dom";
import { practicalBack } from '../../common/usePracticalBack';
import { ExperimentGameHeader } from "../../common/ExperimentGameChrome";
import { ExperimentSceneGate } from "../../common/ExperimentSceneLoader";
import PrincipleOfMomentsSim from "./PrincipleOfMoments";
import CentreOfGravitySim from "./CentreOfGravity";
import InclinedPlaneAccelerationSim from "./InclinedPlaneAcceleration";
import ConservationOfMomentumSim from "./ConservationOfMomentum";
import MachineEfficiencySim from "./MachineEfficiency";
import SpecificHeatSolidSim from "./SpecificHeatSolid";
import SpecificHeatLiquidSim from "./SpecificHeatLiquid";
import HeatingCoolingCurveSim from "./HeatingCoolingCurve";
import ExpansionOfSolidsSim from "./ExpansionOfSolids";
import BoylesLawSim from "./BoylesLaw";
import MagneticFieldLinesSim from "./MagneticFieldLines";
import MagneticMaterialsSim from "./MagneticMaterials";
import MagnetisationSim from "./Magnetisation";
import ResistanceOfAWireSim from "./ResistanceOfAWire";
import RheostatControlSim from "./RheostatControl";
import ResistorCombinationsSim from "./ResistorCombinations";
import ElectrostaticsSim from "./Electrostatics";

const PHYSICS_LANDING_ROUTE = "/practicals/olevel/physics";

interface PhysicsSimulationProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

interface PhysicsScenePageProps {
  title: string;
  subtitle: string;
  symbol: React.ReactNode;
  loaderLabel: string;
  Simulation: React.ComponentType<PhysicsSimulationProps>;
  /** Sims that draw their own in-scene HUD do not need the page-level header. */
  immersiveHeader?: boolean;
}

const PhysicsScenePage: React.FC<PhysicsScenePageProps> = ({
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
    <div className="flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      {!immersiveHeader && (
        <ExperimentGameHeader
          title={title}
          subtitle={subtitle}
          symbol={symbol}
          backLabel="Back to O Level Physics"
          onBack={() => practicalBack(navigate, PHYSICS_LANDING_ROUTE)}
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
            onBack={() => practicalBack(navigate, PHYSICS_LANDING_ROUTE)}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ Mechanics */

export const OLevelPrincipleOfMomentsPage: React.FC = () => (
  <PhysicsScenePage
    title="Principle of Moments"
    subtitle="Balancing a metre rule"
    symbol="⚖️"
    loaderLabel="Balancing the metre rule on its knife edge"
    Simulation={PrincipleOfMomentsSim}
    immersiveHeader
  />
);

export const OLevelCentreOfGravityPage: React.FC = () => (
  <PhysicsScenePage
    title="Centre of Gravity"
    subtitle="Plumb line and an irregular lamina"
    symbol="🎯"
    loaderLabel="Hanging the lamina from its pin"
    Simulation={CentreOfGravitySim}
    immersiveHeader
  />
);

export const OLevelInclinedPlanePage: React.FC = () => (
  <PhysicsScenePage
    title="Acceleration on an Inclined Plane"
    subtitle="Trolley and ticker-tape timer"
    symbol="📐"
    loaderLabel="Setting up the runway and ticker-timer"
    Simulation={InclinedPlaneAccelerationSim}
    immersiveHeader
  />
);

export const OLevelConservationOfMomentumPage: React.FC = () => (
  <PhysicsScenePage
    title="Conservation of Momentum"
    subtitle="Trolley collisions on a level track"
    symbol="💥"
    loaderLabel="Levelling the track and weighing the trolleys"
    Simulation={ConservationOfMomentumSim}
    immersiveHeader
  />
);

export const OLevelMachineEfficiencyPage: React.FC = () => (
  <PhysicsScenePage
    title="Efficiency of a Simple Machine"
    subtitle="Pulley systems, MA, VR and efficiency"
    symbol="🪝"
    loaderLabel="Rigging the pulley blocks"
    Simulation={MachineEfficiencySim}
    immersiveHeader
  />
);

/* ----------------------------------------------------------------------- Heat */

export const OLevelSpecificHeatSolidPage: React.FC = () => (
  <PhysicsScenePage
    title="Specific Heat Capacity of a Solid"
    subtitle="Immersion heater in a metal block"
    symbol="🔥"
    loaderLabel="Wiring up the immersion heater"
    Simulation={SpecificHeatSolidSim}
    immersiveHeader
  />
);

export const OLevelSpecificHeatLiquidPage: React.FC = () => (
  <PhysicsScenePage
    title="Specific Heat Capacity of a Liquid"
    subtitle="Calorimeter, stirrer and heater"
    symbol="🧪"
    loaderLabel="Filling and lagging the calorimeter"
    Simulation={SpecificHeatLiquidSim}
    immersiveHeader
  />
);

export const OLevelHeatingCoolingCurvePage: React.FC = () => (
  <PhysicsScenePage
    title="Heating and Cooling Curves"
    subtitle="Melting point from the plateau"
    symbol="🌡️"
    loaderLabel="Warming the water bath"
    Simulation={HeatingCoolingCurveSim}
    immersiveHeader
  />
);

export const OLevelExpansionOfSolidsPage: React.FC = () => (
  <PhysicsScenePage
    title="Expansion of Solids"
    subtitle="Ball and ring, and the bimetallic strip"
    symbol="🔩"
    loaderLabel="Lighting the Bunsen burner"
    Simulation={ExpansionOfSolidsSim}
    immersiveHeader
  />
);

export const OLevelBoylesLawPage: React.FC = () => (
  <PhysicsScenePage
    title="Boyle's Law"
    subtitle="Pressure and volume of trapped air"
    symbol="💨"
    loaderLabel="Checking the Bourdon gauge for leaks"
    Simulation={BoylesLawSim}
    immersiveHeader
  />
);

/* ----------------------------------------------------------------- Magnetism */

export const OLevelMagneticFieldLinesPage: React.FC = () => (
  <PhysicsScenePage
    title="Magnetic Field Lines"
    subtitle="Plotting compass and iron filings"
    symbol="🧭"
    loaderLabel="Laying the magnet on a sheet of plain paper"
    Simulation={MagneticFieldLinesSim}
    immersiveHeader
  />
);

export const OLevelMagneticMaterialsPage: React.FC = () => (
  <PhysicsScenePage
    title="Magnetic and Non-Magnetic Materials"
    subtitle="Testing iron, steel, cobalt and nickel"
    symbol="🧲"
    loaderLabel="Laying out the tray of specimens"
    Simulation={MagneticMaterialsSim}
    immersiveHeader
  />
);

export const OLevelMagnetisationPage: React.FC = () => (
  <PhysicsScenePage
    title="Magnetising a Steel Bar"
    subtitle="Stroking method and the solenoid"
    symbol="🧲"
    loaderLabel="Fetching the stroking magnet and the solenoid"
    Simulation={MagnetisationSim}
    immersiveHeader
  />
);

/* --------------------------------------------------------------- Electricity */

export const OLevelResistanceOfAWirePage: React.FC = () => (
  <PhysicsScenePage
    title="Resistance of a Wire"
    subtitle="Length, thickness and resistivity"
    symbol="⚡"
    loaderLabel="Stretching the resistance wire along the metre rule"
    Simulation={ResistanceOfAWireSim}
    immersiveHeader
  />
);

export const OLevelRheostatPage: React.FC = () => (
  <PhysicsScenePage
    title="Using a Rheostat"
    subtitle="Controlling the current in a circuit"
    symbol="🎚️"
    loaderLabel="Wiring the rheostat in series with the lamp"
    Simulation={RheostatControlSim}
    immersiveHeader
  />
);

export const OLevelResistorCombinationsPage: React.FC = () => (
  <PhysicsScenePage
    title="Resistors in Series and Parallel"
    subtitle="Predict the total, then measure it"
    symbol="🔀"
    loaderLabel="Mounting the resistors on the board"
    Simulation={ResistorCombinationsSim}
    immersiveHeader
  />
);

export const OLevelElectrostaticsPage: React.FC = () => (
  <PhysicsScenePage
    title="Electrostatics and Capacitors"
    subtitle="Charging by friction, and charging a capacitor"
    symbol="⚡"
    loaderLabel="Drying the rods and hanging the stirrup"
    Simulation={ElectrostaticsSim}
    immersiveHeader
  />
);
