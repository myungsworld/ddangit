import { Metadata } from 'next';
import Link from 'next/link';
import { StaticPageLayout } from '@/shared/components/layout';
import { SITE_INFO, ABOUT_CONTENT } from '@/shared/constants/static-pages';
import { GAMES } from '@/shared/constants';

export const metadata: Metadata = {
  title: `About | ${SITE_INFO.name}`,
  description: `About ${SITE_INFO.name} - ${SITE_INFO.tagline}. Learn about our mission to create simple, fun browser games.`,
};

export default function AboutPage() {
  return (
    <StaticPageLayout title={`About ${SITE_INFO.name}`}>
      {/* Mission */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          {ABOUT_CONTENT.mission.title}
        </h2>
        <p className="mb-4">
          <strong className="text-white">{SITE_INFO.name}</strong> ({SITE_INFO.nameKorean}) {ABOUT_CONTENT.mission.description}
        </p>
        <p>{ABOUT_CONTENT.mission.nameOrigin}</p>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">What We Offer</h2>
        <ul className="space-y-3">
          {ABOUT_CONTENT.features.map((feature) => (
            <li key={feature.title} className="flex items-start gap-3">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <strong className="text-white">{feature.title}</strong>
                <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Games */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Our Games</h2>
        <div className="space-y-4">
          {GAMES.map((game) => (
            <div key={game.id} className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>{game.icon}</span> {game.name}
              </h3>
              <p className="text-sm text-gray-400 mt-2">{game.seo.description}</p>
              <div className="mt-3 flex gap-3">
                <Link
                  href={game.path}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Play Now →
                </Link>
                <Link
                  href={`${game.path}/guide`}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  How to Play
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Built With Modern Tech</h2>
        <p>{ABOUT_CONTENT.technology}</p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Get In Touch</h2>
        <p>
          Have feedback, suggestions, or just want to say hi? We&apos;d love to hear from you!
        </p>
        <p className="mt-3">
          <strong className="text-white">Email: </strong>
          <a
            href={`mailto:${SITE_INFO.email}`}
            className="text-blue-400 hover:underline"
          >
            {SITE_INFO.email}
          </a>
        </p>
      </section>
    </StaticPageLayout>
  );
}
