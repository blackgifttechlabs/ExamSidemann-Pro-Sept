const INSTITUTION_LOGOS = [
  { name: 'speciss college', src: '/images/poly-logos/300px-Speciss-college-logo.png' },
  { name: 'churchill school', src: '/images/poly-logos/Churchill_Boys_High_School.jpg' },
  { name: 'belvedere technical teachers college', src: '/images/poly-logos/belveredere.jpeg' },
  { name: 'catholic university of zimbabwe', src: '/images/poly-logos/catholic university.png' },
  { name: 'christian brothers college', src: '/images/poly-logos/cbc-logo.jpg' },
  { name: 'hwange college of education', src: '/images/poly-logos/hwangecol.jpeg' },
  { name: 'masvingo teachers college', src: '/images/poly-logos/masvingoteachers.jpeg' },
  { name: 'morgenster teachers college', src: '/images/poly-logos/morgenstertechechers.jpeg' },
  { name: 'trust academy', src: '/images/poly-logos/trustacademy.jpeg' },
  { name: 'africa university', src: '/images/poly-logos/Africa_University_Logo.jpg' },
  { name: 'falcon college', src: '/images/poly-logos/falcon.jpg' },
  { name: 'kutama college', src: '/images/poly-logos/kutama.jpeg' },
  { name: 'peterhouse', src: '/images/poly-logos/Peterhouse.jpg' },
  { name: 'harare polytechnic', src: '/images/poly-logos/harare-poly.png' },
  { name: 'bulawayo polytechnic', src: '/images/poly-logos/bulawayo-poly.png' },
  { name: 'masvingo polytechnic', src: '/images/poly-logos/masvingo-poly.png' },
  { name: 'mutare polytechnic', src: '/images/poly-logos/mutare-poly.png' },
  { name: 'harare institute of technology', src: '/images/poly-logos/HIT_logo.png' },
  { name: 'prince edward school', src: '/images/poly-logos/Prince_Edward_School_Logo.jpg' },
  { name: 'successvale', src: '/images/poly-logos/successvale-science-college.jpeg' },
  { name: 'bondolfi teachers college', src: '/images/poly-logos/bondolfi-1.webp' },
  { name: 'bindura university of science education', src: '/images/poly-logos/buse.jpg' },
  { name: 'chinhoyi university of technology', src: '/images/poly-logos/cut.jpeg' },
  { name: 'gutu high school', src: '/images/poly-logos/gutu-high.jpg' },
  { name: 'great zimbabwe university', src: '/images/poly-logos/gzu.jpeg' },
  { name: 'msasa industrial training college', src: '/images/poly-logos/msasa.png' },
  { name: 'midlands state university', src: '/images/poly-logos/msu.jpeg' },
  { name: 'mushagashe vocational training centre', src: '/images/poly-logos/mushagashe.jpeg' },
  { name: 'ndarama high school', src: '/images/poly-logos/ndarama.jpg' },
  { name: 'national university of science and technology', src: '/images/poly-logos/nust.png' },
  { name: 'queen elizabeth school', src: '/images/poly-logos/queeneli.jpeg' },
  { name: 'reformed church university', src: '/images/poly-logos/rcu.jpeg' },
  { name: 'st george s college', src: '/images/poly-logos/stgeorges.webp' },
  { name: 'university of zimbabwe', src: '/images/poly-logos/uz_new_logo-1.png' },
  { name: 'victoria high school', src: '/images/poly-logos/victoria-high.jpg' },
  { name: 'oriel girls high school', src: '/images/school-logos/Oriel_Girls.jpg' },
] as const;

const normaliseInstitutionName = (name: string) =>
  name.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ');

export const institutionLogoForName = (institutionName?: string | null): string | null => {
  if (!institutionName) return null;
  const normalised = normaliseInstitutionName(institutionName);
  return INSTITUTION_LOGOS.find(({ name }) => normalised.includes(name))?.src ?? null;
};

// Kept for older callers while the school directory now uses every available
// institution logo, not only polytechnic logos.
export const polytechnicLogoForName = institutionLogoForName;
