import React, { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import { Header } from "../components/layout/Header";
import { RouteSeo } from "../seo/RouteSeo";
import { AnalyticsTracker } from "../features/analytics/AnalyticsTracker";
import { PwaInstallPrompt } from "../features/pwa/PwaInstallPrompt";
import { Hero } from "../features/home/Hero";
import { FloatingWhatsAppBot } from "../features/ai/FloatingWhatsAppBot";
import { SelectionSidemannAI } from "../features/ai/SelectionSidemannAI";
import { CompactSchoolFinder as SchoolFinder } from "../features/schools/CompactSchoolFinder";
import { SchoolCalendar } from "../features/schools/SchoolCalendar";
import { CompactLatestNews as Features } from "../features/news/CompactLatestNews";
import { Footer } from "../components/layout/Footer";
import { Feedback } from "../features/community/Feedback";
import { Profile } from "../features/account/Profile";
import { Dashboard } from "../features/dashboard/Dashboard";
import { TeacherDashboard } from "../features/dashboard/TeacherDashboard";
import { ParentDashboard } from "../features/dashboard/ParentDashboard";
import { Messages } from "../features/community/Messages";
import { Communities } from "../features/community/Communities";
import { PublicProfile } from "../features/account/PublicProfile";
import { NotificationsPage } from "../features/account/NotificationsPage";
import { CoursesOverview } from "../features/courses/CoursesOverview";
import { CompactSyllabi as Syllabi } from "../features/resources/CompactSyllabi";
import { CompactPastPapers as PastPapers } from "../features/resources/CompactPastPapers";
import { PastPaperDetailPage } from "../features/resources/PastPaperDetailPage";
import { CompactExtraLessons as ExtraLessons } from "../features/resources/CompactExtraLessons";
import { TeacherSignupPage } from "../features/auth/TeacherSignupPage";
import { ClassRoom } from "../features/courses/ClassRoom";
import { CompactLibrary as Library } from "../features/resources/CompactLibrary";
import { VideoLibrary as Tutorials } from "../features/tutorials/VideoLibrary";
import { TutorialsStudio } from "../features/tutorials/TutorialsStudio";
import { SchoolDirectory } from "../features/schools/SchoolDirectory";
import { NewsPage } from "../features/news/NewsPage";
import { NewsArticle } from "../features/news/NewsArticle";
import { useAuth } from "../contexts/AuthContext";
import { LoginPage } from "../features/auth/LoginPage";
import { SavedResources } from "../features/account/SavedResources";
import { LevelQuickNav } from "../features/resources/LevelQuickNav";
import { PlatformImpact } from "../features/home/PlatformImpact";
import { HomeCommunitySections } from "../features/home/HomeCommunitySections";
import { PremiumPlans } from "../features/billing/PremiumPlans";
import { PaymentPage } from "../features/billing/PaymentPage";
import { PageUnderConstruction } from "../components/ui/PageUnderConstruction";
import { findPastPaperCourse, findPastPaperSubject, getPastPaperCoursePath, getPastPaperSubjectPath } from "../utils/pastPaperSeo";
import { FULL_SCREEN_EXPERIMENT_PATHS } from "../data/experimentRegistry";
import { schoolForId, schoolForSlug, schoolSlugForName } from "../data/schoolRegistry";
import { slugifyZimbabwePlace } from "../data/zimGeo";
import { CURRICULUM_REGISTRY } from "../data/constants";
import { slugifyLearningPath } from "../utils/learningOutcomeSeo";
import { useFeatureFlags } from "../services/featureFlags";

import { ContactPage } from "../features/about/ContactPage";
import { AboutPage } from "../features/about/AboutPage";
import { PricingPage } from "../features/billing/PricingPage";
import { CheckoutPage } from "../features/billing/CheckoutPage";
import { PrivacyPolicy } from "../features/about/PrivacyPolicy";
import { TermsOfService } from "../features/about/TermsOfService";
import { CreditsPage } from "../features/about/CreditsPage";
import { EditorialPolicy } from "../features/about/EditorialPolicy";
import { ConsentBanner } from "../features/privacy/ConsentBanner";
import { ProgressSignInPrompt } from "../features/auth/ProgressSignInPrompt";
import { GoogleOneTap } from "../features/auth/GoogleOneTap";

const lazyNamed = (
  loader: () => Promise<any>,
  exportName: string,
): React.LazyExoticComponent<React.ComponentType<any>> =>
  React.lazy(async () => {
    const module = await loader();
    return { default: module[exportName] as React.ComponentType<any> };
  });

const CoursePage = React.lazy(() =>
  import("../features/courses/CoursePage").then((module) => ({
    default: module.CoursePage,
  })),
);
const LearningCourseRoute = lazyNamed(
  () => import("../features/courses/LearningOutcomeRoutes"),
  "LearningCourseRoute",
);
const LearningSubjectRoute = lazyNamed(
  () => import("../features/courses/LearningOutcomeRoutes"),
  "LearningSubjectRoute",
);
const LearningOutcomePage = lazyNamed(
  () => import("../features/courses/LearningOutcomeRoutes"),
  "LearningOutcomePage",
);
const Settings = React.lazy(() =>
  import("../features/account/Settings").then((module) => ({
    default: module.Settings,
  })),
);
const ChatInterface = React.lazy(() =>
  import("../features/ai/ChatInterface").then((module) => ({
    default: module.ChatInterface,
  })),
);
const CodeAgentWorkspace = React.lazy(() =>
  import("../features/ai/CodeAgentWorkspace").then((module) => ({
    default: module.CodeAgentWorkspace,
  })),
);
const AiChatHistoryPage = React.lazy(() =>
  import("../features/ai/AiChatHistoryPage").then((module) => ({
    default: module.AiChatHistoryPage,
  })),
);
const IQTrainer = React.lazy(() =>
  import("../features/iq-trainer/IQTrainer").then((module) => ({
    default: module.IQTrainer,
  })),
);
const AdminPage = React.lazy(() =>
  import("../features/admin/AdminPage").then((module) => ({
    default: module.AdminPage,
  })),
);
const WebDevLayout = lazyNamed(
  () => import("../features/tutorials/webdev/WebDevLayout"),
  "WebDevLayout",
);
const HtmlCssBasics = lazyNamed(
  () => import("../features/tutorials/webdev/HtmlCssBasics"),
  "HtmlCssBasics",
);
const DatabaseAdministration = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nd-it/tutorials/subjects/DatabaseAdministration"
    ),
  "DatabaseAdministration",
);
const ObjectOrientedProgramming = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nd-it/tutorials/subjects/ObjectOrientedProgramming"
    ),
  "ObjectOrientedProgramming",
);
const WebDevelopment = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nd-it/tutorials/subjects/WebDevelopment"
    ),
  "WebDevelopment",
);
const OperatingSystems = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nd-it/tutorials/subjects/OperatingSystems"
    ),
  "OperatingSystems",
);
const ComputerSystemsMaintenance = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nc-it/tutorials/subjects/ComputerSystemsMaintenance"
    ),
  "ComputerSystemsMaintenance",
);
const PlaceholderPractical = lazyNamed(
  () => import("../features/courses/common/PlaceholderPractical"),
  "PlaceholderPractical",
);
const SQLPractice = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nc-it/database-concepts/SQLPractice"
    ),
  "SQLPractice",
);
const PracticeCSharp = lazyNamed(
  () =>
    import(
      "../features/courses/polytechnic/nd-it/object-oriented-programming/PracticeCSharp"
    ),
  "PracticeCSharp",
);
const PracticeCpp = lazyNamed(
  () => import("../features/practicals/tools/cpp/PracticeCpp"),
  "PracticeCpp",
);
const WebDevIDE = lazyNamed(
  () => import("../features/practicals/tools/webdev/WebDevIDE"),
  "WebDevIDE",
);
const VBNetStudio = lazyNamed(
  () => import("../features/practicals/tools/vbnet/VBNetStudio"),
  "VBNetStudio",
);
const MSAccessLab = lazyNamed(
  () => import("../features/practicals/tools/access/MSAccessLab"),
  "MSAccessLab",
);
const EcdWelcome = lazyNamed(
  () => import("../features/ecd/EcdWelcome"),
  "EcdWelcome",
);
const EcdJourney = lazyNamed(
  () => import("../features/ecd/EcdJourney"),
  "EcdJourney",
);
const EcdReading = lazyNamed(
  () => import("../features/ecd/reading/EcdReading"),
  "EcdReading",
);
const EcdLetters = lazyNamed(
  () => import("../features/ecd/reading/EcdLetters"),
  "EcdLetters",
);
const EcdPhonics = lazyNamed(
  () => import("../features/ecd/reading/EcdPhonics"),
  "EcdPhonics",
);
const EcdRhyming = lazyNamed(
  () => import("../features/ecd/reading/EcdRhyming"),
  "EcdRhyming",
);
const EcdNumberDrive = lazyNamed(
  () => import("../features/ecd/maths/EcdNumberDrive"),
  "EcdNumberDrive",
);
const EcdMaths = lazyNamed(
  () => import("../features/ecd/maths/EcdMaths"),
  "EcdMaths",
);
const EcdPresentCount = lazyNamed(
  () => import("../features/ecd/maths/EcdPresentCount"),
  "EcdPresentCount",
);
const EcdStarWish = lazyNamed(
  () => import("../features/ecd/maths/EcdStarWish"),
  "EcdStarWish",
);
const EcdTraceNumbers = lazyNamed(
  () => import("../features/ecd/maths/EcdTraceNumbers"),
  "EcdTraceNumbers",
);
const EcdWakeUp = lazyNamed(
  () => import("../features/ecd/maths/EcdWakeUp"),
  "EcdWakeUp",
);
const EcdSubitise = lazyNamed(
  () => import("../features/ecd/maths/EcdSubitise"),
  "EcdSubitise",
);
const EcdOneMore = lazyNamed(
  () => import("../features/ecd/maths/EcdOneMore"),
  "EcdOneMore",
);
const EcdCountBack = lazyNamed(
  () => import("../features/ecd/maths/EcdCountBack"),
  "EcdCountBack",
);
const EcdCaveAdd = lazyNamed(
  () => import("../features/ecd/maths/EcdCaveAdd"),
  "EcdCaveAdd",
);
const EcdTenFrame = lazyNamed(
  () => import("../features/ecd/maths/EcdTenFrame"),
  "EcdTenFrame",
);
const EcdAboveBelow = lazyNamed(
  () => import("../features/ecd/maths/EcdAboveBelow"),
  "EcdAboveBelow",
);
const PracticalsLandingPage = lazyNamed(
  () => import("../features/practicals/PracticalsLandingPage"),
  "PracticalsLandingPage",
);
const AllPracticalsPage = lazyNamed(
  () => import("../features/practicals/AllPracticalsPage"),
  "AllPracticalsPage",
);
const PolyTechnicLandingPage = lazyNamed(
  () => import("../features/practicals/PolyTechnicLandingPage"),
  "PolyTechnicLandingPage",
);
const TechnicalDrawingStudio = lazyNamed(
  () =>
    import(
      "../features/practicals/polytechnic/technical-drawing/TechnicalDrawingStudio"
    ),
  "TechnicalDrawingStudio",
);
const FabricationDrawingStudio = lazyNamed(
  () =>
    import(
      "../features/practicals/polytechnic/fabrication-engineering/FabricationDrawingStudio"
    ),
  "FabricationDrawingStudio",
);
const PracticalsLevelPage = lazyNamed(
  () => import("../features/practicals/PracticalsLevelPage"),
  "PracticalsLevelPage",
);
const MathCameraTutor = lazyNamed(
  () => import("../features/practicals/mathematics/MathCameraTutor"),
  "MathCameraTutor",
);
const OLevelProjectileMotionPage = lazyNamed(
  () => import("../features/practicals/OLevelProjectileMotionPage"),
  "OLevelProjectileMotionPage",
);
const OLevelHookesLawPage = lazyNamed(
  () => import("../features/practicals/OLevelHookesLawPage"),
  "OLevelHookesLawPage",
);
const OLevelPendulumPage = lazyNamed(
  () => import("../features/practicals/OLevelPendulumPage"),
  "OLevelPendulumPage",
);
const OLevelDensityPage = lazyNamed(
  () => import("../features/practicals/OLevelDensityPage"),
  "OLevelDensityPage",
);
const OLevelTerminalVelocityPage = lazyNamed(
  () => import("../features/practicals/OLevelTerminalVelocityPage"),
  "OLevelTerminalVelocityPage",
);

