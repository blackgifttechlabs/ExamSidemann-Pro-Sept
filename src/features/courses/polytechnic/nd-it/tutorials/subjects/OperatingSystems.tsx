import React from 'react';
import { PracticalViewer, Topic } from '../PracticalViewer';

const topics: Topic[] = [
  {
    id: 'linux-basics',
    title: 'Linux Basics',
    sections: [
      {
        title: 'Introduction to Linux',
        content: `Linux is a family of open-source Unix-like operating systems based on the Linux kernel, an operating system kernel first released on September 17, 1991, by Linus Torvalds.`,
        videoUrl: 'https://www.youtube.com/watch?v=wBp0Rb-ZJak',
        code: {
          language: 'bash',
          snippet: `ls -l
cd /home/user
mkdir new_folder
touch file.txt`,
          filename: 'terminal'
        }
      }
    ]
  },
  {
    id: 'ms-dos',
    title: 'MS-DOS Commands',
    sections: [
      {
        title: 'Basic MS-DOS Commands',
        content: `MS-DOS (Microsoft Disk Operating System) is an operating system for x86-based personal computers mostly developed by Microsoft.`,
        videoUrl: 'https://www.youtube.com/watch?v=15b22533',
        code: {
          language: 'batch',
          snippet: `DIR
CD WINDOWS
MD NEWDIR
COPY FILE.TXT C:\\BACKUP`,
          filename: 'cmd.exe'
        }
      }
    ]
  }
];

export const OperatingSystems: React.FC = () => {
  return <PracticalViewer subjectTitle="Operating Systems Administration" topics={topics} backPath="/practicals/polytechnic/it" />;
};
