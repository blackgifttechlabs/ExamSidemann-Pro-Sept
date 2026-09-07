import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const PolicyLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-bold text-violet-600 hover:underline dark:text-violet-400"
  >
    {children}
  </a>
);

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12 px-4 md:px-[30px] mt-16 font-sans text-left">
      <div className="w-full bg-white dark:bg-navy-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tight border-b-2 border-gray-200 dark:border-white/10 pb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-medium leading-relaxed space-y-8">
          <p className="text-lg">Last updated: 12 August 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Scope and who we are
            </h2>
            <p>
              This policy explains how Exam Sidemann handles personal information when you use
              examsidemann.com, its learning resources, account features, and related services.
              Exam Sidemann is operated from Masvingo, Zimbabwe. It also explains when third-party
              services may receive information directly from your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Information we collect
            </h2>
            <p>Depending on the features you use, we may handle:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Information you provide:</strong> your name, email address, profile image,
                academic level or course selections, study notes, community submissions, support
                messages, and other content you choose to provide. Authentication credentials are
                handled through the authentication service used by the site.
              </li>
              <li>
                <strong>Learning and account activity:</strong> saved resources, progress, quiz or
                exercise results, account settings, and feature activity when those functions are
                available and used.
              </li>
              <li>
                <strong>Technical records:</strong> IP address, browser and device type, operating
                system, approximate location inferred from IP, referring page, requested URLs,
                dates and times, error logs, and security events. Hosting and security providers
                may create these records when your browser connects to the site.
              </li>
              <li>
                <strong>Browser storage and consent:</strong> necessary cookies or local storage may
                remember authentication, security, theme, navigation, and privacy choices. Your
                optional consent selection, its version, and the time selected are stored in your
                browser.
              </li>
              <li>
                <strong>Optional precise location:</strong> after you accept analytics, the browser
                separately asks whether you want to share your device location. If allowed, we may
                store coordinates, accuracy, province, district, and a nearby place name with a
                pseudonymous page visit. You can deny this request and continue using the app.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Why we use information
            </h2>
            <p>We use information as reasonably necessary to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>deliver learning resources and the features you request;</li>
              <li>create and secure accounts and remember settings;</li>
              <li>save progress and personalize learning features you use;</li>
              <li>respond to support requests and service messages;</li>
              <li>detect abuse, debug errors, and protect users and the service;</li>
              <li>understand and improve the site when you consent to analytics; and</li>
              <li>
                display and measure approved ads only when advertising is enabled and you consent.
              </li>
            </ul>
            <p className="mt-4">
              Depending on the context and applicable law, processing may be necessary to provide
              the service you request, based on consent, required for legal obligations, or based
              on legitimate interests such as security and service improvement. You may withdraw
              optional consent for future use at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Google Analytics and Google AdSense
            </h2>
            <p>
              Google Analytics is an optional measurement service. If you accept analytics, this
              site may load a Google tag that receives information such as pages viewed,
              interactions, browser or device details, referrer information, and your IP address
              during transmission. We request IP anonymization where supported. Google may use
              cookies, similar local identifiers, and tags or pixels to provide and secure the
              service and produce reports.
            </p>
            <p className="mt-4">
              Google AdSense is an optional advertising service. Advertising is disabled by
              default in this site's software. An AdSense script can load only when the deployment
              owner separately enables advertising, you explicitly allow advertising, and a
              substantive content placement has been reviewed and approved. If those conditions
              are met, Google and its advertising partners may receive your IP address, device and
              browser information, page or ad context, interactions, and advertising identifiers.
              They may use cookies, web beacons, pixels, or similar technologies to select,
              deliver, limit, prevent fraud, and measure ads. Depending on settings and legal
              requirements, ads may be personalized or non-personalized.
            </p>
            <p className="mt-4">
              Google and participating partners may process data under their own policies and may
              combine information as described in those policies. Learn more in{' '}
              <PolicyLink href="https://policies.google.com/technologies/partner-sites">
                How Google uses information from sites that use its services
              </PolicyLink>{' '}
              and the <PolicyLink href="https://policies.google.com/privacy">Google Privacy Policy</PolicyLink>.
            </p>
            <p className="mt-4">
              Exam Sidemann's on-site privacy choices panel is not represented as a
              Google-certified consent management platform (CMP). Google currently requires a
              certified CMP integrated with the IAB Transparency and Consent Framework when
              publishers serve AdSense ads to users in the EEA, United Kingdom, or Switzerland.
              See Google's{' '}
              <PolicyLink href="https://support.google.com/adsense/answer/13554116">
                consent management requirements for publishers
              </PolicyLink>
              . Advertising must remain disabled for affected users until those and any applicable
              legal requirements are implemented.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Other services and recipients
            </h2>
            <p>
              Information may be processed by providers that support hosting, content delivery,
              authentication, databases, storage, security, communications, fonts, analytics, or
              advertising. Providers visible in the current service may include Google services,
              Firebase, hosting or content-delivery providers, and links to WhatsApp or Facebook
              when you choose to use them. A third-party link or embedded service is governed by
              that provider's policy once you interact with it. Provider roles vary: some process
              data for us, while others may act independently for their own stated purposes.
            </p>
            <p className="mt-4">
              We may also disclose information when required by law; to protect rights, safety,
              and service security; in connection with a genuine organizational transfer; or with
              your direction or consent. These providers may process information in countries
              other than Zimbabwe, subject to the safeguards and laws applicable to them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Your privacy choices
            </h2>
            <p>
              On your first visit, the privacy choices panel lets you accept all, reject
              nonessential uses, or manage analytics and advertising separately. Learning content
              remains available if you reject optional uses. You can reopen{' '}
              <strong>Privacy choices</strong> to change your selection; a changed choice applies
              to future activity and cannot undo processing that already occurred with permission.
              Clearing browser storage may also clear your saved choice, so the site may ask again.
            </p>
            <p className="mt-4">
              Location requires both analytics consent and the browser&apos;s separate location
              permission. You can block or revoke location in browser or device settings. Detailed
              location and page-visit records are available only to authenticated administrators
              and are scheduled for deletion after 90 days.
            </p>
            <p className="mt-4">
              You can also limit cookies in browser settings. Google provides{' '}
              <PolicyLink href="https://myadcenter.google.com/">advertising controls</PolicyLink>{' '}
              and a{' '}
              <PolicyLink href="https://tools.google.com/dlpage/gaoptout">
                Google Analytics opt-out browser add-on
              </PolicyLink>
              . Browser restrictions may affect sign-in or saved settings.
            </p>
            <p className="mt-4">
              Depending on your location, you may have rights to ask for access, correction,
              deletion, restriction, or a copy of your personal information, or to object or
              complain to a relevant authority. We may need to verify a request and may retain
              information when legally permitted or required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Children and students
            </h2>
            <p>
              Exam Sidemann provides educational material that may be used by students. If you are
              under 13, or under the minimum age required in your country to provide your own
              consent, use account and community features only with a parent or guardian's
              permission. Do not submit personal contact details publicly. Parents or guardians
              who believe a child provided personal information without appropriate permission
              should contact us so we can investigate and, where appropriate, delete it.
            </p>
            <p className="mt-4">
              We do not intentionally approve advertising placements on content or audiences we
              know are directed to children. Advertising remains off by default. Before enabling
              ads for any child-directed context, the site owner must apply Google's child-directed
              treatment and all applicable age and consent requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Retention</h2>
            <p>
              We keep personal information only for as long as reasonably needed for the purposes
              described above, including providing an active account, maintaining security and
              backups, resolving disputes, and meeting legal obligations. Retention varies by
              record and provider. Account and learning records may remain while an account is
              active and for a reasonable period afterward; security and error logs are kept for
              operationally necessary periods; and support records may be retained while a request
              and related obligations remain relevant.
            </p>
            <p className="mt-4">
              Your consent choice remains in your browser until you change it or clear that browser
              storage. Google and other independent providers apply their own published retention
              settings and policies. You may contact us to ask about or request deletion of a
              particular record.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Security</h2>
            <p>
              We use reasonable technical and organizational safeguards intended to protect
              information. No internet transmission, browser storage, or electronic system is
              completely secure, so we cannot promise absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Changes to this policy
            </h2>
            <p>
              We may update this policy as the service or legal requirements change. The revised
              policy will be posted here with a new "Last updated" date. We will provide additional
              notice when a change is material and a notice is reasonably available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact us</h2>
            <p>
              For privacy questions or requests, use the Contact page or contact Exam Sidemann at{' '}
              <a
                href="mailto:blackgiftechlabs@gmail.com"
                className="font-bold text-violet-600 hover:underline dark:text-violet-400"
              >
                blackgiftechlabs@gmail.com
              </a>
              , telephone +263 78 245 6936, or 234 Hillside, Masvingo, Zimbabwe.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
