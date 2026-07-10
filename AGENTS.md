# AGENTS.md — TerritorializaSUS

> Documento mestre para orientar agentes de código na criação, manutenção e evolução do projeto **TerritorializaSUS**.

Este arquivo deve ser lido antes de qualquer alteração no projeto. Ele define escopo, arquitetura, responsabilidades, padrões de código, decisões já aprovadas e limites do que o agente pode ou não implementar.

---

## 1. Visão geral do produto

O **TerritorializaSUS** é uma solução digital para apoiar o processo de territorialização e reterritorialização em saúde, com foco na coleta estruturada de dados em campo e posterior análise pela gestão.

A solução completa será composta por:

1. **Aplicativo móvel TerritorializaSUS**
   - Usado em campo por agentes.
   - Funciona com abordagem **offline-first**.
   - Permite coletar dados de domicílios, estabelecimentos e pontos de risco.
   - Armazena os dados localmente.
   - Sincroniza os dados posteriormente com o servidor.

2. **Backend/API**
   - Responsável por autenticação real, regras centrais, recebimento dos dados do app, controle de sincronização e integração entre os módulos.
   - Ainda não será implementado na Fase 1.

3. **Banco de dados central**
   - Banco usado pelo backend e pelo sistema web.
   - Ainda não definido.
   - Não é o WatermelonDB.

4. **Sistema web TerritorializaSUS**
   - Usado por gestão, analistas e planejadores.
   - Servirá para acompanhamento, visualização, validação, mapas, dashboards, relatórios e exportações.
   - Ainda não será implementado na Fase 1.

---

## 2. Decisões obrigatórias já aprovadas

Estas decisões não devem ser alteradas pelo agente sem autorização explícita da equipe.

### 2.1. Arquivo principal

Este arquivo é o documento principal de orientação técnica do projeto e deve permanecer na raiz com o nome:

```text
AGENTS.md
```

### 2.2. Arquitetura geral do produto

A arquitetura da solução completa será:

```text
Aplicativo móvel
        ↓
Backend/API
        ↓
Banco de dados central
        ↑
Sistema web
```

O aplicativo móvel não acessa diretamente o banco central.

O sistema web não acessa o WatermelonDB.

### 2.3. Arquitetura interna do aplicativo móvel

A arquitetura interna do app móvel deve seguir a separação simples por responsabilidades:

```text
Screen
  ↓
Service
  ↓
Repository
  ↓
WatermelonDB
```

Regras obrigatórias:

- `Screen` não acessa diretamente o WatermelonDB.
- `Screen` não deve conter regra de negócio complexa.
- `Service` concentra casos de uso, validações de negócio e cálculos.
- `Repository` concentra leitura e escrita de dados.
- WatermelonDB é apenas a camada de persistência local.
- Componentes visuais não devem executar persistência direta.
- Hooks e Contexts não substituem Services nem Repositories.

### 2.4. Stack mobile aprovada

O aplicativo móvel será desenvolvido com:

```text
Expo
React Native
TypeScript
Expo Development Build
WatermelonDB
Expo Router
React Hook Form
Zod
Context API + hooks
```

Plataforma inicial:

```text
Android primeiro, mantendo compatibilidade futura com iOS.
```

Observação importante:

```text
O projeto pode usar Expo, mas não deve depender do Expo Go para a versão funcional definitiva,
pois WatermelonDB exige integração nativa. Usar Expo Development Build.
```

### 2.5. Protótipo Lovable

Existe um protótipo feito no Lovable. O código será fornecido na pasta:

```text
prototype/
```

Essa pasta é referência visual e funcional obrigatória.

O agente deve:

1. Ler o código em `prototype/` antes de criar telas definitivas.
2. Identificar telas, componentes, estilos, textos, ícones, cores, espaçamentos e fluxo de navegação.
3. Reaproveitar código compatível quando fizer sentido.
4. Preservar a aparência e o comportamento do protótipo.
5. Refatorar somente o necessário para integrar a arquitetura do projeto.
6. Não modificar diretamente a pasta `prototype/`.
7. Não apagar o protótipo.
8. Não redesenhar telas sem autorização.
9. Implementar o código final dentro de `src/` e `app/`.

Se houver conflito entre o protótipo e este `AGENTS.md`, prevalece este `AGENTS.md`.

### 2.6. Escopo do MVP

O MVP do aplicativo móvel contém as seis telas/fluxos principais:

