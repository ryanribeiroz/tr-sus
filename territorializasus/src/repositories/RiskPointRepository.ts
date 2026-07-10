// src/repositories/RiskPointRepository.ts
import { database, RiskPoint } from '@/database';
import { Q } from '@nozbe/watermelondb';
import { uuid } from '@/utils/uuid';
import type { LocationData } from '@/types';

export const RiskPointRepository = {
  async create(data: {
    streetId: string;
    createdBy: string;
    tipo: string;
    descricao?: string;
    location?: LocationData;
  }): Promise<RiskPoint> {
    return await database.write(async () => {
      return await database.get<RiskPoint>('risk_points').create((rp) => {
        rp.localId = uuid();
        rp.streetId = data.streetId;
        rp.createdBy = data.createdBy;
        rp.tipo = data.tipo;
        rp.descricao = data.descricao || null;
        rp.appSyncStatus = 'pending';
        rp.syncAttempts = 0;
        rp.version = 1;
        rp.locationStatus = data.location?.locationStatus || 'not_requested';
        rp.latitude = data.location?.latitude || null;
        rp.longitude = data.location?.longitude || null;
        rp.accuracy = data.location?.accuracy || null;
        rp.capturedAt = data.location?.capturedAt || null;
      });
    });
  },

  async findByStreet(streetId: string): Promise<RiskPoint[]> {
    return await database
      .get<RiskPoint>('risk_points')
      .query(Q.where('street_id', streetId))
      .fetch();
  },

  async findPending(): Promise<RiskPoint[]> {
    return await database
      .get<RiskPoint>('risk_points')
      .query(Q.or(
        Q.where('sync_status', 'pending'),
        Q.where('sync_status', 'error')
      ))
      .fetch();
  },

  async update(id: string, data: Partial<{
    appSyncStatus: string;
    syncAttempts: number;
    lastSyncError: string | null;
  }>): Promise<void> {
    const rp = await database.get<RiskPoint>('risk_points').find(id);
    await database.write(async () => {
      await rp.update((r) => {
        if (data.appSyncStatus !== undefined) r.appSyncStatus = data.appSyncStatus;
        if (data.syncAttempts !== undefined) r.syncAttempts = data.syncAttempts;
        if (data.lastSyncError !== undefined) r.lastSyncError = data.lastSyncError;
      });
    });
  },

  async countByStreet(streetId: string): Promise<number> {
    return await database
      .get<RiskPoint>('risk_points')
      .query(Q.where('street_id', streetId))
      .fetchCount();
  },
};
