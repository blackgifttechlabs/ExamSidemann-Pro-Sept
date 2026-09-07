# Student directory — ranking, classmates and the public profile

The student dashboard shows a global ranking and a "students like me" list. Both
read a collection called `public_profiles`, and there is a reason they do not
read `/users`.

---

## 1. Why a second collection

`/users` holds email addresses, quiz history, friend lists and parent links. The
rules therefore allow `list` on it only for an administrator — a leaderboard that
queried `/users` would need to open that whole table to every signed-in student.
The old dashboard did exactly that, and it had been failing with a permission
error in production ever since the rules were tightened.

`public_profiles` is the fix the rules file always pointed at. One row per
student, holding only what a classmate would see on a noticeboard:

| Field | Why it is there |
|---|---|
| `displayName` | who they are |
| `photoURL` | avatar, optional |
| `school`, `grade`, `level` | "students like me" filters on level |
| `subjects` | how much you have in common |
| `totalPoints`, `streak` | the ranking |
| `role`, `updatedAt` | bookkeeping |

**No email, no date of birth, no contact details, no quiz history.** The field
whitelist in the rules is the guarantee — a client that tries to add `email` or
`phone` to its own row is refused, which `scripts/checkPublicProfileRules.mjs`
asserts.

Reading requires being signed in. Writing is limited to your own row.

### Keeping it in step

`src/contexts/AuthContext.tsx` mirrors the profile into its public row every time the
profile is loaded or saved, so nothing extra is collected and the two never drift.
A student who never opens the site simply has no row and does not appear.

---

## 2. Deploy

```
firebase deploy --only firestore:rules,firestore:indexes
```

**The index matters.** "Students like me" filters on `level` and orders by
`totalPoints`, which needs a composite index. It is declared in
`firestore.indexes.json`. Without it that query fails in production with a
console link to create the index — the emulator does not enforce this, so it
cannot be caught locally.

To check the rules after any edit:

```
npx firebase-tools emulators:exec --only firestore,auth \
  --project demo-rules-check "node scripts/checkPublicProfileRules.mjs"
```

That script asserts a signed-out visitor cannot browse students, a student can
publish their own row but not somebody else's, an email or phone number smuggled
into the row is refused, and — the point of the whole exercise — that `/users`
still cannot be listed.

`firebase.json` gained an `emulators` block so the auth emulator starts for that
script. It affects local runs only.

---

## 3. Subjects are scoped to a level

The subject picker only ever offers what the student's own level teaches, from
`CURRICULUM_REGISTRY` in `src/data/constants.ts`. A Form 1 is never shown ND Banking
subjects.

Two consequences worth knowing:

- **No level chosen** — the card reads "No course/level selected" and offers a
  button to pick one, rather than listing the whole curriculum.
- **Subjects from another level already on the account** — accounts created
  before this existed can hold subjects their level does not offer. Those are
  shown in an amber block marked "not offered in <level>", each removable, with
  a "Remove all" to clear them in one go. They are never deleted automatically:
  it is the student's data, and a stale subject is not worth a silent write.

If you would rather clean those up across every account at once, that is a
separate migration with the Admin SDK — it rewrites student records in bulk, so
it should be run deliberately and not as a side effect of somebody opening their
dashboard.
