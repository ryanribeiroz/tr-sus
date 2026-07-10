// src/services/RiskPointService.ts
import { RiskPointRepository } from '@/repositories/RiskPointRepository';
import { SyncQueueRepository } from '@/repositories/SyncQueueRepository';
import type { LocationData } from '@/types';

export const RiskPointService = {
  async create(data: {
    streetId: string;
    createdBy: string;
    tipo: string;
    descricao?: string;
    location?: LocationData;
  }) {
    const riskPoint = await RiskPointRepository.create(data);
    await SyncQueueRepository.enqueue(riskPoint.id, 'risk_point', 'create');
    return riskPoint;
  },

  async findByStreet(streetId: string) {
    return RiskPointRepository.findByStreet(streetId);
  },
};
