import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import {
  Terminal,
  ShieldAlert,
  Network,
  Code2,
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Cpu,
  Radio,
  Bug,
  Lock,
  ChevronDown,
  TerminalSquare,
} from "lucide-react";
import { NexusNav } from "./components/nexus-nav";
import {
  Particles,
  BlurText,
  StarBorder,
  ShinyText,
  TerminalInput,
  DecryptedText,
  SplitText,
} from "./components/cyber-bits";
import { SettingsProvider, useSettings } from "./components/settings-context";
import {
  ReticleCursor,
  ScanlineCursor,
  CRTOverlay,
  Magnetic,
  GlitchText,
  SectionWipe,
} from "./components/atmosphere";
import { BootSequence } from "./components/boot-sequence";
import { SectionRail } from "./components/section-rail";
import { KeyboardShortcuts } from "./components/keyboard-shortcuts";
import { LowStimToggle } from "./components/low-stim-toggle";
import { TerminalCLI } from "./components/terminal-cli";
import {
  ScrollWords,
  ScrollCounter,
  ParallaxLayer,
  StickyChapter,
  HorizontalProjects,
} from "./components/storytelling";

const PROJECTS = [
  {
    id: "01",
    name: "Network Sniffer Tool",
    stack: "Python · Scapy · TCP/IP",
    role: "Packet Inspection Engine",
    blurb:
      "A passive monitoring agent that intercepts, classifies and decodes traffic across LAN interfaces — surfacing rogue handshakes and credential leaks in plaintext streams.",
    metrics: [
      { k: "PPS", v: "12.4K" },
      { k: "Protocols", v: "27" },
      { k: "Latency", v: "0.8ms" },
    ],
    icon: Radio,
    dossier: {
      arch: [
        "ifaces → libpcap capture loop",
        "scapy decode + protocol classifier",
        "sqlite buffer · hot-swap rotation",
        "ncurses live dashboard",
      ],
      snippet: `def sniff_loop(iface):
    for pkt in sniff(iface=iface, store=False):
        cls = classify(pkt)
        if cls.flag == "leak":
            alert.push(cls.summary())`,
      sample: [
        "[10:42:01] TCP 192.168.1.14:443 → 10.0.0.4 · TLSv1.3 · 1480B",
        "[10:42:01] ARP who-has 192.168.1.1 tell 192.168.1.14",
        "[10:42:02] HTTP POST /login · token=eyJ...  (!plaintext)",
      ],
    },
  },
  {
    id: "02",
    name: "ATM Management System",
    stack: "C++ · OOP · File I/O",
    role: "Secure Transactional Core",
    blurb:
      "A pin-encrypted banking simulator handling multi-user accounts, deposit ledgers and rollback-safe withdrawals — modelled after real ISO 8583 transaction flows.",
    metrics: [
      { k: "Modules", v: "14" },
      { k: "Accounts", v: "∞" },
      { k: "Tested", v: "100%" },
    ],
    icon: Lock,
    dossier: {
      arch: [
        "Account · Transaction · Ledger classes",
        "SHA-1 pin hash + salt per record",
        "atomic file I/O with WAL journal",
        "menu-driven CLI front-end",
      ],
      snippet: `class Account {
  bool withdraw(double amt) {
    if (amt > balance_) return false;
    ledger_.append({"-", amt, now()});
    balance_ -= amt;
    return true;
  }
};`,
      sample: [
        "> auth 4521 0042 ████ ✓",
        "> balance: $ 12,480.55",
        "> withdraw 200.00 · journal=tx_0099 · ok",
      ],
    },
  },
  {
    id: "03",
    name: "Number Conversion System",
    stack: "C++ · Bitwise · CLI",
    role: "Low-Level Base Translator",
    blurb:
      "A compact converter operating on raw binary, octal, decimal and hex buffers — built without standard math libs to exercise pure bit-level manipulation.",
    metrics: [
      { k: "Bases", v: "4" },
      { k: "Ops", v: "Bitwise" },
      { k: "Size", v: "<8KB" },
    ],
    icon: Cpu,
    dossier: {
      arch: [
        "uint64 internal representation",
        "shift/mask base extractors",
        "lookup table for hex digits",
        "stdin pipe friendly CLI",
      ],
      snippet: `string toBase(uint64_t n, int b) {
  string out;
  while (n) {
    out += "0123456789ABCDEF"[n & (b-1)];
    n >>= __builtin_ctz(b);
  }
  return {out.rbegin(), out.rend()};
}`,
      sample: [
        "$ conv 255 → bin  : 11111111",
        "$ conv 255 → oct  : 377",
        "$ conv 255 → hex  : FF",
      ],
    },
  },
];