1. Login e autenticação.
2. Tela inicial vazia e primeira sincronização.
3. Painel de trabalho em modo offline.
4. Ações no território com rua selecionada.
5. Coleta de informações do domicílio com Escala de Risco Familiar de Coelho-Savassi.
6. Sincronização final e feedback.

Funcionalidades do MVP:

- Autenticação provisória.
- Primeira sincronização provisória.
- Atribuição de bairros e ruas.
- Coleta offline.
- Cadastro de domicílio.
- Cadastro de estabelecimento.
- Cadastro de ponto de risco.
- Preenchimento e cálculo da Escala de Risco Familiar de Coelho-Savassi.
- Sincronização final provisória.
- Fila local de sincronização.
- Status de sincronização dos registros.

### 2.7. Fora do MVP

Não implementar no MVP:

- Backend real.
- Banco central real.
- Sistema web real.
- Sincronização real com servidor.
- Autenticação real pela API.
- Integração com sistemas do SUS.
- Mapas gerenciais.
- Dashboards avançados.
- Relatórios.
- Exportações CSV/GeoJSON.
- Inteligência artificial.
- Comunicação interna entre usuários.
- Gestão avançada de permissões.
- Multi-município/SaaS.
- Cadastro nominal de moradores.
- Cadastro de famílias.
- Cadastro de pacientes.
- Prontuário.
- Imagens/fotografias.
- Tabela de anexos no schema inicial.

---

## 3. Ordem de prioridade das fontes

Quando o agente precisar decidir algo, deve usar a seguinte ordem:

```text
1. Decisões expressas neste AGENTS.md
2. Código disponível em prototype/
3. Documentos de requisitos do projeto
4. Padrões técnicos gerais
```

Regras:

- Não inventar campos.
- Não inventar pesos da Escala Coelho-Savassi.
- Não inventar classificações de risco.
- Não alterar fluxo visual sem necessidade.
- Não adicionar funcionalidades “úteis” fora do escopo.
- Quando houver divergência relevante, registrar dúvida e parar aquela parte.

---

## 4. Fases de implementação

A solução completa deve ser pensada em fases.

### 4.1. Fase 1 — Infraestrutura do aplicativo e banco local

Esta é a fase atual.

Entregas da Fase 1:

- Configuração do projeto Expo + React Native + TypeScript.
- Configuração de Expo Development Build.
- Estrutura de pastas.
- Expo Router.
- Tema e componentes-base.
- Análise e adaptação do protótipo em `prototype/`.
- Telas do MVP.
- WatermelonDB configurado.
- Schema inicial.
- Models.
- Migrations.
- Repositories locais.
- Services iniciais.
- Autenticação provisória.
- Primeira sincronização provisória.
- Dados simulados de bairros, ruas e atribuições.
- Coleta offline.
- Salvamento automático de rascunhos.
- Fila local de sincronização.
- Estados de sincronização.
- Contrato abstrato para sincronização futura.
- Testes básicos de persistência e services.
- Tratamento básico de erros.

Não entra na Fase 1:

- Backend/API real.
- Banco central real.
- Sistema web.
- Sincronização real.
- Mapas.
- Relatórios.
- Exportação.
- Fotos.
- Integrações externas.

### 4.2. Fase 2 — Backend/API

A definir futuramente.

O agente não está autorizado a escolher stack, banco central ou protocolo de sincronização sem aprovação expressa.

### 4.3. Fase 3 — Sincronização real

A definir futuramente.

O MVP deve deixar contratos e pontos de extensão preparados, mas sem implementar uma solução real.

### 4.4. Fase 4 — Sistema web

A definir futuramente.

O sistema web não deve acessar WatermelonDB. Ele deverá acessar os dados pelo backend/API.

### 4.5. Fase 5 — Mapas, relatórios e exportações

A definir futuramente.

---

## 5. Estrutura de pastas recomendada

Usar uma estrutura simples por camadas, adequada para quem está começando em React Native, mas mantendo separação de responsabilidades.

