import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ecdSounds } from "../../lib/audio/ecdSounds";
import { EcdShell } from "./EcdShell";
import { ecdAuthMessage, loginEcdLearner, registerEcdLearner } from "../../services/ecdAuth";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Yippie — the ECD (Early Childhood Development) entry screen.
 *
 * Little learners get a picture-book screen rather than the app chrome: one
 * flat sky, a bank of clouds along the bottom and a single folded-paper card
 * that steps through joining or coming back:
 *
 *   first time  →  name and age  →  phone and password  →  account created
 *   been before →  phone and password  →  signed in
 *
 * Both paths end on the journey chooser. The account is a real Firebase user
 * and a `users/{uid}` profile document — see `services/ecdAuth` for why a phone
 * number can stand in for an email address.
 */

/** Which card the parchment is currently showing. */
type Step = "ask" | "nameAge" | "signup" | "login";

/** A pocket-sized version of the creature, used as the crest on the input cards. */
const EcdCreatureBadge: React.FC = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
    <circle cx="60" cy="60" r="58" fill="#7ee0a8" />
    <circle cx="60" cy="60" r="58" fill="none" stroke="#4fc98a" strokeWidth="5" />
    <circle cx="45" cy="54" r="7" fill="#1d5c3f" />
    <circle cx="77" cy="52" r="7" fill="#1d5c3f" />
    <path d="M46 76 Q 62 90 80 74" fill="none" stroke="#1d5c3f" strokeWidth="5" strokeLinecap="round" />
    <circle cx="30" cy="70" r="6" fill="#ffb0c4" opacity="0.85" />
    <circle cx="92" cy="66" r="6" fill="#ffb0c4" opacity="0.85" />
  </svg>
);

