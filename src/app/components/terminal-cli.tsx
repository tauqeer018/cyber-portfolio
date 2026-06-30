import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const HELP = [
  "available commands:",
  "  help                        — show this list",
  "  whoami                      — operator profile",
  "  ls projects                 — list field specimens",
  "  cat skills                  — print toolkit",
  "  contact --name X --msg Y    — transmit message",
  "  clear                       — wipe buffer",
];

export function TerminalCLI() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "tauqeer.sec terminal v2.6.18 — type 'help' for commands" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const next: Line[] = [...lines, { kind: "in", text: cmd }];
    if (!cmd) return setLines(next);

    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);

    const [head, ...rest] = cmd.split(/\s+/);
    switch (head) {
      case "help":
        HELP.forEach((l) => next.push({ kind: "out", text: l }));
        break;
      case "whoami":
        next.push({ kind: "out", text: "muhammad tauqeer · offensive security operator" });
        next.push({ kind: "out", text: "role :: red_team · network_recon · low_level" });
        next.push({ kind: "out", text: "node :: islamabad/pk · status :: online" });
        break;
      case "ls": {
        if (rest[0] === "projects") {
          next.push({ kind: "out", text: "01  network_sniffer_tool.py" });
          next.push({ kind: "out", text: "02  atm_management_system.cpp" });
          next.push({ kind: "out", text: "03  number_conversion_system.cpp" });
        } else {
          next.push({ kind: "err", text: `ls: missing target — try 'ls projects'` });
        }
        break;
      }
      case "cat": {
        if (rest[0] === "skills") {
          next.push({ kind: "out", text: "infiltration   :: red_teaming · exploit_dev · post-exploit" });
          next.push({ kind: "out", text: "network_recon  :: ccna · tcp/ip · wireshark · cisco_ios" });
          next.push({ kind: "out", text: "low_level      :: c++ · python · bash · linux internals" });
        } else {
          next.push({ kind: "err", text: `cat: no such file '${rest[0] ?? ""}'` });
        }
        break;
      }
      case "contact": {
        const argStr = rest.join(" ");
        const name = /--name\s+"([^"]+)"|--name\s+(\S+)/.exec(argStr);
        const msg = /--msg\s+"([^"]+)"|--msg\s+(\S+)/.exec(argStr);
        if (!name || !msg) {
          next.push({ kind: "err", text: 'usage: contact --name "X" --msg "Y"' });
          break;
        }
        next.push({ kind: "out", text: `encrypting packet for ${name[1] ?? name[2]}...` });
        next.push({ kind: "ok", text: "[ OK ] transmitted via TLS 1.3 — response queued" });
        break;
      }
      case "clear":
        setLines([]);
        return;
      default:
        next.push({ kind: "err", text: `command not found: ${head} — try 'help'` });
    }
    setLines(next);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="rounded-2xl border border-[#1a2a1a] bg-[#020602] overflow-hidden cursor-text"
    >
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a2a1a] bg-black/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66]" style={{ boxShadow: "0 0 8px #00FF66" }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[#224422]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#224422]" />
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4A4D53]">
          /usr/local/bin/tauqeer-shell
        </span>
        <span className="font-mono text-[10px] text-[#00FF66]">● tty</span>
      </div>
      <div
        ref={scrollRef}
        className="h-[360px] overflow-y-auto p-6 font-mono text-[12.5px] leading-[1.7] space-y-0.5"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.kind === "in"
                ? "text-white"
                : l.kind === "err"
                ? "text-[#ff5577]"
                : l.kind === "ok"
                ? "text-[#00FF66]"
                : "text-[#9bb09b]"
            }
          >
            {l.kind === "in" ? <span className="text-[#00FF66]">tauqeer@sec:~$ </span> : null}
            {l.text}
          </div>
        ))}
        <div className="flex items-center text-white">
          <span className="text-[#00FF66]">tauqeer@sec:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(value);
                setValue("");
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const ni = Math.min(history.length - 1, hIdx + 1);
                setHIdx(ni);
                setValue(history[ni] ?? "");
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const ni = Math.max(-1, hIdx - 1);
                setHIdx(ni);
                setValue(ni === -1 ? "" : history[ni]);
              }
            }}
            className="flex-1 bg-transparent outline-none border-none font-mono text-[12.5px] text-white caret-[#00FF66]"
            autoFocus
            spellCheck={false}
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="w-[7px] h-[14px] bg-[#00FF66] ml-0.5"
          />
        </div>
      </div>
    </div>
  );
}
