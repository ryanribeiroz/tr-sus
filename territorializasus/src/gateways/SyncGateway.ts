// src/gateways/SyncGateway.ts
// =====================================================
// Contrato abstrato de sincronização (AGENTS.md §13)
// =====================================================

import type { PullAssignmentsResult, PushRecordsResult } from '@/types';

export interface SyncGateway {
  pullAssignments(): Promise<PullAssignmentsResult>;
  pushPendingRecords(): Promise<PushRecordsResult>;
}
