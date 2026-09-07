import { 
  BookOpen, Layers, GraduationCap, School, FileText, Cpu, Globe, Activity, 
  Database, Layout, Code, Terminal, Hash, GitBranch, Box, Bug
} from 'lucide-react';

export interface SubjectMeta {
    name: string;
    outcomeCount: number;
    description: string;
    studyTime?: string;
    outcomes?: string[];
}

export interface AcademicLevel {
    id: string;
    name: string;
    category: 'ZJC' | "O' Level" | "A' Level" | 'Polytechnic';
    subjects: SubjectMeta[];
}

export const AGRICULTURE_OUTCOMES = [
    'General Agriculture',
    'Soil and Water',
    'Crop Husbandry',
    'Animal Husbandry',
    'Farm Structures and Machinery',
    'Agri-Business'
];

const COMMON_SUBJECTS: SubjectMeta[] = [
    { name: 'Mathematics', outcomeCount: 15, description: 'Numbers, Algebra and Geometry' },
    { name: 'English Language', outcomeCount: 10, description: 'Language and Literature proficiency' },
    { name: 'Shona', outcomeCount: 10, description: 'Mutauro neNhoroondo' },
    { name: 'Ndebele', outcomeCount: 10, description: 'Ulimi Lesiko' },
    { name: 'Combined Science', outcomeCount: 18, description: 'Foundations of Biology, Physics and Chemistry' },
    { name: 'Geography', outcomeCount: 14, description: 'The Physical and Human Environment' },
    { name: 'History', outcomeCount: 12, description: 'International and Local History' },
    { name: 'Agriculture', outcomeCount: AGRICULTURE_OUTCOMES.length, description: 'Modern Farming and Management', outcomes: AGRICULTURE_OUTCOMES },
    { name: 'Heritage Studies', outcomeCount: 10, description: 'Civic Pride and National Identity' },
    { name: 'Family and Religious Studies', outcomeCount: 12, description: 'Ethics and World Religions' },
    { name: 'Computer Studies', outcomeCount: 15, description: 'Information Technology Foundations' },
    { name: 'Technical Graphics', outcomeCount: 10, description: 'Drafting and Design' },
    { name: 'Art and Design', outcomeCount: 8, description: 'Visual Expression and Creativity' },
    { name: 'Music', outcomeCount: 8, description: 'Theory and Performance' },
    { name: 'Physical Education (PE)', outcomeCount: 10, description: 'Health and Sportsmanship' },
    { name: 'Food and Nutrition', outcomeCount: 12, description: 'Culinary Arts and Dietetics' },
    { name: 'Fashion and Fabrics', outcomeCount: 12, description: 'Textile Design and Sewing' },
    { name: 'Bible Knowledge', outcomeCount: 10, description: 'Scriptural Studies' }
];

const FORM1_MATH_OUTCOMES = [
    'Real Numbers',
    'Sets',
    'Financial Mathematics',
    'Measures and Mensuration',
    'Graphs',
    'Algebra',
    'Geometry',
    'Statistics',
    'Transformation'
];

export const FORM4_MATH_OUTCOMES = [
    'General arithmetic',
    'Geometrical constructions Locus',
    'Circle geometry Tangents',
    'The sine rule',
    'Graphs Gradient',
    'Variation',
    'Mensuration of solid shapes',
    'The cosine rule',
    'Consumer arithmetic',
    'Matrices',
    'Geometrical transformations',
    'Graphs Cubic and inverse functions, sketch graphs',
    'Lengths and angles in solids',
    'Fractions in algebra',
    'Graphs Velocity–time curves',
    'Inequalities',
    'Vectors',
    'Probabilities'
];

const FORM1_COMBINED_SCIENCE_OUTCOMES = [
    'Foundation',
    'Biology',
    'Chemistry',
    'Physics'
];

const FORM1_HISTORY_OUTCOMES = [
    'History of Southern Africa',
    'Great Zimbabwe State'
];

