// Halloween 2026: remove in ticket 03 (.scratch/halloween-talk), with everything marked "Halloween 2026".
import type { Topic } from "./topics";

/** The Talk topics only Halloween Talk deals. Regular Talk never does, and they can't be hidden. */
const HALLOWEEN_TOPICS: ReadonlySet<string> = new Set<Topic>(["halloween", "halloween-portugal"]);

export function isHalloweenTopic(topic: string): boolean {
  return HALLOWEEN_TOPICS.has(topic);
}

/** Home stops showing Halloween Talk from this moment, on the phone's own clock: the end of 8 November 2026. */
const HALLOWEEN_ENDS = new Date(2026, 10, 9);

export function isHalloweenSeason(now: Date): boolean {
  return now < HALLOWEEN_ENDS;
}
