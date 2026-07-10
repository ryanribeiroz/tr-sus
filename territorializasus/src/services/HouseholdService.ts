// src/services/HouseholdService.ts
import { HouseholdRepository } from '@/repositories/HouseholdRepository';
import { SyncQueueRepository } from '@/repositories/SyncQueueRepository';
import { SavassiService } from './SavassiService';
import type { SavassiAnswers, LocationData } from '@/types';

export const HouseholdService = {
  async createDraft(streetId: string, createdBy: string) {
    return HouseholdRepository.create({ streetId, createdBy });
  },

  async updateDraft(
    id: string,
    data: {
      numero?: string;
      semNumero?: boolean;
      complemento?: string;
      referencia?: string;
      tipoImovel?: string;
      moradores?: number;
      savassi?: Partial<SavassiAnswers>;
      riscos?: Partial<{
        focoMosquito: boolean;
        lixo: boolean;
        aguaParada: boolean;
        animais: boolean;
        quintalSujo: boolean;
      }>;
      observacoes?: string;
      location?: LocationData;
    }
  ) {
    const updateData: Record<string, unknown> = {};

    if (data.numero !== undefined) updateData.numero = data.numero;
    if (data.semNumero !== undefined) updateData.semNumero = data.semNumero;
    if (data.complemento !== undefined) updateData.complemento = data.complemento;
    if (data.referencia !== undefined) updateData.referencia = data.referencia;
    if (data.tipoImovel !== undefined) updateData.tipoImovel = data.tipoImovel;
    if (data.moradores !== undefined) updateData.moradores = data.moradores;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;
    if (data.location) updateData.location = data.location;

    // Map savassi fields
    if (data.savassi) {
      if (data.savassi.acamado !== undefined) updateData.savassiAcamado = data.savassi.acamado;
      if (data.savassi.desemprego !== undefined) updateData.savassiDesemprego = data.savassi.desemprego;
      if (data.savassi.relacaoMoradorComodo !== undefined) updateData.savassiRelacaoMoradorComodo = data.savassi.relacaoMoradorComodo;
      if (data.savassi.analfabeto !== undefined) updateData.savassiAnalfabeto = data.savassi.analfabeto;
      if (data.savassi.menor6m !== undefined) updateData.savassiMenor6m = data.savassi.menor6m;
      if (data.savassi.idoso !== undefined) updateData.savassiIdoso = data.savassi.idoso;
      if (data.savassi.gestante !== undefined) updateData.savassiGestante = data.savassi.gestante;
      if (data.savassi.deficiencia !== undefined) updateData.savassiDeficiencia = data.savassi.deficiencia;

      // Recalculate Savassi score
      const fullAnswers: SavassiAnswers = {
        acamado: data.savassi.acamado ?? false,
        desemprego: data.savassi.desemprego ?? false,
        relacaoMoradorComodo: data.savassi.relacaoMoradorComodo ?? false,
        analfabeto: data.savassi.analfabeto ?? false,
        menor6m: data.savassi.menor6m ?? false,
        idoso: data.savassi.idoso ?? false,
        gestante: data.savassi.gestante ?? false,
        deficiencia: data.savassi.deficiencia ?? false,
      };
      const result = SavassiService.calculate(fullAnswers);
      updateData.savassiScore = result.score;
      updateData.savassiClassification = result.classification;
    }

    // Map risk fields
    if (data.riscos) {
      if (data.riscos.focoMosquito !== undefined) updateData.riscoFocoMosquito = data.riscos.focoMosquito;
      if (data.riscos.lixo !== undefined) updateData.riscoLixo = data.riscos.lixo;
      if (data.riscos.aguaParada !== undefined) updateData.riscoAguaParada = data.riscos.aguaParada;
      if (data.riscos.animais !== undefined) updateData.riscoAnimais = data.riscos.animais;
      if (data.riscos.quintalSujo !== undefined) updateData.riscoQuintalSujo = data.riscos.quintalSujo;
    }

    await HouseholdRepository.update(id, updateData as any);
  },

  async submit(id: string, savassiAnswers: SavassiAnswers, location?: LocationData) {
    const result = SavassiService.calculate(savassiAnswers);

    await HouseholdRepository.update(id, {
      appSyncStatus: 'pending',
      savassiScore: result.score,
      savassiClassification: result.classification,
      location,
    });

    // Enqueue for sync
    await SyncQueueRepository.enqueue(id, 'household', 'create');
  },

  async findByStreet(streetId: string) {
    return HouseholdRepository.findByStreet(streetId);
  },

  async findDraftByStreet(streetId: string) {
    return HouseholdRepository.findDraftByStreet(streetId);
  },

  async checkDuplicate(streetId: string, numero: string): Promise<boolean> {
    if (!numero) return false;
    const existing = await HouseholdRepository.findByNumberInStreet(streetId, numero);
    return existing.length > 0;
  },

  async delete(id: string) {
    await SyncQueueRepository.remove(id);
    await HouseholdRepository.delete(id);
  },
};
