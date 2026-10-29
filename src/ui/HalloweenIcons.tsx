// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import type { HalloweenGame } from "./strings";

/** Each Halloween game's icon, drawn in the card's title colour. */
const icons: Record<HalloweenGame, React.ReactNode> = {
  // A ghost: Talk.
  talk: (
    <>
      <path d="M16 54V28a16 16 0 0 1 32 0v26l-5.3-4-5.4 4-5.3-4-5.3 4-5.4-4z" />
      <circle cx="26" cy="28" r="2.6" className="fill" />
      <circle cx="38" cy="28" r="2.6" className="fill" />
      <path d="M28 37q4 3 8 0" />
    </>
  ),
  // A crystal ball with a question in it: Trivia.
  trivia: (
    <>
      <circle cx="32" cy="27" r="18" />
      <path d="M17 56h30l-4-9H21z" />
      <path d="M27 22a5 5 0 1 1 7 4.6c-1.4.6-2 1.6-2 3V31" />
      <circle cx="32" cy="36" r="1.6" className="fill" />
      <path d="M21 19a12 12 0 0 1 6-5" />
    </>
  ),
  // A speech bubble with a forbidden sign: Taboo.
  taboo: (
    <>
      <path d="M8 12h48v32H32l-11 10V44H8z" />
      <circle cx="32" cy="28" r="9" />
      <path d="M25.6 34.4l12.8-12.8" />
    </>
  ),
  // A bubbling cauldron: Categories.
  categories: (
    <>
      <path d="M8 31h48" />
      <path d="M12 31l3 15a10 10 0 0 0 10 8h14a10 10 0 0 0 10-8l3-15" />
      <path d="M21 54l-3 5M43 54l3 5" />
      <circle cx="24" cy="22" r="3" />
      <circle cx="34" cy="15" r="4" />
      <circle cx="42" cy="23" r="2.5" />
    </>
  ),
};

export function GameIcon({ game }: { game: HalloweenGame }) {
  return (
    <svg className="game-icon" viewBox="0 0 64 64" aria-hidden="true">
      {icons[game]}
    </svg>
  );
}

const BAT = "M0 6c3-4 7-4 9-1 1-3 3-4 4-4h2c1 0 3 1 4 4 2-3 6-3 9 1-3 0-6 2-7 5-2-2-4-2-6 0-2-2-4-2-6 0-1-3-4-5-9-5z";

/** A little extra on each card: a web, bats, a spider, a witch crossing the moon. */
export function GameDecor({ game }: { game: HalloweenGame }) {
  switch (game) {
    case "talk":
      return (
        <svg className="game-decor game-decor-web" viewBox="0 0 60 60" aria-hidden="true">
          <path d="M60 0L0 60M60 0L20 60M60 0L45 60M60 0L0 20M60 0L0 45" />
          <path d="M60 16q-8 2-11.4 11.4Q42 31 44 44Q31 42 27.4 49.4Q18 52 16 60" />
          <path d="M60 32q-14 4-20 20" />
          <path d="M60 8q-4 1-5.7 5.7Q52 15.5 52 22Q44 22 42.4 26.6" />
        </svg>
      );
    case "trivia":
      return (
        <svg className="game-decor game-decor-bats" viewBox="0 0 80 40" aria-hidden="true">
          <path d={BAT} transform="translate(4 6)" />
          <path d={BAT} transform="translate(44 18) scale(0.7)" />
        </svg>
      );
    case "taboo":
      return (
        <svg className="game-decor game-decor-spider" viewBox="0 0 40 70" aria-hidden="true">
          <path d="M20 0v44" className="thread" />
          <path d="M16 48l-9-6M16 51l-11 0M16 54l-9 6M17 56l-5 9M24 48l9-6M24 51l11 0M24 54l9 6M23 56l5 9" />
          <ellipse cx="20" cy="53" rx="5" ry="6.5" />
          <circle cx="20" cy="45" r="3.5" />
        </svg>
      );
    case "categories":
      return (
        <svg className="game-decor game-decor-witch" viewBox="0 0 90 50" aria-hidden="true">
          <circle cx="56" cy="25" r="22" className="moon" />
          <g className="witch">
            {/* Broom handle, then its bristles at the back. */}
            <path d="M28 38L86 25" className="broom" />
            <path d="M30 37.5L12 33l3 5-5 4 6 0-2 5z" />
            {/* Cape, head and pointed hat, sitting on the broom. */}
            <path d="M44 34l10-15 10 12z" />
            <circle cx="56" cy="16" r="4" />
            <path d="M48 13h15" className="brim" />
            <path d="M51 13q3-7 9-13q-2 7 0 13z" />
            <path d="M60 22l8 7" className="arm" />
          </g>
        </svg>
      );
  }
}
