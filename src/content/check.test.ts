import { describe, expect, it } from "vitest";
import { checkContent } from "./check";

const en = {
  question: "What is the capital of Australia?",
  answer: "Canberra",
  options: ["Sydney", "Melbourne", "Perth"],
  fact: "Canberra was purpose-built as a compromise between Sydney and Melbourne.",
};
const es = {
  question: "¿Cuál es la capital de Australia?",
  answer: "Canberra",
  options: ["Sídney", "Melbourne", "Perth"],
  fact: "Canberra se construyó a propósito como punto medio entre Sídney y Melbourne.",
};
const validItem = { id: "trv-geo-00001", topic: "geography", difficulty: "easy", en, es };

function check(items: unknown, path = "trivia/geography.json") {
  return checkContent([{ path, data: items }]);
}

describe("content check: Trivia", () => {
  it("accepts a valid file", () => {
    expect(check([validItem])).toEqual({ problems: [], pending: [] });
  });

  it("reports an item with no es block as pending translation, not a problem", () => {
    expect(check([{ ...validItem, es: undefined }])).toEqual({
      problems: [],
      pending: [{ file: "trivia/geography.json", id: "trv-geo-00001" }],
    });
  });

  function problemsFor(item: unknown) {
    return check([item]).problems.map(({ id, field }) => ({ id, field }));
  }

  it("requires exactly three options", () => {
    expect(problemsFor({ ...validItem, en: { ...en, options: ["Sydney", "Melbourne"] } })).toEqual([
      { id: "trv-geo-00001", field: "en.options" },
    ]);
  });

  it("rejects an option equal to the answer, ignoring case and spacing", () => {
    expect(problemsFor({ ...validItem, es: { ...es, options: ["Sídney", " canberra ", "Perth"] } })).toEqual([
      { id: "trv-geo-00001", field: "es.options" },
    ]);
  });

  it("requires every text field in en", () => {
    expect(problemsFor({ ...validItem, en: { ...en, fact: "  ", answer: undefined } })).toEqual([
      { id: "trv-geo-00001", field: "en.answer" },
      { id: "trv-geo-00001", field: "en.fact" },
    ]);
  });

  it("requires en to be present", () => {
    expect(problemsFor({ ...validItem, en: undefined })).toEqual([{ id: "trv-geo-00001", field: "en" }]);
  });

  it("requires es to be complete when present", () => {
    expect(problemsFor({ ...validItem, es: { ...es, question: "" } })).toEqual([
      { id: "trv-geo-00001", field: "es.question" },
    ]);
  });

  it("names the file, ID and field in the message", () => {
    const [problem] = check([{ ...validItem, en: { ...en, options: [] } }]).problems;

    expect(problem.file).toBe("trivia/geography.json");
    expect(problem.message).toMatch(/3 options/);
  });

  it("rejects an invalid difficulty", () => {
    expect(problemsFor({ ...validItem, difficulty: "tricky" })).toEqual([{ id: "trv-geo-00001", field: "difficulty" }]);
  });

  it("rejects a topic that doesn't match the file", () => {
    expect(problemsFor({ ...validItem, id: "trv-his-00001", topic: "history" })).toEqual([
      { id: "trv-his-00001", field: "topic" },
    ]);
  });

  it("rejects an ID in the wrong format", () => {
    expect(problemsFor({ ...validItem, id: "trv-geo-42" })).toEqual([{ id: "trv-geo-42", field: "id" }]);
  });

  it("rejects an ID whose code doesn't match the topic", () => {
    expect(problemsFor({ ...validItem, id: "trv-his-00001" })).toEqual([{ id: "trv-his-00001", field: "id" }]);
  });

  it("rejects IDs used twice across the bank", () => {
    const report = checkContent([
      { path: "trivia/geography.json", data: [validItem] },
      { path: "trivia/geography-2.json", data: [validItem] },
    ]);

    expect(report.problems.map(({ file, id, field }) => ({ file, id, field }))).toContainEqual({
      file: "trivia/geography-2.json",
      id: "trv-geo-00001",
      field: "id",
    });
  });

  it("rejects a file that isn't a list of items", () => {
    expect(check({ items: [] }).problems.map(({ file, field }) => ({ file, field }))).toEqual([
      { file: "trivia/geography.json", field: "(file)" },
    ]);
  });

  it("rejects a file for an unknown topic", () => {
    const report = check([{ ...validItem, topic: "astrology" }], "trivia/astrology.json");

    expect(report.problems.map(({ field }) => field)).toEqual(["(file)", "topic"]);
  });

  it("rejects duplicate options", () => {
    expect(problemsFor({ ...validItem, en: { ...en, options: ["Sydney", "sydney", "Perth"] } })).toEqual([
      { id: "trv-geo-00001", field: "en.options" },
    ]);
  });

  it("doesn't treat items missing an ID in different files as duplicates", () => {
    const report = checkContent([
      { path: "trivia/geography.json", data: [{ ...validItem, id: undefined }] },
      { path: "trivia/history.json", data: [{ ...validItem, id: undefined, topic: "history" }] },
    ]);

    expect(report.problems.map(({ file, field, message }) => ({ file, field, duplicate: /another item/.test(message) }))).toEqual([
      { file: "trivia/geography.json", field: "id", duplicate: false },
      { file: "trivia/history.json", field: "id", duplicate: false },
    ]);
  });
});

