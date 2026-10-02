import type { ContentBank } from "@/content/bank";
import type { Language, TriviaItem } from "@/content/types";
import { shuffle, triviaPool } from "@/play/deal";
import { useDeps } from "./deps";
import { Icon } from "./icons";
import { difficultyLabels, triviaTopicLabels } from "./labels";
import { useDeck } from "./useDeck";
import { useSwipe } from "./useSwipe";

const language: Language = "en";

/** What has been revealed on a Trivia card. */
type TriviaView = { options: string[] | null; revealed: boolean };

const loadTriviaPool = async (content: ContentBank) => triviaPool(await content.trivia(), language);

export function TriviaScreen({ goHome }: { goHome: () => void }) {
  const deck = useDeck<TriviaItem, TriviaView>({
    mode: "trivia",
    loadPool: loadTriviaPool,
    initialView: { options: null, revealed: false },
  });

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
      {deck.reshuffled && (
        <p className="notice" role="status">
          You&apos;ve played everything, starting again.
        </p>
      )}
      {deck.empty && <p className="empty">No Trivia cards yet.</p>}
      {deck.card && (
        <TriviaCard
          key={deck.card.key}
          item={deck.card.item}
          view={deck.card.view}
          onView={deck.setView}
          onNext={deck.next}
          onBack={deck.canGoBack ? deck.back : undefined}
        />
      )}
    </main>
  );
}

function TriviaCard({
  item,
  view,
  onView,
  onNext,
  onBack,
}: {
  item: TriviaItem;
  view: TriviaView;
  onView: (view: TriviaView) => void;
  onNext: () => void;
  /** Missing on the first card of the trail. */
  onBack?: () => void;
}) {
  const { random } = useDeps();
  const swipe = useSwipe({ onLeft: onNext, onRight: onBack });
  const text = item[language]!;
  const { options, revealed } = view;

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
          <button
            type="button"
            className="link"
            onClick={() => onView({ ...view, options: shuffle([text.answer, ...text.options], random) })}
          >
            Show options
          </button>
        )}
      </div>
      <div className="controls">
        <button type="button" className="round" aria-label="Previous card" disabled={!onBack} onClick={onBack}>
          <Icon name="back" />
        </button>
        {revealed ? (
          <button type="button" className="round round-main" onClick={onNext}>
            Next
          </button>
        ) : (
          <button type="button" className="round round-main" onClick={() => onView({ ...view, revealed: true })}>
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
