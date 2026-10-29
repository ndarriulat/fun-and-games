// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".

/**
 * Six short spooky sounds, made by the browser (no audio files): a whisper, a creaking door, a
 * ghostly moan, a music box, three knocks and a heartbeat. Phones only allow sound after a tap, so
 * `unlock` runs on taps in the Halloween games and `play` picks one at random.
 */
export type SpookySounds = {
  unlock(): void;
  /** Plays the named sound, or a random one. */
  play(name?: SoundName): void;
};

export const soundNames = ["whisper", "creak", "moan", "musicBox", "knocks", "heartbeat"] as const;
export type SoundName = (typeof soundNames)[number];

type Sound = (ctx: AudioContext, out: AudioNode, at: number) => void;

let context: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return null;
  context ??= new Context();
  if (context.state === "suspended") void context.resume();
  return context;
}

function noise(ctx: AudioContext) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  return source;
}

const whisper: Sound = (ctx, out, t) => {
  const source = noise(ctx);
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2600;
  band.Q.value = 1.4;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  source.connect(band).connect(gain).connect(out);
  // Syllable-like puffs of breath.
  let at = t + 0.05;
  for (const length of [0.22, 0.14, 0.3, 0.18, 0.12, 0.38, 0.2]) {
    gain.gain.setTargetAtTime(0.9, at, 0.03);
    band.frequency.setTargetAtTime(1800 + Math.random() * 2200, at, 0.05);
    gain.gain.setTargetAtTime(0.05, at + length, 0.04);
    at += length + 0.06 + Math.random() * 0.08;
  }
  gain.gain.setTargetAtTime(0, at, 0.05);
  source.start(t);
  source.stop(at + 0.4);
};

const creak: Sound = (ctx, out, t) => {
  const length = 1.8;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(18, t);
  osc.frequency.linearRampToValueAtTime(42, t + 0.7);
  osc.frequency.linearRampToValueAtTime(26, t + 1.3);
  osc.frequency.linearRampToValueAtTime(55, t + length);
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 9;
  band.frequency.setValueAtTime(700, t);
  band.frequency.linearRampToValueAtTime(1100, t + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(1.6, t + 0.15);
  gain.gain.setValueAtTime(1.6, t + length - 0.3);
  gain.gain.linearRampToValueAtTime(0, t + length);
  osc.connect(band).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + length);
};

const moan: Sound = (ctx, out, t) => {
  const length = 2.8;
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(190, t);
  osc.frequency.exponentialRampToValueAtTime(320, t + 1.1);
  osc.frequency.exponentialRampToValueAtTime(170, t + length);
  const wobble = ctx.createOscillator();
  wobble.frequency.value = 5.5;
  const depth = ctx.createGain();
  depth.gain.value = 9;
  wobble.connect(depth).connect(osc.frequency);
  const low = ctx.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 900;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.8, t + 0.6);
  gain.gain.setValueAtTime(0.8, t + length - 0.9);
  gain.gain.linearRampToValueAtTime(0, t + length);
  osc.connect(low).connect(gain).connect(out);
  osc.start(t);
  wobble.start(t);
  osc.stop(t + length);
  wobble.stop(t + length);
};

const musicBox: Sound = (ctx, out, t) => {
  // A minor lullaby, slightly out of tune, slowing down like a spring running out.
  let at = t;
  [76, 79, 83, 81, 79, 76, 74, 76].forEach((midi, i) => {
    const frequency = 440 * Math.pow(2, (midi - 69) / 12) * (1 + (Math.random() - 0.5) * 0.012);
    for (const [multiple, level] of [
      [1, 0.5],
      [3.01, 0.12],
      [5.2, 0.05],
    ]) {
      const osc = ctx.createOscillator();
      osc.frequency.value = frequency * multiple;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(level, at + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0005, at + 1.1);
      osc.connect(gain).connect(out);
      osc.start(at);
      osc.stop(at + 1.2);
    }
    at += 0.28 + i * 0.035;
  });
};

const knocks: Sound = (ctx, out, t) => {
  for (let i = 0, at = t; i < 3; i++, at += 0.42) {
    const body = ctx.createOscillator();
    body.frequency.setValueAtTime(160, at);
    body.frequency.exponentialRampToValueAtTime(70, at + 0.12);
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(1.4, at);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, at + 0.18);
    body.connect(bodyGain).connect(out);
    body.start(at);
    body.stop(at + 0.2);
    const hit = noise(ctx);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1800;
    const hitGain = ctx.createGain();
    hitGain.gain.setValueAtTime(0.7, at);
    hitGain.gain.exponentialRampToValueAtTime(0.001, at + 0.04);
    hit.connect(band).connect(hitGain).connect(out);
    hit.start(at);
    hit.stop(at + 0.06);
  }
};

const heartbeat: Sound = (ctx, out, t) => {
  for (let beat = 0, at = t; beat < 4; beat++, at += 0.95) {
    for (const [offset, level] of [
      [0, 1.6],
      [0.22, 1.1],
    ]) {
      const start = at + offset;
      const osc = ctx.createOscillator();
      osc.frequency.setValueAtTime(85, start);
      osc.frequency.exponentialRampToValueAtTime(42, start + 0.14);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(level, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain).connect(out);
      osc.start(start);
      osc.stop(start + 0.25);
    }
  }
};

const sounds: Record<SoundName, Sound> = { whisper, creak, moan, musicBox, knocks, heartbeat };

/** The real sounds, for the browser. Does nothing where there's no Web Audio. */
export const browserSpookySounds: SpookySounds = {
  unlock() {
    audio();
  },
  play(name) {
    const ctx = audio();
    if (!ctx) return;
    const out = ctx.createGain();
    // About half volume: noticeable, not a jump scare.
    out.gain.value = 0.5;
    out.connect(ctx.destination);
    const pick = name ?? soundNames[Math.floor(Math.random() * soundNames.length)];
    sounds[pick](ctx, out, ctx.currentTime + 0.03);
  },
};
