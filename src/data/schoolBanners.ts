const SCHOOL_BANNERS: readonly [string, string][] = [
  ['kushinga phikelela polytechnic', '/images/find-school/kushinga.jpeg'],
  ['kwekwe polytechnic', '/images/find-school/kwekwe-polytechnic.png'],
  ['gweru polytechnic', '/images/find-school/gweru-polytechnic.jpeg'],
  ['mutare polytechnic', '/images/find-school/mutare-polytechnic.jpeg'],
  ['masvingo polytechnic', '/images/find-school/masvingo-polytechnic.jpg'],
  ['harare polytechnic', '/images/find-school/harare-polytechnic.webp'],
  ['bulawayo polytechnic', '/images/find-school/bulawayo-polytechnic.jpeg'],
  ['harare institute of technology', '/images/find-school/harare-institute-of-technology.jpg'],
  ['bondolfi teachers college', '/images/find-school/bondolfi-teachers-college.webp'],
  ['masvingo teachers college', '/images/find-school/masvingo-teachers-college.jpg'],
  ['morgenster teachers college', '/images/find-school/morgenster-teachers-college.jpeg'],
  ['msasa industrial training college', '/images/find-school/msasa-industrial-training-college.jpeg'],
  ['mushagashe vocational training centre', '/images/find-school/mushagashe-vtc.jpeg'],
  ['speciss college (bulawayo', '/images/find-school/speciss-bulawayo.webp'],
  ['trust academy', '/images/find-school/trust-academy.jpeg'],
  ['university of zimbabwe', '/images/find-school/university-of-zimbabwe.jpeg'],
  ['midlands state university', '/images/find-school/midlands-state-university.jpeg'],
  ['africa university', '/images/find-school/africa-university.jpeg'],
  ['chinhoyi university of technology', '/images/find-school/chinhoyi-university-of-technology.jpeg'],
  ['reformed church university', '/images/find-school/reformed-church-university.jpeg'],
  ['national university of science and technology', '/images/find-school/nust.jpg'],
];

export const schoolBannerForName = (name: string): string | undefined => {
  const normalisedName = name.trim().toLocaleLowerCase();
  return SCHOOL_BANNERS.find(([schoolName]) => normalisedName.includes(schoolName))?.[1];
};