const FORM1_SUBJECTS: SubjectMeta[] = COMMON_SUBJECTS.map(subject =>
    subject.name === 'Mathematics'
        ? {
            ...subject,
            outcomeCount: FORM1_MATH_OUTCOMES.length,
            description: 'Form 1 number, algebra, geometry, measurement and data skills.',
            outcomes: FORM1_MATH_OUTCOMES
        }
        : subject.name === 'Combined Science'
        ? {
            ...subject,
            outcomeCount: FORM1_COMBINED_SCIENCE_OUTCOMES.length,
            description: 'Form 1 lab skills, Biology, Chemistry and Physics foundations.',
            outcomes: FORM1_COMBINED_SCIENCE_OUTCOMES
        }
        : subject.name === 'History'
        ? {
            ...subject,
            outcomeCount: FORM1_HISTORY_OUTCOMES.length,
            description: 'The Stone Age, Iron Age, Great Zimbabwe and the development of societies in Southern Africa.',
            outcomes: FORM1_HISTORY_OUTCOMES
        }
        : subject
);

const COMBINED_SCIENCE_OUTCOMES = ['Biology', 'Chemistry', 'Physics'];

// Give the "Combined Science" subject the Biology / Chemistry / Physics sidebar
// units (instead of generic "Unit 1..18") for Forms 2, 3 and 4.
const withCombinedScience = (subjects: SubjectMeta[], description: string): SubjectMeta[] =>
    subjects.map(subject =>
        subject.name === 'Combined Science'
            ? {
                ...subject,
                outcomeCount: COMBINED_SCIENCE_OUTCOMES.length,
                description,
                outcomes: COMBINED_SCIENCE_OUTCOMES,
            }
            : subject
    );

export const FORM4_PRINCIPLES_OF_ACCOUNTING_OUTCOMES = [
    'Trial Balance and Errors',
    'Accounting Ratios',
    'Single Entry and Incomplete Records',
    'Manufacturing Accounts',
    'Partnerships Formation',
    'Company Accounts',
    'Business Ethics'
];

const OLEVEL_ADDITIONS: SubjectMeta[] = [
    { name: 'Biology', outcomeCount: 20, description: 'Study of Living Organisms' },
    { name: 'Chemistry', outcomeCount: 20, description: 'Matter and Chemical Reactions' },
    { name: 'Physics', outcomeCount: 20, description: 'Forces, Energy and Matter' },
    { name: 'Pure Mathematics', outcomeCount: 22, description: 'Advanced Calculus and Trigonometry' },
    { name: 'Statistics', outcomeCount: 15, description: 'Data Analysis and Probability' },
    { name: 'Principles of Accounting', outcomeCount: FORM4_PRINCIPLES_OF_ACCOUNTING_OUTCOMES.length, description: 'Form 4 financial accounting, trial balance, ratios, partnerships and company accounts.', outcomes: FORM4_PRINCIPLES_OF_ACCOUNTING_OUTCOMES }
];

const SHARED_COMPUTER_SCIENCE_OUTCOMES = [
    'Data, Computer Types and Generations',
    'Input, Output, Processing and Storage',
    'Software, Computer Systems and Networks',
    'Data Communication, Security, Interfaces and Control',
    'Data Logging, Databases, Files and Programming',
    'Programming, Algorithms and Systems Development'
];

export const GEOGRAPHY_OUTCOMES = [
    'Basic Techniques and Skills',
    'Natural Resource Studies',
    'Weather and Climate Studies',
    'Landform Studies',
    'Biotic Studies',
    'Agricultural Studies',
    'Industrial Studies',
    'Settlement and Population Studies',
    'Transport and Trade Studies'
];

const withGeography = (subjects: SubjectMeta[], description?: string): SubjectMeta[] =>
    subjects.map(subject =>
        subject.name === 'Geography'
            ? {
                ...subject,
                outcomeCount: GEOGRAPHY_OUTCOMES.length,
                description: description || subject.description,
                outcomes: GEOGRAPHY_OUTCOMES,
            }
            : subject
    );

const withSharedComputerScience = (
    subjects: SubjectMeta[],
    description: string
): SubjectMeta[] =>
    subjects.map(subject =>
        subject.name === 'Computer Studies' || subject.name === 'Computer Science'
            ? {
                ...subject,
                name: 'Computer Science',
                outcomeCount: SHARED_COMPUTER_SCIENCE_OUTCOMES.length,
                description,
                outcomes: SHARED_COMPUTER_SCIENCE_OUTCOMES
            }
            : subject
    );

