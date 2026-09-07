/**
 * Zimbabwe-wide polytechnic programme names compiled from current official
 * institutional catalogues. Individual institutions offer different subsets;
 * this list is for profile selection, not an admissions promise.
 */
export const POLYTECHNIC_COURSE_GROUPS = [
  {
    label: 'Information and communication technology',
    courses: [
      'Information Technology',
      'Computer Systems',
      'Computer Science',
      'Software Engineering',
      'Information Security',
    ],
  },
  {
    label: 'Business and management',
    courses: [
      'Accountancy',
      'Banking and Finance',
      'Business Management',
      'Health Services Management',
      'Human Resources Management',
      'Marketing Management',
      'Payroll Management',
      'Pensions and Investment Management',
      'Purchasing and Supply Management',
      'Transport and Logistics Management',
      'Office Management',
    ],
  },
  {
    label: 'Information sciences',
    courses: [
      'Library and Information Science',
      'Records and Information Management',
      'Health Information Management',
      'Medical Records and Health Information',
    ],
  },
  {
    label: 'Automotive engineering',
    courses: [
      'Automotive Engineering',
      'Motor Vehicle Mechanics',
      'Automobile Electrics and Electronics',
      'Motor Vehicle Body Repairs',
      'Motorcycle Mechanics',
      'Precision Machining',
      'Diesel Plant Fitting',
    ],
  },
  {
    label: 'Mechanical and production engineering',
    courses: [
      'Mechanical Engineering',
      'Draughting and Design Technology',
      'Fabrication Engineering',
      'Machine Shop Engineering',
      'Production Engineering',
      'Plant Engineering',
      'Refrigeration and Air Conditioning',
      'Vehicle Body Building',
      'Millwright Works',
    ],
  },
  {
    label: 'Civil and construction engineering',
    courses: [
      'Architectural Technology',
      'Building Technology',
      'Carpentry and Joinery',
      'Cartography and Geovisualisation',
      'Civil Engineering',
      'Construction Engineering',
      'Construction Technology',
      'Irrigation Engineering',
      'Painting and Decorating',
      'Plumbing and Drain Laying',
      'Quantity Surveying',
      'Survey and Geomatics',
      'Valuation and Estate Management',
      'Wood Technology',
    ],
  },
  {
    label: 'Electrical and electronic engineering',
    courses: [
      'Electrical Power Engineering',
      'Electronic Communication Systems',
      'Instrumentation and Control Systems',
      'Microwave and Radar Systems',
      'Mobile and Satellite Systems',
    ],
  },
  {
    label: 'Applied sciences and technology',
    courses: [
      'Applied Biological Technology',
      'Applied Chemical Technology',
      'Chemical Engineering',
      'Food Science and Technology',
      'Laboratory Technology',
      'Metallurgical Assaying',
      'Polymer Technology',
    ],
  },
  {
    label: 'Creative arts, fashion and media',
    courses: [
      'Applied Art and Design',
      'Beauty Therapy',
      'Design for Print',
      'Fashion, Clothing and Textiles',
      'Fine Art',
      'Graphic Design and Print Origination',
      'Hairdressing',
      'Industrial Clothing Design and Construction',
      'Journalism',
      'Machine Printing',
      'Mass Communication',
      'Packaging Machine Printing',
      'Photography',
      'Print Finishing and Converting',
      'Print Production Technology',
    ],
  },
  {
    label: 'Hospitality and tourism',
    courses: [
      'Baking Technology and Management',
      'Culinary Arts',
      'Professional Cookery',
      'Tourism and Hospitality Management',
    ],
  },
  {
    label: 'Agriculture and mining',
    courses: [
      'Agricultural Engineering',
      'Agriculture',
      'Animal Production',
      'Crop Production',
      'Horticulture',
      'Mine Geology',
      'Mining Engineering',
      'Mining Survey',
      'Mineral Processing and Extractive Metallurgy',
    ],
  },
  {
    label: 'Education and training',
    courses: [
      'Further Education Trainers Diploma',
      'Technical and Vocational Education',
    ],
  },
] as const;

export const POLYTECHNIC_COURSES = POLYTECHNIC_COURSE_GROUPS.flatMap(group => group.courses);
