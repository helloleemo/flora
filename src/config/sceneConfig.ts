/**
 * sceneConfig.ts
 * ------------------------------------------------------------------
 * Central, editable configuration for the entire bloom experience:
 * color palette, scroll pacing, the six narrative stages, and the
 * deterministic flower placement data that drives the overlays.
 *
 * Everything artistic is tuned here so the animation code stays generic.
 */

/* ----------------------------------------------------------------- */
/* Palette                                                            */
/* ----------------------------------------------------------------- */

export const PALETTE = {
  ivory: "#E9E5DC",
  sage: "#A6BBAE",
  dustyRose: "#C29A9F",
  terracotta: "#B7795F",
  deepTeal: "#345963",
  /* Supporting tints derived from the core palette for petal depth. */
  roseLight: "#D9BFC1",
  roseDeep: "#A9767C",
  sageLight: "#C2D1C6",
  sageDeep: "#7F9A89",
  cream: "#F3EFE7",
  stem: "#8A9A82",
} as const;

export type PaletteKey = keyof typeof PALETTE;

/* ----------------------------------------------------------------- */
/* Pacing                                                             */
/* ----------------------------------------------------------------- */

/** Total scroll travel for the pinned scene (viewport heights). */
export const SCROLL_LENGTH_VH = {
  desktop: 900,
  mobile: 600,
} as const;

/* Dev-only pupil calibration markers. Toggle while aligning anchors. */
export const DEV_CALIBRATION = false;

/* ----------------------------------------------------------------- */
/* Narrative stages                                                   */
/* ----------------------------------------------------------------- */

export type SceneName =
  | "stillness"
  | "awakening"
  | "blooming"
  | "overgrowth"
  | "immersion"
  | "eternity";

export interface SceneStage {
  name: SceneName;
  /** Normalized timeline position where the stage begins (0..1). */
  start: number;
  /** Normalized timeline position where the stage ends (0..1). */
  end: number;
}

export const SCENES: SceneStage[] = [
  { name: "stillness", start: 0.0, end: 0.15 },
  { name: "awakening", start: 0.15, end: 0.3 },
  { name: "blooming", start: 0.3, end: 0.5 },
  { name: "overgrowth", start: 0.5, end: 0.7 },
  { name: "immersion", start: 0.7, end: 0.9 },
  { name: "eternity", start: 0.9, end: 1.0 },
];

/* ----------------------------------------------------------------- */
/* Flower placement data                                              */
/* ----------------------------------------------------------------- */

export type FlowerType =
  | "peony"
  | "rose"
  | "clematis"
  | "daisy"
  | "blossom"
  | "bud";

export interface FlowerScheme {
  /** Outer petal fill. */
  petal: PaletteKey;
  /** Inner petal fill for layered depth. */
  petalInner: PaletteKey;
  /** Flower centre. */
  center: PaletteKey;
}

export interface FlowerInstance {
  id: string;
  type: FlowerType;
  /** Centre position in the layer's own coordinate space. */
  x: number;
  y: number;
  /** Base scale (1 ≈ natural component size). */
  scale: number;
  /** Resting rotation in degrees. */
  rotation: number;
  scheme: FlowerScheme;
  /** Which narrative stage this flower blooms in. */
  stage: SceneName;
  /** Parallax strength for layered depth (0 = static). */
  parallax?: number;
}

export const SCHEMES: Record<string, FlowerScheme> = {
  rose: { petal: "dustyRose", petalInner: "roseLight", center: "terracotta" },
  roseDeep: { petal: "roseDeep", petalInner: "dustyRose", center: "terracotta" },
  cream: { petal: "cream", petalInner: "ivory", center: "sageDeep" },
  sage: { petal: "sageLight", petalInner: "cream", center: "sageDeep" },
  teal: { petal: "sage", petalInner: "sageLight", center: "deepTeal" },
  terracotta: { petal: "terracotta", petalInner: "dustyRose", center: "deepTeal" },
};

/**
 * Face-level flowers, expressed in the PORTRAIT viewBox (896 x 1200).
 * These bloom across the woman's cheeks, temples and hair so the new
 * growth reads as an extension of the artwork's existing decoration.
 */
