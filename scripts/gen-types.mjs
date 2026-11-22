// Gera os tipos TypeScript a partir do OpenAPI do backend.
// Script em Node (e nao em sintaxe de shell) porque o npm no Windows roda scripts pelo cmd.exe.
import { execSync } from 'node:child_process';

const base = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8000';
execSync(`npx openapi-typescript ${base}/openapi.json -o src/core/types/api.d.ts`, {
  stdio: 'inherit',
});
