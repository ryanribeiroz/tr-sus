// src/database/models/Neighborhood.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Neighborhood extends Model {
  static table = 'neighborhoods';

  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @field('name') name: string;
  @field('zone_id') zoneId: string;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;

  @relation('zones', 'zone_id') zone: any;
}
