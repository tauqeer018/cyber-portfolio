import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useSettings } from "./settings-context";

export function ReticleCursor() {
  const { lowStim, reducedMotion } = useSettings();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });
  const [hot, setHot] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (lowStim || reducedMotion) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const el = e.target as HTMLElement;
      setHot(!!el.closest("a, button, input, textarea, [data-cursor='hot']"));
    };
    const leave = () => setHidden(true);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    document.documentElement.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      document.documentElement.style.cursor = "";
    };
  }, [x, y, lowStim, reducedMotion]);

  if (lowStim || reducedMotion) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy, opacity: hidden ? 0 : 1 }}
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
    >
      <motion.div
        animate={{ scale: hot ? 1.8 : 1, rotate: hot ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="6" stroke="#00FF66" strokeWidth="1" />
          <circle cx="14" cy="14" r="1.6" fill="#00FF66" />
          <path d="M14 0 V6 M14 22 V28 M0 14 H6 M22 14 H28" stroke="#00FF66" strokeWidth="1" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function ScanlineCursor() {
  const { lowStim, reducedMotion } = useSettings();
  const y = useMotionValue(-100);
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (lowStim || reducedMotion) return;
    const move = (e: MouseEvent) => y.set(e.clientY);
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [y, lowStim, reducedMotion]);

  if (lowStim || reducedMotion) return null;

  return (
    <motion.div
      style={{ y: sy }}
      className="pointer-events-none fixed top-0 left-0 right-0 z-[90] h-px"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00FF66]/40 to-transparent" />
    </motion.div>
  );
}

export function CRTOverlay() {
  const { lowStim, reducedMotion } = useSettings();
  if (lowStim || reducedMotion) return null;
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[80] opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,255,102,0.6) 0px, rgba(0,255,102,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[81]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}

export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const { lowStim, reducedMotion } = useSettings();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  if (lowStim || reducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const { lowStim, reducedMotion } = useSettings();
  const [hover, setHover] = useState(false);

  if (lowStim || reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="relative z-10">{text}</span>
      {hover && (
        <>
          <motion.span
            aria-hidden
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [-2, 2, -1, 1, 0], opacity: 0.8 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute inset-0 text-[#ff0044] mix-blend-screen"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
          >
            {text}
          </motion.span>
          <motion.span
            aria-hidden
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [2, -2, 1, -1, 0], opacity: 0.8 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute inset-0 text-[#00ccff] mix-blend-screen"
            style={{ clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}

export function SectionWipe() {
  const { lowStim, reducedMotion } = useSettings();
  if (lowStim || reducedMotion) {
    return <div className="h-px bg-[#1a2a1a]" />;
  }
  return (
    <div className="relative h-px overflow-hidden">
      <div className="absolute inset-0 bg-[#1a2a1a]" />
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent"
        style={{ boxShadow: "0 0 20px #00FF66" }}
      />
    </div>
  );
}