```text
territorializasus/
├── AGENTS.md
├── prototype/
│   └── código original do protótipo Lovable
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── inicio.tsx
│   ├── atribuicoes.tsx
│   ├── sincronizacao.tsx
│   ├── rua/
│   │   └── [streetId].tsx
│   ├── domicilio/
│   │   └── novo.tsx
│   ├── estabelecimento/
│   │   └── novo.tsx
│   └── ponto-de-risco/
│       └── novo.tsx
│
├── src/
│   ├── screens/
│   │   ├── LoginScreen/
│   │   ├── HomeScreen/
│   │   ├── WorkPanelScreen/
│   │   ├── StreetActionsScreen/
│   │   ├── HouseholdFormScreen/
│   │   ├── EstablishmentFormScreen/
│   │   ├── RiskPointFormScreen/
│   │   └── SynchronizationScreen/
│   │
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── OfflineBanner/
│   │   ├── SyncStatus/
│   │   ├── ScreenContainer/
│   │   └── FormSection/
│   │
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── AssignmentService.ts
│   │   ├── HouseholdService.ts
│   │   ├── EstablishmentService.ts
│   │   ├── RiskPointService.ts
│   │   ├── SavassiService.ts
│   │   └── SynchronizationService.ts
│   │
│   ├── repositories/
│   │   ├── UserRepository.ts
│   │   ├── SessionRepository.ts
│   │   ├── AssignmentRepository.ts
│   │   ├── HouseholdRepository.ts
│   │   ├── EstablishmentRepository.ts
│   │   ├── RiskPointRepository.ts
│   │   ├── SyncQueueRepository.ts
│   │   └── MetadataRepository.ts
│   │
│   ├── database/
│   │   ├── models/
│   │   ├── schema/
│   │   ├── migrations/
│   │   ├── adapters/
│   │   └── index.ts
│   │
│   ├── gateways/
│   │   ├── SyncGateway.ts
│   │   └── MockSyncGateway.ts
│   │
│   ├── navigation/
│   ├── validators/
│   ├── types/
│   ├── constants/
│   ├── theme/
│   ├── hooks/
│   ├── contexts/
│   ├── utils/
│   └── assets/
│
├── tests/
├── package.json
└── tsconfig.json
```

### 5.1. Regra para Expo Router

Os arquivos dentro de `app/` devem ser pequenos. Eles só devem conectar a rota à tela real.

Exemplo:

```tsx
// app/login.tsx
export { LoginScreen as default } from '@/screens/LoginScreen';
```

A lógica da interface fica em `src/screens/`, não em `app/`.

---

## 6. Fluxo principal das telas do MVP

### 6.1. Tela 1 — Login e autenticação

Objetivo:

```text
Garantir o acesso seguro do agente ao sistema.
```

Elementos:

- Logo do TerritorializaSUS.
- Campo de CPF.
- Campo de senha.
- Botão Entrar.

Fase 1:

- A autenticação será provisória.
- `AuthService` validará um usuário simulado.
- A tela deve ser real, mesmo que a autenticação ainda seja mockada.
- A sessão local será criada em `sessions`.
- Não gravar senha real no WatermelonDB.

Fluxo técnico:

```text
LoginScreen
  ↓
AuthService
  ↓
UserRepository / SessionRepository
  ↓
WatermelonDB
```

### 6.2. Tela 2 — Tela inicial vazia e primeira sincronização

Objetivo:

```text
Receber as atribuições de trabalho antes de sair para o campo.
```

Estado inicial:

- Ao entrar pela primeira vez, mostrar que não há dados baixados para trabalhar.
- Botão principal: `Sincronizar`.

Fase 1:

- A sincronização será provisória.
- O botão deve carregar dados locais simulados.
- Esses dados devem criar bairros, ruas e atribuições no WatermelonDB.
- Exibir estados de carregamento, sucesso e erro.
- Registrar data da última sincronização em `app_metadata`.

Fluxo técnico:

```text
HomeScreen
  ↓
SynchronizationService
  ↓
MockSyncGateway
  ↓
AssignmentRepository / MetadataRepository
  ↓
WatermelonDB
```

### 6.3. Tela 3 — Painel de trabalho em modo offline

Objetivo:

```text
Guiar o agente enquanto ele está na rua, sem internet.
```

Elementos:

- Nome do agente.
- Aviso de `Modo Offline`.
- Lista de bairros e ruas baixados.
- Indicador básico de pendências locais.
- Botão ou ação para sincronizar novamente quando houver internet.

Ação principal:

- O agente toca no nome da rua para abrir as ações daquele local.

Fluxo técnico:

```text
WorkPanelScreen
  ↓
AssignmentService
  ↓
AssignmentRepository
  ↓
WatermelonDB
```

### 6.4. Tela 4 — Ações no território com rua selecionada

Objetivo:

```text
Centralizar a coleta do que o agente observa na rua e dar acesso aos cadastros.
```

Elementos:

- Nome da rua selecionada.
- Botão Voltar.
- Botão Adicionar Estabelecimento.
- Botão Adicionar Ponto de Risco.
- Botão Novo Domicílio.

