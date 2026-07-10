import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { StatusBar } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { CloudDownload, MapPin, Home as HomeIcon, AlertTriangle, Building2, Wifi, WifiOff, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/")({ component: PainelHome });

function PainelHome() {
  const { state, sincronizarInicial, toggleOnline } = useStore();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const pendentes = state.domicilios.filter(d => d.syncStatus === "pending").length
    + state.estabelecimentos.filter(e => e.syncStatus === "pending").length
    + state.pontosRisco.filter(p => p.syncStatus === "pending").length;

  const sincronizar = async () => {
    if (!state.online) { toast.error("Você está offline. Conecte-se à internet."); return; }
    setLoading(true);
    await sincronizarInicial();
    setLoading(false);
    toast.success("Atribuições baixadas com sucesso");
    nav({ to: "/painel/atribuicoes" });
  };

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar online={state.online} />
      <div className="px-6 pt-2 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Olá, agente</p>
            <h1 className="text-2xl font-extrabold tracking-tight">{state.user?.nome}</h1>
          </div>
          <button onClick={toggleOnline} className={`p-3 rounded-2xl ${state.online ? "bg-success/15 text-success" : "bg-warning/20 text-warning"}`}>
            {state.online ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {!state.sincronizadoInicial ? (
          <div className="rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-primary)" }}>
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
              <CloudDownload className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold leading-tight">Nenhuma atribuição baixada</h2>
            <p className="text-sm text-primary-foreground/85 mt-2">
              Antes de sair para o campo, sincronize para baixar as ruas e bairros do seu turno.
            </p>
            <Button onClick={sincronizar} disabled={loading}
              className="w-full h-12 mt-5 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sincronizando...</> : <><CloudDownload className="w-4 h-4" /> Sincronizar agora</>}
            </Button>
          </div>
        ) : (
          <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Hoje no território</p>
                <p className="text-lg font-bold mt-0.5">{state.ruas.length} ruas atribuídas</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => nav({ to: "/painel/atribuicoes" })}>Ver <ChevronRight className="w-4 h-4" /></Button>
            </div>
            <Button onClick={sincronizar} disabled={loading} variant="outline" className="w-full h-11 rounded-xl">
              <CloudDownload className="w-4 h-4" /> Atualizar lista
            </Button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Stat icon={HomeIcon} label="Domicílios" value={state.domicilios.length} tone="primary" />
          <Stat icon={AlertTriangle} label="Riscos" value={state.pontosRisco.length} tone="warning" />
          <Stat icon={Building2} label="Locais" value={state.estabelecimentos.length} tone="success" />
        </div>

        {pendentes > 0 && (
          <button onClick={() => nav({ to: "/sincronizar" })}
            className="w-full rounded-2xl bg-warning/15 border border-warning/30 p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/25 text-warning flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{pendentes} cadastro{pendentes > 1 ? "s" : ""} na fila</p>
                <p className="text-xs text-muted-foreground">Toque para sincronizar com o servidor</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

        {state.sincronizadoInicial && (
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Próximos passos</p>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Abra <b>Trabalho</b> e selecione a rua para começar.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "primary" | "warning" | "success" }) {
  const map = { primary: "bg-primary-soft text-primary", warning: "bg-warning/15 text-warning", success: "bg-success/15 text-success" };
  return (
    <div className="rounded-2xl bg-card border border-border p-3 shadow-[var(--shadow-card)]">
      <div className={`w-9 h-9 rounded-xl ${map[tone]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
    </div>
  );
}
