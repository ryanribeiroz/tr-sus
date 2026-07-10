// src/repositories/SyncQueueRepository.ts
import { database, SyncQueueItem } from '@/database';
import { Q } from '@nozbe/watermelondb';

export const SyncQueueRepository = {
  async enqueue(recordId: string, recordType: string, action: string = 'create'): Promise<void> {
    // Check if already queued
    const existing = await database
      .get<SyncQueueItem>('sync_queue')
      .query(Q.where('record_id', recordId))
      .fetch();

    if (existing.length > 0) return;

    await database.write(async () => {
      await database.get<SyncQueueItem>('sync_queue').create((item) => {
        item.recordId = recordId;
        item.recordType = recordType;
        item.action = action;
        item.status = 'pending';
        item.attempts = 0;
      });
    });
  },

  async remove(recordId: string): Promise<void> {
    const items = await database
      .get<SyncQueueItem>('sync_queue')
      .query(Q.where('record_id', recordId))
      .fetch();

    if (items.length > 0) {
      await database.write(async () => {
        for (const item of items) {
          await item.destroyPermanently();
        }
      });
    }
  },

  async getPending(): Promise<SyncQueueItem[]> {
    return await database
      .get<SyncQueueItem>('sync_queue')
      .query(Q.or(
        Q.where('status', 'pending'),
        Q.where('status', 'error')
      ))
      .fetch();
  },

  async getPendingCount(): Promise<number> {
    return await database
      .get<SyncQueueItem>('sync_queue')
      .query(Q.or(
        Q.where('status', 'pending'),
        Q.where('status', 'error')
      ))
      .fetchCount();
  },

  async updateStatus(recordId: string, status: string, error?: string): Promise<void> {
    const items = await database
      .get<SyncQueueItem>('sync_queue')
      .query(Q.where('record_id', recordId))
      .fetch();

    if (items.length > 0) {
      await database.write(async () => {
        await items[0].update((item) => {
          item.status = status;
          item.attempts = item.attempts + 1;
          if (error) item.lastError = error;
        });
      });
    }
  },
};
