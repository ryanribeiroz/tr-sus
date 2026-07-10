// src/database/models/AppMetadata.ts
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AppMetadata extends Model {
  static table = 'app_metadata';

  @field('key') key: string;
  @field('value') value: string;
  @date('updated_at') updatedAt: Date;
}
