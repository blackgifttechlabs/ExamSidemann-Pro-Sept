import React, { useState, useEffect, useRef } from 'react';
import { HighlightedCode } from './CodeHighlighter';
import { useLessonState } from '../../../lessonProgress';
import {
  ShieldCheck,
  BookOpen,
  Terminal,
  Code2,
  Layers,
  Cpu,
  Search,
  ClipboardList,
  Info,
  ArrowRight,
  Download,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
  Binary,
  Calculator,
  Zap,
  Database,
  FileText,
  Layout,
  ListChecks,
  Smartphone,
  Globe,
  Box,
  GitBranch,
  CheckCircle,
  Rocket,
  Brain,
  FileCode,
  Code,
  ChevronUp,
  X,
  Sparkles,
  BookMarked,
  Target,
  Users,
  Scale,
  AlertTriangle as AlertTriangleIcon,
  Network,
  FolderTree,
  HardDrive,
  Server,
  Folder,
  File,
  FolderOpen,
  Table,
  Grid,
  Pointer,
  MemoryStick,
  ArrowRight as ArrowRightIcon,
  Save,
  FileText as FileTextIcon,
  Bug,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// VS Code Typing Animation Component
// ──────────────────────────────────────────────────────────────────────────────
const VSCodeTyping: React.FC<{ code: string; fileName: string }> = ({ code, fileName }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsTyping(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(code.slice(0, i));
      i++;
      if (i > code.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [isTyping, code]);

  return (
    <div ref={containerRef} className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-2xl font-mono text-xs md:text-sm my-8">
      <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          <Terminal size={12} /> {fileName} — Visual Studio Code
        </span>
      </div>
      <div className="p-4 md:p-6 flex gap-4 min-h-[150px]">
        <div className="text-gray-500 text-right select-none border-r border-[#333] pr-4 leading-relaxed opacity-50">
          {code.split('\n').map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>
        <div className="flex-1 text-gray-300 whitespace-pre-wrap leading-relaxed relative">
          <HighlightedCode code={displayedCode} />
          <span className="w-2 h-4 bg-blue-500 absolute inline-block ml-0.5 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'classes-objects', label: 'Classes & Objects' },
  { id: 'encapsulation', label: 'Encapsulation' },
  { id: 'inheritance', label: 'Inheritance' },
  { id: 'polymorphism', label: 'Polymorphism' },
  { id: 'abstraction', label: 'Abstraction' },
  { id: 'constructors', label: 'Constructors' },
  { id: 'destructors', label: 'Destructors' },
  { id: 'testing-debugging', label: 'Testing & Debugging' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Object-Oriented Programming models real-world entities as objects with data and behavior.',
      },
      {
        title: 'Pro Tip',
        text: 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "EIPA" – Encapsulation, Inheritance, Polymorphism, Abstraction.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse abstraction with encapsulation. Abstraction hides implementation; encapsulation hides data.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Object-Oriented Programming models real-world entities as objects with data and behavior.',
      },
      {
        title: 'Pro Tip',
        text: 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "EIPA" – Encapsulation, Inheritance, Polymorphism, Abstraction.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse abstraction with encapsulation. Abstraction hides implementation; encapsulation hides data.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 7{' '}
            <span className="text-indigo-300 font-bold italic">
              Object-Oriented Programming
            </span>
          </h1>
          <p className="text-lg text-rose-100 max-w-2xl leading-relaxed">
            Master the four pillars of Object-Oriented Programming: Encapsulation,
            Inheritance, Polymorphism, and Abstraction. Learn about classes,
            objects, constructors, destructors, and testing/debugging techniques.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-rose-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Box size={14} className="inline mr-1" /> Classes
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> Inheritance
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-rose-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, principle, or syntax..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-rose-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-rose-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Object-Oriented Programming
              </h2>

              <div className="p-4 sm:p-5 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Object-Oriented Programming (OOP) is a programming paradigm
                    that organizes code around objects – which contain data (attributes)
                    and methods (functions). This learning outcome covers the four
                    pillars of OOP, classes, objects, constructors, destructors,
                    and testing/debugging techniques.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Encapsulation</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Inheritance</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">Polymorphism</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">Abstraction</span>
                </div>
              </div>
            </div>

            {/* Classes and Objects */}
            <div
              ref={(el) => {
                sectionRefs.current['classes-objects'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Classes and Objects
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">class</span> is a blueprint or template for creating objects. An <span className="font-bold">object</span> is an instance of a class.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Class</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Blueprint or template</li>
                    <li>Defines attributes (data) and methods (functions)</li>
                    <li>Does not occupy memory until instantiated</li>
                    <li>Example: <code>class Car { '...' };</code></li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Object</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Instance of a class</li>
                    <li>Has its own state (attribute values)</li>
                    <li>Occupies memory</li>
                    <li>Example: <code>Car myCar;</code></li>
                  </ul>
                </div>
              </div>

              <VSCodeTyping fileName="class_object.cpp" code={`#include <iostream>
#include <string>
using namespace std;

// Class definition
class Car {
public:
  // Attributes
  string brand;
  string model;
  int year;
  
  // Method
  void displayInfo() {
    cout << "Brand: " << brand << endl;
    cout << "Model: " << model << endl;
    cout << "Year: " << year << endl;
  }
};

int main() {
  // Creating objects (instances of Car)
  Car car1;
  car1.brand = "Toyota";
  car1.model = "Corolla";
  car1.year = 2020;
  
  Car car2;
  car2.brand = "Honda";
  car2.model = "Civic";
  car2.year = 2022;
  
  car1.displayInfo();
  car2.displayInfo();
  
  return 0;
}`} />
            </div>

            {/* Encapsulation */}
            <div
              ref={(el) => {
                sectionRefs.current['encapsulation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Encapsulation
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Encapsulation</span> is the bundling of data (attributes) and methods (functions) within a class, and controlling access to the data using access specifiers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Public</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accessible from anywhere.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Private</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accessible only within the class.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Protected</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accessible within the class and derived classes.</p>
                </div>
              </div>

              <VSCodeTyping fileName="encapsulation.cpp" code={`#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
  string accountNumber;
  double balance;
  
public:
  // Constructor
  BankAccount(string accNum, double initialBalance) {
    accountNumber = accNum;
    balance = initialBalance;
  }
  
  // Getter (accessor)
  double getBalance() const {
    return balance;
  }
  
  // Setter (mutator)
  void deposit(double amount) {
    if (amount > 0) {
      balance += amount;
    }
  }
  
  bool withdraw(double amount) {
    if (amount > 0 && amount <= balance) {
      balance -= amount;
      return true;
    }
    return false;
  }
};

int main() {
  BankAccount acc("12345678", 1000.0);
  cout << "Balance: $" << acc.getBalance() << endl;
  acc.deposit(500);
  cout << "After deposit: $" << acc.getBalance() << endl;
  acc.withdraw(200);
  cout << "After withdrawal: $" << acc.getBalance() << endl;
  return 0;
}`} />
            </div>

            {/* Inheritance */}
            <div
              ref={(el) => {
                sectionRefs.current['inheritance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Inheritance
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Inheritance</span> allows a class (child/derived) to inherit attributes and methods from another class (parent/base). Promotes code reuse and establishes hierarchical relationships.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Base Class (Parent)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The class being inherited from. Contains general attributes and methods.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Derived Class (Child)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The class that inherits from the base class. Can add new attributes/methods and override existing ones.</p>
                </div>
              </div>

              <VSCodeTyping fileName="inheritance.cpp" code={`#include <iostream>
#include <string>
using namespace std;

// Base class
class Animal {
protected:
  string name;
public:
  Animal(string n) : name(n) {}
  void eat() {
    cout << name << " is eating." << endl;
  }
  void sleep() {
    cout << name << " is sleeping." << endl;
  }
};

// Derived class
class Dog : public Animal {
private:
  string breed;
public:
  Dog(string n, string b) : Animal(n), breed(b) {}
  
  void bark() {
    cout << name << " says Woof!" << endl;
  }
  
  void display() {
    cout << "Name: " << name << ", Breed: " << breed << endl;
  }
};

int main() {
  Dog myDog("Buddy", "Golden Retriever");
  myDog.display();
  myDog.eat();
  myDog.sleep();
  myDog.bark();
  return 0;
}`} />
            </div>

            {/* Polymorphism */}
            <div
              ref={(el) => {
                sectionRefs.current['polymorphism'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Polymorphism
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Polymorphism</span> (many forms) allows objects of different classes to respond to the same method call in different ways.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Compile-Time Polymorphism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Function overloading – multiple functions with the same name but different parameters.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Runtime Polymorphism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Method overriding – derived classes provide their own implementation of a base class method using <code>virtual</code> keyword.</p>
                </div>
              </div>

              <VSCodeTyping fileName="polymorphism.cpp" code={`#include <iostream>
using namespace std;

// Base class
class Shape {
public:
  virtual double area() const = 0; // Pure virtual function
  virtual void display() const {
    cout << "This is a shape." << endl;
  }
};

// Derived class: Rectangle
class Rectangle : public Shape {
private:
  double width, height;
public:
  Rectangle(double w, double h) : width(w), height(h) {}
  double area() const override {
    return width * height;
  }
  void display() const override {
    cout << "Rectangle: " << width << " x " << height << endl;
  }
};

// Derived class: Circle
class Circle : public Shape {
private:
  double radius;
public:
  Circle(double r) : radius(r) {}
  double area() const override {
    return 3.14159 * radius * radius;
  }
  void display() const override {
    cout << "Circle: radius = " << radius << endl;
  }
};

int main() {
  Rectangle rect(5, 3);
  Circle circ(4);
  
  Shape* shapes[] = {&rect, &circ};
  for (int i = 0; i < 2; i++) {
    shapes[i]->display();
    cout << "Area: " << shapes[i]->area() << endl;
  }
  return 0;
}`} />
            </div>

            {/* Abstraction */}
            <div
              ref={(el) => {
                sectionRefs.current['abstraction'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Abstraction
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Abstraction</span> hides implementation details and exposes only the essential features of an object. It reduces complexity and allows the user to interact with the object at a high level.
              </p>

              <div className="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Key Concepts</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold">Abstract classes</span> – contain at least one pure virtual function.</li>
                  <li><span className="font-bold">Interfaces</span> – define contracts that classes must implement.</li>
                  <li><span className="font-bold">Information hiding</span> – only expose what's necessary.</li>
                </ul>
              </div>

              <VSCodeTyping fileName="abstraction.cpp" code={`#include <iostream>
using namespace std;

// Abstract class
class Vehicle {
public:
  virtual void start() = 0; // Pure virtual function
  virtual void stop() = 0;
  virtual ~Vehicle() {} // Virtual destructor
};

// Concrete class
class Car : public Vehicle {
public:
  void start() override {
    cout << "Car engine started." << endl;
  }
  void stop() override {
    cout << "Car engine stopped." << endl;
  }
};

class Motorcycle : public Vehicle {
public:
  void start() override {
    cout << "Motorcycle engine started." << endl;
  }
  void stop() override {
    cout << "Motorcycle engine stopped." << endl;
  }
};

int main() {
  Vehicle* v1 = new Car();
  Vehicle* v2 = new Motorcycle();
  
  v1->start();
  v1->stop();
  v2->start();
  v2->stop();
  
  delete v1;
  delete v2;
  return 0;
}`} />
            </div>

            {/* Constructors */}
            <div
              ref={(el) => {
                sectionRefs.current['constructors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Constructors
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">constructor</span> is a special method that is automatically called when an object is created. It initializes the object's attributes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Default Constructor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No parameters. Provided by default if no other constructor is defined.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Parameterized Constructor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accepts arguments to initialize attributes with specific values.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Copy Constructor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Creates a new object as a copy of an existing object.</p>
                </div>
              </div>

              <VSCodeTyping fileName="constructors.cpp" code={`#include <iostream>
#include <string>
using namespace std;

class Student {
private:
  string name;
  int age;
  double gpa;
  
public:
  // Default constructor
  Student() : name("Unknown"), age(0), gpa(0.0) {}
  
  // Parameterized constructor
  Student(string n, int a, double g) : name(n), age(a), gpa(g) {}
  
  // Copy constructor
  Student(const Student& other) {
    name = other.name;
    age = other.age;
    gpa = other.gpa;
  }
  
  void display() {
    cout << "Name: " << name << ", Age: " << age << ", GPA: " << gpa << endl;
  }
};

int main() {
  Student s1; // Default constructor
  Student s2("Alice", 20, 3.8); // Parameterized constructor
  Student s3(s2); // Copy constructor
  
  s1.display();
  s2.display();
  s3.display();
  
  return 0;
}`} />
            </div>

            {/* Destructors */}
            <div
              ref={(el) => {
                sectionRefs.current['destructors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Destructors
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">destructor</span> is a special method that is automatically called when an object is destroyed. It is used to release resources (memory, file handles, etc.).
              </p>

              <VSCodeTyping fileName="destructor.cpp" code={`#include <iostream>
using namespace std;

class Resource {
private:
  int* data;
  int size;
  
public:
  // Constructor
  Resource(int s) : size(s) {
    cout << "Allocating " << size << " ints." << endl;
    data = new int[size];
  }
  
  // Destructor
  ~Resource() {
    cout << "Freeing " << size << " ints." << endl;
    delete[] data;
  }
  
  void fill(int value) {
    for (int i = 0; i < size; i++) {
      data[i] = value + i;
    }
  }
  
  void display() {
    for (int i = 0; i < size; i++) {
      cout << data[i] << " ";
    }
    cout << endl;
  }
};

int main() {
  Resource res(5);
  res.fill(10);
  res.display();
  // Destructor called automatically when res goes out of scope
  return 0;
}`} />
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Important</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Destructors have the same name as the class with a <code>~</code> prefix.</li>
                  <li>They take no parameters and have no return type.</li>
                  <li>Use them to free dynamically allocated memory.</li>
                  <li>If a class manages resources, always define a destructor.</li>
                </ul>
              </div>
            </div>

            {/* Testing and Debugging */}
            <div
              ref={(el) => {
                sectionRefs.current['testing-debugging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Testing &amp; Debugging
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Bug size={14} /> Types of Errors
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Syntax Errors</span> – language rules broken (missing semicolon, mismatched braces).</li>
                    <li><span className="font-bold">Runtime Errors</span> – program crashes during execution (division by zero, null pointer).</li>
                    <li><span className="font-bold">Logic Errors</span> – program runs but produces wrong output.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Search size={14} /> Debugging Techniques
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Print statements</span> – use <code>cout</code> to trace execution.</li>
                    <li><span className="font-bold">Debugger</span> – step through code, inspect variables.</li>
                    <li><span className="font-bold">Breakpoints</span> – pause execution at specific lines.</li>
                    <li><span className="font-bold">Unit testing</span> – test individual components.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">⚠️ Common Debugging Tips</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Read error messages carefully – they tell you where the problem is.</li>
                  <li>Check variable values at critical points.</li>
                  <li>Test small pieces of code independently.</li>
                  <li>Use version control to track changes.</li>
                  <li>Don't assume – verify!</li>
                </ul>
              </div>

              <VSCodeTyping fileName="debug_example.cpp" code={`#include <iostream>
using namespace std;

// Function with a logical error
int calculateAverage(int arr[], int size) {
  int sum = 0;
  for (int i = 0; i <= size; i++) { // BUG: Should be i < size
    sum += arr[i];
  }
  return sum / size; // BUG: Should use floating point division
}

int main() {
  int scores[] = {85, 90, 78, 92, 88};
  int size = 5;
  
  cout << "Average: " << calculateAverage(scores, size) << endl;
  // This may crash or give wrong results due to logic errors
  return 0;
}`} />
            </div>

            {/* Exam Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['exam-tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Exam Tips
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">📌 Know the Four Pillars</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Encapsulation, Inheritance, Polymorphism, Abstraction – be able to define and give examples of each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">📌 Understand Classes vs Objects</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A class is a blueprint; an object is an instance. Know how to define and use both.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">📌 Constructor and Destructor Basics</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">When they are called and their purpose. Know default, parameterized, and copy constructors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">📌 Error Types and Debugging</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Syntax, runtime, and logic errors – and how to debug using print statements, breakpoints, and unit tests.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">📌 Practice Writing Classes</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be ready to define a class with attributes, methods, constructors, and demonstrate inheritance and polymorphism.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Design it. Build it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  💡 OOP Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-rose-500 dark:text-rose-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>OOP Pillars</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Error Types</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Object-Oriented Programming helps you model real-world problems
                effectively. Master the four pillars and you'll be able to design
                clean, maintainable, and scalable software.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-rose-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Encapsulation</strong> – bundling data and methods, controlling access with public/private/protected.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inheritance</strong> – creating hierarchies, code reuse, base and derived classes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Polymorphism</strong> – many forms, compile-time (overloading) and runtime (overriding with virtual functions).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Abstraction</strong> – hiding implementation, exposing only essential features via abstract classes and interfaces.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Constructors</strong> – initialize objects (default, parameterized, copy). <strong>Destructors</strong> – release resources.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing &amp; Debugging</strong> – syntax, runtime, logic errors; techniques: print statements, debuggers, breakpoints, unit testing.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • NC IT Programming Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;