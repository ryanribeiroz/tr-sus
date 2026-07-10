import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { PhoneFrame, StatusBar } from "@/components/app/PhoneFrame";
import { BottomNav } from "@/components/app/BottomNav";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, CloudUpload, Wifi, WifiOff, ChevronLeft, Home as HomeIcon, Building2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sincronizar")({ component: Sincronizar });

function Sincronizar() {
  const { state, enviarPendentes, toggleOnline } = useStore();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{ ok: number; fail: number } | null>(null);

  useEffect(() => { if (!state.user) nav({ to: "/" }); }, [state.user, nav]);

  const all = [
    ...state.domicilios.map(d => ({ id: d.id, label: `Casa nº ${d.numero}`, type: "Domicílio", status: d.syncStatus, icon: HomeIcon })),
    ...state.estabelecimentos.map(e => ({ id: e.id, label: e.nome, type: e.tipo, status: e.syncStatus, icon: Building2 })),
    ...state.pontosRisco.map(p => ({ id: p.id, label: p.tipo, type: "Risco", status: p.syncStatus, icon: AlertTriangle })),
  ];
  const pendentes = all.filter(i => i.status === "pending").length;

  const sincronizar = async () => {
    if (!state.online) { toast.error("Conecte-se à internet primeiro"); return; }
    setLoading(true);
    const r = await enviarPendentes();
    setLoading(false);
    setResultado(r);
    if (r.fail === 0) toast.success(`${r.ok} registro(s) enviados`);
    else toast.warning(`${r.ok} enviados, ${r.fail} falharam`);
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <StatusBar online={state.online} />
        <div className="px-6 pt-2 pb-4">
          <button onClick={() => nav({ to: "/painel" })} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mb-2">
            <ChevronLeft className="w-4 h-4" /> Início
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Sincronização</h1>
              <p className="text-sm text-muted-foreground">Envie tudo o que coletou no campo</p>
            </div>
            <button onClick={toggleOnline} className={`p-3 rounded-2xl ${state.online ? "bg-success/15 text-success" : "bg-warning/20 text-warning"}`}>
              {state.online ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4 flex-1">
          <div className="rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-primary)" }}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <CloudUpload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-3xl font-extrabold leading-none">{pendentes}</p>
                <p className="text-sm text-primary-foreground/85">na fila local</p>
              </div>
            </div>
            <Button onClick={sincronizar} disabled={loading || pendentes === 0}
              className="w-full h-12 mt-5 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : pendentes === 0 ? "Tudo sincronizado" : "Sincronizar agora"}
            </Button>
          </div>

          {resultado && resultado.fail === 0 && (
            <div className="rounded-2xl bg-success/15 border border-success/30 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div>
                <p className="font-bold text-success">Tudo certo com o servidor!</p>
                <p className="text-xs text-muted-foreground">{resultado.ok} registro(s) enviados com sucesso.</p>
              </div>
            </div>
          )}

          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">Status por registro</p>
          <div className="space-y-2">
            {all.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum cadastro feito ainda.</p>}
            {all.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.type}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </PhoneFrame>
  );
}

function StatusPill({ status }: { status: "pending" | "sent" | "failed" }) {
  if (status === "sent") return <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-success/15 text-success"><CheckCircle2 className="w-3 h-3" /> Enviado</span>;
  if (status === "failed") return <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-destructive/15 text-destructive"><XCircle className="w-3 h-3" /> Falha</span>;
  return <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-warning/20 text-warning"><Clock className="w-3 h-3" /> Pendente</span>;
}
