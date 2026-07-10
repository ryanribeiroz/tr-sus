import { Activity } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-16 h-16" : size === "sm" ? "w-8 h-8" : "w-12 h-12";
  const txt = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <div className="flex items-center gap-3">
      <div className={`${sz} rounded-2xl flex items-center justify-center text-primary-foreground shadow-[var(--shadow-elevated)]`} style={{ background: "var(--gradient-primary)" }}>
        <Activity className="w-1/2 h-1/2" strokeWidth={2.5} />
      </div>
      <div>
        <div className={`${txt} font-extrabold leading-none tracking-tight`}>
          Territorializa<span className="text-primary">SUS</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-1">Saúde no território</div>
      </div>
    </div>
  );
}
