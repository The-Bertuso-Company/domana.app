import InviteGate from "./InviteGate";

export const metadata = {
  title: "Domana Private Beta",
  robots: { index: false, follow: false },
};

export default function BetaPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 text-center">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">Domana Private Beta</h1>
      <p className="opacity-80 mb-8">
        Exclusive invite-only access to test Domana v0.1
      </p>

      {/* Why Join */}
      <section className="text-left mb-8">
        <h2 className="text-xl font-semibold mb-3">Why join?</h2>
        <ul className="list-disc list-inside space-y-2 opacity-90">
          <li>Get exclusive first access before public launch</li>
          <li>Help shape the features that matter most</li>
          <li>Be part of a trusted, private tester group</li>
        </ul>
      </section>

      {/* Signup Form gated by InviteGate */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Request access</h2>
        <InviteGate>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdgNu8TZUOkJDfKwiwMAbt7PrBpb4xwE7l_6IMWPSQir48yXA/viewform?embedded=true"
            width="100%"
            height="800"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="Domana Beta Signup"
          >
            Loading…
          </iframe>
        </InviteGate>
      </section>

      {/* Privacy Note */}
      <p className="text-sm opacity-70">
        By signing up, you agree to keep product details, screenshots, and
        features confidential until public launch.
      </p>
    </main>
  );
}
