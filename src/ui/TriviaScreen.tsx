import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Language, TriviaItem } from "@/content/types";
import { pickNext, shuffle, triviaPool } from "@/play/deal";
import { useDeps } from "./deps";
import { Icon } from "./icons";
import { difficultyLabels, triviaTopicLabels } from "./labels";

const language: Language = "en";

export function TriviaScreen({ goHome }: { goHome: () => void }) {
  const { content, random } = useDeps();
  const [pool, setPool] = useState<TriviaItem[] | null>(null);
  const [card, setCard] = useState<TriviaItem | undefined>(undefined);
  const [cardKey, setCardKey] = useState(0);

  function next() {
    if (!pool) return;
    setCard(pickNext(pool, card, random));
    setCardKey((key) => key + 1);
  }

  useEffect(() => {
    let cancelled = false;
    content.trivia().then((items) => {
      if (cancelled) return;
      const available = triviaPool(items, language);
      setPool(available);
      setCard(pickNext(available, undefined, random));
    });
    return () => {
      cancelled = true;
    };
  }, [content, random]);

  return (
    <main className="play" data-mode="trivia">
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label="Home" onClick={goHome}>
          <Icon name="home" />
        </button>
        <span className="chip">
          <i aria-hidden="true" /> Trivia · all topics
        </span>
      </header>
      {pool !== null && card === undefined && <p className="empty">No Trivia cards yet.</p>}
      {card && <TriviaCard key={cardKey} item={card} onNext={next} />}
    </main>
  );
}

function TriviaCard({ item, onNext }: { item: TriviaItem; onNext: () => void }) {
  const { random } = useDeps();
  const swipe = useSwipe({ onLeft: onNext });
  const text = item[language]!;
  const [options, setOptions] = useState<string[] | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <div className="deck">
        <article className={revealed ? "card card-back" : "card card-front"} {...swipe}>
          <div className="card-scroll">
            <div className="card-meta">
              <span>{triviaTopicLabels[item.topic]}</span>
              <span>{difficultyLabels[item.difficulty]}</span>
            </div>
            <p className={revealed ? "question-small" : `question ${questionSize(text.question)}`}>{text.question}</p>
            {revealed && <p className="answer">{text.answer}</p>}
            {options && (
              <ol className="options" aria-label="Options">
                {options.map((option) => {
                  const correct = revealed && option === text.answer;
                  return (
                    <li
                      key={option}
                      className={correct ? "option option-correct" : "option"}
                      aria-label={correct ? `Correct: ${option}` : undefined}
                    >
                      {option}
                    </li>
                  );
                })}
              </ol>
            )}
            {revealed && <p className="fact">{text.fact}</p>}
          </div>
        </article>
      </div>
      <div className="links">
        {!options && !revealed && (
          <button type="button" className="link" onClick={() => setOptions(shuffle([text.answer, ...text.options], random))}>
            Show options
          </button>
        )}
      </div>
      <div className="controls">
        <button type="button" className="round" aria-label="Previous card" disabled>
          <Icon name="back" />
        </button>
        {revealed ? (
          <button type="button" className="round round-main" onClick={onNext}>
            Next
          </button>
        ) : (
          <button type="button" className="round round-main" onClick={() => setRevealed(true)}>
            Reveal
          </button>
        )}
        <button type="button" className="round" aria-label="Next card" onClick={onNext}>
          <Icon name="next" />
        </button>
      </div>
    </>
  );
}

/** Longer questions step down in size so they still fit on the card. */
function questionSize(question: string) {
  if (question.length < 60) return "question-s";
  if (question.length < 110) return "question-m";
  if (question.length < 200) return "question-l";
  return "question-xl";
}

const SWIPE_DISTANCE = 60;

/** Horizontal swipe detection. Mostly vertical drags are left alone so the card can scroll. */
function useSwipe({ onLeft }: { onLeft: () => void }) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown(event: PointerEvent) {
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerCancel() {
      start.current = null;
    },
    onPointerUp(event: PointerEvent) {
      if (!start.current) return;
      const dx = event.clientX - start.current.x;
      const dy = Math.abs(event.clientY - start.current.y);
      start.current = null;
      if (dx < -SWIPE_DISTANCE && dy < Math.abs(dx) * 0.6) onLeft();
    },
  };
}
