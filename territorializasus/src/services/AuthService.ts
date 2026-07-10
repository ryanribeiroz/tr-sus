// src/services/AuthService.ts
// =====================================================
// Autenticação provisória — Fase 1 (AGENTS.md §12)
// =====================================================

import { UserRepository } from '@/repositories/UserRepository';
import { SessionRepository } from '@/repositories/SessionRepository';
import { MOCK_USER } from '@/constants';

export const AuthService = {
  /**
   * Login provisório. Valida CPF contra usuário mockado.
   * Não salva senha no banco local (AGENTS.md §12).
   */
  async login(cpf: string, _password: string): Promise<{
    success: boolean;
    userId?: string;
    userName?: string;
    error?: string;
  }> {
    // Simular latência
    await new Promise((r) => setTimeout(r, 700));

    // Validação provisória: qualquer CPF com 11 dígitos é aceito
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      return { success: false, error: 'CPF inválido' };
    }

    // Criar ou buscar usuário mockado
    const user = await UserRepository.createOrUpdate({
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      cpf: cleanCpf,
      role: MOCK_USER.role,
    });

    // Criar sessão
    await SessionRepository.createSession(user.id);

    return {
      success: true,
      userId: user.id,
      userName: user.name,
    };
  },

  /**
   * Logout — desativa todas as sessões.
   */
  async logout(): Promise<void> {
    await SessionRepository.deactivateAll();
  },

  /**
   * Verifica se existe sessão ativa.
   */
  async getActiveSession(): Promise<{
    isAuthenticated: boolean;
    userId?: string;
    userName?: string;
  }> {
    const session = await SessionRepository.getActiveSession();
    if (!session) {
      return { isAuthenticated: false };
    }

    const user = await UserRepository.findById(session.userId);
    if (!user) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      userId: user.id,
      userName: user.name,
    };
  },
};
