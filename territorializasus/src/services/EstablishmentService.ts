// src/services/EstablishmentService.ts
import { EstablishmentRepository } from '@/repositories/EstablishmentRepository';
import { SyncQueueRepository } from '@/repositories/SyncQueueRepository';
import type { LocationData } from '@/types';

export const EstablishmentService = {
  async create(data: {
    streetId: string;
    createdBy: string;
    nome: string;
    tipo: string;
    location?: LocationData;
  }) {
    const establishment = await EstablishmentRepository.create(data);
    await SyncQueueRepository.enqueue(establishment.id, 'establishment', 'create');
    return establishment;
  },

  async findByStreet(streetId: string) {
    return EstablishmentRepository.findByStreet(streetId);
  },
};
