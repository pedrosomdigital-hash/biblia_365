import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDocFromServer, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, runTransaction, terminate } from 'firebase/firestore';
import { normalizarProgresso, unirProgressos } from '../src/data/progresso.ts';

const source = readFileSync(new URL('../src/services/firebase.ts', import.meta.url), 'utf8');
const config = Object.fromEntries(['apiKey', 'authDomain', 'projectId', 'appId'].map((key) => {
  const match = source.match(new RegExp(key + ':.*?\\|\\| "([^"]+)"'));
  if (!match) throw new Error('Configuração pública não encontrada.');
  return [key, match[1]];
}));
const apps = [];
const usuarios = [];
function sessao() {
  const app = initializeApp(config, 'teste-' + randomUUID());
  apps.push(app);
  return { app, auth: getAuth(app), db: getFirestore(app) };
}
function prazo(promise) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Object.assign(new Error('Tempo de conexão excedido.'), {code:'timeout'})), 45000); })]).finally(() => clearTimeout(timer));
}
async function novaConta(sessao) {
  const email = 'biblia365-teste-' + randomUUID() + '@example.com';
  const senha = randomUUID() + 'Aa9!';
  const { user } = await prazo(createUserWithEmailAndPassword(sessao.auth, email, senha));
  usuarios.push({user, sessao});
  return {user, email, senha};
}
async function negado(acao) {
  await assert.rejects(prazo(acao()), (erro) => erro.code === 'permission-denied');
}
try {
  const a = sessao();
  const conta = await novaConta(a);
  const refA = doc(a.db, 'usuarios', conta.user.uid, 'plano', 'atual');
  await prazo(setDoc(refA, { dataInicio:'2026-10-12', dia:1, diasConcluidos:[], atualizadoEm:serverTimestamp() }));
  console.log('OK: criar conta e salvar plano próprio.');

  const outroAparelho = sessao();
  await prazo(signInWithEmailAndPassword(outroAparelho.auth, conta.email, conta.senha));
  const refOutro = doc(outroAparelho.db, 'usuarios', conta.user.uid, 'plano', 'atual');
  assert.equal((await prazo(getDocFromServer(refOutro))).data().dataInicio, '2026-10-12');
  await prazo(updateDoc(refOutro, { dia:2, diasConcluidos:arrayUnion(1), atualizadoEm:serverTimestamp() }));
  assert.deepEqual((await prazo(getDocFromServer(refA))).data().diasConcluidos, [1]);
  console.log('OK: mesma conta em duas sessões recupera e sincroniza a leitura.');

  await prazo(Promise.all([
    updateDoc(refA, {diasConcluidos:arrayUnion(2), atualizadoEm:serverTimestamp()}),
    updateDoc(refOutro, {diasConcluidos:arrayUnion(3), atualizadoEm:serverTimestamp()})
  ]));
  assert.deepEqual((await prazo(getDocFromServer(refA))).data().diasConcluidos.sort((a,b)=>a-b), [1,2,3]);
  await prazo(updateDoc(refOutro, {diasConcluidos:arrayRemove(2), atualizadoEm:serverTimestamp()}));
  assert.deepEqual((await prazo(getDocFromServer(refA))).data().diasConcluidos.sort((a,b)=>a-b), [1,3]);
  console.log('OK: marcações simultâneas preservadas e desfazer sincronizado.');

  const b = sessao();
  const contaB = await novaConta(b);
  await negado(() => getDocFromServer(doc(b.db, 'usuarios', conta.user.uid, 'plano', 'atual')));
  await negado(() => setDoc(doc(b.db, 'usuarios', conta.user.uid, 'plano', 'atual'), {dia:50}, {merge:true}));
  const semLogin = sessao();
  await negado(() => getDocFromServer(doc(semLogin.db, 'usuarios', conta.user.uid, 'plano', 'atual')));
  console.log('OK: outra conta e visitante sem login não acessam o plano.');

  await negado(() => updateDoc(refA, {diasConcluidos:[366], atualizadoEm:serverTimestamp()}));
  await negado(() => updateDoc(refA, {dia:0, atualizadoEm:serverTimestamp()}));
  console.log('OK: regras rejeitam dias fora do plano.');

  await prazo(runTransaction(a.db, async (transacao) => {
    const snapshot = await transacao.get(refA);
    const unido = unirProgressos(normalizarProgresso(snapshot.data()), {dataInicio:'2026-10-01',dia:4,diasConcluidos:[1,4]});
    transacao.set(refA, {...unido, atualizadoEm:serverTimestamp()});
  }));
  const importado = (await prazo(getDocFromServer(refOutro))).data();
  assert.equal(importado.dataInicio, '2026-10-12');
  assert.deepEqual(importado.diasConcluidos, [1,3,4]);
  console.log('OK: importação soma o progresso e preserva a data da conta.');
  assert.notEqual(conta.user.uid, contaB.user.uid);
} catch (erro) {
  console.error('Falha na verificação Firebase:', erro.code || erro.name);
  process.exitCode = 1;
} finally {
  for (const {user, sessao} of usuarios) {
    try { await prazo(deleteDoc(doc(sessao.db, 'usuarios', user.uid, 'plano', 'atual'))); }
    catch { console.error('Não foi possível remover o plano de teste; confira os planos das contas biblia365-teste no console.'); process.exitCode = 1; }
    try { await prazo(deleteUser(user)); }
    catch { console.error('Não foi possível remover uma conta de teste; confira as contas biblia365-teste no Authentication.'); process.exitCode = 1; }
  }
  for (const app of apps) {
    try { await terminate(getFirestore(app)); await deleteApp(app); } catch { /* best-effort shutdown */ }
  }
  console.log('Verificação encerrada. Nenhuma senha ou token foi gravado em arquivo.');
}
