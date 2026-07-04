# Rotary Club HUB Projects

Sistema full-stack para gerenciamento de projetos de clubes Rotary, desenvolvido com Next.js e TypeScript.

## Features Principais

- Sistema de autenticação seguro
- Gestão de acesso prévio para usuários
- Dashboard personalizado para usuários registrados
- Painel administrativo completo
- Gerenciamento de projetos Rotary
- Sistema de comentários
- Upload de fotos e documentos
- Design responsivo com Tailwind CSS

## Tecnologias Utilizadas

- **Frontend**: Next.js, TypeScript, React, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: SQLite (com suporte a Turso/libSQL para produção)
- **Autenticação**: NextAuth.js
- **Validação de formulários**: Zod + React Hook Form
- **Segurança**: Bcrypt para hash de senhas

## Estrutura do Projeto

```
rotary-club-hub/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   ├── lib/                 # Lógica de negócio e funções auxiliares
│   ├── pages/               # Páginas do Next.js
│   ├── styles/              # Estilos globais
│   └── middleware.ts        # Middleware de autenticação
├── public/                  # Arquivos públicos (imagens, etc.)
├── .env                     # Variáveis de ambiente
└── next.config.js           # Configuração do Next.js
```

## Requisitos

- Node.js v16+
- npm ou yarn
- SQLite (para desenvolvimento local)

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd rotary-club-hub
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Crie o arquivo `.env` com base no exemplo:
```bash
cp .env.example .env
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`

## Configuração para Produção

### Banco de Dados

Para produção, recomendamos usar Turso/libSQL para persistência de dados:

1. Crie uma conta no [Turso](https://turso.tech/)
2. Crie um banco de dados
3. Adicione a URL do banco ao `.env`:
```
DATABASE_URL=libsql://seu-banco.turso.io
```

### Deploy no Vercel

1. Faça o deploy no [Vercel](https://vercel.com/)
2. Configure as variáveis de ambiente no painel do Vercel:
   - `DATABASE_URL` - URL do banco de dados Turso
   - `NEXTAUTH_SECRET` - Chave secreta para autenticação
3. Adicione o seguinte ao `next.config.js` para suporte a Turso:
```javascript
const nextConfig = {
  // ... outras configurações
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
    ];
  },
}
```

## Funcionalidades

### 1. Sistema de Acesso Prévio
- Formulário para solicitação de acesso
- Validação de dados
- Processo de aprovação por administrador

### 2. Autenticação
- Login com email e senha
- Proteção de rotas
- JWT tokens para sessão

### 3. Dashboard de Usuário
- Visão geral de projetos
- Atividade recente
- Ações rápidas

### 4. Painel Administrativo
- Gerenciamento de usuários
- Aprovação de solicitações
- Estatísticas do sistema

### 5. Gerenciamento de Projetos
- Criação e edição de projetos
- Upload de fotos e documentos
- Comentários nos projetos
- Status de projeto (Draft, Active, Completed, On Hold)

## Estrutura do Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas principais:

- `users` - Usuários registrados
- `access_requests` - Solicitações de acesso prévio
- `projects` - Projetos Rotary
- `project_photos` - Fotos dos projetos
- `project_documents` - Documentos dos projetos
- `project_comments` - Comentários nos projetos
- `roles` - Papéis de usuários (admin, club_manager, registered_user)
- `audit_logs` - Logs de auditoria

## Segurança

- Senhas criptografadas com bcrypt
- Validação de entrada de dados
- Proteção contra CSRF
- JWT tokens para sessão segura

## Desenvolvimento

### Páginas Principais

1. `/` - Página inicial
2. `/login` - Login de usuário
3. `/pre-access` - Solicitação de acesso prévio
4. `/dashboard` - Dashboard do usuário
5. `/admin` - Painel administrativo
6. `/projects` - Lista de projetos
7. `/projects/[id]` - Detalhes do projeto
8. `/projects/new` - Criação de novo projeto

## Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a MIT License.