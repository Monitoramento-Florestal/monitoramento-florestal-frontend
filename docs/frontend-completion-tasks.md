# Relatorio de Tasks do Frontend para Completude do Arbor

## Objetivo
Este documento organiza as tasks do frontend com foco em completude real do sistema. A ideia aqui nao e listar apenas melhorias pontuais, mas separar de forma clara:

- telas faltantes ou incompletas
- integracoes que ainda nao existem
- fixes estruturais, de consistencia e de qualidade

O objetivo final e responder:

- quais telas ainda faltam como produto
- quais telas existem, mas ainda nao funcionam de verdade
- quais fluxos centrais ainda dependem de mock
- quais ajustes precisam acontecer para o frontend estar pronto para fechamento

---

## Base analisada
O levantamento foi feito sobre:

- [src/app](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app)
- [src/components/features](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features)
- [src/services](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/services)
- [src/contexts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/contexts)
- [src/types](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/types)
- [src/utils](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/utils)

---

## Leitura executiva
O frontend do Arbor ja tem uma base estrutural forte:

- dashboards por role com shell compartilhado
- navegacao e header por pagina
- mapa publico e autenticado em nivel visual
- gerenciamento de arvores
- historico de registros
- formularios de criacao e edicao
- fila de aprovacoes
- fundacao de auth com `axios` e refresh token

Mas o sistema ainda nao esta completo porque:

- varias features centrais ainda usam mock
- a camada de services por dominio e muito pequena
- algumas telas ainda sao scaffold
- existem rotas previstas sem tela correspondente
- auth publica e auth autenticada ainda nao estao conectadas de ponta a ponta
- varios fluxos existem visualmente, mas nao funcionalmente

Em resumo:

- a arquitetura do frontend existe
- o nucleo de UI do produto ja foi modelado
- o maior gap atual e transformar estruturas visuais e mocks em fluxo real

---

## Como o backlog foi separado
As tasks foram organizadas em tres blocos:

1. `Telas`
2. `Integracao`
3. `Fixes e consistencia`

Isso ajuda a enxergar o que falta como produto, o que falta como engenharia de integracao e o que falta como acabamento estrutural.

---

# 1. Tasks de telas

## 1.1 Telas faltantes como feature real
Estas rotas existem, mas a feature ainda nao existe de verdade como tela funcional.

### `admin/users`
Status atual:
- scaffold simples

Task:
- construir a feature real de gestao de usuarios para admin

Entrega esperada:
- listagem real
- busca
- filtro por perfil/status
- acoes administrativas conforme backend

Arquivos relacionados:
- [src/app/(authenticated)/admin/users/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/admin/users/page.tsx)

### `manager/users`
Status atual:
- scaffold simples

Task:
- construir a feature real de gestao de usuarios para manager

Entrega esperada:
- listagem real
- busca
- filtro por perfil/status
- acoes permitidas ao gestor

Arquivos relacionados:
- [src/app/(authenticated)/manager/users/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/manager/users/page.tsx)

---

## 1.2 Telas existentes, mas incompletas como produto
Estas telas ja existem visualmente, mas ainda nao estao maduras como parte do sistema.

### Dashboard do manager
Status atual:
- scaffold

Task:
- transformar o dashboard do gestor em tela real com metricas e acoes

Arquivo:
- [src/app/(authenticated)/manager/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/manager/page.tsx)

### Dashboard do admin
Status atual:
- parcial, com conteudo hardcoded

Task:
- integrar dados reais e revisar prioridades de bloco

Arquivo:
- [src/app/(authenticated)/admin/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/admin/page.tsx)

### Dashboard do researcher
Status atual:
- parcial, com conteudo hardcoded

Task:
- integrar metricas reais e atividade recente

Arquivo:
- [src/app/(authenticated)/researcher/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/researcher/page.tsx)

### Dashboard do citizen
Status atual:
- parcial, com metricas estaticas e problemas de encoding

Task:
- integrar dados reais
- revisar copy e encoding

Arquivo:
- [src/app/(authenticated)/citizen/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/citizen/page.tsx)

### Mapa autenticado do citizen
Status atual:
- scaffold

Task:
- substituir placeholder por experiencia real de mapa autenticado

Arquivo:
- [src/app/(authenticated)/citizen/map/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/(authenticated)/citizen/map/page.tsx)

---

## 1.3 Rotas previstas sem tela correspondente
Estas rotas aparecem em [src/constants/routes.ts](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/constants/routes.ts), mas nao existem no `src/app`.

### Rotas identificadas
- `RESEARCHER_MEASUREMENTS`
- `RESEARCHER_MEASUREMENTS_NEW`
- `RESEARCHER_REPORTS`
- `CITIZEN_REPORTS`
- `MANAGER_EXPORT`

Task:
- decidir se entram como backlog real
- ou remover da constante ate virarem escopo oficial

