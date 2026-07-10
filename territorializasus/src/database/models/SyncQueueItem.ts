// src/database/models/SyncQueueItem.ts
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class SyncQueueItem extends Model {
  static table = 'sync_queue';

  @field('record_id') recordId: string;
  @field('record_type') recordType: string;
  @field('action') action: string;
  @field('status') status: string;
  @field('attempts') attempts: number;
  @field('last_error') lastError: string | null;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;
}
