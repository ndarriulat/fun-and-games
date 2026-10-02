import type { Mode } from "@/content/types";
import { Icon } from "./icons";
import type { Screen } from "./App";

const modes: { mode: Mode; name: string; blurb: string }[] = [
  { mode: "trivia", name: "Trivia", blurb: "Guess the answer, then reveal" },
  { mode: "puzzles", name: "Puzzles", blurb: "Riddles, logic, maths and words" },
  { mode: "talk", name: "Talk", blurb: "Questions to get everyone talking" },
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
        {modes.map(({ mode, name, blurb }) => (
          <button key={mode} type="button" className="mode-card" data-mode={mode} onClick={() => go(mode)}>
            <span className="mode-name">{name}</span>
            <span className="mode-blurb">{blurb}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