const FORM4_SUBJECTS: SubjectMeta[] = [...COMMON_SUBJECTS, ...OLEVEL_ADDITIONS].map(subject =>
    subject.name === 'Mathematics'
        ? {
            ...subject,
            outcomeCount: FORM4_MATH_OUTCOMES.length,
            description: 'Form 4 arithmetic, constructions, circle geometry, trigonometry and graphs.',
            outcomes: FORM4_MATH_OUTCOMES
        }
        : subject.name === 'Computer Studies'
        ? {
            name: 'Computer Science',
            outcomeCount: SHARED_COMPUTER_SCIENCE_OUTCOMES.length,
            description: 'Form 4 computing systems, maintenance and real-world applications.',
            outcomes: SHARED_COMPUTER_SCIENCE_OUTCOMES
        }
        : subject.name === 'Principles of Accounting'
        ? {
            ...subject,
            outcomeCount: FORM4_PRINCIPLES_OF_ACCOUNTING_OUTCOMES.length,
            description: 'Form 4 financial accounting, trial balance, ratios, partnerships and company accounts.',
            outcomes: FORM4_PRINCIPLES_OF_ACCOUNTING_OUTCOMES
        }
        : subject
);

export const CURRICULUM_REGISTRY: AcademicLevel[] = [
    {
        id: 'form-1',
        name: 'Form 1',
        category: 'ZJC',
        subjects: withSharedComputerScience(
            FORM1_SUBJECTS,
            'Shared Form 1–4 computing systems, programming, data, networks and applications.'
        )
    },
    {
        id: 'form-2',
        name: 'Form 2',
        category: 'ZJC',
        subjects: withSharedComputerScience(
            withCombinedScience(COMMON_SUBJECTS, 'Form 2 Biology, Chemistry and Physics: variation, nutrition, forces, energy and electricity.'),
            'Shared Form 1–4 computing systems, programming, data, networks and applications.'
        )
    },
    {
        id: 'form-3',
        name: 'Form 3',
        category: "O' Level",
        subjects: withGeography(withSharedComputerScience(
            withCombinedScience([...COMMON_SUBJECTS, ...OLEVEL_ADDITIONS], 'Form 3 Biology, Chemistry and Physics: cells, atomic structure, Newton’s laws, electricity and more.'),
            'Shared Form 1–4 computing systems, programming, data, networks and applications.'
        ), 'Form 3 physical and human environment studies.')
    },
    {
        id: 'form-4',
        name: 'Form 4',
        category: "O' Level",
        subjects: withGeography(withSharedComputerScience(
            withCombinedScience(FORM4_SUBJECTS, 'Form 4 Biology, Chemistry and Physics: ecosystems, reactivity, titration, pressure and mains electricity.'),
            'Shared Form 1–4 computing systems, programming, data, networks and applications.'
        ), 'Form 4 physical and human environment studies.')
    },
    {
        id: 'lower-6',
        name: 'Lower 6',
        category: "A' Level",
        subjects: [
            { name: 'Pure Mathematics', outcomeCount: 15, description: 'Advanced Algebra' },
            { name: 'Physics', outcomeCount: 18, description: 'Quantum Theory' },
            { name: 'Chemistry', outcomeCount: 18, description: 'Organic Chemistry' },
            { name: 'Economics', outcomeCount: 15, description: 'Microeconomics' }
        ]
    },
    {
        id: 'upper-6',
        name: 'Upper 6',
        category: "A' Level",
        subjects: [
            { name: 'Pure Mathematics', outcomeCount: 15, description: 'Advanced Calculus' },
            { name: 'Physics', outcomeCount: 18, description: 'Nuclear Physics' },
            { name: 'Economics', outcomeCount: 15, description: 'Macroeconomics' },
            { name: 'Accounting', outcomeCount: 18, description: 'Corporate Reporting' }
        ]
    },
    {
        id: 'nc-it',
        name: 'NC Information Technology',
        category: 'Polytechnic',
        subjects: [
            { name: 'Computer Systems Maintenance', outcomeCount: 5, studyTime: '45 hrs', description: 'Institutional hardware maintenance, diagnostics and repair protocols.' },
            { name: 'Programming Concepts', outcomeCount: 7, studyTime: '48 hrs', description: 'Fundamental logic, algorithm development and software foundations.' },
            { name: 'Database Concepts', outcomeCount: 8, studyTime: '40 hrs', description: 'Relational database management, SQL scripting and data modeling.' },
            { name: 'Computer Networking', outcomeCount: 5, studyTime: '35 hrs', description: 'Network architecture, LAN/WAN setup and communication protocols.' },
            { name: 'Computer Security', outcomeCount: 3, studyTime: '30 hrs', description: 'Cybersecurity frameworks, threat management and digital protection.' },
            { name: 'Safety, Health, Environment & Quality', outcomeCount: 5, studyTime: '24 hrs', description: 'Professional standards for workplace safety and environmental quality.' },
            { name: 'National & Strategic Studies', outcomeCount: 6, studyTime: '28 hrs', description: 'Civic participation and national strategic development frameworks.' },
            { name: 'Workplace Communication', outcomeCount: 3, studyTime: '20 hrs', description: 'Professional correspondence and institutional interaction skills.' },
            { name: 'Entrepreneurship Skills Development', outcomeCount: 5, studyTime: '40 hrs', description: 'Business startup management and vocational enterprise creation.' }
        ]
    },
    {
        id: 'nd-it',
        name: 'ND Information Technology',
        category: 'Polytechnic',
        subjects: [
            { name: 'Hardware Administration', outcomeCount: 8, studyTime: '40 hrs', description: 'Enterprise hardware lifecycle management and server-side configurations.' },
            { name: 'Network Administration', outcomeCount: 4, studyTime: '25 hrs', description: 'Advanced routing protocols, subnetting and infrastructure security.' },
            { name: 'Software Engineering', outcomeCount: 6, studyTime: '32 hrs', description: 'Software design patterns, SDLC methodologies and documentation.' },
            { name: 'Database Administration', outcomeCount: 6, studyTime: '30 hrs', description: 'DBMS performance optimization, backup recovery and relational modeling.' },
            { name: 'Object Oriented Programming', outcomeCount: 8, studyTime: '50 hrs', description: 'Advanced software construction using classes, objects and abstraction.' },
            { name: 'Web Development', outcomeCount: 8, studyTime: '45 hrs', description: 'Full-stack application development using modern frameworks and APIs.' },
            { name: 'Information Security', outcomeCount: 7, studyTime: '40 hrs', description: 'Encryption, cybersecurity threats and digital risk management.' },
            { name: 'Operating Systems Administration', outcomeCount: 7, studyTime: '30 hrs', description: 'Managing multi-user environments, kernel tuning and shells.' },
            { name: 'Design & Analysis of Algorithms', outcomeCount: 8, studyTime: '42 hrs', description: 'Computational logic, Big O notation and sorting optimizations.' },
            { name: 'Research & Project Management', outcomeCount: 5, studyTime: '30 hrs', description: 'Academic research methods and industrial project lifecycles.' }
        ]
    },
    {
        id: 'nc-auto',
        name: 'NC Auto Electrics',
        category: 'Polytechnic',
        subjects: [
            { name: 'National Studies', outcomeCount: 6, studyTime: '56 hrs', description: 'Civic participation and national strategic development frameworks.' },
            { name: 'Safety, Health, Env & Fitting/Machining', outcomeCount: 4, studyTime: '40 hrs', description: 'Workshop safety, environmental standards and basic machining.' },
            { name: 'Electrical & Electronics Fundamentals', outcomeCount: 3, studyTime: '35 hrs', description: 'Core principles of electricity and electronic components.' },
            { name: 'Automotive Comm & Computer Apps', outcomeCount: 2, studyTime: '12 hrs', description: 'Vehicle communication systems and diagnostic software.' },
            { name: 'Motor Vehicle Systems Minor Service', outcomeCount: 3, studyTime: '25 hrs', description: 'Routine maintenance and minor servicing procedures.' },
            { name: 'Entrepreneurship Skills Development', outcomeCount: 5, studyTime: '30 hrs', description: 'Business startup management and vocational enterprise creation.' },
            { name: 'Wiring Lighting & Auxiliary Systems', outcomeCount: 3, studyTime: '26 hrs', description: 'Vehicle wiring harnesses, lighting arrays and auxiliary circuits.' },
            { name: 'Automotive Eng Maths & Science', outcomeCount: 2, studyTime: '56 hrs', description: 'Engineering mathematics and applied sciences for mechanics.' },
            { name: 'Electronic Fuel Injection Maint.', outcomeCount: 4, studyTime: '37 hrs', description: 'EFI system diagnostics, repair and maintenance protocols.' },
            { name: 'Ignition, Starting & Charging Syst.', outcomeCount: 4, studyTime: '30 hrs', description: 'Starter motors, alternators, and modern ignition systems.' }
        ]
    },
    {
        id: 'records-nc',
        name: 'NC Records Management',
        category: 'Polytechnic',
        subjects: [
            { name: 'Archiving', outcomeCount: 4, studyTime: '23 hrs', description: 'Historical record preservation and archive facility standards.' },
            { name: 'Classification of Records', outcomeCount: 3, studyTime: '21 hrs', description: 'Thematic and categorical indexing for rapid information retrieval.' },
            { name: 'Digital & Conv. Mail Management', outcomeCount: 4, studyTime: '25 hrs', description: 'Handling physical and electronic institutional correspondence.' },
            { name: 'Digital Filing', outcomeCount: 5, studyTime: '30 hrs', description: 'Electronic document management systems (EDMS) and cloud filing.' },
            { name: 'Reception Management', outcomeCount: 3, studyTime: '25 hrs', description: 'Professional office protocols and front-line information services.' },
            { name: 'Records Preservation', outcomeCount: 4, studyTime: '27 hrs', description: 'Environmental monitoring and document restoration techniques.' },
            { name: 'Reprography', outcomeCount: 4, studyTime: '30 hrs', description: 'Photographic and digital duplication of institutional records.' }
        ]
    },
    {
        id: 'records-nd',
        name: 'ND Records & Information Management',
        category: 'Polytechnic',
        subjects: [
            { name: 'Records & Information Management', outcomeCount: 6, studyTime: '35 hrs', description: 'Core principles of managing institutional records and information lifecycles.' },
            { name: 'Preservation Management', outcomeCount: 5, studyTime: '26 hrs', description: 'Strategic oversight of institutional memory and document durability.' },
            { name: 'Database Analysis & Design', outcomeCount: 4, studyTime: '24 hrs', description: 'Relational data modeling for information scientists.' },
            { name: 'Information Literacy', outcomeCount: 5, studyTime: '26 hrs', description: 'Research methodologies and information evaluation protocols.' },
            { name: 'Records Centre Management', outcomeCount: 6, studyTime: '30 hrs', description: 'Operation of high-security record storage and retrieval centers.' },
            { name: 'Reprographics', outcomeCount: 5, studyTime: '26 hrs', description: 'Advanced imaging and mass document replication technologies.' },
            { name: 'Archives Administration', outcomeCount: 6, studyTime: '30 hrs', description: 'Institutional archive management and historical access policy.' },
            { name: 'Indigenous Knowledge Systems Mgmt.', outcomeCount: 5, studyTime: '25 hrs', description: 'Curating and preserving traditional national knowledge assets.' },
            { name: 'Records & Info Services Automation', outcomeCount: 4, studyTime: '25 hrs', description: 'Automating record retrieval and metadata tagging workflows.' },
            { name: 'Research Methods in Info Science', outcomeCount: 5, studyTime: '28 hrs', description: 'Scientific data gathering and analysis for information registry.' }
        ]
    },
    {
        id: 'nc-ps',
        name: 'NC Purchasing & Supply',
        category: 'Polytechnic',
        subjects: [
            { name: 'Computing & Digital Literacy', outcomeCount: 4, studyTime: '50 hrs', description: 'Digital toolsets for supply chain tracking and reporting.' },
            { name: 'International Purchasing Fundamentals', outcomeCount: 6, studyTime: '30 hrs', description: 'Global sourcing protocols and international trade regulations.' },
            { name: 'Logistics Management', outcomeCount: 4, studyTime: '27 hrs', description: 'Inbound and outbound transport coordination for industrial goods.' },
            { name: 'Procurement Practice', outcomeCount: 7, studyTime: '40 hrs', description: 'Operational steps in the purchasing cycle and tendering.' },
            { name: 'Stakeholder Management', outcomeCount: 4, studyTime: '25 hrs', description: 'Managing relationships with suppliers and internal departments.' },
            { name: 'Stores & Warehouse Management', outcomeCount: 7, studyTime: '40 hrs', description: 'Inventory control, stocktaking and storage optimization.' },
            { name: 'Supply Chain Operations', outcomeCount: 4, studyTime: '23 hrs', description: 'Overview of the integrated global supply chain framework.' },
            { name: 'Workplace Communication', outcomeCount: 2, studyTime: '19 hrs', description: 'Commercial interaction and institutional correspondence.' },
            { name: 'National Studies', outcomeCount: 6, studyTime: '30 hrs', description: 'National heritage and strategic civic participation.' },
            { name: 'Entrepreneurial Skills Development', outcomeCount: 5, studyTime: '24 hrs', description: 'Business startup skills in the logistics sector.' }
        ]
    },
    {
        id: 'nd-ps',
        name: 'ND Purchasing & Supply',
        category: 'Polytechnic',
        subjects: [
            { name: 'Industrial & Services Procurement', outcomeCount: 4, studyTime: '25 hrs', description: 'Procurement planning for industrial and service environments.' },
            { name: 'Communication', outcomeCount: 4, studyTime: '25 hrs', description: 'Professional communication for purchasing and supply operations.' },
            { name: 'Principles of Purchasing & Supply', outcomeCount: 8, studyTime: '38 hrs', description: 'Core principles, processes and controls in purchasing and supply.' },
            { name: 'Inventory Management', outcomeCount: 6, studyTime: '26 hrs', description: 'Stock control, inventory records and replenishment decisions.' },
            { name: 'Management of Org. Assets', outcomeCount: 5, studyTime: '25 hrs', description: 'Managing organizational assets across their useful lifecycle.' },
            { name: 'Legal Aspects of Procurement', outcomeCount: 9, studyTime: '45 hrs', description: 'Legal requirements, contracts and compliance in procurement.' },
            { name: 'Logistics & Distribution Mgmt.', outcomeCount: 8, studyTime: '40 hrs', description: 'Movement, storage and distribution coordination for supplied goods.' },
            { name: 'Public Procurement', outcomeCount: 10, studyTime: '50 hrs', description: 'Public sector procurement procedures, accountability and governance.' },
            { name: 'Strategic Procurement', outcomeCount: 4, studyTime: '26 hrs', description: 'Long-term sourcing strategy and supplier relationship planning.' },
            { name: 'Procurement Negotiation', outcomeCount: 7, studyTime: '37 hrs', description: 'Negotiation preparation, bargaining techniques and agreement management.' }
        ]
    },

    {
        id: 'banking-nc',
        name: 'NC Banking and Finance',
        category: 'Polytechnic',
        subjects: [
            { name: 'Money and Banking', outcomeCount: 4, description: 'Money, financial institutions, payment systems and central banking.' },
            { name: 'Introduction to Banking Law', outcomeCount: 5, description: 'Legal principles governing banks, customers, mandates and compliance.' },
            { name: 'Customer Accounts Management', outcomeCount: 5, description: 'Opening, operating and controlling customer bank accounts.' },
            { name: 'Investments Administration', outcomeCount: 4, description: 'Investment instruments, client records, settlement and reporting.' },
            { name: 'Financial Mathematics 1', outcomeCount: 3, description: 'Interest, discounting, annuities and banking calculations.' },
            { name: 'ESD', outcomeCount: 5, description: 'Enterprise skills development for professional and business practice.' },
            { name: 'National Studies', outcomeCount: 6, description: 'Citizenship, heritage, governance and national development.' },
            { name: 'Computing and Digital Literacy', outcomeCount: 4, description: 'PDF-based digital literacy module for workplace and academic tools.' }
        ]
    }
];

export const HIGH_SCHOOL_SUBJECTS = Array.from(new Set(
    CURRICULUM_REGISTRY
        .filter(level => level.category !== 'Polytechnic')
        .flatMap(level => level.subjects.map(subject => subject.name))
));

export const SUBJECTS = Array.from(new Set(CURRICULUM_REGISTRY.flatMap(level => level.subjects.map(s => s.name))));
export const GLOBAL_SEARCH_DB = [
    ...CURRICULUM_REGISTRY.map(level => ({
        id: `level-${level.id}`,
        title: level.name,
        description: `${level.category} Curriculum - ${level.subjects.length} Subjects available.`,
        type: 'Academic Level',
        route: 'courses/detail',
        params: { id: level.name },
        levelName: level.name,
        levelCategory: level.category
    })),
    ...CURRICULUM_REGISTRY.flatMap(level => level.subjects.map(sub => ({
        id: `sub-${level.id}-${sub.name.replace(/\s+/g, '-').toLowerCase()}`,
        title: sub.name,
        description: sub.description || `Study materials for ${sub.name} in ${level.name}.`,
        type: 'Subject',
        route: 'courses/detail',
        params: { id: level.name, subject: sub.name },
        levelName: level.name,
        levelCategory: level.category
    })))
];
