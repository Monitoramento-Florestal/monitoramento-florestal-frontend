# Relatorio Geral do Sistema Arbor

## Objetivo do documento
Este documento consolida a revisao estrutural do sistema Arbor no frontend e transforma a leitura atual do projeto em uma documentacao operacional. O foco aqui e responder, com base no que ja foi implementado:

- quais telas existem hoje
- qual o grau de maturidade de cada tela
- quais fluxos de backend sao necessarios para suportar o sistema
- quais entidades e contratos o backend precisa expor
- o que ainda esta faltando para considerar o sistema completo

Este material foi montado para servir como base de:

- analise funcional
- alinhamento entre frontend e backend
- planejamento de backlog
- definicao de prioridades
- revisao de escopo do produto

---

## Fontes da analise
O levantamento foi feito principalmente a partir destes nucleos do projeto:

- [src/app](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app)
- [src/components/features](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features)
- [src/services](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/services)
- [src/types](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/types)
- [src/constants/routes.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/constants/routes.ts)
- [src/utils/dashboard.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/utils/dashboard.ts)

---

## Sumario executivo
O Arbor ja possui uma base estrutural forte no frontend. A aplicacao ja conta com:

- dashboards autenticados por role
- shell compartilhado de dashboard
- mapa publico e autenticado
- gerenciamento de arvores
- historico de registros por arvore
- fila de aprovacoes
- fundacao de autenticacao com `AuthContext`, `axios` e refresh token

Ao mesmo tempo, a maior parte das features de negocio ainda nao esta integrada a um backend real. O sistema atualmente apresenta este retrato:

- a arquitetura de frontend esta madura o suficiente para crescer
- o modelo de dominio comecou a ficar correto para arvore, registro e aprovacao
- a maior parte das telas ainda opera em cima de mocks
- a camada de services por dominio ainda esta muito incompleta

Em termos praticos:

- a base visual e estrutural do produto existe
- os fluxos centrais comecaram a ser modelados corretamente
- o principal gap atual e transformar mock em integracao real

---

## Visao geral da arquitetura atual

### Organizacao principal
O sistema esta dividido, em alto nivel, em:

- `src/app`: rotas e paginas
- `src/components/features`: features de interface por dominio
- `src/components/ui`: primitives reutilizaveis
- `src/contexts`: contexto de sessao
- `src/services`: integracao HTTP e storages
- `src/types`: contratos de dominio do frontend
- `src/utils`: filtros, politicas, helpers e queries locais

### Pontos fortes atuais
- Layout de dashboard compartilhado bem definido
- Header por pagina ja padronizado
- Navegacao por role centralizada
- Dominio de `tree`, `record` e `approval request` comecando a ser refletido em tipos
- Fundacao de auth com refresh ja preparada

### Pontos fracos atuais
- Baixa cobertura de backend real
- Poucos services por dominio
- Uso forte de:
  - `mockTrees`
  - `mockApprovalRequests`
- Dashboards ainda com numeros hardcoded
- Gestao de usuarios ainda vazia
- Fluxo real de auth ainda nao conectado a telas

---

## Legenda de classificacao das telas

- `Implementada`: tela com comportamento real de frontend e fluxo minimamente completo
- `Mock`: tela navegavel e bem composta, mas usando mocks no lugar de API
- `Parcial`: tela com UI e parte do fluxo prontos, mas sem integracao real
- `Scaffold`: placeholder ou estrutura muito inicial

---

## Inventario completo de telas

### Telas publicas

| Rota | Objetivo | Status | Observacoes |
|---|---|---|---|
| `/` | Landing/Home | Parcial | precisa revisao funcional e definicao do papel exato |
| `/login` | Autenticacao | Parcial | UI pronta, sem login real |
| `/cadastro` | Cadastro de cidadao | Parcial | sem integracao com backend |
| `/password-reset` | Solicitar redefinicao de senha | Parcial | sem integracao |
| `/password-reset/verify` | Verificar token de redefinicao | Parcial | sem integracao |
| `/password-reset/new` | Definir nova senha | Parcial | sem integracao |
| `/password-reset/success` | Confirmacao do fluxo de reset | Parcial | etapa terminal do fluxo |
| `/(public)/map` | Mapa publico em modo leitura | Mock | usa `mockTrees` |

