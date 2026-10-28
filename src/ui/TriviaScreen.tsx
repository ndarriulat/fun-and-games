import type { ContentBank } from "@/content/bank";
import type { Language, TriviaItem } from "@/content/types";
import { playablePool, shownIn, shuffle } from "@/play/deal";
import { isHalloweenTopic } from "@/play/halloween";
import type { SavedState } from "@/play/storage";
import { useDeps } from "./deps";
import { useLanguage } from "./language";
import { CardControls, PlayScreen, questionSize } from "./PlayScreen";
import { useDeck } from "./useDeck";
import { useSpookyEveryFifth } from "./useSpookySounds";
import { useSwipe } from "./useSwipe";

/**
 * What has been revealed on a Trivia card. Options are kept as their shuffled order, by index into
 * [answer, ...wrong options], so they stay put when the language changes.
 */
type TriviaView = { options: number[] | null; revealed: boolean };

// Halloween 2026: regular Trivia leaves out Halloween questions; Halloween Trivia deals only them.
const loadTriviaPool = async (content: ContentBank, saved: SavedState, language: Language) =>
  playablePool(await content.trivia(), language, saved.topics).filter((item) => !isHalloweenTopic(item.topic));

const loadHalloweenPool = async (content: ContentBank, saved: SavedState, language: Language) =>
  playablePool(await content.trivia(), language, saved.topics).filter((item) => isHalloweenTopic(item.topic));

/** Trivia, or (Halloween 2026) its Halloween edition: the same cards and controls, with its own pool, name and colour. */
export function TriviaScreen({ goHome, edition }: { goHome: () => void; edition?: "halloween" }) {
  const { language } = useLanguage();
  const deck = useDeck<TriviaItem, TriviaView>({
    // The edition shares Trivia's played history; its IDs never overlap with Trivia's.
    mode: "trivia",
    language,
    loadPool: edition ? loadHalloweenPool : loadTriviaPool,
    initialView: { options: null, revealed: false },
  });
  useSpookyEveryFifth(deck.card?.key, edition === "halloween");

  return (
    <PlayScreen
      mode="trivia"
      edition={edition}
      card={deck.card && reportedTrivia(deck.card.item, deck.card.view, language)}
      reshuffled={deck.reshuffled}
      empty={deck.empty}
      goHome={goHome}
    >
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

/** The card as the player saw it, for Report. */
function reportedTrivia(item: TriviaItem, view: TriviaView, language: Language) {
  const shown = shownIn(item, language);
  const text = item[shown] ?? item.en;
  const choices = [text.answer, ...text.options];
  const lines = [text.question];
  if (view.options) lines.push(`Options: ${view.options.map((index) => choices[index]).join(" · ")}`);
  if (view.revealed) lines.push(`Answer: ${text.answer}`, `Fact: ${text.fact}`);
  const revealed = [view.options && "options shown", view.revealed && "answer revealed"].filter(Boolean);
  return {
    itemId: item.id,
    language: shown,
    text: lines.join("\n"),
    revealed: revealed.length > 0 ? revealed.join(", ") : "nothing",
  };
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
  const { language, t } = useLanguage();
  const swipe = useSwipe({ onLeft: onNext, onRight: onBack });
  // A card dealt in English and pending translation stays in English after a switch.
  const text = item[language] ?? item.en;
  const choices = [text.answer, ...text.options];
  const { options, revealed } = view;

  return (
    <>
      <div className="deck">
        <article className={revealed ? "card card-back" : "card card-front"} {...swipe}>
          <div className="card-scroll">
            <div className="card-meta">
              <span>{t.triviaTopics[item.topic]}</span>
              <span>{t.difficulties[item.difficulty]}</span>
            </div>
            {/* With the four options showing, the question steps down a size so they fit without scrolling. */}
            <p className={revealed ? "question-small" : `question ${questionSize(text.question, options ? 1 : 0)}`}>
              {text.question}
            </p>
            {revealed && <p className="answer">{text.answer}</p>}
            {!options && !revealed && (
              <button
                type="button"
                className="option option-show"
                onClick={() => onView({ ...view, options: shuffle(choices.map((_, i) => i), random) })}
              >
                {t.showOptions}
              </button>
            )}
            {options && (
              <ol className="options" aria-label={t.options}>
                {options.map((index) => {
                  // Index 0 is the answer.
                  const correct = revealed && index === 0;
                  return (
                    <li
                      key={index}
                      className={correct ? "option option-correct" : "option"}
                      aria-label={correct ? t.correct(choices[index]) : undefined}
                    >
                      {choices[index]}
                    </li>
                  );
                })}
              </ol>
            )}
            {revealed && <p className="fact">{text.fact}</p>}
          </div>
        </article>
      </div>
      <CardControls
        main={revealed ? { label: t.next, onClick: onNext } : { label: t.reveal, onClick: () => onView({ ...view, revealed: true }) }}
        onNext={onNext}
        onBack={onBack}
      />
    </>
  );
}
