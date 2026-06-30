import { ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "motion/react";

// ─────────────────────────────────────────────────────────────────
// ScrollWords — body copy reveals word-by-word tied to scroll
// ─────────────────────────────────────────────────────────────────

function ScrollWord({
  word,
  start,
  end,
  progress,
  isHot,
}: {
  word: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  isHot: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const color = useTransform(
    progress,
    [start, end],
    ["#2f4a2f", isHot ? "#00FF66" : "#9bb09b"]
  );
  const y = useTransform(progress, [start, end], [6, 0]);
  return (
    <motion.span
      style={{ opacity, color, y }}
      className="inline-block mr-[0.28em]"
    >
      {word}
    </motion.span>
  );
}

export function ScrollWords({
  text,
  className = "",
  highlight = [],
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={`relative ${className}`}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.5 / words.length);
        return (
          <ScrollWord
            key={i}
            word={w}
            start={start}
            end={end}
            progress={scrollYProgress}
            isHot={highlight.includes(w.replace(/[.,]$/, ""))}
          />
        );
      })}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────
// ScrollCounter — number ticks up as element scrolls into view
// ─────────────────────────────────────────────────────────────────

export function ScrollCounter({
  to,
  pad = 0,
  suffix = "",
  className = "",
}: {
  to: number;
  pad?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });
  const value = useTransform(scrollYProgress, [0, 1], [0, to]);
  const smooth = useSpring(value, { stiffness: 80, damping: 22 });
  const [display, setDisplay] = useState(pad ? "".padStart(pad, "0") : "0");

  useMotionValueEvent(smooth, "change", (v) => {
    const n = Math.round(v);
    setDisplay(pad ? String(n).padStart(pad, "0") : String(n));
  });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {display}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// ParallaxLayer — wrap content; scrolls slower/faster than viewport
// ─────────────────────────────────────────────────────────────────

export function ParallaxLayer({
  speed = 0.5,
  children,
  className = "",
}: {
  speed?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);
  return (
    <motion.div ref={ref} style={{ y, position: "relative" }} className={className}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ScrollCode — source code types in line-by-line synced to scroll
// ─────────────────────────────────────────────────────────────────

export function ScrollCode({
  code,
  progress,
}: {
  code: string;
  progress: MotionValue<number>;
}) {
  const lines = code.split("\n");
  const [visible, setVisible] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const total = lines.join("").length;
    const revealedChars = Math.floor(Math.max(0, Math.min(1, v)) * total);
    let acc = 0;
    let n = 0;
    for (let i = 0; i < lines.length; i++) {
      acc += lines[i].length;
      if (acc <= revealedChars) n = i + 1;
      else break;
    }
    setVisible(n);
  });

  return (
    <pre className="font-mono text-[11.5px] leading-[1.7] text-[#9bb09b]">
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            opacity: i < visible ? 1 : 0.15,
            color: i < visible ? "#9bb09b" : "#1a2a1a",
            transition: "opacity 0.2s, color 0.2s",
          }}
        >
          <span className="text-[#224422] mr-3 select-none">
            {String(i + 1).padStart(2, "0")}
          </span>
          {line || " "}
        </div>
      ))}
    </pre>
  );
}

// ─────────────────────────────────────────────────────────────────
// StickyChapter — chapter heading sticks then is shoved by the next
// ─────────────────────────────────────────────────────────────────

