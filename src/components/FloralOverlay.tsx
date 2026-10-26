/**
 * FloralOverlay.tsx
 * ------------------------------------------------------------------
 * The full-viewport botanical layer that fills negative space and the
 * screen edges during Immersion and Eternity. It lives in its own
 * square, cover-fitted coordinate space so large blooms keep their
 * aspect ratio and reach every corner on any screen.
 *
 * Also hosts the drifting petals for ambient motion.
 */

import { OVERLAY_FLOWERS, PALETTE } from "../config/sceneConfig";
import BloomFlower from "./BloomFlower";

const OVERLAY_VIEW = 1200;

/* Deterministic floating petals (no RNG → reproducible composition). */
const PETALS = Array.from({ length: 18 }).map((_, i) => {
  const gx = (i * 137.5) % OVERLAY_VIEW;
  const gy = (i * 211.3) % OVERLAY_VIEW;
  const tone = [PALETTE.dustyRose, PALETTE.roseLight, PALETTE.cream, PALETTE.sageLight][i % 4];
  return {
    id: `petal-${i}`,
    x: gx,
    y: gy,
    r: 60 + ((i * 29) % 90),
    scale: 0.5 + ((i * 7) % 10) / 14,
    tone,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 8),
  };
});

const PETAL_D = "M 0 0 C -7 -9, -6 -22, 0 -28 C 6 -22, 7 -9, 0 0 Z";

export default function FloralOverlay() {
  return (
    <svg
      className="floral-overlay"
      viewBox={`0 0 ${OVERLAY_VIEW} ${OVERLAY_VIEW}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Drifting petals sit behind the big blooms. */}
      <g className="floating-petals">
        {PETALS.map((p) => (
          // Wrapper carries placement; GSAP animates the identity-transform inner group.
          <g key={p.id} transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.scale})`}>
            <g className="floating-petal" data-drift={p.drift}>
              <path d={PETAL_D} fill={p.tone} opacity={0.75} />
            </g>
          </g>
        ))}
      </g>

      <g className="overlay-flowers">
        {OVERLAY_FLOWERS.map((f) => (
          <g
            key={f.id}
            className="bloom-flower"
            data-stage={f.stage}
            data-parallax={f.parallax ?? 0}
            transform={`translate(${f.x} ${f.y}) rotate(${f.rotation}) scale(${f.scale})`}
          >
            <BloomFlower type={f.type} scheme={f.scheme} />
          </g>
        ))}
      </g>
    </svg>
  );
}
