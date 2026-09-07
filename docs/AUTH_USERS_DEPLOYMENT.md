# Firebase Authentication user directory

The Admin → Users screen merges Firestore profiles with every account returned
by Firebase Authentication from `testing-3d5b2` and
`examsidemann-login-4ec4f`. Auth account listing is deliberately server-side;
the Firebase browser SDK cannot and must not receive service-account access.

## Deploy

1. The initial administrator UID is restricted server-side; future
   administrators should receive an `admin: true` Firebase Auth custom claim.
2. From the repository root, run `firebase deploy --only functions:listAuthUsers`.
3. Grant the deployed function's runtime service account the
   `Firebase Authentication Viewer` role on `examsidemann-login-4ec4f`.
4. Sign out and back in once after adding any new custom claim so the ID token refreshes.

The callable function rejects unsigned users and anyone without the custom
claim. It paginates through Auth, so the table is not limited to 1,000 users.
The secondary project uses cross-project IAM and Application Default
Credentials; no service-account JSON is included in the web app or repository.
