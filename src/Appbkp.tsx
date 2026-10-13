import { useEffect, useState } from "react";
import "./App.css";
import { planoLeitura } from "./data/planoLeitura";

const livrosBiblia = [
  { nome: "Gênesis", testamento: "Antigo" },
  { nome: "Êxodo", testamento: "Antigo" },
  { nome: "Levítico", testamento: "Antigo" },
  { nome: "Números", testamento: "Antigo" },
  { nome: "Deuteronômio", testamento: "Antigo" },
  { nome: "Josué", testamento: "Antigo" },
  { nome: "Juízes", testamento: "Antigo" },
  { nome: "Rute", testamento: "Antigo" },
  { nome: "1 Samuel", testamento: "Antigo" },
  { nome: "2 Samuel", testamento: "Antigo" },
  { nome: "1 Reis", testamento: "Antigo" },
  { nome: "2 Reis", testamento: "Antigo" },
  { nome: "1 Crônicas", testamento: "Antigo" },
  { nome: "2 Crônicas", testamento: "Antigo" },
  { nome: "Esdras", testamento: "Antigo" },
  { nome: "Neemias", testamento: "Antigo" },
  { nome: "Ester", testamento: "Antigo" },
  { nome: "Jó", testamento: "Antigo" },
  { nome: "Salmos", testamento: "Antigo" },
  { nome: "Provérbios", testamento: "Antigo" },
  { nome: "Eclesiastes", testamento: "Antigo" },
  { nome: "Cânticos", testamento: "Antigo" },
  { nome: "Isaías", testamento: "Antigo" },
  { nome: "Jeremias", testamento: "Antigo" },
  { nome: "Lamentações", testamento: "Antigo" },
  { nome: "Ezequiel", testamento: "Antigo" },
  { nome: "Daniel", testamento: "Antigo" },
  { nome: "Oseias", testamento: "Antigo" },
  { nome: "Joel", testamento: "Antigo" },
  { nome: "Amós", testamento: "Antigo" },
  { nome: "Obadias", testamento: "Antigo" },
  { nome: "Jonas", testamento: "Antigo" },
  { nome: "Miqueias", testamento: "Antigo" },
  { nome: "Naum", testamento: "Antigo" },
  { nome: "Habacuque", testamento: "Antigo" },
  { nome: "Sofonias", testamento: "Antigo" },
  { nome: "Ageu", testamento: "Antigo" },
  { nome: "Zacarias", testamento: "Antigo" },
  { nome: "Malaquias", testamento: "Antigo" },
  { nome: "Mateus", testamento: "Novo" },
  { nome: "Marcos", testamento: "Novo" },
  { nome: "Lucas", testamento: "Novo" },
  { nome: "João", testamento: "Novo" },
  { nome: "Atos", testamento: "Novo" },
  { nome: "Romanos", testamento: "Novo" },
  { nome: "1 Coríntios", testamento: "Novo" },
  { nome: "2 Coríntios", testamento: "Novo" },
  { nome: "Gálatas", testamento: "Novo" },
  { nome: "Efésios", testamento: "Novo" },
  { nome: "Filipenses", testamento: "Novo" },
  { nome: "Colossenses", testamento: "Novo" },
  { nome: "1 Tessalonicenses", testamento: "Novo" },
  { nome: "2 Tessalonicenses", testamento: "Novo" },
  { nome: "1 Timóteo", testamento: "Novo" },
  { nome: "2 Timóteo", testamento: "Novo" },
  { nome: "Tito", testamento: "Novo" },
  { nome: "Filemom", testamento: "Novo" },
  { nome: "Hebreus", testamento: "Novo" },
  { nome: "Tiago", testamento: "Novo" },
  { nome: "1 Pedro", testamento: "Novo" },
  { nome: "2 Pedro", testamento: "Novo" },
  { nome: "1 João", testamento: "Novo" },
  { nome: "2 João", testamento: "Novo" },
  { nome: "3 João", testamento: "Novo" },
  { nome: "Judas", testamento: "Novo" },
  { nome: "Apocalipse", testamento: "Novo" },
];

