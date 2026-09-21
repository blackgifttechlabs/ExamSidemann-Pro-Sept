import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import seoPages from '../data/seoPages.json';
import { SeoHead } from './SeoHead';
import {
  findLearningCourse,
  findLearningOutcomeRoute,
  findLearningSubjectRoute,
  getIndexableSubjects,
  getOutcomeLabels,
  isLearningOutcomeRouteIndexable,
  isLearningSubjectRouteIndexable,
} from '../utils/learningOutcomeSeo';
import { experimentForPath } from '../data/experimentRegistry';
import { schoolForId, schoolForSlug, schoolSlugForName, schoolsForType } from '../data/schoolRegistry';
import { districtForSlug, labelForType, provinceForSlug } from '../data/zimGeo';
import { institutionLogoForName } from '../data/polytechnicLogos';
import {
  courseSeoFor,
  experimentSeoFor,
  outcomeSeoFor,
  subjectSeoFor,
} from '../data/seoKeywords';
import { canonicalUrlFor, SITE_ORIGIN } from '../utils/siteUrl';
import practicalTopicSeo from '../data/practicalTopicSeo.json';

const SITE_URL = SITE_ORIGIN;
const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex, nofollow, noarchive';

type SeoPage = {
  path: string;
  title: string;
  description: string;
  heading: string;
  schemaType: string;
};

type PracticalTopicSeo = {
  legacyPath: string;
  path: string;
  subjectPath: string;
  subject: string;
  title: string;
  description: string;
  level: string;
};

const pages = seoPages as SeoPage[];

const normalizePath = (path: string) => {
  if (path === '/') return '/';
  return `/${path.split('/').filter(Boolean).join('/')}`;
};

const canonicalFor = (path: string) => {
  const parts = path.split('/').filter(Boolean);
  const outcome = parts[0] === 'courses' && parts[3] === 'outcomes'
    ? findLearningOutcomeRoute(parts[1], parts[2], parts[4])
    : null;
  return canonicalUrlFor(outcome?.outcomePath || path);
};

const titleFromSlug = (slug: string) => slug
  .split('-')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const schoolSchemaType = (type: string) => {
  if (type === 'primary' || type === 'high') return 'School';
  if (type === 'poly' || type === 'college' || type === 'university') return 'CollegeOrUniversity';
  return 'EducationalOrganization';
};

const isPublishedValue = (value?: string) =>
  !!value?.trim() && !/^(n\/a|none|not (available|found|published)|unknown)$/i.test(value.trim());

const PRIVATE_PREFIXES = [
  '/admin',
  '/chat',
  '/classroom',
  '/communities',
  '/dashboard',
  '/messages',
  '/my-profile',
  '/payment',
  '/profile',
  '/saved-resources',
  '/settings',
  '/sql-practice',
  '/studio',
  '/practicals/tools',
  '/practicals/polytechnic/under-construction',
];

const PLACEHOLDER_PATHS = new Set([
  '/premium',
  '/payment',
  '/practicals/polytechnic/under-construction',
  '/practicals/olevel/computer-science',
  '/practicals/olevel/food-technology',
  '/practicals/alevel/computer-science',
]);

