/**
 * copy.ts
 * ------------------------------------------------------------------
 * All poetic copy for the experience, in English (primary headline)
 * and Traditional Chinese (secondary subtitle). Each entry is tied to
 * a narrative stage so PoeticText can reveal it at the right moment.
 */

import type { SceneName } from "./sceneConfig";

export interface PoeticLine {
  stage: SceneName;
  /** Primary English headline. */
  en: string;
  /** Secondary Traditional Chinese subtitle. */
  zh: string;
}

export const BRAND = {
  title: "FLORA",
  subtitle: "The Garden Within",
  scrollHint: "Scroll to Bloom",
  replay: "Bloom again",
} as const;

export const LINES: PoeticLine[] = [
  {
    stage: "stillness",
    en: "There is a garden behind her eyes.",
    zh: "她的眼底，藏著一座無人知曉的花園。",
  },
  {
    stage: "awakening",
    en: "Even silence knows how to bloom.",
    zh: "即使沉默，也懂得如何盛開。",
  },
  {
    stage: "blooming",
    en: "Every petal carries an untold memory.",
    zh: "每一片花瓣，都承載著未曾說出口的記憶。",
  },
  {
    stage: "overgrowth",
    en: "What she could not say, the flowers remembered.",
    zh: "那些她未能說出的話，花朵都替她記得。",
  },
  {
    stage: "immersion",
    en: "And the world surrendered to her bloom.",
    zh: "於是整個世界，都臣服於她的盛放。",
  },
];

/** The closing composition shown in the final scene. */
export const FINALE = {
  title: "FLORA",
  en: "A world in bloom.",
  zh: "讓所有未曾綻放的，終於盛開。",
} as const;
