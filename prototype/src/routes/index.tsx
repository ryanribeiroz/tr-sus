import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame, StatusBar } from "@/components/app/PhoneFrame";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { Eye, EyeOff, Lock, IdCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Login });

function formatCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function Login() {
  const { state, login } = useStore();
  const nav = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (state.user) nav({ to: "/painel" }); }, [state.user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.replace(/\D/g, "").length < 11 || senha.length < 3) {
      toast.error("Preencha CPF e senha");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    login(cpf);
    toast.success("Acesso autorizado");
    nav({ to: "/painel" });
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="px-7 pt-8 pb-10 flex flex-col h-full min-h-[700px]">
        <div className="flex-1 flex flex-col">
          <Logo size="lg" />
          <div className="mt-12">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">Bem-vindo,<br/>agente de saúde</h1>
            <p className="text-muted-foreground mt-2 text-sm">Entre para acessar suas atribuições do dia.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CPF</Label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="cpf" inputMode="numeric" placeholder="000.000.000-00" value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  className="h-14 pl-11 rounded-2xl bg-secondary border-0 text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="senha" type={show ? "text" : "password"} placeholder="••••••••" value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-14 pl-11 pr-11 rounded-2xl bg-secondary border-0 text-base" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-[var(--shadow-elevated)]"
              style={{ background: "var(--gradient-primary)" }}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-auto pt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Conexão segura · Ministério da Saúde</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
