import { useState, type ReactNode } from "react";
import type { Mode } from "@/content/types";
import { useDeps, type ReportedCard } from "./deps";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { ReportOverlay } from "./ReportOverlay";

/** The frame around every mode's card: top row, the reshuffle notice, the empty state and Report. */
export function PlayScreen({
  mode,
  edition,
  card,
  reshuffled,
  empty,
  goHome,
  children,
}: {
  mode: Exclude<Mode, "puzzles">;
  /** Halloween 2026: a special edition of the mode, with its own name and colour. Reports still say the mode. */
  edition?: "halloween";
  /** The card on screen, for Report. Missing while there's none. */
  card?: Omit<ReportedCard, "mode">;
  reshuffled: boolean;
  empty: boolean;
  goHome: () => void;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const [reporting, setReporting] = useState(false);
  const { spookySounds } = useDeps();
  const title = edition ? t.halloween.games[mode].title : t[mode].name;

  return (
    // Halloween 2026: phones only allow sound after a tap, so taps here let the spooky sounds play later.
    <main className="play" data-mode={edition ?? mode} onPointerDown={edition ? spookySounds.unlock : undefined}>
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={edition ? t.halloween.menuBack : t.home} onClick={goHome}>
          <Icon name="home" />
        </button>
        <span className="chip">
          <i aria-hidden="true" />
          {/* Ticket 08 brings back the selection after the mode, e.g. "Trivia · all topics". */}
          <span className="chip-text">{title}</span>
        </span>
        <LanguageToggle />
        <button
          type="button"
          className="icon-btn"
          aria-label={t.report.open}
          disabled={!card}
          onClick={() => setReporting(true)}
        >
          <Icon name="report" />
        </button>
      </header>
      {reshuffled && (
        <p className="notice" role="status">
          {t.reshuffled}
        </p>
      )}
      {empty && <p className="empty">{t.noCards(title)}</p>}
      {children}
      {reporting && card && <ReportOverlay card={{ ...card, mode }} onClose={() => setReporting(false)} />}
    </main>
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
      {/* Longer labels ("Respuesta", "Siguiente", "Follow-up") step down so they stay inside the circle. */}
      <button
        type="button"
        className={main.label.length > 6 ? "round round-main round-main-long" : "round round-main"}
        onClick={main.onClick}
      >
        {main.label}
      </button>
      <button type="button" className="round" aria-label={t.nextCard} onClick={onNext}>
        <Icon name="next" />
      </button>
    </div>
  );
}

const QUESTION_SIZES = ["question-s", "question-m", "question-l", "question-xl"];

/** Longer questions step down in size so they still fit on the card. `smaller` steps down further when the card holds more. */
export function questionSize(question: string, smaller = 0) {
  const size = question.length < 60 ? 0 : question.length < 110 ? 1 : question.length < 200 ? 2 : 3;
  return QUESTION_SIZES[Math.min(size + smaller, QUESTION_SIZES.length - 1)];
}
