# TourVR — App do visitante

App web do visitante do TourVR: o tour do campus no celular (modo AR, leitura de QR Code)
e, nos próximos planos, no Meta Quest 3 (modo VR, WebXR). Hoje mostra só uma página
inicial provisória que confirma a conexão com a API.

**Stack:** React 19 · Vite 6 · TypeScript (strict) · Tailwind CSS 4 · React Router 7 · Axios ·
ESLint · Prettier · Vitest.

## Como rodar

O caminho principal é pelo repositório orquestrador
[`quest-project`](https://github.com/Tour-VR/quest-project). Na raiz dele:

```bash
docker compose up -d --build
```

App em http://localhost:3001. As chamadas vão para `/api/...` e `/media/...`, e o _proxy_
do Vite as encaminha ao backend.

**Alternativa sem Docker** (exige o backend rodando em http://localhost:8000), nesta pasta:

```bash
npm ci
npm run dev             # http://localhost:3001
```

## HTTPS na rede local (celular e Quest)

Câmera e WebXR só funcionam em HTTPS fora de `localhost`. Fora do Docker:

```bash
npm run dev:https       # https://<IP-da-maquina>:3001, certificado autoassinado
```

Passo a passo em `docs/05-artefato-vr-app.md` do orquestrador, seção "Testar no celular e no Quest".

## Como testar

```bash
npm run lint            # ESLint (regras de tipo) + tsc --noEmit em modo strict
npm run format:check    # Prettier (npm run format corrige)
npm run test:coverage   # Vitest; falha se a cobertura ficar abaixo de 80%
npm run gen:types       # regenera src/core/types/api.d.ts a partir do OpenAPI do backend
```

## Documentação

Fica no orquestrador: [`docs/05-artefato-vr-app.md`](https://github.com/Tour-VR/quest-project/blob/main/docs/05-artefato-vr-app.md).