export const RouteSeo: React.FC = () => {
  const location = useLocation();
  const path = normalizePath(location.pathname);
  const pathParts = path.split('/').filter(Boolean);
  const school = pathParts[0] === 'schools' && pathParts[1] === 'profile' && pathParts[2]
    ? schoolForId(pathParts[2])
    : pathParts.length === 1
      ? schoolForSlug(pathParts[0])
      : undefined;
  const schoolCategoryType =
    pathParts[0] === 'schools' && pathParts[1] === 'search' && pathParts[2]
      ? pathParts[2]
      : undefined;
  const schoolProvince = schoolCategoryType ? provinceForSlug(pathParts[3]) : undefined;
  const schoolDistrict = schoolProvince ? districtForSlug(schoolProvince, pathParts[4]) : undefined;
  const categorySchools = schoolCategoryType
    ? schoolsForType(schoolCategoryType, schoolProvince).filter((candidate) => (
        !schoolDistrict ||
        candidate.district?.toLowerCase() === schoolDistrict.toLowerCase() ||
        candidate.location?.toLowerCase().includes(schoolDistrict.toLowerCase())
      ))
    : [];
  const experiment = experimentForPath(path);
  const catalogPractical = (practicalTopicSeo as PracticalTopicSeo[])
    .find((topic) => normalizePath(topic.path) === path);

  const metadata = useMemo(() => {
    if (PLACEHOLDER_PATHS.has(path)) {
      return {
        title: 'Learning Resource Coming Soon | Exam Sidemann',
        description: 'This learning resource is not yet available.',
        heading: 'Learning Resource Coming Soon',
        schemaType: 'WebPage',
        robots: NOINDEX_ROBOTS,
      };
    }

    const exactPage = pages.find((page) => page.path === path);
    if (exactPage) {
      return { ...exactPage, robots: INDEX_ROBOTS };
    }

    if (
      pathParts[0] === 'courses' &&
      pathParts[3] === 'outcomes' &&
      pathParts.length === 5
    ) {
      const learningOutcome = findLearningOutcomeRoute(
        pathParts[1],
        pathParts[2],
        pathParts[4],
      );
      if (learningOutcome) {
        const { course, subject, outcomeLabel, outcomeNumber } = learningOutcome;
        return {
          ...outcomeSeoFor({
            courseName: course.name,
            category: course.category,
            subjectName: subject.name,
            subjectDescription: subject.description,
            outcomeCount: subject.outcomeCount,
            outcomeNumber,
            outcomeLabel,
            siblingLabels: getOutcomeLabels(course, subject),
          }),
          schemaType: 'LearningResource',
          robots: isLearningOutcomeRouteIndexable(learningOutcome)
            ? INDEX_ROBOTS
            : NOINDEX_ROBOTS,
        };
      }
    }

    if (pathParts[0] === 'courses' && pathParts.length === 3) {
      const learningSubject = findLearningSubjectRoute(
        pathParts[1],
        pathParts[2],
      );
      if (learningSubject) {
        const { course, subject } = learningSubject;
        return {
          ...subjectSeoFor({
            courseName: course.name,
            category: course.category,
            subjectName: subject.name,
            subjectDescription: subject.description,
            outcomeCount: subject.outcomeCount,
          }),
          schemaType: 'CollectionPage',
          robots: isLearningSubjectRouteIndexable(learningSubject)
            ? INDEX_ROBOTS
            : NOINDEX_ROBOTS,
        };
      }
    }

    if (pathParts[0] === 'courses' && pathParts.length === 2) {
      const learningCourse = findLearningCourse(pathParts[1]);
      if (learningCourse) {
        return {
          ...courseSeoFor({
            courseName: learningCourse.name,
            category: learningCourse.category,
            subjectCount: getIndexableSubjects(learningCourse).length,
          }),
          schemaType: 'CollectionPage',
          robots: getIndexableSubjects(learningCourse).length
            ? INDEX_ROBOTS
            : NOINDEX_ROBOTS,
        };
      }
    }

    if (school) {
      const typeLabel = labelForType(school.type);
      const place = [school.district, school.province].filter(Boolean).join(', ');
      const logo = institutionLogoForName(school.name);
      return {
        title: `${school.name}${logo ? ' Logo &' : ' –'} School Information${place ? `, ${place}` : ''} | Exam Sidemann`,
        description: school.description?.trim() ||
          `${school.name} is a ${typeLabel.toLowerCase()} in ${place || 'Zimbabwe'}. Find its location, contact details${logo ? ', school logo' : ''}, curriculum and profile information.`,
        heading: school.name,
        schemaType: schoolSchemaType(school.type),
        robots: INDEX_ROBOTS,
      };
    }

    if (schoolCategoryType && categorySchools.length) {
      const typeLabel = labelForType(schoolCategoryType);
      const place = schoolDistrict || schoolProvince || 'Zimbabwe';
      return {
        title: `${typeLabel} in ${place} | Find and Compare Schools`,
        description: `Find and compare ${categorySchools.length.toLocaleString()} ${typeLabel.toLowerCase()} in ${place}, Zimbabwe. Browse verified locations, contacts, curricula, boarding or day options, fees and school profiles.`,
        heading: `${typeLabel} in ${place}`,
        schemaType: 'CollectionPage',
        robots: INDEX_ROBOTS,
      };
    }

    if (experiment) {
      return {
        ...experimentSeoFor({
          title: experiment.title,
          subjectName: experiment.subject,
          level: experiment.level,
          description: experiment.description,
          resourceType: experiment.resourceType || 'Interactive experiment',
        }),
        schemaType: 'LearningResource',
        robots: INDEX_ROBOTS,
      };
    }

    if (catalogPractical) {
      return {
        title: `${catalogPractical.title} – ${catalogPractical.level} ${catalogPractical.subject} Practical | Exam Sidemann`,
        description: `${catalogPractical.description} Learn ${catalogPractical.title.toLowerCase()} step by step in an interactive ${catalogPractical.level} ${catalogPractical.subject.toLowerCase()} lesson.`,
        heading: catalogPractical.title,
        schemaType: 'LearningResource',
        robots: INDEX_ROBOTS,
      };
    }

    if (PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      return {
        title: 'Private Learning Area | Exam Sidemann',
        description: 'Sign in to access this private Exam Sidemann learning area.',
        heading: 'Private Learning Area',
        schemaType: 'WebPage',
        robots: NOINDEX_ROBOTS,
      };
    }

    if (path.startsWith('/practicals/')) {
      const topic = titleFromSlug(path.split('/').filter(Boolean).at(-1) || 'Practical');
      return {
        title: `${topic} Interactive Practical | Exam Sidemann`,
        description: `Explore the ${topic} interactive practical with guided learning, observations, and experiment activities on Exam Sidemann.`,
        heading: `${topic} Interactive Practical`,
        schemaType: 'LearningResource',
        robots: INDEX_ROBOTS,
      };
    }

    if (path.startsWith('/news/article/')) {
      return {
        title: 'Zimbabwe Education News Article | Exam Sidemann',
        description: 'Read education news, examination updates, and learning opportunities for students in Zimbabwe.',
        heading: 'Zimbabwe Education News',
        schemaType: 'Article',
        robots: NOINDEX_ROBOTS,
      };
    }

    if (path.startsWith('/courses/detail/')) {
      return {
        title: 'Online Course Learning Module | Exam Sidemann',
        description: 'Study a curriculum-aligned online course module with notes and interactive learning activities on Exam Sidemann.',
        heading: 'Online Course Learning Module',
        schemaType: 'LearningResource',
        robots: NOINDEX_ROBOTS,
      };
    }

    return {
      title: 'Learning Resource | Exam Sidemann',
      description: 'Explore curriculum-aligned learning resources for students in Zimbabwe on Exam Sidemann.',
      heading: 'Exam Sidemann Learning Resource',
      schemaType: 'WebPage',
      robots: NOINDEX_ROBOTS,
    };
  }, [catalogPractical, categorySchools.length, experiment, path, school, schoolCategoryType, schoolDistrict, schoolProvince]);

  const structuredData = useMemo(() => {
    const canonical = canonicalFor(path);
    if (metadata.robots.startsWith('noindex')) return undefined;
    const learningOutcome = pathParts[3] === 'outcomes'
      ? findLearningOutcomeRoute(pathParts[1], pathParts[2], pathParts[4])
      : null;
    const learningSubject = pathParts[0] === 'courses' && pathParts.length >= 3
      ? findLearningSubjectRoute(pathParts[1], pathParts[2])
      : null;
    const learningCourse = pathParts[0] === 'courses' && pathParts.length >= 2
      ? findLearningCourse(pathParts[1])
      : null;

    if (path === '/') {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: 'Exam Sidemann',
            alternateName: [
              'ExamSidemann',
              'Exam Sideman',
              'Exams Sideman',
              'Exams Sidemann',
              'Exam Side Man',
              'Examsideman',
              'Examsidemn',
              'Exam Sidman',
              'Exam Sidemen',
              'Sideman Exams',
              'Sidemann Exams',
              'Sideman',
              'Sidemann',
              'examsidemann.com',
            ],
            description: metadata.description,
            inLanguage: 'en-ZW',
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
          {
            '@type': 'EducationalOrganization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Exam Sidemann',
            url: `${SITE_URL}/`,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/app-icon-512.png`,
              width: 512,
              height: 512,
            },
            image: `${SITE_URL}/exam-sidemann-social-preview.png`,
            areaServed: {
              '@type': 'Country',
              name: 'Zimbabwe',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Masvingo',
              addressCountry: 'ZW',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+263-78-245-6936',
              contactType: 'customer support',
              areaServed: 'ZW',
              availableLanguage: 'English',
            },
          },
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/#webpage`,
            url: `${SITE_URL}/`,
            name: metadata.heading,
            description: metadata.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en-ZW',
          },
        ],
      };
    }

    if (school) {
      const logo = institutionLogoForName(school.name);
      const schoolImage = logo || (isPublishedValue(school.image) ? school.image : undefined);
      const absoluteSchoolImage = schoolImage
        ? (schoolImage.startsWith('http') ? schoolImage : `${SITE_URL}${schoolImage.startsWith('/') ? '' : '/'}${schoolImage}`)
        : undefined;
      const address = {
        '@type': 'PostalAddress',
        ...(isPublishedValue(school.address || school.location)
          ? { streetAddress: school.address || school.location }
          : {}),
        ...(school.district ? { addressLocality: school.district } : {}),
        ...(school.province ? { addressRegion: school.province } : {}),
        addressCountry: 'ZW',
      };
      const hasCoordinates =
        Number.isFinite(school.coordinates?.lat) &&
        Number.isFinite(school.coordinates?.lng);

      return [
        {
          '@context': 'https://schema.org',
          '@type': schoolSchemaType(school.type),
          '@id': `${canonical}#school`,
          name: school.name,
          description: metadata.description,
          url: canonical,
          address,
          ...(hasCoordinates
            ? {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: school.coordinates?.lat,
                  longitude: school.coordinates?.lng,
                },
              }
            : {}),
          ...(isPublishedValue(school.phone) ? { telephone: school.phone } : {}),
          ...(isPublishedValue(school.email) ? { email: school.email } : {}),
          ...(isPublishedValue(school.website)
            ? {
                sameAs: [
                  school.website!.startsWith('http')
                    ? school.website
                    : `https://${school.website}`,
                ],
              }
            : {}),
          ...(absoluteSchoolImage ? { image: absoluteSchoolImage } : {}),
          ...(logo && absoluteSchoolImage ? { logo: absoluteSchoolImage } : {}),
          areaServed: {
            '@type': 'Country',
            name: 'Zimbabwe',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            {
              '@type': 'ListItem',
              position: 2,
              name: labelForType(school.type),
              item: `${SITE_URL}/schools/search/${school.type}/`,
            },
            { '@type': 'ListItem', position: 3, name: school.name, item: canonical },
          ],
        },
      ];
    }

    if (schoolCategoryType && categorySchools.length) {
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: metadata.heading,
          description: metadata.description,
          url: canonical,
          numberOfItems: categorySchools.length,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: categorySchools.length,
            itemListElement: categorySchools.slice(0, 100).map((categorySchool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: categorySchool.name,
              url: `${SITE_URL}/${schoolSlugForName(categorySchool.name)}/`,
            })),
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: metadata.heading, item: canonical },
          ],
        },
      ];
    }

    if (experiment) {
      const subjectPath = `/practicals/olevel/${experiment.subject.toLowerCase().replace(/\s+/g, '-')}/`;
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: experiment.title,
          description: experiment.description,
          url: canonical,
          learningResourceType: experiment.resourceType || 'Interactive experiment',
          educationalLevel: experiment.level,
          teaches: experiment.title,
          isPartOf: {
            '@type': 'Course',
            name: `${experiment.level} ${experiment.subject}`,
            url: `${SITE_URL}${subjectPath}`,
          },
          provider: { '@id': `${SITE_URL}/#organization` },
          inLanguage: 'en-ZW',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Practical Labs', item: `${SITE_URL}/practicals/` },
            { '@type': 'ListItem', position: 2, name: experiment.level, item: `${SITE_URL}/practicals/olevel/` },
            { '@type': 'ListItem', position: 3, name: experiment.subject, item: `${SITE_URL}${subjectPath}` },
            { '@type': 'ListItem', position: 4, name: experiment.title, item: canonical },
          ],
        },
      ];
    }

    if (catalogPractical) {
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: catalogPractical.title,
          description: metadata.description,
          url: canonical,
          learningResourceType: 'Interactive practical',
          educationalLevel: catalogPractical.level,
          teaches: catalogPractical.title,
          isPartOf: {
            '@type': 'Course',
            name: `${catalogPractical.level} ${catalogPractical.subject}`,
            url: `${SITE_URL}${catalogPractical.subjectPath}/`,
          },
          provider: { '@id': `${SITE_URL}/#organization` },
          inLanguage: 'en-ZW',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Practical Labs', item: `${SITE_URL}/practicals/` },
            { '@type': 'ListItem', position: 2, name: catalogPractical.level, item: `${SITE_URL}/practicals/polytechnic/` },
            { '@type': 'ListItem', position: 3, name: catalogPractical.subject, item: `${SITE_URL}${catalogPractical.subjectPath}/` },
            { '@type': 'ListItem', position: 4, name: catalogPractical.title, item: canonical },
          ],
        },
      ];
    }

    const breadcrumbItems = learningCourse
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Courses',
            item: `${SITE_URL}/courses/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: learningCourse.name,
            item: `${SITE_URL}/courses/${learningCourse.id}/`,
          },
          ...(learningSubject
            ? [{
                '@type': 'ListItem',
                position: 3,
                name: learningSubject.subject.name,
                item: `${SITE_URL}${learningSubject.subjectPath}/`,
              }]
            : []),
          ...(learningOutcome
            ? [{
                '@type': 'ListItem',
                position: 4,
                name: learningOutcome.outcomeLabel,
                item: canonical,
              }]
            : []),
        ]
      : [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: metadata.heading,
            item: canonical,
          },
        ];

    return [
      {
        '@context': 'https://schema.org',
        '@type': metadata.schemaType,
        name: metadata.heading,
        description: metadata.description,
        url: canonical,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        provider: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-ZW',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ];
  }, [catalogPractical, categorySchools.length, experiment, metadata, path, pathParts, school, schoolCategoryType, schoolDistrict, schoolProvince]);

  if (path.startsWith('/past-papers')) {
    return null;
  }

  return (
    <SeoHead
      title={metadata.title}
      description={metadata.description}
      canonical={canonicalFor(path)}
      robots={metadata.robots}
      type={metadata.schemaType === 'Article' ? 'article' : 'website'}
      structuredData={structuredData}
    />
  );
};
