// src/services/SynchronizationService.ts
// =====================================================
// Sincronização provisória — Fase 1 (AGENTS.md §13, §14)
// =====================================================

import { AssignmentRepository } from '@/repositories/AssignmentRepository';
import { HouseholdRepository } from '@/repositories/HouseholdRepository';
import { EstablishmentRepository } from '@/repositories/EstablishmentRepository';
import { RiskPointRepository } from '@/repositories/RiskPointRepository';
import { MetadataRepository } from '@/repositories/MetadataRepository';
import { MockSyncGateway } from '@/gateways/MockSyncGateway';
import type { PushRecordsResult } from '@/types';

const gateway = new MockSyncGateway();

export const SynchronizationService = {
  /**
   * Primeira sincronização — puxa zonas, bairros, ruas e atribuições.
   * Usa MockSyncGateway na Fase 1 (AGENTS.md §13).
   */
  async pullInitialAssignments(): Promise<void> {
    const data = await gateway.pullAssignments();
    await AssignmentRepository.saveAssignments(data);
    await MetadataRepository.setLastSyncDate(new Date().toISOString());
  },

  /**
   * Sincronização final — envia registros pending/error.
   * Simula envio na Fase 1 (AGENTS.md §14).
   */
  async pushPendingRecords(): Promise<PushRecordsResult> {
    let ok = 0;
    let fail = 0;

    // Buscar todos os pendentes
    const [households, establishments, riskPoints] = await Promise.all([
      HouseholdRepository.findPending(),
      EstablishmentRepository.findPending(),
      RiskPointRepository.findPending(),
    ]);

    // Marcar todos como syncing
    const allRecords = [
      ...households.map((h) => ({ id: h.id, type: 'household' as const, repo: HouseholdRepository })),
      ...establishments.map((e) => ({ id: e.id, type: 'establishment' as const, repo: EstablishmentRepository })),
      ...riskPoints.map((r) => ({ id: r.id, type: 'risk_point' as const, repo: RiskPointRepository })),
    ];

    for (const record of allRecords) {
      await record.repo.update(record.id, { appSyncStatus: 'syncing' });
    }

    // Simular envio de cada registro
    for (const record of allRecords) {
      const success = await gateway.pushSingleRecord();

      if (success) {
        ok++;
        await record.repo.update(record.id, {
          appSyncStatus: 'synced',
          syncAttempts: 1,
          lastSyncError: null,
        });
      } else {
        fail++;
        await record.repo.update(record.id, {
          appSyncStatus: 'error',
          syncAttempts: 1,
          lastSyncError: 'Falha na conexão com o servidor (simulado)',
        });
      }
    }

    return { ok, fail };
  },

  /**
   * Conta registros pendentes de envio.
   */
  async countPending(): Promise<number> {
    const [households, establishments, riskPoints] = await Promise.all([
      HouseholdRepository.findPending(),
      EstablishmentRepository.findPending(),
      RiskPointRepository.findPending(),
    ]);
    return households.length + establishments.length + riskPoints.length;
  },

  /**
   * Retorna a data da última sincronização.
   */
  async getLastSyncDate(): Promise<string | null> {
    return MetadataRepository.getLastSyncDate();
  },
};
