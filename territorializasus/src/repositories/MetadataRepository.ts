// src/repositories/MetadataRepository.ts
import { database, AppMetadata } from '@/database';
import { Q } from '@nozbe/watermelondb';

export const MetadataRepository = {
  async get(key: string): Promise<string | null> {
    const items = await database
      .get<AppMetadata>('app_metadata')
      .query(Q.where('key', key))
      .fetch();
    return items.length > 0 ? items[0].value : null;
  },

  async set(key: string, value: string): Promise<void> {
    const items = await database
      .get<AppMetadata>('app_metadata')
      .query(Q.where('key', key))
      .fetch();

    await database.write(async () => {
      if (items.length > 0) {
        await items[0].update((m) => {
          m.value = value;
        });
      } else {
        await database.get<AppMetadata>('app_metadata').create((m) => {
          m.key = key;
          m.value = value;
        });
      }
    });
  },

  async getLastSyncDate(): Promise<string | null> {
    return this.get('last_sync_date');
  },

  async setLastSyncDate(date: string): Promise<void> {
    return this.set('last_sync_date', date);
  },
};
