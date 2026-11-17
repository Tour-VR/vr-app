import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_PROXY_TARGET = 'http://localhost:8000';

export default defineConfig(({ mode }) => {
  // O terceiro argumento '' faz o loadEnv ler tambem process.env (variavel do container).
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET ?? DEFAULT_PROXY_TARGET;
  return {
    // basicSsl gera um certificado autoassinado so no modo https (npm run dev:https).
    plugins: [react(), tailwindcss(), ...(mode === 'https' ? [basicSsl()] : [])],
    server: {
      host: true,
      proxy: {
        '/api': { target, changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
        '/media': { target, changeOrigin: true },
      },
    },
  };
});
