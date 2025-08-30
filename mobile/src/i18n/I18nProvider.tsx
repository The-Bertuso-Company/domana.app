import { PropsWithChildren, useEffect, useState } from "react";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: { title: "Domana Mobile Bootstrap" },
      nav: { goToSearch: "Go to Search" },
      search: { title: "Search", enabled: "(enabled)", disabled: "(flagged off)" }
    }
  },
  tl: {
    translation: {
      app: { title: "Domana Mobile Bootstrap" },
      nav: { goToSearch: "Punta sa Hanap" },
      search: { title: "Hanap", enabled: "(bukas)", disabled: "(nakapatay)" }
    }
  }
};

let initialized = false;

async function ensureInit() {
  if (initialized) return;
  const deviceLang = Localization.getLocales()[0]?.languageCode ?? "en";
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: deviceLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
  initialized = true;
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ensureInit().then(() => setReady(true));
  }, []);
  if (!ready) return null;
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
