import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  langDir: 'ltr' | 'rtl';
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('finlux_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const langDir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('finlux_lang', language);
    document.documentElement.dir = langDir;
    document.documentElement.lang = language;
    
    // Auto-toggle dark mode to maintain absolute sync with Arabic translation mode
    if (language === 'ar') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, langDir]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'en' ? 'ar' : 'en');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Helper function to translate English words to Arabic
  const t = (key: string | undefined | null): string => {
    if (!key) return '';
    const cleanedKey = key.trim();
    if (language === 'ar') {
      if (translations[cleanedKey]) {
        return translations[cleanedKey];
      }
      // Check for partial or case-insensitive match
      const foundMatch = Object.keys(translations).find(
        k => k.toLowerCase() === cleanedKey.toLowerCase()
      );
      if (foundMatch && translations[foundMatch]) {
        return translations[foundMatch];
      }
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, langDir, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
