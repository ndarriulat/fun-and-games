// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import type { Screen } from "./App";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import type { HalloweenGame } from "./strings";
import { useSoundSetting } from "./useSpookySounds";

const games: HalloweenGame[] = ["talk", "trivia", "taboo", "categories"];

/** Home's Halloween card opens this: the four Halloween games. */
export function HalloweenMenu({ go, goHome }: { go: (screen: Screen) => void; goHome: () => void }) {
  const { t } = useLanguage();
  const sound = useSoundSetting();

  return (
    <main className="halloween-menu">
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={t.home} onClick={goHome}>
          <Icon name="home" />
        </button>
        <h1 className="halloween-menu-title">{t.halloween.name}</h1>
        <LanguageToggle />
      </header>
      <button
        type="button"
        className="halloween-sound"
        aria-pressed={!sound.muted}
        onClick={() => sound.setMuted(!sound.muted)}
      >
        <Icon name={sound.muted ? "soundOff" : "soundOn"} />
        {t.halloween.sounds}
      </button>
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
          </button>
        ))}
      </nav>
    </main>
  );
}
