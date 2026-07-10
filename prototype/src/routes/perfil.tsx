import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PhoneFrame, StatusBar } from "@/components/app/PhoneFrame";
import { BottomNav } from "@/components/app/BottomNav";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, Calendar, Home as HomeIcon, AlertTriangle, Building2, Send } from "lucide-react";

export const Route = createFileRoute("/perfil")({ component: Perfil });

function Perfil() {
  const { state, logout } = useStore();
  const nav = useNavigate();
  useEffect(() => { if (!state.user) nav({ to: "/" }); }, [state.user, nav]);

  const today = new Date(); today.setHours(0,0,0,0);
  const isToday = (t: number) => t >= today.getTime();
  const domToday = state.domicilios.filter(d => isToday(d.criadoEm));
  const pend = state.domicilios.filter(d => d.syncStatus === "pending").length;
  const ultimo = state.domicilios[0];

  const porRua = useMemo(() => {
    const map: Record<string, { rua: string; dom: number; risco: number; estab: number }> = {};
    state.ruas.forEach(r => map[r.id] = { rua: r.nome, dom: 0, risco: 0, estab: 0 });
    domToday.forEach(d => map[d.ruaId] && (map[d.ruaId].dom++));
    state.pontosRisco.filter(p => isToday(p.criadoEm)).forEach(p => map[p.ruaId] && (map[p.ruaId].risco++));
    state.estabelecimentos.filter(e => isToday(e.criadoEm)).forEach(e => map[e.ruaId] && (map[e.ruaId].estab++));
    return Object.values(map).filter(r => r.dom + r.risco + r.estab > 0);
  }, [state]);

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <StatusBar online={state.online} />
        <div className="px-6 pt-2 pb-4">
          <button onClick={() => nav({ to: "/painel" })} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mb-3">
            <ChevronLeft className="w-4 h-4" /> Início
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl text-primary-foreground flex items-center justify-center text-2xl font-extrabold shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-primary)" }}>
              {state.user?.nome?.[0]}
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">{state.user?.nome}</h1>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" /> Resumo de hoje
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ResumoCard icon={HomeIcon} label="Cadastros feitos" value={domToday.length} tone="primary" />
            <ResumoCard icon={Send} label="Pendentes de envio" value={pend} tone="warning" />
            <ResumoCard icon={AlertTriangle} label="Pontos de risco" value={state.pontosRisco.filter(p => isToday(p.criadoEm)).length} tone="warning" />
            <ResumoCard icon={Building2} label="Estabelecimentos" value={state.estabelecimentos.filter(e => isToday(e.criadoEm)).length} tone="success" />
          </div>

          <div className="rounded-2xl bg-card border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Último cadastro</p>
            <p className="font-bold mt-1">{ultimo ? `Casa nº ${ultimo.numero}` : "Nenhum cadastro ainda"}</p>
            {ultimo && <p className="text-xs text-muted-foreground">{state.ruas.find(r => r.id === ultimo.ruaId)?.nome}</p>}
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">Por rua (hoje)</p>
          <div className="space-y-2">
            {porRua.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sem atividade hoje.</p>}
            {porRua.map(r => (
              <div key={r.rua} className="rounded-2xl bg-card border border-border p-4">
                <p className="font-bold text-sm mb-2">{r.rua}</p>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1"><HomeIcon className="w-3 h-3 text-primary" /> {r.dom} dom.</span>
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-warning" /> {r.risco} risco</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-success" /> {r.estab} local</span>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={() => { logout(); nav({ to: "/" }); }} className="w-full h-12 rounded-2xl mt-4 text-destructive border-destructive/30 hover:bg-destructive/5">
            <LogOut className="w-4 h-4" /> Sair da conta
          </Button>
        </div>
        <BottomNav />
      </div>
    </PhoneFrame>
  );
}

function ResumoCard({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "primary" | "warning" | "success" }) {
  const map = { primary: "bg-primary-soft text-primary", warning: "bg-warning/15 text-warning", success: "bg-success/15 text-success" };
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className={`w-9 h-9 rounded-xl ${map[tone]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-[11px] text-muted-foreground font-semibold">{label}</p>
    </div>
  );
}
