// src/database/models/Zone.ts
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Zone extends Model {
  static table = 'zones';

  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @field('name') name: string;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;
}
