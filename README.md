# Arbor Florest Monitoring

Template inicial de frontend para monitoramento florestal com Next.js (App Router), TypeScript e organização por camadas e papéis.
Exigência para rodar o projeto: NodeJS instalado em versão LTS.

Como rodar o projeto:
1 - Clone o projeto
2 - Rode no terminal: cd arbor-florest-monitoring
3 - Rode no termnal: npm install

## Stack

- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- TanStack Query
- Context API
- React Hook Form + Zod
- Axios
- MSW
- Leaflet + react-leaflet
- Recharts
- date-fns

## Estrutura base

```text
src/
  app/
    (auth)/login
    (public)/public
    (citizen)/citizen
      profile
      reports
      map
    (researcher)/researcher
      trees
      measurements
      reports
      map
    (manager)/manager
      approvals
      users
      export
  components/
  services/
  hooks/
  contexts/
  constants/
  types/
  utils/
  mocks/
  styles/
```

## Access model

- Public view (`/public`): dados abertos e limitados para visitantes anônimos
- Citizen (`/citizen`): usuário autenticado com dados privados próprios
- Researcher (`/researcher`): área autenticada de pesquisa
- Manager (`/manager`): área autenticada de gestão

## Configuração

1. Instalar dependências:

```bash
npm install
```

2. Criar arquivo de ambiente copiando `.env.local.example` para `.env.local`.

```bash
copy .env.local.example .env.local
```

3. Executar em desenvolvimento:

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run type-check`
- `npm run format`
