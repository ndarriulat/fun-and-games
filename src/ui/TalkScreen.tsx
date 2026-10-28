import type { ContentBank } from "@/content/bank";
import type { Language, TalkItem } from "@/content/types";
import { playablePool, shownIn } from "@/play/deal";
import { isHalloweenTopic } from "@/play/halloween";
import type { SavedState } from "@/play/storage";
import { useLanguage } from "./language";
import { CardControls, PlayScreen, questionSize } from "./PlayScreen";
import { useDeck } from "./useDeck";
import { useSwipe } from "./useSwipe";

/** What has been revealed on a Talk card: how many follow-ups are showing. */
type TalkView = { followUps: number };

// Halloween 2026: regular Talk leaves out Halloween cards; Halloween Talk deals only them.
const loadTalkPool = async (content: ContentBank, saved: SavedState, language: Language) =>
  playablePool(await content.talk(), language, saved.topics).filter((item) => !isHalloweenTopic(item.topic));

const loadHalloweenPool = async (content: ContentBank, saved: SavedState, language: Language) =>
  playablePool(await content.talk(), language, saved.topics).filter((item) => isHalloweenTopic(item.topic));

/** Talk, or (Halloween 2026) its Halloween edition: the same cards and controls, with its own pool, name and colour. */
export function TalkScreen({ goHome, edition }: { goHome: () => void; edition?: "halloween" }) {
  const { language } = useLanguage();
  const deck = useDeck<TalkItem, TalkView>({
    // The edition shares Talk's played history; its IDs never overlap with Talk's.
    mode: "talk",
    language,
    loadPool: edition ? loadHalloweenPool : loadTalkPool,
    initialView: { followUps: 0 },
  });

  return (
    <PlayScreen
      mode="talk"
      edition={edition}
      card={deck.card && reportedTalk(deck.card.item, deck.card.view, language)}
      reshuffled={deck.reshuffled}
      empty={deck.empty}
      goHome={goHome}
    >
      {deck.card && (
        <TalkCard
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
function reportedTalk(item: TalkItem, view: TalkView, language: Language) {
  const shown = shownIn(item, language);
  const text = item[shown] ?? item.en;
  const lines = [text.question];
  if (item.type === "would-you-rather") lines.push(`A: ${text.optionA}`, `B: ${text.optionB}`);
  for (const followUp of text.followUps.slice(0, view.followUps)) lines.push(`Follow-up: ${followUp}`);
  return {
    itemId: item.id,
    language: shown,
    text: lines.join("\n"),
    revealed: `${view.followUps} of ${text.followUps.length} follow-ups`,
  };
}

function TalkCard({
  item,
  view,
  onView,
  onNext,
  onBack,
}: {
  item: TalkItem;
  view: TalkView;
  onView: (view: TalkView) => void;
  onNext: () => void;
  /** Missing on the first card of the trail. */
  onBack?: () => void;
}) {
  const { language, t } = useLanguage();
  const swipe = useSwipe({ onLeft: onNext, onRight: onBack });
  // A card dealt in English and pending translation stays in English after a switch.
  const text = item[language] ?? item.en;
  const shownFollowUps = text.followUps.slice(0, view.followUps);
  const followUpsLeft = view.followUps < text.followUps.length;

  return (
    <>
      <div className="deck">
        <article className="card card-front" {...swipe}>
          <div className="card-scroll">
            <div className="card-meta">
              <span>{t.talkTopics[item.topic]}</span>
            </div>
            <p className={`question ${questionSize(text.question)}`}>{text.question}</p>
            {item.type === "would-you-rather" && (
              <ul className="choices" aria-label={t.choices}>
                <li className="choice">{text.optionA}</li>
                <li className="choice">{text.optionB}</li>
              </ul>
            )}
            {shownFollowUps.length > 0 && (
              <ol className="follow-ups" aria-label={t.followUps}>
                {shownFollowUps.map((followUp) => (
                  <li key={followUp} className="follow-up">
                    {followUp}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </article>
      </div>
      {/* Talk has no secondary action, but keeps the row so the controls sit where they do in Trivia. */}
      <div className="links" />
      <CardControls
        main={
          followUpsLeft
            ? { label: t.followUp, onClick: () => onView({ followUps: view.followUps + 1 }) }
            : { label: t.next, onClick: onNext }
        }
        onNext={onNext}
        onBack={onBack}
      />
    </>
  );
}
