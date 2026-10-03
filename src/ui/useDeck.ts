import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentBank } from "@/content/bank";
import type { Mode } from "@/content/types";
import { deal } from "@/play/deal";
import { appStorage, type SavedState } from "@/play/storage";
import { useDeps } from "./deps";

/** How many previous cards Back can return to. */
const BACK_LIMIT = 10;

/** A card on the trail: the item plus whatever has been revealed on it. */
export type DeckCard<T, V> = { key: number; item: T; view: V };

type Trail<T, V> = { cards: DeckCard<T, V>[]; index: number };

/**
 * One mode's deck: deals unplayed items from the pool, remembers them as played on this phone,
 * and keeps a recent trail of cards (with their revealed state) for Back and Next.
 * The trail lives in memory only.
 */
export function useDeck<T extends { id: string }, V>({
  mode,
  loadPool,
  initialView,
}: {
  mode: Mode;
  /** Must be stable (defined outside the component). Gets the saved state, for hidden topics. */
  loadPool: (content: ContentBank, saved: SavedState) => Promise<readonly T[]>;
  initialView: V;
}) {
  const { content, storage, random } = useDeps();
  const saved = useMemo(() => appStorage(storage), [storage]);
  const [pool, setPool] = useState<readonly T[] | null>(null);
  const [trail, setTrailState] = useState<Trail<T, V>>({ cards: [], index: -1 });
  // Mirrors the trail so quick taps and swipes before a re-render act on the latest trail.
  const trailRef = useRef(trail);
  const [reshuffled, setReshuffled] = useState(false);
  // Kept in memory too, so cards don't repeat this session even if storage isn't working.
  const played = useRef<string[]>([]);
  const nextKey = useRef(0);

  function setTrail(next: Trail<T, V>) {
    trailRef.current = next;
    setTrailState(next);
  }

  function dealOnto(from: Trail<T, V>, items: readonly T[]): Trail<T, V> {
    // On a fresh trail, the card last seen is the last one played (possibly in an earlier session).
    const lastSeen = from.cards[from.index]?.item.id ?? played.current.at(-1);
    const dealt = deal(items, played.current, lastSeen, random);
    if (!dealt) return from;
    played.current = dealt.played;
    saved.update((state) => ({ ...state, played: { ...state.played, [mode]: dealt.played } }));
    setReshuffled(dealt.reshuffled);
    const cards = [...from.cards, { key: nextKey.current++, item: dealt.item, view: initialView }].slice(-(BACK_LIMIT + 1));
    return { cards, index: cards.length - 1 };
  }

  useEffect(() => {
    let cancelled = false;
    const state = saved.load();
    loadPool(content, state).then((items) => {
      if (cancelled) return;
      played.current = state.played[mode];
      setPool(items);
      setTrail(dealOnto({ cards: [], index: -1 }, items));
    });
    return () => {
      cancelled = true;
    };
    // Deal once per pool load. dealOnto also reads random and initialView at deal time, but
    // re-running this when their identity changes would deal a new card and wipe the trail.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, loadPool, mode, saved]);

  return {
    card: trail.cards[trail.index] as DeckCard<T, V> | undefined,
    /** True once the pool has loaded and turned out empty. */
    empty: pool !== null && pool.length === 0,
    /** True when this card was dealt after the whole pool had been played. */
    reshuffled,
    canGoBack: trail.index > 0,
    next() {
      const current = trailRef.current;
      setReshuffled(false);
      if (current.index < current.cards.length - 1) setTrail({ ...current, index: current.index + 1 });
      else if (pool) setTrail(dealOnto(current, pool));
    },
    back() {
      const current = trailRef.current;
      if (current.index <= 0) return;
      setReshuffled(false);
      setTrail({ ...current, index: current.index - 1 });
    },
    setView(view: V) {
      const current = trailRef.current;
      setTrail({
        ...current,
        cards: current.cards.map((card, i) => (i === current.index ? { ...card, view } : card)),
      });
    },
  };
}
