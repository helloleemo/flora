# FLORA — The Garden Within
## Interactive Website: Creative Direction & Technical Specification

### 1. Project Objective

Create a fully functional, immersive, scroll-driven artistic website called **FLORA — The Garden Within**.

The project is inspired by Pre-Raphaelite paintings, botanical surrealism, and poetic visual storytelling.

The website features an illustrated red-haired woman surrounded by botanical elements. As the visitor scrolls down, flowers must visibly grow from within her eyes, gradually spreading outward until they cover her face and eventually fill the entire viewport.

**The interaction must communicate organic floral growth, not simply image zooming, fading, or decorative transitions.**

The final result should feel like a sophisticated digital art installation, not a conventional corporate landing page.

### 2. Source Artwork

Use the provided portrait image as the primary visual reference and hero artwork.

Important characteristics:

- Red-haired woman facing the viewer.
- Muted sage-green botanical background.
- Delicate flowers already surrounding the eyes.
- Elegant, melancholic female expression.
- Soft, low-saturation vector illustration aesthetic.
- Intricate botanical decorations and flowing organic curves.

Requirements:

- Preserve the original artwork's visual identity.
- Avoid redesigning the woman's face.
- Retain the existing color relationships.
- Use the image as a static background or base visual layer.
- Create independent animated botanical elements over it.

Because the original artwork is a flattened raster image, its existing flowers cannot be animated individually without asset separation or reconstruction.

Do not claim the original image has editable SVG layers.

### 3. Technical Stack

Use:

- React
- Vite
- TypeScript
- GSAP
- GSAP ScrollTrigger
- SVG
- CSS Modules or organized CSS
- Native CSS for responsive layouts

Do not introduce unnecessary UI frameworks.

Animation should be primarily driven by GSAP and SVG rather than heavy animation libraries.

Use a deterministic, scroll-synchronized animation timeline.

### 4. Visual Design System

**Art direction**

- Pre-Raphaelite romanticism
- Botanical surrealism
- Elegant editorial design
- Dreamlike, poetic, feminine
- Ornate but restrained
- Muted and sophisticated
- Emotional and melancholic

**Color palette**

- Antique Ivory: #E9E5DC
- Muted Sage: #A6BBAE
- Dusty Rose: #C29A9F
- Terracotta: #B7795F
- Deep Teal: #345963

Use subtle gradients only where they improve visual depth.

Avoid neon colors, strong saturation, glossy 3D effects, cartoon aesthetics, or heavy artificial shadows.

**Typography**

Use elegant serif typography for primary English copy.

Suggested fonts:
- Cormorant Garamond
- EB Garamond

Use Noto Serif TC for Traditional Chinese.

Typography should feature:
- Large expressive headings
- Generous whitespace
- Refined line spacing
- Gentle fade transitions
- Minimal interface elements

### 5. User Experience

Build a single-page immersive experience.

On desktop, prioritize a full-viewport artistic composition.

The main floral transformation takes place within a pinned scroll section.

The visitor controls the growth animation through scrolling.

Scrolling downward advances the animation.

Scrolling upward reverses the animation naturally.

Do not use a fixed-duration autoplay animation for the main transformation.

Suggested scroll length: approximately 600vh, adjustable according to pacing.

### 6. Animation Storyboard

#### Scene 01 — Stillness (0–15%)

Initial appearance.

- Display the original portrait.
- Center the woman in the viewport.
- Preserve the original image aspect ratio.
- Show the title "FLORA".
- Introduce very subtle movement in optional foreground leaves.
- Add a small "Scroll to Bloom" indicator.
- Avoid noticeable floral growth yet.

Copy:
"There is a garden behind her eyes."

Chinese:
"她的眼底，藏著一座無人知曉的花園。"

#### Scene 02 — Awakening (15–30%)

The flowers begin growing from the eyes.

Critical implementation:

- Identify the approximate positions of both pupils on the image.
- Create two independent SVG floral growth groups.
- Anchor each group to its corresponding pupil.
- New stems must originate precisely from the pupil positions.
- Stems extend along graceful Bézier curves.
- Small leaves unfold progressively.
- Flower buds appear at the end of growing stems.

Animation techniques:

- SVG path drawing using stroke-dasharray and stroke-dashoffset.
- GSAP scaling for small buds.
- Transform-origin adjustments.
- Subtle rotations for vines and leaves.

Copy:
"Even silence knows how to bloom."