Observacao:
- isso e task de tela e task de alinhamento de escopo

---

## 1.4 Telas publicas que existem, mas ainda nao fecharam o produto

### `/login`
Status atual:
- UI pronta, sem login real

### `/cadastro`
Status atual:
- UI pronta, sem cadastro real

### `/password-reset`
### `/password-reset/verify`
### `/password-reset/new`
### `/password-reset/success`
Status atual:
- fluxo visual pronto
- sem integracao real
- ainda com textos/encoding a revisar em partes do fluxo

Task:
- transformar o fluxo publico de auth em produto funcional real

---

# 2. Tasks de integracao

## 2.1 Auth e sessao

### Integrar login real
Task:
- conectar `/login` ao backend
- abrir sessao via `AuthContext`
- persistir token e refresh token
- redirecionar por role

### Integrar bootstrap de sessao
Task:
- ler sessao autenticada no carregamento
- validar sessao persistida
- integrar com `auth/me` ou equivalente

### Integrar cadastro de cidadao
Task:
- conectar `/cadastro` ao endpoint real

### Integrar password reset completo
Task:
- conectar:
  - solicitar recuperacao
  - verificar token/codigo
  - redefinir senha
  - sucesso final

Arquivos principais:
- [src/app/login/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/login/page.tsx)
- [src/app/cadastro/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/cadastro/page.tsx)
- [src/app/password-reset/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/password-reset/page.tsx)
- [src/app/password-reset/verify/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/password-reset/verify/page.tsx)
- [src/app/password-reset/new/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/password-reset/new/page.tsx)
- [src/app/password-reset/success/page.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/app/password-reset/success/page.tsx)

---

## 2.2 Services por dominio
Problema atual:
- existe `api.ts`, mas quase nao existem services reais por dominio

Task:
- criar services para:
  - auth
  - password reset
  - users
  - trees
  - records
  - approvals
  - dashboards

Objetivo:
- remover dependencia direta de mock
- evitar logica HTTP espalhada nas telas

---

## 2.3 Integracao do mapa

### Mapa publico
Task:
- integrar `/(public)/map` ao endpoint espacial real

### Mapas autenticados
Task:
- integrar:
  - `/researcher/map`
  - `/manager/map`
  - `/admin/map`
  - `/citizen/map`

### Hook espacial
Task:
- criar hook dedicado para leitura do mapa por viewport

Entrega esperada:
- leitura por `bbox`
- leitura por `zoom`
- debounce
- cancelamento de requests anteriores
- detalhe sob demanda

Arquivos principais:
- [src/components/features/map/MapView.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/map/MapView.tsx)
- [src/components/features/map/AuthenticatedMapScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/map/AuthenticatedMapScreen.tsx)
- [src/components/features/map/treeDetail/TreeDetailPanel.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/map/treeDetail/TreeDetailPanel.tsx)

---

## 2.4 Integracao de arvores, registros e historico
Problema atual:
- `mockTrees` ainda sustenta grande parte do sistema

Task:
- substituir `mockTrees` por backend real em:
  - tree management
  - detalhe da arvore
  - historico
  - create tree
  - create record
  - edit record

Entrega esperada:
- tree management real por role
- historico aprovado real
- submit real de formularios
- detalhes reais de arvore e registro

Arquivos principais:
- [src/components/features/treeManagement/TreeManagementScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeManagement/TreeManagementScreen.tsx)
- [src/components/features/treeRecords/TreeRecordFormScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeRecords/TreeRecordFormScreen.tsx)
- [src/components/features/treeRecords/TreeHistoryScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/treeRecords/TreeHistoryScreen.tsx)

---

## 2.5 Integracao da fila de aprovacoes
Problema atual:
- `mockApprovalRequests` ainda sustenta approvals

Task:
- integrar `/admin/approvals`
- integrar `/manager/approvals`

Entrega esperada:
- listagem real
- filtro real
- aprovacao real
- rejeicao com motivo real

Arquivos principais:
- [src/components/features/approvals/ApprovalsScreen.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/approvals/ApprovalsScreen.tsx)
- [src/components/features/approvals/ApprovalRecordCard.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/approvals/ApprovalRecordCard.tsx)

---

## 2.6 Integracao de perfil
Task:
- conectar `DashboardProfilePage` ao backend

Entrega esperada:
- carregar dados do usuario
- salvar perfil
- alterar senha

Arquivo principal:
- [src/components/features/dashboard/DashboardProfilePage.tsx](/C:/Users/Pichau/Documents/PastaJam/Codigo/Arbor/code/monitoramento-florestal-frontend/src/components/features/dashboard/DashboardProfilePage.tsx)

---

## 2.7 Integracao dos dashboards por role
Task:
- conectar dashboards de:
  - citizen
  - researcher
  - manager
  - admin

Entrega esperada:
- metricas reais
- pendencias reais
- atividade recente
- cards coerentes com o papel

---

