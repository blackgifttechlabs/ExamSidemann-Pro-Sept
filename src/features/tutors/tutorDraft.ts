export const TUTOR_DRAFT_KEY = 'examsidemann:tutor-listing-draft';
export interface TutorDraft { fullName: string; phone: string; subjects: string[]; teachingMode: string; location: string; savedAt: number }
export function readTutorDraft(): TutorDraft | null {
  try {
    const draft = JSON.parse(sessionStorage.getItem(TUTOR_DRAFT_KEY) || 'null');
    return draft && Date.now() - draft.savedAt < 86_400_000 && typeof draft.fullName === 'string' && Array.isArray(draft.subjects) ? draft : null;
  } catch { return null; }
}
