import React from 'react';
import { PracticalViewer, Topic } from '../PracticalViewer';

const topics: Topic[] = [
  {
    id: 'intro-oop',
    title: 'Introduction to OOP',
    sections: [
      {
        title: 'Classes and Objects',
        content: `Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code, in the form of procedures (often known as methods).`,
        videoUrl: 'https://www.youtube.com/watch?v=pTbSfCT42_M',
        code: {
          language: 'csharp',
          snippet: `public class Car 
{
    public string color = "red";
}

class Program
{
    static void Main(string[] args)
    {
        Car myObj = new Car();
        Console.WriteLine(myObj.color);
    }
}`,
          filename: 'Program.cs'
        }
      }
    ]
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    sections: [
      {
        title: 'Understanding Inheritance',
        content: `Inheritance is a mechanism in which one class acquires the property of another class. For example, a child inherits the traits of his/her parents. With inheritance, we can reuse the fields and methods of the existing class.`,
        videoUrl: 'https://www.youtube.com/watch?v=I27k3k2_j9Y',
        code: {
          language: 'csharp',
          snippet: `class Vehicle  // base class (parent) 
{
  public string brand = "Ford";
  public void honk() 
  {
    Console.WriteLine("Tuut, tuut!");
  }
}

class Car : Vehicle  // derived class (child)
{
  public string modelName = "Mustang";
}`,
          filename: 'Inheritance.cs'
        }
      }
    ]
  }
];

export const ObjectOrientedProgramming: React.FC = () => {
  return <PracticalViewer subjectTitle="Object Oriented Programming (C#)" topics={topics} backPath="/practicals/polytechnic/it" />;
};
