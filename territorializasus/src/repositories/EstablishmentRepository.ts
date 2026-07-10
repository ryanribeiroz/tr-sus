// src/repositories/EstablishmentRepository.ts
import { database, Establishment } from '@/database';
import { Q } from '@nozbe/watermelondb';
import { uuid } from '@/utils/uuid';
import type { LocationData } from '@/types';

export const EstablishmentRepository = {
  async create(data: {
    streetId: string;
    createdBy: string;
    nome: string;
    tipo: string;
    location?: LocationData;
  }): Promise<Establishment> {
    return await database.write(async () => {
      return await database.get<Establishment>('establishments').create((e) => {
        e.localId = uuid();
        e.streetId = data.streetId;
        e.createdBy = data.createdBy;
        e.nome = data.nome;
        e.tipo = data.tipo;
        e.appSyncStatus = 'pending';
        e.syncAttempts = 0;
        e.version = 1;
        e.locationStatus = data.location?.locationStatus || 'not_requested';
        e.latitude = data.location?.latitude || null;
        e.longitude = data.location?.longitude || null;
        e.accuracy = data.location?.accuracy || null;
        e.capturedAt = data.location?.capturedAt || null;
      });
    });
  },

  async findByStreet(streetId: string): Promise<Establishment[]> {
    return await database
      .get<Establishment>('establishments')
      .query(Q.where('street_id', streetId))
      .fetch();
  },

  async findPending(): Promise<Establishment[]> {
    return await database
      .get<Establishment>('establishments')
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
    const est = await database.get<Establishment>('establishments').find(id);
    await database.write(async () => {
      await est.update((e) => {
        if (data.appSyncStatus !== undefined) e.appSyncStatus = data.appSyncStatus;
        if (data.syncAttempts !== undefined) e.syncAttempts = data.syncAttempts;
        if (data.lastSyncError !== undefined) e.lastSyncError = data.lastSyncError;
      });
    });
  },

  async countByStreet(streetId: string): Promise<number> {
    return await database
      .get<Establishment>('establishments')
      .query(Q.where('street_id', streetId))
      .fetchCount();
  },
};
