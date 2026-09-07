import { Timestamp, doc, setDoc } from "firebase/firestore";
import { db, loginWithEmail, registerWithEmail } from "./firebase";

/**
 * Sign-up and sign-in for Yippie, the ECD area.
 *
 * Little learners are enrolled by a parent on a phone, so the credential pair
 * is a phone number and a password rather than an email address. Firebase Auth
 * has no phone+password provider — its phone provider is SMS one-time codes —
 * so the number is folded into a stable synthetic email address and the account
 * is a normal email/password account underneath. The real number is stored on
 * the profile document, which is what the app and the admin screens read.
 */

/** The domain the synthetic addresses live under. Never receives mail. */
const ECD_EMAIL_DOMAIN = "ecd.examsidemann.com";

export const ECD_EDUCATION_TYPE = "ecd";

export class EcdAuthError extends Error {}

/**
 * Fold a Zimbabwean mobile number into E.164. Accepts the shapes a parent
 * actually types: 0771234567, 771234567, +263771234567, 263 77 123 4567.
 */
export const normaliseZimPhone = (raw: string): string => {
  const digits = raw.replace(/[^\d]/g, "");

  let national: string;
  if (digits.startsWith("263")) national = digits.slice(3);
  else if (digits.startsWith("0")) national = digits.slice(1);
  else national = digits;

  // Zimbabwean mobile numbers are 9 digits nationally and start 7.
  if (!/^7\d{8}$/.test(national)) {
    throw new EcdAuthError("Please type a phone number like 0771234567.");
  }

  return `+263${national}`;
};

/** The synthetic address that stands in for a phone number at the auth layer. */
export const emailForPhone = (phone: string) =>
  `${normaliseZimPhone(phone).replace("+", "")}@${ECD_EMAIL_DOMAIN}`;

/** Split "Tinashe Moyo" into the first/last pair the profile documents use. */
const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
};

/** Firebase's error codes, said the way a parent would want to hear them. */
export const ecdAuthMessage = (error: unknown): string => {
  if (error instanceof EcdAuthError) return error.message;

  const code = String((error as { code?: string })?.code ?? "");
  if (code.includes("email-already-in-use")) {
    return "That phone number already has an account. Go back and choose “No”.";
  }
  if (code.includes("user-not-found") || code.includes("invalid-credential")) {
    return "We could not find that number and password. Check them and try again.";
  }
  if (code.includes("wrong-password")) return "That password does not match.";
  if (code.includes("weak-password")) return "Please use a password of at least 6 characters.";
  if (code.includes("too-many-requests")) return "Too many tries. Please wait a moment.";
  if (code.includes("network")) return "No internet connection. Please try again.";
  return "Something went wrong. Please try again.";
};

export interface EcdSignUpDetails {
  name: string;
  age: number;
  phone: string;
  password: string;
}

/**
 * Create the account and its profile document. The document deliberately uses
 * the same shape as every other learner — role "student", plus
 * `educationType: "ecd"` and the age, which is what the admin ECD filter reads.
 */
export const registerEcdLearner = async ({ name, age, phone, password }: EcdSignUpDetails) => {
  const normalisedPhone = normaliseZimPhone(phone);
  const email = emailForPhone(normalisedPhone);
  const { firstName, lastName } = splitName(name);

  const user = await registerWithEmail(email, password, name.trim());

  await setDoc(doc(db, "users", user.uid), {
    firstName,
    lastName,
    email,
    phone: normalisedPhone,
    role: "student",
    educationType: ECD_EDUCATION_TYPE,
    grade: "ECD",
    age,
    enrolledSubjects: [],
    completedTopics: {},
    topicScores: {},
    friendRequests: [],
    friends: [],
    parentRequests: [],
    linkedParents: [],
    streak: 1,
    visitCount: 1,
    totalPoints: 0,
    createdAt: Timestamp.now(),
    lastLoginDate: Timestamp.now(),
  });

  return user;
};

export const loginEcdLearner = async ({ phone, password }: { phone: string; password: string }) => {
  await loginWithEmail(emailForPhone(phone), password);
};
