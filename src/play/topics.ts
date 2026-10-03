import { triviaTopicCodes, type TriviaTopic } from "@/content/types";

/** A topic that can be hidden in Settings. Talk topics join these in ticket 05. */
export type Topic = TriviaTopic;

export const allTopics = Object.keys(triviaTopicCodes) as Topic[];

/**
 * The player's changes from the default visibility, never the full list. A topic added later as
 * hidden by default is then hidden for existing players too.
 */
export type TopicChanges = Partial<Record<Topic, TopicVisibility>>;

export type TopicVisibility = "shown" | "hidden";

export function isTopicVisibility(value: unknown): value is TopicVisibility {
  return value === "shown" || value === "hidden";
}

const hiddenByDefault: ReadonlySet<Topic> = new Set(["uruguay"]);

/** Hidden if the player hid it, or if it's hidden by default and the player hasn't shown it. */
export function isTopicHidden(topic: Topic, changes: TopicChanges): boolean {
  const change = changes[topic];
  return change === undefined ? hiddenByDefault.has(topic) : change === "hidden";
}
