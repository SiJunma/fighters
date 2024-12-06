import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Загружает переводы из файлов
  .use(LanguageDetector) // Определяет язык пользователя
  .use(initReactI18next) // Интеграция с React
  .init({
    fallbackLng: 'en', // Язык по умолчанию
    debug: true, // Включить логи для отладки
    interpolation: {
      escapeValue: false, // React сам экранирует значения
    },
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
    pluralSeparator: '_',
    compatibilityJSON: 'v4',
  });

export default i18n;
