import resources from './importedResources.json';

/** Verified Drive uploads, kept separate from the generated legacy catalogues. */
export interface ImportedResource {
  id: string;
  title: string;
  type: 'library' | 'past-papers' | 'syllabi';
  course: string;
  category: string;
  subject: string;
  board: string;
  year: string;
  paperType: string;
  url: string;
  fileId: string;
  coverUrl: string;
  size: string;
  author: string;
}

export const IMPORTED_RESOURCES = resources as ImportedResource[];
export const IMPORTED_SYLLABI = IMPORTED_RESOURCES.filter((item) => item.type === 'syllabi');
