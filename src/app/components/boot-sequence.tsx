import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "./settings-context";

const LINES = [
  "[ OK ] establishing handshake with node 0xA7F...",
  "[ OK ] decrypting subject manifest [AES-256]",
  "[ OK ] resolving geo: 33.6844° N, 73.0479° E",
  "[ OK ] mounting /dev/portfolio at /",
  "[ >> ] rendering trace...",
];

export function BootSequence({ onDone }: { onDone: () => void }) {
  const { reducedMotion } = useSettings();
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setDone(true);
      onDone();
      return;
    }
    if (idx >= LINES.length) {
      const t = setTimeout(() => {
        setDone(true);
        onDone();
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx(idx + 1), 220 + Math.random() * 160);
    return () => clearTimeout(t);
  }, [idx, reducedMotion, onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        >
          <div className="w-[640px] font-mono text-[13px] text-[#00FF66] leading-[1.8]">
            <div className="text-[#4A4D53] mb-4 tracking-[0.2em] uppercase">
              tauqeer.sec :: boot v2.6.18
            </div>
            {LINES.slice(0, idx).map((l, i) => (
              <div key={i}>
                <span className="text-[#4A4D53]">{String(i).padStart(2, "0")}</span>{" "}
                {l}
              </div>
            ))}
            {idx < LINES.length && (
              <div>
                <span className="text-[#4A4D53]">{String(idx).padStart(2, "0")}</span>{" "}
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