const SKILLS = [
  {
    title: "Infiltration",
    sub: "Red Teaming",
    icon: ShieldAlert,
    items: [
      { name: "Reconnaissance & OSINT", lvl: 88 },
      { name: "Exploit Development", lvl: 74 },
      { name: "Privilege Escalation", lvl: 80 },
      { name: "Post-Exploitation Pivoting", lvl: 72 },
      { name: "Metasploit · Burp Suite", lvl: 85 },
    ],
  },
  {
    title: "Network Recon",
    sub: "CCNA · Networking",
    icon: Network,
    items: [
      { name: "TCP/IP & OSI Stack", lvl: 92 },
      { name: "Subnetting · VLSM · VLANs", lvl: 88 },
      { name: "Routing (OSPF/EIGRP)", lvl: 78 },
      { name: "Wireshark Deep Analysis", lvl: 84 },
      { name: "Cisco IOS Configuration", lvl: 82 },
    ],
  },
  {
    title: "Low-Level Scripting",
    sub: "Linux · Python · C++",
    icon: Code2,
    items: [
      { name: "Bash & Shell Automation", lvl: 86 },
      { name: "Python Tooling", lvl: 90 },
      { name: "C++ Memory Management", lvl: 78 },
      { name: "Kernel & System Calls", lvl: 70 },
      { name: "Reverse Engineering", lvl: 65 },
    ],
  },
];

