import React from 'react';
import { PracticalViewer, Topic } from '../../../nd-it/tutorials/PracticalViewer';

const topics: Topic[] = [
  {
    id: 'ms-word',
    title: 'Microsoft Word',
    sections: [
      {
        title: 'Document Formatting',
        content: `Learn how to format documents professionally using styles, headers, footers, and page layouts.`,
        videoUrl: 'https://www.youtube.com/watch?v=S-nHYzK-BVg',
      }
    ]
  },
  {
    id: 'ms-access',
    title: 'Microsoft Access',
    sections: [
      {
        title: 'Creating Tables and Queries',
        content: `Introduction to database concepts in Access. Creating tables, defining relationships, and running basic queries.`,
        videoUrl: 'https://www.youtube.com/watch?v=y5r-1g_K-18',
      }
    ]
  },
  {
    id: 'ms-dos',
    title: 'MS-DOS Basics',
    sections: [
      {
        title: 'Command Line Interface',
        content: `Navigating the file system, creating directories, and managing files using MS-DOS commands.`,
        videoUrl: 'https://www.youtube.com/watch?v=15b22533',
        code: {
          language: 'batch',
          snippet: `DIR
CD Documents
MD NewFolder`,
          filename: 'cmd.exe'
        }
      }
    ]
  },
  {
    id: 'quickbooks',
    title: 'QuickBooks',
    sections: [
      {
        title: 'Setting up a Company',
        content: `Step-by-step guide to setting up a new company file in QuickBooks, including chart of accounts and customer lists.`,
        videoUrl: 'https://www.youtube.com/watch?v=top_video_id',
      }
    ]
  }
];

export const ComputerSystemsMaintenance: React.FC = () => {
  return <PracticalViewer subjectTitle="Computer Systems Maintenance" topics={topics} backPath="/practicals/polytechnic/it" />;
};
