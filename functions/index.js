const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');

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

/**
 * Scheduled aggregation job running every 5 hours.
 * Summarizes daily activity, regional province counts, and metrics into
 * pre-calculated snapshot records in `analytics_daily_summary`.
 */
exports.scheduledDailyAnalyticsAggregation = onSchedule(
  { schedule: 'every 5 hours', region: 'us-central1' },
  async () => {
    const db = getFirestore();
    const now = new Date();

    // Aggregates active days (today, yesterday) and any un-summarized historical days
    const activeDays = [
      now.toISOString().slice(0, 10),
      new Date(now.getTime() - 86400000).toISOString().slice(0, 10),
    ];

    // Find any missing summary days in the past 90 days
    const recent90Days = [];
    for (let i = 2; i < 90; i++) {
      recent90Days.push(new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10));
    }

    const missingDays = [];
    for (const day of recent90Days) {
      const summaryDoc = await db.collection('analytics_daily_summary').doc(day).get();
      if (!summaryDoc.exists) {
        missingDays.push(day);
      }
    }

    const daysToSummarize = Array.from(new Set([...activeDays, ...missingDays]));

    for (const day of daysToSummarize) {
      try {
        const dailySnap = await db.collection('analytics_daily').doc(day).get();
        if (!dailySnap.exists) continue;

        const dailyData = dailySnap.data() || {};
        const views = Number(dailyData.views || 0);
        const visitors = Number(dailyData.visitors || 0);
        const newVisitors = Number(dailyData.newVisitors || 0);
        const sessions = Number(dailyData.sessions || 0);
        const timeMs = Number(dailyData.timeMs || 0);

        const devices = {
          mobile: Number(dailyData.deviceMobile || 0),
          tablet: Number(dailyData.deviceTablet || 0),
          desktop: Number(dailyData.deviceDesktop || 0),
        };

        const referrers = {
          direct: Number(dailyData.refDirect || 0),
          search: Number(dailyData.refSearch || 0),
          social: Number(dailyData.refSocial || 0),
          other: Number(dailyData.refOther || 0),
        };

        const avgSessionMs = sessions > 0 ? Math.round(timeMs / sessions) : 0;
        const viewsPerSession = sessions > 0 ? Number((views / sessions).toFixed(2)) : 0;

        // Fetch province breakdown for the day
        const visitsSnap = await db
          .collection('analytics_page_visits')
          .where('date', '==', day)
          .limit(2000)
          .get();

        const provincesMap = {};
        visitsSnap.docs.forEach((doc) => {
          const v = doc.data() || {};
          const prov = v.province || 'Unknown';
          if (!provincesMap[prov]) {
            provincesMap[prov] = { views: 0, usersCount: 0, activityCount: 0, users: {} };
          }
          provincesMap[prov].views += 1;
          provincesMap[prov].activityCount += 1;
          const visitorId = v.visitorId || 'anonymous';
          if (visitorId) {
            if (!provincesMap[prov].users[visitorId]) {
              provincesMap[prov].users[visitorId] = { views: 0, lastSeen: v.openedAt || null };
            }
            provincesMap[prov].users[visitorId].views += 1;
          }
        });

        Object.keys(provincesMap).forEach((prov) => {
          provincesMap[prov].usersCount = Object.keys(provincesMap[prov].users).length;
        });

        // Fetch page daily totals for top pages
        const pagesSnap = await db
          .collection('analytics_page_daily')
          .where('date', '==', day)
          .limit(500)
          .get();

        const topPages = pagesSnap.docs
          .map((doc) => {
            const p = doc.data() || {};
            return {
              path: p.path || '',
              title: p.title || '',
              views: Number(p.views || 0),
              visitors: Number(p.visitors || 0),
              timeMs: Number(p.timeMs || 0),
            };
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 50);

        // Fetch geo daily totals
        const geoSnap = await db
          .collection('analytics_geo_daily')
          .where('date', '==', day)
          .limit(100)
          .get();

        const topCountries = geoSnap.docs
          .map((doc) => {
            const g = doc.data() || {};
            return {
              country: g.country || '',
              sessions: Number(g.sessions || 0),
              views: Number(g.views || 0),
            };
          })
          .sort((a, b) => b.sessions - a.sessions);

        // Fetch traffic sources
        const sourceSnap = await db
          .collection('analytics_source_daily')
          .where('date', '==', day)
          .limit(100)
          .get();

        const topSources = sourceSnap.docs
          .map((doc) => {
            const s = doc.data() || {};
            return {
              category: s.category || 'other',
              source: s.source || '',
              sessions: Number(s.sessions || 0),
            };
          })
          .sort((a, b) => b.sessions - a.sessions);

        const summaryDoc = {
          date: day,
          views,
          visitors,
          newVisitors,
          sessions,
          timeMs,
          avgSessionMs,
          viewsPerSession,
          devices,
          referrers,
          provinces: provincesMap,
          topPages,
          topCountries,
          topSources,
          updatedAt: FieldValue.serverTimestamp(),
        };

        await db.collection('analytics_daily_summary').doc(day).set(summaryDoc, { merge: true });
      } catch (err) {
        console.error(`Error aggregating analytics for day ${day}:`, err);
      }
    }
  }
);