export const FACE_FLOWERS: FlowerInstance[] = [
  // Cheeks & under-eyes (blooming)
  { id: "f-cheekL", type: "rose", x: 300, y: 600, scale: 0.62, rotation: -18, scheme: SCHEMES.rose, stage: "blooming" },
  { id: "f-cheekR", type: "peony", x: 560, y: 590, scale: 0.68, rotation: 12, scheme: SCHEMES.roseDeep, stage: "blooming" },
  { id: "f-templeL", type: "clematis", x: 236, y: 452, scale: 0.5, rotation: -34, scheme: SCHEMES.sage, stage: "blooming" },
  { id: "f-templeR", type: "clematis", x: 636, y: 440, scale: 0.52, rotation: 28, scheme: SCHEMES.teal, stage: "blooming" },
  { id: "f-noseL", type: "blossom", x: 362, y: 560, scale: 0.4, rotation: 8, scheme: SCHEMES.cream, stage: "blooming" },
  { id: "f-noseR", type: "blossom", x: 520, y: 548, scale: 0.4, rotation: -10, scheme: SCHEMES.cream, stage: "blooming" },
  // Temples, hairline & jaw (overgrowth)
  { id: "f-hairL", type: "peony", x: 190, y: 330, scale: 0.74, rotation: -22, scheme: SCHEMES.rose, stage: "overgrowth", parallax: 0.3 },
  { id: "f-hairR", type: "peony", x: 690, y: 320, scale: 0.78, rotation: 20, scheme: SCHEMES.roseDeep, stage: "overgrowth", parallax: 0.3 },
  { id: "f-browL", type: "daisy", x: 288, y: 392, scale: 0.44, rotation: -12, scheme: SCHEMES.cream, stage: "overgrowth" },
  { id: "f-browR", type: "daisy", x: 592, y: 384, scale: 0.44, rotation: 14, scheme: SCHEMES.sage, stage: "overgrowth" },
  { id: "f-jawL", type: "rose", x: 268, y: 736, scale: 0.6, rotation: -8, scheme: SCHEMES.terracotta, stage: "overgrowth", parallax: 0.2 },
  { id: "f-jawR", type: "clematis", x: 596, y: 726, scale: 0.62, rotation: 18, scheme: SCHEMES.teal, stage: "overgrowth", parallax: 0.2 },
  { id: "f-crownL", type: "blossom", x: 360, y: 250, scale: 0.46, rotation: -6, scheme: SCHEMES.rose, stage: "overgrowth" },
  { id: "f-crownR", type: "blossom", x: 520, y: 244, scale: 0.46, rotation: 10, scheme: SCHEMES.cream, stage: "overgrowth" },
];

/**
 * Large foreground & cluster flowers, expressed in the OVERLAY viewBox
 * (1200 x 1200, cover-fitted). These fill the negative space and the
 * viewport edges during Immersion, then blanket the ENTIRE screen —
 * including the face — during Eternity. Flowers grow progressively
 * larger and more ornate toward the finale.
 */
