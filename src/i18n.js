import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from './locales/fr.json';
import translationEN from './locales/en.json';
import translationKO from './locales/ko.json';

const resources = {
  fr: { translation: translationFR },
  en: { translation: translationEN },
  ko: { translation: translationKO }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'ko'],
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      // Coupe "en-US" -> "en" AVANT de sauvegarder dans localStorage
      convertDetectedLanguage: (lng) => lng.split('-')[0].toLowerCase()
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;