import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or navigator language
  const [language, setLanguageState] = useState(() => {
    try {
      const savedLang = localStorage.getItem('portfolio_lang');
      if (savedLang && (savedLang === 'en' || savedLang === 'am' || savedLang === 'om')) {
        return savedLang;
      }
      const browserLang = navigator.language || '';
      if (browserLang.startsWith('am')) return 'am';
      if (browserLang.startsWith('om')) return 'om';
    } catch (e) {
      console.error(e);
    }
    return 'en';
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('portfolio_lang', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (section, key) => {
    try {
      if (translations[language] && translations[language][section] && translations[language][section][key]) {
        return translations[language][section][key];
      }
      // Fallback to English if key missing in current language
      return translations['en'][section][key] || key;
    } catch (e) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
