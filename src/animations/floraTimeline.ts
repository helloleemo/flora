/**
 * floraTimeline.ts
 * ------------------------------------------------------------------
 * One master GSAP timeline that drives the entire six-stage bloom.
 * It is built paused and scope-selected; FloraExperience attaches it to
 * a single pinned, scrubbed ScrollTrigger so scroll position maps 1:1
 * to timeline progress (forwards AND backwards, with no jumps).
 *
 * Timeline length is normalised to 100 units; every stage is placed at
 * an absolute position derived from SCENES, and labelled for clarity.
 *
 * Techniques, per the spec:
 *   • stems  → stroke-dashoffset path drawing
 *   • leaves/buds/petals → scale + transform-origin opening
 *   • flowers → staggered petal-layer blooming
 *   • depth  → subtle parallax drift on foreground blooms
 */

import { gsap } from "gsap";
import { SCENES } from "../config/sceneConfig";
import type { SceneName } from "../config/sceneConfig";

const TOTAL = 100;

function stageAt(name: SceneName) {
  const s = SCENES.find((sc) => sc.name === name)!;
  return { start: s.start * TOTAL, end: s.end * TOTAL, len: (s.end - s.start) * TOTAL };
}

export interface FloraTimeline {
  timeline: gsap.core.Timeline;
  /** Continuous ambient tweens (not part of the scrubbed timeline). */
  ambient: gsap.core.Tween[];
}

