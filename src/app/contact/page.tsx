import { Metadata } from 'next';
import { StaticPageLayout } from '@/shared/components/layout';
import { SITE_INFO, CONTACT_CONTENT } from '@/shared/constants/static-pages';

export const metadata: Metadata = {
  title: `Contact | ${SITE_INFO.name}`,
  description: `Contact ${SITE_INFO.name} - Get in touch with us for feedback, suggestions, bug reports, or business inquiries.`,
};

export default function ContactPage() {
  return (
    <StaticPageLayout title="Contact Us">
      <p className="text-lg">{CONTACT_CONTENT.intro}</p>

      {/* Contact Methods */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">How to Reach Us</h2>
        <div className="space-y-4">
          {CONTACT_CONTENT.methods.map((method) => (
            <div key={method.title} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{method.icon}</span>
                <h3 className="font-semibold text-white">{method.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-2">{method.description}</p>
              <a
                href={method.link}
                className="text-blue-400 hover:underline"
              >
                {method.value}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">What Can We Help With?</h2>
        <div className="space-y-3">
          {CONTACT_CONTENT.topics.map((topic) => (
            <div key={topic.title} className="border-l-2 border-gray-700 pl-4">
              <h3 className="font-semibold text-white">{topic.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Response Time */}
      <section className="bg-gray-900 rounded-lg p-4">
        <p className="text-gray-400">
          <span className="text-white font-semibold">Response Time: </span>
          {CONTACT_CONTENT.responseTime}
        </p>
      </section>
    </StaticPageLayout>
  );
}
