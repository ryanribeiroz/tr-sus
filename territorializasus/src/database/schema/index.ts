// src/database/schema/index.ts
// =====================================================
// WatermelonDB Schema — TerritorializaSUS Fase 1
// =====================================================
// 11 tabelas aprovadas conforme AGENTS.md §7.1

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // ---- Autenticação ----
    tableSchema({
      name: 'users',
      columns: [
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'cpf', type: 'string' },
        { name: 'role', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'sessions',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'expires_at', type: 'number', isOptional: true },
      ],
    }),

    // ---- Território ----
    tableSchema({
      name: 'zones',
      columns: [
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'neighborhoods',
      columns: [
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'zone_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'streets',
      columns: [
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'neighborhood_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'assignments',
      columns: [
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'street_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // ---- Coleta ----
    tableSchema({
      name: 'households',
      columns: [
        // Campos técnicos obrigatórios (AGENTS.md §7.3)
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'created_by', type: 'string' },
        { name: 'sync_status', type: 'string' }, // SyncStatus
        { name: 'sync_attempts', type: 'number' },
        { name: 'last_sync_error', type: 'string', isOptional: true },
        { name: 'version', type: 'number' },

        // Localização (AGENTS.md §7.4)
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'accuracy', type: 'number', isOptional: true },
        { name: 'captured_at', type: 'number', isOptional: true },
        { name: 'location_status', type: 'string' }, // LocationStatus

        // Vínculo com rua
        { name: 'street_id', type: 'string' },

        // Identificação do domicílio
        { name: 'numero', type: 'string' },
        { name: 'sem_numero', type: 'boolean' },
        { name: 'complemento', type: 'string', isOptional: true },
        { name: 'referencia', type: 'string', isOptional: true },
        { name: 'tipo_imovel', type: 'string' },
        { name: 'moradores', type: 'number' },

        // Escala de Savassi (8 campos booleanos)
        { name: 'savassi_acamado', type: 'boolean' },
        { name: 'savassi_desemprego', type: 'boolean' },
        { name: 'savassi_relacao_morador_comodo', type: 'boolean' },
        { name: 'savassi_analfabeto', type: 'boolean' },
        { name: 'savassi_menor_6m', type: 'boolean' },
        { name: 'savassi_idoso', type: 'boolean' },
        { name: 'savassi_gestante', type: 'boolean' },
        { name: 'savassi_deficiencia', type: 'boolean' },

        // Resultado calculado
        { name: 'savassi_score', type: 'number' },
        { name: 'savassi_classification', type: 'string' },

        // Riscos ambientais (5 campos booleanos)
        { name: 'risco_foco_mosquito', type: 'boolean' },
        { name: 'risco_lixo', type: 'boolean' },
        { name: 'risco_agua_parada', type: 'boolean' },
        { name: 'risco_animais', type: 'boolean' },
        { name: 'risco_quintal_sujo', type: 'boolean' },

        // Observações
        { name: 'observacoes', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'establishments',
      columns: [
        // Campos técnicos obrigatórios
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'created_by', type: 'string' },
        { name: 'sync_status', type: 'string' },
        { name: 'sync_attempts', type: 'number' },
        { name: 'last_sync_error', type: 'string', isOptional: true },
        { name: 'version', type: 'number' },

        // Localização
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'accuracy', type: 'number', isOptional: true },
        { name: 'captured_at', type: 'number', isOptional: true },
        { name: 'location_status', type: 'string' },

        // Vínculo com rua
        { name: 'street_id', type: 'string' },

        // Dados do estabelecimento
        { name: 'nome', type: 'string' },
        { name: 'tipo', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'risk_points',
      columns: [
        // Campos técnicos obrigatórios
        { name: 'local_id', type: 'string' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'created_by', type: 'string' },
        { name: 'sync_status', type: 'string' },
        { name: 'sync_attempts', type: 'number' },
        { name: 'last_sync_error', type: 'string', isOptional: true },
        { name: 'version', type: 'number' },

        // Localização
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'accuracy', type: 'number', isOptional: true },
        { name: 'captured_at', type: 'number', isOptional: true },
        { name: 'location_status', type: 'string' },

        // Vínculo com rua
        { name: 'street_id', type: 'string' },

        // Dados do ponto de risco
        { name: 'tipo', type: 'string' },
        { name: 'descricao', type: 'string', isOptional: true },
      ],
    }),

    // ---- Sincronização ----
    tableSchema({
      name: 'sync_queue',
      columns: [
        { name: 'record_id', type: 'string' },
        { name: 'record_type', type: 'string' }, // 'household' | 'establishment' | 'risk_point'
        { name: 'action', type: 'string' }, // 'create' | 'update'
        { name: 'status', type: 'string' }, // SyncStatus
        { name: 'attempts', type: 'number' },
        { name: 'last_error', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'app_metadata',
      columns: [
        { name: 'key', type: 'string' },
        { name: 'value', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
