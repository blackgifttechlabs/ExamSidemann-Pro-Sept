export const slugifyPracticalTopic = (value: string) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const practicalTopicPath = (basePath: string, title: string) =>
  `${basePath.replace(/\/+$/, '')}/${slugifyPracticalTopic(title)}`;

/**
 * Drawing subjects expose topic routes beneath their category and use the
 * topic title as the canonical slug. Polytechnic IT entries, on the other
 * hand, point at shared tools such as /practicals/tools/webdev and must keep
 * those explicit routes.
 */
export const polytechnicPracticalPath = (
  categoryRoute: string,
  experimentRoute: string,
  title: string,
) => {
  const normalizedCategoryRoute = categoryRoute.replace(/\/+$/, '');
  const normalizedExperimentRoute = experimentRoute.replace(/\/+$/, '');

  return normalizedExperimentRoute.startsWith(`${normalizedCategoryRoute}/`)
    ? practicalTopicPath(normalizedCategoryRoute, title)
    : experimentRoute;
};
