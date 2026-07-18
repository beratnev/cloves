import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

export type Language = "EN" | "TR";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "EN",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "language-storage",
    }
  )
);

export const dictionaries = {
  EN: en,
  TR: tr
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof dictionaries.EN, fallback?: string) => (dictionaries[language] as any)[key] || fallback || key;
  return { t, language };
}

