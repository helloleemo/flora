/**
 * BloomFlower.tsx
 * ------------------------------------------------------------------
 * A small, reusable set of ORIGINAL vector flowers drawn to match the
 * muted botanical style of the source artwork. Every flower is built
 * from parametric petal layers so a handful of components yield rich
 * variation in scale, orientation, colour and petal arrangement.
 *
 * Structure (important for the animation layer):
 *   <g.bloom-flower>            ← positioned/rotated/scaled by caller
 *     <g.flower-core>           ← timeline scales this 0 → 1 (opening)
 *       <g.petal-layer> …petals ← timeline staggers layers outward
 *       <g.flower-centre>
 *
 * No emoji, Unicode glyphs or stock art — pure generated SVG.
 */

import { useId } from "react";
import { PALETTE } from "../config/sceneConfig";
import type { FlowerScheme, FlowerType, PaletteKey } from "../config/sceneConfig";

interface LayerSpec {
  count: number;
  len: number;
  wid: number;
  base: number;
  /** Rotational offset so inner layers sit between outer petals. */
  rot?: number;
  pointed?: boolean;
}

interface TypeSpec {
  layers: LayerSpec[];
  centre: number;
  stamen?: boolean;
  /** Ring of sage back-leaves (calyx) behind the petals. */
  backLeaves?: number;
  /** Faint vein down each petal for extra detail. */
  veins?: boolean;
}

const TYPES: Record<FlowerType, TypeSpec> = {
  peony: {
    layers: [
      { count: 12, len: 42, wid: 16, base: 13 },
      { count: 10, len: 33, wid: 16, base: 10, rot: 16 },
      { count: 8, len: 25, wid: 14, base: 7, rot: 30 },
      { count: 6, len: 17, wid: 12, base: 4, rot: 48 },
    ],
    centre: 8,
    stamen: true,
    backLeaves: 8,
    veins: true,
  },
  rose: {
    layers: [
      { count: 8, len: 35, wid: 20, base: 11 },
      { count: 6, len: 27, wid: 18, base: 8, rot: 24 },
      { count: 5, len: 19, wid: 15, base: 5, rot: 42 },
      { count: 4, len: 12, wid: 12, base: 2, rot: 60 },
    ],
    centre: 5,
    backLeaves: 7,
    veins: true,
  },
  clematis: {
    layers: [
      { count: 8, len: 50, wid: 14, base: 7, pointed: true },
      { count: 8, len: 30, wid: 9, base: 4, rot: 22, pointed: true },
    ],
    centre: 9,
    stamen: true,
    backLeaves: 8,
    veins: true,
  },
  daisy: {
    layers: [
      { count: 16, len: 40, wid: 7, base: 11, pointed: true },
      { count: 16, len: 31, wid: 6, base: 9, rot: 11, pointed: true },
    ],
    centre: 13,
    stamen: true,
    backLeaves: 6,
  },
  blossom: {
    layers: [
      { count: 5, len: 32, wid: 21, base: 9 },
      { count: 5, len: 21, wid: 16, base: 5, rot: 36 },
    ],
    centre: 7,
    stamen: true,
    veins: true,
  },
  bud: {
    layers: [
      { count: 3, len: 28, wid: 15, base: 2 },
      { count: 2, len: 19, wid: 11, base: 1, rot: 40 },
    ],
    centre: 0,
    backLeaves: 4,
  },
};

/** Build a single petal path pointing up from (0, -base). */
function petalPath(len: number, wid: number, base: number, pointed: boolean): string {
  const tip = base + len;
  if (pointed) {
    return `M 0 ${-base} C ${-wid} ${-(base + len * 0.4)}, ${-wid * 0.5} ${-(base + len * 0.9)}, 0 ${-tip} C ${wid * 0.5} ${-(base + len * 0.9)}, ${wid} ${-(base + len * 0.4)}, 0 ${-base} Z`;
  }
  // Rounded petal with a soft notch at the tip for a fuller, ornate look.
  return `M 0 ${-base} C ${-wid} ${-(base + len * 0.3)}, ${-wid * 0.85} ${-(base + len * 0.82)}, ${-wid * 0.28} ${-(tip - 2)} C ${-wid * 0.12} ${-tip}, ${wid * 0.12} ${-tip}, ${wid * 0.28} ${-(tip - 2)} C ${wid * 0.85} ${-(base + len * 0.82)}, ${wid} ${-(base + len * 0.3)}, 0 ${-base} Z`;
}

