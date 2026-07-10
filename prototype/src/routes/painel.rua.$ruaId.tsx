import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { StatusBar } from "@/components/app/PhoneFrame";
import { ChevronLeft, Building2, AlertTriangle, Plus, MapPin, Home as HomeIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/rua/$ruaId")({ component: RuaPage });

function fakeGPS() {
  return { lat: -19.9 + Math.random() * 0.05, lng: -43.93 + Math.random() * 0.05 };
}

function RuaPage() {
  const { ruaId } = Route.useParams();
  const { state, addEstabelecimento, addPontoRisco } = useStore();
  const nav = useNavigate();
  const rua = state.ruas.find(r => r.id === ruaId);
  const domicilios = state.domicilios.filter(d => d.ruaId === ruaId);
  const estabs = state.estabelecimentos.filter(e => e.ruaId === ruaId);
  const riscos = state.pontosRisco.filter(p => p.ruaId === ruaId);

  const [openEst, setOpenEst] = useState(false);
  const [openRisco, setOpenRisco] = useState(false);

  if (!rua) return <div className="p-8">Rua não encontrada.</div>;

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar online={state.online} />
      <div className="px-6 pt-2 pb-4">
        <button onClick={() => nav({ to: "/painel/atribuicoes" })} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mb-3">
          <ChevronLeft className="w-4 h-4" /> Atribuições
        </button>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{rua.bairro}</p>
        <h1 className="text-2xl font-extrabold tracking-tight">{rua.nome}</h1>
        <div className="flex gap-2 mt-3">
          <Chip icon={HomeIcon} label={`${domicilios.length} domicílios`} />
          <Chip icon={Building2} label={`${estabs.length} locais`} />
          <Chip icon={AlertTriangle} label={`${riscos.length} riscos`} />
        </div>
      </div>

      <div className="px-6 pb-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">Ações no entorno</p>
        <div className="grid grid-cols-2 gap-3">
          <ActionCard icon={Building2} title="Estabelecimento" desc="Igreja, escola, comércio" tone="success" onClick={() => setOpenEst(true)} />
          <ActionCard icon={AlertTriangle} title="Ponto de risco" desc="Lixo, esgoto, foco" tone="warning" onClick={() => setOpenRisco(true)} />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4">Domicílios</p>
        <Link to="/painel/rua/$ruaId/novo" params={{ ruaId }}
          className="flex items-center gap-3 p-4 rounded-2xl text-primary-foreground shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-primary)" }}>
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Novo domicílio</p>
            <p className="text-xs text-primary-foreground/85">Cadastrar uma casa nesta rua</p>
          </div>
        </Link>

        <div className="space-y-2 mt-2">
          {domicilios.map(d => (
            <div key={d.id} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <HomeIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Casa nº {d.numero}</p>
                <p className="text-xs text-muted-foreground">{d.moradores} moradores · Vulnerab. {d.vulnerabilidade}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                d.syncStatus === "sent" ? "bg-success/15 text-success" :
                d.syncStatus === "failed" ? "bg-destructive/15 text-destructive" : "bg-warning/20 text-warning"
              }`}>{d.syncStatus === "sent" ? "Enviado" : d.syncStatus === "failed" ? "Falhou" : "Pendente"}</span>
            </div>
          ))}
          {estabs.map(e => (
            <div key={e.id} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary">
              <Building2 className="w-4 h-4 text-success" />
              <div className="flex-1 text-sm"><b>{e.nome}</b> <span className="text-muted-foreground">· {e.tipo}</span></div>
            </div>
          ))}
          {riscos.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <div className="flex-1 text-sm"><b>{p.tipo}</b> <span className="text-muted-foreground">· {p.descricao}</span></div>
            </div>
          ))}
        </div>
      </div>

      <EstabDialog open={openEst} onOpenChange={setOpenEst} onSave={(nome, tipo) => {
        addEstabelecimento({ ruaId, nome, tipo, gps: fakeGPS() });
        toast.success("Estabelecimento registrado");
        setOpenEst(false);
      }} />
      <RiscoDialog open={openRisco} onOpenChange={setOpenRisco} onSave={(tipo, descricao) => {
        addPontoRisco({ ruaId, tipo, descricao, gps: fakeGPS() });
        toast.success("Ponto de risco registrado");
        setOpenRisco(false);
      }} />
    </div>
  );
}

function Chip({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-semibold">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />{label}
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, tone, onClick }: { icon: any; title: string; desc: string; tone: "warning" | "success"; onClick: () => void }) {
  const bg = tone === "warning" ? "bg-warning/15 text-warning" : "bg-success/15 text-success";
  return (
    <button onClick={onClick} className="text-left p-4 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] active:scale-[0.98]">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-bold text-sm">{title}</p>
      <p className="text-[11px] text-muted-foreground">{desc}</p>
      <p className="text-[10px] mt-2 flex items-center gap-1 text-primary font-semibold"><MapPin className="w-3 h-3" /> Captura GPS automática</p>
    </button>
  );
}

function EstabDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (b: boolean) => void; onSave: (nome: string, tipo: string) => void }) {
  const [nome, setNome] = useState(""); const [tipo, setTipo] = useState("Igreja");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Novo estabelecimento</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nome</Label><Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex.: Escola Municipal" className="h-12 rounded-xl" /></div>
          <div><Label>Tipo</Label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full h-12 rounded-xl bg-secondary px-3 text-sm">
              <option>Igreja</option><option>Escola</option><option>Comércio</option><option>UBS</option><option>Outro</option>
            </select>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> GPS será capturado automaticamente.</div>
          <Button onClick={() => nome && onSave(nome, tipo)} className="w-full h-12 rounded-xl">Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RiscoDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (b: boolean) => void; onSave: (tipo: string, descricao: string) => void }) {
  const [descricao, setDescricao] = useState(""); const [tipo, setTipo] = useState("Lixo acumulado");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Novo ponto de risco</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Tipo</Label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full h-12 rounded-xl bg-secondary px-3 text-sm">
              <option>Lixo acumulado</option><option>Esgoto a céu aberto</option><option>Terreno baldio</option><option>Foco de mosquito</option><option>Outro</option>
            </select>
          </div>
          <div><Label>Descrição</Label><Textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes da ameaça" className="rounded-xl" /></div>
          <Button onClick={() => onSave(tipo, descricao)} className="w-full h-12 rounded-xl">Registrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
