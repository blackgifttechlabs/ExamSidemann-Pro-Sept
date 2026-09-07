export type LocalSchoolFees = {
  amount: number;
  currency: string;
  period: string;
};

/**
 * The live collection contains both the current structured fee object and
 * legacy free-text fee descriptions. Keep both so the local export is lossless.
 */
export type LocalSchoolRecord = {
  id: string;
  name: string;
  type: string;
  province?: string;
  district?: string;
  location?: string;
  address?: string;
  motto?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  rating?: number;
  ratingsCount?: number;
  curriculums?: string[];
  isBoarding?: boolean;
  isDay?: boolean;
  hasResidence?: boolean;
  allowEdits?: boolean;
  verified?: boolean;
  dataSource?: string;
  sources?: string[];
  coordinates?: { lat: number; lng: number };
  fees?: LocalSchoolFees | string;
  feesEstimated?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
