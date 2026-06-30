import { useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

const LINKS = ["About", "Projects", "Skills", "Contact"];

export function NexusNav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.6, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -40]);

  return (
    <>
      <motion.nav
        style={{ opacity, y }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
      >
        <motion.button
          layout
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#0A0F0A]/80 backdrop-blur-md border border-[#1a2a1a]"
          style={{ boxShadow: "0 0 30px rgba(0,255,102,0.08)" }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 12 }}
              className="block w-2 h-2 rounded-full bg-[#00FF66]"
              style={{ boxShadow: "0 0 10px #00FF66" }}
            />
          ))}
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-8 right-8 font-mono text-[12px] tracking-[0.3em] text-[#00FF66] uppercase border border-[#224422] rounded-full px-4 py-2 hover:bg-[#00FF66]/10"
            >
              [esc] close
            </button>
            <div className="absolute top-8 left-8 font-mono text-[12px] tracking-[0.3em] text-[#4A4D53] uppercase">
              nexus :: open
            </div>
            <ul className="flex flex-col items-center gap-10">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="relative font-[Inter] text-[64px] font-bold tracking-tight text-[#00FF66] hover:text-white transition-colors"
                    style={{ textShadow: "0 0 30px rgba(0,255,102,0.5)" }}
                  >
                    {`./${link.toLowerCase()}`}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-[#4A4D53] uppercase">
              encrypted channel // tauqeer.sec
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
