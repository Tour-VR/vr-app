/**
 * Endereco usado no `src` de uma midia. As duas formas de `url` ja servem como estao:
 * a relativa (`/media/...`, enviada pelo painel) passa pelo proxy do Vite na mesma origem,
 * e a absoluta (cadastrada a mao) aponta direto para o servidor de origem. Toda imagem
 * passa por aqui para que uma mudanca futura de origem da midia fique num lugar so.
 */
export function mediaSrc(url: string): string {
  return url;
}
