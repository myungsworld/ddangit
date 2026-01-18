import { Metadata } from 'next';
import { StaticPageLayout } from '@/shared/components/layout';
import { SITE_INFO, TERMS_CONTENT } from '@/shared/constants/static-pages';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_INFO.name}`,
  description: `Terms of Service for ${SITE_INFO.name} - Read our terms and conditions for using our mini-games service.`,
};

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Service">
      <p className="text-gray-400 text-sm">Last updated: {SITE_INFO.lastUpdated}</p>

      {TERMS_CONTENT.sections.map((section, index) => (
        <section key={index}>
          <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </StaticPageLayout>
  );
}
