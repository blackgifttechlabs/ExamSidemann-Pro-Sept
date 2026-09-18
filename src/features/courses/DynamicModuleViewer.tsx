import React, { useState, useEffect, useRef } from 'react';

// Every lesson below is code-split. Loading them eagerly meant one notes page
// pulled in the whole curriculum (~17MB) before it could render 60KB of it,
// which locked up the main thread. `lazyLesson` also retries a failed chunk
// twice, because React.lazy caches a rejection forever and a single dropped
// request would otherwise leave the page spinning until a manual reload.
type LessonModule = { default: React.ComponentType<any> };

const lazyLesson = (loader: () => Promise<LessonModule>) =>
  React.lazy(() =>
    loader().catch(() =>
      new Promise((resolve) => setTimeout(resolve, 400))
        .then(loader)
        .catch(() => new Promise((resolve) => setTimeout(resolve, 1200)).then(loader)),
    ),
  );

import {
    BookOpen, ArrowLeft, CheckCircle, 
    List, Minus, Plus, X, ChevronRight, Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CURRICULUM_REGISTRY, GEOGRAPHY_OUTCOMES } from '../../data/constants';
import { abbreviationFor } from '../../data/seoKeywords';
import { AdSense } from '../analytics/AdSense';
const ZjcDynamicSubjectViewer = lazyLesson(() => import('./zjc/DynamicSubjectViewer').then(m => ({ default: m.DynamicSubjectViewer })));
const MathRenderGate = lazyLesson(() => import('./zjc/form-1/mathematics/mathLessonUtils').then(m => ({ default: m.MathRenderGate })));
import { hasCourseSubjectContent } from './courseContentAvailability';
import { LessonScopeContext, useLessonScrollMemory } from './lessonProgress';
import { usePageScrollLock } from '../../components/ui/pageScrollLock';
import './schoolLessonResponsive.css';


// --- Curriculum Component Imports ---

// Shared Computer Science course for Forms 1–4, stored under its Form 4 source folder.
const Form4ComputerScienceLO1 = lazyLesson(() => import('./o-level/form-4/computer-science/LearningOutcome1'));
const Form4ComputerScienceLO2 = lazyLesson(() => import('./o-level/form-4/computer-science/LearningOutcome2'));
const Form4ComputerScienceLO3 = lazyLesson(() => import('./o-level/form-4/computer-science/LearningOutcome3'));
const Form4ComputerScienceLO4 = lazyLesson(() => import('./o-level/form-4/computer-science/LearningOutcome4'));
const Form4ComputerScienceLO5 = lazyLesson(() => import('./o-level/form-4/computer-science/LearningOutcome5'));
const Form4ComputerScienceLO6 = lazyLesson(() => import('./o-level/form-4/computer-science/LearningOutcome6'));

// Form 4 Mathematics
const Form4MathGeneralArithmetic = lazyLesson(() => import('./o-level/form-4/mathematics/GeneralArithmetic').then(m => ({ default: m.GeneralArithmetic })));
const Form4MathGeometricalConstructions = lazyLesson(() => import('./o-level/form-4/mathematics/GeometricalConstructions').then(m => ({ default: m.GeometricalConstructions })));
const Form4MathCircleGeometry = lazyLesson(() => import('./o-level/form-4/mathematics/CircleGeometry').then(m => ({ default: m.CircleGeometry })));
const Form4MathTheSineRule = lazyLesson(() => import('./o-level/form-4/mathematics/TheSineRule').then(m => ({ default: m.TheSineRule })));
const Form4MathGraphsGradient = lazyLesson(() => import('./o-level/form-4/mathematics/GraphsGradient').then(m => ({ default: m.GraphsGradient })));
const Form4MathVariation = lazyLesson(() => import('./o-level/form-4/mathematics/Variation').then(m => ({ default: m.Variation })));
const Form4MathMensurationSolidShapes = lazyLesson(() => import('./o-level/form-4/mathematics/MensurationSolidShapes').then(m => ({ default: m.MensurationSolidShapes })));
const Form4MathTheCosineRule = lazyLesson(() => import('./o-level/form-4/mathematics/TheCosineRule').then(m => ({ default: m.TheCosineRule })));
const Form4MathConsumerArithmetic2 = lazyLesson(() => import('./o-level/form-4/mathematics/ConsumerArithmetic2').then(m => ({ default: m.ConsumerArithmetic2 })));
const Form4MathMatrices2 = lazyLesson(() => import('./o-level/form-4/mathematics/Matrices2').then(m => ({ default: m.Matrices2 })));
const Form4MathGeometricalTransformations3 = lazyLesson(() => import('./o-level/form-4/mathematics/GeometricalTransformations3').then(m => ({ default: m.GeometricalTransformations3 })));
const Form4MathGraphsCubicInverse = lazyLesson(() => import('./o-level/form-4/mathematics/GraphsCubicInverse').then(m => ({ default: m.GraphsCubicInverse })));
const Form4MathLengthsAnglesSolids = lazyLesson(() => import('./o-level/form-4/mathematics/LengthsAnglesSolids').then(m => ({ default: m.LengthsAnglesSolids })));
const Form4MathFractionsInAlgebra = lazyLesson(() => import('./o-level/form-4/mathematics/FractionsInAlgebra'));
const Form4MathGraphsVelocityTime = lazyLesson(() => import('./o-level/form-4/mathematics/GraphsVelocityTime').then(m => ({ default: m.GraphsVelocityTime })));
const Form4MathInequalities = lazyLesson(() => import('./o-level/form-4/mathematics/Inequalities').then(m => ({ default: m.Inequalities })));
const Form4MathVectors = lazyLesson(() => import('./o-level/form-4/mathematics/Vectors').then(m => ({ default: m.Vectors })));
const Form4MathProbabilities = lazyLesson(() => import('./o-level/form-4/mathematics/Probabilities').then(m => ({ default: m.Probabilities })));

