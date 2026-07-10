// src/repositories/UserRepository.ts
import { database, User } from '@/database';
import { Q } from '@nozbe/watermelondb';
import { uuid } from '@/utils/uuid';

export const UserRepository = {
  async findByCpf(cpf: string): Promise<User | null> {
    const users = await database
      .get<User>('users')
      .query(Q.where('cpf', cpf))
      .fetch();
    return users.length > 0 ? users[0] : null;
  },

  async findById(id: string): Promise<User | null> {
    try {
      return await database.get<User>('users').find(id);
    } catch {
      return null;
    }
  },

  async createOrUpdate(data: {
    id?: string;
    name: string;
    cpf: string;
    role: string;
  }): Promise<User> {
    const existing = await this.findByCpf(data.cpf);
    if (existing) {
      await database.write(async () => {
        await existing.update((u) => {
          u.name = data.name;
          u.role = data.role;
        });
      });
      return existing;
    }

    return await database.write(async () => {
      return await database.get<User>('users').create((u) => {
        u.localId = data.id || uuid();
        u.name = data.name;
        u.cpf = data.cpf;
        u.role = data.role;
      });
    });
  },
};