export const OVERLAY_FLOWERS: FlowerInstance[] = [
  // Immersion — medium blooms close in from every edge.
  { id: "o-i1", type: "peony", x: 120, y: 160, scale: 1.35, rotation: -24, scheme: SCHEMES.rose, stage: "immersion", parallax: 0.6 },
  { id: "o-i2", type: "peony", x: 1080, y: 140, scale: 1.4, rotation: 22, scheme: SCHEMES.roseDeep, stage: "immersion", parallax: 0.6 },
  { id: "o-i3", type: "rose", x: 150, y: 1050, scale: 1.45, rotation: -16, scheme: SCHEMES.terracotta, stage: "immersion", parallax: 0.7 },
  { id: "o-i4", type: "clematis", x: 1060, y: 1050, scale: 1.35, rotation: 20, scheme: SCHEMES.teal, stage: "immersion", parallax: 0.7 },
  { id: "o-i5", type: "clematis", x: 64, y: 600, scale: 1.1, rotation: -40, scheme: SCHEMES.sage, stage: "immersion", parallax: 0.5 },
  { id: "o-i6", type: "daisy", x: 1140, y: 620, scale: 1.05, rotation: 36, scheme: SCHEMES.cream, stage: "immersion", parallax: 0.5 },
  { id: "o-i7", type: "blossom", x: 600, y: 84, scale: 1.0, rotation: 0, scheme: SCHEMES.rose, stage: "immersion", parallax: 0.4 },
  { id: "o-i8", type: "rose", x: 600, y: 1130, scale: 1.3, rotation: 8, scheme: SCHEMES.rose, stage: "immersion", parallax: 0.6 },
  { id: "o-i9", type: "blossom", x: 330, y: 330, scale: 0.95, rotation: -14, scheme: SCHEMES.cream, stage: "immersion", parallax: 0.45 },
  { id: "o-i10", type: "daisy", x: 880, y: 360, scale: 0.98, rotation: 28, scheme: SCHEMES.sage, stage: "immersion", parallax: 0.45 },

  // Eternity — the great ornate blooms that blanket the whole viewport.
  { id: "o-e1", type: "peony", x: 150, y: 140, scale: 2.2, rotation: -12, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.9 },
  { id: "o-e2", type: "clematis", x: 430, y: 110, scale: 1.7, rotation: -30, scheme: SCHEMES.teal, stage: "eternity", parallax: 0.8 },
  { id: "o-e3", type: "peony", x: 740, y: 130, scale: 2.4, rotation: 14, scheme: SCHEMES.roseDeep, stage: "eternity", parallax: 0.9 },
  { id: "o-e4", type: "rose", x: 1040, y: 160, scale: 2.0, rotation: 10, scheme: SCHEMES.terracotta, stage: "eternity", parallax: 0.85 },
  { id: "o-e5", type: "rose", x: 90, y: 430, scale: 1.95, rotation: -8, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.9 },
  { id: "o-e6", type: "peony", x: 600, y: 560, scale: 3.0, rotation: 6, scheme: SCHEMES.roseDeep, stage: "eternity", parallax: 1.0 },
  { id: "o-e7", type: "peony", x: 1110, y: 440, scale: 2.1, rotation: 18, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.9 },
  { id: "o-e8", type: "clematis", x: 300, y: 660, scale: 1.7, rotation: -34, scheme: SCHEMES.sage, stage: "eternity", parallax: 0.8 },
  { id: "o-e9", type: "daisy", x: 910, y: 710, scale: 1.8, rotation: 30, scheme: SCHEMES.cream, stage: "eternity", parallax: 0.8 },
  { id: "o-e10", type: "peony", x: 150, y: 930, scale: 2.3, rotation: -10, scheme: SCHEMES.terracotta, stage: "eternity", parallax: 0.95 },
  { id: "o-e11", type: "rose", x: 520, y: 990, scale: 2.2, rotation: 8, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.95 },
  { id: "o-e12", type: "peony", x: 830, y: 1010, scale: 2.5, rotation: 12, scheme: SCHEMES.roseDeep, stage: "eternity", parallax: 1.0 },
  { id: "o-e13", type: "clematis", x: 1090, y: 950, scale: 1.8, rotation: 22, scheme: SCHEMES.teal, stage: "eternity", parallax: 0.9 },
  { id: "o-e14", type: "daisy", x: 390, y: 1130, scale: 1.7, rotation: -18, scheme: SCHEMES.cream, stage: "eternity", parallax: 0.9 },
  { id: "o-e15", type: "rose", x: 690, y: 1160, scale: 2.1, rotation: 6, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.95 },
  { id: "o-e16", type: "peony", x: 1010, y: 1180, scale: 2.2, rotation: -14, scheme: SCHEMES.roseDeep, stage: "eternity", parallax: 1.0 },

  // Eternity fillers — packed between the heroes so no gap remains.
  { id: "o-f1", type: "rose", x: 290, y: 300, scale: 1.5, rotation: 16, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.75 },
  { id: "o-f2", type: "daisy", x: 560, y: 320, scale: 1.3, rotation: -20, scheme: SCHEMES.cream, stage: "eternity", parallax: 0.7 },
  { id: "o-f3", type: "clematis", x: 850, y: 350, scale: 1.4, rotation: 24, scheme: SCHEMES.teal, stage: "eternity", parallax: 0.75 },
  { id: "o-f4", type: "rose", x: 1050, y: 630, scale: 1.6, rotation: -10, scheme: SCHEMES.terracotta, stage: "eternity", parallax: 0.8 },
  { id: "o-f5", type: "daisy", x: 70, y: 760, scale: 1.3, rotation: 30, scheme: SCHEMES.sage, stage: "eternity", parallax: 0.7 },
  { id: "o-f6", type: "blossom", x: 430, y: 470, scale: 1.2, rotation: -8, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.65 },
  { id: "o-f7", type: "clematis", x: 770, y: 520, scale: 1.45, rotation: 18, scheme: SCHEMES.sage, stage: "eternity", parallax: 0.8 },
  { id: "o-f8", type: "rose", x: 980, y: 850, scale: 1.6, rotation: 12, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.85 },
  { id: "o-f9", type: "blossom", x: 260, y: 1040, scale: 1.25, rotation: -16, scheme: SCHEMES.cream, stage: "eternity", parallax: 0.7 },
  { id: "o-f10", type: "peony", x: 650, y: 770, scale: 1.7, rotation: 8, scheme: SCHEMES.roseDeep, stage: "eternity", parallax: 0.85 },
  { id: "o-f11", type: "daisy", x: 430, y: 850, scale: 1.3, rotation: 22, scheme: SCHEMES.cream, stage: "eternity", parallax: 0.7 },
  { id: "o-f12", type: "blossom", x: 900, y: 470, scale: 1.25, rotation: -12, scheme: SCHEMES.rose, stage: "eternity", parallax: 0.7 },

  // Immersion fillers — early density between the edge blooms.
  { id: "o-m1", type: "blossom", x: 260, y: 520, scale: 0.85, rotation: 10, scheme: SCHEMES.cream, stage: "immersion", parallax: 0.4 },
  { id: "o-m2", type: "daisy", x: 760, y: 240, scale: 0.85, rotation: -18, scheme: SCHEMES.sage, stage: "immersion", parallax: 0.4 },
  { id: "o-m3", type: "clematis", x: 480, y: 760, scale: 0.95, rotation: 26, scheme: SCHEMES.teal, stage: "immersion", parallax: 0.45 },
  { id: "o-m4", type: "blossom", x: 960, y: 560, scale: 0.85, rotation: -6, scheme: SCHEMES.rose, stage: "immersion", parallax: 0.4 },
  { id: "o-m5", type: "daisy", x: 220, y: 820, scale: 0.9, rotation: 14, scheme: SCHEMES.cream, stage: "immersion", parallax: 0.45 },
  { id: "o-m6", type: "blossom", x: 680, y: 440, scale: 0.85, rotation: -22, scheme: SCHEMES.rose, stage: "immersion", parallax: 0.4 },
];
