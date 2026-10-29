// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useEffect, useMemo, useState, type ReactNode } from "react";
import categories from "../../content/halloween/categories.json";
import { gameSave, shuffledIndexes } from "@/play/halloweenSaves";
import { ConfirmDialog } from "./ConfirmDialog";
import { ReportOverlay } from "./ReportOverlay";
import { useDeps } from "./deps";
import { Icon } from "./icons";
import { useLanguage } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { Timer } from "./TabooScreen";
import { useCountdown } from "./useCountdown";
import { useSpookySound } from "./useSpookySounds";

const ROUND_MS = 60_000;
const FIRST_BID = 5;
const MAX_BID = 40;
const MAX_PLAYERS = 12;

/**
 * pick: the category, choose how to play it. bid: settle the top bid and who made it. bidding /
 * duel / writing: the 60 seconds (one bidder names them out loud; tied bidders each write a list;
 * everyone writes). paused: any of those, stopped. made / missed / duel-over / pens-down: how the
 * round ended. over: final scores.
 */
type Phase =
  | "pick"
  | "bid"
  | "bidding"
  | "duel"
  | "writing"
  | "paused"
  | "made"
  | "missed"
  | "duel-over"
  | "pens-down"
  | "over";
type Timed = "bidding" | "duel" | "writing";

/** A game in progress. Saved after every change, so a refresh picks it up. */
export type CategoriesGame = {
  players: string[];
  scores: number[];
  phase: Phase;
  /** Which timed phase a pause came from. */
  pausedFrom: Timed;
  order: number[];
  position: number;
  bid: number;
  /** The top bidders' indexes in `players`: one, or several tied on the same bid (a duel). */
  bidders: number[];
  named: number;
  timeLeftMs: number;
  /** In pens-down: the players picked as having the longest list. */
  winners: number[];
};

const phases: Phase[] = [
  "pick",
  "bid",
  "bidding",
  "duel",
  "writing",
  "paused",
  "made",
  "missed",
  "duel-over",
  "pens-down",
  "over",
];

function isCategoriesGame(value: unknown): value is CategoriesGame {
  const game = value as CategoriesGame;
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray(game.players) &&
    game.players.length >= 2 &&
    game.players.every((name) => typeof name === "string") &&
    Array.isArray(game.scores) &&
    game.scores.length === game.players.length &&
    phases.includes(game.phase) &&
    isTimed(game.pausedFrom) &&
    Array.isArray(game.order) &&
    game.order.length > 0 &&
    Number.isInteger(game.position) &&
    Number.isInteger(game.bid) &&
    Array.isArray(game.bidders) &&
    Number.isInteger(game.named) &&
    typeof game.timeLeftMs === "number" &&
    Array.isArray(game.winners)
  );
}

const isTimed = (phase: Phase): phase is Timed => phase === "bidding" || phase === "duel" || phase === "writing";

type Confirming = "end" | "new" | "skip" | null;

