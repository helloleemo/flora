/**
 * PortraitScene.tsx
 * ------------------------------------------------------------------
 * The base visual layer. The portrait is embedded as an SVG <image>
 * so it shares ONE coordinate space with every animated overlay — this
 * is what keeps the eye-anchored growth pixel-accurate under any crop
 * (preserveAspectRatio="xMidYMid slice").
 *
 * Layer order (back → front) follows the spec's SVG architecture:
 *   portrait → eye vines → face flowers → (overlays live above, separately)
 */

import portraitUrl from "../assets/portrait.jpeg";
import {
  PORTRAIT_INTRINSIC,
  PUPIL_ANCHORS,
} from "../config/floralAnchors";
import { DEV_CALIBRATION, FACE_FLOWERS } from "../config/sceneConfig";
import BloomFlower from "./BloomFlower";
import EyeBloom from "./EyeBloom";

export default function PortraitScene() {
  const { width, height } = PORTRAIT_INTRINSIC;

  return (
    <svg
      className="portrait-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustrated red-haired woman surrounded by botanical elements"
    >
      <image href={portraitUrl} x={0} y={0} width={width} height={height} />

      {/* Eye vines — drawn out from each pupil. */}
      <g className="eye-blooms">
        <EyeBloom pupil={PUPIL_ANCHORS.left} side="left" />
        <EyeBloom pupil={PUPIL_ANCHORS.right} side="right" />
      </g>

      {/* Face-level flowers across cheeks, temples, hair. */}
      <g className="face-flowers">
        {FACE_FLOWERS.map((f) => (
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

      {DEV_CALIBRATION && (
        <g className="calibration">
          {Object.values(PUPIL_ANCHORS).map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <circle r={6} fill="none" stroke="#ff2d55" strokeWidth={2} />
              <line x1={-14} y1={0} x2={14} y2={0} stroke="#ff2d55" strokeWidth={1} />
              <line x1={0} y1={-14} x2={0} y2={14} stroke="#ff2d55" strokeWidth={1} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
