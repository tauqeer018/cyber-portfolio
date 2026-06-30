import { useEffect, useState } from "react";
import { motion } from "motion/react";

const SECTIONS = [
  { id: "hero", code: "00", label: "entry" },
  { id: "projects", code: "01", label: "artifacts" },
  { id: "about", code: "02", label: "toolkit" },
  { id: "contact", code: "03", label: "breach" },
];

export function SectionRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-6">
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-3">
            <motion.span
              animate={{
                width: isActive ? 28 : 12,
                backgroundColor: isActive ? "#00FF66" : "#224422",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="h-px block"
              style={isActive ? { boxShadow: "0 0 8px #00FF66" } : undefined}
            />
            <span
              className={`font-mono text-[10px] tracking-[0.3em] uppercase transition-colors ${
                isActive ? "text-[#00FF66]" : "text-[#4A4D53] group-hover:text-[#9bb09b]"
              }`}
            >
              {s.code} {isActive && `// ${s.label}`}
            </span>
          </a>
        );
      })}
    </div>
  );
}
