import { languages } from "@/content/types";
import { useLanguage } from "./language";

/** EN | ES: switches language in place, on Home and on a card, for a mixed group. */
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label={t.language}>
      {languages.map((option) => (
        <button
          key={option}
          type="button"
          className="lang-option"
          aria-pressed={option === language}
          onClick={() => setLanguage(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
