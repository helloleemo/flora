/**
 * floralAnchors.ts
 * ------------------------------------------------------------------
 * Eye-anchoring and image-alignment configuration.
 *
 * The portrait is rendered inside an SVG whose `viewBox` matches the
 * source image's intrinsic pixel size. Because the portrait <image>
 * and every animated floral group live in that SAME coordinate space,
 * anchors defined here stay pixel-accurate regardless of how the SVG
 * is scaled or cropped to the viewport (preserveAspectRatio="slice").
 *
 * Pupil positions are stored as NORMALIZED coordinates (0..1) so they
 * survive any future change to the source image resolution. Adjust
 * these values if you swap the portrait. During development the
 * calibration overlay (see sceneConfig.DEV_CALIBRATION) draws markers
 * at these anchors so you can fine-tune them visually.
 */

export interface NormalizedPoint {
  /** 0 = left edge, 1 = right edge of the source image. */
  x: number;
  /** 0 = top edge, 1 = bottom edge of the source image. */
  y: number;
}

/** Intrinsic pixel dimensions of src/assets/portrait.jpeg (896 x 1200). */
export const PORTRAIT_INTRINSIC = {
  width: 896,
  height: 1200,
} as const;

/**
 * Normalized pupil anchors, measured against the source artwork.
 * `left` / `right` are from the VIEWER's perspective.
 */
export const PUPIL_ANCHORS_NORMALIZED: Record<"left" | "right", NormalizedPoint> = {
  left: { x: 0.363, y: 0.404 },
  right: { x: 0.552, y: 0.392 },
};

/** Convert a normalized point into SVG/user units within the portrait viewBox. */
export function toViewBox(point: NormalizedPoint): { x: number; y: number } {
  return {
    x: point.x * PORTRAIT_INTRINSIC.width,
    y: point.y * PORTRAIT_INTRINSIC.height,
  };
}

/** Pupil anchors already converted to portrait viewBox units. */
export const PUPIL_ANCHORS = {
  left: toViewBox(PUPIL_ANCHORS_NORMALIZED.left),
  right: toViewBox(PUPIL_ANCHORS_NORMALIZED.right),
} as const;
