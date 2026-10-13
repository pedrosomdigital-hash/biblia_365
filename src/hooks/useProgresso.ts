import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { mensagemErro } from "../services/erros";
import { lerProgressoLocal, normalizarProgresso, progressoVazio, unirProgressos } from "../data/progresso";
import type { Progresso } from "../data/progresso";

export function useProgresso(usuario: User | null) {
  const [progresso, setProgresso] = useState<Progresso>(() => usuario ? progressoVazio() : lerProgressoLocal());
  const [carregando, setCarregando] = useState(!!usuario);
  const [erro, setErro] = useState("");
  const [pendentes, setPendentes] = useState(0);
  const [cache, setCache] = useState(false);
  const [revisao, setRevisao] = useState(0);
  const [importavel, setImportavel] = useState(() => {
    try {
      const local = lerProgressoLocal();
      return !!usuario && !localStorage.getItem("biblia365-importado-por") && !!(local.dataInicio || local.diasConcluidos.length);
    } catch { return false; }
  });
  const ativo = useRef(true);
  useEffect(() => { ativo.current = true; return () => { ativo.current = false; }; }, []);
  useEffect(() => {
    if (!pendentes) return;
    const avisar = (evento: BeforeUnloadEvent) => { evento.preventDefault(); evento.returnValue = ""; };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [pendentes]);

  useEffect(() => {
    if (!usuario || !db) return;
    let cancelado = false;
    setCarregando(true);
    setErro("");
    const referencia = doc(db, "usuarios", usuario.uid, "plano", "atual");
    const tempo = window.setTimeout(() => {
      if (!cancelado) setErro("Ainda não foi possível carregar seu progresso. Confira sua conexão e tente novamente.");
    }, 15000);
    const parar = onSnapshot(referencia, { includeMetadataChanges: true }, (snapshot) => {
      if (cancelado) return;
      if (!snapshot.exists()) {
        if (snapshot.metadata.fromCache) return;
        void runTransaction(db!, async (transacao) => {
          const atual = await transacao.get(referencia);
          if (!atual.exists()) transacao.set(referencia, { ...progressoVazio(), atualizadoEm: serverTimestamp() });
        }).catch((falha) => { if (!cancelado) setErro(mensagemErro(falha)); });
        return;
      }
      window.clearTimeout(tempo);
      setProgresso(normalizarProgresso(snapshot.data()));
      setCache(snapshot.metadata.fromCache);
      setCarregando(false);
    }, (falha) => {
      window.clearTimeout(tempo);
      if (!cancelado) setErro(mensagemErro(falha));
    });
    return () => { cancelado = true; window.clearTimeout(tempo); parar(); };
  }, [usuario, revisao]);

  async function gravar(campos: Record<string, unknown>, local: Progresso) {
    if (usuario && db) {
      if (carregando) return;
      setPendentes((valor) => valor + 1);
      setErro("");
      try {
        await updateDoc(doc(db, "usuarios", usuario.uid, "plano", "atual"), { ...campos, atualizadoEm: serverTimestamp() });
      } catch (falha) { if (ativo.current) setErro(mensagemErro(falha)); }
      finally { if (ativo.current) setPendentes((valor) => valor - 1); }
    } else {
      setProgresso(local);
      try {
        localStorage.setItem("biblia365-data-inicio", local.dataInicio);
        localStorage.setItem("biblia365-dia-atual", String(local.dia));
        localStorage.setItem("biblia365-progresso", JSON.stringify(local.diasConcluidos));
        setErro("");
      } catch { setErro("Não foi possível salvar neste navegador. Suas alterações podem ser perdidas ao fechar a página."); }
    }
  }

  function selecionarDia(dia: number) {
    return gravar({ dia }, { ...progresso, dia });
  }
  function definirDataInicio(dataInicio: string) {
    return gravar({ dataInicio }, { ...progresso, dataInicio });
  }
  function alternarConcluido(dia: number) {
    const concluido = progresso.diasConcluidos.includes(dia);
    return gravar({ diasConcluidos: concluido ? arrayRemove(dia) : arrayUnion(dia) }, {
      ...progresso,
      diasConcluidos: concluido ? progresso.diasConcluidos.filter((item) => item !== dia) : [...progresso.diasConcluidos, dia].sort((a, b) => a - b),
    });
  }

  async function importarLocal() {
    if (!usuario || !db || carregando || pendentes) return;
    setPendentes((valor) => valor + 1);
    setErro("");
    try {
      const local = lerProgressoLocal();
      const referencia = doc(db, "usuarios", usuario.uid, "plano", "atual");
      await runTransaction(db, async (transacao) => {
        const snapshot = await transacao.get(referencia);
        const unido = unirProgressos(normalizarProgresso(snapshot.data()), local);
        transacao.set(referencia, { ...unido, atualizadoEm: serverTimestamp() });
      });
      try { localStorage.setItem("biblia365-importado-por", usuario.uid); } catch { /* Cloud import already succeeded. */ }
      if (ativo.current) setImportavel(false);
    } catch (falha) { if (ativo.current) setErro(mensagemErro(falha)); }
    finally { if (ativo.current) setPendentes((valor) => valor - 1); }
  }

  return { ...progresso, carregando, erro, salvando: pendentes > 0, cache, importavel, selecionarDia, definirDataInicio, alternarConcluido, importarLocal, tentarNovamente: () => setRevisao((valor) => valor + 1) };
}
