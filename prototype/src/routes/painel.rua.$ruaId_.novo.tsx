import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, calcularVulnerabilidade, type Domicilio } from "@/lib/store";
import { StatusBar } from "@/components/app/PhoneFrame";
import { ChevronLeft, MapPin, Save, Bug, Trash2, Droplets, Dog, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/rua/$ruaId_/novo")({ component: NovoDomicilio });

const SAVASSI_ITEMS: { key: keyof Domicilio["savassi"]; label: string }[] = [
  { key: "acamado", label: "Pessoa acamada no domicílio" },
  { key: "desemprego", label: "Adulto desempregado" },
  { key: "relacaoMoradorComodo", label: "Mais de 1 morador por cômodo" },
  { key: "analfabeto", label: "Analfabetismo no domicílio" },
  { key: "menor6m", label: "Criança menor de 6 meses" },
  { key: "idoso", label: "Idoso > 70 anos" },
  { key: "gestante", label: "Gestante" },
  { key: "deficiencia", label: "Pessoa com deficiência" },
];

const RISCOS_ITEMS: { key: keyof Domicilio["riscos"]; label: string; icon: any }[] = [
  { key: "focoMosquito", label: "Foco de mosquito", icon: Bug },
  { key: "lixo", label: "Lixo acumulado", icon: Trash2 },
  { key: "aguaParada", label: "Água parada", icon: Droplets },
  { key: "animais", label: "Animais soltos", icon: Dog },
  { key: "quintalSujo", label: "Quintal sujo / mato alto", icon: Trees },
];

function NovoDomicilio() {
  const { ruaId } = Route.useParams();
  const { state, addDomicilio } = useStore();
  const nav = useNavigate();
  const rua = state.ruas.find(r => r.id === ruaId);

  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Casa");
  const [moradores, setMoradores] = useState(1);
  const [savassi, setSavassi] = useState<Domicilio["savassi"]>({
    acamado: false, desemprego: false, relacaoMoradorComodo: false, analfabeto: false,
    menor6m: false, idoso: false, gestante: false, deficiencia: false,
  });
  const [riscos, setRiscos] = useState<Domicilio["riscos"]>({
    focoMosquito: false, lixo: false, aguaParada: false, animais: false, quintalSujo: false,
  });
  const [confirm, setConfirm] = useState(false);

  const handleSalvar = () => {
    if (!numero) { toast.error("Informe o número da casa"); return; }
    setConfirm(true);
  };

  const confirmar = () => {
    const vuln = calcularVulnerabilidade(savassi);
    addDomicilio({
      ruaId, numero, complemento, referencia, tipoImovel, moradores, savassi, riscos,
      vulnerabilidade: vuln,
      gps: { lat: -19.92 + Math.random() * 0.05, lng: -43.93 + Math.random() * 0.05 },
    });
    toast.success(`Casa nº ${numero} salva no aparelho`);
    nav({ to: "/painel/rua/$ruaId", params: { ruaId } });
  };

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar online={state.online} />
      <div className="px-6 pt-2 pb-3">
        <button onClick={() => nav({ to: "/painel/rua/$ruaId", params: { ruaId } })} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mb-2">
          <ChevronLeft className="w-4 h-4" /> {rua?.nome}
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight">Cadastro de domicílio</h1>
        <p className="text-sm text-muted-foreground">Casa {numero || "—"} · {moradores} morador{moradores > 1 ? "es" : ""}</p>
      </div>

      <div className="px-6 pb-32 space-y-6">
        <Section step="1" title="Identificação do domicílio">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Número *"><Input value={numero} onChange={e => setNumero(e.target.value)} inputMode="numeric" placeholder="145" /></Field>
            <Field label="Complemento"><Input value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Fundos / Apto" /></Field>
          </div>
          <Field label="Referência"><Input value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Próximo à padaria" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de imóvel">
              <select value={tipoImovel} onChange={e => setTipoImovel(e.target.value)} className="w-full h-12 rounded-xl bg-secondary px-3 text-sm">
                <option>Casa</option><option>Apartamento</option><option>Cômodo</option><option>Outro</option>
              </select>
            </Field>
            <Field label="Moradores"><Input type="number" min={1} value={moradores} onChange={e => setMoradores(Number(e.target.value) || 1)} /></Field>
          </div>
          <div className="rounded-2xl bg-primary-soft p-3 flex items-center gap-2 text-xs text-primary font-semibold">
            <MapPin className="w-4 h-4" /> GPS capturado automaticamente ao salvar
          </div>
        </Section>

        <Section step="2" title="Escala de Savassi" hint="Marque os indicadores que se aplicam à família.">
          <div className="space-y-2">
            {SAVASSI_ITEMS.map(it => (
              <label key={it.key} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary cursor-pointer">
                <Checkbox checked={savassi[it.key]} onCheckedChange={(v) => setSavassi(s => ({ ...s, [it.key]: !!v }))} />
                <span className="text-sm font-medium">{it.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section step="3" title="Riscos">
          <div className="grid grid-cols-2 gap-2">
            {RISCOS_ITEMS.map(it => {
              const active = riscos[it.key];
              return (
                <button key={it.key} type="button" onClick={() => setRiscos(r => ({ ...r, [it.key]: !r[it.key] }))}
                  className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition text-left ${active ? "border-warning bg-warning/10" : "border-border bg-card"}`}>
                  <it.icon className={`w-4 h-4 ${active ? "text-warning" : "text-muted-foreground"}`} />
                  <span className="text-xs font-semibold">{it.label}</span>
                </button>
              );
            })}
          </div>
        </Section>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
        <Button onClick={handleSalvar} className="w-full h-14 rounded-2xl text-base font-bold shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-primary)" }}>
          <Save className="w-4 h-4" /> Salvar cadastro
        </Button>
      </div>

      <Dialog open={confirm} onOpenChange={(o) => !o && setConfirm(false)}>
        <DialogContent className="rounded-3xl">
          <div className="text-center py-2">
            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3 bg-primary-soft text-primary">
              <Save className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold">Confirmar cadastro</h3>
            <p className="text-sm text-muted-foreground mt-1">Casa nº {numero} · {moradores} moradores</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" className="h-12 rounded-xl" onClick={() => setConfirm(false)}>Revisar</Button>
              <Button className="h-12 rounded-xl" onClick={confirmar}>Confirmar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ step, title, hint, children }: { step: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm font-extrabold">{step}</div>
        <div>
          <h2 className="font-bold leading-tight">{title}</h2>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="[&>input]:h-12 [&>input]:rounded-xl [&>input]:bg-secondary [&>input]:border-0 [&>input]:px-4">{children}</div>
    </div>
  );
}
