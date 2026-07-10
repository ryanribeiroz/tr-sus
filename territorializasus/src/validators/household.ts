// src/validators/household.ts
import { z } from 'zod';

export const householdSchema = z.object({
  numero: z.string().min(1, 'Informe o número da casa'),
  semNumero: z.boolean().default(false),
  complemento: z.string().default(''),
  referencia: z.string().default(''),
  tipoImovel: z.string().default('Casa'),
  moradores: z.number().min(1, 'Mínimo 1 morador').default(1),
  // Savassi — todos opcionais (boolean)
  savassiAcamado: z.boolean().default(false),
  savassiDesemprego: z.boolean().default(false),
  savassiRelacaoMoradorComodo: z.boolean().default(false),
  savassiAnalfabeto: z.boolean().default(false),
  savassiMenor6m: z.boolean().default(false),
  savassiIdoso: z.boolean().default(false),
  savassiGestante: z.boolean().default(false),
  savassiDeficiencia: z.boolean().default(false),
  // Riscos
  riscoFocoMosquito: z.boolean().default(false),
  riscoLixo: z.boolean().default(false),
  riscoAguaParada: z.boolean().default(false),
  riscoAnimais: z.boolean().default(false),
  riscoQuintalSujo: z.boolean().default(false),
  // Observações
  observacoes: z.string().default(''),
}).refine(
  (data) => data.semNumero || data.numero.length > 0,
  { message: 'Informe o número ou marque "Sem número"', path: ['numero'] }
);

export type HouseholdValidatedData = z.infer<typeof householdSchema>;
