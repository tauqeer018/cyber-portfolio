import { useSettings } from "./settings-context";

export function LowStimToggle() {
  const { lowStim, setLowStim } = useSettings();
  return (
    <button
      onClick={() => setLowStim(!lowStim)}
      className="fixed bottom-6 right-20 z-30 px-3 h-10 rounded-full border border-[#224422] bg-[#0A0F0A] font-mono text-[10px] tracking-[0.2em] uppercase text-[#9bb09b] hover:text-[#00FF66] hover:border-[#00FF66]/40 transition-colors flex items-center gap-2"
      title="Toggle low-stimulation mode"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${lowStim ? "bg-[#4A4D53]" : "bg-[#00FF66]"}`}
        style={lowStim ? undefined : { boxShadow: "0 0 6px #00FF66" }}
      />
      {lowStim ? "low-stim" : "full-fx"}
    </button>
  );
}
