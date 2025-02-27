import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import plTranslation from "./locales/pl/translation.json";
import jpTranslation from "./locales/jp/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  pl: {
    translation: plTranslation,
  },
  jp: {
    translation: jpTranslation,
  },
};

const savedLang = localStorage.getItem("appLanguage") ?? "";

const availableLanguages = ["en", "pl", "jp"];
const language = availableLanguages.includes(savedLang) ? savedLang : "pl";

i18n.use(initReactI18next).init({
  resources,
  lng: language || "pl",
  fallbackLng: "pl",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
