// src/types/index.ts
// =====================================================
// Tipos centrais do TerritorializaSUS — Fase 1
// =====================================================

/** Status de sincronização de um registro */
export type SyncStatus = 'draft' | 'pending' | 'syncing' | 'synced' | 'error' | 'conflict';

/** Status da captura de localização */
export type LocationStatus = 'captured' | 'permission_denied' | 'unavailable' | 'not_requested';

/** Tipo de imóvel */
export type PropertyType = 'Casa' | 'Apartamento' | 'Cômodo' | 'Outro';

/** Tipo de estabelecimento */
export type EstablishmentType = 'Igreja' | 'Escola' | 'Comércio' | 'UBS' | 'Outro';

/** Tipo de ponto de risco */
export type RiskPointType =
  | 'Lixo acumulado'
  | 'Esgoto a céu aberto'
  | 'Terreno baldio'
  | 'Foco de mosquito'
  | 'Outro';

/** Classificação de vulnerabilidade (Escala Coelho-Savassi simplificada) */
export type VulnerabilityClassification = 'Baixa' | 'Média' | 'Alta';

// ---- Formulários ----

export interface SavassiAnswers {
  acamado: boolean;
  desemprego: boolean;
  relacaoMoradorComodo: boolean;
  analfabeto: boolean;
  menor6m: boolean;
  idoso: boolean;
  gestante: boolean;
  deficiencia: boolean;
}

export interface RiskAnswers {
  focoMosquito: boolean;
  lixo: boolean;
  aguaParada: boolean;
  animais: boolean;
  quintalSujo: boolean;
}

export interface SavassiResult {
  score: number;
  classification: VulnerabilityClassification;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  capturedAt: number | null;
  locationStatus: LocationStatus;
}

export interface HouseholdFormData {
  streetId: string;
  numero: string;
  semNumero: boolean;
  complemento: string;
  referencia: string;
  tipoImovel: PropertyType;
  moradores: number;
  savassi: SavassiAnswers;
  riscos: RiskAnswers;
  observacoes: string;
}

export interface EstablishmentFormData {
  streetId: string;
  nome: string;
  tipo: EstablishmentType;
}

export interface RiskPointFormData {
  streetId: string;
  tipo: RiskPointType;
  descricao: string;
}

// ---- Dados de sincronização ----

export interface PullAssignmentsResult {
  zones: Array<{ id: string; name: string }>;
  neighborhoods: Array<{ id: string; name: string; zoneId: string }>;
  streets: Array<{ id: string; name: string; neighborhoodId: string }>;
  assignments: Array<{ id: string; streetId: string; userId: string }>;
}

export interface PushRecordsResult {
  ok: number;
  fail: number;
}

// ---- Usuário ----

export interface MockUser {
  id: string;
  name: string;
  cpf: string;
  role: string;
}

// ---- Navegação ----

export interface StreetWithNeighborhood {
  id: string;
  name: string;
  neighborhoodName: string;
  neighborhoodId: string;
}