## 2.8 Integracao de users
Task:
- criar a feature de users sobre endpoints reais

Entrega esperada:
- listagem
- busca
- filtro
- acoes administrativas disponiveis

---

# 3. Tasks de fixes e consistencia

## 3.1 Corrigir encoding e copy
Problema atual:
- varias telas publicas e do citizen ainda possuem texto quebrado

Task:
- revisar encoding e copy em:
  - login
  - cadastro
  - password reset
  - citizen dashboard
  - citizen map

---

## 3.2 Revisar rotas previstas e nao implementadas
Task:
- revisar `APP_ROUTES`
- remover ou oficializar rotas que ainda nao existem

Impacto:
- reduz backlog fantasma
- melhora clareza da arquitetura

---

## 3.3 Consolidar tipos de request e response da API
Task:
- criar tipos reais por dominio

Objetivo:
- evitar depender apenas de tipos de mock
- padronizar contratos reais

Blocos:
- auth
- users
- trees
- records
- approvals
- dashboards

---

## 3.4 Criar hooks por dominio
Task:
- encapsular consumo de services em hooks dedicados

Exemplos:
- `useLogin`
- `useProfile`
- `useTrees`
- `useTreeHistory`
- `useApprovals`
- `useUsers`
- `usePasswordReset`
- `useMapTrees`

---

## 3.5 Padronizar loading, error e empty states
Problema atual:
- a base visual existe, mas o comportamento real com API ainda nao foi consolidado

Task:
- padronizar:
  - loading inicial
  - loading de submit
  - erro de request
  - empty state real
  - feedback de sucesso

---

## 3.6 Revisar policies por role no frontend
Problema atual:
- varias telas ja comecaram a refletir regras de role, mas isso ainda precisa ser revisado contra o backend final

Task:
- revisar:
  - o que aparece por role
  - o que e editavel
  - o que e destrutivo
  - o que vira solicitacao

---

## 3.7 Revisar dependencias de mock
Task:
- remover ou isolar melhor:
  - `mockTrees`
  - `mockApprovalRequests`

Objetivo:
- deixar claro o que ainda e mock temporario
- evitar mistura de mock com fluxo produtivo

---

## Ordem recomendada de execucao

### Fase 1 — Fundacao
1. integrar login real
2. integrar bootstrap de sessao
3. criar services por dominio
4. consolidar tipos reais da API

### Fase 2 — Nucleo do produto
5. integrar mapa publico
6. integrar mapas autenticados
7. integrar tree management
8. integrar historico
9. integrar create tree / create record / edit record
10. integrar approvals

### Fase 3 — Auth publica e perfil
11. integrar cadastro
12. integrar password reset
13. integrar perfil

### Fase 4 — Telas administrativas e dashboards
14. transformar dashboard do manager em tela real
15. integrar dashboards por role
16. implementar users de admin e manager
17. substituir scaffold do mapa autenticado do citizen

### Fase 5 — Consistencia e acabamento
18. corrigir encoding e copy
19. revisar rotas pendentes
20. criar hooks por dominio
21. padronizar estados de loading/erro/empty
22. revisar policies por role
23. limpar dependencia de mocks

---

## Resumo das tasks candidatas a issues

### Bloco Telas
- Implementar feature real de users para admin
- Implementar feature real de users para manager
- Transformar dashboard do manager em tela real
- Integrar dashboards do researcher, admin e citizen
- Implementar mapa autenticado real do citizen
- Decidir e tratar rotas previstas sem tela correspondente

### Bloco Integracao
- Integrar login real
- Integrar sessao real
- Integrar cadastro
- Integrar password reset
- Criar services por dominio
- Integrar mapa publico
- Integrar mapas autenticados
- Criar hook de consulta espacial
- Integrar tree management
- Integrar historico
- Integrar formularios de registros
- Integrar approvals
- Integrar perfil
- Integrar users

### Bloco Fixes
- Corrigir encoding e copy
- Revisar rotas pendentes
- Consolidar tipos de API
- Criar hooks por dominio
- Padronizar loading/error/empty states
- Revisar policies por role
- Remover dependencia estrutural de mocks

---

## Conclusao
O frontend do Arbor ja tem estrutura suficiente para fechar o produto, mas ainda esta num estado intermediario entre:

- sistema com boa arquitetura visual
- sistema realmente funcional ponta a ponta

As principais tasks de completude do frontend se distribuem em tres frentes:

- fechar as telas que ainda faltam como produto real
- integrar as features centrais ao backend
- corrigir inconsistencias e consolidar a qualidade da aplicacao

O principal gargalo hoje nao e mais “desenhar interface”.  
O principal gargalo e:

- integrar
- substituir mocks
- consolidar fluxos
- terminar as areas ainda scaffold

Quando essas frentes forem concluídas, o frontend deixa de ser parcialmente simulado e passa a sustentar o fechamento real do Arbor.
