import type { ReactNode } from "react";
import type { Mode } from "@/content/types";
import { Icon } from "./icons";

/** The frame around every mode's card: top row, the reshuffle notice and the empty state. */
export function PlayScreen({
  mode,
  title,
  reshuffled,
  empty,
  goHome,
  children,
}: {
  mode: Mode;
  title: string;
  reshuffled: boolean;
  empty: boolean;
  goHome: () => void;
  children: ReactNode;
}) {
  return (
    <main className="play" data-mode={mode}>
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label="Home" onClick={goHome}>
          <Icon name="home" />
        </button>
        <span className="chip">
          <i aria-hidden="true" /> {title} · all topics
        </span>
      </header>
      {reshuffled && (
        <p className="notice" role="status">
          You&apos;ve played everything, starting again.
        </p>
      )}
      {empty && <p className="empty">No {title} cards yet.</p>}
      {children}
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
  return (
    <div className="controls">
      <button type="button" className="round" aria-label="Previous card" disabled={!onBack} onClick={onBack}>
        <Icon name="back" />
      </button>
      <button type="button" className="round round-main" onClick={main.onClick}>
        {main.label}
      </button>
      <button type="button" className="round" aria-label="Next card" onClick={onNext}>
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
