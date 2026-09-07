import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const FEATURE_FLAGS_DOCUMENT = 'feature_flags';

export interface FeatureFlags {
  /** Require an account before any page under /ecd can be opened. */
  ecdLoginWallEnabled: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // This matches the existing /ecd entry behavior until an admin changes it.
  ecdLoginWallEnabled: true,
};

const featureFlagsFrom = (data?: Record<string, unknown>): FeatureFlags => ({
  ecdLoginWallEnabled: typeof data?.ecdLoginWallEnabled === 'boolean'
    ? data.ecdLoginWallEnabled
    : DEFAULT_FEATURE_FLAGS.ecdLoginWallEnabled,
});

/** Live public feature flags. Firestore failures fall back to the safe defaults. */
export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(
    doc(db, 'config', FEATURE_FLAGS_DOCUMENT),
    (snapshot) => {
      setFlags(featureFlagsFrom(snapshot.exists() ? snapshot.data() : undefined));
      setError(null);
      setLoading(false);
    },
    (snapshotError) => {
      console.error('Could not load feature flags', snapshotError);
      setFlags(DEFAULT_FEATURE_FLAGS);
      setError('Could not load the saved configuration. Safe defaults are active.');
      setLoading(false);
    },
  ), []);

  return { flags, loading, error };
};
