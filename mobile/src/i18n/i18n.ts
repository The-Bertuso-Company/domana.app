import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      lng: Localization.getLocales?.()[0]?.languageTag ?? "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      resources: { en: { translation: { hello: "Hello 👋" } } }
    })
    .catch(() => {});
}
export default i18n;