function SkillBar({ name, lvl }: { name: string; lvl: number }) {
  const cells = 10;
  const filled = Math.round((lvl / 100) * cells);
  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-[#9bb09b]">{name}</span>
        <span className="font-mono text-[10px] text-[#4A4D53]">{lvl}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[12px] text-[#224422]">[</span>
        <div className="flex-1 flex gap-[2px]">
          {Array.from({ length: cells }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scaleY: 0.2 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="h-2 flex-1"
              style={{
                background: i < filled ? "#00FF66" : "#1a2a1a",
                boxShadow: i < filled ? "0 0 6px rgba(0,255,102,0.5)" : undefined,
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[12px] text-[#224422]">]</span>
      </div>
    </li>
  );
}

function SectionLabel({ children, code }: { children: string; code: string }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] uppercase text-[#4A4D53]">
      <span className="text-[#00FF66]">{code}</span>
      <span className="h-px w-12 bg-[#224422]" />
      <span>{children}</span>
    </div>
  );
}

function HeroPortrait() {
  return (
    <div className="relative w-[360px] h-[440px] rounded-2xl overflow-hidden border border-[#224422] bg-[#0A0F0A]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#00FF66 1px, transparent 1px), linear-gradient(90deg, #00FF66 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      <svg viewBox="0 0 360 440" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="silhouette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="100%" stopColor="#001a08" />
          </linearGradient>
        </defs>
        <path
          d="M180 100 Q230 100 230 160 Q230 200 210 220 Q260 240 280 320 Q290 360 290 440 L70 440 Q70 360 80 320 Q100 240 150 220 Q130 200 130 160 Q130 100 180 100 Z"
          fill="url(#silhouette)"
          stroke="#00FF66"
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />
        <circle cx="160" cy="165" r="2" fill="#00FF66" />
        <circle cx="200" cy="165" r="2" fill="#00FF66" />
      </svg>

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-[#00FF66]">
        <span>subject_001</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" /> live
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] tracking-[0.18em] text-[#4A4D53]">
        <div className="flex justify-between"><span>LAT</span><span>33.6844° N</span></div>
        <div className="flex justify-between"><span>LON</span><span>73.0479° E</span></div>
        <div className="flex justify-between"><span>STATUS</span><span className="text-[#00FF66]">TRACKED</span></div>
      </div>
    </div>
  );
}

function HeroSection() {
  const { lowStim } = useSettings();
  return (
    <section id="hero" className="relative min-h-screen px-16 pt-40 pb-24 overflow-hidden">
      {!lowStim && (
        <div className="absolute inset-0">
          <Particles count={70} />
        </div>
      )}
      <ParallaxLayer speed={0.3} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#00FF66 1px, transparent 1px), linear-gradient(90deg, #00FF66 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </ParallaxLayer>

      <div className="relative max-w-[1280px] mx-auto grid grid-cols-12 gap-10 items-center">
        <div className="col-span-8 space-y-10">
          <SectionLabel code="// 00">entry_point</SectionLabel>

          <h1
            className="font-[Inter] text-[56px] leading-[1] font-semibold tracking-tight text-white"
            style={{ textShadow: "0 0 30px rgba(0,255,102,0.2)" }}
          >
            <SplitText
              text="Tracking the digital footprint of"
              className="block text-white/80 overflow-hidden"
            />
            <span className="block text-[#00FF66] mt-2 font-mono">
              <DecryptedText text="Muhammad Tauqeer." delay={700} duration={1400} />
            </span>
          </h1>

          <ScrollWords
            text="offensive security operator. low-level engineer. signal hunter. mapping the seams between hardened networks and the humans who run them."
            highlight={["offensive", "operator.", "signal", "seams"]}
            className="max-w-[640px] font-mono text-[14px] leading-[1.8]"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <Magnetic>
              <a
                href="#projects"
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#00FF66] text-black font-mono text-[12px] tracking-[0.2em] uppercase hover:shadow-[0_0_30px_#00FF66] transition-shadow"
              >
                <Terminal className="w-4 h-4" /> initiate trace
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#contact"
                className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#4A4D53] hover:text-[#00FF66] transition-colors"
              >
                open_channel.sh →
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="grid grid-cols-4 gap-6 max-w-[640px] pt-10 border-t border-[#1a2a1a]"
          >
            {([
              { k: "exploits_logged", n: 37, pad: 0, literal: null as string | null },
              { k: "ctf_solved", n: 112, pad: 0, literal: null as string | null },
              { k: "uptime_yrs", n: 4, pad: 2, literal: null as string | null },
              { k: "stack_depth", n: 0, pad: 0, literal: "L1↔L7" as string | null },
            ]).map((s) => (
              <div key={s.k}>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#4A4D53]">{s.k}</div>
                <div className="font-mono text-[18px] text-[#00FF66] mt-1">
                  {s.literal ? s.literal : <ScrollCounter to={s.n} pad={s.pad} />}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="col-span-4 flex justify-end"
        >
          <HeroPortrait />
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-16 right-16 flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53]">
        <span>session :: 0xA7F.2026.tq</span>
        <span className="flex items-center gap-2">
          scroll to decrypt
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
        </span>
        <span>node :: islamabad/pk</span>
      </div>
    </section>
  );
}

function ProjectCard({ p, idx }: { p: (typeof PROJECTS)[number]; idx: number }) {
  const Icon = p.icon;
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <StarBorder>
        <div className="p-10 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-1 font-mono text-[32px] text-[#224422]">{p.id}</div>
          <div className="col-span-7 space-y-5">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-[#00FF66]">
              <Icon className="w-4 h-4" /> {p.role}
            </div>
            <h3 className="font-[Inter] text-[28px] font-semibold tracking-tight text-white leading-tight">
              {p.name}
            </h3>
            <p className="font-mono text-[13px] leading-[1.8] text-[#7a8a7a] max-w-[560px]">
              {p.blurb}
            </p>
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#4A4D53]">
              stack :: <span className="text-[#00FF66]">{p.stack}</span>
            </div>
          </div>
          <div className="col-span-4 space-y-3 border-l border-[#1a2a1a] pl-8">
            {p.metrics.map((m) => (
              <div key={m.k} className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#4A4D53]">{m.k}</span>
                <span className="font-mono text-[24px] text-[#00FF66]">{m.v}</span>
              </div>
            ))}
            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-4 w-full flex items-center justify-between px-4 py-3 border border-[#224422] rounded-md font-mono text-[11px] tracking-[0.2em] uppercase text-[#00FF66] hover:bg-[#00FF66]/10 transition-colors"
            >
              {open ? "collapse dossier" : "open dossier"}
              <motion.span animate={{ rotate: open ? 180 : 0 }}>
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-[#1a2a1a]"
            >
              <div className="p-10 grid grid-cols-12 gap-8">
                <div className="col-span-4 space-y-3">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53]">
                    // architecture
                  </div>
                  <ul className="space-y-2">
                    {p.dossier.arch.map((a) => (
                      <li key={a} className="flex gap-2 font-mono text-[12px] text-[#9bb09b]">
                        <span className="text-[#00FF66]">▸</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-4">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53] mb-3">
                    // source · excerpt
                  </div>
                  <pre className="rounded-md border border-[#1a2a1a] bg-black p-4 font-mono text-[11px] leading-[1.7] text-[#9bb09b] overflow-x-auto">
                    <code>{p.dossier.snippet}</code>
                  </pre>
                </div>
                <div className="col-span-4">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53] mb-3">
                    // demo · stdout
                  </div>
                  <div className="rounded-md border border-[#1a2a1a] bg-black p-4 font-mono text-[11px] leading-[1.9] text-[#00FF66]">
                    {p.dossier.sample.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                    <div className="text-[#4A4D53] mt-1">
                      <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </StarBorder>
    </motion.div>
  );
}

function ProjectsSection() {
  const hProjects = PROJECTS.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    stack: p.stack,
    blurb: p.blurb,
    snippet: p.dossier.snippet,
    sample: p.dossier.sample,
  }));

  return (
    <section id="projects" className="relative">
      <HorizontalProjects projects={hProjects} />
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative">
      <StickyChapter num="02" title="Operator Dossier." caption="background check" />
      <div className="relative max-w-[1280px] mx-auto px-16 py-32 grid grid-cols-12 gap-16 items-center">
        <div className="col-span-6 space-y-8">
          <SectionLabel code="// 02">whoami</SectionLabel>
          <h2 className="font-[Inter] text-[48px] font-semibold tracking-tight text-white leading-[0.95]">
            <ShinyText>Muhammad Tauqeer.</ShinyText>
          </h2>
          <ScrollWords
            text="I am an offensive security specialist and low-level engineer. I specialize in red-teaming, deep network analysis, and building custom tooling to map and infiltrate hardened environments."
            highlight={["offensive", "specialist", "red-teaming", "infiltrate"]}
            className="font-mono text-[14px] leading-[1.8]"
          />
          <p className="font-mono text-[13px] text-[#7a8a7a] leading-[1.8]">
            My approach blends relentless curiosity with rigorous technical methodology. I don't just use existing tools; I dissect them, understand their limitations, and write my own when necessary. Whether it's crafting a custom packet sniffer or reverse-engineering a proprietary protocol, my goal is to uncover the truth hidden within the bits and bytes.
          </p>
        </div>
        <div className="col-span-6 relative">
          <div className="absolute inset-0 bg-[#00FF66]/5 rounded-2xl blur-2xl" />
          <div className="relative rounded-2xl border border-[#1a2a1a] bg-[#0A0F0A] p-8 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent opacity-50" />
             <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#4A4D53] mb-6 flex justify-between">
               <span>ID: MT-89X-00</span>
               <span className="text-[#00FF66]">STATUS: ACTIVE</span>
             </div>
             
             <ul className="space-y-4 font-mono text-[12px]">
               <li className="flex justify-between border-b border-[#1a2a1a] pb-2">
                 <span className="text-[#4A4D53]">LOCATION</span>
                 <span className="text-[#9bb09b]">Islamabad, PK</span>
               </li>
               <li className="flex justify-between border-b border-[#1a2a1a] pb-2">
                 <span className="text-[#4A4D53]">CLEARANCE</span>
                 <span className="text-[#9bb09b]">Level 5 (Red Team)</span>
               </li>
               <li className="flex justify-between border-b border-[#1a2a1a] pb-2">
                 <span className="text-[#4A4D53]">SPECIALIZATION</span>
                 <span className="text-[#9bb09b]">Exploit Dev, Recon</span>
               </li>
               <li className="flex justify-between pt-2">
                 <span className="text-[#4A4D53]">SYSTEM_UPTIME</span>
                 <span className="text-[#00FF66]">4.2 Years</span>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section id="skills" className="relative">
      <StickyChapter num="03" title="The arsenal on disk." caption="three vectors · staggered reveal" />
      <ParallaxLayer
        speed={0.35}
        className="absolute inset-x-0 top-0 h-full opacity-[0.04] pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#00FF66 1px, transparent 1px), linear-gradient(90deg, #00FF66 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </ParallaxLayer>
      <div className="relative max-w-[1280px] mx-auto px-16 py-32">
        <div className="grid grid-cols-12 gap-10 mb-20">
          <div className="col-span-8 space-y-6">
            <SectionLabel code="// 03">toolkit</SectionLabel>
            <h2 className="font-[Inter] text-[48px] font-semibold tracking-tight text-white leading-[0.95]">
              The <ShinyText>arsenal</ShinyText>
              <br />on disk.
            </h2>
          </div>
          <div className="col-span-4 flex items-end">
            <ScrollWords
              text="three vectors converge — offensive tradecraft, deep network literacy, and the muscle memory of writing close to the metal."
              highlight={["tradecraft,", "literacy,", "metal."]}
              className="font-mono text-[12px] leading-[1.8]"
            />
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-3 gap-6"
        >
          {SKILLS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl border border-[#1a2a1a] bg-[#0A0F0A] p-8 group hover:border-[#00FF66]/40 transition-colors"
              >
                <div className="absolute top-0 right-0 font-mono text-[10px] tracking-[0.25em] uppercase text-[#224422] p-4">
                  v.{(SKILLS.indexOf(s) + 1).toString().padStart(2, "0")}
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#00FF66]/10 border border-[#224422] flex items-center justify-center mb-8">
                  <Icon className="w-5 h-5 text-[#00FF66]" />
                </div>
                <h3 className="font-[Inter] text-[28px] font-semibold text-white tracking-tight">
                  {s.title}
                </h3>
                <div className="mt-1 mb-6 font-mono text-[12px] tracking-[0.2em] uppercase">
                  <ShinyText>{s.sub}</ShinyText>
                </div>
                <ul className="space-y-4 border-t border-[#1a2a1a] pt-6">
                  {s.items.map((it) => (
                    <SkillBar key={it.name} name={it.name} lvl={it.lvl} />
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mt-16 rounded-2xl border border-[#1a2a1a] bg-[#0A0F0A] p-8 font-mono text-[13px] text-[#9bb09b] leading-[2]"
        >
          <div className="text-[#4A4D53] mb-2"># cat /etc/operator.profile</div>
          <div><span className="text-[#00FF66]">role</span> = "offensive_security_analyst"</div>
          <div><span className="text-[#00FF66]">specialization</span> = ["red_team", "network_recon", "low_level"]</div>
          <div><span className="text-[#00FF66]">currently_learning</span> = "binary_exploitation · windows_internals"</div>
          <div><span className="text-[#00FF66]">availability</span> = <span className="text-[#00FF66]">true</span></div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [mode, setMode] = useState<"form" | "cli">("cli");
  return (
    <section id="contact" className="relative">
      <StickyChapter num="04" title="Open a channel." caption="handshake awaiting" />
      <div className="relative max-w-[1280px] mx-auto px-16 py-32 grid grid-cols-12 gap-16">
        <div className="col-span-5 space-y-8">
          <SectionLabel code="// 04">the_breach</SectionLabel>
          <h2 className="font-[Inter] text-[48px] font-semibold tracking-tight text-white leading-[0.95]">
            Open a <span className="text-[#00FF66]">channel</span>.
          </h2>
          <ScrollWords
            text="consulting work, red-team engagements, CTF squads, or just a quiet handshake — packets accepted on the address below."
            highlight={["red-team", "CTF", "handshake"]}
            className="font-mono text-[13px] leading-[1.8] max-w-[420px]"
          />

          <div className="pt-8 border-t border-[#1a2a1a] space-y-4 font-mono text-[12px]">
            {[
              { Icon: Mail, k: "MAIL", v: "tauqeer@blackbox.sec", href: "mailto:tauqeer@blackbox.sec" },
              { Icon: Github, k: "GIT ", v: "github.com/tauqeer018", href: "https://github.com/tauqeer018" },
              { Icon: Linkedin, k: "LINK", v: "linkedin.com/in/mtauqeer", href: "https://linkedin.com/in/mtauqeer" },
              { Icon: Bug, k: "PGP ", v: "0x9F4A · 2C71 · BD03", href: "#" },
            ].map(({ Icon, k, v, href }) => (
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={k} className="flex items-center gap-4 group cursor-pointer hover:text-[#00FF66] text-[#9bb09b] transition-colors">
                <Icon className="w-4 h-4 text-[#00FF66]" />
                <span className="text-[#4A4D53] tracking-[0.2em]">{k}</span>
                <span className="border-l border-[#1a2a1a] pl-4">{v}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-7 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("cli")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                mode === "cli"
                  ? "bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66]"
                  : "border border-[#1a2a1a] text-[#4A4D53] hover:text-[#9bb09b]"
              }`}
            >
              <TerminalSquare className="w-3.5 h-3.5" /> shell
            </button>
            <button
              onClick={() => setMode("form")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                mode === "form"
                  ? "bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66]"
                  : "border border-[#1a2a1a] text-[#4A4D53] hover:text-[#9bb09b]"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> form
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "cli" ? (
              <motion.div key="cli" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TerminalCLI />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-[#1a2a1a] bg-[#0A0F0A] overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a2a1a] bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66]" style={{ boxShadow: "0 0 8px #00FF66" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#224422]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#224422]" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53]">
                    /usr/local/bin/transmit
                  </span>
                  <span className="font-mono text-[10px] text-[#00FF66]">● secure</span>
                </div>
                <form 
                  className="p-8 space-y-6" 
                  action="https://formspree.io/f/YOUR_FORM_ID" 
                  method="POST"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <TerminalInput label="identity" name="name" />
                    <TerminalInput label="return_addr" name="email" type="email" />
                  </div>
                  <TerminalInput label="subject_line" name="subject" />
                  <TerminalInput label="payload" name="message" multiline />

                  <div className="flex items-center justify-between pt-4">
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#4A4D53]">
                      AES-256 · TLS 1.3
                    </div>
                    <Magnetic>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-7 py-3 rounded-full bg-[#00FF66] text-black font-mono text-[12px] tracking-[0.25em] uppercase flex items-center gap-3"
                        animate={{ boxShadow: "0 0 25px rgba(0,255,102,0.35)" }}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        transmit_packet
                      </motion.button>
                    </Magnetic>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function LivePing() {
  const [ms, setMs] = useState(4);
  useEffect(() => {
    const t = setInterval(() => setMs(2 + Math.floor(Math.random() * 9)), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-[#4A4D53]">
      · last_ping <span className="text-[#9bb09b]">{String(ms).padStart(2, "0")}</span>ms
    </span>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1a2a1a] px-16 py-10">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between font-mono text-[11px] tracking-[0.25em] uppercase text-[#4A4D53]">
        <div>© 2026 m. tauqeer · all signals reserved</div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF66] opacity-60" />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00FF66]"
              style={{ boxShadow: "0 0 8px #00FF66" }}
            />
          </span>
          <span className="text-[#00FF66]">status :: online</span>
          <LivePing />
        </div>
        <div>built with ▸ react · motion · caffeine</div>
      </div>
    </footer>
  );
}

function Shell() {
  const [booted, setBooted] = useState(false);
  return (
    <>
      <BootSequence onDone={() => setBooted(true)} />
      <div
        className="min-h-screen bg-black text-white font-[Inter] selection:bg-[#00FF66] selection:text-black overflow-x-hidden"
        style={{ opacity: booted ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        <CRTOverlay />
        <ScanlineCursor />
        <ReticleCursor />
        <SectionRail />
        <NexusNav />
        <HeroSection />
        <SectionWipe />
        <ProjectsSection />
        <SectionWipe />
        <AboutSection />
        <SectionWipe />
        <SkillsSection />
        <SectionWipe />
        <ContactSection />
        <Footer />
        <KeyboardShortcuts />
        <LowStimToggle />
      </div>
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Shell />
    </SettingsProvider>
  );
}
