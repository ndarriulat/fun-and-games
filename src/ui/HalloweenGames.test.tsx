// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TriviaItem } from "@/content/types";
import { inMemoryStorage, recordingSpookySounds, testDeps, triviaFixtures } from "@/test/fakes";
import { App } from "./App";

beforeEach(() => {
  // A date when Halloween is on Home, and a clock the tests can run forward.
  vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
  vi.setSystemTime(new Date(2026, 9, 31, 20, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

function renderApp(deps = testDeps()) {
  const user = userEvent.setup();
  render(<App deps={deps} />);
  return { user, deps };
}

async function openGame(game: RegExp, deps = testDeps()) {
  const rendered = renderApp(deps);
  await rendered.user.click(screen.getByRole("button", { name: /^halloween/i }));
  await rendered.user.click(
    within(screen.getByRole("navigation", { name: "Halloween games" })).getByRole("button", { name: game }),
  );
  return rendered;
}

/** Runs the clock forward, as if that many milliseconds passed. */
function wait(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function score(team: 1 | 2) {
  const teams = within(screen.getByLabelText("Score")).getAllByRole("definition");
  return Number(teams[team - 1].textContent);
}

describe("Halloween menu", () => {
  it("opens from Home and lists the four games", async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole("button", { name: /^halloween/i }));

    const games = within(screen.getByRole("navigation", { name: "Halloween games" })).getAllByRole("button");
    expect(games.map((game) => game.textContent)).toEqual([
      expect.stringMatching(/^Talk/),
      expect.stringMatching(/^Trivia/),
      expect.stringMatching(/^Taboo/),
      expect.stringMatching(/^Categories/),
    ]);

    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByRole("navigation", { name: "Modes" })).toBeInTheDocument();
  });

  it("brings each game's back button to the menu, not Home", async () => {
    const { user } = await openGame(/^taboo/i);

    await user.click(screen.getByRole("button", { name: "Halloween games" }));

    expect(screen.getByRole("navigation", { name: "Halloween games" })).toBeInTheDocument();
  });
});

describe("Halloween Taboo", () => {
  it("plays two turns per team, alternating, and names the winner", async () => {
    const { user } = await openGame(/^taboo/i);
    await user.click(screen.getByRole("button", { name: "New game" }));

    // Team 1, turn 1: two right, one forbidden word.
    expect(screen.getByRole("heading")).toHaveTextContent("Team 1 · turn 1 of 2");
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    expect(screen.getByText("Don't say")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Correct +1" }));
    await user.click(screen.getByRole("button", { name: "Correct +1" }));
    await user.click(screen.getByRole("button", { name: "Said it! −1" }));
    wait(60_000);
    expect(screen.getByText("Team 1 scored 1 this turn.")).toBeInTheDocument();

    // Team 2, turn 1: three right.
    await user.click(screen.getByRole("button", { name: "Next: Team 2" }));
    expect(screen.getByRole("heading")).toHaveTextContent("Team 2 · turn 1 of 2");
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole("button", { name: "Correct +1" }));
    wait(60_000);

    // Team 1 and Team 2, turn 2: nothing.
    await user.click(screen.getByRole("button", { name: "Next: Team 1" }));
    expect(screen.getByRole("heading")).toHaveTextContent("Team 1 · turn 2 of 2");
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    wait(60_000);
    await user.click(screen.getByRole("button", { name: "Next: Team 2" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    wait(60_000);

    expect(screen.getByRole("heading")).toHaveTextContent("Team 2 wins!");
    expect(score(1)).toBe(1);
    expect(score(2)).toBe(3);
  });

  it("allows three skips a turn, for no points", async () => {
    const { user } = await openGame(/^taboo/i);
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));

    const words = [screen.getByRole("article").textContent];
    for (const left of [3, 2, 1]) {
      await user.click(screen.getByRole("button", { name: `Skip (${left})` }));
      words.push(screen.getByRole("article").textContent);
    }

    expect(new Set(words).size).toBe(4);
    expect(screen.getByRole("button", { name: "Skip (0)" })).toBeDisabled();
    expect(score(1)).toBe(0);
  });

  it("comes back paused, with the score and time left, after a refresh mid-turn", async () => {
    const storage = inMemoryStorage();
    const { user } = await openGame(/^taboo/i, testDeps({ storage }));
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    await user.click(screen.getByRole("button", { name: "Correct +1" }));
    wait(20_000);
    cleanup();

    const second = await openGame(/^taboo/i, testDeps({ storage }));
    await second.user.click(screen.getByRole("button", { name: /^Continue game \(turn 1 of 4, 1–0\)/ }));

    expect(screen.getByText(/Paused with (39|40) seconds left/)).toBeInTheDocument();
    expect(score(1)).toBe(1);
    await second.user.click(screen.getByRole("button", { name: "Resume" }));
    expect(screen.getByText("Don't say")).toBeInTheDocument();
  });

  it("pauses and resumes with Pause", async () => {
    const { user } = await openGame(/^taboo/i);
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    wait(10_000);

    await user.click(screen.getByRole("button", { name: "Pause" }));
    wait(30_000);

    expect(screen.getByText(/Paused with (49|50) seconds left/)).toBeInTheDocument();
  });

  it("ends the game after asking, leaving nothing to continue", async () => {
    const storage = inMemoryStorage();
    const { user } = await openGame(/^taboo/i, testDeps({ storage }));
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    await user.click(screen.getByRole("button", { name: "Correct +1" }));

    await user.click(screen.getByRole("button", { name: "End game" }));
    const dialog = screen.getByRole("alertdialog", { name: "End this game?" });
    expect(dialog).toHaveTextContent("This can't be undone.");
    await user.click(within(dialog).getByRole("button", { name: "Keep playing" }));
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "End game" }));
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "End game" }));
    expect(screen.queryByRole("button", { name: /Continue game/ })).not.toBeInTheDocument();
    cleanup();

    await openGame(/^taboo/i, testDeps({ storage }));
    expect(screen.queryByRole("button", { name: /Continue game/ })).not.toBeInTheDocument();
  });

  it("asks before a new game replaces the saved one", async () => {
    const storage = inMemoryStorage();
    const { user } = await openGame(/^taboo/i, testDeps({ storage }));
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    await user.click(screen.getByRole("button", { name: "Correct +1" }));
    cleanup();

    const second = await openGame(/^taboo/i, testDeps({ storage }));
    await second.user.click(screen.getByRole("button", { name: "New game" }));
    await second.user.click(
      within(screen.getByRole("alertdialog", { name: "Start a new game?" })).getByRole("button", { name: "New game" }),
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Team 1 · turn 1 of 2");
    expect(score(1)).toBe(0);
  });

  it("has its own words in Spanish", async () => {
    const { user } = await openGame(/^taboo/i);
    await user.click(screen.getByRole("button", { name: "ES" }));
    await user.click(screen.getByRole("button", { name: "Juego nuevo" }));
    await user.click(screen.getByRole("button", { name: "Empezar turno" }));

    expect(screen.getByText("No digas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bien +1" })).toBeInTheDocument();
  });
});

