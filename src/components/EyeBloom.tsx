/**
 * EyeBloom.tsx
 * ------------------------------------------------------------------
 * Two independent floral growth groups, each anchored precisely to a
 * pupil. Stems are real Bézier curves that are *drawn* on via
 * stroke-dashoffset (not faded in); leaves unfurl and buds swell along
 * them. Leaf/bud placement is computed from the curves themselves so
 * everything stays visually attached to its stem.
 *
 * All animatable parts expose stable classes consumed by floraTimeline:
 *   .vine-stem  — path drawing (pathLength normalised to 100)
 *   .vine-leaf  — scale/unfurl
 *   .vine-bud   — scale/swell
 */

import { PALETTE } from "../config/sceneConfig";

type Pt = [number, number];

interface StemDef {
  c1: Pt;
  c2: Pt;
  p3: Pt;
  /** Parametric positions (0..1) along the curve to place leaves. */
  leaves: number[];
}

/** Cubic Bézier point from the pupil origin (0,0). */
function cubic(c1: Pt, c2: Pt, p3: Pt, t: number): Pt {
  const mt = 1 - t;
  const a = mt * mt * mt; // p0 = (0,0) term vanishes
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  void a;
  return [b * c1[0] + c * c2[0] + d * p3[0], b * c1[1] + c * c2[1] + d * p3[1]];
}

/** Tangent angle (deg) along the curve, for orienting leaves/buds. */
function cubicAngle(c1: Pt, c2: Pt, p3: Pt, t: number): number {
  const mt = 1 - t;
  const dx = 3 * mt * mt * c1[0] + 6 * mt * t * (c2[0] - c1[0]) + 3 * t * t * (p3[0] - c2[0]);
  const dy = 3 * mt * mt * c1[1] + 6 * mt * t * (c2[1] - c1[1]) + 3 * t * t * (p3[1] - c2[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Stem set for the viewer-left eye; mirrored horizontally for the right.
 * Ordered near → far so the timeline draws short branches first and keeps
 * extending longer ones outward. Every branch fans OUTWARD (or straight
 * up / down) — none reach across the centre line, so the two eyes' vines
 * never tangle in the middle of the face.
 */
const LEFT_STEMS: StemDef[] = [
  // Near branches (draw first)
  { c1: [-8, -40], c2: [-16, -72], p3: [-10, -100], leaves: [0.6] },
  { c1: [-34, -8], c2: [-70, -16], p3: [-96, -6], leaves: [0.55] },
  { c1: [-12, 34], c2: [-30, 64], p3: [-22, 104], leaves: [0.55] },
  { c1: [-6, 30], c2: [-16, 60], p3: [-6, 96], leaves: [0.6] },
  // Mid-reach branches
  { c1: [-26, -58], c2: [-70, -92], p3: [-104, -156], leaves: [0.45, 0.8] },
  { c1: [-54, -14], c2: [-116, -26], p3: [-172, -10], leaves: [0.5, 0.85] },
  { c1: [-18, 42], c2: [-50, 92], p3: [-56, 168], leaves: [0.5, 0.82] },
  { c1: [-14, -56], c2: [-40, -104], p3: [-58, -168], leaves: [0.5, 0.85] },
  { c1: [-40, 22], c2: [-96, 52], p3: [-150, 70], leaves: [0.5, 0.82] },
  // Far branches that reach outward beyond the face (draw last)
  { c1: [-30, -80], c2: [-96, -150], p3: [-158, -258], leaves: [0.4, 0.68, 0.9] },
  { c1: [-74, -20], c2: [-158, -34], p3: [-262, -18], leaves: [0.5, 0.78] },
  { c1: [-30, 74], c2: [-80, 162], p3: [-84, 278], leaves: [0.5, 0.8] },
  { c1: [-52, -66], c2: [-132, -128], p3: [-212, -206], leaves: [0.45, 0.78] },
  { c1: [-60, 26], c2: [-150, 64], p3: [-258, 88], leaves: [0.5, 0.82] },
];

function leafPath(len = 20, wid = 9): string {
  return `M 0 0 C ${-wid} ${-len * 0.4}, ${-wid * 0.5} ${-len * 0.95}, 0 ${-len} C ${wid * 0.5} ${-len * 0.95}, ${wid} ${-len * 0.4}, 0 0 Z`;
}

export interface EyeBloomProps {
  pupil: { x: number; y: number };
  side: "left" | "right";
}

export default function EyeBloom({ pupil, side }: EyeBloomProps) {
  const sx = side === "left" ? 1 : -1; // mirror horizontally for right eye
  const leaf = leafPath();

  return (
    <g className="eye-bloom" data-side={side} transform={`translate(${pupil.x} ${pupil.y})`}>
      {LEFT_STEMS.map((stem, i) => {
        const c1: Pt = [stem.c1[0] * sx, stem.c1[1]];
        const c2: Pt = [stem.c2[0] * sx, stem.c2[1]];
        const p3: Pt = [stem.p3[0] * sx, stem.p3[1]];
        const d = `M 0 0 C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p3[0]} ${p3[1]}`;
        const tipAngle = cubicAngle(c1, c2, p3, 1) + 90;
        const reach = Math.round(Math.hypot(p3[0], p3[1]));

        return (
          <g className="vine" data-stem={i} data-reach={reach} key={i}>
            <path
              className="vine-stem"
              d={d}
              pathLength={100}
              fill="none"
              stroke={PALETTE.stem}
              strokeWidth={2.4}
              strokeLinecap="round"
            />

            {stem.leaves.map((t, li) => {
              const [lx, ly] = cubic(c1, c2, p3, t);
              const angle = cubicAngle(c1, c2, p3, t) + 90;
              const flip = li % 2 === 0 ? 1 : -1;
              return (
                // Wrapper carries placement; GSAP scales the identity-transform path.
                <g key={li} transform={`translate(${lx} ${ly}) rotate(${angle + flip * 36}) scale(${flip}, 1)`}>
                  <path
                    className="vine-leaf"
                    d={leaf}
                    fill={li % 2 === 0 ? PALETTE.sageDeep : PALETTE.sageLight}
                  />
                </g>
              );
            })}

            {/* Swelling bud at the growing tip. */}
            <g transform={`translate(${p3[0]} ${p3[1]}) rotate(${tipAngle})`}>
              <g className="vine-bud">
                <path d={`M 0 8 L -5 16 M 0 8 L 5 16`} stroke={PALETTE.stem} strokeWidth={1.6} strokeLinecap="round" />
                <path
                  d={`M 0 6 C -9 -2, -8 -20, 0 -26 C 8 -20, 9 -2, 0 6 Z`}
                  fill={PALETTE.dustyRose}
                  stroke={PALETTE.stem}
                  strokeWidth={0.6}
                  strokeOpacity={0.4}
                />
                <path d={`M 0 6 C -5 0, -4 -12, 0 -16 C 4 -12, 5 0, 0 6 Z`} fill={PALETTE.roseLight} />
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}
