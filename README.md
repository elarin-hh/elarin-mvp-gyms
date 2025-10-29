# Elarin Organizations Admin

Painel administrativo para organizações parceiras da plataforma Elarin.

## 🎯 Funcionalidades

- **Autenticação**: Login e cadastro de organizações parceiras
- **Dashboard**: Visão geral com estatísticas de usuários
- **Gestão de Usuários**:
  - Listagem de usuários vinculados
  - Ativar/desativar usuários
  - Remover vínculos de usuários
- **Estatísticas**: Total de usuários, ativos e inativos

## 🛠️ Tecnologias

- **SvelteKit 2.8** - Framework web moderno
- **Svelte 5** - Componentes reativos
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Vite** - Build tool rápida

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 🔧 Configuração

### Backend API

O projeto espera que o backend Elarin esteja rodando em `http://localhost:3001`.

Para alterar a URL do backend, edite:
```typescript
// src/lib/api/rest.client.ts
const API_BASE_URL = 'http://localhost:3001';
```

### Endpoints Esperados

O backend deve fornecer os seguintes endpoints:

#### Autenticação
- `POST /organizations/auth/register` - Cadastrar nova organização
- `POST /organizations/auth/login` - Login de organização
- `POST /organizations/auth/logout` - Logout

#### Gestão
- `GET /organizations/profile` - Dados da organização logada
- `GET /organizations/users` - Listar usuários vinculados
- `PATCH /organizations/users/:id/toggle` - Ativar/desativar usuário
- `DELETE /organizations/users/:id` - Remover vínculo
- `GET /organizations/stats` - Estatísticas

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   ├── api/                        # Clients da API
│   │   ├── rest.client.ts          # Cliente HTTP genérico
│   │   └── organizations.api.ts    # Endpoints de organizações
│   ├── components/
│   │   ├── common/                 # Componentes reutilizáveis
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   └── Modal.svelte
│   │   └── organization/           # Componentes específicos
│   │       ├── StatsCard.svelte
│   │       └── UsersList.svelte
│   ├── stores/                     # Gerenciamento de estado
│   │   └── organization-auth.store.ts
│   └── types/                      # Tipos TypeScript
│       ├── organization.ts
│       └── api.ts
├── routes/
│   ├── login/                      # Página de login
│   ├── register/                   # Página de cadastro
│   ├── dashboard/                  # Dashboard principal
│   └── +page.svelte                # Redirecionamento inicial
├── app.css                         # Estilos globais
└── app.html                        # HTML base
```

## 🎨 Design

O projeto segue o mesmo padrão visual do frontend principal Elarin:
- Paleta de cores primary (azul sky)
- Fonte Nunito Sans
- Efeito glass-morphism nas páginas de autenticação
- Design responsivo mobile-first

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Token armazenado em `localStorage` como `organization_access_token`
- Separado do token de usuários comuns para evitar conflitos
- Redirecionamento automático para login em caso de token inválido

## 📝 Tipos de Dados

### Organization (Organização)
```typescript
interface Organization {
  id: number;
  name: string;
  code: string;
  federal_tax_id: string;
  email: string;
  phone: string;
  address: string;
  responsible_name: string;
  plan_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### OrganizationUser (Usuário Vinculado)
```typescript
interface OrganizationUser {
  id: number;
  user_id: number;
  organization_id: number;
  role: string;
  is_active: boolean;
  created_at: string;
  users: {
    id: number;
    email: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
  };
}
```

### OrganizationStats (Estatísticas)
```typescript
interface OrganizationStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
}
```

## 🚀 Próximos Passos

Para integração completa:

1. **Backend**: Implementar os endpoints listados acima no backend Elarin
2. **Database**: Tabelas já existentes:
   - `organizations`: Dados das organizações
   - `organization_users`: Vínculos entre organizações e usuários
3. **Autenticação**: Adicionar autenticação JWT específica para organizações
4. **Deploy**: Configurar deploy em produção

## 📄 Licença

Projeto Elarin - Todos os direitos reservados