const physicsPagesLoader = () =>
  import("../features/practicals/o-level/physics-experiments/PhysicsPages");
const OLevelPrincipleOfMomentsPage = lazyNamed(
  physicsPagesLoader,
  "OLevelPrincipleOfMomentsPage",
);
const OLevelCentreOfGravityPage = lazyNamed(
  physicsPagesLoader,
  "OLevelCentreOfGravityPage",
);
const OLevelInclinedPlanePage = lazyNamed(
  physicsPagesLoader,
  "OLevelInclinedPlanePage",
);
const OLevelConservationOfMomentumPage = lazyNamed(
  physicsPagesLoader,
  "OLevelConservationOfMomentumPage",
);
const OLevelMachineEfficiencyPage = lazyNamed(
  physicsPagesLoader,
  "OLevelMachineEfficiencyPage",
);
const OLevelSpecificHeatSolidPage = lazyNamed(
  physicsPagesLoader,
  "OLevelSpecificHeatSolidPage",
);
const OLevelSpecificHeatLiquidPage = lazyNamed(
  physicsPagesLoader,
  "OLevelSpecificHeatLiquidPage",
);
const OLevelHeatingCoolingCurvePage = lazyNamed(
  physicsPagesLoader,
  "OLevelHeatingCoolingCurvePage",
);
const OLevelExpansionOfSolidsPage = lazyNamed(
  physicsPagesLoader,
  "OLevelExpansionOfSolidsPage",
);
const OLevelBoylesLawPage = lazyNamed(
  physicsPagesLoader,
  "OLevelBoylesLawPage",
);
const OLevelMagneticFieldLinesPage = lazyNamed(
  physicsPagesLoader,
  "OLevelMagneticFieldLinesPage",
);
const OLevelMagneticMaterialsPage = lazyNamed(
  physicsPagesLoader,
  "OLevelMagneticMaterialsPage",
);
const OLevelMagnetisationPage = lazyNamed(
  physicsPagesLoader,
  "OLevelMagnetisationPage",
);
const OLevelResistanceOfAWirePage = lazyNamed(
  physicsPagesLoader,
  "OLevelResistanceOfAWirePage",
);
const OLevelRheostatPage = lazyNamed(physicsPagesLoader, "OLevelRheostatPage");
const OLevelResistorCombinationsPage = lazyNamed(
  physicsPagesLoader,
  "OLevelResistorCombinationsPage",
);
const OLevelElectrostaticsPage = lazyNamed(
  physicsPagesLoader,
  "OLevelElectrostaticsPage",
);