const talkEn = {
  question: "Would you rather be able to fly or be invisible?",
  optionA: "Fly",
  optionB: "Be invisible",
  followUps: ["Where would you go first?", "Would you tell anyone?"],
};
const talkEs = {
  question: "¿Qué preferís: poder volar o ser invisible?",
  optionA: "Volar",
  optionB: "Ser invisible",
  followUps: ["¿A dónde irías primero?", "¿Se lo contarías a alguien?"],
};
const validTalk = {
  id: "tlk-hyp-00001",
  topic: "hypotheticals",
  type: "would-you-rather",
  intensity: "light",
  en: talkEn,
  es: talkEs,
};

describe("content check: Talk", () => {
  function checkTalk(items: unknown, path = "talk/hypotheticals.json") {
    return checkContent([{ path, data: items }]);
  }

  function problemsFor(item: unknown) {
    return checkTalk([item]).problems.map(({ id, field }) => ({ id, field }));
  }

  it("accepts a valid file", () => {
    expect(checkTalk([validTalk])).toEqual({ problems: [], pending: [] });
  });

  it("accepts a question card with one follow-up and no options", () => {
    const question = { question: "What's the best meal you've ever had?", followUps: ["Who were you with?"] };
    expect(problemsFor({ ...validTalk, type: "question", en: question, es: undefined })).toEqual([]);
  });

  it("reports an item with no es block as pending translation, not a problem", () => {
    expect(checkTalk([{ ...validTalk, es: undefined }])).toEqual({
      problems: [],
      pending: [{ file: "talk/hypotheticals.json", id: "tlk-hyp-00001" }],
    });
  });

  it.each([
    ["no follow-ups", []],
    ["three follow-ups", ["One?", "Two?", "Three?"]],
    ["an empty follow-up", ["One?", " "]],
    ["follow-ups that aren't a list", "One?"],
  ])("rejects %s", (_, followUps) => {
    expect(problemsFor({ ...validTalk, es: { ...talkEs, followUps } })).toEqual([
      { id: "tlk-hyp-00001", field: "es.followUps" },
    ]);
  });

  it("requires a question", () => {
    expect(problemsFor({ ...validTalk, en: { ...talkEn, question: "" } })).toEqual([
      { id: "tlk-hyp-00001", field: "en.question" },
    ]);
  });

  it("requires both options on a would-you-rather card", () => {
    expect(problemsFor({ ...validTalk, en: { ...talkEn, optionA: undefined }, es: { ...talkEs, optionB: "" } })).toEqual([
      { id: "tlk-hyp-00001", field: "en.optionA" },
      { id: "tlk-hyp-00001", field: "es.optionB" },
    ]);
  });

  it("rejects options on a question card", () => {
    expect(problemsFor({ ...validTalk, type: "question" })).toEqual([
      { id: "tlk-hyp-00001", field: "en.optionA" },
      { id: "tlk-hyp-00001", field: "en.optionB" },
      { id: "tlk-hyp-00001", field: "es.optionA" },
      { id: "tlk-hyp-00001", field: "es.optionB" },
    ]);
  });

  it("rejects an invalid type and intensity", () => {
    expect(problemsFor({ ...validTalk, type: "poll", intensity: "spicy" })).toEqual([
      { id: "tlk-hyp-00001", field: "type" },
      { id: "tlk-hyp-00001", field: "intensity" },
    ]);
  });

  it("requires en to be present", () => {
    expect(problemsFor({ ...validTalk, en: undefined })).toEqual([{ id: "tlk-hyp-00001", field: "en" }]);
  });

  it("rejects a Trivia-style ID", () => {
    expect(problemsFor({ ...validTalk, id: "trv-hyp-00001" })).toEqual([{ id: "trv-hyp-00001", field: "id" }]);
  });

  it("rejects an ID whose code doesn't match the topic", () => {
    expect(problemsFor({ ...validTalk, id: "tlk-foo-00001" })).toEqual([{ id: "tlk-foo-00001", field: "id" }]);
  });

  it("rejects a topic that doesn't match the file", () => {
    expect(problemsFor({ ...validTalk, id: "tlk-fod-00001", topic: "food" })).toEqual([
      { id: "tlk-fod-00001", field: "topic" },
    ]);
  });

  it("rejects a Trivia topic in a Talk file", () => {
    const report = checkTalk([{ ...validTalk, topic: "geography" }], "talk/geography.json");

    expect(report.problems.map(({ field }) => field)).toEqual(["(file)", "topic"]);
  });

  it("rejects IDs used twice across Trivia and Talk files alike", () => {
    const report = checkContent([
      { path: "talk/hypotheticals.json", data: [validTalk] },
      { path: "talk/hypotheticals-2.json", data: [validTalk] },
    ]);

    expect(report.problems.map(({ file, field }) => ({ file, field }))).toContainEqual({
      file: "talk/hypotheticals-2.json",
      field: "id",
    });
  });
});

describe("content check: files", () => {
  it("rejects a file outside the known mode folders", () => {
    const report = checkContent([{ path: "jokes/hypotheticals.json", data: [validTalk] }]);

    expect(report.problems.map(({ file, field }) => ({ file, field }))).toEqual([
      { file: "jokes/hypotheticals.json", field: "(file)" },
    ]);
  });
});