function leafPath(len: number, wid: number): string {
  return `M 0 0 C ${-wid} ${-len * 0.4}, ${-wid * 0.5} ${-len * 0.95}, 0 ${-len} C ${wid * 0.5} ${-len * 0.95}, ${wid} ${-len * 0.4}, 0 0 Z`;
}

function layerColor(scheme: FlowerScheme, index: number, total: number): PaletteKey {
  if (total === 1) return scheme.petal;
  if (index >= total - 1) return scheme.petalInner;
  return index === 0 ? scheme.petal : scheme.petalInner;
}

export interface BloomFlowerProps {
  type: FlowerType;
  scheme: FlowerScheme;
}

/** Renders a flower centred at (0,0) at its natural radius (~55 units). */
export default function BloomFlower({ type, scheme }: BloomFlowerProps) {
  const spec = TYPES[type];
  const gid = useId().replace(/:/g, "");
  const gradId = `grad-${gid}`;
  const outer = spec.layers[0].base + spec.layers[0].len;
  const backLen = outer * 1.2;

  return (
    <g className="flower-core">
      <defs>
        {/* Radial depth: luminous centre fading to the petal tone at the edge. */}
        <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={outer * 1.08}>
          <stop offset="0%" stopColor={PALETTE[scheme.petalInner]} />
          <stop offset="55%" stopColor={PALETTE[scheme.petal]} />
          <stop offset="100%" stopColor={PALETTE[scheme.petal]} stopOpacity={0.92} />
        </radialGradient>
      </defs>

      {/* Back-leaves / calyx for depth behind the petals. */}
      {!!spec.backLeaves && (
        <g className="petal-layer">
          {Array.from({ length: spec.backLeaves }).map((_, i) => {
            const angle = (360 / spec.backLeaves!) * i + 18;
            return (
              <path
                key={i}
                d={leafPath(backLen, outer * 0.26)}
                fill={i % 2 === 0 ? PALETTE.sageDeep : PALETTE.stem}
                opacity={0.7}
                transform={`rotate(${angle})`}
              />
            );
          })}
        </g>
      )}

      {spec.layers.map((layer, li) => {
        const d = petalPath(layer.len, layer.wid, layer.base, !!layer.pointed);
        const useGradient = li === 0;
        const fill = useGradient ? `url(#${gradId})` : PALETTE[layerColor(scheme, li, spec.layers.length)];
        const tip = layer.base + layer.len;
        return (
          <g className="petal-layer" key={li}>
            {Array.from({ length: layer.count }).map((_, pi) => {
              const angle = (360 / layer.count) * pi + (layer.rot ?? 0);
              return (
                <g className="petal" key={pi} transform={`rotate(${angle})`}>
                  <path
                    d={d}
                    fill={fill}
                    stroke={PALETTE.stem}
                    strokeWidth={0.6}
                    strokeOpacity={0.3}
                  />
                  {spec.veins && (
                    <path
                      d={`M 0 ${-layer.base} Q ${layer.wid * 0.12} ${-(layer.base + layer.len * 0.5)}, 0 ${-(tip - 3)}`}
                      fill="none"
                      stroke={PALETTE[scheme.center]}
                      strokeWidth={0.7}
                      strokeOpacity={0.22}
                    />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      {spec.centre > 0 && (
        <g className="flower-centre">
          <circle r={spec.centre} fill={PALETTE[scheme.center]} />
          <circle r={spec.centre * 0.62} fill={PALETTE[scheme.center]} opacity={0.5} />
          {spec.stamen &&
            Array.from({ length: 10 }).map((_, i) => {
              const a = (Math.PI / 5) * i;
              const rr = spec.centre * 0.78;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * rr}
                  cy={Math.sin(a) * rr}
                  r={spec.centre * 0.15}
                  fill={PALETTE.cream}
                  opacity={0.85}
                />
              );
            })}
        </g>
      )}
    </g>
  );
}
