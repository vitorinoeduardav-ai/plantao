# Plantão da Engenharia

Site de estudos gamificado para Engenharia Civil e matérias complementares. Cada tema vira um paciente: a usuária atende triagens, registra confiança, recebe Índice de Cura, acompanha alas e revisões espaçadas. A fonte principal de dados é o Supabase; o app mantém um fallback simples em `localStorage` para uso offline.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth, Database e Storage
- Vercel para publicação futura

## Como criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com).
2. Crie uma organização ou use uma existente.
3. Clique em **New project**.
4. Escolha nome, senha do banco e região.
5. Aguarde o provisionamento do projeto.

## Executar o schema

1. No painel do Supabase, abra **SQL Editor**.
2. Crie uma nova query.
3. Cole o conteúdo de `supabase/schema.sql`.
4. Execute.

O arquivo cria:

- `profiles`
- `patients`
- `questions`
- `theory_medications`
- `patient_attempts`
- `app_settings`
- bucket privado `question-images`
- políticas RLS para cada usuária acessar apenas os próprios dados

## Variáveis de ambiente

No Supabase, vá em **Project Settings > API**.

- `VITE_SUPABASE_URL`: copie o **Project URL**
- `VITE_SUPABASE_ANON_KEY`: copie a **anon public key**

Crie um arquivo `.env` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Use `.env.example` como modelo.

## Instalar e rodar

```bash
npm install
npm run dev
```

Depois abra a URL mostrada pelo Vite.

## Login e contas

O app usa Supabase Auth para:

- login
- cadastro de usuária
- recuperação de senha
- sessão persistida no navegador
- botão de sair
- proteção do app quando não há sessão

Se as variáveis Supabase não estiverem configuradas, a tela de login permite entrar em modo offline.

## Navegação

O app separa o uso diário da administração:

- **Estudo**: Painel Geral, Plano de Tratamento, Plantão, Recepção, Alas, Revisões, Farmácia e Estatísticas.
- **Administração**: Central de Cadastro, Banco de Questões, Medicamentos, Pacientes e Configurações.

A Central de Cadastro concentra criação e edição de matérias, pacientes, questões, importação JSON, medicamentos e avatares. As telas de estudo ficam focadas em atender, revisar, consultar prontuários e estudar medicamentos.

## Avatares de pacientes

Pacientes aceitam:

- avatar pronto da galeria inicial
- upload de imagem
- texto alternativo
- remoção ou troca de avatar

O tipo `Patient` contém `avatarUrl`, `avatarAlt` e `avatarStyle`. No Supabase, esses dados ficam em `patients.avatar_url`, `patients.avatar_alt` e `patients.avatar_style`.

## Plano de Tratamento

A página **Plano de Tratamento** permite cadastrar provas futuras, vincular pacientes/temas, definir peso de 1 a 5 e gerar um plano diário de estudos até a data da prova.

O plano considera:

- proximidade da prova
- peso do tema
- ala atual do paciente
- Índice de Cura
- revisões vencidas
- corações
- erros e erros com alta confiança
- temas ainda não triados

No Supabase, as provas ficam em `exams` e o plano gerado em `daily_study_plan`. No modo offline, ambos ficam salvos no `localStorage` junto com o restante do estado do app.

## Seed inicial

Ao entrar pela primeira vez, `initializeUserData(userId)` verifica se a usuária já tem pacientes. Se não tiver, insere automaticamente:

- pacientes iniciais de Física 2
- pacientes iniciais de Economia
- medicamentos iniciais
- 40 questões autorais iniciais

## Fluxo da triagem

1. Busca questões no Supabase pelo `topic` do paciente.
2. Seleciona 5 questões.
3. Calcula o Índice de Cura.
4. Salva respostas em `patient_attempts`.
5. Atualiza `patients` com:
   - `cure_index`
   - `status`
   - `hearts`
   - `attempts`
   - `consecutive_green`
   - `next_review_at`
   - `last_review_at`
6. Mostra o diagnóstico.

## Índice de Cura

```ts
indiceCura = round((scoreQuestoes * 0.75 + scoreConfianca * 0.25) * 100)
```

Erros com confiança 4 reduzem 5 pontos cada. Acertos com confiança 1 contam, mas aparecem como alerta.

## Imagens

Imagens de enunciado, explicação e medicamentos são salvas no bucket Supabase Storage `question-images`, dentro da pasta da própria usuária:

```text
question-images/{user_id}/questions/...
question-images/{user_id}/explanations/...
question-images/{user_id}/medications/...
```

O fallback offline continua usando IndexedDB.

## Banco de questões

O Banco de Questões permite:

- cadastrar no Supabase
- editar
- excluir
- duplicar
- visualizar
- testar
- importar JSON
- exportar JSON
- upload de imagem para Storage quando logada

## Farmácia

A tela Farmácia permite:

- listar medicamentos do Supabase
- cadastrar medicamento
- editar medicamento
- excluir medicamento
- vincular por `topic` ao paciente

## Backup

As configurações ainda permitem exportar o estado atual como JSON. Em modo Supabase, esse estado é carregado da conta da usuária.

## Publicar na Vercel

1. Suba o projeto para um repositório Git.
2. Na Vercel, clique em **Add New Project**.
3. Importe o repositório.
4. Framework: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.

## Variáveis de ambiente na Vercel

Em **Project Settings > Environment Variables**, adicione:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Depois faça novo deploy.

## Estrutura

```text
src/
  lib/supabaseClient.ts
  services/
    authService.ts
    patientService.ts
    questionService.ts
    theoryService.ts
    attemptService.ts
    settingsService.ts
    imageUploadService.ts
    initializeUserData.ts
  data/
  utils/
  components/
  pages/
supabase/
  schema.sql
```

## Importar questões criadas a partir de fotos

1. Envie a foto da questão para um assistente.
2. Peça questões novas e autorais no formato JSON do app.
3. Copie o JSON.
4. Vá em **Importar Questões**.
5. Cole o JSON.
6. Confira a prévia.
7. Importe para a conta.
