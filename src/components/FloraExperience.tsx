/**
 * FloraExperience.tsx
 * ------------------------------------------------------------------
 * Orchestrates the whole experience: lays out the pinned stage, wires
 * the master timeline to a single scrubbed ScrollTrigger, honours
 * prefers-reduced-motion, and cleans everything up on unmount via
 * gsap.context().
 */

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildFloraTimeline } from "../animations/floraTimeline";
import FloralOverlay from "./FloralOverlay";
import PoeticText from "./PoeticText";
import PortraitScene from "./PortraitScene";
import ScrollIndicator from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function FloraExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!root || !wrapper || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const { timeline } = buildFloraTimeline(root, reduced);

      if (reduced) {
        // Reveal the fully-bloomed composition statically, no pin/scroll.
        timeline.progress(1);
        wrapper.style.height = "100vh";
        return;
      }

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: true,
        scrub: 1,
        animation: timeline,
        invalidateOnRefresh: true,
      });
    }, rootRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div className="flora-root" ref={rootRef}>
      <a
        className="github-link"
        href="https://github.com/helloleemo/flora"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View this project on GitHub"
      >
        <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="stage" ref={stageRef}>
          <PortraitScene />
          <div className="bloom-wash" aria-hidden="true" />
          <FloralOverlay />
          <PoeticText onReplay={handleReplay} />
          <ScrollIndicator />
        </div>
      </div>
    </div>
  );
}