### Citizen

| Rota | Objetivo | Status | Observacoes |
|---|---|---|---|
| `/citizen` | Dashboard do cidadao | Parcial | metricas hardcoded e problemas de encoding |
| `/citizen/map` | Mapa autenticado do cidadao | Scaffold | ainda nao usa o mapa real autenticado |
| `/citizen/profile` | Perfil do cidadao | Parcial | sem persistencia real |

### Researcher

| Rota | Objetivo | Status | Observacoes |
|---|---|---|---|
| `/researcher` | Dashboard do pesquisador | Parcial | dados hardcoded |
| `/researcher/map` | Mapa autenticado | Mock | usa `AuthenticatedMapScreen` |
| `/researcher/profile` | Perfil | Parcial | sem persistencia real |
| `/researcher/trees` | Gerenciamento de arvores | Mock | bem estruturada, sem API |
| `/researcher/trees/new` | Criar arvore + registro inicial | Mock | usa `TreeRecordFormScreen` |
| `/researcher/trees/[treeId]/history` | Historico da arvore | Mock | usa `TreeHistoryScreen` |
| `/researcher/trees/[treeId]/records/new` | Criar novo registro em arvore existente | Mock | fluxo correto no front |
| `/researcher/trees/[treeId]/history/[recordId]/edit` | Solicitar edicao de registro historico | Mock | fluxo correto no front |

### Manager

| Rota | Objetivo | Status | Observacoes |
|---|---|---|---|
| `/manager` | Dashboard do gestor | Scaffold | ainda muito inicial |
| `/manager/map` | Mapa autenticado | Mock | usa mapa autenticado com mocks |
| `/manager/profile` | Perfil | Parcial | sem persistencia real |
| `/manager/approvals` | Fila de aprovacao | Mock | base visual boa |
| `/manager/management` | Gerenciamento de arvores | Mock | mesma base do admin |
| `/manager/trees/new` | Criar arvore | Mock | formulario pronto, sem API |
| `/manager/users` | Gestao de usuarios | Scaffold | placeholder |
| `/manager/management/[treeId]/history` | Historico da arvore | Mock | pronto no front |
| `/manager/management/[treeId]/records/new` | Novo registro | Mock | pronto no front |
| `/manager/management/[treeId]/history/[recordId]/edit` | Editar registro | Mock | pronto no front |

### Admin

| Rota | Objetivo | Status | Observacoes |
|---|---|---|---|
| `/admin` | Dashboard administrativo | Parcial | dados hardcoded |
| `/admin/map` | Mapa autenticado | Mock | baseado em mocks |
| `/admin/profile` | Perfil | Parcial | sem persistencia real |
| `/admin/approvals` | Fila de aprovacao | Mock | usa `mockApprovalRequests` |
| `/admin/management` | Gerenciamento de arvores | Mock | usa `mockTrees` |
| `/admin/trees/new` | Criar arvore | Mock | usa `TreeRecordFormScreen` |
| `/admin/users` | Gestao de usuarios | Scaffold | placeholder |
| `/admin/management/[treeId]/history` | Historico da arvore | Mock | pronto no front |
| `/admin/management/[treeId]/records/new` | Novo registro | Mock | pronto no front |
| `/admin/management/[treeId]/history/[recordId]/edit` | Editar registro | Mock | pronto no front |

---

## Features centrais e maturidade

### Dashboard
Arquivos principais:

- [RoleDashboardLayout.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/dashboard/RoleDashboardLayout.tsx)
- [DashboardShell.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/dashboard/DashboardShell.tsx)
- [DashboardSidebar.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/dashboard/DashboardSidebar.tsx)
- [DashboardPageHeader.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/dashboard/DashboardPageHeader.tsx)

Leitura:

- O shell compartilhado esta bom
- A navegacao por role esta bem centralizada
- O sistema ja tem uma boa base para crescer sem retrabalho
- O problema esta mais no conteudo das paginas do que na infra de dashboard

### Auth
Arquivos principais:

