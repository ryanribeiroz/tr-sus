// src/database/models/Household.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Household extends Model {
  static table = 'households';

  // Campos técnicos obrigatórios (AGENTS.md §7.3)
  @field('local_id') localId: string;
  @field('server_id') serverId: string | null;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;
  @field('created_by') createdBy: string;
  @field('sync_status') appSyncStatus: string;
  @field('sync_attempts') syncAttempts: number;
  @field('last_sync_error') lastSyncError: string | null;
  @field('version') version: number;

  // Localização (AGENTS.md §7.4)
  @field('latitude') latitude: number | null;
  @field('longitude') longitude: number | null;
  @field('accuracy') accuracy: number | null;
  @field('captured_at') capturedAt: number | null;
  @field('location_status') locationStatus: string;

  // Vínculo com rua
  @field('street_id') streetId: string;

  // Identificação do domicílio
  @field('numero') numero: string;
  @field('sem_numero') semNumero: boolean;
  @field('complemento') complemento: string | null;
  @field('referencia') referencia: string | null;
  @field('tipo_imovel') tipoImovel: string;
  @field('moradores') moradores: number;

  // Escala de Savassi
  @field('savassi_acamado') savassiAcamado: boolean;
  @field('savassi_desemprego') savassiDesemprego: boolean;
  @field('savassi_relacao_morador_comodo') savassiRelacaoMoradorComodo: boolean;
  @field('savassi_analfabeto') savassiAnalfabeto: boolean;
  @field('savassi_menor_6m') savassiMenor6m: boolean;
  @field('savassi_idoso') savassiIdoso: boolean;
  @field('savassi_gestante') savassiGestante: boolean;
  @field('savassi_deficiencia') savassiDeficiencia: boolean;

  // Resultado calculado
  @field('savassi_score') savassiScore: number;
  @field('savassi_classification') savassiClassification: string;

  // Riscos ambientais
  @field('risco_foco_mosquito') riscoFocoMosquito: boolean;
  @field('risco_lixo') riscoLixo: boolean;
  @field('risco_agua_parada') riscoAguaParada: boolean;
  @field('risco_animais') riscoAnimais: boolean;
  @field('risco_quintal_sujo') riscoQuintalSujo: boolean;

  // Observações
  @field('observacoes') observacoes: string | null;

  @relation('streets', 'street_id') street: any;
}
