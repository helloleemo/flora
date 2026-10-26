/**
 * ScrollIndicator.tsx
 * ------------------------------------------------------------------
 * The "Scroll to Bloom" cue shown during Stillness. The timeline fades
 * it away once the growth begins.
 */

import { BRAND } from "../config/copy";

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      <span className="scroll-label">{BRAND.scrollHint}</span>
      <span className="scroll-chevron" />
    </div>
  );
}
