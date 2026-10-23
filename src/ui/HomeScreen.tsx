import { useState } from "react";
import type { Mode } from "@/content/types";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { spanishSuggestion } from "./strings";
import type { Screen } from "./App";

const modes: { mode: Mode; screen?: Screen }[] = [
  { mode: "trivia", screen: "trivia" },
  { mode: "talk", screen: "talk" },
  // Puzzles arrives in v1.1, so it has no screen yet.
  { mode: "puzzles" },
];

export function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const { t, suggestSpanish } = useLanguage();

  return (
    <main className="home">
      <header className="home-top">
        <LanguageToggle />
        <button type="button" className="icon-btn" aria-label={t.settings} onClick={() => go("settings")}>
          <Icon name="settings" />
        </button>
      </header>
      {suggestSpanish && <SpanishSuggestion />}
      <nav className="mode-list" aria-label={t.modes}>
        {modes.map(({ mode, screen }) =>
          screen ? (
            <button key={mode} type="button" className="mode-card" data-mode={mode} onClick={() => go(screen)}>
              <span className="mode-name">{t[mode].name}</span>
              <span className="mode-blurb">{t[mode].blurb}</span>
            </button>
          ) : (
            <ComingSoonCard key={mode} mode={mode} />
          ),
        )}
      </nav>
    </main>
  );
}

/** A mode that isn't playable yet. It stays tappable (aria-disabled, not disabled) so a tap can answer with a wiggle. */
function ComingSoonCard({ mode }: { mode: Mode }) {
  const { t } = useLanguage();
  // Bumped on every tap; also the key that restarts the wiggle animation.
  const [taps, setTaps] = useState(0);

  return (
    <button
      key={taps}
      type="button"
      className={taps > 0 ? "mode-card mode-card-soon wiggle" : "mode-card mode-card-soon"}
      data-mode={mode}
      aria-disabled="true"
      onClick={() => setTaps(taps + 1)}
    >
      <span className="mode-name">{t[mode].name}</span>
      <span className="mode-soon">{t[mode].blurb}</span>
    </button>
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
