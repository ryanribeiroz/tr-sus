// src/validators/riskPoint.ts
import { z } from 'zod';

export const riskPointSchema = z.object({
  tipo: z.string().min(1, 'Selecione o tipo de risco'),
  descricao: z.string().default(''),
});

export type RiskPointValidatedData = z.infer<typeof riskPointSchema>;
