// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useEffect, useMemo, useState, type ReactNode } from "react";
import words from "../../content/halloween/taboo.json";
import { gameSave, shuffledIndexes } from "@/play/halloweenSaves";
import { ConfirmDialog } from "./ConfirmDialog";
import { useDeps } from "./deps";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { useCountdown } from "./useCountdown";
import { useSpookySound } from "./useSpookySounds";

/** Each team plays this many turns, alternating, Team 1 first. */
const TURNS_PER_TEAM = 2;
const TURNS = TURNS_PER_TEAM * 2;
const TURN_MS = 60_000;
const SKIPS_PER_TURN = 3;

type Phase = "ready" | "playing" | "paused" | "turn-over" | "game-over";

/** Everything about a game in progress. Saved after every change, so a refresh picks it up. */
export type TabooGame = {
  phase: Phase;
  /** 0 to TURNS - 1. Even turns are Team 1's. */
  turn: number;
  scores: [number, number];
  turnPoints: number;
  skips: number;
  timeLeftMs: number;
  /** The word list's indexes in dealing order, and how far through it the game is. */
  order: number[];
  position: number;
};

const phases: Phase[] = ["ready", "playing", "paused", "turn-over", "game-over"];

function isTabooGame(value: unknown): value is TabooGame {
  const game = value as TabooGame;
  return (
    typeof value === "object" &&
    value !== null &&
    phases.includes(game.phase) &&
    Number.isInteger(game.turn) &&
    Array.isArray(game.scores) &&
    game.scores.length === 2 &&
    typeof game.turnPoints === "number" &&
    typeof game.skips === "number" &&
    typeof game.timeLeftMs === "number" &&
    Array.isArray(game.order) &&
    game.order.length > 0 &&
    Number.isInteger(game.position)
  );
}

/** Team 1 or 2, for a turn. */
const teamOf = (turn: number) => (turn % 2) + 1;

