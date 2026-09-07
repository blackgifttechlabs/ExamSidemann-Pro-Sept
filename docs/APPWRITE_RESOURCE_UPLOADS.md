# Appwrite setup for Admin Resources

The Admin Resources screen uploads through authenticated Vercel Functions. Appwrite stores each file, while Firestore stores its title, subject, public URL, and Appwrite file ID. No Firebase paid Functions plan is required for resource uploads.

## 1. Appwrite bucket

In the **ExamSidemann** Appwrite project (`6a9046a9002f5c0d4086`), open **Storage** and create this bucket:

- Name: `Academic Resources`
- Bucket ID: `academic-resources`
- Enabled: on
- File security: on
- Maximum file size: `100 MB`
- Allowed extensions: `pdf`, `doc`, `docx`, `epub`, `ppt`, `pptx`, `xls`, `xlsx`, `txt`, `zip`

Under **Settings > Permissions**, do not grant public create, update, or delete permissions. The server API key performs those operations. The upload function grants public read access to each completed file.

## 2. Appwrite API key

Under **Overview > Integration > API keys**, create a key with only the `files.write` scope. If a key has ever been pasted into chat, source code, or another public location, revoke it and create a replacement.

## 3. Vercel variables

Under **Vercel project > Settings > Environment Variables**, configure Production (and Preview if uploads should work on preview deployments):

```dotenv
APPWRITE_API_KEY=<your private replacement key>
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=6a9046a9002f5c0d4086
VITE_APPWRITE_PROJECT_NAME=ExamSidemann
```

`APPWRITE_API_KEY` must never have a `VITE_` prefix. Vite variables are compiled into public browser code; the unprefixed key is available only to the Vercel upload and delete functions.

The backend defaults to bucket ID `academic-resources`. If a different ID was used, add an unprefixed `APPWRITE_BUCKET_ID` variable containing that exact bucket ID.

## 4. Deploy

Click **Redeploy** in Vercel after saving the variables. Deploy the updated repository normally. Vercel will create:

- `POST /api/admin-resources/upload`
- `POST /api/admin-resources/delete`
- `POST /api/admin-resources/analyze`

These endpoints validate the signed-in Firebase administrator before using the Appwrite key. Uploads use 2 MB browser chunks so the encoded request remains comfortably under Vercel's 4.5 MB function payload limit.

The analysis endpoint reuses the app's existing Groq configuration. When an administrator selects a file, it examines the filename and any text that can be extracted from PDF, DOCX, or TXT content, then suggests the resource type, title, level/course, subject, year, and examination session. Suggestions remain editable and a failed analysis never prevents a manual upload.

The rights-review form has been removed. Administrator saves now publish resources directly, so deploy the accompanying public-read Firestore rule once:

```bash
firebase deploy --only firestore:rules
```

Deploying Firestore rules does not require deploying Cloud Functions.

## 5. Test

1. Sign in with the administrator account and open **Admin > Resources**.
2. Select a permitted file, wait for AI prefill, review the suggested details, and save.
3. Confirm progress reaches 100% and the resource appears in Appwrite **Storage > Academic Resources**.
4. Confirm its `global_resources` Firestore document has `approved: true`, `storageProvider: "appwrite"`, and a `storageFileId`.
5. Open it from the learner-facing page in a private browser window.
6. Delete a disposable resource and confirm its Firestore record and Appwrite file are both removed.

If `/api/admin-resources/upload/` returns HTTP 405, the request is reaching the
SPA fallback instead of a function. Pull the latest dedicated `upload`,
`delete`, and `analyze` API entries and redeploy the project.
