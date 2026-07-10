// src/services/SavassiService.ts
// =====================================================
// Cálculo da Escala de Risco Familiar de Coelho-Savassi
// =====================================================
// Lógica extraída de: prototype/src/lib/store.tsx (calcularVulnerabilidade)
//
// Nota: O protótipo usa contagem simples (cada critério = 1 ponto).
// A escala original publicada usa pesos diferenciados.
// Conforme AGENTS.md §3, seguimos o protótipo.

import type { SavassiAnswers, SavassiResult, VulnerabilityClassification } from '@/types';

export const SavassiService = {
  /**
   * Calcula a pontuação e classificação da Escala Coelho-Savassi.
   * Conforme protótipo: contagem simples de critérios marcados.
   *
   * @param answers - Respostas booleanas dos 8 critérios
   * @returns { score, classification }
   */
  calculate(answers: SavassiAnswers): SavassiResult {
    const score = Object.values(answers).filter(Boolean).length;
    const classification = this.classify(score);
    return { score, classification };
  },

  /**
   * Classifica o score conforme faixas do protótipo:
   * 0–1 → Baixa
   * 2–3 → Média
   * 4+  → Alta
   */
  classify(score: number): VulnerabilityClassification {
    if (score >= 4) return 'Alta';
    if (score >= 2) return 'Média';
    return 'Baixa';
  },

  /**
   * Extrai SavassiAnswers a partir de campos flat do domicílio.
   */
  extractAnswersFromHousehold(household: {
    savassiAcamado: boolean;
    savassiDesemprego: boolean;
    savassiRelacaoMoradorComodo: boolean;
    savassiAnalfabeto: boolean;
    savassiMenor6m: boolean;
    savassiIdoso: boolean;
    savassiGestante: boolean;
    savassiDeficiencia: boolean;
  }): SavassiAnswers {
    return {
      acamado: household.savassiAcamado,
      desemprego: household.savassiDesemprego,
      relacaoMoradorComodo: household.savassiRelacaoMoradorComodo,
      analfabeto: household.savassiAnalfabeto,
      menor6m: household.savassiMenor6m,
      idoso: household.savassiIdoso,
      gestante: household.savassiGestante,
      deficiencia: household.savassiDeficiencia,
    };
  },
};