export function TabooScreen({ goHome }: { goHome: () => void }) {
  const { storage, random, spookySounds } = useDeps();
  const timeUpSound = useSpookySound();
  const { language, t } = useLanguage();
  const save = useMemo(() => gameSave(storage, "taboo", isTabooGame), [storage]);
  // A game left mid-turn comes back paused, with the time it had.
  const [saved, setSaved] = useState(() => {
    const game = save.load();
    return game && game.phase === "playing" ? { ...game, phase: "paused" as const } : game;
  });
  const [game, setGame] = useState<TabooGame | null>(null);
  const [confirming, setConfirming] = useState<"end" | "new" | null>(null);

  useEffect(() => {
    if (game) save.save(game);
  }, [game, save]);

  const s = t.halloween.taboo;
  const list = words[language];

  function newGame() {
    setGame({
      phase: "ready",
      turn: 0,
      scores: [0, 0],
      turnPoints: 0,
      skips: 0,
      timeLeftMs: TURN_MS,
      order: shuffledIndexes(list.length, random),
      position: 0,
    });
  }

  useCountdown({
    running: game?.phase === "playing" && !confirming,
    timeLeftMs: game?.timeLeftMs ?? 0,
    onTick: (timeLeftMs) => setGame((current) => current && { ...current, timeLeftMs }),
    onEnd: () => {
      timeUpSound();
      setGame(
        (current) =>
          current && { ...current, timeLeftMs: 0, phase: current.turn === TURNS - 1 ? "game-over" : "turn-over" },
      );
    },
    onHidden: () => setGame((current) => current && { ...current, phase: "paused" }),
  });

  /** Scores the word on screen (+1, -1 or 0 for a skip) and deals the next one. */
  function answer(points: number, skip = false) {
    setGame((current) => {
      if (!current || current.phase !== "playing") return current;
      const team = current.turn % 2;
      const scores: [number, number] = [...current.scores];
      scores[team] += points;
      return {
        ...current,
        scores,
        turnPoints: current.turnPoints + points,
        skips: current.skips + (skip ? 1 : 0),
        position: current.position + 1,
      };
    });
  }

  /** Throws the game away, after the player confirmed: back to the start, with nothing to continue. */
  function endGame() {
    save.save(null);
    setSaved(null);
    setGame(null);
  }

  function nextTurn() {
    setGame((current) =>
      current && { ...current, phase: "ready", turn: current.turn + 1, turnPoints: 0, skips: 0, timeLeftMs: TURN_MS },
    );
  }

  const frame = (children: ReactNode) => (
    <main className="play halloween-game-screen" data-mode="halloween" onClickCapture={spookySounds.unlock}>
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label={t.halloween.menuBack} onClick={goHome}>
          <Icon name="home" />
        </button>
        <span className="chip">
          <span className="chip-text">{t.halloween.games.taboo.title}</span>
        </span>
        <LanguageToggle />
      </header>
      {game && game.phase !== "game-over" && <Scores scores={game.scores} turn={game.turn} />}
      <div className="game-body">{children}</div>
      {game && game.phase !== "game-over" && (
        <button
          type="button"
          className="game-end"
          onClick={() => {
            // The clock stops while the question is open.
            if (game.phase === "playing") setGame({ ...game, phase: "paused" });
            setConfirming("end");
          }}
        >
          {t.halloween.endGame}
        </button>
      )}
      {confirming && (
        <ConfirmDialog
          title={confirming === "end" ? t.halloween.endGameTitle : t.halloween.newGameTitle}
          body={confirming === "end" ? t.halloween.endGameBody : t.halloween.newGameBody}
          confirm={confirming === "end" ? t.halloween.endGame : t.halloween.newGame}
          cancel={t.halloween.keepPlaying}
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            const what = confirming;
            setConfirming(null);
            if (what === "end") endGame();
            else newGame();
          }}
        />
      )}
    </main>
  );

  if (!game) {
    return frame(
      <section className="game-panel">
        <p className="game-lead">{s.rules}</p>
        <div className="game-actions">
          {saved && saved.phase !== "game-over" && (
            <button type="button" className="game-button game-button-main" onClick={() => setGame(saved)}>
              {s.continueGame(saved.turn + 1, `${saved.scores[0]}–${saved.scores[1]}`)}
            </button>
          )}
          <button
            type="button"
            className={saved && saved.phase !== "game-over" ? "game-button" : "game-button game-button-main"}
            onClick={() => (saved && saved.phase !== "game-over" ? setConfirming("new") : newGame())}
          >
            {s.newGame}
          </button>
        </div>
      </section>,
    );
  }

  const team = teamOf(game.turn);
  const other = team === 1 ? 2 : 1;
  const seconds = Math.ceil(game.timeLeftMs / 1000);

  if (game.phase === "ready") {
    return frame(
      <section className="game-panel">
        <h2 className="game-heading">{s.turnOf(team, Math.floor(game.turn / 2) + 1, TURNS_PER_TEAM)}</h2>
        <p className="game-lead">{s.passPhone(team, other)}</p>
        <button
          type="button"
          className="game-button game-button-main"
          onClick={() => setGame({ ...game, phase: "playing" })}
        >
          {s.startTurn}
        </button>
      </section>,
    );
  }

  if (game.phase === "paused") {
    return frame(
      <section className="game-panel">
        <h2 className="game-heading">{s.turnOf(team, Math.floor(game.turn / 2) + 1, TURNS_PER_TEAM)}</h2>
        <p className="game-lead">{t.halloween.paused(seconds)}</p>
        <button
          type="button"
          className="game-button game-button-main"
          onClick={() => setGame({ ...game, phase: "playing" })}
        >
          {t.halloween.resume}
        </button>
      </section>,
    );
  }

  if (game.phase === "turn-over") {
    return frame(
      <section className="game-panel">
        <h2 className="game-heading">{s.timeUp}</h2>
        <p className="game-lead">{s.turnScore(team, game.turnPoints)}</p>
        <button type="button" className="game-button game-button-main" onClick={nextTurn}>
          {s.nextTurn(other)}
        </button>
      </section>,
    );
  }

  if (game.phase === "game-over") {
    const [one, two] = game.scores;
    return frame(
      <section className="game-panel">
        <h2 className="game-heading game-heading-big">{one === two ? s.tie : s.wins(one > two ? 1 : 2)}</h2>
        <Scores scores={game.scores} />
        <div className="game-actions">
          <button type="button" className="game-button game-button-main" onClick={newGame}>
            {s.playAgain}
          </button>
          <button type="button" className="game-button" onClick={goHome}>
            {t.halloween.menuBack}
          </button>
        </div>
      </section>,
    );
  }

  const word = list[game.order[game.position % game.order.length] % list.length];
  const skipsLeft = SKIPS_PER_TURN - game.skips;

  return frame(
    <>
      <Timer seconds={seconds} total={TURN_MS / 1000} onPause={() => setGame({ ...game, phase: "paused" })} />
      <article className="taboo-card" aria-live="polite">
        <p className="taboo-word">{word.word}</p>
        <p className="taboo-label">{s.dontSay}</p>
        <ul className="taboo-forbidden">
          {word.forbidden.map((forbidden) => (
            <li key={forbidden}>{forbidden}</li>
          ))}
        </ul>
      </article>
      <div className="taboo-buttons">
        <button type="button" className="game-button taboo-buzz" onClick={() => answer(-1)}>
          {s.buzz} −1
        </button>
        <button type="button" className="game-button" disabled={skipsLeft === 0} onClick={() => answer(0, true)}>
          {s.skip(skipsLeft)}
        </button>
        <button type="button" className="game-button game-button-main" onClick={() => answer(1)}>
          {s.correct} +1
        </button>
      </div>
    </>,
  );
}

/** Both teams' scores, the team on turn highlighted. */
function Scores({ scores, turn }: { scores: [number, number]; turn?: number }) {
  const { t } = useLanguage();
  return (
    <dl className="taboo-scores" aria-label={t.halloween.taboo.score}>
      {scores.map((score, i) => (
        <div key={i} className={turn !== undefined && turn % 2 === i ? "taboo-team taboo-team-up" : "taboo-team"}>
          <dt>{t.halloween.taboo.team(i + 1)}</dt>
          <dd>{score}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The seconds left, as a number and a draining bar, with Pause. */
export function Timer({
  seconds,
  total,
  onPause,
  onSkip,
}: {
  seconds: number;
  total: number;
  onPause: () => void;
  /** Categories only: skip the round, after asking. */
  onSkip?: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className={seconds <= 10 ? "game-timer game-timer-low" : "game-timer"}>
      <div className="game-timer-bar" aria-hidden="true">
        <span style={{ width: `${(seconds / total) * 100}%` }} />
      </div>
      <span className="game-timer-seconds" role="timer" aria-label={t.halloween.secondsLeft(seconds)}>
        {seconds}
      </span>
      <button type="button" className="game-pause" onClick={onPause}>
        {t.halloween.pause}
      </button>
      {onSkip && (
        <button type="button" className="game-pause" onClick={onSkip}>
          {t.halloween.categories.skip}
        </button>
      )}
    </div>
  );
}
