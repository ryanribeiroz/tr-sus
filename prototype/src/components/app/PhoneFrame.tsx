import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-8" style={{ background: "var(--gradient-soft)" }}>
      <div className="w-full sm:w-[400px] sm:h-[820px] sm:rounded-[3rem] sm:border-[10px] sm:border-foreground/90 bg-background sm:shadow-[0_30px_80px_-30px_rgba(20,30,80,0.4)] overflow-hidden flex flex-col relative">
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground/90 rounded-full z-50" />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function StatusBar({ title, online }: { title?: string; online?: boolean }) {
  return (
    <div className="px-6 pt-10 sm:pt-12 pb-2 flex items-center justify-between text-xs font-semibold text-foreground/80">
      <span>9:41</span>
      <span className="flex items-center gap-2">
        {online !== undefined && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${online ? "bg-success/15 text-success" : "bg-warning/20 text-warning"}`}>
            {online ? "ONLINE" : "OFFLINE"}
          </span>
        )}
      </span>
    </div>
  );
}
