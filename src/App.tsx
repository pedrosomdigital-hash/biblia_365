import { useEffect, useState } from "react";
import "./App.css";
import { planoLeitura } from "./data/planoLeitura";
import { dataLocalHoje, dataValida, formatarData, formatarDataCurta } from "./data/datasPlano";
import { BookOpen, CalendarDays, CheckCheck, ArrowRight, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { explicarReferencia } from "./data/referencias";

function ReferenciasLeitura({ referencia }: { referencia: string }) {
  return (
    <span className="referencias-lista">
      {referencia.split("; ").map((item) => {
        const { livro, trecho } = explicarReferencia(item);
        return (
          <span className="referencia-item" key={item}>
            <strong>{livro}</strong>
            <span>{trecho}</span>
          </span>
        );
      })}
    </span>
  );
}

function App() {
  const [dataInicio, setDataInicio] = useState<string>(() => {
    try {
      const salva = localStorage.getItem("biblia365-data-inicio");
      return salva && dataValida(salva) ? salva : "";
    } catch { return ""; }
  });
  const [dataEscolhida, setDataEscolhida] = useState(dataInicio || dataLocalHoje());
  const [erroSalvamento, setErroSalvamento] = useState(false);
  const dataLeitura = (numero: number) => dataInicio ? formatarData(dataInicio, numero) : "Data de início não definida";
  const [dia, setDia] = useState<number>(() => {
    try {
      const diaSalvo = localStorage.getItem("biblia365-dia-atual");

      if (!diaSalvo) return 1;

      const numeroDia = Number(diaSalvo);

      return Number.isInteger(numeroDia) &&
        numeroDia >= 1 &&
        numeroDia <= 365
        ? numeroDia
        : 1;
    } catch {
      return 1;
    }
  });

  const [diasConcluidos, setDiasConcluidos] = useState<number[]>(() => {
    try {
      const dados = localStorage.getItem("biblia365-progresso");

      if (!dados) return [];

      const dias: unknown = JSON.parse(dados);

      if (!Array.isArray(dias)) return [];

      return [
        ...new Set(
          dias.filter(
            (valor): valor is number =>
              Number.isInteger(valor) && valor >= 1 && valor <= 365
          )
        ),
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("biblia365-dia-atual", String(dia));
      localStorage.setItem("biblia365-progresso", JSON.stringify(diasConcluidos));
      if (dataInicio) localStorage.setItem("biblia365-data-inicio", dataInicio);
      setErroSalvamento(false);
    } catch { setErroSalvamento(true); }
  }, [dia, diasConcluidos, dataInicio]);

  const [configuracaoAberta, setConfiguracaoAberta] = useState(false);
  const [historicoCompleto, setHistoricoCompleto] = useState(false);
  const [paginaCalendario, setPaginaCalendario] = useState(Math.floor((dia - 1) / 30));
  const leituraConcluida = diasConcluidos.includes(dia);
  const percentual = Number(((diasConcluidos.length / 365) * 100).toFixed(1));
  const leituraAtual = planoLeitura.find((leitura) => leitura.dia === dia);
  const proximaLeitura = planoLeitura.find((leitura) => !diasConcluidos.includes(leitura.dia));
  const primeiroDia = paginaCalendario * 30 + 1;
  const ultimoDia = Math.min(primeiroDia + 29, 365);
  const diasVisiveis = Array.from({ length: ultimoDia - primeiroDia + 1 }, (_, i) => primeiroDia + i);
  const historico = [...diasConcluidos].sort((a, b) => b - a);

  function abrirLeitura(numero: number) {
    setDia(numero);
    setPaginaCalendario(Math.floor((numero - 1) / 30));
    document.getElementById("leitura")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function definirInicio(inicio: string) {
    if (!dataValida(inicio)) return;
    setDataInicio(inicio);
    setDataEscolhida(inicio);
    setConfiguracaoAberta(false);
  }

  return (
    <div className="app">
      <header className="header">
        <a className="marca" href="#painel"><span className="marca-icone"><BookOpen size={23} aria-hidden="true" /></span><span><strong>Bíblia 365</strong><small>Um ano na Palavra de Deus</small></span></a>
        <span className="header-legenda">Seu plano, no seu ritmo</span>
      </header>
      <main className="conteudo" id="painel">
        <section className="painel-boas-vindas">
          <div>
            <span className="etiqueta">MINHA JORNADA</span>
            <h1>{diasConcluidos.length === 365 ? "Uma jornada completa." : "Um dia de cada vez na Palavra."}</h1>
            <p>{diasConcluidos.length === 365 ? "Você concluiu as 365 leituras. Celebre esse caminho!" : "Abra sua Bíblia, encontre os trechos e reserve um momento para sua leitura."}</p>
            {proximaLeitura && <button className="botao-principal" onClick={() => abrirLeitura(proximaLeitura.dia)}>{diasConcluidos.length ? "Continuar minha leitura" : "Ir para a primeira leitura"}<ArrowRight size={18} aria-hidden="true" /></button>}
          </div>
          <div className="painel-progresso" style={{ background: `conic-gradient(#d4b77d ${percentual}%, #ffffff20 0)` }} role="img" aria-label={`${percentual}% do plano concluído`}>
            <div><strong>{percentual.toLocaleString("pt-BR")}%</strong><span>da jornada concluída</span></div>
          </div>
        </section>

        <section className="resumo-leituras" aria-label="Resumo do plano">
          <div className="resumo-item"><span className="resumo-icone"><CheckCheck aria-hidden="true" /></span><div><strong>{diasConcluidos.length}<small> / 365</small></strong><p>Leituras concluídas</p></div></div>
          <div className="resumo-item"><span className="resumo-icone"><BookOpen aria-hidden="true" /></span><div><strong>{365 - diasConcluidos.length}</strong><p>Leituras restantes</p></div></div>
          <div className="resumo-item"><span className="resumo-icone"><CalendarDays aria-hidden="true" /></span><div><strong>{proximaLeitura ? `Dia ${proximaLeitura.dia}` : "Concluído"}</strong><p>{proximaLeitura ? "Próxima leitura pendente" : "Todas as leituras marcadas"}</p></div></div>
        </section>

        <section className="inicio-card" aria-labelledby="inicio-titulo">
          <div className="inicio-resumo"><div><h2 id="inicio-titulo">{dataInicio ? "Seu plano de leitura" : "Escolha quando começar"}</h2><p>{dataInicio ? `De ${dataLeitura(1)} a ${dataLeitura(365)}` : "Comece em qualquer época do ano. São 365 leituras na sua Bíblia física."}</p></div>
            {dataInicio && <button className="botao-secundario" onClick={() => setConfiguracaoAberta(!configuracaoAberta)} aria-expanded={configuracaoAberta} aria-controls="configuracao-inicio"><Settings2 size={16} aria-hidden="true" />{configuracaoAberta ? "Fechar" : "Ajustar início"}</button>}
          </div>
          {(!dataInicio || configuracaoAberta) && <form id="configuracao-inicio" onSubmit={(evento) => { evento.preventDefault(); definirInicio(dataEscolhida); }}>
            <label htmlFor="data-inicio">Data de início</label>
            <div className="inicio-controles"><input id="data-inicio" type="date" required min="0001-01-01" max="9998-12-31" value={dataEscolhida} onChange={(evento) => setDataEscolhida(evento.target.value)} /><button className="botao-principal" type="submit">{dataInicio ? "Salvar data" : "Começar meu plano"}</button><button className="botao-secundario" type="button" onClick={() => definirInicio(dataLocalHoje())}>Começar hoje</button></div>
            <p className="inicio-nota">Alterar a data mantém as leituras concluídas. Você pode continuar no seu ritmo.</p>
          </form>}
          {erroSalvamento && <p className="aviso-erro" role="alert">Não foi possível salvar neste navegador. Suas alterações podem ser perdidas ao fechar a página.</p>}
        </section>

        <div className="painel-grade">
          <section className="leitura-card" id="leitura" aria-labelledby="leitura-titulo">
            <div className="leitura-topo"><span className="etiqueta">LEITURA SELECIONADA</span><span className={`status-leitura ${leituraConcluida ? "concluida" : ""}`}>{leituraConcluida ? "✓ Concluída" : "A ler"}</span></div>
            <h2 id="leitura-titulo">Dia {dia}<span> de 365</span></h2>
            <p className="leitura-data">{dataLeitura(dia)}</p>
            <h3>O que ler na sua Bíblia</h3>
            <div className="referencia">{leituraAtual ? <ReferenciasLeitura referencia={leituraAtual.referencia} /> : "Leitura não cadastrada"}</div>
            <details className="ajuda-leitura"><summary>Como encontrar os capítulos e versículos?</summary><p>Os capítulos são as divisões maiores do livro; os versículos são os pequenos números junto ao texto. Leia o trecho completo entre o início e o fim indicados na sua Bíblia física.</p></details>
            <button className={`btn-concluir ${leituraConcluida ? "desfazer" : ""}`} onClick={() => setDiasConcluidos((atuais) => leituraConcluida ? atuais.filter((item) => item !== dia) : [...atuais, dia].sort((a, b) => a - b))}>{leituraConcluida ? "✓ Leitura concluída · desfazer" : "Marcar leitura como concluída"}</button>
            <nav className="navegacao" aria-label="Navegar pelas leituras"><button onClick={() => abrirLeitura(dia - 1)} disabled={dia === 1}><ChevronLeft size={16} aria-hidden="true" />Anterior</button><button onClick={() => abrirLeitura(dia + 1)} disabled={dia === 365}>Próximo dia<ChevronRight size={16} aria-hidden="true" /></button></nav>
          </section>

          <section className="calendario-card" aria-labelledby="calendario-titulo">
            <div className="calendario-topo"><div><span className="etiqueta">SEU CAMINHO</span><h2 id="calendario-titulo">Calendário de leitura</h2><p>Escolha um dia para consultar os trechos.</p></div></div>
            <div className="calendario-paginacao"><button aria-label="Mostrar os 30 dias anteriores" disabled={paginaCalendario === 0} onClick={() => setPaginaCalendario(paginaCalendario - 1)}><ChevronLeft size={18} aria-hidden="true" /></button><span aria-live="polite">Dias {primeiroDia} a {ultimoDia}</span><button aria-label="Mostrar os próximos dias" disabled={paginaCalendario === 12} onClick={() => setPaginaCalendario(paginaCalendario + 1)}><ChevronRight size={18} aria-hidden="true" /></button></div>
            <div className="calendario-grade">{diasVisiveis.map((numero) => <button key={numero} className={["calendario-dia", numero === dia ? "selecionado" : "", diasConcluidos.includes(numero) ? "concluido" : ""].filter(Boolean).join(" ")} onClick={() => abrirLeitura(numero)} aria-label={`Dia ${numero}, ${dataLeitura(numero)}${diasConcluidos.includes(numero) ? ", leitura concluída" : ""}`} aria-pressed={numero === dia} title={dataLeitura(numero)}><span>{diasConcluidos.includes(numero) ? `✓ ${numero}` : numero}</span>{dataInicio && <small>{formatarDataCurta(dataInicio, numero)}</small>}</button>)}</div>
            <div className="calendario-legenda"><span><i className="legenda-atual" />Selecionado</span><span><i className="legenda-concluido" />Concluído</span></div>
            <p className="calendario-nota">Cada marcação é mais um passo na sua jornada.</p>
          </section>
        </div>

        <section className="historico-card" aria-labelledby="historico-titulo">
          <div className="historico-topo"><div><span className="etiqueta">SEUS PASSOS</span><h2 id="historico-titulo">Leituras concluídas</h2><p>Revisite os dias que você já marcou.</p></div><span>{diasConcluidos.length} de 365</span></div>
          {historico.length === 0 ? <p className="historico-vazio">Sua primeira leitura concluída aparecerá aqui.</p> : <div className="historico-lista">{(historicoCompleto ? historico : historico.slice(0, 5)).map((numero) => {
            const leitura = planoLeitura.find((item) => item.dia === numero);
            return <div className="historico-item" key={numero}><span className="historico-check" aria-hidden="true">✓</span><div className="historico-info"><strong>Dia {numero}</strong><span>{dataLeitura(numero)}</span><span>{leitura?.referencia.split("; ").map((item) => explicarReferencia(item).livro).join(" · ")}</span></div><button className="botao-secundario" onClick={() => abrirLeitura(numero)}>Ver leitura<ArrowRight size={15} aria-hidden="true" /></button></div>;
          })}</div>}
          {historico.length > 5 && <button className="historico-expandir botao-secundario" onClick={() => setHistoricoCompleto(!historicoCompleto)} aria-expanded={historicoCompleto}>{historicoCompleto ? "Mostrar menos" : `Ver todas as ${historico.length} leituras`}</button>}
        </section>
        <footer className="rodape">Bíblia 365 · Leitura na sua Bíblia física, no seu ritmo.</footer>
      </main>
    </div>
  );
}

export default App;
