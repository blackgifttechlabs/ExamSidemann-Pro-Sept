import React from 'react';
import { PracticalViewer, Topic } from '../polytechnic/nd-it/tutorials/PracticalViewer';

const topics: Topic[] = [
  {
    id: 'placeholder',
    title: 'Practical Labs Coming Soon',
    sections: [
      {
        title: 'Under Development',
        content: `We are currently curating high-quality practical labs for this subject. Check back soon!`,
      }
    ]
  }
];

export const PlaceholderPractical: React.FC<{ title: string; backPath?: string }> = ({ title, backPath }) => {
  return <PracticalViewer subjectTitle={title} topics={topics} backPath={backPath} />;
};
