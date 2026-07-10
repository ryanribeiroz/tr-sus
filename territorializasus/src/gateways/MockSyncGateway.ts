// src/gateways/MockSyncGateway.ts
// =====================================================
// Implementação mockada para Fase 1 (AGENTS.md §13)
// =====================================================

import type { SyncGateway } from './SyncGateway';
import type { PullAssignmentsResult, PushRecordsResult } from '@/types';
import {
  MOCK_ZONES,
  MOCK_NEIGHBORHOODS,
  MOCK_STREETS,
  MOCK_ASSIGNMENTS,
  SYNC_SIMULATION_DELAY_MS,
  SYNC_SUCCESS_RATE,
} from '@/constants';

export class MockSyncGateway implements SyncGateway {
  async pullAssignments(): Promise<PullAssignmentsResult> {
    // Simula latência de rede
    await new Promise((r) => setTimeout(r, 1500));

    return {
      zones: MOCK_ZONES,
      neighborhoods: MOCK_NEIGHBORHOODS,
      streets: MOCK_STREETS,
      assignments: MOCK_ASSIGNMENTS,
    };
  }

  async pushPendingRecords(): Promise<PushRecordsResult> {
    // Simula envio com latência
    await new Promise((r) => setTimeout(r, SYNC_SIMULATION_DELAY_MS));

    // Conta como se estivesse processando — na prática, o service
    // controla o fluxo real de marcar registros como synced/error
    return { ok: 0, fail: 0 };
  }

  /**
   * Simula o envio de um único registro.
   * @returns true para sucesso, false para falha
   */
  async pushSingleRecord(): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    return Math.random() < SYNC_SUCCESS_RATE;
  }
}
