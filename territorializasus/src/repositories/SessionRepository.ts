// src/repositories/SessionRepository.ts
import { database, Session } from '@/database';
import { Q } from '@nozbe/watermelondb';

export const SessionRepository = {
  async getActiveSession(): Promise<Session | null> {
    const sessions = await database
      .get<Session>('sessions')
      .query(Q.where('is_active', true))
      .fetch();
    return sessions.length > 0 ? sessions[0] : null;
  },

  async createSession(userId: string): Promise<Session> {
    // Desativa sessões antigas
    await this.deactivateAll();

    return await database.write(async () => {
      return await database.get<Session>('sessions').create((s) => {
        s.userId = userId;
        s.isActive = true;
      });
    });
  },

  async deactivateAll(): Promise<void> {
    const activeSessions = await database
      .get<Session>('sessions')
      .query(Q.where('is_active', true))
      .fetch();

    if (activeSessions.length > 0) {
      await database.write(async () => {
        for (const session of activeSessions) {
          await session.update((s) => {
            s.isActive = false;
          });
        }
      });
    }
  },
};
