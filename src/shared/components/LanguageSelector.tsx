'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n';

export function LanguageSelector() {
  const { language, setLanguage, isReady } = useLanguage();

  // 로딩 중이거나 이미 언어가 설정되어 있으면 표시하지 않음
  if (!isReady || language) {
    return null;
  }

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-2xl text-gray-400 mb-4">
          Select Language
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleSelect('ko')}
            className="group relative px-8 py-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-2">🇰🇷</div>
            <div className="text-xl font-bold text-white">한국어</div>
            <div className="text-sm text-gray-500 mt-1">Korean</div>
          </button>

          <button
            onClick={() => handleSelect('en')}
            className="group relative px-8 py-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-2">🇺🇸</div>
            <div className="text-xl font-bold text-white">English</div>
            <div className="text-sm text-gray-500 mt-1">English</div>
          </button>
        </div>
      </div>
    </div>
  );
}