const chemistryPagesLoader = () =>
  import("../features/practicals/o-level/chemistry-experiments/ChemistryPages");
const OLevelChromatographyPage = lazyNamed(
  chemistryPagesLoader,
  "OLevelChromatographyPage",
);
const OLevelChemistryTitrationPage = lazyNamed(
  chemistryPagesLoader,
  "OLevelChemistryTitrationPage",
);
const OLevelQualitativeAnalysisPage = lazyNamed(
  chemistryPagesLoader,
  "OLevelQualitativeAnalysisPage",
);

const combinedScienceLoader = () =>
  import(
    "../features/practicals/o-level/combined-science/CombinedScience"
  );
const CombinedScience = lazyNamed(combinedScienceLoader, "CombinedScience");
const FoodTestsPage = lazyNamed(combinedScienceLoader, "FoodTestsPage");
const ForceAndMotionPage = lazyNamed(
  combinedScienceLoader,
  "ForceAndMotionPage",
);
const PhotosynthesisPage = lazyNamed(
  combinedScienceLoader,
  "PhotosynthesisPage",
);
const RatesOfReactionPage = lazyNamed(
  combinedScienceLoader,
  "RatesOfReactionPage",
);
const RespirationPage = lazyNamed(combinedScienceLoader, "RespirationPage");
const OxygenFromPhotosynthesisPage = lazyNamed(
  combinedScienceLoader,
  "OxygenFromPhotosynthesisPage",
);
const InhaledExhaledAirPage = lazyNamed(
  combinedScienceLoader,
  "InhaledExhaledAirPage",
);
const CandleOxygenTestPage = lazyNamed(
  combinedScienceLoader,
  "CandleOxygenTestPage",
);
const RustingOfIronPage = lazyNamed(
  combinedScienceLoader,
  "RustingOfIronPage",
);
const SeparationPage = lazyNamed(combinedScienceLoader, "SeparationPage");
const SimpleElectricityPage = lazyNamed(
  combinedScienceLoader,
  "SimpleElectricityPage",
);
const TitrationPage = lazyNamed(combinedScienceLoader, "TitrationPage");

const biologyPagesLoader = () =>
  import("../features/practicals/o-level/biology-experiments/Biology");
const BiologyCatalasePage = lazyNamed(
  biologyPagesLoader,
  "BiologyCatalasePage",
);
const BiologyDiffusionPage = lazyNamed(
  biologyPagesLoader,
  "BiologyDiffusionPage",
);
const BiologyEnzymeActivityPage = lazyNamed(
  biologyPagesLoader,
  "BiologyEnzymeActivityPage",
);
const BiologyFoodTestsPage = lazyNamed(
  biologyPagesLoader,
  "BiologyFoodTestsPage",
);
const BiologyLeafStarchTestPage = lazyNamed(
  biologyPagesLoader,
  "BiologyLeafStarchTestPage",
);
const BiologyLimitingFactorsPage = lazyNamed(
  biologyPagesLoader,
  "BiologyLimitingFactorsPage",
);
const BiologyMicroscopyPage = lazyNamed(
  biologyPagesLoader,
  "BiologyMicroscopyPage",
);
const BiologyOsmosisPage = lazyNamed(biologyPagesLoader, "BiologyOsmosisPage");
const BiologyPondweedRatePage = lazyNamed(
  biologyPagesLoader,
  "BiologyPondweedRatePage",
);
const BiologyPotometerPage = lazyNamed(
  biologyPagesLoader,
  "BiologyPotometerPage",
);
const BiologyRespirationCO2Page = lazyNamed(
  biologyPagesLoader,
  "BiologyRespirationCO2Page",
);
const BiologySeedRespirationPage = lazyNamed(
  biologyPagesLoader,
  "BiologySeedRespirationPage",
);
const BiologySkillsWorkshop = lazyNamed(
  () =>
    import(
      "../features/practicals/o-level/biology-experiments/SkillsWorkshop"
    ),
  "BiologySkillsWorkshop",
);
const LinuxTerminal = lazyNamed(
  () => import("../features/practicals/tools/linux/LinuxTerminal"),
  "LinuxTerminal",
);

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center fixed inset-0 z-[200] bg-white/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in pointer-events-none">
    <div className="w-10 h-10 border-4 border-[#ff7400] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const NotFoundPage: React.FC = () => (
  <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 py-16 text-center dark:bg-[#070914]">
    <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/[0.055] md:p-12">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">
        Error 404
      </p>
      <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
        Page not found
      </h1>
      <p className="mt-4 font-medium leading-7 text-slate-600 dark:text-slate-300">
        The page may have moved or the address may be incorrect.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700"
      >
        Return home
      </Link>
    </div>
  </section>
);

