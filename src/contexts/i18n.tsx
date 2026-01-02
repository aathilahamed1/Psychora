
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import ks from '@/locales/ks.json';

const translations: { [key: string]: any } = { en, hi, ks };

const rtlLanguages: string[] = ['ks'];

type I18nContextType = {
  language: string;
  setLanguage: (language: string) => void;
  direction: 'ltr' | 'rtl';
  t: (key: string,
    // Note: The type here should be Record<string, string | number> but due to a limitation we have to use any
    options?: any
  ) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
      const newDirection = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
      document.documentElement.dir = newDirection;
      setDirection(newDirection);
    }
  }, [language]);


  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, direction, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
