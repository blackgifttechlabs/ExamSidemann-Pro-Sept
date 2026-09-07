import React from 'react';
import { PracticalViewer, Topic } from '../PracticalViewer';

const topics: Topic[] = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    sections: [
      {
        title: 'Introduction to HTML',
        content: `HTML stands for Hyper Text Markup Language. It is the standard markup language for creating Web pages. HTML describes the structure of a Web page.`,
        videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
        code: {
          language: 'html',
          snippet: `<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>`,
          filename: 'index.html'
        }
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling',
    sections: [
      {
        title: 'Introduction to CSS',
        content: `CSS stands for Cascading Style Sheets. CSS describes how HTML elements are to be displayed on screen, paper, or in other media.`,
        videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
        code: {
          language: 'css',
          snippet: `body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
  font-size: 20px;
}`,
          filename: 'style.css'
        }
      }
    ]
  }
];

export const WebDevelopment: React.FC = () => {
  return <PracticalViewer subjectTitle="Web Development" topics={topics} backPath="/practicals/polytechnic/it" />;
};
