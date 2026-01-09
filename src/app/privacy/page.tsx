import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ddangit',
  description: 'Privacy Policy for ddangit',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p className="text-gray-400">Last updated: January 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <p>
              We do not collect any personal information directly. However, we use third-party
              services that may collect information used to identify you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Google AdSense - for displaying advertisements</li>
              <li>Google Analytics - for analyzing website traffic</li>
            </ul>
            <p className="mt-2">
              These services may use cookies and similar technologies to collect information
              about your browsing activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
            <p>
              This website uses cookies to enhance user experience and serve personalized
              advertisements. You can choose to disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Google AdSense</h2>
            <p>
              Google uses cookies to serve ads based on your prior visits to this website
              or other websites. You may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
