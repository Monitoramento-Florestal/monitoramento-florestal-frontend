# Relatorio de Tasks do Backend para Completude do Arbor

## Objetivo
Este documento organiza, em formato de backlog tecnico, as tasks necessarias para levar o backend do Arbor da branch `dev` ao nivel de completude exigido pelo sistema que ja vem sendo estruturado no frontend.

O foco aqui nao e apenas “listar endpoints faltantes”, mas fechar:

- consistencia de dominio
- cobertura funcional
- alinhamento com as regras de negocio
- aderencia ao frontend ja existente
- maturidade suficiente para concluir o projeto

---

## Escopo da analise
Este backlog foi montado a partir da leitura da branch `origin/dev` do backend local em:

- `C:\Users\Pichau\Documents\PastaJam\Codigo\Arbor\code\monitoramento-florestal-backend`

Arquivos-base considerados:

- controllers
- services
- entities
- DTOs
- repositories
- migrations
- security config

---

## Leitura executiva
O backend atual ja cobre parcialmente:

- autenticacao
- refresh token
- recuperacao de senha
- cadastro e listagem de usuarios
- CRUD inicial de arvores
- criacao de registros
- aprovacao e recusa de registros

Mas ainda nao cobre, de forma suficiente para o produto final:

- mapa geoespacial por viewport
- historico maduro de registros
- solicitacao de edicao de registro historico
- fluxo de approval request mais robusto
- dashboard data endpoints
- perfil autenticado completo
- alinhamento de permissao entre admin, gestor e pesquisador
- delecao conforme regra final
- consistencia entre coordenadas, mapa e dominio da arvore

---

## Criterios de prioridade

### P0
Bloqueia fluxos centrais do sistema ou cria conflito direto com a regra de negocio final.

### P1
Nao bloqueia a estrutura inteira, mas impede fechamento funcional de telas principais.

### P2
Melhoria de completude, governanca, consistencia ou refinamento tecnico.

---

# P0 — Tasks criticas para o fechamento do backend

## 1. Criar leitura espacial real para o mapa
**Prioridade:** P0  
**Impacto:** mapa publico, mapa autenticado, painel lateral, escalabilidade  
**Dependencias:** modelagem de coordenadas consistente

### Problema atual
Hoje o backend entrega arvores por leitura generica, mas nao existe um endpoint espacial orientado por viewport.

### Task
Criar um endpoint especifico para o mapa, separado da listagem administrativa de arvores.

### Entrega esperada
- endpoint dedicado para mapa
- filtro por `bbox`
- suporte a `zoom`
- payload leve para plotagem
- possibilidade futura de clusterizacao

### Sugestao de contrato
- `POST /api/map/trees/search`

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

### Observacoes
- nao reutilizar `GET /api/arvores` para esse caso
- detalhe de arvore deve ser buscado separadamente

---

## 2. Consolidar a modelagem geoespacial da arvore
**Prioridade:** P0  
**Impacto:** mapa, detalhe de arvore, integracao com frontend  
**Dependencias:** nenhuma

### Problema atual
As migrations mencionam PostGIS e `Point`, mas a entidade atual de `Arvore` nao sustenta claramente o contrato geoespacial esperado pelo frontend.

### Task
Revisar a modelagem da arvore para expor coordenadas de forma clara e consistente.

### Entrega esperada
- entidade `Arvore` com localizacao geografica consistente
- DTOs com latitude e longitude bem definidos
- service/controller com leitura apropriada para mapa e detalhe

### Decisoes necessarias
- manter `Point` interno no modelo e expor `lat/lng` no DTO
- padronizar SRID e formato de serializacao

---

## 3. Implementar detalhe de arvore orientado ao mapa
**Prioridade:** P0  
**Impacto:** painel lateral do mapa, navegacao para historico  
**Dependencias:** task 2

### Problema atual
Existe `GET /api/arvores/{id}`, mas o contrato ainda nao esta claramente orientado ao painel de detalhe do frontend.

### Task
Criar ou ajustar um endpoint de detalhe leve e adequado ao caso de uso do mapa.

