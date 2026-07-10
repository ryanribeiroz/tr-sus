// src/database/models/Street.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Street extends Model {
  static table = 'streets';

  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @field('name') name: string;
  @field('neighborhood_id') neighborhoodId: string;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;

  @relation('neighborhoods', 'neighborhood_id') neighborhood: any;
}
