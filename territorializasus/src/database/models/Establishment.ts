// src/database/models/Establishment.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Establishment extends Model {
  static table = 'establishments';

  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;
  @field('created_by') createdBy: string;
  @field('sync_status') appSyncStatus: string;
  @field('sync_attempts') syncAttempts: number;
  @field('last_sync_error') lastSyncError: string | null;
  @field('version') version: number;

  @field('latitude') latitude: number | null;
  @field('longitude') longitude: number | null;
  @field('accuracy') accuracy: number | null;
  @field('captured_at') capturedAt: number | null;
  @field('location_status') locationStatus: string;

  @field('street_id') streetId: string;
  @field('nome') nome: string;
  @field('tipo') tipo: string;

  @relation('streets', 'street_id') street: any;
}
