// src/repositories/AssignmentRepository.ts
import { database, Zone, Neighborhood, Street, Assignment } from '@/database';
import { Q } from '@nozbe/watermelondb';
import type { PullAssignmentsResult, StreetWithNeighborhood } from '@/types';

export const AssignmentRepository = {
  async saveAssignments(data: PullAssignmentsResult): Promise<void> {
    await database.write(async () => {
      // Limpar dados antigos
      const oldAssignments = await database.get<Assignment>('assignments').query().fetch();
      const oldStreets = await database.get<Street>('streets').query().fetch();
      const oldNeighborhoods = await database.get<Neighborhood>('neighborhoods').query().fetch();
      const oldZones = await database.get<Zone>('zones').query().fetch();

      const destroyBatch = [
        ...oldAssignments.map((r) => r.prepareDestroyPermanently()),
        ...oldStreets.map((r) => r.prepareDestroyPermanently()),
        ...oldNeighborhoods.map((r) => r.prepareDestroyPermanently()),
        ...oldZones.map((r) => r.prepareDestroyPermanently()),
      ];
      if (destroyBatch.length > 0) {
        await database.batch(...destroyBatch);
      }

      // Criar novos registros
      const createBatch = [
        ...data.zones.map((z) =>
          database.get<Zone>('zones').prepareCreate((record) => {
            record._raw.id = z.id;
            record.localId = z.id;
            record.name = z.name;
          })
        ),
        ...data.neighborhoods.map((n) =>
          database.get<Neighborhood>('neighborhoods').prepareCreate((record) => {
            record._raw.id = n.id;
            record.localId = n.id;
            record.name = n.name;
            record.zoneId = n.zoneId;
          })
        ),
        ...data.streets.map((s) =>
          database.get<Street>('streets').prepareCreate((record) => {
            record._raw.id = s.id;
            record.localId = s.id;
            record.name = s.name;
            record.neighborhoodId = s.neighborhoodId;
          })
        ),
        ...data.assignments.map((a) =>
          database.get<Assignment>('assignments').prepareCreate((record) => {
            record._raw.id = a.id;
            record.localId = a.id;
            record.streetId = a.streetId;
            record.userId = a.userId;
          })
        ),
      ];
      await database.batch(...createBatch);
    });
  },

  async getAssignedStreets(userId: string): Promise<StreetWithNeighborhood[]> {
    const assignments = await database
      .get<Assignment>('assignments')
      .query(Q.where('user_id', userId))
      .fetch();

    const streets: StreetWithNeighborhood[] = [];
    for (const assignment of assignments) {
      try {
        const street = await database.get<Street>('streets').find(assignment.streetId);
        const neighborhood = await database
          .get<Neighborhood>('neighborhoods')
          .find(street.neighborhoodId);
        streets.push({
          id: street.id,
          name: street.name,
          neighborhoodId: neighborhood.id,
          neighborhoodName: neighborhood.name,
        });
      } catch {
        // Skip missing data
      }
    }
    return streets;
  },

  async getStreetById(streetId: string): Promise<StreetWithNeighborhood | null> {
    try {
      const street = await database.get<Street>('streets').find(streetId);
      const neighborhood = await database
        .get<Neighborhood>('neighborhoods')
        .find(street.neighborhoodId);
      return {
        id: street.id,
        name: street.name,
        neighborhoodId: neighborhood.id,
        neighborhoodName: neighborhood.name,
      };
    } catch {
      return null;
    }
  },

  async hasAssignments(): Promise<boolean> {
    const count = await database
      .get<Assignment>('assignments')
      .query()
      .fetchCount();
    return count > 0;
  },
};
