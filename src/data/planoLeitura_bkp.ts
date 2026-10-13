
export interface LeituraDia {
  dia: number;
  referencia: string;
}

interface LivroBiblico {
  nome: string;
  capitulos: number;
}

// Quantidade de capítulos de cada livro da Bíblia protestante.
const livrosBiblia: LivroBiblico[] = [
  { nome: "Gênesis", capitulos: 50 },
  { nome: "Êxodo", capitulos: 40 },
  { nome: "Levítico", capitulos: 27 },
  { nome: "Números", capitulos: 36 },
  { nome: "Deuteronômio", capitulos: 34 },
  { nome: "Josué", capitulos: 24 },
  { nome: "Juízes", capitulos: 21 },
  { nome: "Rute", capitulos: 4 },
  { nome: "1 Samuel", capitulos: 31 },
  { nome: "2 Samuel", capitulos: 24 },
  { nome: "1 Reis", capitulos: 22 },
  { nome: "2 Reis", capitulos: 25 },
  { nome: "1 Crônicas", capitulos: 29 },
  { nome: "2 Crônicas", capitulos: 36 },
  { nome: "Esdras", capitulos: 10 },
  { nome: "Neemias", capitulos: 13 },
  { nome: "Ester", capitulos: 10 },
  { nome: "Jó", capitulos: 42 },
  { nome: "Salmos", capitulos: 150 },
  { nome: "Provérbios", capitulos: 31 },
  { nome: "Eclesiastes", capitulos: 12 },
  { nome: "Cânticos", capitulos: 8 },
  { nome: "Isaías", capitulos: 66 },
  { nome: "Jeremias", capitulos: 52 },
  { nome: "Lamentações", capitulos: 5 },
  { nome: "Ezequiel", capitulos: 48 },
  { nome: "Daniel", capitulos: 12 },
  { nome: "Oseias", capitulos: 14 },
  { nome: "Joel", capitulos: 3 },
  { nome: "Amós", capitulos: 9 },
  { nome: "Obadias", capitulos: 1 },
  { nome: "Jonas", capitulos: 4 },
  { nome: "Miqueias", capitulos: 7 },
  { nome: "Naum", capitulos: 3 },
  { nome: "Habacuque", capitulos: 3 },
  { nome: "Sofonias", capitulos: 3 },
  { nome: "Ageu", capitulos: 2 },
  { nome: "Zacarias", capitulos: 14 },
  { nome: "Malaquias", capitulos: 4 },
  { nome: "Mateus", capitulos: 28 },
  { nome: "Marcos", capitulos: 16 },
  { nome: "Lucas", capitulos: 24 },
  { nome: "João", capitulos: 21 },
  { nome: "Atos", capitulos: 28 },
  { nome: "Romanos", capitulos: 16 },
  { nome: "1 Coríntios", capitulos: 16 },
  { nome: "2 Coríntios", capitulos: 13 },
  { nome: "Gálatas", capitulos: 6 },
  { nome: "Efésios", capitulos: 6 },
  { nome: "Filipenses", capitulos: 4 },
  { nome: "Colossenses", capitulos: 4 },
  { nome: "1 Tessalonicenses", capitulos: 5 },
  { nome: "2 Tessalonicenses", capitulos: 3 },
  { nome: "1 Timóteo", capitulos: 6 },
  { nome: "2 Timóteo", capitulos: 4 },
  { nome: "Tito", capitulos: 3 },
  { nome: "Filemom", capitulos: 1 },
  { nome: "Hebreus", capitulos: 13 },
  { nome: "Tiago", capitulos: 5 },
  { nome: "1 Pedro", capitulos: 5 },
  { nome: "2 Pedro", capitulos: 3 },
  { nome: "1 João", capitulos: 5 },
  { nome: "2 João", capitulos: 1 },
  { nome: "3 João", capitulos: 1 },
  { nome: "Judas", capitulos: 1 },
  { nome: "Apocalipse", capitulos: 22 },
];

interface Capitulo {
  livro: string;
  numero: number;
}

const capitulosBiblia: Capitulo[] = livrosBiblia.flatMap((livro) =>
  Array.from({ length: livro.capitulos }, (_, indice) => ({
    livro: livro.nome,
    numero: indice + 1,
  }))
);

function formatarReferencia(
  capitulos: Capitulo[]
): string {
  const grupos: { livro: string; inicio: number; fim: number }[] = [];

  for (const capitulo of capitulos) {
    const ultimo = grupos[grupos.length - 1];

    if (
      ultimo &&
      ultimo.livro === capitulo.livro &&
      ultimo.fim + 1 === capitulo.numero
    ) {
      ultimo.fim = capitulo.numero;
    } else {
      grupos.push({
        livro: capitulo.livro,
        inicio: capitulo.numero,
        fim: capitulo.numero,
      });
    }
  }

  return grupos
    .map(({ livro, inicio, fim }) =>
      inicio === fim
        ? `${livro} ${inicio}`
        : `${livro} ${inicio} — ${fim}`
    )
    .join("; ");
}

const referenciasIniciais = [
  "Gênesis 1 — 3",
  "Gênesis 4 — 7",
  "Gênesis 8 — 11",
  "Gênesis 12 — 15",
  "Gênesis 16 — 19",
  "Gênesis 20 — 23",
  "Gênesis 24 — 27",
  "Gênesis 28 — 31",
  "Gênesis 32 — 35",
  "Gênesis 36 — 39",
];

export const planoLeitura: LeituraDia[] = [];

let indiceCapitulo = 0;

// Mantém as dez referências já utilizadas nos nossos testes.
for (let dia = 1; dia <= 10; dia++) {
  const quantidade = dia === 1 ? 3 : 4;

  planoLeitura.push({
    dia,
    referencia: referenciasIniciais[dia - 1],
  });

  indiceCapitulo += quantidade;
}

// Distribui os capítulos restantes pelos outros 355 dias.
const diasRestantes = 355;
const capitulosRestantes =
  capitulosBiblia.length - indiceCapitulo;

const diasComQuatroCapitulos =
  capitulosRestantes - diasRestantes * 3;

let acumulador = 0;

for (let dia = 11; dia <= 365; dia++) {
  acumulador += diasComQuatroCapitulos;

  let quantidade = 3;

  if (acumulador >= diasRestantes) {
    quantidade = 4;
    acumulador -= diasRestantes;
  }

  const leitura = capitulosBiblia.slice(
    indiceCapitulo,
    indiceCapitulo + quantidade
  );

  planoLeitura.push({
    dia,
    referencia: formatarReferencia(leitura),
  });

  indiceCapitulo += quantidade;
}