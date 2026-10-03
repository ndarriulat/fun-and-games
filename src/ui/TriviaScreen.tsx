import type { ContentBank } from "@/content/bank";
import type { Language, TriviaItem } from "@/content/types";
import { playablePool, shuffle } from "@/play/deal";
import type { SavedState } from "@/play/storage";
import { useDeps } from "./deps";
import { difficultyLabels, triviaTopicLabels } from "./labels";
import { CardControls, PlayScreen, questionSize } from "./PlayScreen";
import { useDeck } from "./useDeck";
import { useSwipe } from "./useSwipe";

const language: Language = "en";

/** What has been revealed on a Trivia card. */
type TriviaView = { options: string[] | null; revealed: boolean };

const loadTriviaPool = async (content: ContentBank, saved: SavedState) =>
  playablePool(await content.trivia(), language, saved.topics);

export function TriviaScreen({ goHome }: { goHome: () => void }) {
  const deck = useDeck<TriviaItem, TriviaView>({
    mode: "trivia",
    loadPool: loadTriviaPool,
    initialView: { options: null, revealed: false },
  });

  return (
    <PlayScreen mode="trivia" title="Trivia" reshuffled={deck.reshuffled} empty={deck.empty} goHome={goHome}>
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
    </PlayScreen>
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
      <CardControls
        main={revealed ? { label: "Next", onClick: onNext } : { label: "Reveal", onClick: () => onView({ ...view, revealed: true }) }}
        onNext={onNext}
        onBack={onBack}
      />
    </>
  );
}
