import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from '../translations/translations';

// Initialize i18n
i18next
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
