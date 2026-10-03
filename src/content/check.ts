import { difficulties, intensities, talkTopicCodes, talkTypes, triviaTopicCodes } from "./types";

export type ContentFile = {
  /** Path relative to the content folder, e.g. `trivia/geography.json`. */
  path: string;
  data: unknown;
};

export type Problem = { file: string; id?: string; field: string; message: string };
export type Pending = { file: string; id: string };
export type ContentReport = { problems: Problem[]; pending: Pending[] };

type Item = Record<string, unknown>;

/** Validates content files. Problems fail the check; pending translations don't. */
export function checkContent(files: readonly ContentFile[]): ContentReport {
  const report: ContentReport = { problems: [], pending: [] };
  const seenIds = new Set<string>();

  for (const file of files) {
    const fileProblem = (message: string) =>
      report.problems.push({ file: file.path, field: "(file)", message: `${file.path}: ${message}` });
    const [, folder, topic] = file.path.match(/^(trivia|talk)\/([^/]+)\.json$/) ?? [];
    const mode = folder ? modes[folder as keyof typeof modes] : undefined;
    if (!mode) fileProblem("not in a known mode folder (trivia/ or talk/)");
    else if (!(topic in mode.topicCodes)) fileProblem(`not a known ${mode.name} topic file`);
    if (!Array.isArray(file.data)) {
      fileProblem("must be a JSON array of items");
      continue;
    }

    for (const [index, item] of file.data.entries()) {
      const id = isObject(item) && typeof item.id === "string" ? item.id : `#${index}`;
      const problem = (field: string, message: string) =>
        report.problems.push({ file: file.path, id, field, message: `${file.path} ${id} ${field}: ${message}` });
      if (!isObject(item)) {
        problem("(item)", "must be an object");
        continue;
      }
      if (mode) mode.checkItem(item, topic, problem);
      if (typeof item.id === "string") {
        if (seenIds.has(item.id)) problem("id", "is used by another item");
        seenIds.add(item.id);
      }
      if (item.es === undefined) report.pending.push({ file: file.path, id });
    }
  }
  return report;
}

type ProblemFn = (field: string, message: string) => void;

type ModeRules = { name: string; prefix: string; topicCodes: Record<string, string> };

const triviaRules: ModeRules = { name: "Trivia", prefix: "trv", topicCodes: triviaTopicCodes };
const talkRules: ModeRules = { name: "Talk", prefix: "tlk", topicCodes: talkTopicCodes };

const modes = {
  trivia: { ...triviaRules, checkItem: checkTriviaItem },
  talk: { ...talkRules, checkItem: checkTalkItem },
};

/** Checks the ID format and that the topic is valid and matches both the ID and the file. */
function checkIdAndTopic(
  item: Item,
  fileTopic: string | undefined,
  { prefix, name, topicCodes }: ModeRules,
  problem: ProblemFn,
) {
  const id = item.id;
  const code = Object.hasOwn(topicCodes, item.topic as string) ? topicCodes[item.topic as string] : undefined;
  const example = `${prefix}-${Object.values(topicCodes)[0]}-00042`;
  if (typeof id !== "string" || !new RegExp(`^${prefix}-[a-z]{3}-\\d{5}$`).test(id)) {
    problem("id", `must look like ${prefix}-<topic code>-<5 digits>, e.g. ${example}`);
  } else if (code && !id.startsWith(`${prefix}-${code}-`)) {
    problem("id", `must start with ${prefix}-${code}- for topic ${item.topic}`);
  }
  if (!code) problem("topic", `${String(item.topic)} is not a ${name} topic`);
  else if (item.topic !== fileTopic) problem("topic", `${String(item.topic)} doesn't match the file`);
}

function checkTriviaItem(item: Item, fileTopic: string | undefined, problem: ProblemFn) {
  checkIdAndTopic(item, fileTopic, triviaRules, problem);
  if (!difficulties.includes(item.difficulty as never)) {
    problem("difficulty", `must be one of ${difficulties.join(", ")}`);
  }

  if (item.en === undefined) problem("en", "English text is missing");
  else checkTriviaText(item.en, "en", problem);
  if (item.es !== undefined) checkTriviaText(item.es, "es", problem);
}

function checkTriviaText(text: unknown, language: string, problem: ProblemFn) {
  if (!isObject(text)) return problem(language, "must be an object");
  for (const field of ["question", "answer", "fact"]) {
    if (!isFilledString(text[field])) problem(`${language}.${field}`, "must be a non-empty string");
  }
  const options = text.options;
  if (!Array.isArray(options) || options.length !== 3 || !options.every(isFilledString)) {
    return problem(`${language}.options`, "must be exactly 3 options, all non-empty strings");
  }
  if (isFilledString(text.answer) && options.some((option) => sameIgnoringCaseAndSpace(option, text.answer as string))) {
    problem(`${language}.options`, "an option is the same as the answer");
  } else if (options.some((option, i) => options.slice(i + 1).some((other) => sameIgnoringCaseAndSpace(option, other)))) {
    problem(`${language}.options`, "two options are the same");
  }
}

function checkTalkItem(item: Item, fileTopic: string | undefined, problem: ProblemFn) {
  checkIdAndTopic(item, fileTopic, talkRules, problem);
  if (!talkTypes.includes(item.type as never)) problem("type", `must be one of ${talkTypes.join(", ")}`);
  if (!intensities.includes(item.intensity as never)) problem("intensity", `must be one of ${intensities.join(", ")}`);

  if (item.en === undefined) problem("en", "English text is missing");
  else checkTalkText(item.en, "en", item.type, problem);
  if (item.es !== undefined) checkTalkText(item.es, "es", item.type, problem);
}

function checkTalkText(text: unknown, language: string, type: unknown, problem: ProblemFn) {
  if (!isObject(text)) return problem(language, "must be an object");
  if (!isFilledString(text.question)) problem(`${language}.question`, "must be a non-empty string");
  const followUps = text.followUps;
  if (!Array.isArray(followUps) || followUps.length < 1 || followUps.length > 2 || !followUps.every(isFilledString)) {
    problem(`${language}.followUps`, "must be 1 or 2 follow-ups, all non-empty strings");
  }
  for (const field of ["optionA", "optionB"]) {
    if (type === "would-you-rather" && !isFilledString(text[field])) {
      problem(`${language}.${field}`, "a would-you-rather card needs both options as non-empty strings");
    } else if (type === "question" && text[field] !== undefined) {
      problem(`${language}.${field}`, "only would-you-rather cards have options");
    }
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function sameIgnoringCaseAndSpace(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