const ProtectedRoute = ({ onLoginRequest }: { onLoginRequest: () => void }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      onLoginRequest();
    }
  }, [loading, user, onLoginRequest]);

  if (loading) return <PageLoader />;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

/*
 * The admin area opens for whoever finds it — five taps on the copyright year in
 * the footer. There is no email allowlist and no sign-in check here by choice.
 *
 * What keeps this safe is that the route is a shell, not a key: every screen
 * behind it reads and writes through Firestore, and those rules still demand the
 * `admin` custom claim. Someone who stumbles in sees the analytics (which are
 * deliberately public) and a set of managers that refuse to load or save
 * anything. To close the door again, restore the `VITE_ADMIN_EMAILS` check that
 * used to live here and re-lock `analytics_*` reads in firestore.rules.
 */
const AdminRoute = () => <AdminPage />;

/** The ECD landing page becomes either the account wall or the journey. */
const EcdEntryRoute: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { flags, loading: flagsLoading } = useFeatureFlags();

  if (authLoading || flagsLoading) return <PageLoader />;
  if (!flags.ecdLoginWallEnabled || user) return <Navigate to="/ecd/journey" replace />;
  return <EcdWelcome />;
};

/** Apply the configurable wall to every deep link under /ecd, not just /ecd. */
const EcdAccessRoute: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { flags, loading: flagsLoading } = useFeatureFlags();

  if (authLoading || flagsLoading) return <PageLoader />;
  if (flags.ecdLoginWallEnabled && !user) return <Navigate to="/ecd" replace />;
  return <Outlet />;
};

const SchoolProfileRoute = ({
  onNavigate,
}: {
  onNavigate: (page: string, params?: any) => void;
}) => {
  const { id } = useParams<{ id?: string }>();
  const school = id ? schoolForId(id) : undefined;

  if (!school) {
    return <NotFoundPage />;
  }

  return <Navigate to={`/${schoolSlugForName(school.name)}/`} replace />;
};

const SchoolSlugRoute = ({
  onNavigate,
}: {
  onNavigate: (page: string, params?: any) => void;
}) => {
  const { schoolSlug } = useParams<{ schoolSlug?: string }>();
  const school = schoolSlug ? schoolForSlug(schoolSlug) : undefined;

  if (!school) return <NotFoundPage />;
  return <SchoolDirectory onNavigate={onNavigate} profileSchoolId={school.id} />;
};

const PastPapersLibraryRoute: React.FC = () => {
  const { courseSlug, subjectSlug } = useParams();
  const course = findPastPaperCourse(courseSlug);
  const subject = findPastPaperSubject(courseSlug, subjectSlug);

  if (courseSlug && !course) {
    return <Navigate to="/past-papers/" replace />;
  }
  if (subjectSlug && !subject) {
    return <Navigate to={course ? `/past-papers/${courseSlug}/` : "/past-papers/"} replace />;
  }

  return (
    <PastPapers
      key={`${courseSlug || "root"}-${subjectSlug || "all"}`}
      initialCourse={course || ""}
      initialSubject={subject || "All subjects"}
    />
  );
};

