import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizarProgresso, progressoVazio, unirProgressos, lerProgressoLocal } from '../src/data/progresso.ts';

test('remove dias inválidos e duplicados sem perder as leituras válidas', () => {
  assert.deepEqual(normalizarProgresso({ dataInicio: '2026-10-12', dia: 3, diasConcluidos: [3, 1, 3, 0, 366, '2', 1.5, null] }), { dataInicio: '2026-10-12', dia: 3, diasConcluidos: [1, 3] });
});
test('rejeita data impossível e seleção fora do plano', () => {
  assert.deepEqual(normalizarProgresso({ dataInicio: '2026-02-30', dia: 500, diasConcluidos: {} }), progressoVazio());
});
test('a importação soma os dias e preserva o início e a seleção já existentes na conta', () => {
  assert.deepEqual(unirProgressos({dataInicio: '2026-10-12', dia: 5, diasConcluidos: [1, 3]}, {dataInicio: '2026-10-01', dia: 2, diasConcluidos: [1, 2]}), {dataInicio: '2026-10-12', dia: 5, diasConcluidos: [1, 2, 3]});
});
test('uma conta vazia recebe o início e a seleção do progresso importado', () => {
  const local = {dataInicio: '2026-10-12', dia: 4, diasConcluidos: [1, 2, 3]};
  assert.deepEqual(unirProgressos(progressoVazio(), local), local);
});
test('a importação é idempotente', () => {
  const local = {dataInicio: '2026-10-12', dia: 2, diasConcluidos: [1, 2]};
  const primeiro = unirProgressos(progressoVazio(), local);
  assert.deepEqual(unirProgressos(primeiro, local), primeiro);
});
test('o armazenamento local corrompido não derruba o aplicativo', () => {
  globalThis.localStorage = {getItem: (chave) => chave === 'biblia365-progresso' ? '{invalido' : null};
  assert.deepEqual(lerProgressoLocal(), progressoVazio());
  delete globalThis.localStorage;
});
