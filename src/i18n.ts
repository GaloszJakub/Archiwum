import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import plTranslation from './locales/pl/translation.json';
import enTranslation from './locales/en/translation.json';

const savedLanguage = localStorage.getItem('language') || 'pl';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        translation: plTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    lng: savedLanguage,
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
