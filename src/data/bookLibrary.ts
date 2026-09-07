import catalogue from './bookLibrary.json';

/**
 * The books that ship with the app.
 *
 * This catalogue supplies the titles and academic metadata. The Book Library
 * resolves its legacy public paths through `public/qpandbooks.json`, whose
 * Drive URLs now hold both the PDFs and their covers. Firestore resources are
 * still shown alongside this bundled catalogue.
 *
 * The list itself is generated into `bookLibrary.json` from the catalogue in
 * `scripts/seedBookLibrary.mjs`, which is also what measures each file's size.
 */

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  course: string;
  subject: string;
  /** Catalogue path used to find the file in qpandbooks.json. */
  url: string;
  coverUrl: string;
  size: string;
  sourceUrl: string;
  rightsHolder: string;
  rightsBasis: string;
}

export interface LibraryCourse {
  name: string;
  category: string;
}

/**
 * Levels these books need that the curriculum registry does not carry — the
 * primary grades. Without them the primary titles would be saved against a
 * level the sidebar never offers, and so would never be reachable.
 */
export const BOOK_LIBRARY_COURSES: LibraryCourse[] = catalogue.courses;

export const BOOK_LIBRARY: LibraryBook[] = catalogue.books;

/** The books for one level, in catalogue order. */
export const booksForCourse = (course: string) =>
  BOOK_LIBRARY.filter((book) => book.course === course);
