# FLORA — The Garden Within

An immersive, scroll‑driven botanical art experience. An illustrated red‑haired
woman rests at the centre of the viewport; as you scroll, floral vines grow
**from inside her eyes**, branch outward, and bloom in six narrative stages until
an ornate garden fills the entire screen.

Built with **React + Vite + TypeScript + GSAP (ScrollTrigger) + SVG**.

---

## Run it

```bash
npm install
npm run dev      # start the dev server (prints a local URL)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

Open the printed local URL and scroll slowly. Scroll **down** to advance the
bloom; scroll **up** to reverse it.

---

## How it works

The portrait is embedded as an SVG `<image>` so it shares **one coordinate
space** with every animated overlay. That is what keeps the growth anchored
pixel‑accurately to each pupil under any crop (`preserveAspectRatio="slice"`).

A single master GSAP timeline (`src/animations/floraTimeline.ts`) is attached to
one pinned, scrubbed `ScrollTrigger`, so scroll position maps 1:1 to timeline
progress. The timeline is normalised to 100 units and labelled by stage:

| Stage | Range | What happens |
| --- | --- | --- |
| `stillness` | 0–15% | Portrait + title, no growth yet |
| `awakening` | 15–30% | Vines begin drawing out of both pupils |
| `blooming` | 30–50% | First flowers open across the cheeks |
| `overgrowth` | 50–70% | Growth spreads to temples, hair and jaw |
| `immersion` | 70–90% | Large blooms close in from every edge |
| `eternity` | 90–100% | Ornate garden fills the whole viewport |

Growth techniques follow the spec: stems are **drawn** via
`stroke-dashoffset` (not faded in), leaves/buds/petals scale from their base,
flowers open with staggered petal layers, and foreground blooms drift with
subtle parallax for depth.

---

## Project structure

```
src/
  components/
    FloraExperience.tsx   # orchestration, ScrollTrigger pin, cleanup
    PortraitScene.tsx     # portrait <image> + eye vines + face flowers
    EyeBloom.tsx          # vines drawn from each pupil (Bézier + dash)
    FloralOverlay.tsx     # full-viewport blooms + drifting petals
    BloomFlower.tsx       # parametric, ornate SVG flower library
    PoeticText.tsx        # bilingual editorial copy, cross-faded
    ScrollIndicator.tsx   # "Scroll to Bloom" cue
  animations/
    floraTimeline.ts      # the master GSAP timeline
  config/
    floralAnchors.ts      # pupil anchors (normalised, editable)
    sceneConfig.ts        # palette, pacing, stages, flower placement
    copy.ts               # all EN + Traditional Chinese text
  styles/
    globals.css           # reset + design tokens
    flora.css             # layout, typography, responsive, reduced-motion
  assets/
    portrait.jpeg         # hero artwork (896 × 1200)
```

---

## Editing everything

All artistic parameters live in `src/config/` and are safe to tweak:

- **Eye anchors** — `floralAnchors.ts`. `PUPIL_ANCHORS_NORMALIZED` holds each
  pupil as `{ x, y }` in 0..1 of the source image. Set `DEV_CALIBRATION = true`
  in `sceneConfig.ts` to draw crosshair markers over the pupils while you tune.
- **Flowers** — `sceneConfig.ts`. `FACE_FLOWERS` (in portrait coordinates) and
  `OVERLAY_FLOWERS` (in the 1200×1200 overlay space) are plain arrays of
  `{ type, x, y, scale, rotation, scheme, stage }`. Add, move or resize freely.
- **Vines** — `EyeBloom.tsx` → `LEFT_STEMS` (mirrored for the right eye). Each
  entry is a Bézier branch; all branches fan outward so the two eyes never
  cross in the centre.
- **Palette & pacing** — `sceneConfig.ts` (`PALETTE`, `SCENES`,
  `SCROLL_LENGTH_VH`). Scroll length is set in CSS (`.scroll-wrapper` height).
- **Copy** — `copy.ts` (English headline + Traditional Chinese subtitle).
- **Flower look** — `BloomFlower.tsx` defines the reusable flower types
  (`peony`, `rose`, `clematis`, `daisy`, `blossom`, `bud`) as parametric SVG.

## Replacing the artwork

Drop a new portrait into `src/assets/` and update the import in
`PortraitScene.tsx`, then set its real pixel size in
`floralAnchors.ts` (`PORTRAIT_INTRINSIC`) and re‑measure the two pupil anchors
(enable `DEV_CALIBRATION` to line them up). No other code changes are required —
the flowers are original generated SVG, not baked into the image.

---

## Accessibility

Visitors with `prefers-reduced-motion: reduce` are not pinned or scrubbed;
instead the fully‑bloomed composition and closing text are revealed statically.
