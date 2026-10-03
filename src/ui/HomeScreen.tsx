import type { Mode } from "@/content/types";
import { Icon } from "./icons";
import type { Screen } from "./App";

const modes: { mode: Mode; name: string; blurb: string; screen?: Screen }[] = [
  { mode: "trivia", name: "Trivia", blurb: "Guess the answer, then reveal", screen: "trivia" },
  // Puzzles arrives in v1.1, so it has no screen yet.
  { mode: "puzzles", name: "Puzzles", blurb: "Coming soon" },
  { mode: "talk", name: "Talk", blurb: "Questions to get everyone talking", screen: "talk" },
];

export function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <main className="home">
      <header className="home-top">
        <h1 className="brand">Vamos</h1>
        <button type="button" className="icon-btn" aria-label="Settings" onClick={() => go("settings")}>
          <Icon name="settings" />
        </button>
      </header>
      <nav className="mode-list" aria-label="Modes">
        {modes.map(({ mode, name, blurb, screen }) => (
          <button
            key={mode}
            type="button"
            className="mode-card"
            data-mode={mode}
            disabled={!screen}
            onClick={screen && (() => go(screen))}
          >
            <span className="mode-name">{name}</span>
            <span className="mode-blurb">{blurb}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