Chinese:
"即使沉默，也懂得如何盛開。"

#### Scene 03 — Blooming (30–50%)

The first flowers open.

- Flower petals expand gradually.
- Introduce peonies, garden roses, dahlias, and clematis.
- Use independently animated petal groups.
- Vines extend over the woman's cheeks and toward her hair.
- Flowers should appear to emerge organically from the stems.
- Maintain a graceful asymmetrical composition.

Animation techniques:

- GSAP scale and rotation.
- SVG path animation.
- Opacity transitions for petal layers.
- Staggered blooming sequences.

Copy:
"Every petal carries an untold memory."

Chinese:
"每一片花瓣，都承載著未曾說出口的記憶。"

#### Scene 04 — Overgrowth (50–70%)

Floral expansion accelerates visually while maintaining smooth movement.

- Additional flowers bloom in clusters.
- Stems extend beyond the face.
- Flowers grow toward all four edges.
- Botanical elements gradually obscure portions of the portrait.
- Introduce layered depth using foreground and background botanical groups.
- Apply gentle parallax to selected flowers.

Important:
All flowers should appear to belong to the same botanical ecosystem.

Avoid random particle-like flower placement.

Copy:
"What she could not say, the flowers remembered."

Chinese:
"那些她未能說出的話，花朵都替她記得。"

#### Scene 05 — Immersion (70–90%)

The scene transforms into a floral environment.

- Flowers progressively cover the woman's face.
- Larger foreground blooms extend beyond the viewport boundaries.
- Dense botanical clusters fill the negative space.
- Keep sufficient visual variation in flower size.
- Achieve near-complete visual coverage of the entire screen.
- Hide or mask the original portrait only as necessary.
- Add subtle floating petals.

The transition should feel like entering a living garden.

Copy:
"And the world surrendered to her bloom."

Chinese:
"於是整個世界，都臣服於她的盛放。"

#### Scene 06 — Eternity (90–100%)

Final floral composition.

- Flowers completely dominate the visual environment.
- Introduce subtle ambient motion.
- Keep the final frame richly composed and beautiful.
- Allow the final message to appear above the botanical background.
- Provide an optional replay control.

Final text:

"FLORA"

"A world in bloom."

Chinese:
"讓所有未曾綻放的，終於盛開。"

### 7. SVG Layer Architecture

Structure the artwork into independent visual layers.

Recommended hierarchy:

1. Background color and environmental artwork
2. Original portrait image
3. Left-eye vine group
4. Right-eye vine group
5. Small leaves
6. Flower buds
7. Opening flowers
8. Midground floral clusters
9. Large foreground flowers
10. Floating petals
11. Typography and interface elements

Use SVG groups where appropriate.

Each layer must have independent animation controls.

Avoid flattening new decorative elements into one uneditable bitmap.

Design the SVG flowers in a style that closely resembles the source artwork: muted botanical vector illustration with smooth shapes and intricate curved forms.

Use a small reusable set of original flower components with variations in scale, orientation, color, and petal arrangement. Do not use emoji, generic Unicode flowers, or unrelated stock illustrations.

### 8. Eye Anchoring and Image Alignment

This is one of the most important implementation requirements.

The flowers must visibly emerge FROM INSIDE the woman's eyes.

Do not place random blossoms beside or on top of the eyes without a clear growth origin.

Implementation guidance:

- Use a normalized coordinate system.
- Define pupil coordinates relative to the source image.
- Ensure these positions stay accurate when the artwork is resized or cropped.
- Account for object-fit: contain or cover.
- Use a shared container or coordinate space for the portrait and its animated overlays.
- Keep eye anchors editable in a dedicated configuration file.

If the pupil coordinates are uncertain, expose simple calibration controls for development.

### 9. GSAP ScrollTrigger Requirements

Create one master GSAP timeline controlling the entire bloom sequence.

Requirements:

- Use ScrollTrigger with scrub enabled.
- Pin the central scene.
- Divide the timeline into named stages.
- Use labels for all major animation moments.
- Support reverse scrolling.
- Avoid animation jumps.
- Recalculate positions on viewport resize.
- Clean up animations when React components unmount.
- Use gsap.context() where appropriate.

Suggested structure:

- `stillness`
- `awakening`
- `blooming`
- `overgrowth`
- `immersion`
- `eternity`

Use transforms and opacity for performance where possible.

For SVG stem growth, use path drawing rather than simply fading in complete stems.

