import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from './translations';
import type { Language, Translations } from './translations';
import { getSettings, saveSettings } from '../utils/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detekce systémového jazyka
const getSystemLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('cs')) {
    return 'cs';
  }
  return 'en'; // Defaultně angličtina
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('cs');

  // Načíst uložený jazyk nebo použít systémový
  useEffect(() => {
    const loadLanguage = async () => {
      const settings = await getSettings();
      const savedLang = settings.language || getSystemLanguage();
      setLanguageState(savedLang);
    };
    loadLanguage();
  }, []);

  // Uložit jazyk při změně
  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    const settings = await getSettings();
    await saveSettings({ ...settings, language: lang });
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
