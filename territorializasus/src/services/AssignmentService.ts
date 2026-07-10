// src/services/AssignmentService.ts
import { AssignmentRepository } from '@/repositories/AssignmentRepository';
import { HouseholdRepository } from '@/repositories/HouseholdRepository';
import { EstablishmentRepository } from '@/repositories/EstablishmentRepository';
import { RiskPointRepository } from '@/repositories/RiskPointRepository';
import type { StreetWithNeighborhood } from '@/types';

export interface StreetGroupedByNeighborhood {
  neighborhoodName: string;
  neighborhoodId: string;
  streets: Array<StreetWithNeighborhood & { householdCount: number }>;
}

export const AssignmentService = {
  async getAssignedStreets(userId: string): Promise<StreetWithNeighborhood[]> {
    return AssignmentRepository.getAssignedStreets(userId);
  },

  async getStreetsGroupedByNeighborhood(
    userId: string
  ): Promise<StreetGroupedByNeighborhood[]> {
    const streets = await this.getAssignedStreets(userId);
    const groups: Record<string, StreetGroupedByNeighborhood> = {};

    for (const street of streets) {
      if (!groups[street.neighborhoodId]) {
        groups[street.neighborhoodId] = {
          neighborhoodName: street.neighborhoodName,
          neighborhoodId: street.neighborhoodId,
          streets: [],
        };
      }
      const householdCount = await HouseholdRepository.countByStreet(street.id);
      groups[street.neighborhoodId].streets.push({
        ...street,
        householdCount,
      });
    }

    return Object.values(groups);
  },

  async getStreetById(streetId: string) {
    return AssignmentRepository.getStreetById(streetId);
  },

  async hasAssignments(): Promise<boolean> {
    return AssignmentRepository.hasAssignments();
  },

  async getStreetCounts(streetId: string): Promise<{
    households: number;
    establishments: number;
    riskPoints: number;
  }> {
    const [households, establishments, riskPoints] = await Promise.all([
      HouseholdRepository.countByStreet(streetId),
      EstablishmentRepository.countByStreet(streetId),
      RiskPointRepository.countByStreet(streetId),
    ]);
    return { households, establishments, riskPoints };
  },
};