- [AuthContext.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/contexts/AuthContext.tsx)
- [api.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/services/api/api.ts)
- [tokenStorage.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/services/storage/tokenStorage.ts)
- [userStorage.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/services/storage/userStorage.ts)

Leitura:

- O refresh token ja foi pensado
- Os interceptors ja existem
- A integracao real com login ainda nao existe
- O fluxo de `me` ainda precisa ser consolidado

### Map
Arquivos principais:

- [MapView.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/map/MapView.tsx)
- [AuthenticatedMapScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/map/AuthenticatedMapScreen.tsx)
- [TreeDetailPanel.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/map/treeDetail/TreeDetailPanel.tsx)

Leitura:

- Mapa publico e autenticado ja existem visualmente
- Painel de detalhe da arvore ja existe
- Ja ha conexao conceitual com historico
- Falta backend real
- O contrato de mapa nao deve ser o mesmo contrato de listagem administrativa de arvores
- O mapa precisa ser tratado como leitura espacial por viewport, com payload leve
- O detalhe da arvore deve ser buscado sob demanda
- O historico deve continuar como rota separada

### Tree Management
Arquivos principais:

- [TreeManagementScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeManagement/TreeManagementScreen.tsx)
- [TreeManagementTable.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeManagement/TreeManagementTable.tsx)
- [treeManagement.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/utils/treeManagement.ts)

Leitura:

- O front ja diferencia a gestao por role
- A feature esta montada
- Falta trocar mock por services reais

### Tree Records / History
Arquivos principais:

- [TreeRecordFormScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeRecords/TreeRecordFormScreen.tsx)
- [TreeHistoryScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeRecords/TreeHistoryScreen.tsx)
- [treeRecords.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/utils/treeRecords.ts)
- [trees.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/types/trees.ts)

Leitura:

- Essa e a feature mais madura conceitualmente
- O front ja modela criacao de arvore, novo registro, edicao e historico
- A estrutura de dominio ja comecou a ficar coerente
- A integracao real ainda nao chegou

### Approvals
Arquivos principais:

- [ApprovalsScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/approvals/ApprovalsScreen.tsx)
- [ApprovalRecordCard.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/approvals/ApprovalRecordCard.tsx)
- [approvals.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/utils/approvals.ts)

Leitura:

- A UI ja suporta busca e filtro
- Rejeicao com motivo ja existe
- O fluxo ja caminha para `approval requests`
- Falta camada real de backend

---

## Modelo de dominio ja sugerido pelo frontend

### Tree
Entidade estavel do sistema:

- `id`
- `codigo`
- `nomeComum`
- `especie`
- `lat`
- `lng`

### TreeMeasurementRecord
Entidade historica de medicao:

- `id`
- `treeId`
- `kind`
- `version`
- `status`
- `localizacao`
- `dimensoes`
- `condicao`
- `estruturaRisco`
- `conflitos`
- `manejo`
- `registro`
- `observacoes`

### TreeApprovalRequest
Entidade administrativa de fluxo:

- `type`
- `status`
- `submittedAt`
- `submittedBy`
- `targetRecordId`
- `treeMeta`
- `treeDraft`
- `record`

### Conclusao do dominio
O frontend ja aponta de maneira clara para um modelo mais correto:

- `Tree`
- `TreeMeasurementRecord`
- `TreeApprovalRequest`

Isso e um dos maiores ativos atuais do projeto, porque ajuda a orientar o backend e evitar modelagens pobres como “arvore unica com estado sobrescrito”.

---

## Rotas de backend necessarias

## Auth

### `POST /auth/login`
Uso:

- `/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "user": {
    "id": "uuid",
    "name": "Nome",
    "email": "user@example.com",
    "role": "citizen"
  }
}
```

### `POST /auth/refresh`
Uso:

- refresh automatico do `axios`

Request:

```json
{
  "refreshToken": "jwt"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt"
}
```

### `POST /auth/register`
Uso:

- `/cadastro`

Request:

```json
{
  "name": "Nome",
  "email": "user@example.com",
  "password": "string",
  "confirmPassword": "string"
}
```

Response:

