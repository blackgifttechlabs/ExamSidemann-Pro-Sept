import React from 'react';

import { GrammarStructure as EnglishGrammar } from './form-1/english/GrammarStructure';
import { WritingMastery as EnglishWriting } from './form-1/english/WritingMastery';
import { ReadingLiterature as EnglishReading } from './form-1/english/ReadingLiterature';
import { CompositionWriting as EnglishComposition } from './form-1/english/CompositionWriting';
import { CompositionWriting2 as EnglishComposition2 } from './form-1/english/CompositionWriting2';
import { ComprehensionSummary as EnglishComprehension } from './form-1/english/ComprehensionSummary';
import { OralCommunication as EnglishOral } from './form-1/english/OralCommunication';
import { FunctionalWriting as EnglishFunctional } from './form-1/english/FunctionalWriting';
import { StudySkills as EnglishStudySkills } from './form-1/english/StudySkills';
import { LanguageInUse as EnglishLanguageInUse } from './form-1/english/LanguageInUse';

import { LearningOutcome1 as ShonaLO1 } from './form-1/shona/LearningOutcome1';
import ShonaTsumo from './form-1/shona/Tsumo';
import { Madimikira as ShonaMadimikira } from './form-1/shona/Madimikira';
import { Zvirevo as ShonaZvirevo } from './form-1/shona/Zvirevo';
import { SimilesMetaphors as ShonaSimilesMetaphors } from './form-1/shona/SimilesMetaphors';
import { Ideophones as ShonaIdeophones } from './form-1/shona/Ideophones';
import { Euphemisms as ShonaEuphemisms } from './form-1/shona/Euphemisms';
import { Hyperboles as ShonaHyperboles } from './form-1/shona/Hyperboles';
import { NounClasses as ShonaNounClasses } from './form-1/shona/NounClasses';
import { Pronouns as ShonaPronouns } from './form-1/shona/Pronouns';

