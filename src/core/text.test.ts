import { splitParagraphs } from './text';

describe('splitParagraphs', () => {
  it('separa por linha em branco', () => {
    expect(splitParagraphs('Primeiro.\n\nSegundo.\r\n\r\nTerceiro.')).toEqual([
      'Primeiro.',
      'Segundo.',
      'Terceiro.',
    ]);
  });

  it('mantem quebra simples dentro do paragrafo e remove vazios', () => {
    expect(splitParagraphs('\n\nLinha 1\nLinha 2\n\n   \n\n')).toEqual(['Linha 1\nLinha 2']);
  });

  it('devolve lista vazia para texto vazio', () => {
    expect(splitParagraphs('')).toEqual([]);
  });
});
