import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Domicilio = {
  id: string;
  ruaId: string;
  numero: string;
  complemento?: string;
  referencia?: string;
  gps?: { lat: number; lng: number };
  tipoImovel?: string;
  moradores: number;
  savassi: { acamado: boolean; desemprego: boolean; relacaoMoradorComodo: boolean; analfabeto: boolean; menor6m: boolean; idoso: boolean; gestante: boolean; deficiencia: boolean };
  riscos: { focoMosquito: boolean; lixo: boolean; aguaParada: boolean; animais: boolean; quintalSujo: boolean };
  observacoes?: string;
  vulnerabilidade?: "Baixa" | "Média" | "Alta";
  syncStatus: "pending" | "sent" | "failed";
  criadoEm: number;
};

export type Estabelecimento = {
  id: string;
  ruaId: string;
  nome: string;
  tipo: string;
  gps?: { lat: number; lng: number };
  syncStatus: "pending" | "sent" | "failed";
  criadoEm: number;
};

export type PontoRisco = {
  id: string;
  ruaId: string;
  descricao: string;
  tipo: string;
  gps?: { lat: number; lng: number };
  syncStatus: "pending" | "sent" | "failed";
  criadoEm: number;
};

export type Rua = { id: string; nome: string; bairro: string };

type State = {
  user: { nome: string; cpf: string } | null;
  online: boolean;
  sincronizadoInicial: boolean;
  ruas: Rua[];
  domicilios: Domicilio[];
  estabelecimentos: Estabelecimento[];
  pontosRisco: PontoRisco[];
};

const RUAS_MOCK: Rua[] = [
  { id: "r1", nome: "Rua das Acácias", bairro: "Savassi" },
  { id: "r2", nome: "Rua dos Ipês", bairro: "Savassi" },
  { id: "r3", nome: "Rua das Palmeiras", bairro: "Funcionários" },
  { id: "r4", nome: "Av. Brasil", bairro: "Funcionários" },
];

const initial: State = {
  user: null,
  online: true,
  sincronizadoInicial: false,
  ruas: [],
  domicilios: [],
  estabelecimentos: [],
  pontosRisco: [],
};

type Ctx = {
  state: State;
  set: (fn: (s: State) => State) => void;
  login: (cpf: string) => void;
  logout: () => void;
  sincronizarInicial: () => Promise<void>;
  enviarPendentes: () => Promise<{ ok: number; fail: number }>;
  toggleOnline: () => void;
  addDomicilio: (d: Omit<Domicilio, "id" | "syncStatus" | "criadoEm">) => Domicilio;
  addEstabelecimento: (e: Omit<Estabelecimento, "id" | "syncStatus" | "criadoEm">) => void;
  addPontoRisco: (p: Omit<PontoRisco, "id" | "syncStatus" | "criadoEm">) => void;
};

const C = createContext<Ctx | null>(null);
const KEY = "tsus_state_v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const set = (fn: (s: State) => State) => setState(fn);

  const value: Ctx = {
    state,
    set,
    login: (cpf) => set((s) => ({ ...s, user: { nome: "Ana Souza", cpf } })),
    logout: () => {
      localStorage.removeItem(KEY);
      setState(initial);
    },
    toggleOnline: () => set((s) => ({ ...s, online: !s.online })),
    sincronizarInicial: async () => {
      await new Promise((r) => setTimeout(r, 1500));
      set((s) => ({ ...s, ruas: RUAS_MOCK, sincronizadoInicial: true }));
    },
    enviarPendentes: async () => {
      await new Promise((r) => setTimeout(r, 1800));
      let ok = 0;
      let fail = 0;
      const mark = <T extends { syncStatus: "pending" | "sent" | "failed" }>(arr: T[]) =>
        arr.map((it) => {
          if (it.syncStatus !== "pending") return it;
          const success = Math.random() > 0.1;
          if (success) ok++;
          else fail++;
          return { ...it, syncStatus: success ? ("sent" as const) : ("failed" as const) };
        });
      set((s) => ({
        ...s,
        domicilios: mark(s.domicilios),
        estabelecimentos: mark(s.estabelecimentos),
        pontosRisco: mark(s.pontosRisco),
      }));
      return { ok, fail };
    },
    addDomicilio: (d) => {
      const novo: Domicilio = { ...d, id: crypto.randomUUID(), syncStatus: "pending", criadoEm: Date.now() };
      set((s) => ({ ...s, domicilios: [novo, ...s.domicilios] }));
      return novo;
    },
    addEstabelecimento: (e) =>
      set((s) => ({
        ...s,
        estabelecimentos: [{ ...e, id: crypto.randomUUID(), syncStatus: "pending", criadoEm: Date.now() }, ...s.estabelecimentos],
      })),
    addPontoRisco: (p) =>
      set((s) => ({
        ...s,
        pontosRisco: [{ ...p, id: crypto.randomUUID(), syncStatus: "pending", criadoEm: Date.now() }, ...s.pontosRisco],
      })),
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useStore() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function calcularVulnerabilidade(s: Domicilio["savassi"]): "Baixa" | "Média" | "Alta" {
  const score = Object.values(s).filter(Boolean).length;
  if (score >= 4) return "Alta";
  if (score >= 2) return "Média";
  return "Baixa";
}
