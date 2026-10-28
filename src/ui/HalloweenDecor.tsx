// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useId } from "react";
import { useLanguage } from "./language";

/** Spokes of a quarter web hanging from the top-right corner, from straight down to straight left. */
const CENTRE = { x: 120, y: 0 };
const ANGLES = [90, 105, 120, 135, 150, 165, 180].map((degrees) => (degrees * Math.PI) / 180);
const RINGS = [24, 48, 74, 100];

function point(radius: number, angle: number) {
  return { x: CENTRE.x + radius * Math.cos(angle), y: CENTRE.y + radius * Math.sin(angle) };
}

const spokes = ANGLES.map((angle) => {
  const end = point(118, angle);
  return `M${CENTRE.x} ${CENTRE.y}L${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}).join("");

// Each ring sags a little towards the corner between spokes, like real thread.
const rings = RINGS.map((radius) =>
  ANGLES.slice(1)
    .map((angle, i) => {
      const from = point(radius, ANGLES[i]);
      const to = point(radius, angle);
      const sag = point(radius * 0.86, (ANGLES[i] + angle) / 2);
      const move = i === 0 ? `M${from.x.toFixed(1)} ${from.y.toFixed(1)}` : "";
      return `${move}Q${sag.x.toFixed(1)} ${sag.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
    })
    .join(""),
).join("");

/** The extras on Home's Halloween Talk card: a "Special edition" ribbon, a web with a spider, and pumpkins. All decoration. */
export function HalloweenDecor() {
  const { t } = useLanguage();
  // Gradient and filter IDs must be unique on the page, and React's own IDs aren't valid in url(#…).
  const id = `pumpkin${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <span className="halloween-decor" aria-hidden="true">
      <span className="halloween-ribbon">{t.halloween.ribbon}</span>
      <svg className="halloween-web" viewBox="0 0 120 120">
        <path d={spokes + rings} />
        <line className="halloween-thread" x1="76" y1="44" x2="76" y2="86" />
        <g className="halloween-spider" transform="translate(76 92)">
          <path d="M-3 -2L-11 -8M-3 0L-12 -1M-3 2L-11 6M-2 4L-8 11M3 -2L11 -8M3 0L12 -1M3 2L11 6M2 4L8 11" />
          <ellipse cx="0" cy="1" rx="4.5" ry="5.5" />
          <circle cx="0" cy="-5" r="3" />
        </g>
      </svg>
      <svg className="halloween-pumpkins" viewBox="0 0 104 58">
        <PumpkinDefs id={id} />
        <Pumpkin id={id} x={0} y={20} size={0.62} tilt={-8} leaf />
        <Pumpkin id={id} x={38} y={0} size={1} face />
      </svg>
    </span>
  );
}

/** Shading shared by the pumpkins: a lit body, darker side lobes, the stem, and the glow inside the carving. */
function PumpkinDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-lit`} cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor="#ffc46b" />
        <stop offset="0.45" stopColor="#ff8a1f" />
        <stop offset="1" stopColor="#b9440b" />
      </radialGradient>
      <radialGradient id={`${id}-side`} cx="50%" cy="35%" r="80%">
        <stop offset="0" stopColor="#f47a1a" />
        <stop offset="1" stopColor="#8f330a" />
      </radialGradient>
      <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a6a2e" />
        <stop offset="1" stopColor="#3f5f1c" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="60%">
        <stop offset="0" stopColor="#fff6c2" />
        <stop offset="0.5" stopColor="#ffd23f" />
        <stop offset="1" stopColor="#ff9f1c" />
      </radialGradient>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.4" result="soft" />
        <feMerge>
          <feMergeNode in="soft" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

const FACE =
  "M18.5 29L23.5 19.5L28 29.5ZM41.5 29L36.5 19.5L32 29.5ZM30 30.5L27.5 35H32.5Z" +
  "M17 37C21 41 26 43 30 43C34 43 39 41 43 37L41 36L38 39L36 36L33 40L30 37L27 40L24 36L22 39L19 36Z";

/** A shaded pumpkin, 60 wide by 52 tall at size 1: five ribbed lobes, a curled stem, optionally a leaf or a glowing carved face. */
function Pumpkin({
  id,
  x,
  y,
  size,
  tilt = 0,
  face = false,
  leaf = false,
}: {
  id: string;
  x: number;
  y: number;
  size: number;
  tilt?: number;
  face?: boolean;
  leaf?: boolean;
}) {
  const rib = { stroke: "rgba(110, 35, 0, 0.45)", strokeWidth: 0.9 };
  return (
    <g transform={`translate(${x} ${y}) scale(${size}) rotate(${tilt} 30 32)`}>
      <ellipse cx="30" cy="51" rx="24" ry="2.5" fill="rgba(0, 0, 0, 0.35)" />
      <ellipse cx="13" cy="33" rx="12" ry="16" fill={`url(#${id}-side)`} {...rib} />
      <ellipse cx="47" cy="33" rx="12" ry="16" fill={`url(#${id}-side)`} {...rib} />
      <ellipse cx="21" cy="32" rx="13" ry="18" fill={`url(#${id}-lit)`} {...rib} />
      <ellipse cx="39" cy="32" rx="13" ry="18" fill={`url(#${id}-lit)`} {...rib} />
      <ellipse cx="30" cy="31.5" rx="11" ry="19" fill={`url(#${id}-lit)`} {...rib} />
      <ellipse cx="25" cy="22" rx="4" ry="7" fill="rgba(255, 240, 210, 0.28)" transform="rotate(-18 25 22)" />
      <path d="M27 15C27 10 28 6 32 3L35 5C32 8 31 11 31.5 15Z" fill={`url(#${id}-stem)`} />
      <path d="M32 4C37 1 42 4 40 8C39 10 36 9 37 7" fill="none" stroke="#4d7a22" strokeWidth="1.2" strokeLinecap="round" />
      {leaf && <path d="M31 12C36 7 44 8 47 12C42 15 36 15 31 12Z" fill="#5b8a2e" stroke="#3d6119" strokeWidth="0.8" />}
      {face && (
        <>
          {/* The cut edge, a little wider than the glow inside it. */}
          <path d={FACE} fill="#4a1503" stroke="#4a1503" strokeWidth="1.6" strokeLinejoin="round" />
          <path d={FACE} fill={`url(#${id}-glow)`} filter={`url(#${id}-blur)`} />
        </>
      )}
    </g>
  );
}
