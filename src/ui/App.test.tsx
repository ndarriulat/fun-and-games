import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  corruptStorage,
  fixedRandom,
  inMemoryStorage,
  numberedTrivia,
  sequenceRandom,
  testDeps,
  throwingStorage,
  triviaFixtures,
} from "@/test/fakes";
import { App } from "./App";

async function openTrivia(deps = testDeps()) {
  const rendered = renderApp(deps);
  await rendered.user.click(screen.getByRole("button", { name: /trivia/i }));
  await screen.findByRole("article");
  return rendered;
}

async function showOptions(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Show options" }));
  return within(screen.getByRole("list", { name: "Options" }))
    .getAllByRole("listitem")
    .map((option) => option.textContent);
}

function renderApp(deps = testDeps()) {
  const user = userEvent.setup();
  render(<App deps={deps} />);
  return { user, deps };
}

describe("Home", () => {
  it("shows the three modes and a settings button", () => {
    renderApp();

    expect(screen.getByRole("button", { name: /trivia/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /puzzles/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /talk/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });
});

describe("Modes not built yet", () => {
  it.each(["Puzzles", "Talk", "Settings"])("%s shows a coming-soon screen with a way home", async (name) => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: new RegExp(name, "i") }));
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByRole("button", { name: /trivia/i })).toBeInTheDocument();
  });
});

describe("Trivia", () => {
  it("deals a card chosen by the random source, showing its topic and difficulty", async () => {
    const { user } = renderApp(testDeps({ random: fixedRandom(0.999) }));

    await user.click(screen.getByRole("button", { name: /trivia/i }));

    expect(await screen.findByText("In what year did Uruguay host and win the first FIFA World Cup?")).toBeInTheDocument();
    expect(screen.getByText("Uruguay 🇺🇾")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("deals a different card when the random source differs", async () => {
    const { user } = renderApp(testDeps({ random: fixedRandom(0) }));

    await user.click(screen.getByRole("button", { name: /trivia/i }));

    expect(await screen.findByText("What is the capital of Australia?")).toBeInTheDocument();
    expect(screen.getByText("Geography")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
  });

  it("shows four options: the answer and the three wrong options", async () => {
    const { user } = await openTrivia();

    const options = await showOptions(user);

    expect(options).toHaveLength(4);
    expect([...options].sort()).toEqual(["Canberra", "Melbourne", "Perth", "Sydney"]);
    expect(screen.queryByRole("button", { name: "Show options" })).not.toBeInTheDocument();
  });

  it("shuffles the options using the random source", async () => {
    // With a single card in the bank, the random source only affects the option order.
    const bank = { trivia: [triviaFixtures[0]] };
    const low = await openTrivia(testDeps({ ...bank, random: fixedRandom(0) }));
    const lowOrder = await showOptions(low.user);
    cleanup();

    const high = await openTrivia(testDeps({ ...bank, random: fixedRandom(0.999) }));
    const highOrder = await showOptions(high.user);

    expect([...lowOrder].sort()).toEqual([...highOrder].sort());
    expect(lowOrder).not.toEqual(highOrder);
  });

  it("reveals the answer and the fun fact", async () => {
    const { user } = await openTrivia();
    expect(screen.queryByText("Canberra")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reveal" }));

    expect(screen.getByText("Canberra")).toBeInTheDocument();
    expect(screen.getByText("Canberra was purpose-built as a compromise between Sydney and Melbourne.")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Options" })).not.toBeInTheDocument();
  });

  it("highlights the correct option when revealing with options showing", async () => {
    const { user } = await openTrivia();
    await showOptions(user);

    await user.click(screen.getByRole("button", { name: "Reveal" }));

    const options = within(screen.getByRole("list", { name: "Options" }));
    expect(options.getAllByRole("listitem")).toHaveLength(4);
    expect(options.getByRole("listitem", { name: "Correct: Canberra" })).toBeInTheDocument();
    expect(options.queryByRole("listitem", { name: /correct: (sydney|melbourne|perth)/i })).not.toBeInTheDocument();
  });

  it("deals a new, unrevealed card on Next", async () => {
    const { user } = await openTrivia();
    await showOptions(user);
    await user.click(screen.getByRole("button", { name: "Reveal" }));

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
    expect(screen.queryByText("Copper")).not.toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Options" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show options" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reveal" })).toBeInTheDocument();
  });

  it("turns the main button into Next once revealed", async () => {
    const { user } = await openTrivia();
    await user.click(screen.getByRole("button", { name: "Reveal" }));

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
  });

  it("deals a new card on swipe left", async () => {
    const { user } = await openTrivia();

    await swipe(user, screen.getByRole("article"), -120);

    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
  });

  it("ignores a mostly vertical drag", async () => {
    const { user } = await openTrivia();

    await swipe(user, screen.getByRole("article"), -80, 200);

    expect(screen.getByText("What is the capital of Australia?")).toBeInTheDocument();
  });

  it("goes back to Home", async () => {
    const { user } = await openTrivia();

    await user.click(screen.getByRole("button", { name: "Home" }));

    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});

describe("Back and the recent trail", () => {
  it("returns to the previous card with what was revealed still showing", async () => {
    const { user } = await openTrivia();
    await showOptions(user);
    await user.click(screen.getByRole("button", { name: "Reveal" }));
    await user.click(screen.getByRole("button", { name: "Next card" }));

    await user.click(screen.getByRole("button", { name: "Previous card" }));

    expect(screen.getByText("What is the capital of Australia?")).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "Correct: Canberra" })).toBeInTheDocument();
    expect(screen.getByText("Canberra was purpose-built as a compromise between Sydney and Melbourne.")).toBeInTheDocument();
  });

  it("disables Back on the first card", async () => {
    const { user } = await openTrivia();
    expect(screen.getByRole("button", { name: "Previous card" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: "Previous card" }));

    expect(screen.getByText("What is the capital of Australia?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous card" })).toBeDisabled();
  });

  it("goes back on swipe right", async () => {
    const { user } = await openTrivia();
    await user.click(screen.getByRole("button", { name: "Next card" }));

    await swipe(user, screen.getByRole("article"), 120);

    expect(screen.getByText("What is the capital of Australia?")).toBeInTheDocument();
  });

  it("moves forward through the trail on Next, keeping what was revealed, before dealing a new card", async () => {
    const { user } = await openTrivia();
    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: "Reveal" }));
    await user.click(screen.getByRole("button", { name: "Previous card" }));

    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
    expect(screen.getByText("Copper")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByText("In what year did Uruguay host and win the first FIFA World Cup?")).toBeInTheDocument();
  });

  it("goes back through at most 10 previous cards", async () => {
    const { user } = await openTrivia(testDeps({ trivia: numberedTrivia(12) }));
    for (let i = 0; i < 11; i++) await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByText("Question 12?")).toBeInTheDocument();

    for (let i = 0; i < 10; i++) await user.click(screen.getByRole("button", { name: "Previous card" }));

    expect(screen.getByText("Question 2?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous card" })).toBeDisabled();
  });
});

