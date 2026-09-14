# Account emails and teacher verification

This app sends email using SMTP. IMAP reads incoming mail and is not needed for these notifications. The supplied Documents/email.html design is preserved in server/email/template.html and populated with sign-in or teacher approval content.

## Gmail app password

1. In the sending Google account, enable **2-Step Verification** under Security.
2. Open https://myaccount.google.com/apppasswords, create an app password named **Exam Sidemann**, and copy the 16-character password. This is different from your normal password or one-time verification PIN.
3. Store it as `SMTP_PASS` on the server. Never put it in a `VITE_` variable or commit it. Gmail app passwords stop working when the Google account password changes. Some managed accounts or Advanced Protection accounts do not support app passwords: https://support.google.com/accounts/answer/185833?hl=en.

## Local configuration

Copy `.env.email.example` values into the ignored root `.env.local` (or `.env`). Use the actual sending address and app password. Restart `npm run dev` after changes. The Vite development server includes the account automation API.

In Firebase project **testing-3d5b2**, open Project settings → Service accounts → Generate new private key. Store the JSON as a single-line `FIREBASE_SERVICE_ACCOUNT_JSON` value, preserving JSON's escaped newlines in `private_key`. For local dotenv files, wrap the JSON in single quotes. The service account is a private server credential, not the public Firebase web config. See https://firebase.google.com/docs/admin/setup.

For managing users from **examsidemann-login-4ec4f**, also set `FIREBASE_SECONDARY_SERVICE_ACCOUNT_JSON` using that project's own service account. Browser authentication and automatic sign-in emails use the primary project.

## Hosting on Vercel

Under Project → Settings → Environment Variables, add each variable from `.env.email.example` for the intended environment. Paste JSON without the surrounding dotenv single quotes. Mark SMTP_PASS, service account JSON, and CRON_SECRET sensitive. Redeploy after saving: changes only apply to a new deployment. See https://vercel.com/docs/environment-variables.

Use Node.js 20 or later. The repository includes the email template in the function bundle. Generate a random CRON_SECRET of at least 32 characters (for example `openssl rand -hex 32`). A daily authenticated Vercel cron retries queued messages and continues pending teacher verification pages; this schedule is compatible with Hobby plans. For a high-volume site, configure a more frequent worker on a supporting hosting plan. See https://vercel.com/docs/cron-jobs/usage-and-pricing.

## Enable and check

Sign in as an administrator and open **Admin → Users → Email settings**:

1. **Check connection** verifies SMTP authentication.
2. **Send test email** sends only to the signed-in administrator. Inspect the supplied design in your inbox and use the preview buttons.
3. Turn on **Automatic email sending**, with sign-in and teacher approval emails enabled.
4. Turn on **Auto-verify teachers**. Pending applications are approved in resumable pages; previously rejected applications are not automatically approved. New teacher applications are checked immediately during signup.

Automatic verification and email sending are separate switches. Both must be enabled to send immediate approval emails. Manual teacher approval also uses the same email flow. Turning email sending off pauses queued delivery; it does not undo verification. Already approved accounts do not receive a retroactive approval email merely because sending is later enabled.

Sign-in emails use verified authentication timestamps and canonical account addresses. Refreshing the page or refreshing an auth token does not create another email; rapid repeated sign-ins are limited to one email per minute. Delivery failure does not prevent login or undo approval. Failures retry up to five times, with sanitized errors in the delivery log. Use Retry queued emails or an individual Retry after correcting configuration. SMTP cannot guarantee exactly-once delivery if a process stops after the mail server accepts a message but before its success is saved.

The service account and SMTP credentials are required before live integration can work. No real messages are sent by the automated tests.

## Tutor invitation

After two minutes of visible browsing, a small card slides in at the bottom right. It waits while another modal is open and is hidden on login, teacher signup, and admin routes, and for existing teachers. Maybe Later dismisses it for the browser session. The form carries name, phone, selected subjects, teaching mode, and location into teacher signup using session storage; it does not publish a listing before the teacher completes their profile. Signed-in users can apply using their existing account.