export function CategoriesScreen({ goHome }: { goHome: () => void }) {
  const { storage, random, spookySounds } = useDeps();
  const timeUpSound = useSpookySound();
  const { language, t } = useLanguage();
  const save = useMemo(() => gameSave(storage, "categories", isCategoriesGame), [storage]);
  // A game left mid-round comes back paused, with the time it had.
  const [saved] = useState(() => {
    const game = save.load();
    return game && isTimed(game.phase) ? { ...game, phase: "paused" as const, pausedFrom: game.phase } : game;
  });
  const [game, setGame] = useState<CategoriesGame | null>(null);
  /** The names being typed in before a new game, or null when not setting one up. */
  const [names, setNames] = useState<string[] | null>(null);
  const [confirming, setConfirming] = useState<Confirming>(null);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (game) save.save(game);
  }, [game, save]);

  const s = t.halloween.categories;

  useCountdown({
    running: !!game && isTimed(game.phase) && !confirming && !reporting,
    timeLeftMs: game?.timeLeftMs ?? 0,
    onTick: (timeLeftMs) => setGame((current) => current && { ...current, timeLeftMs }),
    onEnd: () => {
      timeUpSound();
      setGame((current) => {
        if (!current) return current;
        if (current.phase === "writing") return { ...current, timeLeftMs: 0, phase: "pens-down", winners: [] };
        if (current.phase === "duel") return { ...current, timeLeftMs: 0, phase: "duel-over", winners: [] };
        // Out of time on a bid: everyone but the bidder gets a point.
        const scores = current.scores.map((score, i) => (current.bidders.includes(i) ? score : score + 1));
        return { ...current, timeLeftMs: 0, phase: "missed", scores };
      });
    },
    onHidden: () =>
      setGame((current) =>
        current && isTimed(current.phase) ? { ...current, phase: "paused", pausedFrom: current.phase } : current,
      ),
  });

  function startGame(players: string[]) {
    setNames(null);
    setGame({
      players,
      scores: players.map(() => 0),
      phase: "pick",
      pausedFrom: "bidding",
      order: shuffledIndexes(categories.length, random),
      position: 0,
      bid: FIRST_BID,
      bidders: [],
      named: 0,
      timeLeftMs: ROUND_MS,
      winners: [],
    });
  }

  function nextCategory() {
    setGame(
      (current) =>
        current && {
          ...current,
          phase: "pick",
          position: current.position + 1,
          bid: FIRST_BID,
          bidders: [],
          named: 0,
          timeLeftMs: ROUND_MS,
          winners: [],
        },
    );
  }

  function start(phase: Timed) {
    setGame((current) => current && { ...current, phase, named: 0, timeLeftMs: ROUND_MS });
  }

  function gotOne() {
    setGame((current) => {
      if (!current) return current;
      const named = current.named + 1;
      if (named < current.bid) return { ...current, named };
      const scores = current.scores.map((score, i) => (current.bidders.includes(i) ? score + 1 : score));
      return { ...current, named, scores, phase: "made" };
    });
  }

  function givePoints() {
    setGame(
      (current) =>
        current && {
          ...current,
          scores: current.scores.map((score, i) => (current.winners.includes(i) ? score + 1 : score)),
        },
    );
    nextCategory();
  }

  /** A duel nobody won: everyone who wasn't in it gets a point, like a missed bid. */
  function nobodyReached() {
    setGame(
      (current) =>
        current && {
          ...current,
          scores: current.scores.map((score, i) => (current.bidders.includes(i) ? score : score + 1)),
        },
    );
    nextCategory();
  }

  /** The category on screen, for Report, named by its place in the list. */
  function reportedCategory(current: CategoriesGame) {
    const index = current.order[current.position % current.order.length] % categories.length;
    return {
      itemId: `category-${index}`,
      mode: "halloween-categories" as const,
      language,
      text: categories[index][language],
      revealed: current.phase,
    };
  }

  const pause = () =>
    setGame((current) =>
      current && isTimed(current.phase) ? { ...current, phase: "paused", pausedFrom: current.phase } : current,
    );

  const header = (
    <header className="play-top">
      <button type="button" className="icon-btn" aria-label={t.halloween.menuBack} onClick={goHome}>
        <Icon name="home" />
      </button>
      <span className="chip">
        <span className="chip-text">{t.halloween.games.categories.title}</span>
      </span>
      <LanguageToggle />
      {game && game.phase !== "over" && (
        <button
          type="button"
          className="icon-btn"
          aria-label={t.halloween.reportCategory}
          onClick={() => {
            // The clock stops while reporting.
            pause();
            setReporting(true);
          }}
        >
          <Icon name="report" />
        </button>
      )}
    </header>
  );

  const shell = (children: ReactNode) => (
    <main className="play halloween-game-screen" data-mode="halloween" onClickCapture={spookySounds.unlock}>
      {header}
      <div className="game-body">{children}</div>
      {reporting && game && (
        <ReportOverlay
          card={reportedCategory(game)}
          title={t.halloween.reportCategory}
          onClose={() => setReporting(false)}
        />
      )}
      {confirming && (
        <ConfirmDialog
          {...(confirming === "skip"
            ? { title: s.skipTitle, body: s.skipBody, confirm: s.skipConfirm }
            : confirming === "end"
              ? { title: t.halloween.endGameTitle, body: t.halloween.endGameBody, confirm: t.halloween.endGame }
              : { title: t.halloween.newGameTitle, body: t.halloween.newGameBody, confirm: t.halloween.newGame })}
          cancel={t.halloween.keepPlaying}
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            setConfirming(null);
            if (confirming === "skip") nextCategory();
            else if (confirming === "end") setGame((current) => current && { ...current, phase: "over" });
            else setNames(["", ""]);
          }}
        />
      )}
    </main>
  );

  // Before a game: continue the saved one, or set up a new one.
  if (!game && !names) {
    const inProgress = saved && saved.phase !== "over" ? saved : null;
    return shell(
      <section className="game-panel">
        <p className="game-lead">{s.rules}</p>
        {inProgress && <ScoreList players={inProgress.players} scores={inProgress.scores} />}
        <div className="game-actions">
          {inProgress && (
            <button type="button" className="game-button game-button-main" onClick={() => setGame(inProgress)}>
              {t.halloween.continueGame}
            </button>
          )}
          <button
            type="button"
            className={inProgress ? "game-button" : "game-button game-button-main"}
            onClick={() => (inProgress ? setConfirming("new") : setNames(["", ""]))}
          >
            {t.halloween.newGame}
          </button>
        </div>
      </section>,
    );
  }

  if (names) {
    const players = names.map((name) => name.trim()).filter(Boolean);
    return shell(
      <section className="game-panel">
        <h2 className="game-heading">{s.whoIsPlaying}</h2>
        <ul className="player-inputs">
          {names.map((name, i) => (
            <li key={i}>
              <input
                id={`player-${i}`}
                className="player-input"
                aria-label={s.playerName(i + 1)}
                placeholder={s.playerName(i + 1)}
                value={name}
                maxLength={20}
                autoComplete="off"
                onChange={(event) => setNames(names.map((old, j) => (j === i ? event.target.value : old)))}
              />
              {names.length > 2 && (
                <button
                  type="button"
                  className="player-remove"
                  aria-label={s.removePlayer(name.trim() || s.playerName(i + 1))}
                  onClick={() => setNames(names.filter((_, j) => j !== i))}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
        {names.length < MAX_PLAYERS && (
          <button type="button" className="game-link" onClick={() => setNames([...names, ""])}>
            + {s.addPlayer}
          </button>
        )}
        {players.length < 2 && <p className="game-hint">{s.needTwo}</p>}
        <button
          type="button"
          className="game-button game-button-main"
          disabled={players.length < 2}
          onClick={() => startGame(players)}
        >
          {s.startGame}
        </button>
      </section>,
    );
  }

  if (!game) return null;

  if (game.phase === "over") {
    const top = Math.max(...game.scores);
    const winners = game.players.filter((_, i) => game.scores[i] === top).join(" & ");
    return shell(
      <section className="game-panel">
        <h2 className="game-heading game-heading-big">{s.winners(winners)}</h2>
        <ScoreList players={game.players} scores={game.scores} label={s.finalScores} sorted />
        <div className="game-actions">
          <button type="button" className="game-button game-button-main" onClick={() => setNames(["", ""])}>
            {t.halloween.newGame}
          </button>
          <button type="button" className="game-button" onClick={goHome}>
            {t.halloween.menuBack}
          </button>
        </div>
      </section>,
    );
  }

  const category = categories[game.order[game.position % game.order.length] % categories.length][language];
  const seconds = Math.ceil(game.timeLeftMs / 1000);
  const bidderNames = game.bidders.map((i) => game.players[i]).join(" & ");
  const toggle = (list: number[], i: number) => (list.includes(i) ? list.filter((j) => j !== i) : [...list, i]);
  // Asking to skip or end mid-round stops the clock while the question is open.
  const ask = (what: Confirming) => {
    pause();
    setConfirming(what);
  };
  const timer = <Timer seconds={seconds} total={ROUND_MS / 1000} onPause={pause} onSkip={() => ask("skip")} />;

  let panel: ReactNode;
  switch (game.phase) {
    case "pick":
      panel = (
        <section className="game-panel">
          <div className="game-actions">
            <button
              type="button"
              className="game-button game-button-main"
              onClick={() => setGame({ ...game, phase: "bid" })}
            >
              {s.bid}
            </button>
            <button type="button" className="game-button game-button-main" onClick={() => start("writing")}>
              {s.write}
            </button>
            <button type="button" className="game-link" onClick={nextCategory}>
              {s.another}
            </button>
          </div>
        </section>
      );
      break;
    case "bid":
      panel = (
        <section className="game-panel">
          <p className="game-lead">{s.bidHelp}</p>
          <div className="bid-stepper" role="group" aria-label={s.topBid}>
            <button
              type="button"
              className="game-step"
              aria-label={s.lower}
              disabled={game.bid <= 1}
              onClick={() => setGame({ ...game, bid: game.bid - 1 })}
            >
              −
            </button>
            <output className="bid-value" aria-live="polite">
              {game.bid}
            </output>
            <button
              type="button"
              className="game-step"
              aria-label={s.higher}
              disabled={game.bid >= MAX_BID}
              onClick={() => setGame({ ...game, bid: game.bid + 1 })}
            >
              +
            </button>
          </div>
          <PlayerPicker
            label={s.whoBid}
            players={game.players}
            picked={game.bidders}
            onPick={(i) => setGame({ ...game, bidders: toggle(game.bidders, i) })}
          />
          <button
            type="button"
            className="game-button game-button-main"
            disabled={game.bidders.length === 0}
            onClick={() => start(game.bidders.length > 1 ? "duel" : "bidding")}
          >
            {game.bidders.length > 1 ? s.startDuel(game.bid) : s.startBid(game.bid)}
          </button>
          <button type="button" className="game-link" onClick={() => setGame({ ...game, phase: "pick" })}>
            {s.back}
          </button>
        </section>
      );
      break;
    case "bidding":
      panel = (
        <>
          {timer}
          <section className="game-panel">
            <h2 className="game-heading">
              {bidderNames}: {s.nameThem(game.bid)}
            </h2>
            <p className="bid-count" aria-live="polite">
              {s.named(game.named, game.bid)}
            </p>
            <div className="game-actions game-actions-row">
              <button
                type="button"
                className="game-button"
                disabled={game.named === 0}
                onClick={() => setGame({ ...game, named: game.named - 1 })}
              >
                {s.undo}
              </button>
              <button type="button" className="game-button game-button-main game-button-big" onClick={gotOne}>
                {s.gotOne} +1
              </button>
            </div>
          </section>
        </>
      );
      break;
    case "writing":
      panel = (
        <>
          {timer}
          <section className="game-panel">
            <p className="game-lead">{s.writeNow}</p>
          </section>
        </>
      );
      break;
    case "paused":
      panel = (
        <section className="game-panel">
          <p className="game-lead">{t.halloween.paused(seconds)}</p>
          <div className="game-actions">
            <button
              type="button"
              className="game-button game-button-main"
              onClick={() => setGame({ ...game, phase: game.pausedFrom })}
            >
              {t.halloween.resume}
            </button>
            <button type="button" className="game-button" onClick={() => setConfirming("skip")}>
              {s.skip}
            </button>
          </div>
        </section>
      );
      break;
    case "made":
    case "missed":
      panel = (
        <section className="game-panel">
          <h2 className="game-heading">
            {game.phase === "made" ? s.made(game.bid) : s.missed(game.named, game.bid)}
          </h2>
          <p className="game-lead">{game.phase === "made" ? s.bidderWon(bidderNames) : s.othersWon(bidderNames)}</p>
          <button type="button" className="game-button game-button-main" onClick={nextCategory}>
            {s.nextCategory}
          </button>
        </section>
      );
      break;
    case "duel":
      panel = (
        <>
          {timer}
          <section className="game-panel">
            <p className="game-lead">{s.duelNow(bidderNames, game.bid)}</p>
          </section>
        </>
      );
      break;
    case "duel-over":
      panel = (
        <section className="game-panel">
          <h2 className="game-heading">{s.pensDown}</h2>
          <PlayerPicker
            label={s.duelWho(game.bid)}
            players={game.players}
            only={game.bidders}
            picked={game.winners}
            onPick={(i) => setGame({ ...game, winners: toggle(game.winners, i) })}
          />
          <button
            type="button"
            className="game-button game-button-main"
            disabled={game.winners.length === 0}
            onClick={givePoints}
          >
            {s.givePoints}
          </button>
          <button type="button" className="game-link" onClick={nobodyReached}>
            {s.nobodyReached}
          </button>
          <p className="game-hint">{s.othersWon(bidderNames)}</p>
        </section>
      );
      break;
    case "pens-down":
      panel = (
        <section className="game-panel">
          <h2 className="game-heading">{s.pensDown}</h2>
          <p className="game-lead">{s.compare}</p>
          <PlayerPicker
            label={s.whoWon}
            players={game.players}
            picked={game.winners}
            onPick={(i) => setGame({ ...game, winners: toggle(game.winners, i) })}
          />
          <button
            type="button"
            className="game-button game-button-main"
            disabled={game.winners.length === 0}
            onClick={givePoints}
          >
            {s.givePoints}
          </button>
          <button type="button" className="game-link" onClick={nextCategory}>
            {s.noWinner}
          </button>
        </section>
      );
      break;
  }

  return shell(
    <>
      <article className="category-card">
        <p className="category-name">{category}</p>
      </article>
      {panel}
      <ScoreList players={game.players} scores={game.scores} />
      <button type="button" className="game-end" onClick={() => ask("end")}>
        {t.halloween.endGame}
      </button>
    </>,
  );
}

/** Everyone's points, in playing order or (at the end) highest first. */
function ScoreList({
  players,
  scores,
  label,
  sorted = false,
}: {
  players: string[];
  scores: number[];
  label?: string;
  sorted?: boolean;
}) {
  const { t } = useLanguage();
  const rows = players.map((name, i) => ({ name, score: scores[i], i }));
  if (sorted) rows.sort((a, b) => b.score - a.score);
  return (
    <dl className="score-list" aria-label={label ?? t.halloween.categories.scores}>
      {rows.map(({ name, score, i }) => (
        <div key={i} className="score-row">
          <dt>{name}</dt>
          <dd>{score}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Tap players to pick them, one or several. `only` limits the choice to some of them, by index. */
function PlayerPicker({
  label,
  players,
  only,
  picked,
  onPick,
}: {
  label: string;
  players: string[];
  only?: number[];
  picked: number[];
  onPick: (index: number) => void;
}) {
  return (
    <div className="player-picker" role="group" aria-label={label}>
      <p className="game-hint">{label}</p>
      <div className="player-chips">
        {players.map((name, i) =>
          only && !only.includes(i) ? null : (
            <button
              key={i}
              type="button"
              className="player-chip"
              aria-pressed={picked.includes(i)}
              onClick={() => onPick(i)}
            >
              {name}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
