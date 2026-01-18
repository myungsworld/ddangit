import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getGameById, getGameIds } from '@/shared/constants';

type Params = Promise<{ gameId: string }>;

// 빌드 시 정적 경로 생성
export function generateStaticParams() {
  return getGameIds().map((id) => ({ gameId: id }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return { title: 'Game Not Found' };
  }

  return {
    title: `How to Play ${game.name} - Complete Guide | ddangit`,
    description: `Master ${game.name} with our comprehensive guide. Learn game rules, scoring system, pro strategies, tips, and FAQs. Start playing like a pro today!`,
  };
}

export default function GameGuidePage({ params }: { params: Params }) {
  const { gameId } = use(params);

  const game = getGameById(gameId);
  if (!game) notFound();

  const { guide } = game;

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={game.path}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Game
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 flex items-center gap-3">
            <span>{game.icon}</span>
            <span style={{ color: game.color }}>{game.name}</span>
          </h1>
          <p className="text-gray-400 mt-2">Complete Guide & Strategy</p>
        </div>

        {/* Guide Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span> Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">{guide.introduction}</p>
          </section>

          {/* How to Play */}
          <section className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎮</span> How to Play
            </h2>
            <ol className="space-y-3 text-gray-300">
              {guide.howToPlay.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: game.color, color: 'white' }}
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Scoring System */}
          <section className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span> Scoring System
            </h2>
            <ul className="space-y-2 text-gray-300">
              {guide.scoring.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-yellow-500">★</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tips */}
          <section className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> Tips & Tricks
            </h2>
            <ul className="space-y-2 text-gray-300">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Advanced Strategies */}
          {guide.strategies && guide.strategies.length > 0 && (
            <section className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Advanced Strategies
              </h2>
              <div className="space-y-4 text-gray-300">
                {guide.strategies.map((strategy, i) => (
                  <div key={i} className="border-l-2 border-gray-700 pl-4">
                    <p>{strategy}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* History & Background */}
          {guide.history && (
            <section className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span> History & Background
              </h2>
              <p className="text-gray-300 leading-relaxed">{guide.history}</p>
            </section>
          )}

          {/* FAQ */}
          {guide.faq && guide.faq.length > 0 && (
            <section className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">❓</span> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {guide.faq.map((item, i) => (
                  <div key={i} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                    <h3 className="text-white font-medium mb-2">Q: {item.question}</h3>
                    <p className="text-gray-400 text-sm">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fun Facts */}
          {guide.funFacts && guide.funFacts.length > 0 && (
            <section className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎲</span> Fun Facts
              </h2>
              <ul className="space-y-2 text-gray-300">
                {guide.funFacts.map((fact, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-purple-400">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Play Now CTA */}
          <div className="text-center pt-4">
            <Link
              href={game.path}
              className="inline-block px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: game.color }}
            >
              Play {game.name} Now!
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← More Games
          </Link>
        </div>
      </div>
    </div>
  );
}
