import React from 'react';
import { PracticalViewer, Topic } from '../PracticalViewer';

const topics: Topic[] = [
  {
    id: 'intro-to-sql',
    title: 'Introduction to SQL',
    sections: [
      {
        title: 'What is SQL?',
        content: `SQL (Structured Query Language) is the standard language for relational database management systems. 
        It is used to communicate with a database. According to ANSI (American National Standards Institute), it is the standard language for relational database management systems.`,
        videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        code: {
          language: 'sql',
          snippet: `SELECT * FROM Users;`,
          filename: 'query.sql'
        }
      },
      {
        title: 'Creating a Database',
        content: `To create a new database, use the CREATE DATABASE statement followed by the name of the database.`,
        videoUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
        code: {
          language: 'sql',
          snippet: `CREATE DATABASE SchoolDB;`,
          filename: 'create_db.sql'
        }
      }
    ]
  },
  {
    id: 'table-management',
    title: 'Table Management',
    sections: [
      {
        title: 'Creating Tables',
        content: `Tables are database objects that contain all the data in a database. In tables, data is logically organized in a row-and-column format similar to a spreadsheet.`,
        videoUrl: 'https://www.youtube.com/watch?v=oReH2vO8Izc',
        code: {
          language: 'sql',
          snippet: `CREATE TABLE Students (
    StudentID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);`,
          filename: 'create_table.sql'
        }
      }
    ]
  }
];

export const DatabaseAdministration: React.FC = () => {
  return <PracticalViewer subjectTitle="Database Administration" topics={topics} backPath="/practicals/polytechnic/it" />;
};
