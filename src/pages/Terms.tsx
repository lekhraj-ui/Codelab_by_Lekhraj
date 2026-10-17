import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="landing font-body-md text-on-surface min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-gutter py-xxl space-y-xl">
        <Link
          to="/"
          className="font-ui-label text-ui-label text-on-surface-variant hover:text-primary"
        >
          ← Back
        </Link>
        <h1 className="font-display-lg text-headline-md md:text-display-lg">
          Terms of Service
        </h1>
        <p className="font-ui-label text-ui-label text-on-surface-variant">
          Last updated: July 24, 2026
        </p>
        <div className="space-y-lg font-body-md text-on-surface-variant">
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Acceptance
            </h2>
            <p>
              By using Lekhraj CodeLab you agree to these terms. If you do not agree,
              do not use the service. Lekhraj CodeLab is provided for educational and
              interview-preparation purposes.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Your account
            </h2>
            <p>
              You are responsible for activity under your Google-linked account.
              Do not share credentials or attempt to bypass submission limits,
              authentication, or judge sandboxes.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Acceptable use
            </h2>
            <p>
              Do not submit malware, mine cryptocurrency, scrape the site at
              abusive rates, or harass other users. We may suspend accounts that
              abuse compute resources or interfere with evaluation workers.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Content and IP
            </h2>
            <p>
              Problem statements and platform UI remain owned by Lekhraj CodeLab and
              its contributors. Code you write remains yours; by submitting it
              you grant us a license to store, run, and display it for grading
              and history features.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Disclaimer
            </h2>
            <p>
              The service is provided “as is” without warranties. Judge results
              may differ from local runs. We are not liable for lost
              submissions, downtime, or interview outcomes tied to practice on
              Lekhraj CodeLab.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Changes
            </h2>
            <p>
              We may update these terms from time to time. Continued use after
              changes means you accept the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