describe("Played history", () => {
  it("doesn't deal a card already shown, even after a reload", async () => {
    const storage = inMemoryStorage();
    await openTrivia(testDeps({ storage }));
    expect(screen.getByText("What is the capital of Australia?")).toBeInTheDocument();
    cleanup();

    await openTrivia(testDeps({ storage }));

    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
  });

  it("says so and starts again when every card has been played, not with the card just shown", async () => {
    // Deals the cards in bank order, then picks the last candidate: without the rule,
    // the card just shown (the last in the bank) would come straight back.
    const { user } = await openTrivia(testDeps({ random: sequenceRandom(0, 0, 0, 0.999) }));
    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByText("In what year did Uruguay host and win the first FIFA World Cup?")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(screen.getByRole("status")).toHaveTextContent("You've played everything, starting again.");
    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("In what year did Uruguay host and win the first FIFA World Cup?")).toBeInTheDocument();
  });

  it("starts again straight away when a returning player has played everything, not with the last card they saw", async () => {
    const storage = inMemoryStorage();
    const { user } = await openTrivia(testDeps({ storage }));
    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByText("In what year did Uruguay host and win the first FIFA World Cup?")).toBeInTheDocument();
    cleanup();

    // 0.999 picks the last candidate, which would be the card last seen without the rule.
    await openTrivia(testDeps({ storage, random: fixedRandom(0.999) }));

    expect(screen.getByRole("status")).toHaveTextContent("You've played everything, starting again.");
    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
  });
});

describe("Device storage", () => {
  it.each([
    ["not JSON", corruptStorage("{oops")],
    ["JSON null", corruptStorage("null")],
    ["a JSON array", corruptStorage("[1, 2]")],
    ["throwing", throwingStorage()],
  ])("still plays, without repeating this session, when storage is %s", async (_, storage) => {
    const { user } = await openTrivia(testDeps({ storage }));
    expect(screen.getByText("What is the capital of Australia?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(screen.getByText("In what year did Uruguay host and win the first FIFA World Cup?")).toBeInTheDocument();
  });

  it("keeps playing and remembering after replacing corrupt data", async () => {
    const storage = corruptStorage("{oops");
    await openTrivia(testDeps({ storage }));
    cleanup();

    await openTrivia(testDeps({ storage }));

    expect(screen.getByText("Which metal makes octopus blood blue?")).toBeInTheDocument();
  });
});

async function swipe(user: ReturnType<typeof userEvent.setup>, target: Element, dx: number, dy = 0) {
  const start = { clientX: 200, clientY: 300 };
  await user.pointer([
    { keys: "[TouchA>]", target, coords: start },
    { pointerName: "TouchA", target, coords: { clientX: start.clientX + dx, clientY: start.clientY + dy } },
    { keys: "[/TouchA]", target },
  ]);
}
