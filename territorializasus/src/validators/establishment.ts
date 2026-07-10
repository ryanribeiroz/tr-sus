// src/validators/establishment.ts
import { z } from 'zod';

export const establishmentSchema = z.object({
  nome: z.string().min(1, 'Informe o nome do estabelecimento'),
  tipo: z.string().min(1, 'Selecione o tipo'),
});

export type EstablishmentValidatedData = z.infer<typeof establishmentSchema>;