export const EcdWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState<Step>("ask");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Somebody already signed in should not be asked to sign in again: the
  // session survives restarts, so send them straight on to their journey.
  // Guarded on the first card so it cannot fire mid-sign-up.
  useEffect(() => {
    if (!loading && user && step === "ask") {
      navigate("/ecd/journey", { replace: true });
    }
  }, [loading, user, step, navigate]);

  // The intro tune plays across the whole welcome — the question card and the
  // sign-in cards alike — and only stops when the child leaves the screen.
  useEffect(() => {
    ecdSounds.retainIntro();
    return () => ecdSounds.releaseIntro();
  }, []);

  // Card swaps get the swipe effect — but not the very first paint.
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    ecdSounds.play("swipe", 0.8);
  }, [step]);

  const click = () => ecdSounds.play("buttonClick");

  const go = (next: Step) => {
    click();
    setError(null);
    setStep(next);
  };

  // A first-timer is enrolled: name and age, then the phone and password the
  // parent will sign in with. Everyone else goes straight to those credentials.
  const answerFirstTime = (firstTime: boolean) => go(firstTime ? "nameAge" : "login");

  const back = () => go(step === "signup" ? "nameAge" : "ask");

  /** Step one of joining: who the learner is. */
  const handleDetails = (event: React.FormEvent) => {
    event.preventDefault();
    click();

    if (!name.trim()) {
      setError("Please type your name first.");
      return;
    }
    const parsedAge = Number(age);
    if (!age.trim() || Number.isNaN(parsedAge) || parsedAge < 2 || parsedAge > 12) {
      setError("Please type an age between 2 and 12.");
      return;
    }

    setError(null);
    setStep("signup");
  };

  /** Step two of joining, and the whole of coming back: the credentials. */
  const handleCredentials = async (event: React.FormEvent) => {
    event.preventDefault();
    click();
    if (busy) return;

    if (!phone.trim()) {
      setError("Please type the phone number.");
      return;
    }
    if (password.length < 6) {
      setError("Please use a password of at least 6 characters.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (step === "signup") {
        await registerEcdLearner({
          name: name.trim(),
          age: Number(age),
          phone,
          password,
        });
      } else {
        await loginEcdLearner({ phone, password });
      }
      navigate("/ecd/journey");
    } catch (authError) {
      setError(ecdAuthMessage(authError));
      setBusy(false);
    }
  };

  const heading =
    step === "ask"
      ? "Welcome to Yippie, is this your first time?"
      : step === "nameAge"
        ? "Enter your name and age"
        : step === "signup"
          ? "Enter your phone number and password"
          : "Enter your phone number and password";

  const headingFont = { fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif', fontWeight: 800 } as const;

  const labelClass = "block text-[13px] uppercase tracking-[0.12em] text-[#8a7a55]";
  const inputClass =
    "ecd-input mt-2 w-full rounded-[12px] px-4 text-center text-[20px] text-[#35323b] placeholder:text-[#b9a883] focus:outline-none";
  const buttonClass =
    "ecd-btn h-[52px] w-full max-w-[186px] rounded-[10px] text-[17px] uppercase tracking-[0.01em] transition-all duration-100 sm:h-[58px] sm:text-[19px]";

  /**
   * The shared frame for every card that collects something.
   *
   * A plain function rather than a component: declaring a component inside the
   * render would give React a new type on every keystroke, remounting the
   * inputs and stealing focus mid-word.
   */
  const formCard = ({
    onSubmit,
    submitLabel,
    children,
  }: {
    onSubmit: (event: React.FormEvent) => void;
    submitLabel: string;
    children: React.ReactNode;
  }) => (
    <form onSubmit={onSubmit} noValidate>
      <div className="mx-auto mt-5 h-[76px] w-[76px] sm:mt-6 sm:h-[86px] sm:w-[86px]">
        <EcdCreatureBadge />
      </div>

      {children}

      <p
        role="alert"
        className={`mt-3 min-h-[20px] text-center text-[14px] font-bold text-[#c0442f] ${error ? "" : "invisible"}`}
      >
        {error ?? "placeholder"}
      </p>

      <div className="mt-2 flex items-center justify-center gap-4 sm:gap-7">
        <button type="button" onClick={back} disabled={busy} className={buttonClass} style={headingFont}>
          Back
        </button>
        <button type="submit" disabled={busy} className={buttonClass} style={headingFont}>
          {busy ? (
            <Loader2 size={22} className="mx-auto animate-spin" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );

  return (
    <EcdShell>
      {/* question card */}
      <div className="relative z-10 flex w-full flex-1 justify-center px-4 pb-16 pt-[72px] sm:pt-[84px]">
        <div
          className="ecd-card-wrap relative h-fit w-full max-w-[492px]"
          style={{
            filter:
              "drop-shadow(0 8px 0 rgba(9, 76, 96, 0.10)) drop-shadow(0 20px 28px rgba(2, 74, 104, 0.22))",
          }}
        >
          <div className="ecd-card px-6 pb-9 pt-8 sm:px-9 sm:pb-10 sm:pt-9">
            <h1
              className="text-center text-[26px] leading-[1.18] tracking-[-0.01em] text-[#35323b] sm:text-[34px]"
              style={headingFont}
            >
              {heading}
            </h1>

            {step === "ask" ? (
              <>
                <div className="mx-auto mt-5 aspect-square w-full max-w-[300px] overflow-hidden rounded-xl bg-[#29b6e8] sm:mt-6">
                  <img
                    src="/images/ecd/introcard.png"
                    alt="A child pinning colourful cards to a classroom notice board"
                    width={604}
                    height={600}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-7 flex items-center justify-center gap-4 sm:mt-9 sm:gap-7">
                  {([true, false] as const).map((firstTime) => (
                    <button
                      key={String(firstTime)}
                      type="button"
                      onClick={() => answerFirstTime(firstTime)}
                      className={buttonClass}
                      style={headingFont}
                    >
                      {firstTime ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </>
            ) : step === "nameAge" ? (
              formCard({
                onSubmit: handleDetails,
                submitLabel: "Next",
                children: (
                  <>
                <label className="mt-6 block text-center sm:mt-7" style={headingFont}>
                  <span className={labelClass}>Your name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError(null);
                    }}
                    autoComplete="given-name"
                    placeholder="Type your name"
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block text-center" style={headingFont}>
                  <span className={labelClass}>Your age</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={2}
                    max={12}
                    value={age}
                    onChange={(event) => {
                      setAge(event.target.value);
                      setError(null);
                    }}
                    placeholder="Type your age"
                    className={inputClass}
                  />
                </label>
                  </>
                ),
              })
            ) : (
              formCard({
                onSubmit: handleCredentials,
                submitLabel: step === "signup" ? "Join" : "Sign in",
                children: (
                  <>
                <label className="mt-6 block text-center sm:mt-7" style={headingFont}>
                  <span className={labelClass}>Phone number</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setError(null);
                    }}
                    autoComplete="tel"
                    placeholder="0771234567"
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block text-center" style={headingFont}>
                  <span className={labelClass}>Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError(null);
                    }}
                    autoComplete={step === "signup" ? "new-password" : "current-password"}
                    placeholder="At least 6 characters"
                    className={inputClass}
                  />
                </label>
                  </>
                ),
              })
            )}
          </div>

          <span className="ecd-fold ecd-fold-tl" aria-hidden="true" />
          <span className="ecd-fold ecd-fold-br" aria-hidden="true" />
          <span className="ecd-fold ecd-fold-tr" aria-hidden="true" />
          <span className="ecd-fold ecd-fold-bl" aria-hidden="true" />
        </div>
      </div>
    </EcdShell>
  );
};

export default EcdWelcome;
