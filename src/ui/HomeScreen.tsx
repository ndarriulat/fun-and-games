import type { Mode } from "@/content/types";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { spanishSuggestion } from "./strings";
import type { Screen } from "./App";

const modes: { mode: Mode; screen?: Screen }[] = [
  { mode: "trivia", screen: "trivia" },
  // Puzzles arrives in v1.1, so it has no screen yet.
  { mode: "puzzles" },
  { mode: "talk", screen: "talk" },
];

export function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const { t, suggestSpanish } = useLanguage();

  return (
    <main className="home">
      <header className="home-top">
        <h1 className="brand">Vamos</h1>
        <LanguageToggle />
        <button type="button" className="icon-btn" aria-label={t.settings} onClick={() => go("settings")}>
          <Icon name="settings" />
        </button>
      </header>
      {suggestSpanish && <SpanishSuggestion />}
      <nav className="mode-list" aria-label={t.modes}>
        {modes.map(({ mode, screen }) => (
          <button
            key={mode}
            type="button"
            className="mode-card"
            data-mode={mode}
            disabled={!screen}
            onClick={screen && (() => go(screen))}
          >
            <span className="mode-name">{t[mode].name}</span>
            <span className="mode-blurb">{t[mode].blurb}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

/** Offered once, on a Spanish phone. */
function SpanishSuggestion() {
  const { setLanguage } = useLanguage();
  const { title, accept, decline } = spanishSuggestion;

  return (
    <section className="suggestion" aria-label={title}>
      <p className="suggestion-title">{title}</p>
      <div className="suggestion-actions">
        <button type="button" className="suggestion-accept" onClick={() => setLanguage("es")}>
          {accept}
        </button>
        <button type="button" className="link" onClick={() => setLanguage("en")}>
          {decline}
        </button>
      </div>
    </section>
  );
}
