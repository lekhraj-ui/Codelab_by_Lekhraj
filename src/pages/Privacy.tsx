import { Link } from "react-router-dom";

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="font-ui-label text-ui-label text-on-surface-variant">
          Last updated: July 24, 2026
        </p>
        <div className="space-y-lg font-body-md text-on-surface-variant">
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              What we collect
            </h2>
            <p>
              When you sign in with Google, we receive your name, email address,
              and profile photo so we can identify your account and save your
              submissions. We also store the code you submit, problem progress,
              and basic usage events like which problems you open.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              How we use it
            </h2>
            <p>
              We use this information to run the platform — evaluating code,
              showing your history, and keeping rate limits fair. We do not sell
              your personal data. We may use aggregated, de-identified stats to
              improve problem difficulty and editor performance.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Cookies and storage
            </h2>
            <p>
              Lekhraj CodeLab uses local storage for theme preference and session
              tokens required for authentication. Clearing site data will sign
              you out and reset appearance settings.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Third parties
            </h2>
            <p>
              Authentication is handled by Google Firebase Auth. Code evaluation
              runs on our own infrastructure. We do not embed advertising
              trackers on the practice pages.
            </p>
          </section>
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Contact
            </h2>
            <p>
              Questions about this policy? Email{" "}
              <a
                href="mailto:hello@lekhraj-codelab.dev"
                className="text-primary underline"
              >
                hello@lekhraj-codelab.dev
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
