/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endereco do backend para onde o proxy do Vite encaminha /api e /media. */
  readonly VITE_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
