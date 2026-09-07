/** Ask the browser not to evict downloaded lessons and IndexedDB data under storage pressure. */
export const requestPersistentStorage = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;

  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    // Unsupported/private browsing modes still retain the normal best-effort cache.
    return false;
  }
};