Regras:

- Todos os registros criados nesta tela devem ficar vinculados à rua selecionada.
- A rua deve ser preenchida automaticamente nos formulários.
- A tela não deve permitir criar registro sem `streetId`.

### 6.5. Tela 5 — Cadastro de domicílio

Objetivo:

```text
Registrar os dados de cada casa durante a caminhada, incluindo a Escala de Risco Familiar de Coelho-Savassi e observações do imóvel.
```

Fonte dos campos:

```text
prototype/
```

Regras:

- Não criar tabela de famílias.
- Não criar tabela de moradores.
- Não criar cadastro nominal de pessoas.
- A escala será calculada diretamente no registro do domicílio.
- O formulário deve ser breve e adequado ao campo.
- Salvar rascunho automaticamente.
- Ao finalizar, status muda para `pending`.
- Após salvar, retornar para a tela da rua.

Fluxo técnico:

```text
HouseholdFormScreen
  ↓
HouseholdService
  ↓
SavassiService
  ↓
HouseholdRepository / SyncQueueRepository
  ↓
WatermelonDB
```

### 6.6. Tela 6 — Sincronização final e feedback

Objetivo:

```text
Enviar tudo o que foi coletado após retornar para uma base com Wi-Fi ou ligar o 4G.
```

Fase 1:

- A sincronização será simulada.
- Mostrar quantidade de registros pendentes.
- Simular envio de domicílios, estabelecimentos e pontos de risco.
- Atualizar status para `syncing`, `synced` ou `error`.
- Exibir feedback de sucesso ou erro.
- Não apagar registros locais.
- Não implementar servidor real.

---

## 7. WatermelonDB — banco local do aplicativo

O WatermelonDB será usado exclusivamente no aplicativo móvel.

O sistema web não acessa WatermelonDB.

O backend futuro não deve depender da estrutura interna do WatermelonDB.

### 7.1. Tabelas iniciais

Criar o schema inicial com as seguintes tabelas:

```text
users
sessions

zones
neighborhoods
streets
assignments

households
establishments
risk_points

sync_queue
app_metadata
```

Não criar no schema inicial:

```text
attachments
families
residents
patients
health_records
```

### 7.2. Finalidade das tabelas

| Tabela | Responsabilidade |
|---|---|
| `users` | Usuário simulado ou recebido futuramente da API |
| `sessions` | Sessão autenticada local |
| `zones` | Zonas territoriais |
| `neighborhoods` | Bairros |
| `streets` | Ruas |
| `assignments` | Ruas atribuídas ao agente |
| `households` | Cadastros de domicílios |
| `establishments` | Estabelecimentos de interesse |
| `risk_points` | Pontos de risco encontrados |
| `sync_queue` | Fila de registros pendentes |
| `app_metadata` | Última sincronização, versão dos dados e configurações locais |

### 7.3. Campos técnicos obrigatórios

Todos os registros coletados em campo devem possuir, no mínimo:

```text
id
local_id
server_id
created_at
updated_at
created_by
sync_status
sync_attempts
last_sync_error
version
```

Observações:

- `local_id` deve ser gerado no celular.
- `server_id` fica vazio enquanto o registro não existir no servidor.
- `sync_status` controla o estado local.
- `version` prepara o projeto para controle de conflitos futuro.

### 7.4. Campos de localização

Domicílios, estabelecimentos e pontos de risco devem armazenar:

```text
latitude
longitude
accuracy
captured_at
location_status
```

Valores possíveis de `location_status`:

```text
captured
permission_denied
unavailable
not_requested
```

Regra obrigatória:

```text
Falha de GPS não bloqueia o cadastro.
```

Se o GPS falhar:

- Mostrar aviso simples ao agente.
- Permitir tentar novamente.
- Permitir salvar mesmo sem localização.
- Registrar `location_status`.

---

## 8. Estados de sincronização

Estados aprovados:

```text
draft
pending
syncing
synced
error
conflict
```

Significado:

| Estado | Significado |
|---|---|
| `draft` | Formulário iniciado, mas ainda não finalizado |
| `pending` | Salvo no celular e aguardando envio |
| `syncing` | Envio em andamento |
| `synced` | Confirmado pelo servidor ou simulação |
| `error` | Tentativa de envio falhou |
| `conflict` | Versão divergente detectada futuramente pelo backend |

Na Fase 1:

- `draft`, `pending`, `syncing`, `synced` e `error` devem funcionar.
- `conflict` deve existir no modelo, mas não precisa ter resolução real.