function App() {
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

  const [buscaLivro, setBuscaLivro] = useState("");
  const [testamentoSelecionado, setTestamentoSelecionado] =
    useState<"Todos" | "Antigo" | "Novo">("Todos");

  const livrosFiltrados = livrosBiblia.filter((livro) => {
    const correspondeBusca = livro.nome
      .toLocaleLowerCase("pt-BR")
      .includes(buscaLivro.trim().toLocaleLowerCase("pt-BR"));

    const correspondeTestamento =
      testamentoSelecionado === "Todos" ||
      livro.testamento === testamentoSelecionado;

    return correspondeBusca && correspondeTestamento;
  });

  useEffect(() => {
    localStorage.setItem("biblia365-dia-atual", String(dia));
  }, [dia]);

  useEffect(() => {
    localStorage.setItem(
      "biblia365-progresso",
      JSON.stringify(diasConcluidos)
    );
  }, [diasConcluidos]);

  const leituraConcluida = diasConcluidos.includes(dia);

  const percentual = Number(
    ((diasConcluidos.length / 365) * 100).toFixed(1)
  );

  const leituraAtual = planoLeitura.find(
    (leitura) => leitura.dia === dia
  );

  const diasDoAno = Array.from({ length: 365 }, (_, i) => i + 1);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Bíblia 365</h1>
          <p>Um ano na Palavra de Deus</p>
        </div>

        <div className="dia-atual">
          <span>Dia</span>
          <strong>{dia}</strong>
        </div>
      </header>

      <main className="conteudo">
        <section className="resumo-leituras">
          <div className="resumo-item">
            <span className="resumo-icone">✓</span>
            <div>
              <strong>{diasConcluidos.length}</strong>
              <p>Concluídas</p>
            </div>
          </div>

          <div className="resumo-item">
            <span className="resumo-icone">📖</span>
            <div>
              <strong>{dia}</strong>
              <p>Dia atual</p>
            </div>
          </div>

          <div className="resumo-item">
            <span className="resumo-icone">▦</span>
            <div>
              <strong>365</strong>
              <p>Total de dias</p>
            </div>
          </div>
        </section>

        <section className="livros-card">
          <div className="livros-cabecalho">
            <h2>Livros da Bíblia</h2>
            <p>Encontre as leituras do seu plano pelos livros bíblicos.</p>
          </div>

          <input
            className="livros-busca"
            type="search"
            placeholder="Pesquisar livro..."
            value={buscaLivro}
            onChange={(evento) => setBuscaLivro(evento.target.value)}
            aria-label="Pesquisar livro da Bíblia"
          />

          <div className="livros-filtros">
            {(["Todos", "Antigo", "Novo"] as const).map((filtro) => (
              <button
                key={filtro}
                type="button"
                className={
                  testamentoSelecionado === filtro ? "ativo" : ""
                }
                onClick={() => setTestamentoSelecionado(filtro)}
              >
                {filtro === "Todos"
                  ? "Todos os livros"
                  : `${filtro} Testamento`}
              </button>
            ))}
          </div>

          <div className="livros-grade">
            {livrosFiltrados.map((livro) => {
              const diasRelacionados = planoLeitura.filter((leitura) =>
                leitura.referencia
                  .split("; ")
                  .some((referencia) =>
                    referencia.startsWith(`${livro.nome} `)
                  )
              );

              return (
                <details className="livro-item" key={livro.nome}>
                  <summary>
                    <span>{livro.nome}</span>
                    <span className="livro-contagem">
                      {diasRelacionados.length}{" "}
                      {diasRelacionados.length === 1 ? "dia" : "dias"}
                    </span>
                  </summary>

                  <div className="livro-dias">
                    {diasRelacionados.length === 0 ? (
                      <p>Nenhuma leitura encontrada para este livro.</p>
                    ) : (
                      diasRelacionados.map((leitura) => (
                        <button
                          type="button"
                          key={leitura.dia}
                          className={
                            leitura.dia === dia ? "dia-livro-atual" : ""
                          }
                          onClick={() => {
                            setDia(leitura.dia);
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          <strong>Dia {leitura.dia}</strong>
                          <span>{leitura.referencia}</span>
                          {diasConcluidos.includes(leitura.dia) && (
                            <span className="dia-livro-concluido">✓</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </details>
              );
            })}

            {livrosFiltrados.length === 0 && (
              <p className="livros-vazio">
                Nenhum livro encontrado para essa pesquisa.
              </p>
            )}
          </div>
        </section>

        <section className="card-progresso">
          <div className="progresso-topo">
            <span>Minha jornada</span>
            <strong>{diasConcluidos.length}/365</strong>
          </div>

          <div className="barra">
            <div
              className="barra-preenchida"
              style={{ width: `${percentual}%` }}
            />
          </div>

          <p>
            {diasConcluidos.length === 0
              ? "Sua jornada de leitura começa aqui."
              : `Você concluiu ${diasConcluidos.length} de 365 leituras (${percentual}%).`}
          </p>
        </section>

        <section className="leitura-card">
          <span className="etiqueta">LEITURA DO DIA</span>

          <h2>Dia {dia}</h2>

          <h3>Referências bíblicas do dia</h3>

          <div className="referencias-dia">
            <div className="referencia referencia-antigo">
              <span className="referencia-titulo">Antigo Testamento</span>
              <strong>
                {leituraAtual?.antigoTestamento ?? "Referência não cadastrada"}
              </strong>
            </div>

            <div className="referencia referencia-novo">
              <span className="referencia-titulo">Novo Testamento</span>
              <strong>
                {leituraAtual?.novoTestamento ?? "Referência não cadastrada"}
              </strong>
            </div>

            <div className="referencia referencia-salmos">
              <span className="referencia-titulo">Salmos</span>
              <strong>{leituraAtual?.salmos ?? "Referência não cadastrada"}</strong>
            </div>

            <div className="referencia referencia-proverbios">
              <span className="referencia-titulo">Provérbios</span>
              <strong>
                {leituraAtual?.proverbios ?? "Referência não cadastrada"}
              </strong>
            </div>
          </div>

          <div className="texto-biblico">
            <p>
              O texto bíblico será disponibilizado aqui após a definição
              da licença da tradução utilizada pelo aplicativo.
            </p>

            <p className="aviso">
              📖 Neste momento, utilize sua Bíblia física para acompanhar
              a leitura.
            </p>
          </div>

          <button
            className="btn-concluir"
            onClick={() => {
              setDiasConcluidos((diasAtuais) =>
                leituraConcluida
                  ? diasAtuais.filter((item) => item !== dia)
                  : [...diasAtuais, dia].sort((a, b) => a - b)
              );
            }}
          >
            {leituraConcluida
              ? "✓ Leitura concluída — desfazer"
              : "✓ Marcar leitura como concluída"}
          </button>
        </section>

        <section className="navegacao">
          <button
            onClick={() => setDia(Math.max(1, dia - 1))}
            disabled={dia === 1}
          >
            ← Dia anterior
          </button>

          <button
            onClick={() => setDia(Math.min(365, dia + 1))}
            disabled={dia === 365}
          >
            Próximo dia →
          </button>
        </section>

        <section className="calendario-card">
          <div className="calendario-topo">
            <div>
              <h2>Calendário de leitura</h2>
              <p>Selecione um dia para abrir sua leitura.</p>
            </div>

            <span>{diasConcluidos.length}/365 dias</span>
          </div>

          <div className="calendario-grade">
            {diasDoAno.map((numeroDia) => (
              <button
                key={numeroDia}
                type="button"
                className={[
                  "calendario-dia",
                  numeroDia === dia ? "selecionado" : "",
                  diasConcluidos.includes(numeroDia) ? "concluido" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setDia(numeroDia);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                aria-label={`Dia ${numeroDia}${
                  diasConcluidos.includes(numeroDia)
                    ? ", leitura concluída"
                    : ""
                }`}
                aria-pressed={numeroDia === dia}
                title={`Dia ${numeroDia}`}
              >
                {diasConcluidos.includes(numeroDia) ? "✓" : numeroDia}
              </button>
            ))}
          </div>

          <div className="calendario-legenda">
            <span>
              <i className="legenda-atual" /> Dia selecionado
            </span>
            <span>
              <i className="legenda-concluido" /> Leitura concluída
            </span>
          </div>
        </section>
      </main>

      <section className="historico-card">
        <div className="historico-topo">
          <div>
            <h2>Histórico de leituras</h2>
            <p>Suas leituras concluídas</p>
          </div>

          <span>{diasConcluidos.length} concluídas</span>
        </div>

        {diasConcluidos.length === 0 ? (
          <p className="historico-vazio">
            Você ainda não concluiu nenhuma leitura.
          </p>
        ) : (
          <div className="historico-lista">
            {[...diasConcluidos]
              .sort((a, b) => b - a)
              .map((numeroDia) => {
                const leitura = planoLeitura.find(
                  (item) => item.dia === numeroDia
                );

                return (
                  <div className="historico-item" key={numeroDia}>
                    <div className="historico-check">✓</div>

                    <div className="historico-info">
                      <strong>Dia {numeroDia}</strong>
                      <span>
                        {leitura?.referencia ?? "Referência não cadastrada"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDia(numeroDia);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Ver leitura
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;