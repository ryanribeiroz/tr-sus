// src/database/models/Session.ts
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Session extends Model {
  static table = 'sessions';

  @field('user_id') userId: string;
  @field('is_active') isActive: boolean;
  @date('created_at') createdAt: Date;
  @date('expires_at') expiresAt: Date | null;
}