### 8.1. Regras de edição

| Estado | Pode editar? |
|---|---|
| `draft` | Sim |
| `pending` | Sim |
| `error` | Sim |
| `syncing` | Não |
| `synced` | Não |
| `conflict` | Não |

### 8.2. Regras de exclusão local

| Estado | Pode excluir? | Regra |
|---|---:|---|
| `draft` | Sim | Exigir confirmação |
| `pending` | Sim | Exigir confirmação e remover da fila |
| `error` | Sim | Exigir confirmação e remover da fila |
| `syncing` | Não | Aguardar término da tentativa |
| `synced` | Não | Somente leitura |
| `conflict` | Não | Aguardar resolução futura |

Não usar gesto lateral de exclusão na listagem. A exclusão deve ficar dentro da tela de detalhe/edição, com confirmação.

---

## 9. Salvamento automático de rascunhos

O app deve preservar dados localmente para evitar perda durante o trabalho de campo.

Comportamento aprovado:

1. Ao abrir um novo formulário, criar um registro com status `draft`.
2. Durante o preenchimento, salvar automaticamente.
3. Usar intervalo aproximado de `800 ms` após a última alteração.
4. Ao sair da tela, forçar um último salvamento.
5. Ao retornar, recuperar o rascunho.
6. Ao tocar em `Salvar Cadastro`, validar campos obrigatórios.
7. Se válido, mudar status para `pending`.
8. Registros `draft` não entram na fila de sincronização.
9. Registros `pending` entram na fila de sincronização.

Mensagens discretas:

```text
Salvando...
Rascunho salvo
Erro ao salvar rascunho
```

---

## 10. Regras de duplicidade de domicílio

Não usar `rua + número` como chave única.

Regras:

- Permitir marcar `Sem número`.
- Permitir mais de um domicílio com o mesmo número na mesma rua.
- Exibir aviso quando já existir domicílio com o mesmo número na rua.
- Permitir continuar após o aviso.
- Cada domicílio possui UUID/local_id próprio.

---

## 11. Formulários do MVP

### 11.1. Regra geral

A fonte principal dos campos é:

```text
prototype/
```

O agente deve extrair do protótipo:

- campos;
- textos;
- opções;
- ordem;
- máscaras;
- validações aparentes;
- comportamento visual;
- regras da Escala Coelho-Savassi.

Se a informação no protótipo estiver incompleta, o agente deve registrar a dúvida.

### 11.2. Cadastro de domicílio

O cadastro de domicílio deve ser simples e rápido.

O MVP não possui:

```text
Family
Resident
Patient
HealthRecord
```

O registro de domicílio deve concentrar os dados necessários para:

- identificação do imóvel;
- vínculo com a rua;
- respostas da Escala de Risco Familiar de Coelho-Savassi;
- pontuação calculada;
- classificação calculada;
- riscos observados no imóvel;
- observações;
- localização;
- status de sincronização.

Campos exatos devem ser extraídos do protótipo.

### 11.3. Escala de Risco Familiar de Coelho-Savassi

A escala está no protótipo.

Regras obrigatórias:

- Implementar o cálculo em `SavassiService`.
- Não calcular diretamente na tela.
- Não hardcodar regras sem confirmar o que está no protótipo.
- Se pesos, perguntas ou faixas estiverem incompletos, parar e pedir validação.
- O resultado da escala fica associado ao domicílio.
- Não criar tabela separada de família para a escala no MVP.

Exemplo de uso esperado:

```ts
const result = SavassiService.calculate(formData.savassiAnswers);
```

Resultado esperado:

```ts
{
  score: number;
  classification: string;
}
```

### 11.4. Cadastro de estabelecimento

O cadastro de estabelecimento faz parte do MVP.

Fonte dos campos:

```text
prototype/
```

Regras:

- Deve ficar vinculado à rua selecionada.
- Deve capturar GPS quando disponível.
- Falha de GPS não bloqueia o cadastro.
- Deve salvar offline.
- Deve entrar na fila de sincronização após salvar.

Não criar cadastro empresarial completo. Não adicionar CNPJ, proprietário, dados fiscais ou informações não previstas no protótipo.

### 11.5. Cadastro de ponto de risco

O cadastro de ponto de risco faz parte do MVP.

Regras:

- Deve ficar vinculado à rua selecionada.
- Deve capturar GPS quando disponível.
- Falha de GPS não bloqueia o cadastro.
- Deve salvar offline.
- Deve entrar na fila de sincronização após salvar.
- Não incluir fotografias no MVP.
- Não criar tabela de anexos.
- Não incluir classificação de gravidade se ela não estiver no protótipo.

