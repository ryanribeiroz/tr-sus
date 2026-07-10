// src/database/models/Assignment.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Assignment extends Model {
  static table = 'assignments';

  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @field('street_id') streetId: string;
  @field('user_id') userId: string;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;

  @relation('streets', 'street_id') street: any;
  @relation('users', 'user_id') user: any;
}
