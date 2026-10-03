// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bundledContentBank } from "./bundled";
import { checkContent, type ContentFile } from "./check";

const contentDir = join(__dirname, "../../content");

function loadFiles(mode: string): ContentFile[] {
  return readdirSync(join(contentDir, mode))
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({
      path: `${mode}/${name}`,
      data: JSON.parse(readFileSync(join(contentDir, mode, name), "utf8")),
    }));
}

describe("the real content bank", () => {
  const triviaFiles = loadFiles("trivia");
  const talkFiles = loadFiles("talk");

  it("passes the content check", () => {
    const { problems, pending } = checkContent([...triviaFiles, ...talkFiles]);

    if (pending.length > 0) {
      console.info(`${pending.length} item(s) pending translation:\n${pending.map((p) => `  ${p.file} ${p.id}`).join("\n")}`);
    }
    expect(problems.map((p) => p.message)).toEqual([]);
  });

  it("bundles every Trivia file into the app", async () => {
    const fileIds = triviaFiles.flatMap((file) => (file.data as { id: string }[]).map((item) => item.id));
    const bundledIds = (await bundledContentBank.trivia()).map((item) => item.id);

    expect([...bundledIds].sort()).toEqual([...fileIds].sort());
  });

  it("bundles every Talk file into the app", async () => {
    const fileIds = talkFiles.flatMap((file) => (file.data as { id: string }[]).map((item) => item.id));
    const bundledIds = (await bundledContentBank.talk()).map((item) => item.id);

    expect(fileIds).not.toEqual([]);
    expect([...bundledIds].sort()).toEqual([...fileIds].sort());
  });
});