import { RealNumbers } from './form-1/mathematics/RealNumbers';
import { Sets } from './form-1/mathematics/Sets';
import { FinancialMathematics } from './form-1/mathematics/FinancialMathematics';
import { MeasuresAndMensuration } from './form-1/mathematics/MeasuresAndMensuration';
import { Graphs } from './form-1/mathematics/Graphs';
import { Algebra } from './form-1/mathematics/Algebra';
import { Geometry } from './form-1/mathematics/Geometry';
import { Statistics } from './form-1/mathematics/Statistics';
import { Transformation } from './form-1/mathematics/Transformation';
import type { MathNavigationProps } from './form-1/mathematics/mathLessonUtils';
import { Foundation as ScienceFoundation } from './form-1/combined-science/Foundation';
import { Biology as ScienceBiology } from './form-1/combined-science/Biology';
import { Chemistry as ScienceChemistry } from './form-1/combined-science/Chemistry';
import { Physics as SciencePhysics } from './form-1/combined-science/Physics';
import { LearningOutcome1 as HistoryOfSouthernAfrica } from './form-1/history/LearningOutcome1';
import { LearningOutcome2 as GreatZimbabweState } from './form-1/history/LearningOutcome2';
import { topic1 as Form1FrsT1 } from './form-1/frs/topic1';
import { topic2 as Form1FrsT2 } from './form-1/frs/topic2';
import { topic1 as Form2FrsT1 } from './form-2/frs/topic1';
import { topic2 as Form2FrsT2 } from './form-2/frs/topic2';
import { topic1 as Form3FrsT1 } from '../o-level/form-3/frs/topic1';
import { topic2 as Form3FrsT2 } from '../o-level/form-3/frs/topic2';
import { topic1 as Form4FrsT1 } from '../o-level/form-4/frs/topic1';
import { topic2 as Form4FrsT2 } from '../o-level/form-4/frs/topic2';
import { GeneralAgriculture as Form1Agriculture1 } from './form-1/agriculture/GeneralAgriculture';
import { SoilAndWater as Form1Agriculture2 } from './form-1/agriculture/SoilAndWater';
import { CropHusbandry as Form1Agriculture3 } from './form-1/agriculture/CropHusbandry';
import { AnimalHusbandry as Form1Agriculture4 } from './form-1/agriculture/AnimalHusbandry';
import { FarmStructuresAndMachinery as Form1Agriculture5 } from './form-1/agriculture/FarmStructuresAndMachinery';
import { AgriBusiness as Form1Agriculture6 } from './form-1/agriculture/AgriBusiness';
import { GeneralAgriculture as Form2Agriculture1 } from './form-2/agriculture/GeneralAgriculture';
import { SoilAndWater as Form2Agriculture2 } from './form-2/agriculture/SoilAndWater';
import { CropHusbandry as Form2Agriculture3 } from './form-2/agriculture/CropHusbandry';
import { AnimalHusbandry as Form2Agriculture4 } from './form-2/agriculture/AnimalHusbandry';
import { FarmStructuresAndMachinery as Form2Agriculture5 } from './form-2/agriculture/FarmStructuresAndMachinery';
import { AgriBusiness as Form2Agriculture6 } from './form-2/agriculture/AgriBusiness';
import { GeneralAgriculture as Form3Agriculture1 } from '../o-level/form-3/agriculture/GeneralAgriculture';
import { SoilAndWater as Form3Agriculture2 } from '../o-level/form-3/agriculture/SoilAndWater';
import { CropHusbandry as Form3Agriculture3 } from '../o-level/form-3/agriculture/CropHusbandry';
import { AnimalHusbandry as Form3Agriculture4 } from '../o-level/form-3/agriculture/AnimalHusbandry';
import { FarmStructuresAndMachinery as Form3Agriculture5 } from '../o-level/form-3/agriculture/FarmStructuresAndMachinery';
import { AgriBusiness as Form3Agriculture6 } from '../o-level/form-3/agriculture/AgriBusiness';
import { GeneralAgriculture as Form4Agriculture1 } from '../o-level/form-4/agriculture/GeneralAgriculture';
import { SoilAndWater as Form4Agriculture2 } from '../o-level/form-4/agriculture/SoilAndWater';
import { CropHusbandry as Form4Agriculture3 } from '../o-level/form-4/agriculture/CropHusbandry';
import { AnimalHusbandry as Form4Agriculture4 } from '../o-level/form-4/agriculture/AnimalHusbandry';
import { FarmStructuresAndMachinery as Form4Agriculture5 } from '../o-level/form-4/agriculture/FarmStructuresAndMachinery';
import { AgriBusiness as Form4Agriculture6 } from '../o-level/form-4/agriculture/AgriBusiness';

interface DynamicSubjectViewerProps {
  level: string;
  subject: string;
  activeUnit: number;
  fallback: React.ReactNode;
  onNavigateToUnit?: (unit: number) => void;
}

