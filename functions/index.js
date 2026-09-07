const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

const PRIMARY_PROJECT_ID = 'testing-3d5b2';
const SECONDARY_PROJECT_ID = 'examsidemann-login-4ec4f';
const ADMIN_UIDS = new Set(['lGSiV47o0lRRHiczIhUZR7VRhbb2', 'TrBcEGUjx4huoLVm0cc6iBiw2ak2']);

const primaryApp = initializeApp();
const secondaryApp = initializeApp({
  credential: applicationDefault(),
  projectId: SECONDARY_PROJECT_ID,
}, 'examsidemann-login');

const authForProject = (projectId) => {
  if (projectId === PRIMARY_PROJECT_ID) return getAuth(primaryApp);
  if (projectId === SECONDARY_PROJECT_ID) return getAuth(secondaryApp);
  throw new HttpsError('invalid-argument', 'Unknown Firebase Authentication project.');
};

const safeDate = (value) => value || null;

const assertAdmin = (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in before using administrator storage.');
  }
  if (request.auth.token.admin !== true && !ADMIN_UIDS.has(request.auth.uid)) {
    throw new HttpsError('permission-denied', 'Administrator access is required.');
  }
};

/**
 * Return one Firebase Authentication page to a verified administrator.
 * The browser repeatedly requests pages until nextPageToken is empty, which
 * supports projects with more than Auth's 1,000-user per-request maximum.
 */
exports.listAuthUsers = onCall({ region: 'us-central1' }, async (request) => {
  assertAdmin(request);

  const projectId = typeof request.data?.projectId === 'string'
    ? request.data.projectId
    : PRIMARY_PROJECT_ID;

  const requestedSize = Number(request.data?.pageSize);
  const pageSize = Number.isFinite(requestedSize)
    ? Math.min(1000, Math.max(1, Math.trunc(requestedSize)))
    : 500;
  const pageToken = typeof request.data?.pageToken === 'string' && request.data.pageToken
    ? request.data.pageToken
    : undefined;

  const page = await authForProject(projectId).listUsers(pageSize, pageToken);
  return {
    users: page.users.map((user) => ({
      projectId,
      uid: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
      disabled: user.disabled,
      providers: user.providerData.map((provider) => provider.providerId),
      creationTime: safeDate(user.metadata.creationTime),
      lastSignInTime: safeDate(user.metadata.lastSignInTime),
    })),
    nextPageToken: page.pageToken || null,
  };
});