const App: React.FC = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProgressPrompt, setShowProgressPrompt] = useState(false);
  /**
   * Where to drop the student after they sign in. The labs ask for the modal
   * from deep inside a full-screen practical; sending them to /dashboard the
   * way a fresh sign-in does would throw the lab away.
   */
  const openLogin = (returnTo: string | null = null) => {
    const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
    navigate(`/login/${query}`);
  };
  const progressPromptDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };
  const dismissProgressPrompt = (rememberForToday = true) => {
    setShowProgressPrompt(false);
    if (rememberForToday) {
      window.localStorage.setItem('examsidemann:progress-prompt-dismissed-date', progressPromptDate());
    }
  };
  useEffect(() => {
    const dismissedToday = window.localStorage.getItem('examsidemann:progress-prompt-dismissed-date') === progressPromptDate();
    if (authLoading || user || location.pathname.startsWith('/login') || dismissedToday) {
      setShowProgressPrompt(false);
      return;
    }
    const timer = window.setTimeout(() => setShowProgressPrompt(true), 120_000);
    return () => window.clearTimeout(timer);
  }, [authLoading, user, location.pathname]);
  useEffect(() => {
    const onRequestLogin = (event: Event) => {
      openLogin((event as CustomEvent).detail?.returnTo ?? null);
    };
    window.addEventListener("examsidemann:request-login", onRequestLogin);
    return () =>
      window.removeEventListener("examsidemann:request-login", onRequestLogin);
  }, []);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = (page: string, params?: any) => {
    switch (page) {
      case "home":
        navigate("/");
        break;
      case "news/all":
        navigate("/news/");
        break;
      case "news/article":
        navigate(`/news/article/${params.id}/`);
        break;
      case "schools/search":
        navigate([
          '/schools/search',
          params.type,
          params.province ? slugifyZimbabwePlace(params.province) : '',
          params.district ? slugifyZimbabwePlace(params.district) : '',
        ].filter(Boolean).join('/') + '/');
        break;
      case "schools":
        navigate("/schools/");
        break;
      case "schools/profile":
        {
          const school = params?.name
            ? undefined
            : schoolForId(String(params?.id || ""));
          const name = params?.name || school?.name;
          navigate(name ? `/${schoolSlugForName(name)}/` : "/schools/");
        }
        break;
      case "courses":
        navigate("/courses/");
        break;
      case "courses/overview":
        navigate("/courses/");
        break;
      case "courses/detail":
        if (params?.id) {
          const normalizedId = String(params.id).trim().toLowerCase();
          const course = CURRICULUM_REGISTRY.find((candidate) => (
            candidate.id.toLowerCase() === normalizedId ||
            candidate.name.toLowerCase() === normalizedId
          ));
          if (course) {
            const subject = params.subject
              ? course.subjects.find((candidate) => candidate.name === params.subject)
              : undefined;
            navigate(subject
              ? `/courses/${course.id}/${slugifyLearningPath(subject.name)}/`
              : `/courses/${course.id}/`);
          } else {
            navigate("/courses/");
          }
        }
        break;
      case "classroom":
        navigate(`/classroom/${params.classId}`);
        break;
      case "public-profile":
        navigate(`/profile/${params.id}`);
        break;
      case "messages":
        navigate(params?.chatId ? `/messages/${params.chatId}` : "/messages");
        break;
      case "communities":
        navigate(
          params?.communityId
            ? `/communities/${params.communityId}`
            : "/communities",
        );
        break;
      case "syllabi":
        navigate("/syllabi/");
        break;
      case "past-papers":
        navigate(params?.course
          ? params?.subject
            ? getPastPaperSubjectPath(String(params.course), String(params.subject))
            : getPastPaperCoursePath(String(params.course))
          : "/past-papers/");
        break;
      case "extra-lessons":
        navigate("/extra-lessons/");
        break;
      case "teacher-signup":
        navigate("/teacher-signup/");
        break;
      case "library":
        navigate("/library/");
        break;
      case "tutorials":
        navigate("/tutorials/");
        break;
      case "tutorials-studio":
        navigate("/studio");
        break;
      case "feedback":
        navigate("/feedback/");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "profile":
        navigate("/my-profile");
        break;
      case "dashboard":
        navigate(params?.teacherView ? `/dashboard?teacherView=${encodeURIComponent(params.teacherView)}` : "/dashboard");
        break;
      case "notifications":
        navigate("/notifications");
        break;
      case "chat":
        if (params?.session) {
          const highlightStr = params.highlight ? `&highlight=${encodeURIComponent(params.highlight)}` : '';
          navigate(`/chat?session=${encodeURIComponent(params.session)}${highlightStr}`);
        } else {
          navigate("/chat");
        }
        break;
      case "code-agent":
        navigate("/code-agent");
        break;
      case "iq-trainer":
        navigate("/iq-trainer/");
        break;
      case "ecd":
        navigate("/ecd/");
        break;
      case "practicals":
        navigate("/practicals/");
        break;
      case "technical-drawing-studio":
        navigate("/practicals/polytechnic/drawing");
        break;
      case "fabrication-studio":
        navigate("/practicals/polytechnic/fabrication");
        break;
      case "sql-practice":
        navigate("/sql-practice");
        break;
      case "webdev-practice":
        navigate("/practicals/tools/webdev");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "contact":
        navigate("/contact/");
        break;
      case "about":
        navigate("/about/");
        break;
      case "pricing":
        navigate("/pricing/");
        break;
      case "privacy":
        navigate("/privacy/");
        break;
      case "terms":
        navigate("/terms/");
        break;
      default:
        navigate("/");
    }
  };

  const path = location.pathname;
  const isCodeAgentPage = path === '/code-agent' || path.startsWith('/code-agent/');
  const isStandaloneAuthPage = path.startsWith('/teacher-signup') || path.startsWith('/login');
  const isFullScreenPractical = FULL_SCREEN_EXPERIMENT_PATHS.some((routePrefix) =>
    path.startsWith(routePrefix)
  );
  const isNavigable =
    !isFullScreenPractical &&
    // The admin area carries its own full-height sidebar and top bar, starting
    // at the very top of the viewport. A site header above it would push it down.
    !path.startsWith("/admin") &&
    !isCodeAgentPage &&
    !isStandaloneAuthPage &&
    !path.includes("/classroom") &&
    !path.includes("/profile/") &&
    !path.startsWith("/topic") &&
    !path.startsWith("/iq-trainer") &&
    // The ECD welcome screen is a full-bleed picture-book page for little
    // learners: no header, no footer, one question.
    !path.startsWith("/ecd") &&
    !path.includes("/practicals/tools/linux") &&
    !path.includes("/sql-practice");
  // Practicals, dashboard, notifications, chat, and courses carry their own navigation headers.
  const showAppHeader = !isCodeAgentPage && isNavigable && !path.startsWith("/practicals") && !path.startsWith("/dashboard") && !path.startsWith("/notifications") && !path.startsWith("/chat") && !path.startsWith("/courses");
  // Pages that carry their own phone chrome — a back arrow, a search bar and a
  // bar of levels along the bottom — and so want the app header out of the way
  // on a small screen. It stays put from `lg` up.
  const hideMobileHeader =
    path.startsWith('/my-profile') ||
    (path.startsWith('/dashboard') && userProfile?.role === 'teacher') ||
    path.startsWith('/library') ||
    path.startsWith('/past-papers');
  const hideFooter =
    isFullScreenPractical ||
    path.replace(/\/+$/, '') === '/practicals/all' ||
    [
      "/chat",
      "/code-agent",
      "/ecd",
      "/iq-trainer",
      "/messages",
      "/notifications",
      "/dashboard",
      "/admin",
      "/studio",
      "/courses",
      "/practicals/tools/linux",
      "/sql-practice",
      "/teacher-signup",
      // The resource shelves fill the viewport and carry their own chrome; a
      // footer under them is unreachable and pushes the phone nav off screen.
      "/library",
      "/past-papers",
    ].some((p) => path.startsWith(p));
  /**
   * The highlight-to-ask chip is useful over prose and hopeless over a code
   * editor or a 3D canvas: selecting text is something you do constantly in the
   * IT practicals, and the chip lands on top of the thing you just selected.
   */
  const hideSelectionAI =
    isFullScreenPractical ||
    [
      "/admin",
      "/code-agent",
      "/login",
      "/ecd",
      "/practicals",
      "/sql-practice",
      "/courses/polytechnic/nd-it/practicals",
      "/courses/polytechnic/nc-it/practicals",
      "/teacher-signup",
    ].some((p) => path.startsWith(p));

  return (
    <>
      <RouteSeo />
      <AnalyticsTracker />
      <style>{`
        @media (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse) {
          .experiment-desktop-header,
          .experiment-desktop-panel {
            display: none !important;
          }
          .experiment-mobile-topbar {
            display: flex !important;
          }
          .experiment-mobile-controls {
            display: block !important;
          }
        }
      `}</style>

      <PwaInstallPrompt />
      <ConsentBanner />
      <GoogleOneTap />

      <ProgressSignInPrompt
        open={showProgressPrompt && !path.startsWith('/login')}
        onClose={dismissProgressPrompt}
        onSignIn={() => {
          dismissProgressPrompt(false);
          openLogin(location.pathname);
        }}
      />

      {/* `overflow-x-clip` rather than `overflow-x-hidden`: hidden on one axis
          computes the other axis to `auto`, which turns this shell into a
          scroll container. Any `position: sticky` header inside it then sticks
          to the top of *this* box — which never scrolls — instead of to the
          viewport, so sticky headers scrolled away with the page. `clip` does
          the same horizontal clipping without creating a scrollport. */}
      <div className="min-h-screen bg-white dark:bg-navy-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300 relative overflow-x-clip text-left app-container">
        {showAppHeader && (
          <div className={hideMobileHeader ? 'hidden lg:block' : undefined}>
            <Header
              onNavigate={handleNavigate}
              onLoginRequest={() => openLogin()}
              onMenuToggle={(isOpen) => setIsBackgroundBlurred(isOpen)}
            />
          </div>
        )}
        <main
          className={`flex-grow h-full transition-all duration-300 ${showAppHeader ? (hideMobileHeader ? "lg:pt-16" : "pt-16") : ""} ${isBackgroundBlurred ? "blur-[8px] brightness-50 pointer-events-none" : ""}`}
        >
          <React.Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <>
                  <Hero
                    onStartLearning={() => handleNavigate("courses/overview")}
                    onNavigate={handleNavigate}
                  />
                  <LevelQuickNav onNavigate={handleNavigate} />
                  <PlatformImpact onNavigate={handleNavigate} />
                  <Features onNavigate={handleNavigate} />
                  <SchoolCalendar />
                  <HomeCommunitySections />
                  <FloatingWhatsAppBot />
                </>
              }
            />

            <Route
              path="/schools"
              element={<SchoolFinder onNavigate={handleNavigate} />}
            />
            <Route
              path="/news"
              element={<NewsPage onNavigate={handleNavigate} />}
            />
            <Route
              path="/news/article/:id"
              element={
                <NewsArticle
                  onBack={() => navigate("/news/")}
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route
              path="/schools/search/:type"
              element={<SchoolDirectory onNavigate={handleNavigate} />}
            />
            <Route
              path="/schools/search/:type/:provinceSlug/:districtSlug?"
              element={<SchoolDirectory onNavigate={handleNavigate} />}
            />
            <Route
              path="/schools/profile/:id"
              element={<SchoolProfileRoute onNavigate={handleNavigate} />}
            />
            <Route
              path="/courses"
              element={<CoursesOverview onNavigate={handleNavigate} />}
            />
            <Route
              path="/courses/detail/:id"
              element={
                <CoursePage
                  onNavigateHome={() => navigate("/")}
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route
              path="/courses/:courseId/:subjectSlug/outcomes/:outcomeNumber"
              element={
                <LearningOutcomePage
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route
              path="/courses/:courseId/:subjectSlug"
              element={<LearningSubjectRoute />}
            />
            <Route
              path="/courses/:courseId"
              element={
                <LearningCourseRoute
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route path="/syllabi" element={<Syllabi />} />
            <Route path="/past-papers" element={<PastPapersLibraryRoute />} />
            <Route path="/past-papers/:courseSlug" element={<PastPapersLibraryRoute />} />
            <Route path="/past-papers/:courseSlug/:subjectSlug" element={<PastPapersLibraryRoute />} />
            <Route path="/past-papers/:courseSlug/:subjectSlug/:paperSlug" element={<PastPaperDetailPage />} />
            <Route
              path="/extra-lessons"
              element={
                <ExtraLessons
                  onNavigate={handleNavigate}
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route
              path="/extra-lessons/:subjectSlug"
              element={
                <ExtraLessons
                  onNavigate={handleNavigate}
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route
              path="/teacher-signup"
              element={
                <TeacherSignupPage
                  onNavigate={handleNavigate}
                  onLoginRequest={() => openLogin()}
                />
              }
            />
            <Route
              path="/library"
              element={<Library onNavigate={handleNavigate} />}
            />
            <Route path="/tutorials" element={<Tutorials />} />
            {/* Per-form and per-subject video pages. These exist so the video
                library has real, indexable URLs - the SEO generator prerenders
                one page per form/subject and they must resolve in the app. */}
            <Route path="/tutorials/:courseSlug" element={<Tutorials />} />
            <Route path="/tutorials/:courseSlug/:subjectSlug" element={<Tutorials />} />
            <Route path="/tutorials/webdev" element={<WebDevLayout />}>
              <Route index element={<Navigate to="html-css/" replace />} />
              <Route path="html-css" element={<HtmlCssBasics />} />
            </Route>
            <Route path="/feedback" element={<Feedback />} />
            <Route
              path="/profile/:id"
              element={
                <PublicProfile
                  onBack={() => navigate(-1)}
                  onMessage={() => navigate("/messages")}
                />
              }
            />
            <Route path="/premium" element={<PremiumPlans />} />
            <Route path="/payment" element={<PaymentPage />} />

            <Route path="/ecd" element={<EcdEntryRoute />} />
            <Route element={<EcdAccessRoute />}>
              <Route path="/ecd/journey" element={<EcdJourney />} />
              <Route path="/ecd/reading" element={<EcdReading />} />
              <Route path="/ecd/reading/letters" element={<EcdLetters />} />
              <Route path="/ecd/reading/phonics" element={<EcdPhonics />} />
              <Route path="/ecd/reading/rhyming" element={<EcdRhyming />} />
              <Route path="/ecd/maths" element={<EcdMaths />} />
              <Route path="/ecd/maths/present-count" element={<EcdPresentCount />} />
              <Route path="/ecd/maths/star-wish" element={<EcdStarWish />} />
              <Route path="/ecd/maths/trace-numbers" element={<EcdTraceNumbers />} />
              <Route path="/ecd/maths/wake-up" element={<EcdWakeUp />} />
              <Route path="/ecd/maths/subitise" element={<EcdSubitise />} />
              <Route path="/ecd/maths/one-more" element={<EcdOneMore />} />
              <Route path="/ecd/maths/count-back" element={<EcdCountBack />} />
              <Route path="/ecd/maths/cave-add" element={<EcdCaveAdd />} />
              <Route path="/ecd/maths/ten-frame" element={<EcdTenFrame />} />
              <Route path="/ecd/maths/above-below" element={<EcdAboveBelow />} />
              <Route path="/ecd/maths/number-drive" element={<EcdNumberDrive />} />
            </Route>
            <Route path="/practicals" element={<Navigate to="/practicals/all" replace />} />
            <Route path="/practicals/all" element={<AllPracticalsPage />} />
            <Route path="/practicals/browse" element={<PracticalsLandingPage />} />
            <Route
              path="/practicals/polytechnic"
              element={<PolyTechnicLandingPage />}
            />
            <Route
              path="/practicals/polytechnic/it"
              element={
                <PracticalsLevelPage levelId="polytechnic" subjectId="it" />
              }
            />
            <Route
              path="/practicals/polytechnic/drawing"
              element={
                <PracticalsLevelPage levelId="polytechnic" subjectId="drawing" />
              }
            />
            <Route
              path="/practicals/polytechnic/drawing/:topicId"
              element={<TechnicalDrawingStudio />}
            />
            <Route
              path="/practicals/polytechnic/fabrication"
              element={
                <PracticalsLevelPage levelId="polytechnic" subjectId="fabrication" />
              }
            />
            <Route
              path="/practicals/polytechnic/fabrication/:topicId"
              element={<FabricationDrawingStudio />}
            />
            <Route
              path="/practicals/polytechnic/under-construction"
              element={
                <PageUnderConstruction
                  title="Polytechnic Practicals"
                  subtitle="This polytechnic department is registered, but its practical content has not been added yet."
                  backPath="/practicals/polytechnic"
                />
              }
            />
            <Route path="/practicals/tools/linux" element={<LinuxTerminal />} />
            <Route
              path="/practicals/tools/cpp"
              element={<PracticeCpp onBack={() => navigate(-1)} />}
            />
            <Route
              path="/practicals/tools/webdev"
              element={<WebDevIDE onBack={() => navigate(-1)} />}
            />
            <Route
              path="/practicals/polytechnic/it/web-dev-ide"
              element={<Navigate to="/practicals/tools/webdev" replace />}
            />
            <Route
              path="/practicals/tools/csharp"
              element={<PracticeCSharp onBack={() => navigate(-1)} />}
            />
            <Route
              path="/practicals/tools/vbnet"
              element={<VBNetStudio onBack={() => navigate(-1)} />}
            />
            <Route
              path="/practicals/tools/access"
              element={<MSAccessLab onBack={() => navigate(-1)} />}
            />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/editorial" element={<EditorialPolicy />} />

            {/* IT Practicals Routes */}
            <Route
              path="/courses/polytechnic/nd-it/practicals"
              element={<Navigate to="/practicals/polytechnic/it/" replace />}
            />
            <Route
              path="/courses/polytechnic/nd-it/practicals/database-administration"
              element={<DatabaseAdministration />}
            />
            <Route
              path="/courses/polytechnic/nd-it/practicals/oop-csharp"
              element={<ObjectOrientedProgramming />}
            />
            <Route
              path="/courses/polytechnic/nd-it/practicals/web-development"
              element={<WebDevelopment />}
            />
            <Route
              path="/courses/polytechnic/nd-it/practicals/os-administration"
              element={<OperatingSystems />}
            />

            {/* NC IT Practicals Routes */}
            <Route
              path="/courses/polytechnic/nc-it/practicals"
              element={<Navigate to="/practicals/polytechnic/it/" replace />}
            />
            <Route
              path="/courses/polytechnic/nc-it/practicals/computer-systems-maintenance"
              element={<ComputerSystemsMaintenance />}
            />

            {/* O Level Practicals */}
            <Route
              path="/practicals/olevel"
              element={<PolyTechnicLandingPage levelId="olevel" />}
            />
            <Route
              path="/practicals/olevel/chemistry"
              element={<PracticalsLevelPage levelId="olevel" subjectId="chemistry" />}
            />
            <Route
              path="/practicals/olevel/chemistry/chromatography"
              element={<OLevelChromatographyPage />}
            />
            <Route
              path="/practicals/olevel/chemistry/titration"
              element={<OLevelChemistryTitrationPage />}
            />
            <Route
              path="/practicals/olevel/chemistry/qualitative-analysis"
              element={<OLevelQualitativeAnalysisPage />}
            />
            <Route
              path="/practicals/olevel/physics"
              element={<PracticalsLevelPage levelId="olevel" subjectId="physics" />}
            />
            <Route
              path="/practicals/olevel/physics/projectile-motion"
              element={<OLevelProjectileMotionPage />}
            />
            <Route
              path="/practicals/olevel/physics/hookes-law"
              element={<OLevelHookesLawPage />}
            />
            <Route
              path="/practicals/olevel/physics/pendulum"
              element={<OLevelPendulumPage />}
            />
            <Route
              path="/practicals/olevel/physics/density"
              element={<OLevelDensityPage />}
            />
            <Route
              path="/practicals/olevel/physics/terminal-velocity"
              element={<OLevelTerminalVelocityPage />}
            />
            <Route
              path="/practicals/olevel/physics/moments"
              element={<OLevelPrincipleOfMomentsPage />}
            />
            <Route
              path="/practicals/olevel/physics/centre-of-gravity"
              element={<OLevelCentreOfGravityPage />}
            />
            <Route
              path="/practicals/olevel/physics/inclined-plane"
              element={<OLevelInclinedPlanePage />}
            />
            <Route
              path="/practicals/olevel/physics/momentum"
              element={<OLevelConservationOfMomentumPage />}
            />
            <Route
              path="/practicals/olevel/physics/machine-efficiency"
              element={<OLevelMachineEfficiencyPage />}
            />
            <Route
              path="/practicals/olevel/physics/specific-heat-solid"
              element={<OLevelSpecificHeatSolidPage />}
            />
            <Route
              path="/practicals/olevel/physics/specific-heat-liquid"
              element={<OLevelSpecificHeatLiquidPage />}
            />
            <Route
              path="/practicals/olevel/physics/heating-cooling-curve"
              element={<OLevelHeatingCoolingCurvePage />}
            />
            <Route
              path="/practicals/olevel/physics/expansion-of-solids"
              element={<OLevelExpansionOfSolidsPage />}
            />
            <Route
              path="/practicals/olevel/physics/boyles-law"
              element={<OLevelBoylesLawPage />}
            />
            <Route
              path="/practicals/olevel/physics/magnetic-field-lines"
              element={<OLevelMagneticFieldLinesPage />}
            />
            <Route
              path="/practicals/olevel/physics/magnetic-materials"
              element={<OLevelMagneticMaterialsPage />}
            />
            <Route
              path="/practicals/olevel/physics/magnetisation"
              element={<OLevelMagnetisationPage />}
            />
            <Route
              path="/practicals/olevel/physics/resistance-of-a-wire"
              element={<OLevelResistanceOfAWirePage />}
            />
            <Route
              path="/practicals/olevel/physics/rheostat"
              element={<OLevelRheostatPage />}
            />
            <Route
              path="/practicals/olevel/physics/resistor-combinations"
              element={<OLevelResistorCombinationsPage />}
            />
            <Route
              path="/practicals/olevel/physics/electrostatics"
              element={<OLevelElectrostaticsPage />}
            />
            <Route
              path="/practicals/olevel/biology"
              element={<PracticalsLevelPage levelId="olevel" subjectId="biology" />}
            />
            <Route
              path="/practicals/olevel/biology/food-tests"
              element={<BiologyFoodTestsPage />}
            />
            <Route
              path="/practicals/olevel/biology/enzyme-activity"
              element={<BiologyEnzymeActivityPage />}
            />
            <Route
              path="/practicals/olevel/biology/catalase"
              element={<BiologyCatalasePage />}
            />
            <Route
              path="/practicals/olevel/biology/leaf-starch-test"
              element={<BiologyLeafStarchTestPage />}
            />
            <Route
              path="/practicals/olevel/biology/limiting-factors"
              element={<BiologyLimitingFactorsPage />}
            />
            <Route
              path="/practicals/olevel/biology/pondweed-rate"
              element={<BiologyPondweedRatePage />}
            />
            <Route
              path="/practicals/olevel/biology/respiration-carbon-dioxide"
              element={<BiologyRespirationCO2Page />}
            />
            <Route
              path="/practicals/olevel/biology/seed-respiration"
              element={<BiologySeedRespirationPage />}
            />
            <Route
              path="/practicals/olevel/biology/osmosis"
              element={<BiologyOsmosisPage />}
            />
            <Route
              path="/practicals/olevel/biology/diffusion"
              element={<BiologyDiffusionPage />}
            />
            <Route
              path="/practicals/olevel/biology/potometer"
              element={<BiologyPotometerPage />}
            />
            <Route
              path="/practicals/olevel/biology/microscopy"
              element={<BiologyMicroscopyPage />}
            />
            <Route
              path="/practicals/olevel/biology/skills"
              element={<BiologySkillsWorkshop />}
            />
            <Route
              path="/practicals/olevel/combined-science"
              element={<PracticalsLevelPage levelId="olevel" subjectId="combined-science" />}
            />
            <Route
              path="/practicals/olevel/combined-science/separation"
              element={<SeparationPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/food-tests"
              element={<FoodTestsPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/photosynthesis"
              element={<PhotosynthesisPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/oxygen-from-photosynthesis"
              element={<OxygenFromPhotosynthesisPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/respiration"
              element={<RespirationPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/inhaled-exhaled-air"
              element={<InhaledExhaledAirPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/candle-oxygen-test"
              element={<CandleOxygenTestPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/simple-electricity"
              element={<SimpleElectricityPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/rates-of-reaction"
              element={<RatesOfReactionPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/titration"
              element={<TitrationPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/rusting"
              element={<RustingOfIronPage />}
            />
            <Route
              path="/practicals/olevel/combined-science/force-and-motion"
              element={<ForceAndMotionPage />}
            />
            <Route
              path="/practicals/olevel/computer-science"
              element={
                <PracticalsLevelPage levelId="olevel" subjectId="computer-science" />
              }
            />
            <Route
              path="/practicals/olevel/food-technology"
              element={<PlaceholderPractical title="O Level Food Technology" />}
            />
            <Route
              path="/practicals/olevel/mathematics"
              element={<MathCameraTutor />}
            />

            {/* A Level Practicals */}
            <Route
              path="/practicals/alevel"
              element={<PolyTechnicLandingPage levelId="alevel" />}
            />
            <Route
              path="/practicals/alevel/chemistry"
              element={<PracticalsLevelPage levelId="alevel" subjectId="chemistry" />}
            />
            <Route
              path="/practicals/alevel/physics"
              element={<PracticalsLevelPage levelId="alevel" subjectId="physics" />}
            />
            <Route
              path="/practicals/alevel/biology"
              element={<PracticalsLevelPage levelId="alevel" subjectId="biology" />}
            />
            <Route
              path="/practicals/alevel/computer-science"
              element={
                <PracticalsLevelPage levelId="alevel" subjectId="computer-science" />
              }
            />
            <Route
              path="/practicals/alevel/mathematics"
              element={<MathCameraTutor />}
            />

            <Route
              path="/sql-practice"
              element={
                <SQLPractice
                  onBack={() =>
                    navigate("/practicals/polytechnic/it/")
                  }
                />
              }
            />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/chat/history" element={<AiChatHistoryPage />} />
            <Route path="/code-agent" element={<CodeAgentWorkspace />} />
            <Route path="/iq-trainer" element={<IQTrainer />} />

            <Route
              element={
                <ProtectedRoute
                  onLoginRequest={() => openLogin()}
                />
              }
            >
              <Route
                path="/dashboard"
                element={
                  userProfile?.role === "teacher" ? (
                    <TeacherDashboard
                      onLoginRequest={() => openLogin()}
                      onNavigate={handleNavigate}
                    />
                  ) : userProfile?.role === "parent" ? (
                    <ParentDashboard
                      onLoginRequest={() => openLogin()}
                    />
                  ) : (
                    <Dashboard
                      onLoginRequest={() => openLogin()}
                      onNavigate={handleNavigate}
                    />
                  )
                }
              />
              <Route
                path="/my-profile"
                element={
                  <Profile
                    onLoginRequest={() => openLogin()}
                    onNavigate={handleNavigate}
                  />
                }
              />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/notifications"
                element={
                  <NotificationsPage
                    onBack={() => navigate(-1)}
                    onNavigate={handleNavigate}
                    onLoginRequest={() => openLogin()}
                  />
                }
              />
              <Route
                path="/messages/:chatId?"
                element={
                  <Messages
                    onBack={() => navigate(-1)}
                    onLoginRequest={() => openLogin()}
                  />
                }
              />
              <Route
                path="/communities/:communityId?"
                element={
                  <Communities
                    onNavigate={handleNavigate}
                    onLoginRequest={() => openLogin()}
                  />
                }
              />
              <Route
                path="/studio"
                element={
                  <TutorialsStudio
                    onNavigate={handleNavigate}
                    onLoginRequest={() => openLogin()}
                  />
                }
              />
              <Route
                path="/classroom/:classId"
                element={<ClassRoom onBack={() => navigate(-1)} />}
              />
              <Route
                path="/saved-resources"
                element={
                  <SavedResources
                    onBack={() => navigate(-1)}
                    onNavigate={handleNavigate}
                  />
                }
              />
              <Route path="/admin" element={<AdminRoute />} />
            </Route>
            <Route
              path="/:schoolSlug"
              element={<SchoolSlugRoute onNavigate={handleNavigate} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </React.Suspense>
        </main>

        {isNavigable && !hideFooter && <Footer onNavigate={handleNavigate} />}
        {!hideSelectionAI && !showProgressPrompt && <SelectionSidemannAI />}
      </div>
    </>
  );
};

export default App;
