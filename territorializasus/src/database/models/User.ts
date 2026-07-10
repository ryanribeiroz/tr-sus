// src/database/models/User.ts
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @field('name') name: string;
  @field('cpf') cpf: string;
  @field('role') role: string;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;
}
