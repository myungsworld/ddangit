import { Metadata } from 'next';
import { StaticPageLayout } from '@/shared/components/layout';
import { SITE_INFO, PRIVACY_CONTENT } from '@/shared/constants/static-pages';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_INFO.name}`,
  description: `Privacy Policy for ${SITE_INFO.name} - Learn how we handle your data and protect your privacy.`,
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p className="text-gray-400 text-sm">Last updated: {SITE_INFO.lastUpdated}</p>

      {PRIVACY_CONTENT.sections.map((section, index) => (
        <section key={index}>
          <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
          <p>{section.content}</p>

          {'list' in section && section.list && (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {section.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {'additionalContent' in section && section.additionalContent && (
            <p className="mt-2">{section.additionalContent}</p>
          )}

          {'link' in section && section.link && (
            <p className="mt-2">
              {section.link.description}{' '}
              <a
                href={section.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {section.link.text}
              </a>.
            </p>
          )}
        </section>
      ))}
    </StaticPageLayout>
  );
}
