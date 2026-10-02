import { difficulties, triviaTopicCodes } from "./types";

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
    const topic = file.path.match(/^trivia\/([^/]+)\.json$/)?.[1];
    if (!topic || !(topic in triviaTopicCodes)) fileProblem("not a known Trivia topic file");
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
      checkTriviaItem(item, topic, problem);
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

function checkTriviaItem(item: Item, fileTopic: string | undefined, problem: ProblemFn) {
  const id = item.id;
  const code = triviaTopicCodes[item.topic as keyof typeof triviaTopicCodes];
  if (typeof id !== "string" || !/^trv-[a-z]{3}-\d{5}$/.test(id)) {
    problem("id", "must look like trv-<topic code>-<5 digits>, e.g. trv-geo-00042");
  } else if (code && !id.startsWith(`trv-${code}-`)) {
    problem("id", `must start with trv-${code}- for topic ${item.topic}`);
  }
  if (!code) problem("topic", `${String(item.topic)} is not a Trivia topic`);
  else if (item.topic !== fileTopic) problem("topic", `${String(item.topic)} doesn't match the file`);
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function sameIgnoringCaseAndSpace(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