### 10. Copywriting and Text Placement

Create a dedicated content configuration file containing all English and Traditional Chinese text.

The English text should be the primary artistic headline.

Chinese should appear as a smaller secondary subtitle.

Use a restrained editorial layout.

Avoid placing text directly over important facial details during early stages.

Ensure text remains readable as flowers increase in density.

Use subtle opacity, position, and scale transitions.

Do not create conventional marketing sections, service cards, pricing sections, or testimonials.

The experience is a visual poem, not a sales website.

### 11. Responsive Behavior

Desktop:

- Full-screen portrait composition.
- Pinned scroll animation.
- Floral elements can extend outside the illustration.
- Text is positioned in available negative space.

Mobile:

- Preserve eye alignment and the portrait's focal point.
- Recompose text if necessary.
- Scale SVG flowers relative to viewport size.
- Adjust the scroll length.
- Limit the number of simultaneously animated elements.
- Maintain smooth interaction.

Respect `prefers-reduced-motion`.

For reduced-motion users, provide a static or simplified sequence that still reveals the artwork and text without prolonged animated growth.

### 12. Asset and Quality Constraints

Do not assume the original artwork is an editable vector.

Do not fabricate an asset extraction process.

When precise layer extraction is unavailable:

- Keep the original artwork as the background.
- Create matching SVG floral assets separately.
- Provide editable flower components.
- Make all generated overlays easy to replace later.

Because the original portrait already contains floral elements around the eyes, visually integrate newly animated stems with the existing decoration so the transition feels intentional.

Avoid visible mismatches between new SVG flowers and original artwork.

If important assets are missing, create a functional placeholder implementation and clearly identify what needs replacement.

### 13. Expected Project Structure

Create the following structure:

src/
- components/
  - FloraExperience.tsx
  - PortraitScene.tsx
  - EyeBloom.tsx
  - FloralOverlay.tsx
  - BloomFlower.tsx
  - PoeticText.tsx
  - ScrollIndicator.tsx
- animations/
  - floraTimeline.ts
- config/
  - sceneConfig.ts
  - floralAnchors.ts
  - copy.ts
- styles/
  - globals.css
  - flora.css
- assets/
  - portrait.jpg
  - flowers/
- App.tsx
- main.tsx

Also include:
- package.json
- README.md

### 14. Implementation Priorities

Follow this order:

**Priority 1 — Functional core**
- Display the source illustration correctly.
- Align the SVG overlay precisely with the portrait.
- Implement scroll pinning and scrubbing.
- Animate stems growing from both pupils.

**Priority 2 — Floral transformation**
- Add layered flower opening effects.
- Expand botanical elements across the portrait.
- Create the final full-screen floral composition.

**Priority 3 — Artistic polish**
- Add poetic typography.
- Improve transitions.
- Add ambient motion.
- Optimize responsiveness.
- Improve visual density and coherence.

Do not spend time on decorative UI before the main floral growth interaction works.

### 15. Acceptance Criteria

The implementation is complete when:

- The page loads and runs locally without errors.
- The supplied portrait appears correctly.
- Flowers visibly begin growing from both eyes.
- Growth is controlled by scrolling, not only by time.
- Scrolling backward reverses the progression.
- Flowers bloom in distinguishable stages.
- The final scene fills the viewport with botanical elements.
- All six narrative scenes are represented.
- English and Traditional Chinese poetic copy appears at the correct stages.
- The design preserves the original artwork's muted color palette.
- The desktop layout is polished.
- The mobile layout remains usable.
- Reduced-motion preferences are handled.
- All core animation parameters and text are editable.
- The README clearly describes how to run the project and replace assets.

### 16. Instructions to the Coding Agent

First inspect the existing project structure and identify the source image.

If there is already a React/Vite project, integrate the implementation into it instead of creating a duplicate project.

Then:

1. Create the architecture.
2. Build the pinned portrait scene.
3. Establish accurate pupil anchors.
4. Implement SVG vine growth.
5. Implement flower blooming.
6. Implement progressive floral coverage.
7. Add poetic text.
8. Implement responsive behavior.
9. Run the project and resolve build errors.
10. Review the result against the acceptance criteria.

Do not stop after generating a design proposal.

Write the actual implementation files.

Do not represent placeholder animation as a finished floral-growth experience.

The desired result is an immersive, romantic, scroll-driven botanical transformation that begins inside a woman's eyes and ends with an entire world in bloom.