### Entrega esperada
- dados base da arvore
- snapshot atual
- metadados suficientes para abrir historico

### Sugestao
- ou refinar `GET /api/arvores/{id}`
- ou criar `GET /api/map/trees/{id}/detail`

---

## 4. Formalizar o fluxo de edicao de registro historico por pesquisador
**Prioridade:** P0  
**Impacto:** historico, researcher flow, approvals  
**Dependencias:** modelagem de solicitacao

### Problema atual
Nao existe fluxo real para:
- selecionar um registro aprovado do historico
- propor edicao
- aguardar aprovacao
- substituir a versao vigente daquele registro

### Task
Implementar solicitacao de edicao de registro historico.

### Entrega esperada
- endpoint para criar solicitacao de edicao
- vinculo com o registro alvo
- status da solicitacao
- aprovacao e recusa do fluxo

### Contrato minimo esperado
```json
{
  "treeId": "uuid",
  "targetRecordId": "uuid",
  "recordDraft": {}
}
```

---

## 5. Enriquecer o modelo de approval request
**Prioridade:** P0  
**Impacto:** approvals, researcher, admin, manager  
**Dependencias:** task 4

### Problema atual
O backend usa `RegistroArvore` com `status`, mas isso nao cobre bem a diferenciacao entre:
- criacao de nova arvore
- novo registro
- edicao de registro

### Task
Definir um modelo mais robusto para aprovacao.

### Caminhos possiveis
1. Criar entidade explicita de `SolicitacaoRegistro`
2. Ou manter `RegistroArvore`, mas introduzir um tipo de solicitacao e regras de fluxo mais claras

### Entrega esperada
- capacidade de distinguir naturezas da fila
- filtros administrativos mais corretos
- melhor alinhamento com o frontend

---

## 6. Alinhar a regra de delecao de arvore com a regra final do produto
**Prioridade:** P0  
**Impacto:** tree management, admin/manager flow  
**Dependencias:** definicao de cascade sobre registros

### Problema atual
Hoje a arvore e desativada logicamente (`ativa = false`), mas a regra final do produto definida e delecao permanente.

### Task
Alterar o fluxo de delecao de arvore para refletir a regra final do sistema.

### Entrega esperada
- exclusao permanente da arvore
- definicao do comportamento dos registros associados
- revisao dos DTOs/responses relacionados

---

## 7. Restringir delecao direta de registro para perfis administrativos
**Prioridade:** P0  
**Impacto:** researcher flow, compliance com regra de negocio  
**Dependencias:** nenhuma

### Problema atual
O pesquisador responsavel pode deletar o proprio registro.

### Task
Rever regra de autorizacao de delecao de registro.

### Entrega esperada
- apenas admin/gestor podem deletar registro
- pesquisador nao executa delecao direta

---

# P1 — Tasks importantes para completude funcional

## 8. Implementar endpoints de perfil autenticado
**Prioridade:** P1  
**Impacto:** telas de perfil de todas as roles  
**Dependencias:** auth consolidado

### Task
Criar a camada de perfil autenticado.

