// src/constants/index.ts
// =====================================================
// Constantes do TerritorializaSUS — Fase 1
// =====================================================

import type {
  SavassiAnswers,
  RiskAnswers,
  EstablishmentType,
  RiskPointType,
  PropertyType,
  MockUser,
} from '@/types';

// ---- Escala de Risco Familiar de Coelho-Savassi ----
// Extraída do protótipo: prototype/src/routes/painel.rua.$ruaId_.novo.tsx

export const SAVASSI_ITEMS: Array<{ key: keyof SavassiAnswers; label: string }> = [
  { key: 'acamado', label: 'Pessoa acamada no domicílio' },
  { key: 'desemprego', label: 'Adulto desempregado' },
  { key: 'relacaoMoradorComodo', label: 'Mais de 1 morador por cômodo' },
  { key: 'analfabeto', label: 'Analfabetismo no domicílio' },
  { key: 'menor6m', label: 'Criança menor de 6 meses' },
  { key: 'idoso', label: 'Idoso > 70 anos' },
  { key: 'gestante', label: 'Gestante' },
  { key: 'deficiencia', label: 'Pessoa com deficiência' },
];

export const SAVASSI_INITIAL: SavassiAnswers = {
  acamado: false,
  desemprego: false,
  relacaoMoradorComodo: false,
  analfabeto: false,
  menor6m: false,
  idoso: false,
  gestante: false,
  deficiencia: false,
};

// ---- Riscos ambientais ----
// Extraído do protótipo: prototype/src/routes/painel.rua.$ruaId_.novo.tsx

export const RISK_ITEMS: Array<{ key: keyof RiskAnswers; label: string; icon: string }> = [
  { key: 'focoMosquito', label: 'Foco de mosquito', icon: 'bug' },
  { key: 'lixo', label: 'Lixo acumulado', icon: 'trash-2' },
  { key: 'aguaParada', label: 'Água parada', icon: 'droplet' },
  { key: 'animais', label: 'Animais soltos', icon: 'github' }, // closest feather icon
  { key: 'quintalSujo', label: 'Quintal sujo / mato alto', icon: 'cloud' },
];

export const RISK_INITIAL: RiskAnswers = {
  focoMosquito: false,
  lixo: false,
  aguaParada: false,
  animais: false,
  quintalSujo: false,
};

// ---- Tipos de estabelecimento ----
// Extraído do protótipo: prototype/src/routes/painel.rua.$ruaId.tsx

export const ESTABLISHMENT_TYPES: EstablishmentType[] = [
  'Igreja',
  'Escola',
  'Comércio',
  'UBS',
  'Outro',
];

// ---- Tipos de ponto de risco ----
// Extraído do protótipo: prototype/src/routes/painel.rua.$ruaId.tsx

export const RISK_POINT_TYPES: RiskPointType[] = [
  'Lixo acumulado',
  'Esgoto a céu aberto',
  'Terreno baldio',
  'Foco de mosquito',
  'Outro',
];

// ---- Tipos de imóvel ----
// Extraído do protótipo: prototype/src/routes/painel.rua.$ruaId_.novo.tsx

export const PROPERTY_TYPES: PropertyType[] = [
  'Casa',
  'Apartamento',
  'Cômodo',
  'Outro',
];

// ---- Usuário mockado de desenvolvimento ----

export const MOCK_USER: MockUser = {
  id: 'dev-user-001',
  name: 'Ana Souza',
  cpf: '12345678901',
  role: 'agente',
};

// ---- Dados mockados para primeira sincronização ----

export const MOCK_ZONES = [
  { id: 'zone-001', name: 'Zona Norte' },
  { id: 'zone-002', name: 'Zona Sul' },
];

export const MOCK_NEIGHBORHOODS = [
  { id: 'neigh-001', name: 'Savassi', zoneId: 'zone-001' },
  { id: 'neigh-002', name: 'Funcionários', zoneId: 'zone-001' },
  { id: 'neigh-003', name: 'Serra', zoneId: 'zone-002' },
];

export const MOCK_STREETS = [
  { id: 'street-001', name: 'Rua das Acácias', neighborhoodId: 'neigh-001' },
  { id: 'street-002', name: 'Rua dos Ipês', neighborhoodId: 'neigh-001' },
  { id: 'street-003', name: 'Rua das Palmeiras', neighborhoodId: 'neigh-002' },
  { id: 'street-004', name: 'Av. Brasil', neighborhoodId: 'neigh-002' },
  { id: 'street-005', name: 'Rua do Ouro', neighborhoodId: 'neigh-003' },
  { id: 'street-006', name: 'Rua Espírito Santo', neighborhoodId: 'neigh-003' },
];

export const MOCK_ASSIGNMENTS = [
  { id: 'assign-001', streetId: 'street-001', userId: 'dev-user-001' },
  { id: 'assign-002', streetId: 'street-002', userId: 'dev-user-001' },
  { id: 'assign-003', streetId: 'street-003', userId: 'dev-user-001' },
  { id: 'assign-004', streetId: 'street-004', userId: 'dev-user-001' },
  { id: 'assign-005', streetId: 'street-005', userId: 'dev-user-001' },
  { id: 'assign-006', streetId: 'street-006', userId: 'dev-user-001' },
];

// ---- Debounce ----

export const AUTO_SAVE_DEBOUNCE_MS = 800;

// ---- Simulação de sync ----

export const SYNC_SIMULATION_DELAY_MS = 1800;
export const SYNC_SUCCESS_RATE = 0.9; // 90% de sucesso na simulação