---

## 12. Autenticação provisória da Fase 1

Como não haverá backend real na Fase 1:

- A tela de login será real.
- CPF e senha serão informados pelo usuário.
- `AuthService` fará validação simulada.
- Criar um usuário de desenvolvimento.
- Criar sessão local.
- A implementação deve ser substituível por API futura.
- Não salvar senha real no banco local.

Sugestão de fluxo:

```text
LoginScreen
  ↓
AuthService.login(cpf, password)
  ↓
UserRepository.findByCpf(cpf)
  ↓
SessionRepository.createSession(user)
  ↓
router.replace('/inicio')
```

---

## 13. Primeira sincronização provisória

Como não haverá backend real na Fase 1, o botão `Sincronizar` deve usar dados simulados.

Comportamento:

- Ler dados locais mockados.
- Criar/atualizar zonas, bairros, ruas e atribuições.
- Salvar tudo no WatermelonDB.
- Registrar data da última carga em `app_metadata`.
- Exibir loading.
- Exibir sucesso.
- Exibir erro simulado quando necessário.
- Não depender de internet real.

Exemplo de contrato futuro:

```ts
export interface SyncGateway {
  pullAssignments(): Promise<PullAssignmentsResult>;
  pushPendingRecords(): Promise<PushRecordsResult>;
}
```

Implementação permitida na Fase 1:

```text
MockSyncGateway
```

Implementações proibidas na Fase 1 sem aprovação:

```text
ApiSyncGateway
BackendSyncGateway
WebDatabaseConnection
```

---

## 14. Sincronização final provisória

A sincronização final na Fase 1 será uma simulação.

Comportamento:

1. Buscar registros com status `pending` ou `error`.
2. Mostrar quantidade de pendências.
3. Ao clicar em `Sincronizar`, mudar status para `syncing`.
4. Simular envio.
5. Em sucesso, mudar para `synced`.
6. Em falha, mudar para `error`.
7. Registrar `sync_attempts`.
8. Registrar `last_sync_error` quando houver erro.
9. Não apagar registros locais.
10. Exibir feedback claro ao usuário.

---

## 15. Gerenciamento de estado

Não usar Redux, Zustand ou biblioteca global complexa na Fase 1.

Usar:

```text
Estado local
React Hook Form
Context API
Hooks próprios
WatermelonDB observável quando necessário
```

Divisão recomendada:

```text
Estado do formulário
└── React Hook Form

Sessão autenticada
└── AuthContext

Conectividade
└── ConnectivityContext

Sincronização
└── SyncContext

Dados persistentes
└── Repository + WatermelonDB
```

Regras:

- Context não substitui banco.
- Context não executa regra de negócio complexa.
- Context não deve conter cópias desnecessárias de listas inteiras.
- Dados persistentes devem ser recuperados via Repository.
- Telas usam Services e hooks, não WatermelonDB direto.

---

## 16. Validação de formulários

Usar:

```text
React Hook Form + Zod
```

Responsabilidades:

- React Hook Form controla preenchimento, estado do formulário e erros.
- Zod define obrigatoriedade, formatos e validações de entrada.
- Service executa regras de negócio.
- Repository salva o dado validado.

Fluxo:

```text
Usuário preenche
  ↓
React Hook Form
  ↓
Zod
  ↓
Service
  ↓
Repository
  ↓
WatermelonDB
```

---

## 17. Padrões de código

### 17.1. TypeScript

Usar TypeScript em todo o código.

Evitar:

```ts
any
```

Quando não houver tipo definido, criar tipo em `src/types/`.

### 17.2. Nomenclatura

Usar nomes em inglês para código:

```text
Household
Establishment
RiskPoint
Assignment
Street
Neighborhood
SyncQueue
```

Textos exibidos ao usuário devem estar em português.

### 17.3. Services

Services devem representar ações do sistema.

Exemplos:

```ts
HouseholdService.createDraft(...)
HouseholdService.updateDraft(...)
HouseholdService.submit(...)
SavassiService.calculate(...)
SynchronizationService.pullInitialAssignments(...)
SynchronizationService.pushPendingRecords(...)
```

### 17.4. Repositories

Repositories devem esconder detalhes do WatermelonDB.

Exemplos:

```ts
HouseholdRepository.create(...)
HouseholdRepository.update(...)
HouseholdRepository.findById(...)
HouseholdRepository.findByStreet(...)
SyncQueueRepository.enqueue(...)
SyncQueueRepository.remove(...)
```