const englishTopicAccentClasses = [
  '[&_.bg-indigo-600]:!bg-violet-600 [&_.hover\\:bg-indigo-700:hover]:!bg-violet-700 [&_.from-indigo-600]:!from-violet-600 [&_.to-indigo-800]:!to-fuchsia-800 [&_.text-indigo-600]:!text-violet-600 [&_.text-indigo-500]:!text-violet-500 [&_.text-indigo-400]:!text-violet-400 [&_.text-indigo-300]:!text-violet-300 [&_.text-indigo-200]:!text-violet-200 [&_.text-indigo-100]:!text-violet-100 [&_.bg-indigo-50]:!bg-violet-50 [&_.bg-indigo-100]:!bg-violet-100 [&_.border-indigo-100]:!border-violet-100 [&_.border-indigo-200]:!border-violet-200 [&_.border-indigo-500]:!border-violet-500 [&_.hover\\:border-indigo-300:hover]:!border-violet-300 [&_.ring-indigo-500\\/50]:!ring-violet-500/50',
  '[&_.bg-indigo-600]:!bg-emerald-600 [&_.hover\\:bg-indigo-700:hover]:!bg-emerald-700 [&_.from-indigo-600]:!from-emerald-600 [&_.to-indigo-800]:!to-teal-800 [&_.text-indigo-600]:!text-emerald-600 [&_.text-indigo-500]:!text-emerald-500 [&_.text-indigo-400]:!text-emerald-400 [&_.text-indigo-300]:!text-emerald-300 [&_.text-indigo-200]:!text-emerald-200 [&_.text-indigo-100]:!text-emerald-100 [&_.bg-indigo-50]:!bg-emerald-50 [&_.bg-indigo-100]:!bg-emerald-100 [&_.border-indigo-100]:!border-emerald-100 [&_.border-indigo-200]:!border-emerald-200 [&_.border-indigo-500]:!border-emerald-500 [&_.hover\\:border-indigo-300:hover]:!border-emerald-300 [&_.ring-indigo-500\\/50]:!ring-emerald-500/50',
  '[&_.bg-indigo-600]:!bg-sky-600 [&_.hover\\:bg-indigo-700:hover]:!bg-sky-700 [&_.from-indigo-600]:!from-sky-600 [&_.to-indigo-800]:!to-blue-800 [&_.text-indigo-600]:!text-sky-600 [&_.text-indigo-500]:!text-sky-500 [&_.text-indigo-400]:!text-sky-400 [&_.text-indigo-300]:!text-sky-300 [&_.text-indigo-200]:!text-sky-200 [&_.text-indigo-100]:!text-sky-100 [&_.bg-indigo-50]:!bg-sky-50 [&_.bg-indigo-100]:!bg-sky-100 [&_.border-indigo-100]:!border-sky-100 [&_.border-indigo-200]:!border-sky-200 [&_.border-indigo-500]:!border-sky-500 [&_.hover\\:border-indigo-300:hover]:!border-sky-300 [&_.ring-indigo-500\\/50]:!ring-sky-500/50',
  '[&_.bg-indigo-600]:!bg-orange-600 [&_.hover\\:bg-indigo-700:hover]:!bg-orange-700 [&_.from-indigo-600]:!from-orange-600 [&_.to-indigo-800]:!to-red-800 [&_.text-indigo-600]:!text-orange-600 [&_.text-indigo-500]:!text-orange-500 [&_.text-indigo-400]:!text-orange-400 [&_.text-indigo-300]:!text-orange-300 [&_.text-indigo-200]:!text-orange-200 [&_.text-indigo-100]:!text-orange-100 [&_.bg-indigo-50]:!bg-orange-50 [&_.bg-indigo-100]:!bg-orange-100 [&_.border-indigo-100]:!border-orange-100 [&_.border-indigo-200]:!border-orange-200 [&_.border-indigo-500]:!border-orange-500 [&_.hover\\:border-indigo-300:hover]:!border-orange-300 [&_.ring-indigo-500\\/50]:!ring-orange-500/50',
  '[&_.bg-indigo-600]:!bg-rose-600 [&_.hover\\:bg-indigo-700:hover]:!bg-rose-700 [&_.from-indigo-600]:!from-rose-600 [&_.to-indigo-800]:!to-pink-800 [&_.text-indigo-600]:!text-rose-600 [&_.text-indigo-500]:!text-rose-500 [&_.text-indigo-400]:!text-rose-400 [&_.text-indigo-300]:!text-rose-300 [&_.text-indigo-200]:!text-rose-200 [&_.text-indigo-100]:!text-rose-100 [&_.bg-indigo-50]:!bg-rose-50 [&_.bg-indigo-100]:!bg-rose-100 [&_.border-indigo-100]:!border-rose-100 [&_.border-indigo-200]:!border-rose-200 [&_.border-indigo-500]:!border-rose-500 [&_.hover\\:border-indigo-300:hover]:!border-rose-300 [&_.ring-indigo-500\\/50]:!ring-rose-500/50',
  '[&_.bg-indigo-600]:!bg-cyan-600 [&_.hover\\:bg-indigo-700:hover]:!bg-cyan-700 [&_.from-indigo-600]:!from-cyan-600 [&_.to-indigo-800]:!to-blue-800 [&_.text-indigo-600]:!text-cyan-600 [&_.text-indigo-500]:!text-cyan-500 [&_.text-indigo-400]:!text-cyan-400 [&_.text-indigo-300]:!text-cyan-300 [&_.text-indigo-200]:!text-cyan-200 [&_.text-indigo-100]:!text-cyan-100 [&_.bg-indigo-50]:!bg-cyan-50 [&_.bg-indigo-100]:!bg-cyan-100 [&_.border-indigo-100]:!border-cyan-100 [&_.border-indigo-200]:!border-cyan-200 [&_.border-indigo-500]:!border-cyan-500 [&_.hover\\:border-indigo-300:hover]:!border-cyan-300 [&_.ring-indigo-500\\/50]:!ring-cyan-500/50',
  '[&_.bg-indigo-600]:!bg-amber-600 [&_.hover\\:bg-indigo-700:hover]:!bg-amber-700 [&_.from-indigo-600]:!from-amber-600 [&_.to-indigo-800]:!to-yellow-800 [&_.text-indigo-600]:!text-amber-600 [&_.text-indigo-500]:!text-amber-500 [&_.text-indigo-400]:!text-amber-400 [&_.text-indigo-300]:!text-amber-300 [&_.text-indigo-200]:!text-amber-200 [&_.text-indigo-100]:!text-amber-100 [&_.bg-indigo-50]:!bg-amber-50 [&_.bg-indigo-100]:!bg-amber-100 [&_.border-indigo-100]:!border-amber-100 [&_.border-indigo-200]:!border-amber-200 [&_.border-indigo-500]:!border-amber-500 [&_.hover\\:border-indigo-300:hover]:!border-amber-300 [&_.ring-indigo-500\\/50]:!ring-amber-500/50',
  '[&_.bg-indigo-600]:!bg-lime-600 [&_.hover\\:bg-indigo-700:hover]:!bg-lime-700 [&_.from-indigo-600]:!from-lime-600 [&_.to-indigo-800]:!to-green-800 [&_.text-indigo-600]:!text-lime-700 [&_.text-indigo-500]:!text-lime-600 [&_.text-indigo-400]:!text-lime-400 [&_.text-indigo-300]:!text-lime-300 [&_.text-indigo-200]:!text-lime-200 [&_.text-indigo-100]:!text-lime-100 [&_.bg-indigo-50]:!bg-lime-50 [&_.bg-indigo-100]:!bg-lime-100 [&_.border-indigo-100]:!border-lime-100 [&_.border-indigo-200]:!border-lime-200 [&_.border-indigo-500]:!border-lime-500 [&_.hover\\:border-indigo-300:hover]:!border-lime-300 [&_.ring-indigo-500\\/50]:!ring-lime-500/50',
  '[&_.bg-indigo-600]:!bg-fuchsia-600 [&_.hover\\:bg-indigo-700:hover]:!bg-fuchsia-700 [&_.from-indigo-600]:!from-fuchsia-600 [&_.to-indigo-800]:!to-purple-800 [&_.text-indigo-600]:!text-fuchsia-600 [&_.text-indigo-500]:!text-fuchsia-500 [&_.text-indigo-400]:!text-fuchsia-400 [&_.text-indigo-300]:!text-fuchsia-300 [&_.text-indigo-200]:!text-fuchsia-200 [&_.text-indigo-100]:!text-fuchsia-100 [&_.bg-indigo-50]:!bg-fuchsia-50 [&_.bg-indigo-100]:!bg-fuchsia-100 [&_.border-indigo-100]:!border-fuchsia-100 [&_.border-indigo-200]:!border-fuchsia-200 [&_.border-indigo-500]:!border-fuchsia-500 [&_.hover\\:border-indigo-300:hover]:!border-fuchsia-300 [&_.ring-indigo-500\\/50]:!ring-fuchsia-500/50',
  '[&_.bg-indigo-600]:!bg-slate-700 [&_.hover\\:bg-indigo-700:hover]:!bg-slate-800 [&_.from-indigo-600]:!from-slate-700 [&_.to-indigo-800]:!to-cyan-800 [&_.text-indigo-600]:!text-slate-700 [&_.text-indigo-500]:!text-slate-600 [&_.text-indigo-400]:!text-slate-400 [&_.text-indigo-300]:!text-slate-300 [&_.text-indigo-200]:!text-slate-200 [&_.text-indigo-100]:!text-slate-100 [&_.bg-indigo-50]:!bg-slate-50 [&_.bg-indigo-100]:!bg-slate-100 [&_.border-indigo-100]:!border-slate-200 [&_.border-indigo-200]:!border-slate-300 [&_.border-indigo-500]:!border-slate-600 [&_.hover\\:border-indigo-300:hover]:!border-slate-400 [&_.ring-indigo-500\\/50]:!ring-slate-500/50',
];