describe("Halloween Categories", () => {
  /** Opens Categories and starts a new game with these players. */
  async function startGame(players: string[], deps = testDeps()) {
    const rendered = await openGame(/^categories/i, deps);
    await rendered.user.click(screen.getByRole("button", { name: "New game" }));
    for (let i = 2; i < players.length; i++) await rendered.user.click(screen.getByRole("button", { name: "+ Add a player" }));
    for (const [i, name] of players.entries()) {
      await rendered.user.type(screen.getByRole("textbox", { name: `Player ${i + 1}` }), name);
    }
    await rendered.user.click(screen.getByRole("button", { name: "Start game" }));
    return rendered;
  }

  function points(name: string) {
    const scores = within(screen.getByLabelText("Scores"));
    return Number(scores.getByText(name).nextElementSibling?.textContent);
  }

  it("needs at least two names to start", async () => {
    const { user } = await openGame(/^categories/i);
    await user.click(screen.getByRole("button", { name: "New game" }));

    expect(screen.getByRole("button", { name: "Start game" })).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Player 1" }), "Nico");
    expect(screen.getByRole("button", { name: "Start game" })).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Player 2" }), "Ana");
    expect(screen.getByRole("button", { name: "Start game" })).toBeEnabled();
  });

  it("bids: the bidder who names them all in time gets a point", async () => {
    const { user } = await startGame(["Nico", "Ana", "Sofi"]);

    await user.click(screen.getByRole("button", { name: "Bid for it" }));
    await user.click(screen.getByRole("button", { name: "Lower bid" }));
    await user.click(screen.getByRole("button", { name: "Lower bid" }));
    expect(screen.getByRole("button", { name: "Name 3 in 60 seconds" })).toBeDisabled();
    await user.click(within(screen.getByRole("group", { name: /Who has the top bid/ })).getByRole("button", { name: "Ana" }));
    await user.click(screen.getByRole("button", { name: "Name 3 in 60 seconds" }));
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole("button", { name: "Got one +1" }));

    expect(screen.getByRole("heading")).toHaveTextContent("Made it! All 3 named.");
    expect(points("Ana")).toBe(1);
    expect(points("Nico")).toBe(0);
  });

  it("bids: out of time, everyone else gets a point", async () => {
    const { user } = await startGame(["Nico", "Ana", "Sofi"]);

    await user.click(screen.getByRole("button", { name: "Bid for it" }));
    await user.click(within(screen.getByRole("group", { name: /Who has the top bid/ })).getByRole("button", { name: "Nico" }));
    await user.click(screen.getByRole("button", { name: "Name 5 in 60 seconds" }));
    await user.click(screen.getByRole("button", { name: "Got one +1" }));
    wait(60_000);

    expect(screen.getByRole("heading")).toHaveTextContent("Out of time: 1 of 5.");
    expect(screen.getByText("Everyone except Nico gets a point.")).toBeInTheDocument();
    expect([points("Nico"), points("Ana"), points("Sofi")]).toEqual([0, 1, 1]);
  });

  it("duels: tied bidders each write, and everyone who reached the bid gets a point", async () => {
    const { user } = await startGame(["Nico", "Ana", "Sofi"]);

    await user.click(screen.getByRole("button", { name: "Bid for it" }));
    const bidders = within(screen.getByRole("group", { name: /Who has the top bid/ }));
    await user.click(bidders.getByRole("button", { name: "Nico" }));
    await user.click(bidders.getByRole("button", { name: "Ana" }));
    await user.click(screen.getByRole("button", { name: "Duel: write 5 in 60 seconds" }));
    expect(screen.getByText("Nico & Ana: write 5 each. Go!")).toBeInTheDocument();
    wait(60_000);

    const reached = within(screen.getByRole("group", { name: /Who reached 5/ }));
    expect(reached.getAllByRole("button").map((button) => button.textContent)).toEqual(["Nico", "Ana"]);
    await user.click(reached.getByRole("button", { name: "Nico" }));
    await user.click(reached.getByRole("button", { name: "Ana" }));
    await user.click(screen.getByRole("button", { name: "Give the points" }));

    expect([points("Nico"), points("Ana"), points("Sofi")]).toEqual([1, 1, 0]);
  });

  it("duels: if nobody reached the bid, everyone else gets a point", async () => {
    const { user } = await startGame(["Nico", "Ana", "Sofi"]);

    await user.click(screen.getByRole("button", { name: "Bid for it" }));
    const bidders = within(screen.getByRole("group", { name: /Who has the top bid/ }));
    await user.click(bidders.getByRole("button", { name: "Nico" }));
    await user.click(bidders.getByRole("button", { name: "Ana" }));
    await user.click(screen.getByRole("button", { name: "Duel: write 5 in 60 seconds" }));
    wait(60_000);
    await user.click(screen.getByRole("button", { name: "Nobody made it" }));

    expect([points("Nico"), points("Ana"), points("Sofi")]).toEqual([0, 0, 1]);
  });

  it("writes: after 60 seconds, everyone who tied for the longest list gets a point", async () => {
    const { user } = await startGame(["Nico", "Ana", "Sofi"]);
    const category = screen.getByRole("article").textContent;

    await user.click(screen.getByRole("button", { name: "Everyone writes" }));
    wait(60_000);

    expect(screen.getByRole("heading")).toHaveTextContent("Pens down!");
    const winners = within(screen.getByRole("group", { name: /Who had the longest list/ }));
    await user.click(winners.getByRole("button", { name: "Ana" }));
    await user.click(winners.getByRole("button", { name: "Sofi" }));
    await user.click(screen.getByRole("button", { name: "Give the points" }));

    expect([points("Nico"), points("Ana"), points("Sofi")]).toEqual([0, 1, 1]);
    expect(screen.getByRole("article").textContent).not.toBe(category);
  });

  it("skips a running round after asking, with no points", async () => {
    const { user } = await startGame(["Nico", "Ana"]);
    const category = screen.getByRole("article").textContent;
    await user.click(screen.getByRole("button", { name: "Everyone writes" }));

    await user.click(screen.getByRole("button", { name: "Skip" }));
    const dialog = screen.getByRole("alertdialog", { name: "Skip this category?" });
    await user.click(within(dialog).getByRole("button", { name: "Keep playing" }));
    expect(screen.getByText(/Paused with/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Skip" }));
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Skip it" }));

    expect(screen.getByRole("article").textContent).not.toBe(category);
    expect(screen.getByRole("button", { name: "Bid for it" })).toBeInTheDocument();
    expect([points("Nico"), points("Ana")]).toEqual([0, 0]);
  });

  it("ends the game after asking, and shows the winner", async () => {
    const { user } = await startGame(["Nico", "Ana"]);
    await user.click(screen.getByRole("button", { name: "Everyone writes" }));
    wait(60_000);
    await user.click(within(screen.getByRole("group", { name: /longest list/ })).getByRole("button", { name: "Nico" }));
    await user.click(screen.getByRole("button", { name: "Give the points" }));

    await user.click(screen.getByRole("button", { name: "End game" }));
    await user.click(within(screen.getByRole("alertdialog", { name: "End this game?" })).getByRole("button", { name: "End game" }));

    expect(screen.getByRole("heading")).toHaveTextContent("Nico won!");
  });

  it("comes back paused, with players and scores, after a refresh mid-round", async () => {
    const storage = inMemoryStorage();
    const { user } = await startGame(["Nico", "Ana"], testDeps({ storage }));
    const category = screen.getByRole("article").textContent;
    await user.click(screen.getByRole("button", { name: "Everyone writes" }));
    wait(15_000);
    cleanup();

    const second = await openGame(/^categories/i, testDeps({ storage }));
    await second.user.click(screen.getByRole("button", { name: "Continue game" }));

    expect(screen.getByRole("article").textContent).toBe(category);
    expect(screen.getByText(/Paused with (44|45) seconds left/)).toBeInTheDocument();
    expect(points("Nico")).toBe(0);
  });

  it("asks before a new game replaces the saved one", async () => {
    const storage = inMemoryStorage();
    await startGame(["Nico", "Ana"], testDeps({ storage }));
    cleanup();

    const second = await openGame(/^categories/i, testDeps({ storage }));
    await second.user.click(screen.getByRole("button", { name: "New game" }));
    await second.user.click(
      within(screen.getByRole("alertdialog", { name: "Start a new game?" })).getByRole("button", { name: "New game" }),
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Who's playing?");
  });
});

describe("Halloween Trivia", () => {
  const halloweenQuestion: TriviaItem = {
    id: "trv-hal-90001",
    topic: "halloween",
    difficulty: "easy",
    en: {
      question: "Which food are vampires said to avoid?",
      answer: "Garlic",
      options: ["Onion", "Chilli", "Salt"],
      fact: "Garlic flowers keep the Count away in Dracula.",
    },
  };
  const trivia = [...triviaFixtures, halloweenQuestion];

  it("deals only Halloween questions, under its own name", async () => {
    const { user } = await openGame(/^trivia/i, testDeps({ trivia }));
    await screen.findByRole("article");

    expect(screen.getByText("Which food are vampires said to avoid?")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Halloween Trivia");
    await user.click(screen.getByRole("button", { name: "Reveal" }));
    expect(screen.getByText("Garlic")).toBeInTheDocument();
  });

  it("is never dealt in regular Trivia", async () => {
    const { user } = renderApp(testDeps({ trivia }));
    await user.click(screen.getByRole("button", { name: /^trivia/i }));
    await screen.findByRole("article");
    const dealt = [screen.getByRole("article").textContent];
    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByRole("button", { name: "Next card" }));
      dealt.push(screen.getByRole("article").textContent);
    }

    expect(dealt.join(" ")).not.toContain("vampires");
  });
});

describe("Spooky sounds", () => {
  async function nextCards(user: ReturnType<typeof userEvent.setup>, count: number) {
    for (let i = 0; i < count; i++) await user.click(screen.getByRole("button", { name: "Next card" }));
  }

  it("plays on every fifth card in Halloween Talk, and not again going Back and forward", async () => {
    const spookySounds = recordingSpookySounds();
    const { user } = await openGame(/^talk/i, testDeps({ spookySounds }));
    await screen.findByRole("article");

    await nextCards(user, 3);
    expect(spookySounds.played).toBe(0);
    await nextCards(user, 1);
    expect(spookySounds.played).toBe(1);

    await user.click(screen.getByRole("button", { name: "Previous card" }));
    await nextCards(user, 1);
    expect(spookySounds.played).toBe(1);

    await nextCards(user, 5);
    expect(spookySounds.played).toBe(2);
  });

  it("stays quiet once muted in the Halloween menu, and remembers it", async () => {
    const spookySounds = recordingSpookySounds();
    const storage = inMemoryStorage();
    const { user } = renderApp(testDeps({ spookySounds, storage }));
    await user.click(screen.getByRole("button", { name: /^halloween/i }));
    const toggle = screen.getByRole("button", { name: "Spooky sounds" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await user.click(toggle);
    cleanup();

    const second = await openGame(/^talk/i, testDeps({ spookySounds, storage }));
    await screen.findByRole("article");
    await nextCards(second.user, 4);

    expect(spookySounds.played).toBe(0);
    await second.user.click(screen.getByRole("button", { name: "Halloween games" }));
    expect(screen.getByRole("button", { name: "Spooky sounds" })).toHaveAttribute("aria-pressed", "false");
  });

  it("plays when the 60 seconds run out in Taboo and Categories, but not on Skip", async () => {
    const spookySounds = recordingSpookySounds();
    const { user } = await openGame(/^taboo/i, testDeps({ spookySounds }));
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    wait(59_000);
    expect(spookySounds.played).toBe(0);
    wait(1_000);
    expect(spookySounds.played).toBe(1);
    cleanup();

    const second = await openGame(/^categories/i, testDeps({ spookySounds }));
    await second.user.click(screen.getByRole("button", { name: "New game" }));
    await second.user.type(screen.getByRole("textbox", { name: "Player 1" }), "Nico");
    await second.user.type(screen.getByRole("textbox", { name: "Player 2" }), "Ana");
    await second.user.click(screen.getByRole("button", { name: "Start game" }));
    await second.user.click(screen.getByRole("button", { name: "Everyone writes" }));
    await second.user.click(screen.getByRole("button", { name: "Skip" }));
    await second.user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Skip it" }));
    expect(spookySounds.played).toBe(1);
    await second.user.click(screen.getByRole("button", { name: "Everyone writes" }));
    wait(60_000);
    expect(spookySounds.played).toBe(2);
  });

  it("stays quiet when time runs out if muted", async () => {
    const spookySounds = recordingSpookySounds();
    const storage = inMemoryStorage();
    const { user } = renderApp(testDeps({ spookySounds, storage }));
    await user.click(screen.getByRole("button", { name: /^halloween/i }));
    await user.click(screen.getByRole("button", { name: "Spooky sounds" }));
    await user.click(within(screen.getByRole("navigation", { name: "Halloween games" })).getByRole("button", { name: /^taboo/i }));
    await user.click(screen.getByRole("button", { name: "New game" }));
    await user.click(screen.getByRole("button", { name: "Start turn" }));
    wait(60_000);

    expect(spookySounds.played).toBe(0);
  });

  it("never plays in regular Talk", async () => {
    const spookySounds = recordingSpookySounds();
    const { user } = renderApp(testDeps({ spookySounds }));
    await user.click(screen.getByRole("button", { name: /^talk/i }));
    await screen.findByRole("article");

    await nextCards(user, 9);

    expect(spookySounds.played).toBe(0);
  });
});
