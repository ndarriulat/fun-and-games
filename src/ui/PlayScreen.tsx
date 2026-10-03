import type { ReactNode } from "react";
import { languages, type Mode } from "@/content/types";
import { Icon } from "./icons";
import { useLanguage } from "./language";

/** The frame around every mode's card: top row, the reshuffle notice and the empty state. */
export function PlayScreen({
  mode,
  reshuffled,
  empty,
  goHome,
  children,
}: {
  mode: Exclude<Mode, "puzzles">;
  reshuffled: boolean;
  empty: boolean;
  goHome: () => void;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const title = t[mode].name;

  return (
    <main className="play" data-mode={mode}>
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={t.home} onClick={goHome}>
          <Icon name="home" />
        </button>
        <span className="chip">
          <i aria-hidden="true" />
          <span className="chip-text">
            {title} · {t.allTopics}
          </span>
        </span>
        <LanguageToggle />
      </header>
      {reshuffled && (
        <p className="notice" role="status">
          {t.reshuffled}
        </p>
      )}
      {empty && <p className="empty">{t.noCards(title)}</p>}
      {children}
    </main>
  );
}

/** Switches language without leaving the card, for a mixed group. */
function LanguageToggle() {
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

/** Back, the mode's main action and Next, under the card. */
export function CardControls({
  main,
  onNext,
  onBack,
}: {
  main: { label: string; onClick: () => void };
  onNext: () => void;
  /** Missing on the first card of the trail. */
  onBack?: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="controls">
      <button type="button" className="round" aria-label={t.previousCard} disabled={!onBack} onClick={onBack}>
        <Icon name="back" />
      </button>
      <button type="button" className="round round-main" onClick={main.onClick}>
        {main.label}
      </button>
      <button type="button" className="round" aria-label={t.nextCard} onClick={onNext}>
        <Icon name="next" />
      </button>
    </div>
  );
}

/** Longer questions step down in size so they still fit on the card. */
export function questionSize(question: string) {
  if (question.length < 60) return "question-s";
  if (question.length < 110) return "question-m";
  if (question.length < 200) return "question-l";
  return "question-xl";
}
