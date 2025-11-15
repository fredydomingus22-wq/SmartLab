# SMART LAB – Guia Completo de Configuração e Deploy na Vercel

> **Objetivo**: este guia descreve, passo a passo e sem pressupor conhecimentos prévios, como preparar todo o ambiente para desenvolver, integrar o backend (Supabase), configurar variáveis de ambiente e realizar o deploy do SMART LAB na Vercel. Siga as etapas na ordem apresentada. 

---

## 1. Pré-requisitos obrigatórios

1. **Contas necessárias**
   - Conta ativa na [Vercel](https://vercel.com/signup).
   - Conta ativa na [Supabase](https://supabase.com/dashboard/sign-in).
   - Conta no GitHub com acesso ao repositório `SmartLab`.
2. **Acessos**
   - Confirme que consegue entrar na Vercel e Supabase pelo navegador com autenticação em duas etapas habilitada (recomendado).
   - Confirme que tem permissão de gravação no repositório GitHub (`push`).
3. **Ferramentas no navegador**
   - Utilize o Codespaces integrado da Vercel (Vercel Remote Development). Não é necessário instalar nada localmente.
   - Certifique-se de que o navegador permite pop-ups para Vercel e Supabase, pois o processo de login pode abrir janelas adicionais.

---

## 2. Clonar o repositório usando o Codespace da Vercel

1. Acesse [https://vercel.com/new/workspace](https://vercel.com/new/workspace) e selecione o time correto (se aplicável).
2. Clique em **"Import Git Repository"**.
3. Na caixa de texto, cole a URL do repositório `https://github.com/<ORGANIZACAO>/<SmartLab>.git` (ajuste conforme o repositório real).
4. Clique em **"Continue"** e autorize o acesso da Vercel ao seu GitHub se solicitado.
5. Na tela de configuração do projeto, clique em **"Create"** para criar o projeto na Vercel sem iniciar o deploy ainda.
6. Após a criação, selecione a aba **"Development"** e clique em **"New Workspace"** > **"Create Workspace"**.
7. Escolha a região do servidor mais próxima e clique em **"Create"**. A Vercel abrirá o Codespace no navegador.
8. Aguarde o Codespace iniciar. Você verá um terminal integrado. Não feche esta aba.

---

## 3. Instalar dependências no Codespace

No terminal integrado do Codespace:

1. Garanta que está na pasta raiz do projeto (o prompt deve terminar com `/SmartLab`). Caso contrário, execute `cd SmartLab`.
2. Instale as dependências do projeto:
   ```bash
   pnpm install
   ```
   - Se o projeto ainda não tiver `pnpm` configurado, instale utilizando `npm install -g pnpm` antes do comando acima.
3. Aguarde a instalação completar sem erros. Caso ocorra falha de rede, execute novamente o comando `pnpm install`.

---

## 4. Configurar o projeto Supabase (backend)

### 4.1 Criar o projeto Supabase

1. Abra uma nova aba do navegador e acesse [https://supabase.com/dashboard/projects](https://supabase.com/dashboard/projects).
2. Clique em **"New project"**.
3. Escolha a organização (se aplicável) e defina:
   - **Name**: `smart-lab-prod` (ou outro nome consistente).
   - **Database Password**: gere uma senha forte e anote em local seguro.
   - **Region**: escolha a mesma região onde seus usuários estarão mais próximos.
4. Clique em **"Create new project"** e aguarde a inicialização (pode levar alguns minutos).

### 4.2 Aplicar o schema SQL

1. Após o projeto estar pronto, entre nele no dashboard Supabase.
2. No menu lateral, clique em **"SQL Editor"**.
3. Crie um **"New query"**.
4. No Codespace, abra o arquivo `supabase/schema.sql` para copiar o conteúdo:
   ```bash
   cat supabase/schema.sql
   ```
5. Copie TODO o conteúdo exibido e cole no editor SQL do Supabase.
6. Clique em **"Run"**. Aguarde até receber a confirmação de execução bem-sucedida.
7. Verifique se as tabelas foram criadas: navegue até **"Table editor"** e confira algumas tabelas (ex.: `users`, `production_lots`).

### 4.3 Ativar RLS (Row Level Security)

1. Ainda no Supabase, abra **"Table editor"**.
2. Para cada tabela crítica (por exemplo `users`, `roles`, `raw_material_lots`, `lab_tests`, etc.), verifique se RLS já está ativado conforme o script SQL. Se alguma não estiver:
   - Selecione a tabela.
   - Vá em **"Security"** > **"Enable RLS"**.
   - Verifique se as políticas geradas pelo script estão listadas. Caso contrário, re-execute a parte correspondente do SQL.

### 4.4 Criar roles iniciais no banco

1. No SQL Editor, rode o script abaixo para inserir as roles básicas:
   ```sql
   insert into roles (id, slug, description) values
     ('admin_root', 'admin_root', 'Superusuário completo'),
     ('plant_manager', 'plant_manager', 'Gestor da fábrica'),
     ('qa_supervisor', 'qa_supervisor', 'Supervisor de QA/QC'),
     ('lab_tech', 'lab_tech', 'Técnico de laboratório'),
     ('auditor_readonly', 'auditor_readonly', 'Auditor somente leitura')
   on conflict (id) do nothing;
   ```
2. Execute e confirme a inserção.

### 4.5 Registrar usuários de teste (opcional)

1. No menu **"Authentication"** > **"Users"**, clique em **"Add User"**.
2. Preencha email, senha temporária e selecione a role adequada (configure via `user_metadata` conforme esperado pelo app, ex.: `{ "role": "qa_supervisor" }`).
3. Clique em **"Add user"**.

### 4.6 Obter chaves do Supabase

1. No menu lateral, clique em **"Project settings"** > **"API"**.
2. Anote os valores:
   - `Project URL` → será usado em `NEXT_PUBLIC_SUPABASE_URL`.
   - `anon public` key → será usado em `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - `service_role` key → será usado para rotinas server-side (`SUPABASE_SERVICE_ROLE_KEY`). Mantenha esta chave em local seguro e **nunca** exponha no frontend.

---

## 5. Configurar variáveis de ambiente

### 5.1 Criar arquivo `.env.local` no Codespace (para desenvolvimento)

1. No terminal, execute:
   ```bash
   cat <<'ENV' > .env.local
   NEXT_PUBLIC_SUPABASE_URL="https://<ID_DO_PROJETO>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<COLAR_CHAVE_ANON>"
   SUPABASE_SERVICE_ROLE_KEY="<COLAR_CHAVE_SERVICE_ROLE>"
   SUPABASE_JWT_SECRET="<COPIAR DE PROJECT SETTINGS > API > JWT Secret>"
   NEXTAUTH_SECRET="$(openssl rand -hex 32)"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ENV
   ```
   > Substitua `<ID_DO_PROJETO>`, `<COLAR_CHAVE_ANON>` e `<COLAR_CHAVE_SERVICE_ROLE>` com os valores reais obtidos no passo anterior. Ajuste `NEXTAUTH_SECRET` conforme o mecanismo de autenticação escolhido.
2. Confirme o conteúdo executando `cat .env.local` e validando os valores.

### 5.2 Registrar variáveis na Vercel (produção)

1. Na aba do projeto na Vercel, clique em **"Settings"** > **"Environment Variables"**.
2. Clique em **"Add"** e cadastre cada variável, uma por vez:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (defina para `https://<seu-projeto>.vercel.app` após o primeiro deploy)
3. Para variáveis secretas (`SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`), marque a opção **"Encrypted"** se disponível.
4. Salve as variáveis para os ambientes desejados (`Production`, `Preview`, `Development`).

---

## 6. Rodar o projeto localmente (Codespace)

1. No terminal do Codespace, certifique-se de que as dependências estão instaladas e o arquivo `.env.local` existe.
2. Execute o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```
3. Aguarde até ver a mensagem `ready - started server on 0.0.0.0:3000`. A Vercel exibirá um botão **"Open in Browser"**. Clique nele para abrir a aplicação em nova aba.
4. Faça login utilizando um usuário criado no Supabase. Caso veja erros de autenticação, confirme as variáveis de ambiente e o script de roles.

---

## 7. Preparar o repositório para deploy

1. No Codespace, verifique o status do Git:
   ```bash
   git status
   ```
2. Se houver alterações a versionar (por exemplo, `.env.local` não deve ser commitado), confirme que não há arquivos sensíveis.
3. Caso precise atualizar qualquer configuração, faça os commits necessários com mensagens claras, por exemplo:
   ```bash
   git add .
   git commit -m "chore: ajustar configurações de deploy"
   git push origin main
   ```
   > Garanta que o branch principal usado na Vercel corresponde ao branch que você está enviando (`main` por padrão).

---

## 8. Configurar o deploy na Vercel

1. Volte à aba do projeto na Vercel.
2. Clique em **"Deployments"** > **"Deploy"** (ou aguarde o deploy automático disparado pelo push).
3. Acompanhe os logs em tempo real. Confirme que as etapas **"Install"**, **"Build"** e **"Deploy"** finalizam sem erros.
4. Caso o build falhe:
   - Clique no deployment com erro para ver o log completo.
   - Resolva o problema no Codespace (ex.: ajustar variáveis, dependências) e execute novo `git push`.

---

## 9. Pós-deploy

1. Após o deploy bem-sucedido, acesse `https://<seu-projeto>.vercel.app`.
2. Faça login para validar a integração com o Supabase.
3. Verifique as páginas principais (dashboard, CRUDs) para garantir que renderizam sem erros.
4. Revise o console do navegador e o painel **"Logs"** na Vercel para garantir que não há erros em produção.
5. Atualize a variável `NEXT_PUBLIC_APP_URL` em **Settings > Environment Variables** para o domínio final, caso ainda esteja como `localhost`.
6. Rode um novo deploy para propagar o valor atualizado (clique em **"Redeploy"** ou faça novo commit/push).

---

## 10. Boas práticas contínuas

- Mantenha o schema do Supabase versionado no arquivo `supabase/schema.sql`. Sempre que fizer mudanças no banco, atualize o arquivo e faça commit.
- Nunca exponha a `SUPABASE_SERVICE_ROLE_KEY` em código cliente ou repositório público. Use-a somente no backend (Edge Functions, Server Components ou API routes).
- Utilize a aba **"Access Control"** da Supabase para monitorar políticas RLS e ajustar permissões conforme as roles.
- Para autenticação biométrica (WebAuthn/Passkeys), configure domínios confiáveis no Supabase e habilite HTTPS (Vercel já fornece).
- Considere criar ambientes separados na Vercel/Supabase (`staging`, `production`) replicando o processo acima para testes antes do deploy final.

---

## 11. Referências úteis

- [Documentação Next.js 14](https://nextjs.org/docs/app)
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Deploy na Vercel](https://vercel.com/docs/deployments/overview)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

Seguindo todos os passos acima na ordem proposta, você terá o SMART LAB configurado do zero até o deploy na Vercel, com a base de dados Supabase integrada e variáveis de ambiente devidamente ajustadas.
