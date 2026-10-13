# Bíblia 365

Aplicativo web para acompanhar 365 dias de leitura na Bíblia física. O plano pode começar em qualquer data, sem depender de janeiro.

## Funcionalidades

- Data de início personalizada e datas calculadas para as 365 leituras.
- Referências por livro, com capítulos e versículos escritos por extenso.
- Marcação de leituras concluídas, com opção de desfazer.
- Painel com percentual de progresso, leituras restantes e acesso à primeira leitura pendente.
- Calendário em blocos de 30 dias e histórico de leituras concluídas.
- Layout adaptado para computador e celular.

O aplicativo apresenta o plano e as referências. A leitura do texto bíblico é feita na Bíblia física.

## Executar localmente

Utilize uma versão atual do Node.js compatível com o Vite 8 e npm.

```sh
npm ci
npm run dev
```

## Gerar a versão de produção

```sh
npm run build
npm run preview
```

Os arquivos de produção são gerados na pasta `dist`.

## Tecnologias

React, TypeScript, Vite, Lucide React, Firebase Authentication e Cloud Firestore.

O plano está em `src/data/planoLeitura.ts`. O cálculo das datas está em `src/data/datasPlano.ts`, e a apresentação das referências em `src/data/referencias.ts`.

## Progresso

Com o Firebase configurado, cada usuário entra com e-mail e senha ou com a conta Google e acompanha a mesma data de início, leitura selecionada e dias concluídos em todos os dispositivos. Os dados ficam em `usuarios/{uid}/plano/atual` no Cloud Firestore. As marcações são atualizadas individualmente para preservar leituras feitas em outros aparelhos.

Na primeira entrada, o aplicativo oferece a importação do progresso legado salvo no navegador, sem apagar o progresso da conta. Use essa opção no navegador e no endereço onde as leituras antigas foram marcadas. A importação é explícita, e os dados locais não são apagados.

Sem a configuração do Firebase, o aplicativo mantém o modo local. Esse modo não sincroniza dispositivos.

## Verificação

`npm run build` verifica o TypeScript e gera a versão de produção. `npm run lint` executa o Oxlint; a política de controle de aplicativos do Windows pode bloquear seu componente nativo.


## Ativar login e sincronização

A configuração pública do aplicativo web `biblia-365-cb8e7` está em `src/services/firebase.ts`. Ela não é uma credencial administrativa. Variáveis `VITE_FIREBASE_*` podem substituir esses valores; consulte `.env.example`.

1. No Firebase Console, abra Authentication, comece a configuração se necessário e habilite os provedores **E-mail/senha** e **Google**. No provedor Google, informe o e-mail de suporte e salve.
2. Nas configurações de Authentication, adicione `appbiblia365.netlify.app` aos domínios autorizados. Para testes locais, adicione `localhost` e `127.0.0.1` se necessário.
3. Crie o banco **Cloud Firestore** no modo de produção. As regras padrão fechadas devem ser substituídas pelas regras de `firestore.rules`.
4. Cole `firestore.rules` na aba Regras do Firestore e publique. As regras permitem acesso somente ao plano do próprio usuário e validam os campos e dias do plano. Se já houver regras para outras coleções, integre este trecho às regras existentes em vez de substituí-las.
5. Publique o aplicativo atualizado na Netlify com `npm run build` e diretório `dist`.

Alternativamente, depois de autenticar o Firebase CLI no projeto correto:

```sh
firebase deploy --only firestore:rules --project biblia-365-cb8e7
```

Não publique arquivos de conta de serviço, chaves privadas ou credenciais administrativas no frontend.

## Testes

```sh
npm test
npm run build
```

Os testes verificam a normalização e a importação do progresso, incluindo duplicações, valores inválidos e preservação das leituras da conta. A confirmação de login, regras e sincronização real depende da configuração do projeto Firebase.

Para validar a integração, crie uma conta de teste, marque um dia, entre com a mesma conta em outro navegador e confirme a marcação. Desfaça a leitura no segundo navegador e confira a atualização no primeiro. Entre com outra conta e confirme que os dados são separados. Importe o progresso local e verifique que as leituras existentes são mantidas.

O aplicativo informa quando aguarda conexão ou confirmação de gravação. Não considera uma alteração confirmada no servidor enquanto estiver pendente.


## Entrada com Google

O botão **Entrar com Google** aparece nas telas de entrada e criação de conta e abre o seletor de contas do Google. O progresso continua vinculado ao UID do Firebase. Utilize sempre a mesma conta para acessar o mesmo plano. Se um e-mail já estiver vinculado a um método incompatível, a tela orienta a entrar pelo método original.

O domínio `appbiblia365.netlify.app` deve estar autorizado em Authentication. Se o navegador bloquear a janela, permita pop-ups para esse site. A conclusão da autenticação Google exige que o usuário escolha e autorize sua própria conta.
