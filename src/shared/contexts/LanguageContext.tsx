'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, getNestedValue } from '../i18n';

interface LanguageContextType {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'ddangit-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 초기 로드 시 localStorage에서 언어 확인
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && (stored === 'ko' || stored === 'en')) {
      setLanguageState(stored);
    }
    setIsReady(true);
  }, []);

  // 언어 설정
  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  // 번역 함수
  const t = (key: string): string => {
    if (!language) return '';
    return getNestedValue(translations[language] as Record<string, unknown>, key);
  };

  // 로딩 중일 때 빈 화면 표시 (깜빡임 방지)
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-950" />
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
