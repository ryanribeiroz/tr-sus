import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { StatusBar } from "@/components/app/PhoneFrame";
import { MapPin, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/painel/atribuicoes")({ component: Atribuicoes });

function Atribuicoes() {
  const { state } = useStore();
  const [q, setQ] = useState("");

  const grupos = useMemo(() => {
    const filtered = state.ruas.filter(r =>
      r.nome.toLowerCase().includes(q.toLowerCase()) || r.bairro.toLowerCase().includes(q.toLowerCase()));
    const g: Record<string, typeof state.ruas> = {};
    filtered.forEach(r => { (g[r.bairro] ||= []).push(r); });
    return g;
  }, [state.ruas, q]);

  const countByRua = (id: string) => state.domicilios.filter(d => d.ruaId === id).length;

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar online={state.online} />
      <div className="px-6 pt-2 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Modo {state.online ? "online" : "offline"}</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Atribuições do dia</h1>
        <p className="text-sm text-muted-foreground mt-1">Toque na rua para iniciar a coleta no território.</p>
      </div>

      <div className="px-6 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar rua ou bairro"
            className="h-12 pl-11 rounded-2xl bg-secondary border-0" />
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {state.ruas.length === 0 && (
          <div className="rounded-3xl bg-secondary p-8 text-center">
            <p className="font-semibold">Nenhuma atribuição baixada ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">Volte ao início e sincronize.</p>
          </div>
        )}

        {Object.entries(grupos).map(([bairro, ruas]) => (
          <div key={bairro}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 rounded-full bg-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider">{bairro}</h2>
              <span className="text-xs text-muted-foreground">· {ruas.length}</span>
            </div>
            <div className="space-y-2.5">
              {ruas.map(r => (
                <Link key={r.id} to="/painel/rua/$ruaId" params={{ ruaId: r.id }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] active:scale-[0.99] transition">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{r.nome}</p>
                    <p className="text-xs text-muted-foreground">{countByRua(r.id)} domicílio(s) cadastrado(s)</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
