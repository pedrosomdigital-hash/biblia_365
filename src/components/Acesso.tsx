import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
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

  async function entrarComGoogle() {
    if (!auth || ocupado) return;
    setOcupado(true); setErro(""); setAviso("");
    const provedor = new GoogleAuthProvider();
    provedor.setCustomParameters({ prompt: "select_account" });
    try { await signInWithPopup(auth, provedor); }
    catch (falha) {
      const codigo = falha && typeof falha === "object" && "code" in falha ? falha.code : "";
      if (codigo !== "auth/popup-closed-by-user" && codigo !== "auth/cancelled-popup-request") setErro(mensagemErro(falha));
    } finally { setOcupado(false); }
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
      {modo !== "recuperar" && <>
        <button className="botao-google" type="button" disabled={ocupado} onClick={() => void entrarComGoogle()}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.31 2.99-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.41l-3.22-2.51c-.9.6-2.05.97-3.39.97-2.6 0-4.8-1.76-5.59-4.12H3.09v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.93a6 6 0 0 1 0-3.86V7.48H3.09a10 10 0 0 0 0 9.04l3.32-2.59Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.83 1.51l2.87-2.88A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.91 5.48l3.32 2.59A5.99 5.99 0 0 1 12 5.95Z"/></svg>
          {ocupado ? "Aguarde…" : "Entrar com Google"}
        </button>
        <div className="acesso-divisor"><span>ou use seu e-mail</span></div>
      </>}
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
