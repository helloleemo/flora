/**
 * PoeticText.tsx
 * ------------------------------------------------------------------
 * Editorial typography layer. The brand title, each stage's poetic
 * couplet (English headline + Traditional Chinese subtitle) and the
 * finale are all present in the DOM; floraTimeline cross-fades them in
 * and out at the right scroll positions.
 */

import { BRAND, FINALE, LINES } from "../config/copy";

interface PoeticTextProps {
  onReplay: () => void;
}

export default function PoeticText({ onReplay }: PoeticTextProps) {
  return (
    <div className="poetic-layer" aria-live="polite">
      {/* Opening brand mark (Scene 01). */}
      <header className="brand-title" data-stage="stillness">
        <h1 className="brand-name">{BRAND.title}</h1>
        <p className="brand-sub">{BRAND.subtitle}</p>
      </header>

      {/* Per-stage couplets. */}
      {LINES.map((line) => (
        <figure className="poetic-line" data-stage={line.stage} key={line.stage}>
          <blockquote className="line-en">{line.en}</blockquote>
          <figcaption className="line-zh">{line.zh}</figcaption>
        </figure>
      ))}

      {/* Closing composition (Scene 06). */}
      <div className="poetic-finale" data-stage="eternity">
        <h2 className="finale-title">{FINALE.title}</h2>
        <p className="finale-en">{FINALE.en}</p>
        <p className="finale-zh">{FINALE.zh}</p>
        <button type="button" className="replay-button" onClick={onReplay}>
          {BRAND.replay}
        </button>
      </div>
    </div>
  );
}