export function StickyChapter({
  num,
  title,
  caption,
}: {
  num: string;
  title: string;
  caption: string;
}) {
  return (
    <div className="sticky top-0 z-10 bg-black/85 backdrop-blur-md border-y border-[#1a2a1a]">
      <div className="max-w-[1280px] mx-auto px-16 py-5 flex items-baseline gap-6">
        <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#00FF66]">
          chapter / {num}
        </span>
        <span className="font-[Inter] text-[20px] font-medium tracking-tight text-white">
          {title}
        </span>
        <span className="font-mono text-[11px] text-[#4A4D53] ml-auto">{caption}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HorizontalProjects — pinned section, vertical scroll → horizontal pan
// each slide reveals code progressively as it crosses center
// ─────────────────────────────────────────────────────────────────

type HProject = {
  id: string;
  name: string;
  role: string;
  stack: string;
  blurb: string;
  snippet: string;
  sample: string[];
};

function HSlide({
  p,
  index,
  total,
  progress,
}: {
  p: HProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // each slide gets a window of overall progress
  const span = 1 / total;
  const start = index * span;
  const end = start + span;
  const localProgress = useTransform(progress, [start, end], [0, 1]);
  return (
    <div className="shrink-0 w-screen h-full px-16 flex items-center">
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-12 gap-10">
        <div className="col-span-5 space-y-6">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#4A4D53]">
            slide {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00FF66]">
            {p.role}
          </div>
          <h3 className="font-[Inter] text-[44px] font-semibold tracking-tight text-white leading-[1.05]">
            {p.name}
          </h3>
          <p className="font-mono text-[13px] leading-[1.9] text-[#9bb09b] max-w-[420px]">
            {p.blurb}
          </p>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#4A4D53]">
            stack :: <span className="text-[#00FF66]">{p.stack}</span>
          </div>
        </div>

        <div className="col-span-7 space-y-3">
          <div className="rounded-lg border border-[#1a2a1a] bg-[#06080a] p-6 min-h-[280px]">
            <div className="flex items-center justify-between mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-[#4A4D53]">
              <span>{p.name.toLowerCase().replace(/\s+/g, "_")}.src</span>
              <span className="text-[#00FF66]">● live</span>
            </div>
            <ScrollCode code={p.snippet} progress={localProgress} />
          </div>
          <div className="rounded-lg border border-[#1a2a1a] bg-black p-4 font-mono text-[11.5px] leading-[1.9] text-[#00FF66]">
            {p.sample.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HorizontalProjects({ projects }: { projects: HProject[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Slower per-slide pan so the lock feels intentional, not whooshy.
  const totalVh = projects.length * 140;
  const [pinState, setPinState] = useState<"before" | "pinned" | "after">("before");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // pan over the WHOLE locked range with small start/end dwell
  const xRaw = useTransform(
    scrollYProgress,
    [0.05, 0.95],
    [0, -(projects.length - 1) * 100]
  );
  const x = useTransform(xRaw, (v) =>
    `${Math.max(-(projects.length - 1) * 100, Math.min(0, v))}vw`
  );
  const barWidth = useTransform(scrollYProgress, (v) =>
    `${Math.min(100, Math.max(0, v) * 100)}%`
  );

  // Use position:fixed while in the pin range so the panel is rock-still vertically
  // (sticky drifts up at the tail; fixed does not).
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > 0) setPinState("before");
      else if (rect.bottom <= window.innerHeight) setPinState("after");
      else setPinState("pinned");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const panelStyle: React.CSSProperties =
    pinState === "pinned"
      ? { position: "fixed", top: 0, left: 0, right: 0, height: "100vh" }
      : pinState === "before"
      ? { position: "absolute", top: 0, left: 0, right: 0, height: "100vh" }
      : { position: "absolute", bottom: 0, left: 0, right: 0, height: "100vh" };

  return (
    <div
      ref={ref}
      style={{ height: `${totalVh}vh`, position: "relative" }}
      className="relative"
    >
      <div
        ref={innerRef}
        style={panelStyle}
        className="overflow-hidden bg-black"
      >
        {/* chapter header in-panel so it doesn't fight the pin */}
        <div className="absolute top-0 left-0 right-0 z-30 px-16 py-5 flex items-baseline gap-6 border-b border-[#1a2a1a] bg-black/85 backdrop-blur-sm">
          <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#00FF66]">
            chapter / 01
          </span>
          <span className="font-[Inter] text-[18px] font-medium tracking-tight text-white">
            Field specimens, dissected.
          </span>
          <span className="font-mono text-[11px] text-[#4A4D53] ml-auto">
            scroll ↓ · pan →
          </span>
        </div>

        {/* progress bar sits under header */}
        <div className="absolute top-[56px] left-0 right-0 z-20 h-px bg-[#1a2a1a]">
          <motion.div
            style={{ width: barWidth, boxShadow: "0 0 8px #00FF66" }}
            className="h-full bg-[#00FF66]"
          />
        </div>

        {/* slide indicator */}
        <div className="absolute top-[74px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {projects.map((_, i) => (
            <SlideDot key={i} index={i} total={projects.length} progress={scrollYProgress} />
          ))}
        </div>

        <motion.div style={{ x }} className="flex h-full pt-[80px]">
          {projects.map((p, i) => (
            <HSlide
              key={p.id}
              p={p}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>

        <div className="absolute bottom-6 left-16 right-16 flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53] z-20">
          <span>session :: lateral scan</span>
          <span>horizontal lock engaged</span>
        </div>
      </div>
    </div>
  );
}

function SlideDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const center = index / (total - 1 || 1);
  const width = useTransform(progress, (v) => {
    const dist = Math.abs(v - center);
    return dist < 0.15 ? "24px" : "8px";
  });
  const bg = useTransform(progress, (v) => {
    const dist = Math.abs(v - center);
    return dist < 0.15 ? "#00FF66" : "#224422";
  });
  return (
    <motion.span
      style={{ width, background: bg, height: "4px" }}
      className="rounded-full block"
    />
  );
}
