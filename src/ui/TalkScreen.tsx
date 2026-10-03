import type { ContentBank } from "@/content/bank";
import type { Language, TalkItem } from "@/content/types";
import { playablePool } from "@/play/deal";
import type { SavedState } from "@/play/storage";
import { talkTopicLabels } from "./labels";
import { CardControls, PlayScreen, questionSize } from "./PlayScreen";
import { useDeck } from "./useDeck";
import { useSwipe } from "./useSwipe";

const language: Language = "en";

/** What has been revealed on a Talk card: how many follow-ups are showing. */
type TalkView = { followUps: number };

const loadTalkPool = async (content: ContentBank, saved: SavedState) =>
  playablePool(await content.talk(), language, saved.topics);

export function TalkScreen({ goHome }: { goHome: () => void }) {
  const deck = useDeck<TalkItem, TalkView>({
    mode: "talk",
    loadPool: loadTalkPool,
    initialView: { followUps: 0 },
  });

  return (
    <PlayScreen mode="talk" title="Talk" reshuffled={deck.reshuffled} empty={deck.empty} goHome={goHome}>
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
  const swipe = useSwipe({ onLeft: onNext, onRight: onBack });
  const text = item[language]!;
  const shownFollowUps = text.followUps.slice(0, view.followUps);
  const followUpsLeft = view.followUps < text.followUps.length;

  return (
    <>
      <div className="deck">
        <article className="card card-front" {...swipe}>
          <div className="card-scroll">
            <div className="card-meta">
              <span>{talkTopicLabels[item.topic]}</span>
            </div>
            <p className={`question ${questionSize(text.question)}`}>{text.question}</p>
            {item.type === "would-you-rather" && (
              <ul className="choices" aria-label="Choices">
                <li className="choice">{text.optionA}</li>
                <li className="choice">{text.optionB}</li>
              </ul>
            )}
            {shownFollowUps.length > 0 && (
              <ol className="follow-ups" aria-label="Follow-ups">
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
            ? { label: "Follow-up", onClick: () => onView({ followUps: view.followUps + 1 }) }
            : { label: "Next", onClick: onNext }
        }
        onNext={onNext}
        onBack={onBack}
      />
    </>
  );
}