const renderEnglishTopic = (unit: number, content: React.ReactNode) => (
  <div className={`english-topic-accent ${englishTopicAccentClasses[(unit - 1) % englishTopicAccentClasses.length]}`}>
    {content}
  </div>
);

const SHARED_LANGUAGE_LEVELS = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

const AGRICULTURE_TOPICS: Record<string, React.ComponentType[]> = {
  'Form 1': [Form1Agriculture1, Form1Agriculture2, Form1Agriculture3, Form1Agriculture4, Form1Agriculture5, Form1Agriculture6],
  'Form 2': [Form2Agriculture1, Form2Agriculture2, Form2Agriculture3, Form2Agriculture4, Form2Agriculture5, Form2Agriculture6],
  'Form 3': [Form3Agriculture1, Form3Agriculture2, Form3Agriculture3, Form3Agriculture4, Form3Agriculture5, Form3Agriculture6],
  'Form 4': [Form4Agriculture1, Form4Agriculture2, Form4Agriculture3, Form4Agriculture4, Form4Agriculture5, Form4Agriculture6],
};

export const DynamicSubjectViewer: React.FC<DynamicSubjectViewerProps> = ({
  level,
  subject,
  activeUnit,
  fallback,
  onNavigateToUnit,
}) => {
  if (!SHARED_LANGUAGE_LEVELS.includes(level)) {
    return <>{fallback}</>;
  }

  if (subject === 'Agriculture') {
    const AgricultureTopic = AGRICULTURE_TOPICS[level]?.[activeUnit - 1];
    if (AgricultureTopic) return <AgricultureTopic />;
  }

  if (subject === 'Mathematics' && level === 'Form 1') {
    const mathTopicTitles = [
      'Real Numbers',
      'Sets',
      'Financial Mathematics',
      'Measures and Mensuration',
      'Graphs',
      'Algebra',
      'Geometry',
      'Statistics',
      'Transformation',
    ];
    const navigationProps: MathNavigationProps = {
      nextTopicTitle: mathTopicTitles[activeUnit],
      onNextTopic:
        activeUnit < mathTopicTitles.length && onNavigateToUnit
          ? () => onNavigateToUnit(activeUnit + 1)
          : undefined,
    };

    if (activeUnit === 1) return <RealNumbers {...navigationProps} />;
    if (activeUnit === 2) return <Sets {...navigationProps} />;
    if (activeUnit === 3) return <FinancialMathematics {...navigationProps} />;
    if (activeUnit === 4) return <MeasuresAndMensuration {...navigationProps} />;
    if (activeUnit === 5) return <Graphs {...navigationProps} />;
    if (activeUnit === 6) return <Algebra {...navigationProps} />;
    if (activeUnit === 7) return <Geometry {...navigationProps} />;
    if (activeUnit === 8) return <Statistics {...navigationProps} />;
    if (activeUnit === 9) return <Transformation {...navigationProps} />;
  }

  if (subject === 'Combined Science' && level === 'Form 1') {
    const scienceTopicTitles = ['Foundation', 'Biology', 'Chemistry', 'Physics'];
    const navigationProps = {
      nextTopicTitle: scienceTopicTitles[activeUnit],
      onNextTopic:
        activeUnit < scienceTopicTitles.length && onNavigateToUnit
          ? () => onNavigateToUnit(activeUnit + 1)
          : undefined,
    };

    if (activeUnit === 1) return <ScienceFoundation {...navigationProps} />;
    if (activeUnit === 2) return <ScienceBiology {...navigationProps} />;
    if (activeUnit === 3) return <ScienceChemistry {...navigationProps} />;
    if (activeUnit === 4) return <SciencePhysics {...navigationProps} />;
  }

  if (subject === 'Family and Religious Studies' || subject === 'FRS') {
    if (level === 'Form 1') {
      if (activeUnit === 1) return <Form1FrsT1 />;
      if (activeUnit === 2) return <Form1FrsT2 />;
    }
    if (level === 'Form 2') {
      if (activeUnit === 1) return <Form2FrsT1 />;
      if (activeUnit === 2) return <Form2FrsT2 />;
    }
    if (level === 'Form 3') {
      if (activeUnit === 1) return <Form3FrsT1 />;
      if (activeUnit === 2) return <Form3FrsT2 />;
    }
    if (level === 'Form 4') {
      if (activeUnit === 1) return <Form4FrsT1 />;
      if (activeUnit === 2) return <Form4FrsT2 />;
    }
  }

  if (subject === 'History' && level === 'Form 1') {
    if (activeUnit === 1) return <HistoryOfSouthernAfrica />;
    if (activeUnit === 2) return <GreatZimbabweState />;
  }

  if (subject === 'Shona') {
    if (activeUnit === 1) return <ShonaLO1 />;
    if (activeUnit === 2) return <ShonaTsumo />;
    if (activeUnit === 3) return <ShonaMadimikira />;
    if (activeUnit === 4) return <ShonaZvirevo />;
    if (activeUnit === 5) return <ShonaSimilesMetaphors />;
    if (activeUnit === 6) return <ShonaIdeophones />;
    if (activeUnit === 7) return <ShonaEuphemisms />;
    if (activeUnit === 8) return <ShonaHyperboles />;
    if (activeUnit === 9) return <ShonaNounClasses />;
    if (activeUnit === 10) return <ShonaPronouns />;
  }

  if (subject === 'English Language') {
    if (activeUnit === 1) return renderEnglishTopic(activeUnit, <EnglishGrammar />);
    if (activeUnit === 2) return renderEnglishTopic(activeUnit, <EnglishWriting />);
    if (activeUnit === 3) return renderEnglishTopic(activeUnit, <EnglishReading />);
    if (activeUnit === 4) return renderEnglishTopic(activeUnit, <EnglishComposition />);
    if (activeUnit === 5) return renderEnglishTopic(activeUnit, <EnglishComposition2 />);
    if (activeUnit === 6) return renderEnglishTopic(activeUnit, <EnglishComprehension />);
    if (activeUnit === 7) return renderEnglishTopic(activeUnit, <EnglishOral />);
    if (activeUnit === 8) return renderEnglishTopic(activeUnit, <EnglishFunctional />);
    if (activeUnit === 9) return renderEnglishTopic(activeUnit, <EnglishStudySkills />);
    if (activeUnit === 10) return renderEnglishTopic(activeUnit, <EnglishLanguageInUse />);
  }

  return <>{fallback}</>;
};
