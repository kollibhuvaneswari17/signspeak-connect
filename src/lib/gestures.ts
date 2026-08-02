// Heuristic sign-language gesture recognition from MediaPipe hand landmarks.
// Modular: add new gestures by pushing to GESTURES with a matcher function.

export type Landmark = { x: number; y: number; z: number };

export type GestureMatch = {
  name: string;
  text: string;
  confidence: number;
};

// Landmark indices per MediaPipe Hands spec
const TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const PIPS = { thumb: 3, index: 6, middle: 10, ring: 14, pinky: 18 };
const MCPS = { thumb: 2, index: 5, middle: 9, ring: 13, pinky: 17 };

function dist(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// A finger is "extended" if the tip is further from the wrist than the PIP joint.
function fingerStates(lm: Landmark[]) {
  const wrist = lm[0];
  const extended = (tip: number, pip: number) => dist(lm[tip], wrist) > dist(lm[pip], wrist) * 1.05;
  // Thumb uses x-axis comparison relative to hand orientation
  const thumbExtended = Math.abs(lm[TIPS.thumb].x - lm[MCPS.pinky].x) > Math.abs(lm[PIPS.thumb].x - lm[MCPS.pinky].x);
  return {
    thumb: thumbExtended,
    index: extended(TIPS.index, PIPS.index),
    middle: extended(TIPS.middle, PIPS.middle),
    ring: extended(TIPS.ring, PIPS.ring),
    pinky: extended(TIPS.pinky, PIPS.pinky),
  };
}

type Gesture = {
  name: string;
  text: string;
  match: (lm: Landmark[], f: ReturnType<typeof fingerStates>) => number; // 0..1 confidence
};

const GESTURES: Gesture[] = [
  {
    name: "HELLO",
    text: "Hello",
    // Open palm — all five fingers extended
    match: (_lm, f) =>
      f.thumb && f.index && f.middle && f.ring && f.pinky ? 0.97 : 0,
  },
  {
    name: "STOP",
    text: "Stop",
    // Same open palm but held with palm facing forward — approximate via fingers spread + low z spread
    match: (lm, f) => {
      if (!(f.index && f.middle && f.ring && f.pinky)) return 0;
      const spread = dist(lm[TIPS.index], lm[TIPS.pinky]);
      return spread > 0.18 && !f.thumb ? 0.9 : 0;
    },
  },
  {
    name: "YES",
    text: "Yes",
    // Closed fist
    match: (_lm, f) =>
      !f.index && !f.middle && !f.ring && !f.pinky ? 0.94 : 0,
  },
  {
    name: "NO",
    text: "No",
    // Index + middle extended (like a "peace" -> commonly used for "no" in this app's vocab)
    match: (_lm, f) =>
      f.index && f.middle && !f.ring && !f.pinky ? 0.93 : 0,
  },
  {
    name: "HELP",
    text: "Help",
    // Thumb up only
    match: (_lm, f) =>
      f.thumb && !f.index && !f.middle && !f.ring && !f.pinky ? 0.92 : 0,
  },
  {
    name: "PLEASE",
    text: "Please",
    // Pinky only extended
    match: (_lm, f) =>
      !f.index && !f.middle && !f.ring && f.pinky ? 0.9 : 0,
  },
  {
    name: "WATER",
    text: "Water",
    // "W" — index, middle, ring extended
    match: (_lm, f) =>
      f.index && f.middle && f.ring && !f.pinky ? 0.95 : 0,
  },
  {
    name: "THANK YOU",
    text: "Thank you",
    // Index only extended (pointing gesture)
    match: (_lm, f) =>
      f.index && !f.middle && !f.ring && !f.pinky ? 0.9 : 0,
  },
  {
  name: "GOOD",
  text: "Good",
  match: (_lm, f) =>
    f.thumb && !f.index && !f.middle && !f.ring && !f.pinky
      ? 0.96
      : 0,
  },
  {
  name: "BAD",
  text: "Bad",
  match: (lm, f) => {
    const thumbDown = lm[4].y > lm[2].y;
    return thumbDown &&
      f.thumb &&
      !f.index &&
      !f.middle &&
      !f.ring &&
      !f.pinky
        ? 0.95
        : 0;
  },
  },
  {
  name: "OK",
  text: "Okay",
  match: (lm, f) => {
    const touching = dist(lm[4], lm[8]) < 0.05;

    return touching &&
      f.middle &&
      f.ring &&
      f.pinky
        ? 0.95
        : 0;
  },
  },
  {
  name: "PEACE",
  text: "Peace",
  match: (_lm, f) =>
    f.index &&
    f.middle &&
    !f.ring &&
    !f.pinky &&
    !f.thumb
      ? 0.95
      : 0,
  },
  {
  name: "I LOVE YOU",
  text: "I Love You",
  match: (_lm, f) =>
    f.thumb &&
    f.index &&
    !f.middle &&
    !f.ring &&
    f.pinky
      ? 0.98
      : 0,
  },
  {
    name: "LOVE",
    text: "Love",
    match: (_lm, f) =>
      f.thumb && f.pinky && !f.index && !f.middle && !f.ring
        ? 0.90
        : 0,
  },
];

export function recognizeGesture(landmarks: Landmark[]): GestureMatch | null {
  if (!landmarks || landmarks.length < 21) return null;
  const f = fingerStates(landmarks);
  let best: GestureMatch | null = null;
  for (const g of GESTURES) {
    const c = g.match(landmarks, f);
    if (c > 0 && (!best || c > best.confidence)) {
      best = { name: g.name, text: g.text, confidence: c };
    }
  }
  return best;
}

export const SUPPORTED_GESTURES = GESTURES.map((g) => ({ name: g.name, text: g.text }));
