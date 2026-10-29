// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useState } from "react";
import type { Screen } from "./App";
import { ReportOverlay } from "./ReportOverlay";
import { GameDecor, GameIcon } from "./HalloweenIcons";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import type { HalloweenGame } from "./strings";
import { useSoundSetting } from "./useSpookySounds";

const games: HalloweenGame[] = ["talk", "trivia", "taboo", "categories"];

/** Home's Halloween card opens this: the four Halloween games. */
export function HalloweenMenu({ go, goHome }: { go: (screen: Screen) => void; goHome: () => void }) {
  const { language, t } = useLanguage();
  const sound = useSoundSetting();
  const [feedback, setFeedback] = useState(false);

  return (
    <main className="halloween-menu">
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={t.home} onClick={goHome}>
          <Icon name="home" />
        </button>
        <h1 className="halloween-menu-title">{t.halloween.name}</h1>
        <LanguageToggle />
      </header>
      <div className="halloween-tools">
        {/* On means sounds play by themselves: every 5 cards, and when a timer runs out. */}
        <button
          type="button"
          className="halloween-mute"
          aria-label={t.halloween.sounds}
          aria-pressed={!sound.muted}
          onClick={() => sound.setMuted(!sound.muted)}
        >
          <Icon name={sound.muted ? "soundOff" : "soundOn"} />
        </button>
        <button type="button" className="halloween-soundboard" onClick={() => go("halloween-sounds")}>
          {t.halloween.soundboard.name}
        </button>
      </div>
      <nav className="halloween-games" aria-label={t.halloween.menu}>
        {games.map((game) => (
          <button
            key={game}
            type="button"
            className="halloween-game"
            data-game={game}
            onClick={() => go(`halloween-${game}`)}
          >
            <span className="mode-name">{t.halloween.games[game].name}</span>
            <span className="mode-blurb">{t.halloween.games[game].blurb}</span>
            <GameIcon game={game} />
            <GameDecor game={game} />
          </button>
        ))}
      </nav>
      <button type="button" className="game-end halloween-feedback" onClick={() => setFeedback(true)}>
        {t.halloween.feedback.open}
      </button>
      {feedback && (
        <ReportOverlay
          card={{ itemId: "halloween-feedback", mode: "halloween-feedback", language, text: "", revealed: "" }}
          title={t.halloween.feedback.title}
          feedback
          onClose={() => setFeedback(false)}
        />
      )}
    </main>
  );
}
