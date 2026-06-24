import React, { createContext, useState, useContext } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en', 'am', 'om'

  const t = (section, key) => {
    try {
      return translations[language][section][key] || translations['en'][section][key];
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
