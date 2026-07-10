// src/repositories/HouseholdRepository.ts
import { database, Household } from '@/database';
import { Q } from '@nozbe/watermelondb';
import { uuid } from '@/utils/uuid';
import type { LocationData, SyncStatus } from '@/types';

interface HouseholdCreateData {
  streetId: string;
  createdBy: string;
  numero?: string;
  semNumero?: boolean;
  complemento?: string;
  referencia?: string;
  tipoImovel?: string;
  moradores?: number;
  location?: LocationData;
}

interface HouseholdUpdateData {
  numero?: string;
  semNumero?: boolean;
  complemento?: string;
  referencia?: string;
  tipoImovel?: string;
  moradores?: number;
  savassiAcamado?: boolean;
  savassiDesemprego?: boolean;
  savassiRelacaoMoradorComodo?: boolean;
  savassiAnalfabeto?: boolean;
  savassiMenor6m?: boolean;
  savassiIdoso?: boolean;
  savassiGestante?: boolean;
  savassiDeficiencia?: boolean;
  savassiScore?: number;
  savassiClassification?: string;
  riscoFocoMosquito?: boolean;
  riscoLixo?: boolean;
  riscoAguaParada?: boolean;
  riscoAnimais?: boolean;
  riscoQuintalSujo?: boolean;
  observacoes?: string;
  location?: LocationData;
  appSyncStatus?: SyncStatus;
}

export const HouseholdRepository = {
  async create(data: HouseholdCreateData): Promise<Household> {
    return await database.write(async () => {
      return await database.get<Household>('households').create((h) => {
        h.localId = uuid();
        h.streetId = data.streetId;
        h.createdBy = data.createdBy;
        h.appSyncStatus = 'draft';
        h.syncAttempts = 0;
        h.version = 1;
        h.numero = data.numero || '';
        h.semNumero = data.semNumero || false;
        h.complemento = data.complemento || null;
        h.referencia = data.referencia || null;
        h.tipoImovel = data.tipoImovel || 'Casa';
        h.moradores = data.moradores || 1;
        // Savassi defaults
        h.savassiAcamado = false;
        h.savassiDesemprego = false;
        h.savassiRelacaoMoradorComodo = false;
        h.savassiAnalfabeto = false;
        h.savassiMenor6m = false;
        h.savassiIdoso = false;
        h.savassiGestante = false;
        h.savassiDeficiencia = false;
        h.savassiScore = 0;
        h.savassiClassification = 'Baixa';
        // Risk defaults
        h.riscoFocoMosquito = false;
        h.riscoLixo = false;
        h.riscoAguaParada = false;
        h.riscoAnimais = false;
        h.riscoQuintalSujo = false;
        // Location
        h.locationStatus = data.location?.locationStatus || 'not_requested';
        h.latitude = data.location?.latitude || null;
        h.longitude = data.location?.longitude || null;
        h.accuracy = data.location?.accuracy || null;
        h.capturedAt = data.location?.capturedAt || null;
      });
    });
  },

  async update(id: string, data: HouseholdUpdateData): Promise<void> {
    const household = await database.get<Household>('households').find(id);
    await database.write(async () => {
      await household.update((h) => {
        if (data.numero !== undefined) h.numero = data.numero;
        if (data.semNumero !== undefined) h.semNumero = data.semNumero;
        if (data.complemento !== undefined) h.complemento = data.complemento || null;
        if (data.referencia !== undefined) h.referencia = data.referencia || null;
        if (data.tipoImovel !== undefined) h.tipoImovel = data.tipoImovel;
        if (data.moradores !== undefined) h.moradores = data.moradores;
        if (data.savassiAcamado !== undefined) h.savassiAcamado = data.savassiAcamado;
        if (data.savassiDesemprego !== undefined) h.savassiDesemprego = data.savassiDesemprego;
        if (data.savassiRelacaoMoradorComodo !== undefined) h.savassiRelacaoMoradorComodo = data.savassiRelacaoMoradorComodo;
        if (data.savassiAnalfabeto !== undefined) h.savassiAnalfabeto = data.savassiAnalfabeto;
        if (data.savassiMenor6m !== undefined) h.savassiMenor6m = data.savassiMenor6m;
        if (data.savassiIdoso !== undefined) h.savassiIdoso = data.savassiIdoso;
        if (data.savassiGestante !== undefined) h.savassiGestante = data.savassiGestante;
        if (data.savassiDeficiencia !== undefined) h.savassiDeficiencia = data.savassiDeficiencia;
        if (data.savassiScore !== undefined) h.savassiScore = data.savassiScore;
        if (data.savassiClassification !== undefined) h.savassiClassification = data.savassiClassification;
        if (data.riscoFocoMosquito !== undefined) h.riscoFocoMosquito = data.riscoFocoMosquito;
        if (data.riscoLixo !== undefined) h.riscoLixo = data.riscoLixo;
        if (data.riscoAguaParada !== undefined) h.riscoAguaParada = data.riscoAguaParada;
        if (data.riscoAnimais !== undefined) h.riscoAnimais = data.riscoAnimais;
        if (data.riscoQuintalSujo !== undefined) h.riscoQuintalSujo = data.riscoQuintalSujo;
        if (data.observacoes !== undefined) h.observacoes = data.observacoes || null;
        if (data.location) {
          h.locationStatus = data.location.locationStatus;
          h.latitude = data.location.latitude;
          h.longitude = data.location.longitude;
          h.accuracy = data.location.accuracy;
          h.capturedAt = data.location.capturedAt;
        }
        if (data.appSyncStatus !== undefined) h.appSyncStatus = data.appSyncStatus;
      });
    });
  },

  async findById(id: string): Promise<Household | null> {
    try {
      return await database.get<Household>('households').find(id);
    } catch {
      return null;
    }
  },

  async findByStreet(streetId: string): Promise<Household[]> {
    return await database
      .get<Household>('households')
      .query(Q.where('street_id', streetId))
      .fetch();
  },

  async findDraftByStreet(streetId: string): Promise<Household | null> {
    const drafts = await database
      .get<Household>('households')
      .query(
        Q.where('street_id', streetId),
        Q.where('sync_status', 'draft')
      )
      .fetch();
    return drafts.length > 0 ? drafts[0] : null;
  },

  async findByNumberInStreet(streetId: string, numero: string): Promise<Household[]> {
    return await database
      .get<Household>('households')
      .query(
        Q.where('street_id', streetId),
        Q.where('numero', numero),
        Q.where('sync_status', Q.notEq('draft'))
      )
      .fetch();
  },

  async findPending(): Promise<Household[]> {
    return await database
      .get<Household>('households')
      .query(Q.or(
        Q.where('sync_status', 'pending'),
        Q.where('sync_status', 'error')
      ))
      .fetch();
  },

  async countByStreet(streetId: string): Promise<number> {
    return await database
      .get<Household>('households')
      .query(
        Q.where('street_id', streetId),
        Q.where('sync_status', Q.notEq('draft'))
      )
      .fetchCount();
  },

  async delete(id: string): Promise<void> {
    const household = await database.get<Household>('households').find(id);
    await database.write(async () => {
      await household.destroyPermanently();
    });
  },
};
