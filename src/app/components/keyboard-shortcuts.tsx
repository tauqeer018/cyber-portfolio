import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const SHORTCUTS = [
  { keys: ["g", "h"], label: "jump to hero", id: "hero" },
  { keys: ["g", "p"], label: "jump to projects", id: "projects" },
  { keys: ["g", "s"], label: "jump to skills", id: "about" },
  { keys: ["g", "c"], label: "jump to contact", id: "contact" },
  { keys: ["?"], label: "toggle this help", id: null },
  { keys: ["esc"], label: "close overlays", id: null },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const [pendingG, setPendingG] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "?") {
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        setPendingG(false);
        return;
      }
      if (e.key === "g") {
        setPendingG(true);
        setTimeout(() => setPendingG(false), 1200);
        return;
      }
      if (pendingG) {
        const target =
          { h: "hero", p: "projects", s: "about", c: "contact" }[e.key.toLowerCase()];
        if (target) {
          document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
          setPendingG(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingG]);

  return (
    <>
      <AnimatePresence>
        {pendingG && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-md bg-[#0A0F0A] border border-[#224422] font-mono text-[11px] text-[#00FF66] tracking-[0.2em] uppercase"
          >
            g _ · awaiting target [h/p/s/c]
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[520px] rounded-2xl border border-[#224422] bg-[#0A0F0A] p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#4A4D53]">
                  /bin/help — keymap
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#4A4D53] hover:text-[#00FF66]"
                >
                  [esc]
                </button>
              </div>
              <ul className="space-y-3">
                {SHORTCUTS.map((s) => (
                  <li key={s.label} className="flex items-center justify-between font-mono text-[12px]">
                    <span className="text-[#9bb09b]">{s.label}</span>
                    <span className="flex gap-1.5">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-1 rounded border border-[#224422] bg-black text-[#00FF66] text-[10px] uppercase tracking-[0.1em]"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-10 h-10 rounded-full border border-[#224422] bg-[#0A0F0A] font-mono text-[14px] text-[#00FF66] hover:bg-[#00FF66]/10 transition-colors"
        title="Keyboard shortcuts (?)"
      >
        ?
      </button>
    </>
  );
}
