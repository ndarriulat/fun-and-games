// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useDeps } from "./deps";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { soundNames } from "./spookySounds";

/** The spooky sounds on demand, just for fun. Plays even when the automatic sounds are muted. */
export function SoundboardScreen({ goHome }: { goHome: () => void }) {
  const { spookySounds } = useDeps();
  const { t } = useLanguage();
  const s = t.halloween.soundboard;

  return (
    <main className="play halloween-game-screen" data-mode="halloween">
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={t.halloween.menuBack} onClick={goHome}>
          <Icon name="home" />
        </button>
        <span className="chip">
          <span className="chip-text">{s.name}</span>
        </span>
        <LanguageToggle />
      </header>
      <div className="game-body">
        <section className="game-panel">
          <p className="game-lead">{s.lead}</p>
        </section>
        <div className="soundboard">
          {soundNames.map((name) => (
            <button key={name} type="button" className="sound-tile" onClick={() => spookySounds.play(name)}>
              {s.names[name]}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