// Form 3 Combined Science
const Form3CombinedScienceBiology = lazyLesson(() => import('./o-level/form-3/combined-science/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const Form3CombinedScienceChemistry = lazyLesson(() => import('./o-level/form-3/combined-science/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const Form3CombinedSciencePhysics = lazyLesson(() => import('./o-level/form-3/combined-science/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));

// Form 4 Combined Science
const Form4CombinedScienceBiology = lazyLesson(() => import('./o-level/form-4/combined-science/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const Form4CombinedScienceChemistry = lazyLesson(() => import('./o-level/form-4/combined-science/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const Form4CombinedSciencePhysics = lazyLesson(() => import('./o-level/form-4/combined-science/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));

// Family and Religious Studies (FRS) - Forms 1 to 4
const Form1FrsTopic1 = lazyLesson(() => import('./zjc/form-1/frs/topic1').then(m => ({ default: m.topic1 })));
const Form1FrsTopic2 = lazyLesson(() => import('./zjc/form-1/frs/topic2').then(m => ({ default: m.topic2 })));

const Form2FrsTopic1 = lazyLesson(() => import('./zjc/form-2/frs/topic1').then(m => ({ default: m.topic1 })));
const Form2FrsTopic2 = lazyLesson(() => import('./zjc/form-2/frs/topic2').then(m => ({ default: m.topic2 })));

const Form3FrsTopic1 = lazyLesson(() => import('./o-level/form-3/frs/topic1').then(m => ({ default: m.topic1 })));
const Form3FrsTopic2 = lazyLesson(() => import('./o-level/form-3/frs/topic2').then(m => ({ default: m.topic2 })));

const Form4FrsTopic1 = lazyLesson(() => import('./o-level/form-4/frs/topic1').then(m => ({ default: m.topic1 })));
const Form4FrsTopic2 = lazyLesson(() => import('./o-level/form-4/frs/topic2').then(m => ({ default: m.topic2 })));

// Shared Geography course for Forms 3–4, stored under its Form 3 source folder.
const Form3GeoLO1 = lazyLesson(() => import('./o-level/form-3/geography/BasicTechniquesAndSkills').then(m => ({ default: m.BasicTechniquesAndSkills })));
const Form3GeoLO2 = lazyLesson(() => import('./o-level/form-3/geography/WeatherAndClimateStudies').then(m => ({ default: m.WeatherAndClimateStudies })));
const Form3GeoLO3 = lazyLesson(() => import('./o-level/form-3/geography/LandformStudies').then(m => ({ default: m.LandformStudies })));
const Form3GeoLO4 = lazyLesson(() => import('./o-level/form-3/geography/BioticStudies').then(m => ({ default: m.BioticStudies })));
const Form3GeoLO5 = lazyLesson(() => import('./o-level/form-3/geography/NaturalResourceStudies').then(m => ({ default: m.NaturalResourceStudies })));
const Form3GeoLO6 = lazyLesson(() => import('./o-level/form-3/geography/AgriculturalStudies').then(m => ({ default: m.AgriculturalStudies })));
const Form3GeoLO7 = lazyLesson(() => import('./o-level/form-3/geography/IndustrialStudies').then(m => ({ default: m.IndustrialStudies })));
const Form3GeoLO8 = lazyLesson(() => import('./o-level/form-3/geography/SettlementAndPopulationStudies').then(m => ({ default: m.SettlementAndPopulationStudies })));
const Form3GeoLO9 = lazyLesson(() => import('./o-level/form-3/geography/TransportAndTradeStudies').then(m => ({ default: m.TransportAndTradeStudies })));

// Shared Physics course for Forms 3–4, stored under its Form 3 source folder.
const PhysicsLO1  = lazyLesson(() => import('./o-level/form-3/physics/MeasurementAndPhysicalQuantities').then(m => ({ default: m.MeasurementAndPhysicalQuantities })));
const PhysicsLO2  = lazyLesson(() => import('./o-level/form-3/physics/Kinematics').then(m => ({ default: m.Kinematics })));
const PhysicsLO3  = lazyLesson(() => import('./o-level/form-3/physics/Forces').then(m => ({ default: m.Forces })));
const PhysicsLO4  = lazyLesson(() => import('./o-level/form-3/physics/Machines').then(m => ({ default: m.Machines })));
const PhysicsLO5  = lazyLesson(() => import('./o-level/form-3/physics/MechanicalStructures').then(m => ({ default: m.MechanicalStructures })));
const PhysicsLO6  = lazyLesson(() => import('./o-level/form-3/physics/WorkEnergyAndPower').then(m => ({ default: m.WorkEnergyAndPower })));
const PhysicsLO7  = lazyLesson(() => import('./o-level/form-3/physics/ThermalPhysics').then(m => ({ default: m.ThermalPhysics })));
const PhysicsLO8  = lazyLesson(() => import('./o-level/form-3/physics/InternalCombustionEngines').then(m => ({ default: m.InternalCombustionEngines })));
const PhysicsLO9  = lazyLesson(() => import('./o-level/form-3/physics/Waves').then(m => ({ default: m.Waves })));
const PhysicsLO10 = lazyLesson(() => import('./o-level/form-3/physics/Optics').then(m => ({ default: m.Optics })));
const PhysicsLO11 = lazyLesson(() => import('./o-level/form-3/physics/Electricity').then(m => ({ default: m.Electricity })));
const PhysicsLO12 = lazyLesson(() => import('./o-level/form-3/physics/Magnetism').then(m => ({ default: m.Magnetism })));
const PhysicsLO13 = lazyLesson(() => import('./o-level/form-3/physics/Electromagnetism').then(m => ({ default: m.Electromagnetism })));
const PhysicsLO14 = lazyLesson(() => import('./o-level/form-3/physics/Electronics').then(m => ({ default: m.Electronics })));
const PhysicsLO15 = lazyLesson(() => import('./o-level/form-3/physics/AtomicAndNuclearPhysics').then(m => ({ default: m.AtomicAndNuclearPhysics })));

// Form 4 Principles of Accounting
const Form4AccountingLO1 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/TrialBalanceAndErrors'));
const Form4AccountingLO2 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/AccountingRatios'));
const Form4AccountingLO3 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/SingleEntryAndIncompleteRecords'));
const Form4AccountingLO4 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/ManufacturingAccounts'));
const Form4AccountingLO5 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/PartnershipsFormation'));
const Form4AccountingLO6 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/CompanyAccounts'));
const Form4AccountingLO7 = lazyLesson(() => import('./o-level/form-4/principles-of-accounting/BusinessEthics'));

// Polytechnic - NC IT
const PolyLO1 = lazyLesson(() => import('./polytechnic/nc-it/csm/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const PolyLO2 = lazyLesson(() => import('./polytechnic/nc-it/csm/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const PolyLO3 = lazyLesson(() => import('./polytechnic/nc-it/csm/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const PolyLO4 = lazyLesson(() => import('./polytechnic/nc-it/csm/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const PolyLO5 = lazyLesson(() => import('./polytechnic/nc-it/csm/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// Programming Concepts
const ProgLO1 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const ProgLO2 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const ProgLO3 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const ProgLO4 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const ProgLO5 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const ProgLO6 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const ProgLO7 = lazyLesson(() => import('./polytechnic/nc-it/programming-concepts/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));

// Database Concepts
const DatabaseConcepts = lazyLesson(() => import('./polytechnic/nc-it/database-concepts/DatabaseConcepts').then(m => ({ default: m.DatabaseConcepts })));
const SQLPractice = lazyLesson(() => import('./polytechnic/nc-it/database-concepts/SQLPractice').then(m => ({ default: m.SQLPractice })));

// Computer Networking
const ComputerNetworking = lazyLesson(() => import('./polytechnic/nc-it/computer-networking/ComputerNetworking').then(m => ({ default: m.ComputerNetworking })));

// Computer Security
const ComputerSecurity = lazyLesson(() => import('./polytechnic/nc-it/computer-security/ComputerSecurity').then(m => ({ default: m.ComputerSecurity })));

// National Studies
const NationalStudies = lazyLesson(() => import('./polytechnic/nc-it/national-studies/NationalStudies').then(m => ({ default: m.NationalStudies })));

// Workplace Communication
const WorkLO1 = lazyLesson(() => import('./polytechnic/nc-it/workplace-communication/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const WorkLO2 = lazyLesson(() => import('./polytechnic/nc-it/workplace-communication/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const WorkGrammar = lazyLesson(() => import('./polytechnic/nc-it/workplace-communication/EnglishGrammar').then(m => ({ default: m.EnglishGrammar })));

// Entrepreneurship Skills Development
const EntrepLO1 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const EntrepLO2 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const EntrepLO3 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const EntrepLO4 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const EntrepLO5 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// --- NC Auto Electrics Imports ---
// Safety, Health, Env & Fitting/Machining
const SafheaLO1 = lazyLesson(() => import('./polytechnic/nc-auto/safety-health-env/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const SafheaLO2 = lazyLesson(() => import('./polytechnic/nc-auto/safety-health-env/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const SafheaLO3 = lazyLesson(() => import('./polytechnic/nc-auto/safety-health-env/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const SafheaLO4 = lazyLesson(() => import('./polytechnic/nc-auto/safety-health-env/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));

// Electrical & Electronics Fundamentals
const EleeleLO1 = lazyLesson(() => import('./polytechnic/nc-auto/electrical-electronics-fundamentals/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const EleeleLO2 = lazyLesson(() => import('./polytechnic/nc-auto/electrical-electronics-fundamentals/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const EleeleLO3 = lazyLesson(() => import('./polytechnic/nc-auto/electrical-electronics-fundamentals/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));

// Automotive Comm & Computer Apps
const AutcomLO1 = lazyLesson(() => import('./polytechnic/nc-auto/automotive-comm-computer-apps/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const AutcomLO2 = lazyLesson(() => import('./polytechnic/nc-auto/automotive-comm-computer-apps/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));

// Motor Vehicle Systems Minor Service
const MotvehLO1 = lazyLesson(() => import('./polytechnic/nc-auto/motor-vehicle-systems-minor-service/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const MotvehLO2 = lazyLesson(() => import('./polytechnic/nc-auto/motor-vehicle-systems-minor-service/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const MotvehLO3 = lazyLesson(() => import('./polytechnic/nc-auto/motor-vehicle-systems-minor-service/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));

// Wiring Lighting & Auxiliary Systems
const WirligLO1 = lazyLesson(() => import('./polytechnic/nc-auto/wiring-lighting-auxiliary-systems/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const WirligLO2 = lazyLesson(() => import('./polytechnic/nc-auto/wiring-lighting-auxiliary-systems/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const WirligLO3 = lazyLesson(() => import('./polytechnic/nc-auto/wiring-lighting-auxiliary-systems/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));

// Automotive Eng Maths & Science
const AutengLO1 = lazyLesson(() => import('./polytechnic/nc-auto/automotive-eng-maths-science/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const AutengLO2 = lazyLesson(() => import('./polytechnic/nc-auto/automotive-eng-maths-science/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));

// Electronic Fuel Injection Maint.
const ElefueLO1 = lazyLesson(() => import('./polytechnic/nc-auto/electronic-fuel-injection-maint/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const ElefueLO2 = lazyLesson(() => import('./polytechnic/nc-auto/electronic-fuel-injection-maint/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const ElefueLO3 = lazyLesson(() => import('./polytechnic/nc-auto/electronic-fuel-injection-maint/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const ElefueLO4 = lazyLesson(() => import('./polytechnic/nc-auto/electronic-fuel-injection-maint/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));

// Ignition, Starting & Charging Syst.
const IgnstaLO1 = lazyLesson(() => import('./polytechnic/nc-auto/ignition-starting-charging-syst/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const IgnstaLO2 = lazyLesson(() => import('./polytechnic/nc-auto/ignition-starting-charging-syst/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const IgnstaLO3 = lazyLesson(() => import('./polytechnic/nc-auto/ignition-starting-charging-syst/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const IgnstaLO4 = lazyLesson(() => import('./polytechnic/nc-auto/ignition-starting-charging-syst/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// --- End NC Auto Electrics Imports ---

// ND IT - Hardware Administration
const HardAdminLO1 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const HardAdminLO2 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const HardAdminLO3 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const HardAdminLO4 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const HardAdminLO5 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const HardAdminLO6 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const HardAdminLO7 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const HardAdminLO8 = lazyLesson(() => import('./polytechnic/nd-it/hardware-administration/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));

// ND IT - Network Administration
const NetAdminLO1 = lazyLesson(() => import('./polytechnic/nd-it/network-administration/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NetAdminLO2 = lazyLesson(() => import('./polytechnic/nd-it/network-administration/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NetAdminLO3 = lazyLesson(() => import('./polytechnic/nd-it/network-administration/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NetAdminLO4 = lazyLesson(() => import('./polytechnic/nd-it/network-administration/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));

// ND IT - Database Administration
const DbaLO1 = lazyLesson(() => import('./polytechnic/nd-it/database-administration/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const DbaLO2 = lazyLesson(() => import('./polytechnic/nd-it/database-administration/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const DbaLO3 = lazyLesson(() => import('./polytechnic/nd-it/database-administration/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const DbaLO4 = lazyLesson(() => import('./polytechnic/nd-it/database-administration/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const DbaLO5 = lazyLesson(() => import('./polytechnic/nd-it/database-administration/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// ND IT - Software Engineering
const SoftEngLO1 = lazyLesson(() => import('./polytechnic/nd-it/software-engineering/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const SoftEngLO2 = lazyLesson(() => import('./polytechnic/nd-it/software-engineering/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const SoftEngLO3 = lazyLesson(() => import('./polytechnic/nd-it/software-engineering/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const SoftEngLO4 = lazyLesson(() => import('./polytechnic/nd-it/software-engineering/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const SoftEngLO5 = lazyLesson(() => import('./polytechnic/nd-it/software-engineering/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const SoftEngLO6 = lazyLesson(() => import('./polytechnic/nd-it/software-engineering/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));

// ND IT - Object Oriented Programming
const OopLO1 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const OopLO2 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const OopLO3 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const OopLO4 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const OopLO5 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const OopLO6 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const OopLO7 = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const PracticeCSharp = lazyLesson(() => import('./polytechnic/nd-it/object-oriented-programming/PracticeCSharp').then(m => ({ default: m.PracticeCSharp })));

// ND IT - Web Development
const WebDevLO1 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const WebDevLO2 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const WebDevLO3 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const WebDevLO4 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const WebDevLO5 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const WebDevLO6 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const WebDevLO7 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const WebDevLO8 = lazyLesson(() => import('./polytechnic/nd-it/web-development/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));

// ND IT - Information Security
const InfoSecLO1 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const InfoSecLO2 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const InfoSecLO3 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const InfoSecLO4 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const InfoSecLO5 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const InfoSecLO6 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const InfoSecLO7 = lazyLesson(() => import('./polytechnic/nd-it/information-security/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));

// ND IT - Operating Systems Administration
const OpSysLO1 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const OpSysLO2 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const OpSysLO3 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const OpSysLO4 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const OpSysLO5 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const OpSysLO6 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const OpSysLO7 = lazyLesson(() => import('./polytechnic/nd-it/operating-systems-administration/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));

// ND IT - Design & Analysis of Algorithms
const DaaLO1 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const DaaLO2 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const DaaLO3 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const DaaLO4 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const DaaLO5 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const DaaLO6 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const DaaLO7 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const DaaLO8 = lazyLesson(() => import('./polytechnic/nd-it/design-and-analysis-of-algorithms/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));

// ND IT - Research & Project Management
const RpmLO1 = lazyLesson(() => import('./polytechnic/nd-it/research-and-project-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const RpmLO2 = lazyLesson(() => import('./polytechnic/nd-it/research-and-project-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const RpmLO3 = lazyLesson(() => import('./polytechnic/nd-it/research-and-project-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const RpmLO4 = lazyLesson(() => import('./polytechnic/nd-it/research-and-project-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const RpmLO5 = lazyLesson(() => import('./polytechnic/nd-it/research-and-project-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// NC Records Management - Archiving
const ArchLO1 = lazyLesson(() => import('./polytechnic/records-nc/archiving/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const ArchLO2 = lazyLesson(() => import('./polytechnic/records-nc/archiving/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const ArchLO3 = lazyLesson(() => import('./polytechnic/records-nc/archiving/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const ArchLO4 = lazyLesson(() => import('./polytechnic/records-nc/archiving/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// NC Records Management - Classification of Records
const ClassRecLO1 = lazyLesson(() => import('./polytechnic/records-nc/classification-of-records/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const ClassRecLO2 = lazyLesson(() => import('./polytechnic/records-nc/classification-of-records/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const ClassRecLO3 = lazyLesson(() => import('./polytechnic/records-nc/classification-of-records/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
// NC Records Management - Digital & Conv. Mail Management
const DigMailLO1 = lazyLesson(() => import('./polytechnic/records-nc/digital-conv-mail-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const DigMailLO2 = lazyLesson(() => import('./polytechnic/records-nc/digital-conv-mail-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const DigMailLO3 = lazyLesson(() => import('./polytechnic/records-nc/digital-conv-mail-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const DigMailLO4 = lazyLesson(() => import('./polytechnic/records-nc/digital-conv-mail-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// NC Records Management - Digital Filing
const DigFilLO1 = lazyLesson(() => import('./polytechnic/records-nc/digital-filing/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const DigFilLO2 = lazyLesson(() => import('./polytechnic/records-nc/digital-filing/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const DigFilLO3 = lazyLesson(() => import('./polytechnic/records-nc/digital-filing/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const DigFilLO4 = lazyLesson(() => import('./polytechnic/records-nc/digital-filing/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const DigFilLO5 = lazyLesson(() => import('./polytechnic/records-nc/digital-filing/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
// NC Records Management - Reception Management
const RecManLO1 = lazyLesson(() => import('./polytechnic/records-nc/reception-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const RecManLO2 = lazyLesson(() => import('./polytechnic/records-nc/reception-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const RecManLO3 = lazyLesson(() => import('./polytechnic/records-nc/reception-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
// NC Records Management - Records Preservation
const RecPresLO1 = lazyLesson(() => import('./polytechnic/records-nc/records-preservation/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const RecPresLO2 = lazyLesson(() => import('./polytechnic/records-nc/records-preservation/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const RecPresLO3 = lazyLesson(() => import('./polytechnic/records-nc/records-preservation/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const RecPresLO4 = lazyLesson(() => import('./polytechnic/records-nc/records-preservation/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const RecPresLO5 = lazyLesson(() => import('./polytechnic/records-nc/records-preservation/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const RecPresLO6 = lazyLesson(() => import('./polytechnic/records-nc/records-preservation/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
// NC Records Management - Reprography
const ReproLO1 = lazyLesson(() => import('./polytechnic/records-nc/reprography/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const ReproLO2 = lazyLesson(() => import('./polytechnic/records-nc/reprography/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const ReproLO3 = lazyLesson(() => import('./polytechnic/records-nc/reprography/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const ReproLO4 = lazyLesson(() => import('./polytechnic/records-nc/reprography/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const ReproLO5 = lazyLesson(() => import('./polytechnic/records-nc/reprography/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const ReproLO6 = lazyLesson(() => import('./polytechnic/records-nc/reprography/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));

// ND Records & Information Management - Records & Information Management
const NdRecInfoLO1 = lazyLesson(() => import('./polytechnic/records-nd/records-and-information-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdRecInfoLO2 = lazyLesson(() => import('./polytechnic/records-nd/records-and-information-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdRecInfoLO3 = lazyLesson(() => import('./polytechnic/records-nd/records-and-information-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdRecInfoLO4 = lazyLesson(() => import('./polytechnic/records-nd/records-and-information-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdRecInfoLO5 = lazyLesson(() => import('./polytechnic/records-nd/records-and-information-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdRecInfoLO6 = lazyLesson(() => import('./polytechnic/records-nd/records-and-information-management/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));

// ND Records & Information Management - Preservation Management
const NdPresLO1 = lazyLesson(() => import('./polytechnic/records-nd/preservation-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPresLO2 = lazyLesson(() => import('./polytechnic/records-nd/preservation-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPresLO3 = lazyLesson(() => import('./polytechnic/records-nd/preservation-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPresLO4 = lazyLesson(() => import('./polytechnic/records-nd/preservation-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPresLO5 = lazyLesson(() => import('./polytechnic/records-nd/preservation-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// ND Records & Information Management - Database Analysis & Design
const NdDbLO1 = lazyLesson(() => import('./polytechnic/records-nd/database-analysis-and-design/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdDbLO2 = lazyLesson(() => import('./polytechnic/records-nd/database-analysis-and-design/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdDbLO3 = lazyLesson(() => import('./polytechnic/records-nd/database-analysis-and-design/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdDbLO4 = lazyLesson(() => import('./polytechnic/records-nd/database-analysis-and-design/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));

// ND Records & Information Management - Information Literacy
const NdInfoLitLO1 = lazyLesson(() => import('./polytechnic/records-nd/information-literacy/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdInfoLitLO2 = lazyLesson(() => import('./polytechnic/records-nd/information-literacy/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdInfoLitLO3 = lazyLesson(() => import('./polytechnic/records-nd/information-literacy/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdInfoLitLO4 = lazyLesson(() => import('./polytechnic/records-nd/information-literacy/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdInfoLitLO5 = lazyLesson(() => import('./polytechnic/records-nd/information-literacy/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// ND Records & Information Management - Records Centre Management
const NdRecCentLO1 = lazyLesson(() => import('./polytechnic/records-nd/records-centre-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdRecCentLO2 = lazyLesson(() => import('./polytechnic/records-nd/records-centre-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdRecCentLO3 = lazyLesson(() => import('./polytechnic/records-nd/records-centre-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdRecCentLO4 = lazyLesson(() => import('./polytechnic/records-nd/records-centre-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdRecCentLO5 = lazyLesson(() => import('./polytechnic/records-nd/records-centre-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdRecCentLO6 = lazyLesson(() => import('./polytechnic/records-nd/records-centre-management/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));

// ND Records & Information Management - Reprographics
const NdReproLO1 = lazyLesson(() => import('./polytechnic/records-nd/reprographics/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdReproLO2 = lazyLesson(() => import('./polytechnic/records-nd/reprographics/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdReproLO3 = lazyLesson(() => import('./polytechnic/records-nd/reprographics/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdReproLO4 = lazyLesson(() => import('./polytechnic/records-nd/reprographics/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdReproLO5 = lazyLesson(() => import('./polytechnic/records-nd/reprographics/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// ND Records & Information Management - Archives Administration
const NdArchLO1 = lazyLesson(() => import('./polytechnic/records-nd/archives-administration/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdArchLO2 = lazyLesson(() => import('./polytechnic/records-nd/archives-administration/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdArchLO3 = lazyLesson(() => import('./polytechnic/records-nd/archives-administration/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdArchLO4 = lazyLesson(() => import('./polytechnic/records-nd/archives-administration/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdArchLO5 = lazyLesson(() => import('./polytechnic/records-nd/archives-administration/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdArchLO6 = lazyLesson(() => import('./polytechnic/records-nd/archives-administration/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));

// ND Records & Information Management - Indigenous Knowledge Systems Mgmt.
const NdIndigLO1 = lazyLesson(() => import('./polytechnic/records-nd/indigenous-knowledge-systems-mgmt/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdIndigLO2 = lazyLesson(() => import('./polytechnic/records-nd/indigenous-knowledge-systems-mgmt/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdIndigLO3 = lazyLesson(() => import('./polytechnic/records-nd/indigenous-knowledge-systems-mgmt/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdIndigLO4 = lazyLesson(() => import('./polytechnic/records-nd/indigenous-knowledge-systems-mgmt/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdIndigLO5 = lazyLesson(() => import('./polytechnic/records-nd/indigenous-knowledge-systems-mgmt/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));

// ND Records & Information Management - Records & Info Services Automation
const NdRecAutoLO1 = lazyLesson(() => import('./polytechnic/records-nd/records-and-info-services-automation/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdRecAutoLO2 = lazyLesson(() => import('./polytechnic/records-nd/records-and-info-services-automation/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdRecAutoLO3 = lazyLesson(() => import('./polytechnic/records-nd/records-and-info-services-automation/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdRecAutoLO4 = lazyLesson(() => import('./polytechnic/records-nd/records-and-info-services-automation/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));

// ND Records & Information Management - Research Methods in Info Science
const NdResMethLO1 = lazyLesson(() => import('./polytechnic/records-nd/research-methods-in-info-science/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdResMethLO2 = lazyLesson(() => import('./polytechnic/records-nd/research-methods-in-info-science/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdResMethLO3 = lazyLesson(() => import('./polytechnic/records-nd/research-methods-in-info-science/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdResMethLO4 = lazyLesson(() => import('./polytechnic/records-nd/research-methods-in-info-science/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));

// NC PS - Computing & Digital Literacy
const NcPsCompLO1 = lazyLesson(() => import('./polytechnic/nc-ps/computing-and-digital-literacy/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsCompLO2 = lazyLesson(() => import('./polytechnic/nc-ps/computing-and-digital-literacy/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsCompLO3 = lazyLesson(() => import('./polytechnic/nc-ps/computing-and-digital-literacy/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsCompLO4 = lazyLesson(() => import('./polytechnic/nc-ps/computing-and-digital-literacy/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// NC PS - International Purchasing Fundamentals
const NcPsIntLO1 = lazyLesson(() => import('./polytechnic/nc-ps/international-purchasing-fundamentals/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsIntLO2 = lazyLesson(() => import('./polytechnic/nc-ps/international-purchasing-fundamentals/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsIntLO3 = lazyLesson(() => import('./polytechnic/nc-ps/international-purchasing-fundamentals/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsIntLO4 = lazyLesson(() => import('./polytechnic/nc-ps/international-purchasing-fundamentals/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NcPsIntLO5 = lazyLesson(() => import('./polytechnic/nc-ps/international-purchasing-fundamentals/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NcPsIntLO6 = lazyLesson(() => import('./polytechnic/nc-ps/international-purchasing-fundamentals/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
// NC PS - Logistics Management
const NcPsLogLO1 = lazyLesson(() => import('./polytechnic/nc-ps/logistics-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsLogLO2 = lazyLesson(() => import('./polytechnic/nc-ps/logistics-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsLogLO3 = lazyLesson(() => import('./polytechnic/nc-ps/logistics-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsLogLO4 = lazyLesson(() => import('./polytechnic/nc-ps/logistics-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// NC PS - Procurement Practice
const NcPsProcLO1 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsProcLO2 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsProcLO3 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsProcLO4 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NcPsProcLO5 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NcPsProcLO6 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NcPsProcLO7 = lazyLesson(() => import('./polytechnic/nc-ps/procurement-practice/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
// NC PS - Stakeholder Management
const NcPsStkLO1 = lazyLesson(() => import('./polytechnic/nc-ps/stakeholder-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsStkLO2 = lazyLesson(() => import('./polytechnic/nc-ps/stakeholder-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsStkLO3 = lazyLesson(() => import('./polytechnic/nc-ps/stakeholder-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsStkLO4 = lazyLesson(() => import('./polytechnic/nc-ps/stakeholder-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// NC PS - Stores & Warehouse Management
const NcPsStrLO1 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsStrLO2 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsStrLO3 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsStrLO4 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NcPsStrLO5 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NcPsStrLO6 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NcPsStrLO7 = lazyLesson(() => import('./polytechnic/nc-ps/stores-and-warehouse-management/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
// NC PS - Supply Chain Operations
const NcPsSupLO1 = lazyLesson(() => import('./polytechnic/nc-ps/supply-chain-operations/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsSupLO2 = lazyLesson(() => import('./polytechnic/nc-ps/supply-chain-operations/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsSupLO3 = lazyLesson(() => import('./polytechnic/nc-ps/supply-chain-operations/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsSupLO4 = lazyLesson(() => import('./polytechnic/nc-ps/supply-chain-operations/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// NC PS - Workplace Communication
const NcPsWrkLO1 = lazyLesson(() => import('./polytechnic/nc-it/workplace-communication/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsWrkLO2 = lazyLesson(() => import('./polytechnic/nc-it/workplace-communication/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
// NC PS - Entrepreneurial Skills Development
const NcPsEntLO1 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NcPsEntLO2 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NcPsEntLO3 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NcPsEntLO4 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NcPsEntLO5 = lazyLesson(() => import('./polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
// Banking NC - Money and Banking
const BankMoneyLO1 = lazyLesson(() => import('./polytechnic/banking-nc/money-and-banking/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const BankMoneyLO2 = lazyLesson(() => import('./polytechnic/banking-nc/money-and-banking/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const BankMoneyLO3 = lazyLesson(() => import('./polytechnic/banking-nc/money-and-banking/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const BankMoneyLO4 = lazyLesson(() => import('./polytechnic/banking-nc/money-and-banking/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// Banking NC - Introduction to Banking Law
const BankLawLO1 = lazyLesson(() => import('./polytechnic/banking-nc/introduction-to-banking-law/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const BankLawLO2 = lazyLesson(() => import('./polytechnic/banking-nc/introduction-to-banking-law/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const BankLawLO3 = lazyLesson(() => import('./polytechnic/banking-nc/introduction-to-banking-law/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const BankLawLO4 = lazyLesson(() => import('./polytechnic/banking-nc/introduction-to-banking-law/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const BankLawLO5 = lazyLesson(() => import('./polytechnic/banking-nc/introduction-to-banking-law/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
// Banking NC - Customer Accounts Management
const BankAccountsLO1 = lazyLesson(() => import('./polytechnic/banking-nc/customer-accounts-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const BankAccountsLO2 = lazyLesson(() => import('./polytechnic/banking-nc/customer-accounts-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const BankAccountsLO3 = lazyLesson(() => import('./polytechnic/banking-nc/customer-accounts-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const BankAccountsLO4 = lazyLesson(() => import('./polytechnic/banking-nc/customer-accounts-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const BankAccountsLO5 = lazyLesson(() => import('./polytechnic/banking-nc/customer-accounts-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
// Banking NC - Investments Administration
const BankInvestLO1 = lazyLesson(() => import('./polytechnic/banking-nc/investments-administration/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const BankInvestLO2 = lazyLesson(() => import('./polytechnic/banking-nc/investments-administration/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const BankInvestLO3 = lazyLesson(() => import('./polytechnic/banking-nc/investments-administration/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const BankInvestLO4 = lazyLesson(() => import('./polytechnic/banking-nc/investments-administration/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// Banking NC - Financial Mathematics 1
const BankMathsLO1 = lazyLesson(() => import('./polytechnic/banking-nc/financial-mathematics-1/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const BankMathsLO2 = lazyLesson(() => import('./polytechnic/banking-nc/financial-mathematics-1/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const BankMathsLO3 = lazyLesson(() => import('./polytechnic/banking-nc/financial-mathematics-1/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
// Banking NC - Computing and Digital Literacy
const BankDigitalLO1 = lazyLesson(() => import('./polytechnic/banking-nc/computing-and-digital-literacy/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const BankDigitalLO2 = lazyLesson(() => import('./polytechnic/banking-nc/computing-and-digital-literacy/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const BankDigitalLO3 = lazyLesson(() => import('./polytechnic/banking-nc/computing-and-digital-literacy/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const BankDigitalLO4 = lazyLesson(() => import('./polytechnic/banking-nc/computing-and-digital-literacy/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// ND PS - Industrial & Services Procurement
const NdPsIndServLO1 = lazyLesson(() => import('./polytechnic/nd-ps/industrial-and-services-procurement/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsIndServLO2 = lazyLesson(() => import('./polytechnic/nd-ps/industrial-and-services-procurement/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsIndServLO3 = lazyLesson(() => import('./polytechnic/nd-ps/industrial-and-services-procurement/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsIndServLO4 = lazyLesson(() => import('./polytechnic/nd-ps/industrial-and-services-procurement/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// ND PS - Communication
const NdPsCommLO1 = lazyLesson(() => import('./polytechnic/nd-ps/communication/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsCommLO2 = lazyLesson(() => import('./polytechnic/nd-ps/communication/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsCommLO3 = lazyLesson(() => import('./polytechnic/nd-ps/communication/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsCommLO4 = lazyLesson(() => import('./polytechnic/nd-ps/communication/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// ND PS - Principles of Purchasing & Supply
const NdPsPrinLO1 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsPrinLO2 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsPrinLO3 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsPrinLO4 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsPrinLO5 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdPsPrinLO6 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NdPsPrinLO7 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const NdPsPrinLO8 = lazyLesson(() => import('./polytechnic/nd-ps/principles-of-purchasing-and-supply/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));
// ND PS - Inventory Management
const NdPsInvLO1 = lazyLesson(() => import('./polytechnic/nd-ps/inventory-management/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsInvLO2 = lazyLesson(() => import('./polytechnic/nd-ps/inventory-management/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsInvLO3 = lazyLesson(() => import('./polytechnic/nd-ps/inventory-management/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsInvLO4 = lazyLesson(() => import('./polytechnic/nd-ps/inventory-management/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsInvLO5 = lazyLesson(() => import('./polytechnic/nd-ps/inventory-management/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdPsInvLO6 = lazyLesson(() => import('./polytechnic/nd-ps/inventory-management/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
// ND PS - Management of Org. Assets
const NdPsAssetsLO1 = lazyLesson(() => import('./polytechnic/nd-ps/management-of-org-assets/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsAssetsLO2 = lazyLesson(() => import('./polytechnic/nd-ps/management-of-org-assets/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsAssetsLO3 = lazyLesson(() => import('./polytechnic/nd-ps/management-of-org-assets/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsAssetsLO4 = lazyLesson(() => import('./polytechnic/nd-ps/management-of-org-assets/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsAssetsLO5 = lazyLesson(() => import('./polytechnic/nd-ps/management-of-org-assets/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
// ND PS - Legal Aspects of Procurement
const NdPsLegalLO1 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsLegalLO2 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsLegalLO3 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsLegalLO4 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsLegalLO5 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdPsLegalLO6 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NdPsLegalLO7 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const NdPsLegalLO8 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));
const NdPsLegalLO9 = lazyLesson(() => import('./polytechnic/nd-ps/legal-aspects-of-procurement/LearningOutcome9').then(m => ({ default: m.LearningOutcome9 })));
// ND PS - Logistics & Distribution Mgmt.
const NdPsLogDistLO1 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsLogDistLO2 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsLogDistLO3 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsLogDistLO4 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsLogDistLO5 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdPsLogDistLO6 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NdPsLogDistLO7 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const NdPsLogDistLO8 = lazyLesson(() => import('./polytechnic/nd-ps/logistics-and-distribution-mgmt/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));
// ND PS - Public Procurement
const NdPsPublicLO1 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsPublicLO2 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsPublicLO3 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsPublicLO4 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsPublicLO5 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdPsPublicLO6 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NdPsPublicLO7 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));
const NdPsPublicLO8 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome8').then(m => ({ default: m.LearningOutcome8 })));
const NdPsPublicLO9 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome9').then(m => ({ default: m.LearningOutcome9 })));
const NdPsPublicLO10 = lazyLesson(() => import('./polytechnic/nd-ps/public-procurement/LearningOutcome10').then(m => ({ default: m.LearningOutcome10 })));
// ND PS - Strategic Procurement
const NdPsStrategicLO1 = lazyLesson(() => import('./polytechnic/nd-ps/strategic-procurement/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsStrategicLO2 = lazyLesson(() => import('./polytechnic/nd-ps/strategic-procurement/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsStrategicLO3 = lazyLesson(() => import('./polytechnic/nd-ps/strategic-procurement/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsStrategicLO4 = lazyLesson(() => import('./polytechnic/nd-ps/strategic-procurement/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
// ND PS - Procurement Negotiation
const NdPsNegLO1 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome1').then(m => ({ default: m.LearningOutcome1 })));
const NdPsNegLO2 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome2').then(m => ({ default: m.LearningOutcome2 })));
const NdPsNegLO3 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome3').then(m => ({ default: m.LearningOutcome3 })));
const NdPsNegLO4 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome4').then(m => ({ default: m.LearningOutcome4 })));
const NdPsNegLO5 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome5').then(m => ({ default: m.LearningOutcome5 })));
const NdPsNegLO6 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome6').then(m => ({ default: m.LearningOutcome6 })));
const NdPsNegLO7 = lazyLesson(() => import('./polytechnic/nd-ps/procurement-negotiation/LearningOutcome7').then(m => ({ default: m.LearningOutcome7 })));


interface DynamicModuleViewerProps {
  level: string;
  subject: string;
  onBack: () => void;
  onLoginRequest: () => void;
  initialOutcome?: number;
  onOutcomeChange?: (outcome: number) => void;
}

const normalizeModuleKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const LessonChunkLoader: React.FC = () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff7400] border-t-transparent" />
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
            Loading lesson
        </p>
    </div>
);

// Without this, a lesson chunk that fails to arrive unmounts the whole app:
// the notes routes render outside CoursePage, so they have no boundary of
// their own and the app-level Suspense fallback just spins forever.
class LessonChunkBoundary extends React.Component<
    { children: React.ReactNode; resetKey: string },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidUpdate(previousProps: { resetKey: string }) {
        if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
            this.setState({ hasError: false });
        }
    }

    render() {
        if (!this.state.hasError) {
            return (
                <React.Suspense fallback={<LessonChunkLoader />}>
                    {this.props.children}
                </React.Suspense>
            );
        }

        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
                <h2 className="mb-3 text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                    Lesson could not load
                </h2>
                <p className="mb-6 max-w-md text-[10px] font-bold uppercase tracking-widest text-gray-500 opacity-60">
                    Check your connection and reload the page to try again.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-[#ff7400] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-[#e56700]"
                >
                    Reload
                </button>
            </div>
        );
    }
}

const TechnicalPlaceholder: React.FC<{ level: string; subject: string; lo: number }> = ({ level, subject, lo }) => (
    <div className="animate-dropdown-reveal space-y-8 md:space-y-12 py-6 md:py-10 text-left px-[5px]">
        <header className="border-b-4 border-[#003153] pb-6 md:pb-8">
            <span className="text-[9px] md:text-[10px] font-black text-[#003153] uppercase tracking-[0.4em] mb-3 md:mb-4 block underline underline-offset-8">Topic Registration</span>
            <h1 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                {subject}: Part {lo}
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mt-4 md:mt-6 bg-gray-100 dark:bg-white/5 w-fit px-3 py-1 border border-gray-200 dark:border-white/10">
                Index ID: {level.replace(/\s+/g, '_')}_{subject.replace(/\s+/g, '_')}_U{lo}
            </p>
        </header>

        <section className="bg-gray-50 dark:bg-white/5 p-8 md:p-12 border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#003153] flex items-center justify-center text-white mb-4 md:mb-6 shadow-2xl">
                <BookOpen size={24} />
            </div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 md:mb-3">Indexing in Progress</h2>
            <p className="text-gray-500 max-w-md text-[10px] md:text-xs font-bold leading-relaxed uppercase tracking-widest opacity-60">
                Notes for this topic have not been published yet. Please choose another available learning outcome.
            </p>
        </section>
    </div>
);

const UnderConstructionPage: React.FC<{ level: string; subject: string; onBack: () => void }> = ({ level, subject, onBack }) => (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[#f3f4f6] text-gray-900 dark:bg-[#121212] dark:text-white font-sans">
        <div className="h-14 border-b border-gray-200 bg-white px-4 dark:border-white/10 dark:bg-[#1e1e1e] flex items-center gap-3 shadow-sm">
            <button
                onClick={onBack}
                className="p-1.5 rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                title="Go Back"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-black truncate">{subject}</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{level}</p>
            </div>
        </div>

        <main className="flex flex-1 items-center justify-center px-6 py-12">
            <section className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-[#1a1a1a] md:p-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300">
                    <BookOpen size={30} />
                </div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">Coming Soon</p>
                <h2 className="text-3xl font-black tracking-tight md:text-5xl">Page under construction</h2>
                <p className="mx-auto mt-5 max-w-md text-sm font-semibold leading-relaxed text-gray-500 dark:text-gray-400">
                    This subject is registered, but its lesson content is not currently published.
                </p>
                <button
                    onClick={onBack}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                    <ArrowLeft size={16} /> Back to subjects
                </button>
            </section>
        </main>
    </div>
);

export const DynamicModuleViewer: React.FC<DynamicModuleViewerProps> = ({
  level,
  subject,
  onBack,
  onLoginRequest,
  initialOutcome = 1,
  onOutcomeChange,
}) => {
  usePageScrollLock();
  const { userProfile } = useAuth();
  const [activeLO, setActiveLO] = useState(initialOutcome);
  const [textSize, setTextSize] = useState(2); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pagerState, setPagerState] = useState<{currentPage: number, totalPages: number} | null>(null);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [lessonSearchSuggestions, setLessonSearchSuggestions] = useState<Array<{ id: string; label: string; element: HTMLElement }>>([]);
  const [isLessonSearchFocused, setIsLessonSearchFocused] = useState(false);
  const [isMobileLessonSearchOpen, setIsMobileLessonSearchOpen] = useState(false);

  useEffect(() => {
      const handleState = (e: any) => setPagerState(e.detail);
      window.addEventListener('pager-state', handleState);
      return () => window.removeEventListener('pager-state', handleState);
  }, []);

  const contentId = `${level}_${subject}_LO${activeLO}`.replace(/\s+/g, '_');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Expose login handler to window for children components
  useEffect(() => {
    (window as any).onLoginRequest = onLoginRequest;
    return () => { (window as any).onLoginRequest = undefined; };
  }, [onLoginRequest]);

  const levelMeta = CURRICULUM_REGISTRY.find(l => l.name === level);
  const subjectMeta = levelMeta?.subjects.find(s => s.name === subject);
  const levelKey = normalizeModuleKey(level);
  const subjectKey = normalizeModuleKey(subject);
  const isFrsSubject = subjectKey === 'family-and-religious-studies' || subjectKey === 'frs';
  const outcomeCount = isFrsSubject ? 2 : (subjectMeta?.outcomeCount || 10);
  const hasContent = hasCourseSubjectContent(level, subject, levelMeta?.category);
  useLessonScrollMemory(contentId, hasContent);
  const isFormOneMaths = levelMeta?.category === 'ZJC' && level === 'Form 1' && subject === 'Mathematics';
  const unitNavLabel = 'Topics';
  const mobileSubjectLabel = abbreviationFor(subject) ?? (() => {
    if (subject.length <= 22) return subject;
    const initials = subject
      .split(/[\s&/-]+/)
      .filter((word) => word && !['and', 'of', 'in', 'the'].includes(word.toLowerCase()))
      .map((word) => word[0])
      .join('')
      .toUpperCase();
    return initials.length >= 2 && initials.length <= 6 ? initials : subject;
  })();
  const usesSharedFormOneLanguageContent =
    ['form-1', 'form-2', 'form-3', 'form-4'].includes(levelKey) &&
    ['english-language', 'shona'].includes(subjectKey);
  const selectOutcome = (outcome: number) => {
    setActiveLO(outcome);
    onOutcomeChange?.(outcome);
  };

  const renderUnitContent = () => {
    if (levelKey === 'form-4' && subjectKey === 'mathematics') {
        if (activeLO === 1) return <Form4MathGeneralArithmetic />;
        if (activeLO === 2) return <Form4MathGeometricalConstructions />;
        if (activeLO === 3) return <Form4MathCircleGeometry />;
        if (activeLO === 4) return <Form4MathTheSineRule />;
        if (activeLO === 5) return <Form4MathGraphsGradient />;
        if (activeLO === 6) return <Form4MathVariation />;
        if (activeLO === 7) return <Form4MathMensurationSolidShapes />;
        if (activeLO === 8) return <Form4MathTheCosineRule />;
        if (activeLO === 9) return <Form4MathConsumerArithmetic2 />;
        if (activeLO === 10) return <Form4MathMatrices2 />;
        if (activeLO === 11) return <Form4MathGeometricalTransformations3 />;
        if (activeLO === 12) return <Form4MathGraphsCubicInverse />;
        if (activeLO === 13) return <Form4MathLengthsAnglesSolids />;
        if (activeLO === 14) return <Form4MathFractionsInAlgebra />;
        if (activeLO === 15) return <Form4MathGraphsVelocityTime />;
        if (activeLO === 16) return <Form4MathInequalities />;
        if (activeLO === 17) return <Form4MathVectors />;
        if (activeLO === 18) return <Form4MathProbabilities />;
    }

    if (
        ['form-1', 'form-2', 'form-3', 'form-4'].includes(levelKey) &&
        subjectKey === 'computer-science'
    ) {
        if (activeLO === 1) return <Form4ComputerScienceLO1 />;
        if (activeLO === 2) return <Form4ComputerScienceLO2 />;
        if (activeLO === 3) return <Form4ComputerScienceLO3 />;
        if (activeLO === 4) return <Form4ComputerScienceLO4 />;
        if (activeLO === 5) return <Form4ComputerScienceLO5 />;
        if (activeLO === 6) return <Form4ComputerScienceLO6 />;
    }

    if (levelKey === 'form-3' && subjectKey === 'combined-science') {
        if (activeLO === 1) return <Form3CombinedScienceBiology />;
        if (activeLO === 2) return <Form3CombinedScienceChemistry />;
        if (activeLO === 3) return <Form3CombinedSciencePhysics />;
    }

    if (levelKey === 'form-4' && subjectKey === 'combined-science') {
        if (activeLO === 1) return <Form4CombinedScienceBiology />;
        if (activeLO === 2) return <Form4CombinedScienceChemistry />;
        if (activeLO === 3) return <Form4CombinedSciencePhysics />;
    }

    // Family and Religious Studies (FRS) — Form 1 to Form 4
    if (subjectKey === 'family-and-religious-studies' || subjectKey === 'frs') {
        if (levelKey === 'form-1') {
            if (activeLO === 1) return <Form1FrsTopic1 />;
            if (activeLO === 2) return <Form1FrsTopic2 />;
        }
        if (levelKey === 'form-2') {
            if (activeLO === 1) return <Form2FrsTopic1 />;
            if (activeLO === 2) return <Form2FrsTopic2 />;
        }
        if (levelKey === 'form-3') {
            if (activeLO === 1) return <Form3FrsTopic1 />;
            if (activeLO === 2) return <Form3FrsTopic2 />;
        }
        if (levelKey === 'form-4') {
            if (activeLO === 1) return <Form4FrsTopic1 />;
            if (activeLO === 2) return <Form4FrsTopic2 />;
        }
    }

    // Geography — Form 3 and Form 4 (shared curriculum, distinct level URLs)
    if (['form-3', 'form-4'].includes(levelKey) && subjectKey === 'geography') {
        if (activeLO === 1) return <Form3GeoLO1 />;
        if (activeLO === 2) return <Form3GeoLO5 />;
        if (activeLO === 3) return <Form3GeoLO2 />;
        if (activeLO === 4) return <Form3GeoLO3 />;
        if (activeLO === 5) return <Form3GeoLO4 />;
        if (activeLO === 6) return <Form3GeoLO6 />;
        if (activeLO === 7) return <Form3GeoLO7 />;
        if (activeLO === 8) return <Form3GeoLO8 />;
        if (activeLO === 9) return <Form3GeoLO9 />;
    }

    // Physics — Form 3 and Form 4 (shared curriculum, distinct level URLs)
    if (['form-3', 'form-4'].includes(levelKey) && subjectKey === 'physics') {
        if (activeLO === 1)  return <PhysicsLO1 />;
        if (activeLO === 2)  return <PhysicsLO2 />;
        if (activeLO === 3)  return <PhysicsLO3 />;
        if (activeLO === 4)  return <PhysicsLO4 />;
        if (activeLO === 5)  return <PhysicsLO5 />;
        if (activeLO === 6)  return <PhysicsLO6 />;
        if (activeLO === 7)  return <PhysicsLO7 />;
        if (activeLO === 8)  return <PhysicsLO8 />;
        if (activeLO === 9)  return <PhysicsLO9 />;
        if (activeLO === 10) return <PhysicsLO10 />;
        if (activeLO === 11) return <PhysicsLO11 />;
        if (activeLO === 12) return <PhysicsLO12 />;
        if (activeLO === 13) return <PhysicsLO13 />;
        if (activeLO === 14) return <PhysicsLO14 />;
        if (activeLO === 15) return <PhysicsLO15 />;
    }

    if (levelKey === 'form-4' && (subjectKey === 'principles-of-accounting' || subjectKey === 'accounting')) {
        if (activeLO === 1) return <Form4AccountingLO1 />;
        if (activeLO === 2) return <Form4AccountingLO2 />;
        if (activeLO === 3) return <Form4AccountingLO3 />;
        if (activeLO === 4) return <Form4AccountingLO4 />;
        if (activeLO === 5) return <Form4AccountingLO5 />;
        if (activeLO === 6) return <Form4AccountingLO6 />;
        if (activeLO === 7) return <Form4AccountingLO7 />;
    }

    if (level === 'NC Information Technology' || level === 'nc-it') {
        if (subject === 'Computer Systems Maintenance') {
            if (activeLO === 1) return <PolyLO1 />;
            if (activeLO === 2) return <PolyLO2 />;
            if (activeLO === 3) return <PolyLO3 />;
            if (activeLO === 4) return <PolyLO4 />;
            if (activeLO === 5) return <PolyLO5 />;
        }
        if (subject === 'Programming Concepts') {
            if (activeLO === 1) return <ProgLO1 />;
            if (activeLO === 2) return <ProgLO2 />;
            if (activeLO === 3) return <ProgLO3 />;
            if (activeLO === 4) return <ProgLO4 />;
            if (activeLO === 5) return <ProgLO5 />;
            if (activeLO === 6) return <ProgLO6 />;
            if (activeLO === 7) return <ProgLO7 />;
        }
        if (subject === 'Database Concepts') {
            return <DatabaseConcepts onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'Computer Networking') {
            return <ComputerNetworking onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'Computer Security') {
            return <ComputerSecurity onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'National & Strategic Studies') {
            return <NationalStudies onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'Workplace Communication') {
            if (activeLO === 1) return <WorkLO1 />;
            if (activeLO === 2) return <WorkLO2 />;
            if (activeLO === 3) return <WorkGrammar />;
        }
        if (subject === 'Entrepreneurship Skills Development') {
            if (activeLO === 1) return <EntrepLO1 />;
            if (activeLO === 2) return <EntrepLO2 />;
            if (activeLO === 3) return <EntrepLO3 />;
            if (activeLO === 4) return <EntrepLO4 />;
            if (activeLO === 5) return <EntrepLO5 />;
        }
    }

    if (level === 'NC Auto Electrics' || level === 'nc-auto') {
        if (subject === 'National Studies') {
            return <NationalStudies onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'Safety, Health, Env & Fitting/Machining') {
            if (activeLO === 1) return <SafheaLO1 />;
            if (activeLO === 2) return <SafheaLO2 />;
            if (activeLO === 3) return <SafheaLO3 />;
            if (activeLO === 4) return <SafheaLO4 />;
        }
        if (subject === 'Electrical & Electronics Fundamentals') {
            if (activeLO === 1) return <EleeleLO1 />;
            if (activeLO === 2) return <EleeleLO2 />;
            if (activeLO === 3) return <EleeleLO3 />;
        }
        if (subject === 'Automotive Comm & Computer Apps') {
            if (activeLO === 1) return <AutcomLO1 />;
            if (activeLO === 2) return <AutcomLO2 />;
        }
        if (subject === 'Motor Vehicle Systems Minor Service') {
            if (activeLO === 1) return <MotvehLO1 />;
            if (activeLO === 2) return <MotvehLO2 />;
            if (activeLO === 3) return <MotvehLO3 />;
        }
        if (subject === 'Entrepreneurship Skills Development') {
            if (activeLO === 1) return <EntrepLO1 />;
            if (activeLO === 2) return <EntrepLO2 />;
            if (activeLO === 3) return <EntrepLO3 />;
            if (activeLO === 4) return <EntrepLO4 />;
            if (activeLO === 5) return <EntrepLO5 />;
        }
        if (subject === 'Wiring Lighting & Auxiliary Systems') {
            if (activeLO === 1) return <WirligLO1 />;
            if (activeLO === 2) return <WirligLO2 />;
            if (activeLO === 3) return <WirligLO3 />;
        }
        if (subject === 'Automotive Eng Maths & Science') {
            if (activeLO === 1) return <AutengLO1 />;
            if (activeLO === 2) return <AutengLO2 />;
        }
        if (subject === 'Electronic Fuel Injection Maint.') {
            if (activeLO === 1) return <ElefueLO1 />;
            if (activeLO === 2) return <ElefueLO2 />;
            if (activeLO === 3) return <ElefueLO3 />;
            if (activeLO === 4) return <ElefueLO4 />;
        }
        if (subject === 'Ignition, Starting & Charging Syst.') {
            if (activeLO === 1) return <IgnstaLO1 />;
            if (activeLO === 2) return <IgnstaLO2 />;
            if (activeLO === 3) return <IgnstaLO3 />;
            if (activeLO === 4) return <IgnstaLO4 />;
        }
    }

    if (level === 'ND Information Technology' || level === 'nd-it') {
        if (subject === 'Hardware Administration') {
            if (activeLO === 1) return <HardAdminLO1 />;
            if (activeLO === 2) return <HardAdminLO2 />;
            if (activeLO === 3) return <HardAdminLO3 />;
            if (activeLO === 4) return <HardAdminLO4 />;
            if (activeLO === 5) return <HardAdminLO5 />;
            if (activeLO === 6) return <HardAdminLO6 />;
            if (activeLO === 7) return <HardAdminLO7 />;
            if (activeLO === 8) return <HardAdminLO8 />;
        }
        if (subject === 'Network Administration') {
            if (activeLO === 1) return <NetAdminLO1 />;
            if (activeLO === 2) return <NetAdminLO2 />;
            if (activeLO === 3) return <NetAdminLO3 />;
            if (activeLO === 4) return <NetAdminLO4 />;
        }
        if (subject === 'Database Administration') {
            if (activeLO === 1) return <DbaLO1 />;
            if (activeLO === 2) return <DbaLO2 />;
            if (activeLO === 3) return <DbaLO3 />;
            if (activeLO === 4) return <DbaLO4 />;
            if (activeLO === 5) return <DbaLO5 />;
            if (activeLO === 6) return <SQLPractice onBack={() => selectOutcome(1)} />;
        }
        if (subject === 'Software Engineering') {
            if (activeLO === 1) return <SoftEngLO1 />;
            if (activeLO === 2) return <SoftEngLO2 />;
            if (activeLO === 3) return <SoftEngLO3 />;
            if (activeLO === 4) return <SoftEngLO4 />;
            if (activeLO === 5) return <SoftEngLO5 />;
            if (activeLO === 6) return <SoftEngLO6 />;
        }
        if (subject === 'Object Oriented Programming') {
            if (activeLO === 1) return <OopLO1 />;
            if (activeLO === 2) return <OopLO2 />;
            if (activeLO === 3) return <OopLO3 />;
            if (activeLO === 4) return <OopLO4 />;
            if (activeLO === 5) return <OopLO5 />;
            if (activeLO === 6) return <OopLO6 />;
            if (activeLO === 7) return <OopLO7 />;
            if (activeLO === 8) return <PracticeCSharp onBack={() => selectOutcome(1)} />;
        }
        if (subject === 'Web Development') {
            if (activeLO === 1) return <WebDevLO1 />;
            if (activeLO === 2) return <WebDevLO2 />;
            if (activeLO === 3) return <WebDevLO3 />;
            if (activeLO === 4) return <WebDevLO4 />;
            if (activeLO === 5) return <WebDevLO5 />;
            if (activeLO === 6) return <WebDevLO6 />;
            if (activeLO === 7) return <WebDevLO7 />;
            if (activeLO === 8) return <WebDevLO8 />;
        }
        if (subject === 'Information Security') {
            if (activeLO === 1) return <InfoSecLO1 />;
            if (activeLO === 2) return <InfoSecLO2 />;
            if (activeLO === 3) return <InfoSecLO3 />;
            if (activeLO === 4) return <InfoSecLO4 />;
            if (activeLO === 5) return <InfoSecLO5 />;
            if (activeLO === 6) return <InfoSecLO6 />;
            if (activeLO === 7) return <InfoSecLO7 />;
        }
        if (subject === 'Operating Systems Administration') {
            if (activeLO === 1) return <OpSysLO1 />;
            if (activeLO === 2) return <OpSysLO2 />;
            if (activeLO === 3) return <OpSysLO3 />;
            if (activeLO === 4) return <OpSysLO4 />;
            if (activeLO === 5) return <OpSysLO5 />;
            if (activeLO === 6) return <OpSysLO6 />;
            if (activeLO === 7) return <OpSysLO7 />;
        }
        if (subject === 'Design & Analysis of Algorithms') {
            if (activeLO === 1) return <DaaLO1 />;
            if (activeLO === 2) return <DaaLO2 />;
            if (activeLO === 3) return <DaaLO3 />;
            if (activeLO === 4) return <DaaLO4 />;
            if (activeLO === 5) return <DaaLO5 />;
            if (activeLO === 6) return <DaaLO6 />;
            if (activeLO === 7) return <DaaLO7 />;
            if (activeLO === 8) return <DaaLO8 />;
        }
        if (subject === 'Research & Project Management') {
            if (activeLO === 1) return <RpmLO1 />;
            if (activeLO === 2) return <RpmLO2 />;
            if (activeLO === 3) return <RpmLO3 />;
            if (activeLO === 4) return <RpmLO4 />;
            if (activeLO === 5) return <RpmLO5 />;
        }
    }
    
    if (level === 'NC Records Management' || level === 'records-nc') {
        if (subject === 'Archiving') {
            if (activeLO === 1) return <ArchLO1 />;
            if (activeLO === 2) return <ArchLO2 />;
            if (activeLO === 3) return <ArchLO3 />;
            if (activeLO === 4) return <ArchLO4 />;
        }
        if (subject === 'Classification of Records') {
            if (activeLO === 1) return <ClassRecLO1 />;
            if (activeLO === 2) return <ClassRecLO2 />;
            if (activeLO === 3) return <ClassRecLO3 />;
        }
        if (subject === 'Digital & Conv. Mail Management') {
            if (activeLO === 1) return <DigMailLO1 />;
            if (activeLO === 2) return <DigMailLO2 />;
            if (activeLO === 3) return <DigMailLO3 />;
            if (activeLO === 4) return <DigMailLO4 />;
        }
        if (subject === 'Digital Filing') {
            if (activeLO === 1) return <DigFilLO1 />;
            if (activeLO === 2) return <DigFilLO2 />;
            if (activeLO === 3) return <DigFilLO3 />;
            if (activeLO === 4) return <DigFilLO4 />;
            if (activeLO === 5) return <DigFilLO5 />;
        }
        if (subject === 'Reception Management') {
            if (activeLO === 1) return <RecManLO1 />;
            if (activeLO === 2) return <RecManLO2 />;
            if (activeLO === 3) return <RecManLO3 />;
        }
        if (subject === 'Records Preservation') {
            if (activeLO === 1) return <RecPresLO1 />;
            if (activeLO === 2) return <RecPresLO2 />;
            if (activeLO === 3) return <RecPresLO3 />;
            if (activeLO === 4) return <RecPresLO4 />;
            if (activeLO === 5) return <RecPresLO5 />;
            if (activeLO === 6) return <RecPresLO6 />;
        }
        if (subject === 'Reprography') {
            if (activeLO === 1) return <ReproLO1 />;
            if (activeLO === 2) return <ReproLO2 />;
            if (activeLO === 3) return <ReproLO3 />;
            if (activeLO === 4) return <ReproLO4 />;
            if (activeLO === 5) return <ReproLO5 />;
            if (activeLO === 6) return <ReproLO6 />;
        }
        if (subject === 'Workplace Communication') {
            if (activeLO === 1) return <WorkLO1 />;
            if (activeLO === 2) return <WorkLO2 />;
            if (activeLO === 3) return <WorkGrammar />;
        }
        if (subject === 'National Studies') {
            return <NationalStudies onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'Entrepreneurial Skills Dev.') {
            if (activeLO === 1) return <EntrepLO1 />;
            if (activeLO === 2) return <EntrepLO2 />;
            if (activeLO === 3) return <EntrepLO3 />;
            if (activeLO === 4) return <EntrepLO4 />;
            if (activeLO === 5) return <EntrepLO5 />;
        }
    }

    if (level === 'ND Records & Information Management' || level === 'records-nd') {
        if (subject === 'Records & Information Management') {
            if (activeLO === 1) return <NdRecInfoLO1 />;
            if (activeLO === 2) return <NdRecInfoLO2 />;
            if (activeLO === 3) return <NdRecInfoLO3 />;
            if (activeLO === 4) return <NdRecInfoLO4 />;
            if (activeLO === 5) return <NdRecInfoLO5 />;
            if (activeLO === 6) return <NdRecInfoLO6 />;
        }
        if (subject === 'Preservation Management') {
            if (activeLO === 1) return <NdPresLO1 />;
            if (activeLO === 2) return <NdPresLO2 />;
            if (activeLO === 3) return <NdPresLO3 />;
            if (activeLO === 4) return <NdPresLO4 />;
            if (activeLO === 5) return <NdPresLO5 />;
        }
        if (subject === 'Database Analysis & Design') {
            if (activeLO === 1) return <NdDbLO1 />;
            if (activeLO === 2) return <NdDbLO2 />;
            if (activeLO === 3) return <NdDbLO3 />;
            if (activeLO === 4) return <NdDbLO4 />;
        }
        if (subject === 'Information Literacy') {
            if (activeLO === 1) return <NdInfoLitLO1 />;
            if (activeLO === 2) return <NdInfoLitLO2 />;
            if (activeLO === 3) return <NdInfoLitLO3 />;
            if (activeLO === 4) return <NdInfoLitLO4 />;
            if (activeLO === 5) return <NdInfoLitLO5 />;
        }
        if (subject === 'Records Centre Management') {
            if (activeLO === 1) return <NdRecCentLO1 />;
            if (activeLO === 2) return <NdRecCentLO2 />;
            if (activeLO === 3) return <NdRecCentLO3 />;
            if (activeLO === 4) return <NdRecCentLO4 />;
            if (activeLO === 5) return <NdRecCentLO5 />;
            if (activeLO === 6) return <NdRecCentLO6 />;
        }
        if (subject === 'Reprographics') {
            if (activeLO === 1) return <NdReproLO1 />;
            if (activeLO === 2) return <NdReproLO2 />;
            if (activeLO === 3) return <NdReproLO3 />;
            if (activeLO === 4) return <NdReproLO4 />;
            if (activeLO === 5) return <NdReproLO5 />;
        }
        if (subject === 'Archives Administration') {
            if (activeLO === 1) return <NdArchLO1 />;
            if (activeLO === 2) return <NdArchLO2 />;
            if (activeLO === 3) return <NdArchLO3 />;
            if (activeLO === 4) return <NdArchLO4 />;
            if (activeLO === 5) return <NdArchLO5 />;
            if (activeLO === 6) return <NdArchLO6 />;
        }
        if (subject === 'Indigenous Knowledge Systems Mgmt.') {
            if (activeLO === 1) return <NdIndigLO1 />;
            if (activeLO === 2) return <NdIndigLO2 />;
            if (activeLO === 3) return <NdIndigLO3 />;
            if (activeLO === 4) return <NdIndigLO4 />;
            if (activeLO === 5) return <NdIndigLO5 />;
        }
        if (subject === 'Records & Info Services Automation') {
            if (activeLO === 1) return <NdRecAutoLO1 />;
            if (activeLO === 2) return <NdRecAutoLO2 />;
            if (activeLO === 3) return <NdRecAutoLO3 />;
            if (activeLO === 4) return <NdRecAutoLO4 />;
        }
        if (subject === 'Research Methods in Info Science') {
            if (activeLO === 1) return <NdResMethLO1 />;
            if (activeLO === 2) return <NdResMethLO2 />;
            if (activeLO === 3) return <NdResMethLO3 />;
            if (activeLO === 4) return <NdResMethLO4 />;
        }

    }

    if (level === 'NC Purchasing & Supply' || level === 'nc-ps') {
        if (subject === 'Computing & Digital Literacy') {
            if (activeLO === 1) return <NcPsCompLO1 />;
            if (activeLO === 2) return <NcPsCompLO2 />;
            if (activeLO === 3) return <NcPsCompLO3 />;
            if (activeLO === 4) return <NcPsCompLO4 />;
        }
        if (subject === 'International Purchasing Fundamentals') {
            if (activeLO === 1) return <NcPsIntLO1 />;
            if (activeLO === 2) return <NcPsIntLO2 />;
            if (activeLO === 3) return <NcPsIntLO3 />;
            if (activeLO === 4) return <NcPsIntLO4 />;
            if (activeLO === 5) return <NcPsIntLO5 />;
            if (activeLO === 6) return <NcPsIntLO6 />;
        }
        if (subject === 'Logistics Management') {
            if (activeLO === 1) return <NcPsLogLO1 />;
            if (activeLO === 2) return <NcPsLogLO2 />;
            if (activeLO === 3) return <NcPsLogLO3 />;
            if (activeLO === 4) return <NcPsLogLO4 />;
        }
        if (subject === 'Procurement Practice') {
            if (activeLO === 1) return <NcPsProcLO1 />;
            if (activeLO === 2) return <NcPsProcLO2 />;
            if (activeLO === 3) return <NcPsProcLO3 />;
            if (activeLO === 4) return <NcPsProcLO4 />;
            if (activeLO === 5) return <NcPsProcLO5 />;
            if (activeLO === 6) return <NcPsProcLO6 />;
            if (activeLO === 7) return <NcPsProcLO7 />;
        }
        if (subject === 'Stakeholder Management') {
            if (activeLO === 1) return <NcPsStkLO1 />;
            if (activeLO === 2) return <NcPsStkLO2 />;
            if (activeLO === 3) return <NcPsStkLO3 />;
            if (activeLO === 4) return <NcPsStkLO4 />;
        }
        if (subject === 'Stores & Warehouse Management') {
            if (activeLO === 1) return <NcPsStrLO1 />;
            if (activeLO === 2) return <NcPsStrLO2 />;
            if (activeLO === 3) return <NcPsStrLO3 />;
            if (activeLO === 4) return <NcPsStrLO4 />;
            if (activeLO === 5) return <NcPsStrLO5 />;
            if (activeLO === 6) return <NcPsStrLO6 />;
            if (activeLO === 7) return <NcPsStrLO7 />;
        }
        if (subject === 'Supply Chain Operations') {
            if (activeLO === 1) return <NcPsSupLO1 />;
            if (activeLO === 2) return <NcPsSupLO2 />;
            if (activeLO === 3) return <NcPsSupLO3 />;
            if (activeLO === 4) return <NcPsSupLO4 />;
        }
        if (subject === 'Workplace Communication') {
            if (activeLO === 1) return <NcPsWrkLO1 />;
            if (activeLO === 2) return <NcPsWrkLO2 />;
        }
        if (subject === 'National Studies') {
            return <NationalStudies onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subject === 'Entrepreneurial Skills Development') {
            if (activeLO === 1) return <NcPsEntLO1 />;
            if (activeLO === 2) return <NcPsEntLO2 />;
            if (activeLO === 3) return <NcPsEntLO3 />;
            if (activeLO === 4) return <NcPsEntLO4 />;
            if (activeLO === 5) return <NcPsEntLO5 />;
        }

    }

    if (levelKey === 'nc-banking-and-finance' || levelKey === 'banking-nc') {
        if (subjectKey === 'money-and-banking') {
            if (activeLO === 1) return <BankMoneyLO1 />;
            if (activeLO === 2) return <BankMoneyLO2 />;
            if (activeLO === 3) return <BankMoneyLO3 />;
            if (activeLO === 4) return <BankMoneyLO4 />;
        }
        if (subjectKey === 'introduction-to-banking-law') {
            if (activeLO === 1) return <BankLawLO1 />;
            if (activeLO === 2) return <BankLawLO2 />;
            if (activeLO === 3) return <BankLawLO3 />;
            if (activeLO === 4) return <BankLawLO4 />;
            if (activeLO === 5) return <BankLawLO5 />;
        }
        if (subjectKey === 'customer-accounts-management') {
            if (activeLO === 1) return <BankAccountsLO1 />;
            if (activeLO === 2) return <BankAccountsLO2 />;
            if (activeLO === 3) return <BankAccountsLO3 />;
            if (activeLO === 4) return <BankAccountsLO4 />;
            if (activeLO === 5) return <BankAccountsLO5 />;
        }
        if (subjectKey === 'investments-administration') {
            if (activeLO === 1) return <BankInvestLO1 />;
            if (activeLO === 2) return <BankInvestLO2 />;
            if (activeLO === 3) return <BankInvestLO3 />;
            if (activeLO === 4) return <BankInvestLO4 />;
        }
        if (subjectKey === 'financial-mathematics-1') {
            if (activeLO === 1) return <BankMathsLO1 />;
            if (activeLO === 2) return <BankMathsLO2 />;
            if (activeLO === 3) return <BankMathsLO3 />;
        }
        if (subjectKey === 'esd') {
            if (activeLO === 1) return <EntrepLO1 />;
            if (activeLO === 2) return <EntrepLO2 />;
            if (activeLO === 3) return <EntrepLO3 />;
            if (activeLO === 4) return <EntrepLO4 />;
            if (activeLO === 5) return <EntrepLO5 />;
        }
        if (subjectKey === 'national-studies') {
            return <NationalStudies onBack={onBack} initialOutcome={activeLO} onOutcomeChange={selectOutcome} />;
        }
        if (subjectKey === 'computing-and-digital-literacy') {
            if (activeLO === 1) return <BankDigitalLO1 />;
            if (activeLO === 2) return <BankDigitalLO2 />;
            if (activeLO === 3) return <BankDigitalLO3 />;
            if (activeLO === 4) return <BankDigitalLO4 />;
        }
    }

    if (levelKey === 'nd-purchasing-and-supply' || levelKey === 'nd-ps') {
        if (subjectKey === 'industrial-and-services-procurement') {
            if (activeLO === 1) return <NdPsIndServLO1 />;
            if (activeLO === 2) return <NdPsIndServLO2 />;
            if (activeLO === 3) return <NdPsIndServLO3 />;
            if (activeLO === 4) return <NdPsIndServLO4 />;
        }
        if (subjectKey === 'communication') {
            if (activeLO === 1) return <NdPsCommLO1 />;
            if (activeLO === 2) return <NdPsCommLO2 />;
            if (activeLO === 3) return <NdPsCommLO3 />;
            if (activeLO === 4) return <NdPsCommLO4 />;
        }
        if (subjectKey === 'principles-of-purchasing-and-supply') {
            if (activeLO === 1) return <NdPsPrinLO1 />;
            if (activeLO === 2) return <NdPsPrinLO2 />;
            if (activeLO === 3) return <NdPsPrinLO3 />;
            if (activeLO === 4) return <NdPsPrinLO4 />;
            if (activeLO === 5) return <NdPsPrinLO5 />;
            if (activeLO === 6) return <NdPsPrinLO6 />;
            if (activeLO === 7) return <NdPsPrinLO7 />;
            if (activeLO === 8) return <NdPsPrinLO8 />;
        }
        if (subjectKey === 'inventory-management') {
            if (activeLO === 1) return <NdPsInvLO1 />;
            if (activeLO === 2) return <NdPsInvLO2 />;
            if (activeLO === 3) return <NdPsInvLO3 />;
            if (activeLO === 4) return <NdPsInvLO4 />;
            if (activeLO === 5) return <NdPsInvLO5 />;
            if (activeLO === 6) return <NdPsInvLO6 />;
        }
        if (subjectKey === 'management-of-org-assets') {
            if (activeLO === 1) return <NdPsAssetsLO1 />;
            if (activeLO === 2) return <NdPsAssetsLO2 />;
            if (activeLO === 3) return <NdPsAssetsLO3 />;
            if (activeLO === 4) return <NdPsAssetsLO4 />;
            if (activeLO === 5) return <NdPsAssetsLO5 />;
        }
        if (subjectKey === 'legal-aspects-of-procurement') {
            if (activeLO === 1) return <NdPsLegalLO1 />;
            if (activeLO === 2) return <NdPsLegalLO2 />;
            if (activeLO === 3) return <NdPsLegalLO3 />;
            if (activeLO === 4) return <NdPsLegalLO4 />;
            if (activeLO === 5) return <NdPsLegalLO5 />;
            if (activeLO === 6) return <NdPsLegalLO6 />;
            if (activeLO === 7) return <NdPsLegalLO7 />;
            if (activeLO === 8) return <NdPsLegalLO8 />;
            if (activeLO === 9) return <NdPsLegalLO9 />;
        }
        if (subjectKey === 'logistics-and-distribution-mgmt') {
            if (activeLO === 1) return <NdPsLogDistLO1 />;
            if (activeLO === 2) return <NdPsLogDistLO2 />;
            if (activeLO === 3) return <NdPsLogDistLO3 />;
            if (activeLO === 4) return <NdPsLogDistLO4 />;
            if (activeLO === 5) return <NdPsLogDistLO5 />;
            if (activeLO === 6) return <NdPsLogDistLO6 />;
            if (activeLO === 7) return <NdPsLogDistLO7 />;
            if (activeLO === 8) return <NdPsLogDistLO8 />;
        }
        if (subjectKey === 'public-procurement') {
            if (activeLO === 1) return <NdPsPublicLO1 />;
            if (activeLO === 2) return <NdPsPublicLO2 />;
            if (activeLO === 3) return <NdPsPublicLO3 />;
            if (activeLO === 4) return <NdPsPublicLO4 />;
            if (activeLO === 5) return <NdPsPublicLO5 />;
            if (activeLO === 6) return <NdPsPublicLO6 />;
            if (activeLO === 7) return <NdPsPublicLO7 />;
            if (activeLO === 8) return <NdPsPublicLO8 />;
            if (activeLO === 9) return <NdPsPublicLO9 />;
            if (activeLO === 10) return <NdPsPublicLO10 />;
        }
        if (subjectKey === 'strategic-procurement') {
            if (activeLO === 1) return <NdPsStrategicLO1 />;
            if (activeLO === 2) return <NdPsStrategicLO2 />;
            if (activeLO === 3) return <NdPsStrategicLO3 />;
            if (activeLO === 4) return <NdPsStrategicLO4 />;
        }
        if (subjectKey === 'procurement-negotiation') {
            if (activeLO === 1) return <NdPsNegLO1 />;
            if (activeLO === 2) return <NdPsNegLO2 />;
            if (activeLO === 3) return <NdPsNegLO3 />;
            if (activeLO === 4) return <NdPsNegLO4 />;
            if (activeLO === 5) return <NdPsNegLO5 />;
            if (activeLO === 6) return <NdPsNegLO6 />;
            if (activeLO === 7) return <NdPsNegLO7 />;
        }

    }

    if (levelMeta?.category === 'ZJC' || usesSharedFormOneLanguageContent || subjectKey === 'agriculture') {
        const zjcContent = (
            <ZjcDynamicSubjectViewer
                level={level}
                subject={subject}
                activeUnit={activeLO}
                onNavigateToUnit={selectOutcome}
                fallback={<TechnicalPlaceholder level={level} subject={subject} lo={activeLO} />}
            />
        );

        if (isFormOneMaths) {
            return (
                <MathRenderGate gateKey={contentId}>
                    {zjcContent}
                </MathRenderGate>
            );
        }

        return (
            zjcContent
        );
    }

    return <TechnicalPlaceholder level={level} subject={subject} lo={activeLO} />;
};

  const hasSwitchedOutcome = useRef(false);
  useEffect(() => {
    // Switching outcome should start at the top, but the first run of this
    // effect is the initial mount - jumping to 0 there would undo the scroll
    // position useLessonScrollMemory is restoring after a refresh.
    if (hasSwitchedOutcome.current) {
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'instant' });
    }
    hasSwitchedOutcome.current = true;
    setIsSidebarOpen(false);
    setIsMobileLessonSearchOpen(false);
    setLessonSearchQuery('');
    setLessonSearchSuggestions([]);
  }, [activeLO]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLInputElement>('#lesson-scroll-area input[placeholder^="Search sections"]')
        .forEach((input) => {
          const searchBar = input.closest('div.sticky');
          if (searchBar instanceof HTMLElement) {
            searchBar.style.display = 'none';
          }
        });
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [activeLO, subject]);

  // Keep the selected item centred in every lesson's existing horizontal
  // chapter bar. This is behavioural only: each subject keeps its own design.
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let scrollArea: HTMLElement | null = null;

    const isActiveChapterButton = (button: HTMLButtonElement) => {
      if (button.getAttribute('aria-current') === 'page') return true;
      const activeColour = /^(?:bg-)(?:indigo|violet|purple|fuchsia|blue|sky|cyan|teal|emerald|green|lime|amber|orange|red|rose|slate)-(?:500|600|700|800|900)$/;
      return (
        button.classList.contains('text-white') &&
        Array.from(button.classList).some((name) => activeColour.test(name))
      );
    };

    const centreButton = (button: HTMLButtonElement) => {
      const scroller = button.closest<HTMLElement>('[class*="overflow-x-auto"]');
      if (!scroller || !isActiveChapterButton(button)) return;
      if (scroller.dataset.mathChapterScroller === 'true' || /^(Physics|Mathematics)$/i.test(subject)) {
        // Mathematics topic rails stay anchored to the left, matching the
        // Geography lessons. Also clear centring left behind by this effect
        // during hot reloads or when navigating between lesson types.
        scroller.style.removeProperty('padding-inline');
        delete scroller.dataset.centresActiveChapter;
        return;
      }
      // Percentage padding consumed the whole phone width and pushed sibling
      // arrow controls outside the page. Scroll within the real content bounds.
      scroller.style.removeProperty('padding-inline');
      delete scroller.dataset.centresActiveChapter;
      const scrollerRect = scroller.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const left =
        scroller.scrollLeft +
        buttonRect.left -
        scrollerRect.left -
        (scroller.clientWidth - buttonRect.width) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    };

    const handleScrollAreaClick = (event: Event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (button) window.setTimeout(() => centreButton(button), 0);
    };

    const setupFrame = window.requestAnimationFrame(() => {
      scrollArea = document.getElementById('lesson-scroll-area');
      if (!scrollArea) return;

      scrollArea.querySelectorAll<HTMLButtonElement>('button').forEach(centreButton);

      scrollArea.addEventListener('click', handleScrollAreaClick);

      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target instanceof HTMLButtonElement) centreButton(mutation.target);
        });
      });
      observer.observe(scrollArea, {
        attributes: true,
        attributeFilter: ['class', 'aria-current'],
        subtree: true,
      });
    });

    return () => {
      window.cancelAnimationFrame(setupFrame);
      scrollArea?.removeEventListener('click', handleScrollAreaClick);
      observer?.disconnect();
    };
  }, [activeLO, subject]);

  const getLessonHeadingSuggestions = (query: string) => {
    const trimmedQuery = query.trim();
    const scrollArea = document.getElementById('lesson-scroll-area');
    if (!trimmedQuery || !scrollArea) return [];

    const headings = Array.from(scrollArea.querySelectorAll<HTMLElement>('h1, h2, h3, h4'));
    const normalizedQuery = trimmedQuery.toLowerCase();

    return headings
      .map((element, index) => ({
        id: element.id || `lesson-heading-${activeLO}-${index}`,
        label: element.textContent?.replace(/\s+/g, ' ').trim() || '',
        element,
      }))
      .filter((item) => item.label.toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  };

  const updateLessonSearch = (query: string) => {
    setLessonSearchQuery(query);
    setLessonSearchSuggestions(getLessonHeadingSuggestions(query));
  };

  const scrollToLessonHeading = (target: HTMLElement) => {
    const scrollArea = document.getElementById('lesson-scroll-area');
    if (!scrollArea) return;

    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top - scrollAreaRect.top + scrollArea.scrollTop - 18;

    scrollArea.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });

    target.style.animation = 'none';
    void target.offsetWidth;
    target.style.animation = 'lesson-heading-pulse 0.7s ease-in-out 3';
    window.setTimeout(() => {
      target.style.animation = '';
    }, 2300);
    setIsLessonSearchFocused(false);
    setIsMobileLessonSearchOpen(false);
  };

  const selectLessonSuggestion = (suggestion: { label: string; element: HTMLElement }) => {
    setLessonSearchQuery(suggestion.label);
    setLessonSearchSuggestions([]);
    scrollToLessonHeading(suggestion.element);
  };

  const runLessonSearch = () => {
    const suggestions = getLessonHeadingSuggestions(lessonSearchQuery);
    setLessonSearchSuggestions(suggestions);
    if (suggestions[0]) {
      scrollToLessonHeading(suggestions[0].element);
    }
  };

  const clearLessonSearch = () => {
    setLessonSearchQuery('');
    setLessonSearchSuggestions([]);
    window.getSelection()?.removeAllRanges();
  };

  const renderLessonSearch = (variant: 'desktop' | 'mobile') => (
    <div
      id={variant === 'mobile' ? 'mobile-lesson-search' : undefined}
      className={`relative min-w-0 ${variant === 'desktop' ? 'hidden md:block w-[320px] lg:w-[420px]' : 'flex-1'}`}
    >
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      <input
        value={lessonSearchQuery}
        onChange={(e) => updateLessonSearch(e.target.value)}
        onFocus={() => {
          setIsLessonSearchFocused(true);
          setLessonSearchSuggestions(getLessonHeadingSuggestions(lessonSearchQuery));
        }}
        onBlur={() => window.setTimeout(() => setIsLessonSearchFocused(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            runLessonSearch();
          }
        }}
        placeholder="Search this lesson..."
        className={`w-full h-9 pl-9 pr-9 rounded-md border text-xs font-semibold outline-none transition-colors ${
          isDarkMode
            ? 'bg-[#1e1e1e] border-[#404040] text-white placeholder:text-gray-500 focus:border-indigo-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400'
        }`}
      />
      {lessonSearchQuery ? (
        <button
          onClick={clearLessonSearch}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#333]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'}`}
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : null}
      {isLessonSearchFocused && lessonSearchQuery.trim() ? (
        <div className={`absolute left-0 right-0 top-[calc(100%+6px)] z-[200] overflow-hidden rounded-lg border shadow-2xl ${isDarkMode ? 'bg-[#252526] border-[#404040]' : 'bg-white border-gray-200'}`}>
          {lessonSearchSuggestions.length > 0 ? (
            lessonSearchSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectLessonSuggestion(suggestion);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  selectLessonSuggestion(suggestion);
                }}
                className={`block w-full px-4 py-3 text-left text-xs font-bold transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-[#333]' : 'text-gray-700 hover:bg-indigo-50'}`}
              >
                {suggestion.label}
              </button>
            ))
          ) : (
            <div className={`px-4 py-3 text-xs font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No headings found
            </div>
          )}
        </div>
      ) : null}
    </div>
  );

  const getTextSizeClass = () => {
      switch(textSize) {
          case 1: return 'text-xs md:text-sm';
          case 2: return 'text-sm md:text-base';
          case 3: return 'text-base md:text-lg';
          case 4: return 'text-lg md:text-xl';
          case 5: return 'text-xl md:text-2xl';
          default: return 'text-sm md:text-base';
      }
  };

  // Special full-page mode for subjects with their own sub-navigation (e.g. Database Concepts)
  const isSubjectSelfNav = 
    subject === 'Database Concepts' || 
    subject === 'Computer Networking' || 
    subject === 'Computer Security' ||
    subject === 'National & Strategic Studies' ||
    subject === 'National Studies';

  if (!hasContent) {
      return <UnderConstructionPage level={level} subject={subject} onBack={onBack} />;
  }

  if (isSubjectSelfNav) {
      return (
          <LessonChunkBoundary resetKey={contentId}>
              <LessonScopeContext.Provider value={contentId}>
                  {renderUnitContent()}
              </LessonScopeContext.Provider>
          </LessonChunkBoundary>
      );
  }

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}`}>
      <style>{`
        @keyframes lesson-heading-pulse {
          0%, 100% { background-color: transparent; box-shadow: none; }
          45% { background-color: rgba(250, 204, 21, 0.42); box-shadow: 0 0 0 6px rgba(250, 204, 21, 0.18); }
        }
      `}</style>
      
      {/* Top Navbar */}
      <div className={`h-14 border-b flex items-center justify-between gap-3 px-3 sm:px-4 shrink-0 shadow-sm ${isDarkMode ? "bg-[#2d2d2d] border-[#404040]" : "bg-white border-gray-200"}`}>
        <div className={`flex min-w-0 items-center gap-3 ${isMobileLessonSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
          <button
            onClick={onBack}
            className={`p-1.5 rounded-md transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-bold text-base tracking-tight sm:text-lg">
              <span className="sm:hidden">{mobileSubjectLabel}</span>
              <span className="hidden sm:inline">{subject}</span>
            </h1>
            <span
              className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full shrink-0 whitespace-nowrap ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"} hidden sm:inline-block`}
            >
              {level.replace('NC Information Technology', 'NC Module').replace('ND Information Technology', 'ND Module')}
            </span>
          </div>
        </div>
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          {renderLessonSearch('desktop')}
        </div>
        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 md:hidden">
          {isMobileLessonSearchOpen ? (
            <div className="w-[calc(100vw-86px)] max-w-[330px]">
              {renderLessonSearch('mobile')}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsMobileLessonSearchOpen(true);
                  window.setTimeout(() => {
                    document
                      .querySelector<HTMLInputElement>('#mobile-lesson-search input')
                      ?.focus();
                  }, 0);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'border-[#404040] bg-[#252526] text-gray-200 hover:bg-[#333]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Search lesson"
              >
                <Search className="h-5 w-5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={`flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-black shadow-sm transition-colors text-white ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#003153] hover:bg-[#003153]/90'
            }`}
            title="Open topics"
          >
            <span className="grid grid-cols-2 gap-0.5">
              <span className="h-1.5 w-1.5 rounded-[2px] border border-white/90" />
              <span className="h-1.5 w-1.5 rounded-[2px] border border-white/90" />
              <span className="h-1.5 w-1.5 rounded-[2px] border border-white/90" />
              <span className="h-1.5 w-1.5 rounded-[2px] border border-white/90" />
            </span>
            <span>{unitNavLabel}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden lg:flex-row flex-col relative w-full">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-[110] flex flex-col w-[280px] shrink-0 h-full transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isDarkMode ? 'bg-[#1e1e1e] border-r border-[#404040]' : 'bg-white border-r border-gray-200'}`}>
            <div className={`h-14 lg:hidden border-b flex items-center justify-between px-4 shrink-0 ${isDarkMode ? 'border-[#404040]' : 'border-gray-200'}`}>
              <span className="font-semibold text-sm">Table of Contents</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`p-1.5 rounded-[5px] ${isDarkMode ? "text-gray-400 hover:bg-[#404040]" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
            <nav className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 py-6 space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider mb-4 px-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Topics
                </p>
                {Array.from({ length: outcomeCount }, (_, i) => i + 1).map(num => {
                  const loId = `${level}_${subject}_LO${num}`.replace(/\s+/g, '_');
                  const isLOCompleted = userProfile?.completedTopics?.[loId] || false;
                  
                  let unitLabel = subjectMeta?.outcomes?.[num - 1] || (levelMeta?.category === 'Polytechnic' ? `Learning Outcome ${num}` : `Unit ${num}`);
                  if (isFrsSubject) {
                      unitLabel = `Topic ${num}`;
                  } else if (subject === 'Geography') {
                      unitLabel = GEOGRAPHY_OUTCOMES[num - 1] || `Topic ${num}`;
                  } else if (subject === 'Shona') {
                      if (num === 1) unitLabel = "Rondedzero neTsamba";
                      else if (num === 2) unitLabel = "Tsumo";
                      else if (num === 3) unitLabel = "Madimikira";
                      else if (num === 4) unitLabel = "Zvirevo";
                      else if (num === 5) unitLabel = "Kufananidza neKushasa";
                      else if (num === 6) unitLabel = "Zvidavado";
                      else if (num === 7) unitLabel = "Madimikira eRuremekedzo";
                      else if (num === 8) unitLabel = "Madimikira eKuwedzeredza";
                      else if (num === 9) unitLabel = "Mipanda yeMazita";
                      else if (num === 10) unitLabel = "Zvisazitasingwi";
                  } else if (subject === 'English Language') {
                      if (num === 1) unitLabel = "Grammar & Structure";
                      else if (num === 2) unitLabel = "Vocabulary Mastery";
                      else if (num === 3) unitLabel = "Reading & Literature";
                      else if (num === 4) unitLabel = "Basic Composition";
                      else if (num === 5) unitLabel = "Advanced Composition";
                      else if (num === 6) unitLabel = "Comprehension & Summary";
                      else if (num === 7) unitLabel = "Oral Communication";
                      else if (num === 8) unitLabel = "Functional Writing";
                      else if (num === 9) unitLabel = "Exam & Study Skills";
                      else if (num === 10) unitLabel = "Language in Use";
                  } else if (subject === 'Web Development' || subject === 'Information Security' || subject === 'Operating Systems Administration' || subject === 'Design & Analysis of Algorithms' || subject === 'Research & Project Management') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Computer Systems Maintenance') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Programming Concepts') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Database Concepts') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Workplace Communication') {
                      if (num === 1) unitLabel = "Learning Outcome 1";
                      else if (num === 2) unitLabel = "Learning Outcome 2";
                      else if (num === 3) unitLabel = "English Grammar";
                  } else if (subject === 'Entrepreneurship Skills Development') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Hardware Administration') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Network Administration') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Database Administration') {
                      if (num === 6) unitLabel = "Practice SQL";
                      else unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Software Engineering') {
                      unitLabel = `Learning Outcome ${num}`;
                  } else if (subject === 'Object Oriented Programming') {
                      if (num === 8) unitLabel = "Practise Practical C#";
                      else unitLabel = `Learning Outcome ${num}`;
                  }

                  const displayLabel = unitLabel.replace(/\s*\(\d+\)/g, '').replace(/\s+/g, ' ').trim();

                  return (
                    <div
                      key={num}
                      className={num === outcomeCount ? '' : `border-b ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-200/60'}`}
                    >
                      <button
                        onClick={() => selectOutcome(num)}
                        className={`my-0.5 flex w-full items-center justify-between gap-3 rounded-[5px] px-3 py-2.5 text-left transition-all ${activeLO === num ? (isDarkMode ? 'bg-[#2d2d2d] text-indigo-400 shadow-sm border border-[#404040]' : 'bg-white text-indigo-700 shadow-sm border border-gray-200') : (isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]/50 hover:text-white border border-transparent' : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent')}`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                            <span className="text-sm font-medium block leading-snug break-words">{displayLabel}</span>
                        </div>
                        {isLOCompleted && <CheckCircle className={`w-4 h-4 shrink-0 ${activeLO === num ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : 'text-green-500'}`} />}
                      </button>
                    </div>
                  );
                })}
                {subjectKey === 'combined-science' && ['form-3', 'form-4'].includes(levelKey) && (
                  <a
                    href="/practicals/olevel/combined-science"
                    className={`mt-4 flex items-center justify-between gap-3 rounded-[8px] border p-4 shadow-sm transition-all hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'border-cyan-500/25 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-950/50'
                        : 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 text-slate-900 hover:border-cyan-300'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className={`block text-[10px] font-black uppercase tracking-[0.22em] ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                        Science Lab
                      </span>
                      <span className="mt-1 block text-sm font-black">Go to Science Lab</span>
                    </span>
                    <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg ${isDarkMode ? 'bg-cyan-400/15 text-cyan-200' : 'bg-cyan-600 text-white'}`}>
                      →
                    </span>
                  </a>
                )}
                <div key={`ads-${activeLO}`} className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 space-y-4">
                  <AdSense key={`sidebar-ad-top-${activeLO}`} adSlot="7822405452" />
                  <AdSense key={`sidebar-ad-bottom-${activeLO}`} adSlot="7822405452-2" />
                </div>
            </nav>
        </div>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[105] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

        {/* Main Content Area */}
        <div className={`flex flex-col flex-1 min-h-0 min-w-0 transition-all ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"}`}>
            <div className={`min-h-14 px-3 md:px-4 py-2 md:py-3 items-center justify-between gap-2 shrink-0 border-b ${isDarkMode ? "bg-[#252526] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"} ${!(pagerState && pagerState.totalPages > 1) ? 'hidden' : 'flex'}`}>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                </div>

                <div className="flex shrink-0 items-center gap-2 flex-wrap"> 
                    {pagerState && pagerState.totalPages > 1 && (
                      <div className="flex items-center gap-2 md:gap-4 z-10">
                          <button 
                            onClick={() => window.dispatchEvent(new Event('pager-prev'))}
                            disabled={pagerState.currentPage === 1}
                            className="px-3 py-1 text-xs md:text-sm bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                            Previous
                          </button>
                          <div className="hidden sm:block text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{pagerState.currentPage}</span> / {pagerState.totalPages}
                          </div>
                          <button 
                            onClick={() => window.dispatchEvent(new Event('pager-next'))}
                            disabled={pagerState.currentPage === pagerState.totalPages}
                            className="px-3 py-1 text-xs md:text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                            Next
                          </button>
                      </div>
                    )}
                </div>
            </div>

            <div
              id="lesson-scroll-area"
              className={`relative flex-1 min-h-0 min-w-0 max-w-full overflow-y-auto overflow-x-hidden custom-scrollbar ${isDarkMode ? "bg-[#1e1e1e]" : "bg-[#fcfdfc]"}`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
                <div className={`w-full ${/^Form\s*[1-4]$/i.test(level) ? 'school-lesson-content' : ''} ${getTextSizeClass()}`}>
                   <LessonChunkBoundary resetKey={contentId}>
                      <LessonScopeContext.Provider value={contentId}>
                         {renderUnitContent()}
                      </LessonScopeContext.Provider>
                   </LessonChunkBoundary>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