export function buildFloraTimeline(root: HTMLElement, reducedMotion: boolean): FloraTimeline {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  const ambient: gsap.core.Tween[] = [];

  const stillness = stageAt("stillness");
  const awakening = stageAt("awakening");
  const immersion = stageAt("immersion");
  const eternity = stageAt("eternity");

  /* ---- Initial states ------------------------------------------- */
  gsap.set(q(".vine-stem"), { strokeDasharray: 100, strokeDashoffset: 100 });
  gsap.set(q(".vine-leaf"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 100%" });
  gsap.set(q(".vine-bud"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 100%" });
  gsap.set(q(".flower-core"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
  gsap.set(q(".petal-layer"), { scale: 0, transformOrigin: "50% 50%" });
  gsap.set(q(".floating-petal"), { autoAlpha: 0 });
  gsap.set(q(".bloom-wash"), { autoAlpha: 0 });
  gsap.set(q(".poetic-line"), { autoAlpha: 0, y: 24 });
  gsap.set(q(".poetic-finale"), { autoAlpha: 0, y: 24 });
  gsap.set(q(".brand-title"), { autoAlpha: 1, y: 0 });
  gsap.set(q(".scroll-indicator"), { autoAlpha: 1 });

  /* ---- Labels --------------------------------------------------- */
  SCENES.forEach((s) => tl.addLabel(s.name, s.start * TOTAL));

  /* ---- Scene 01 · Stillness ------------------------------------- */
  // A slow, barely-there push-in across the whole journey.
  tl.fromTo(
    q(".portrait-svg"),
    { scale: 1 },
    { scale: 1.06, transformOrigin: "50% 42%", duration: TOTAL },
    0,
  );
  tl.to(q(".brand-title"), { autoAlpha: 0, y: -28, duration: stillness.len * 0.8 }, stillness.len * 0.3);
  tl.to(q(".scroll-indicator"), { autoAlpha: 0, duration: stillness.len * 0.6 }, stillness.len * 0.3);

  /* ---- Scene 02→04 · Branches keep growing from the pupils ------ */
  // Vines are sequenced individually (short/near first, long/far last)
  // across a LONG span so branches visibly multiply outward over time,
  // rather than all appearing at once.
  const vines = Array.from(root.querySelectorAll<SVGGElement>(".eye-bloom .vine"));
  vines.sort(
    (a, b) => parseFloat(a.getAttribute("data-reach") || "0") - parseFloat(b.getAttribute("data-reach") || "0"),
  );
  const vineSpanStart = awakening.start;
  const vineSpanEnd = immersion.start - 2; // keep extending through blooming + overgrowth
  const vineDur = 10;
  vines.forEach((vine, i) => {
    const k = vines.length > 1 ? i / (vines.length - 1) : 0;
    const t0 = vineSpanStart + k * Math.max(vineSpanEnd - vineSpanStart - vineDur, 1);
    const stem = vine.querySelector(".vine-stem");
    const leaves = vine.querySelectorAll(".vine-leaf");
    const bud = vine.querySelector(".vine-bud");
    tl.to(stem, { strokeDashoffset: 0, duration: vineDur * 0.7, ease: "power1.out" }, t0);
    tl.to(leaves, { scale: 1, autoAlpha: 1, duration: vineDur * 0.4, ease: "back.out(1.7)", stagger: vineDur * 0.1 }, t0 + vineDur * 0.4);
    tl.to(bud, { scale: 1, autoAlpha: 1, duration: vineDur * 0.45, ease: "back.out(1.9)" }, t0 + vineDur * 0.6);
  });

  /* ---- Flowers bloom in a continuous, overlapping ramp ---------- */
  // Overlapping windows (no hard steps) + per-flower stagger across the
  // FULL window so density rises smoothly from first bloom to full.
  const bloomStage = (name: SceneName, winStart: number, winEnd: number) => {
    const flowers = Array.from(root.querySelectorAll<SVGGElement>(`.bloom-flower[data-stage="${name}"]`));
    const dur = 9;
    const span = Math.max(winEnd - winStart - dur, 1);
    flowers.forEach((fl, i) => {
      const core = fl.querySelector(".flower-core");
      const layers = fl.querySelectorAll(".petal-layer");
      const offset = winStart + (flowers.length > 1 ? i / (flowers.length - 1) : 0) * span;
      tl.to(core, { scale: 1, autoAlpha: 1, duration: dur, ease: "back.out(1.5)" }, offset);
      tl.to(layers, { scale: 1, duration: dur * 0.9, ease: "back.out(2)", stagger: dur * 0.1 }, offset + dur * 0.1);
      tl.fromTo(core, { rotation: -6 }, { rotation: 0, duration: dur, ease: "power2.out" }, offset);
    });
  };

  bloomStage("blooming", 30, 60);
  bloomStage("overgrowth", 46, 80);
  bloomStage("immersion", 62, 92);
  bloomStage("eternity", 76, 100);

  /* ---- Depth · parallax drift on foreground blooms -------------- */
  Array.from(root.querySelectorAll<SVGGElement>(".bloom-flower[data-parallax]")).forEach((fl) => {
    const p = parseFloat(fl.getAttribute("data-parallax") || "0");
    if (!p) return;
    const core = fl.querySelector(".flower-core");
    tl.to(core, { yPercent: -18 * p, duration: eternity.end - immersion.start, ease: "sine.inOut" }, immersion.start);
  });

  /* ---- Scene 05/06 · Immersion & Eternity atmosphere ------------ */
  // A whisper-light wash only — the frame stays luminous, never dark.
  tl.to(q(".bloom-wash"), { autoAlpha: 0.16, duration: immersion.len + eternity.len }, immersion.start);
  tl.to(
    q(".floating-petal"),
    { autoAlpha: 1, duration: immersion.len * 0.8, stagger: immersion.len * 0.03 },
    immersion.start + immersion.len * 0.2,
  );

  /* ---- Poetic copy cross-fades ---------------------------------- */
  const lines = Array.from(root.querySelectorAll<HTMLElement>(".poetic-line"));
  lines.forEach((el) => {
    const name = el.getAttribute("data-stage") as SceneName;
    const st = stageAt(name);
    const appear = st.start + st.len * 0.12;
    const vanish = st.end - st.len * 0.08;
    tl.to(el, { autoAlpha: 1, y: 0, duration: st.len * 0.3, ease: "power2.out" }, appear);
    if (name !== "immersion") {
      tl.to(el, { autoAlpha: 0, y: -18, duration: st.len * 0.25, ease: "power2.in" }, vanish);
    } else {
      tl.to(el, { autoAlpha: 0, y: -18, duration: st.len * 0.25, ease: "power2.in" }, immersion.end - 1);
    }
  });
  tl.to(q(".poetic-finale"), { autoAlpha: 1, y: 0, duration: eternity.len * 0.5, ease: "power2.out" }, eternity.start + eternity.len * 0.1);

  /* ---- Ambient motion (continuous, reduced-motion aware) -------- */
  if (!reducedMotion) {
    root.querySelectorAll<SVGGElement>(".floating-petal").forEach((el, i) => {
      const drift = parseFloat(el.getAttribute("data-drift") || "20");
      ambient.push(
        gsap.to(el, {
          y: drift,
          x: drift * 0.4,
          rotation: "+=14",
          duration: 5 + (i % 5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        }),
      );
    });
  }

  return { timeline: tl, ambient };
}
