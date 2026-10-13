import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { mensagemErro } from "../services/erros";

export function Acesso() {
  const [modo, setModo] = useState<"entrar" | "criar" | "recuperar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  function mudarModo(novo: typeof modo) {
    setModo(novo); setErro(""); setAviso(""); setSenha(""); setConfirmacao("");
  }

  return <main className="acesso-pagina">
    <section className="acesso-apresentacao">
      <span className="marca-icone"><BookOpen size={30} aria-hidden="true" /></span>
      <span className="etiqueta">BÍBLIA 365</span>
      <h1>Sua jornada acompanha você.</h1>
      <p>Entre com a mesma conta no celular e no computador para continuar suas 365 leituras de onde parou.</p>
      <p className="acesso-lembrete">O plano no aplicativo. A Palavra na sua Bíblia física.</p>
    </section>
    <section className="acesso-card" aria-labelledby="acesso-titulo">
      <h2 id="acesso-titulo">{modo === "criar" ? "Crie sua conta" : modo === "recuperar" ? "Recupere sua senha" : "Bem-vindo à sua jornada"}</h2>
      <p>{modo === "recuperar" ? "Informe o e-mail usado para entrar." : "Seu progresso fica salvo na sua conta."}</p>
      <form onSubmit={async (evento) => {
        evento.preventDefault();
        if (!auth || ocupado) return;
        if (modo === "criar" && senha !== confirmacao) { setErro("As senhas não são iguais. Confira os dois campos."); return; }
        setOcupado(true); setErro(""); setAviso("");
        try {
          if (modo === "criar") await createUserWithEmailAndPassword(auth, email.trim(), senha);
          else if (modo === "recuperar") {
            await sendPasswordResetEmail(auth, email.trim());
            setAviso("Se houver uma conta com esse e-mail, você receberá as instruções para redefinir a senha. Confira também o spam.");
          } else await signInWithEmailAndPassword(auth, email.trim(), senha);
        } catch (falha) { setErro(mensagemErro(falha)); }
        finally { setOcupado(false); }
      }}>
        <fieldset disabled={ocupado}>
          <label htmlFor="email-conta">E-mail</label>
          <input id="email-conta" type="email" autoComplete="email" required value={email} onChange={(evento) => setEmail(evento.target.value)} />
          {modo !== "recuperar" && <><label htmlFor="senha-conta">Senha</label><input id="senha-conta" type="password" autoComplete={modo === "criar" ? "new-password" : "current-password"} required minLength={modo === "criar" ? 6 : undefined} value={senha} onChange={(evento) => setSenha(evento.target.value)} /></>}
          {modo === "criar" && <><small>Use pelo menos 6 caracteres.</small><label htmlFor="confirmacao-conta">Confirme a senha</label><input id="confirmacao-conta" type="password" autoComplete="new-password" required minLength={6} value={confirmacao} onChange={(evento) => setConfirmacao(evento.target.value)} /></>}
          {erro && <p className="aviso-erro" role="alert">{erro}</p>}
          {aviso && <p className="aviso-sucesso" role="status">{aviso}</p>}
          <button className="botao-principal" type="submit">{ocupado ? "Aguarde…" : modo === "criar" ? "Criar conta" : modo === "recuperar" ? "Enviar instruções" : "Entrar"}<ArrowRight size={17} aria-hidden="true" /></button>
        </fieldset>
      </form>
      <div className="acesso-alternativas">
        {modo === "entrar" ? <><button disabled={ocupado} onClick={() => mudarModo("recuperar")}>Esqueci minha senha</button><p>Ainda não tem conta? <button disabled={ocupado} onClick={() => mudarModo("criar")}>Criar conta</button></p></> : <button disabled={ocupado} onClick={() => mudarModo("entrar")}>Voltar para entrar</button>}
      </div>
    </section>
  </main>;
}