### 17.5. Screens

Screens devem:

- montar a interface;
- chamar hooks/services;
- exibir estados de loading, erro e sucesso;
- não conter SQL, queries diretas ou chamadas diretas ao banco;
- não conter cálculo da Escala Coelho-Savassi.

### 17.6. Componentes

Componentes devem ser reutilizáveis e simples.

Exemplos:

```text
Button
Input
Select
Checkbox
ScreenContainer
OfflineBanner
SyncStatus
FormSection
```

---

## 18. Tratamento de erros

O app deve tratar erros de forma simples e compreensível para o agente de campo.

Mensagens técnicas não devem aparecer para o usuário final.

Exemplos:

```text
Não foi possível salvar agora. Tente novamente.
Cadastro salvo no aparelho.
Não foi possível capturar o GPS. Você pode continuar o cadastro.
Sincronização concluída.
Alguns registros não foram sincronizados.
```

Logs técnicos podem existir no ambiente de desenvolvimento, mas não devem poluir a interface.

---

## 19. Acessibilidade e usabilidade em campo

O app deve considerar uso em rua, com pressa, luz forte e conexão instável.

Priorizar:

- textos claros;
- botões grandes;
- contraste adequado;
- formulários curtos;
- feedback visível;
- poucos passos;
- indicação de modo offline;
- confirmação após salvar;
- recuperação de rascunhos;
- prevenção de perda de dados.

---

## 20. Segurança mínima na Fase 1

Mesmo com autenticação provisória:

- Não salvar senhas reais em texto puro.
- Não expor dados desnecessários em logs.
- Separar autenticação simulada de autenticação real futura.
- Preparar camada para troca futura por API.
- Não inserir chaves secretas no repositório.
- Não criar integrações externas sem autorização.

---

## 21. Sincronização real ainda não decidida

A equipe ainda não decidiu:

- mecanismo de sincronização;
- ferramenta de sincronização;
- protocolo entre mobile e backend;
- banco central;
- stack do backend;
- stack do sistema web.

Portanto, o agente não está autorizado a escolher essas tecnologias sozinho.

Permitido:

- Criar interfaces abstratas.
- Criar mocks.
- Preparar campos técnicos.
- Preparar fila local.
- Simular sincronização.

Proibido sem aprovação:

- Escolher backend.
- Criar API real.
- Criar banco central.
- Escolher mecanismo real de sync.
- Conectar diretamente app e sistema web.
- Fazer sistema web acessar WatermelonDB.

---

## 22. Evoluções futuras documentadas

Funcionalidades previstas para depois do MVP:

- Backend/API real.
- Banco central.
- Sistema web.
- Gestão de usuários.
- Gestão territorial completa.
- Mapas.
- Dashboards.
- Relatórios.
- Exportação CSV.
- Exportação GeoJSON.
- Conflitos de sincronização resolvidos no sistema web.
- Fotografias e anexos.
- Tabela `attachments`.
- Entrevistas com lideranças comunitárias.
- Eventos de alteração territorial.
- Integrações externas.
- Suporte multi-município.
- Recursos avançados de BI.

---

## 23. Checklist obrigatório antes de concluir uma tarefa

Antes de finalizar qualquer implementação, o agente deve verificar:

```text
[ ] Li este AGENTS.md.
[ ] Verifiquei se há código relevante em prototype/.
[ ] Mantive fidelidade ao protótipo.
[ ] Não modifiquei prototype/.
[ ] Não criei funcionalidades fora do MVP.
[ ] Respeitei Screen → Service → Repository → WatermelonDB.
[ ] Nenhuma Screen acessa WatermelonDB diretamente.
[ ] Não criei tabelas de famílias, moradores ou pacientes.
[ ] Não adicionei fotos ou anexos no MVP.
[ ] Não escolhi backend, banco central ou sincronização real.
[ ] Mantive Android como prioridade e iOS como compatibilidade futura.
[ ] Usei TypeScript.
[ ] Usei validação adequada.
[ ] Preservei funcionamento offline.
[ ] Mantive rascunhos automáticos.
[ ] Tratei falha de GPS sem bloquear cadastro.
[ ] Atualizei ou respeitei migrations do WatermelonDB.
[ ] Não salvei senha real no banco local.
[ ] Testei o fluxo alterado.
```

---

## 24. Critérios de aceite da Fase 1

A Fase 1 será considerada concluída quando:

1. O projeto Expo abrir no Android via Development Build.
2. O app tiver navegação funcional entre as telas do MVP.
3. As telas estiverem fiéis ao protótipo em `prototype/`.
4. O login provisório funcionar.
5. A primeira sincronização provisória carregar bairros e ruas.
6. O painel de trabalho listar as atribuições offline.
7. O agente conseguir abrir uma rua.
8. O agente conseguir cadastrar domicílio offline.
9. O agente conseguir cadastrar estabelecimento offline.
10. O agente conseguir cadastrar ponto de risco offline.
11. O cadastro de domicílio calcular a Escala de Risco Familiar de Coelho-Savassi conforme o protótipo.
12. Falha de GPS não bloquear nenhum cadastro.
13. Rascunhos forem salvos automaticamente.
14. Registros finalizados entrarem na fila de sincronização.
15. A sincronização final provisória atualizar os estados dos registros.
16. WatermelonDB estiver configurado com schema e migrations.
17. A arquitetura `Screen → Service → Repository → WatermelonDB` estiver respeitada.
18. Não houver backend real implementado sem autorização.
19. Não houver sistema web implementado sem autorização.
20. Não houver dados de famílias, moradores, pacientes ou anexos no schema inicial.

---

## 25. Orientação final ao agente

Implemente primeiro a base correta, não tente resolver tudo de uma vez.

A prioridade da Fase 1 é:

```text
1. Estrutura do projeto
2. Fidelidade ao protótipo
3. Arquitetura simples
4. Banco local offline-first
5. Rascunhos e fila local
6. Simulação de sincronização
```

Não antecipe decisões que ainda não foram tomadas pela equipe.

Quando houver dúvida, pare, registre a dúvida e peça confirmação.

---

## 26. Log de Decisões Técnicas e Soluções (Fase 1)

Durante a implementação do MVP (Fase 1), foram tomadas as seguintes decisões técnicas para viabilizar a arquitetura e resolver problemas específicos da stack React Native + WatermelonDB:

1. **WatermelonDB: Colisão da propriedade \`syncStatus\`**
   - O \`Model\` base do WatermelonDB possui um getter interno chamado \`syncStatus\`.
   - Nossa lógica de negócio offline-first exige estados customizados (\`draft\`, \`pending\`, etc.). Para evitar erro de compilação (\`TS2610\`) de redefinição de propriedades internas, o campo das classes modelos (e nos tipos de update) foi renomeado de \`syncStatus\` para \`appSyncStatus\`, mapeando para a coluna \`sync_status\` do banco.

2. **Erro: Cannot assign to read-only property 'NONE' no Event.js**
   - Este é um problema conhecido de incompatibilidade entre o "loose mode" do Babel (exigido por alguns plugins) e as classes imutáveis internas do React Native moderno (0.74+).
   - **Solução adotada:** Aplicamos um patch usando \`patch-package\` no arquivo \`node_modules/react-native/src/private/webapis/dom/events/Event.js\` para silenciar a atribuição de propriedades estáticas protegidas via \`Object.defineProperty\`.

3. **Incompatibilidade TypeScript em React Hook Form + Zod**
   - O uso de valores com \`.default()\` no Zod faz com que o tipo inferido final trate os campos como obrigatórios, gerando conflito com as opções de default do \`useForm\`.
   - **Solução adotada:** Foi usado um cast explícito (\`as any\`) no \`zodResolver()\` e nos \`defaultValues\` dentro das telas (\`HouseholdFormScreen\` e \`RiskPointFormScreen\`) para suprimir o falso-positivo técnico sem perder o runtime e a segurança da tipagem nas views.

4. **Tradução visual (Cores Lovable)**
   - O protótipo web utilizava o formato \`oklch\` no CSS (\`oklch(0.55 0.22 260)\`), que não é nativo do React Native.
   - Os valores foram convertidos via Node para Hex (A cor Primária exata converteu para \`#0766EE\` azul vibrante, e não roxo). Esses valores estão estáticos em \`src/theme/index.ts\`.

5. **Ícones**
   - O Lovable usa Lucide. Foi mantido o pacote \`lucide-react-native\` em conjunto com a dependência nativa \`react-native-svg\`.

6. **Estilo condicional de componentes nativos (Input)**
   - O React Native quebra a renderização caso propriedades condicionais booleanas caiam como números em estilos de array.
   - Expressões de presença (como ícones dinâmicos no \`Input\`) devem utilizar coerção forçada \`!!iconLeft && { paddingLeft: ... }\` para segurança.
