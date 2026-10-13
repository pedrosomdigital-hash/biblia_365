export function explicarReferencia(referencia: string): { livro: string; trecho: string } {
  // Some source entries use a hyphen between the final chapter and verse.
  const normalizada = referencia.replace(/([–—]\d+)-(\d+)$/, "$1.$2");
  const partes = normalizada.match(/^(.+?) (\d+)\.(\d+)(?:[-–—](?:(\d+)\.)?(\d+))?$/);
  if (!partes) return { livro: referencia, trecho: "Consulte esta referência na sua Bíblia." };

  const [, livro, capitulo, versiculo, capituloFinal, versiculoFinal] = partes;
  if (capituloFinal && capituloFinal !== capitulo) {
    return {
      livro,
      trecho: `Do capítulo ${capitulo}, versículo ${versiculo}, ao capítulo ${capituloFinal}, versículo ${versiculoFinal}.`,
    };
  }
  return {
    livro,
    trecho: versiculoFinal && versiculoFinal !== versiculo
      ? `Capítulo ${capitulo}, versículos ${versiculo} a ${versiculoFinal}.`
      : `Capítulo ${capitulo}, versículo ${versiculo}.`,
  };
}