```json
{
  "message": "Conta criada com sucesso"
}
```

### `POST /auth/password-reset/request`
Uso:

- `/password-reset`

Request:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "message": "Se houver conta, enviaremos instrucoes"
}
```

### `GET /auth/password-reset/verify?token=...`
Uso:

- `/password-reset/verify`

Request:

```json
{
  "token": "reset-token"
}
```

Response:

```json
{
  "valid": true,
  "expiresAt": "2026-05-26T12:00:00Z"
}
```

### `POST /auth/password-reset/confirm`
Uso:

- `/password-reset/new`

Request:

```json
{
  "token": "reset-token",
  "password": "string",
  "confirmPassword": "string"
}
```

Response:

```json
{
  "message": "Senha redefinida com sucesso"
}
```

### `GET /auth/me`
Uso:

- hidratar sessao
- validar refresh real
- bootstrap do perfil do usuario

Request:

```json
{}
```

Response:

```json
{
  "id": "uuid",
  "name": "Nome",
  "email": "user@example.com",
  "role": "admin"
}
```

## Perfil

### `GET /users/me`
Uso:

- todas as telas de perfil

Request:

```json
{}
```

Response:

```json
{
  "id": "uuid",
  "name": "Nome",
  "email": "user@example.com",
  "cpf": "00000000000",
  "role": "researcher"
}
```

### `PATCH /users/me`
Uso:

- atualizar dados pessoais

Request:

```json
{
  "name": "Novo nome",
  "email": "novo@email.com",
  "cpf": "00000000000"
}
```

Response:

```json
{
  "message": "Perfil atualizado",
  "user": {}
}
```

### `POST /users/me/change-password`
Uso:

- alterar senha

Request:

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

Response:

```json
{
  "message": "Senha atualizada"
}
```

## Gestao de usuarios

### `GET /users`
Uso:

- `/admin/users`
- `/manager/users`

Request:

```json
{
  "role": "researcher",
  "status": "active",
  "search": "ana",
  "page": 1,
  "limit": 20
}
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Nome",
      "email": "email",
      "role": "researcher",
      "active": true
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 54
}
```

### `POST /users`
Uso:

- criacao interna de usuario, se a regra de negocio incluir isso

### `PATCH /users/:id`
Uso:

- atualizar role
- ativar ou desativar
- ajustar permissao

### `DELETE /users/:id`
Uso:

- remocao ou desativacao, a depender da regra

## Dashboard publico e indicadores

### `GET /public/dashboard`
Uso:

- landing
- dashboard cidadao
- dados publicos resumidos

Request:

```json
{}
```

Response:

```json
{
  "totalTrees": 42,
  "healthyTrees": 30,
  "treesUnderMonitoring": 7,
  "removedTrees": 5
}
```

## Map

### Estrategia recomendada para o mapa
O consumo de arvores no mapa nao deve ser modelado como um simples `GET /trees` que retorna toda a base. Para o caso do Arbor, o correto e separar:

- leitura espacial leve para plotagem de pontos
- leitura detalhada sob demanda
- historico separado por arvore
- leitura administrativa paginada fora do contexto espacial

Com isso, evitamos:

- trazer payload pesado demais para o mapa
- trafegar historico, conflitos e estrutura completa em toda movimentacao
- tratar o mapa como uma listagem administrativa comum

### `GET /map/trees`
Uso:

- mapa publico
- mapas autenticados
- busca espacial baseada no viewport

Observacao:

- este endpoint deve ser orientado por `bbox` e `zoom`
- em zoom baixo, o backend pode devolver clusters
- em zoom alto, o backend pode devolver arvores individuais
- o payload deve ser minimo, suficiente apenas para plotagem e resumo inicial

Request:

```json
{
  "bbox": {
    "minLng": -34.96,
    "minLat": -8.03,
    "maxLng": -34.92,
    "maxLat": -8.0
  },
  "zoom": 15,
  "status": "saudavel",
  "search": "ipe",
  "species": "Handroanthus impetiginosus",
  "includeCut": false,
  "limit": 300
}
```

Response base:

```json
{
  "items": [
    {
      "type": "tree",
      "id": "uuid",
      "codigo": "UFRPE-1001",
      "nomeComum": "Ipe-roxo",
      "especie": "Handroanthus impetiginosus",
      "lat": -8.01,
      "lng": -34.94,
      "status": "saudavel",
      "ultimaMedicao": "2026-05-01"
    }
  ],
  "meta": {
    "totalInView": 128,
    "returned": 128,
    "zoom": 15
  }
}
```

Response com clusters, se necessario:

```json
{
  "mode": "clusters",
  "items": [
    {
      "type": "cluster",
      "id": "cluster_a1",
      "lat": -8.011,
      "lng": -34.944,
      "count": 37
    },
    {
      "type": "tree",
      "id": "uuid",
      "codigo": "UFRPE-1001",
      "lat": -8.0123,
      "lng": -34.9432,
      "status": "saudavel"
    }
  ]
}
```

### `GET /map/trees/:treeId/detail`
Uso:

- painel de detalhe do mapa, se quiser contrato especializado para mapa

Observacao:

- este endpoint pode existir como versao otimizada de detalhe
- alternativamente, o sistema pode reaproveitar `GET /trees/:treeId`

Request:

```json
{
  "treeId": "uuid"
}
```

Response:

```json
{
  "id": "uuid",
  "codigo": "UFRPE-1001",
  "nomeComum": "Ipe-roxo",
  "especie": "Handroanthus impetiginosus",
  "lat": -8.01,
  "lng": -34.94,
  "currentRecord": {
    "id": "uuid",
    "status": "saudavel",
    "alturaM": 15.7,
    "dapCm": 24.2,
    "copaM": 8.1,
    "ultimaMedicao": "2026-05-01"
  }
}
```

### Consideracoes de frontend para o mapa

- o frontend deve consultar o endpoint do mapa no carregamento inicial
- o frontend deve refazer a consulta quando `bbox`, `zoom` ou filtros mudarem
- essa consulta deve usar `debounce`
- requests anteriores devem ser canceladas ao mover o mapa
- o painel de detalhe nao deve depender do payload bruto de listagem do mapa
- o historico deve continuar em tela separada, via rota da arvore

## Trees

### `GET /trees`
Uso:

- tree management
- listagens administrativas
- buscas paginadas fora do contexto espacial

Request:

```json
{
  "search": "ipe",
  "status": "saudavel",
  "page": 1,
  "limit": 20,
  "includeCurrentRecord": true
}
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "codigo": "UFRPE-1001",
      "nomeComum": "Ipe-roxo",
      "especie": "Handroanthus impetiginosus",
      "lat": -8.01,
      "lng": -34.94,
      "currentRecord": {
        "id": "uuid",
        "status": "saudavel",
        "ultimaMedicao": "2026-05-01"
      }
    }
  ],
  "total": 42
}
```

### `GET /trees/:treeId`
Uso:

- detalhe de arvore em contexto geral
- contexto do historico
- contexto de criacao de registro
- contexto de edicao
- fallback caso o sistema nao queira endpoint especializado de detalhe para mapa

Request:

```json
{
  "treeId": "uuid"
}
```

Response:

```json
{
  "id": "uuid",
  "codigo": "UFRPE-1001",
  "nomeComum": "Ipe-roxo",
  "especie": "Handroanthus impetiginosus",
  "lat": -8.01,
  "lng": -34.94,
  "currentRecord": {}
}
```

### `POST /trees`
Uso:

- criacao direta de arvore por admin e manager

Request:

```json
{
  "tree": {
    "nomeComum": "Ipe-roxo",
    "especie": "Handroanthus impetiginosus",
    "lat": -8.01,
    "lng": -34.94
  },
  "initialRecord": {
    "localizacao": {},
    "dimensoes": {},
    "condicao": {},
    "estruturaRisco": {},
    "conflitos": {},
    "manejo": {},
    "observacoes": "string",
    "fotos": []
  }
}
```

Response:

```json
{
  "treeId": "uuid",
  "recordId": "uuid"
}
```

### `DELETE /trees/:treeId`
Uso:

- exclusao definitiva por admin e manager

Request:

```json
{
  "treeId": "uuid"
}
```

Response:

```json
{
  "message": "Arvore removida permanentemente"
}
```

## Records / Measurements

### `GET /trees/:treeId/records`
Uso:

- historico da arvore

Request:

```json
{
  "treeId": "uuid"
}
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "version": 3,
      "kind": "measurement",
      "status": "saudavel",
      "localizacao": {},
      "dimensoes": {},
      "condicao": {},
      "estruturaRisco": {},
      "conflitos": {},
      "manejo": {},
      "registro": {},
      "observacoes": "string"
    }
  ]
}
```

### `GET /trees/:treeId/records/:recordId`
Uso:

- detalhe do registro
- edicao de registro
- futuras telas de leitura aprofundada

Request:

```json
{
  "treeId": "uuid",
  "recordId": "uuid"
}
```

### `POST /trees/:treeId/records`
Uso:

- novo registro direto por admin e manager

Request:

```json
{
  "localizacao": {},
  "dimensoes": {},
  "condicao": {},
  "estruturaRisco": {},
  "conflitos": {},
  "manejo": {},
  "observacoes": "string",
  "fotos": []
}
```

### `PATCH /trees/:treeId/records/:recordId`
Uso:

- edicao direta por admin e manager

Request:

```json
{
  "treeId": "uuid",
  "recordId": "uuid",
  "localizacao": {},
  "dimensoes": {},
  "condicao": {},
  "estruturaRisco": {},
  "conflitos": {},
  "manejo": {},
  "observacoes": "string",
  "fotos": []
}
```

### `DELETE /trees/:treeId/records/:recordId`
Uso:

- exclusao direta por admin e manager

Request:

```json
{
  "treeId": "uuid",
  "recordId": "uuid"
}
```

Observacao critica:

- se o registro removido for o vigente, o backend precisa recalcular qual passa a ser o `currentRecord`

## Approval Requests

### `GET /approval-requests`
Uso:

- `/admin/approvals`
- `/manager/approvals`

Request:

```json
{
  "type": "create_tree",
  "status": "pendente",
  "searchField": "researcher",
  "search": "ana",
  "page": 1,
  "limit": 20
}
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "type": "create_tree",
      "status": "pendente",
      "submittedAt": "2026-05-26T09:00:00Z",
      "submittedBy": "Nome",
      "treeId": null,
      "targetRecordId": null,
      "treeMeta": {},
      "treeDraft": {},
      "record": {}
    }
  ],
  "total": 12
}
```

### `GET /approval-requests/:id`
Uso:

- detalhe futuro da solicitacao

Request:

```json
{
  "approvalRequestId": "uuid"
}
```

### `POST /approval-requests/tree-creation`
Uso:

- pesquisador criando arvore com registro inicial

Request:

```json
{
  "treeDraft": {
    "nomeComum": "Ipe-roxo",
    "especie": "Handroanthus impetiginosus",
    "lat": -8.01,
    "lng": -34.94
  },
  "recordDraft": {}
}
```

### `POST /approval-requests/record-creation`
Uso:

- pesquisador criando nova medicao para arvore existente

Request:

```json
{
  "treeId": "uuid",
  "recordDraft": {}
}
```

### `POST /approval-requests/record-edit`
Uso:

- pesquisador solicitando edicao de registro

Request:

```json
{
  "treeId": "uuid",
  "targetRecordId": "uuid",
  "recordDraft": {}
}
```

### `POST /approval-requests/:id/approve`
Uso:

- aprovar solicitacao

Request:

```json
{
  "approvalRequestId": "uuid"
}
```

Response:

```json
{
  "message": "Solicitacao aprovada"
}
```

### `POST /approval-requests/:id/reject`
Uso:

- rejeitar solicitacao com motivo obrigatorio

Request:

```json
{
  "approvalRequestId": "uuid",
  "reason": "Medicoes inconsistentes"
}
```

Response:

```json
{
  "message": "Solicitacao rejeitada"
}
```

## Dashboards por papel

### `GET /dashboards/researcher`
### `GET /dashboards/admin`
### `GET /dashboards/manager`
### `GET /dashboards/citizen`

Request base:

```json
{}
```

Response base:

```json
{
  "stats": [],
  "recentActivity": [],
  "pendingCount": 3
}
```

---

## Gaps do sistema por dominio

### Auth
- Login ainda nao chama backend
- Cadastro ainda nao chama backend
- Password reset ainda nao esta fechado
- Sessao ainda depende demais de storage local

### Perfil
- Sem leitura real de dados
- Sem update real
- Sem mudanca real de senha

### Citizen
- Dashboard com metricas estaticas
- Mapa autenticado ainda scaffold
- Problemas de encoding visiveis

### Researcher
- Dominio de arvores e registros ja encaminhado
- Falta integracao real

### Manager
- Dashboard ainda muito inicial
- Gestao de usuarios ainda nao comecou
- Approvals e management tem base boa

### Admin
- Dashboard ainda com dados hardcoded
- Gestao de usuarios ainda placeholder
- Management e approvals ja tem boa base

### Map
- Dependencia total de mocks
- Falta service real de arvores georreferenciadas
- Falta endpoint espacial orientado por viewport
- Falta estrategia clara de clusterizacao para grande volume
- Falta contrato leve de plotagem separado do contrato administrativo
- Falta contrato de detalhe sob demanda para o painel lateral

### Trees / Records
- Dominio de front ja comeca a ficar correto
- Backend ainda precisa refletir esse desenho

### Approvals
- Fluxo visual existe
- Backend precisa operar sobre `approval request`

---

## Inconsistencias e riscos

- Existem problemas de encoding em algumas telas, especialmente no dominio de citizen
- Existem rotas previstas em [src/constants/routes.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/constants/routes.ts) que ainda nao existem no `src/app`, como:
  - `RESEARCHER_MEASUREMENTS`
  - `RESEARCHER_MEASUREMENTS_NEW`
  - `RESEARCHER_REPORTS`
  - `CITIZEN_REPORTS`
  - `MANAGER_EXPORT`
- Isso mostra backlog implicito ainda nao concretizado
- O sistema pode aparentar estar mais pronto do que realmente esta porque a camada visual ja avancou mais do que a camada de integracao

---

## O que falta para completar o sistema

### Alta prioridade
- Integrar auth real
- Integrar mapa real
- Integrar trees reais
- Integrar records e historico
- Integrar approvals
- Fechar contratos finais de backend para arvore, registro e solicitacao

### Media prioridade
- Dashboards por role com dados reais
- Perfil com persistencia
- Gestao de usuarios
- Mapa autenticado do cidadao

### Baixa prioridade
- Reports e export
- Refinamentos visuais
- Filtros e paginacao avancados
- Analytics administrativos

---

## Plano recomendado de fechamento

### Fase 1
Fechar contratos de backend para:

- auth
- trees
- records
- approval requests

### Fase 2
Ligar:

- login
- sessao
- perfil
- mapa publico
- mapa autenticado
- tree management

### Fase 3
Ligar:

- criacao de arvore
- criacao de registro
- edicao de registro
- historico
- approvals

### Fase 4
Ligar:

- dashboards por role
- users
- password reset completo

---

## Conclusao final
O Arbor ja deixou de ser um conjunto de telas isoladas. O sistema hoje ja possui:

- uma base arquitetural util
- um dominio de arvores e registros em amadurecimento
- uma estrutura de dashboard consistente
- um fluxo de aprovacao que ja comeca a fazer sentido

O principal problema atual nao e “falta de tela”.

O principal problema atual e a distancia entre:

- o frontend ja existente
- o dominio ja sugerido pelos tipos e fluxos
- e a integracao real com o backend

Em resumo:

- a fundacao existe
- o nucleo do produto ja foi desenhado no front
- o maior trabalho agora e consolidar contratos e integrar de verdade

---

## Proximo artefato recomendado
O passo mais util depois deste documento e gerar uma matriz operacional com colunas como:

- tela
- status atual
- endpoint necessario
- payload
- dependencia de auth
- dependencia de role
- o que falta
- prioridade

Essa matriz vira uma base pratica de execucao para organizar o backlog tecnico e funcional do sistema.
