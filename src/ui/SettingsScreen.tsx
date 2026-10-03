import { languages } from "@/content/types";
import { Icon } from "./icons";
import { useLanguage } from "./language";

export function SettingsScreen({ goHome }: { goHome: () => void }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <main className="settings">
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={t.home} onClick={goHome}>
          <Icon name="home" />
        </button>
      </header>
      <h1 className="settings-title">{t.settings}</h1>
      <section className="setting" aria-labelledby="setting-language">
        <h2 id="setting-language" className="setting-name">
          {t.language}
        </h2>
        <div className="segmented">
          {languages.map((option) => (
            <button
              key={option}
              type="button"
              className="segment"
              aria-pressed={option === language}
              onClick={() => setLanguage(option)}
            >
              {t.languageNames[option]}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
