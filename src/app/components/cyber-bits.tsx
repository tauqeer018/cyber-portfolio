import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "motion/react";

export function Particles({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#00FF66";
        ctx.shadowColor = "#00FF66";
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,102,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export function BlurText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(14px)", opacity: 0, y: 14 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01ABCDEF$%&".split("");

export function DecryptedText({
  text,
  className = "",
  delay = 0,
  speed = 40,
  duration = 1200,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  duration?: number;
}) {
  const [output, setOutput] = useState(text.replace(/[^\s]/g, " "));
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const reveal = Math.floor(t * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          if (i < reveal || text[i] === " ") out += text[i];
          else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setOutput(out);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setDone(true);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden style={{ opacity: done ? 1 : 0.95 }}>
        {output}
      </span>
    </span>
  );
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: c === " " ? "pre" : undefined }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}

export function StarBorder({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl p-[1px] overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, #00FF66 40deg, transparent 90deg, transparent 180deg, #00FF66 220deg, transparent 270deg)",
          animation: "starborder-spin 6s linear infinite",
        }}
      />
      <div className="absolute inset-0 rounded-2xl border border-[#1a2a1a]" />
      <div className="relative rounded-2xl bg-[#0A0F0A] h-full">{children}</div>
      <style>{`@keyframes starborder-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ShinyText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, #064d1f 0%, #00FF66 50%, #064d1f 100%)",
        backgroundSize: "200% 100%",
        animation: "shiny 3.5s linear infinite",
      }}
    >
      {children}
      <style>{`@keyframes shiny { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </span>
  );
}

export function TerminalInput({
  label,
  type = "text",
  multiline = false,
  name,
}: {
  label: string;
  type?: string;
  multiline?: boolean;
  name: string;
}) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.18em] text-[#4A4D53] uppercase">
        <span className="text-[#00FF66]">$</span> {label}
      </span>
      <div className="mt-2 relative">
        <Tag
          name={name}
          type={type}
          rows={multiline ? 4 : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border border-[#224422] focus:border-[#224422] rounded-md px-4 py-3 font-mono text-[14px] text-[#d5f5d5] outline-none placeholder:text-[#2f4a2f] resize-none"
          placeholder={multiline ? "> message body..." : "> input..."}
        />
        <motion.div
          className="absolute left-1/2 -bottom-[1px] h-[2px] bg-[#00FF66]"
          style={{ boxShadow: "0 0 12px #00FF66" }}
          initial={{ width: 0, x: "-50%" }}
          animate={{ width: focused ? "100%" : 0, x: "-50%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </label>
  );
}
