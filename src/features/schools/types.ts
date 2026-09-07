import type {
  LocalSchoolFees,
  LocalSchoolRecord,
} from '../../data/schoolRegistry/types';

export type SchoolFees = LocalSchoolFees;
export type SchoolRecord = LocalSchoolRecord;

// The subset a member of the public may propose changes to. Ratings, images
// and verification status stay admin-only.
export const EDITABLE_FIELDS = [
  'name',
  'motto',
  'phone',
  'email',
  'website',
  'address',
  'location',
  'district',
  'province',
  'curriculums',
  'fees',
  'isBoarding',
  'isDay',
  'hasResidence',
  'description',
] as const;

export type EditableField = (typeof EDITABLE_FIELDS)[number];

export type EditSuggestion = {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolType: string;
  province?: string;
  proposed: Partial<SchoolRecord>;
  changes: Record<string, { from: unknown; to: unknown }>;
  note?: string;
  submittedBy: { uid: string; name: string; email: string };
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  reviewedAt?: any;
  reviewedBy?: string;
};

export const CURRICULUM_OPTIONS = ['ZIMSEC', 'HEXCO', 'Cambridge', 'ZIMCHE', 'IB', 'Montessori'];

export const feeAmount = (fees?: SchoolFees | string): number => {
  if (!fees || typeof fees === 'string') return 0;
  return Number(fees.amount) || 0;
};

export const formatFees = (fees?: SchoolFees | string, estimated?: boolean) => {
  if (!fees) return 'Not published';
  if (typeof fees === 'string') return fees;
  if (!fees.amount) return 'Not published';
  const amount = `${fees.currency || 'USD'} ${Number(fees.amount).toLocaleString()} / ${fees.period || 'Term'}`;
  return estimated ? `~${amount}` : amount;
};
