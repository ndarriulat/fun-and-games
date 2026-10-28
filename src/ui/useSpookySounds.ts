// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useEffect, useMemo, useRef, useState } from "react";
import { gameSave } from "@/play/halloweenSaves";
import { useDeps } from "./deps";

/** A sound plays on every this-many-th new card. */
const EVERY = 5;

type SoundSetting = { muted: boolean };

const isSoundSetting = (value: unknown): value is SoundSetting =>
  typeof value === "object" && value !== null && typeof (value as SoundSetting).muted === "boolean";

/** Whether the spooky sounds are muted on this phone, and a way to change it. Sounds are on by default. */
export function useSoundSetting() {
  const { storage } = useDeps();
  const save = useMemo(() => gameSave(storage, "sound", isSoundSetting), [storage]);
  const [muted, setMuted] = useState(() => save.load()?.muted ?? false);
  return {
    muted,
    setMuted(next: boolean) {
      setMuted(next);
      save.save({ muted: next });
    },
  };
}

/** Plays one spooky sound now, unless muted: for Taboo and Categories when the 60 seconds run out. */
export function useSpookySound() {
  const { spookySounds } = useDeps();
  const { muted } = useSoundSetting();
  return () => {
    if (!muted) spookySounds.play();
  };
}

/**
 * Plays a spooky sound on every fifth card dealt, unless muted. `cardKey` counts dealt cards from 0;
 * going Back and forward again shows cards already counted, so they don't play twice.
 */
export function useSpookyEveryFifth(cardKey: number | undefined, enabled: boolean) {
  const { spookySounds } = useDeps();
  const { muted } = useSoundSetting();
  const played = useRef(new Set<number>());

  useEffect(() => {
    if (!enabled || muted || cardKey === undefined || (cardKey + 1) % EVERY !== 0) return;
    if (played.current.has(cardKey)) return;
    played.current.add(cardKey);
    spookySounds.play();
  }, [cardKey, enabled, muted, spookySounds]);
}
