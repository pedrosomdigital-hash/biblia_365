export function mensagemErro(erro: unknown): string {
  const codigo = erro && typeof erro === "object" && "code" in erro ? String(erro.code) : "";
  switch (codigo) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password": return "E-mail ou senha incorretos. Confira e tente novamente.";
    case "auth/email-already-in-use": return "Já existe uma conta com este e-mail. Entre ou recupere sua senha.";
    case "auth/weak-password": return "Escolha uma senha com pelo menos 6 caracteres.";
    case "auth/invalid-email": return "Digite um e-mail válido.";
    case "auth/too-many-requests": return "Muitas tentativas. Aguarde um pouco e tente novamente.";
    case "auth/network-request-failed":
    case "unavailable": return "Não foi possível conectar. Confira sua internet e tente novamente.";
    case "permission-denied": return "Não foi possível acessar seu progresso. Confira as regras do Firestore no projeto Firebase.";
    case "auth/operation-not-allowed": return "O acesso por e-mail e senha ainda precisa ser ativado no Firebase.";
    default: return "Não foi possível concluir. Tente novamente; se persistir, confira a configuração do Firebase.";
  }
}
