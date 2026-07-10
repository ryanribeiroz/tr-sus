// src/validators/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  cpf: z
    .string()
    .min(1, 'Informe o CPF')
    .refine(
      (val) => val.replace(/\D/g, '').length === 11,
      'CPF deve ter 11 dígitos'
    ),
  senha: z
    .string()
    .min(3, 'Senha deve ter pelo menos 3 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