### Entrega esperada
- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/users/me/change-password`

---

## 9. Criar endpoint `me` da sessao autenticada
**Prioridade:** P1  
**Impacto:** bootstrap da sessao no frontend  
**Dependencias:** auth

### Problema atual
O frontend tem `AuthContext` e refresh, mas falta um endpoint simples para hidratar sessao.

### Task
Criar endpoint de sessao autenticada.

### Entrega esperada
- `GET /api/auth/me`
- retorno com dados do usuario e papel

---

## 10. Implementar leitura de historico aprovado orientada ao frontend
**Prioridade:** P1  
**Impacto:** historico da arvore, detalhe, researcher/admin/manager flows  
**Dependencias:** tasks 4 e 5 fortalecem isso, mas pode ser iniciado antes

### Problema atual
Existe listagem de registros por arvore, mas o contrato ainda nao esta amadurecido como “historico aprovado” do sistema.

### Task
Refinar a leitura de historico da arvore.

### Entrega esperada
- endpoint de historico ordenado
- snapshot atual claramente definido
- possibilidade de abrir um registro especifico
- DTO mais aderente ao frontend

---

## 11. Criar endpoint de detalhe de registro
**Prioridade:** P1  
**Impacto:** edicao de registro, leitura futura de historico, modais ou drawers futuros  
**Dependencias:** nenhuma

### Task
Criar endpoint dedicado para um registro especifico.

### Entrega esperada
- `GET /api/registros/{id}`

---

## 12. Implementar edicao direta de registro por admin/gestor
**Prioridade:** P1  
**Impacto:** historico, management, admin/manager  
**Dependencias:** task 11

### Problema atual
O backend ainda nao expõe de forma clara o fluxo de editar um registro historico diretamente.

### Task
Criar update de registro historico com regra administrativa.

### Entrega esperada
- endpoint de update
- regras de autorizacao
- atualizacao correta do snapshot atual da arvore

---

## 13. Criar endpoints de dashboard por papel
**Prioridade:** P1  
**Impacto:** dashboards de admin, gestor, pesquisador e cidadao  
**Dependencias:** repositorios e agregacoes

### Task
Criar endpoints agregadores para os dashboards.

### Entrega esperada
- dashboard do pesquisador
- dashboard do gestor
- dashboard do admin
- dashboard do cidadao

### Indicadores esperados
- totais
- atividade recente
- pendencias
- contagens por status

---

## 14. Liberar mapa publico anonimo
**Prioridade:** P1  
**Impacto:** experiencia publica do sistema  
**Dependencias:** endpoint espacial do mapa

### Problema atual
O backend trata `PUBLICO_GERAL` como role autenticada, mas o frontend tem um mapa publico anonimo.

### Task
Ajustar o `SecurityConfig` para suportar o mapa publico sem login.

### Entrega esperada
- endpoints publicos do mapa liberados
- sem comprometer endpoints administrativos

---

## 15. Completar gestao de usuarios
**Prioridade:** P1  
**Impacto:** futuras telas de users  
**Dependencias:** revisao de autorizacao

### Task
Completar a camada administrativa de usuarios.

### Entrega esperada
- update de usuario
- ativacao/inativacao mais explicita
- revisao de regras por papel

---

# P2 — Tasks de refinamento estrutural e alinhamento

## 16. Revisar o papel do `ADMINISTRADOR` no controle de acesso
**Prioridade:** P2  
**Impacto:** coerencia entre frontend e backend  
**Dependencias:** nenhuma

### Problema atual
O enum existe, mas as regras de autorizacao estao muito centradas em `GESTOR`.

### Task
Revisar toda a matriz de permissao.

### Entrega esperada
- definicao clara do escopo de admin
- revisao de `@PreAuthorize`
- coerencia com as roles do frontend

---

## 17. Revisar DTOs para alinhamento com o frontend
**Prioridade:** P2  
**Impacto:** integracao e manutencao  
**Dependencias:** tasks de dominio

### Problema atual
Os DTOs ja cobrem muita coisa tecnica, mas ainda nao batem totalmente com o shape final esperado pelo frontend.

### Task
Revisar DTOs de:
- arvore
- registro
- auth
- perfil
- approvals

### Ajustes provaveis
- nome comum
- nome cientifico
- coordenadas
- `ID_ARB`
- fotos
- estrutura de endereco versus geolocalizacao

---

## 18. Revisar estrategia de migracao e schema
**Prioridade:** P2  
**Impacto:** consistencia do banco  
**Dependencias:** definicoes de dominio

### Problema atual
As migrations mostram sinais de adaptacao incremental e algumas mudancas ainda precisam ser consolidadas.

### Task
Revisar schema, constraints e relacoes para garantir consistencia com o modelo atual.

### Entrega esperada
- tabela e relacoes coerentes com dominio final
- limpeza de legados de schema
- definicao clara do que e snapshot e do que e historico

---

## 19. Criar endpoints mais orientados a filtros administrativos
**Prioridade:** P2  
**Impacto:** approvals, management, users  
**Dependencias:** repositorios e modelagem final

### Task
Padronizar filtros e paginacao para:
- arvores
- registros
- solicitacoes
- usuarios

### Entrega esperada
- filtros por status
- busca textual
- paginacao
- ordenacao

---

## 20. Melhorar tratamento de erros e contratos de validacao
**Prioridade:** P2  
**Impacto:** integracao frontend/backend  
**Dependencias:** nenhuma

### Task
Consolidar responses de erro e validacao.

### Entrega esperada
- mensagens consistentes
- codigos HTTP coerentes
- estrutura padronizada de erro
- melhor experiencia para consumo do frontend

---

## Ordem recomendada de execucao

### Fase 1 — Dominio e mapa
1. consolidar coordenadas e modelagem geoespacial
2. criar endpoint espacial do mapa
3. criar detalhe de arvore orientado ao mapa

### Fase 2 — Registros e historico
4. criar detalhe de registro
5. implementar historico aprovado orientado ao frontend
6. implementar edicao direta de registro por admin/gestor
7. implementar solicitacao de edicao de registro por pesquisador

### Fase 3 — Aprovacoes
8. enriquecer o modelo de approval request
9. ajustar fila e contratos de aprovacoes

### Fase 4 — Auth, perfil e usuarios
10. criar `auth/me`
11. implementar perfil autenticado
12. completar gestao de usuarios
13. revisar papeis admin/gestor

### Fase 5 — Regras finais do produto
14. alinhar delecao de arvore com regra permanente
15. restringir delecao de registro
16. revisar DTOs e schema
17. criar dashboards por role
18. liberar mapa publico anonimo

---

## Tasks candidatas a issues finais

### Bloco Mapa
- Implementar endpoint espacial para leitura de arvores por viewport
- Consolidar modelagem geoespacial de arvore com PostGIS
- Implementar endpoint de detalhe de arvore para o painel do mapa
- Liberar leitura publica anonima do mapa

### Bloco Registros
- Implementar leitura de historico aprovado por arvore
- Criar endpoint de detalhe de registro
- Implementar edicao direta de registro por admin/gestor
- Implementar solicitacao de edicao de registro historico por pesquisador
- Ajustar regras de delecao de registro

### Bloco Aprovacoes
- Enriquecer modelo de aprovacao para suportar tipos de solicitacao
- Ajustar fluxo de aprovacao de nova arvore, novo registro e edicao
- Revisar filtros e responses da fila de aprovacoes

### Bloco Arvores
- Revisar contrato de `ArvoreResponseDTO`
- Ajustar delecao permanente de arvore
- Garantir recalculo consistente do snapshot atual com base em registros aprovados

### Bloco Auth e Perfil
- Criar endpoint `GET /api/auth/me`
- Implementar `GET /api/users/me`
- Implementar `PATCH /api/users/me`
- Implementar `POST /api/users/me/change-password`
- Revisar contrato de login/refresh para alinhar com frontend

### Bloco Usuarios
- Implementar update administrativo de usuario
- Revisar regras de visibilidade por papel
- Ajustar papel de `ADMINISTRADOR` no sistema

### Bloco Dashboard
- Criar endpoint de dashboard do pesquisador
- Criar endpoint de dashboard do gestor
- Criar endpoint de dashboard do admin
- Criar endpoint de dashboard do cidadao

---

## Conclusao
O backend atual ja tem valor implementado e nao esta em fase inicial. Mas ele ainda nao sustenta completamente o produto que o frontend ja comecou a modelar.

As tasks mais importantes para a completude do backend sao:

- mapa geoespacial real
- historico robusto de registros
- solicitacao de edicao de registro
- enriquecimento do fluxo de aprovacao
- perfil autenticado
- alinhamento de permissoes
- delecao conforme regra final do produto

Se essas frentes forem executadas na ordem sugerida, o backend deixa de ser apenas “parcialmente funcional” e passa a ser uma base coerente para o fechamento real do Arbor.
