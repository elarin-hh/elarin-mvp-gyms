# Elarin Gym Admin

Painel administrativo para academias parceiras da plataforma Elarin.

## 🎯 Funcionalidades

- **Autenticação**: Login e cadastro de academias parceiras
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
- `POST /gyms/auth/register` - Cadastrar nova academia
- `POST /gyms/auth/login` - Login de academia
- `POST /gyms/auth/logout` - Logout

#### Gestão
- `GET /gyms/profile` - Dados da academia logada
- `GET /gyms/users` - Listar usuários vinculados
- `PATCH /gyms/users/:id/toggle` - Ativar/desativar usuário
- `DELETE /gyms/users/:id` - Remover vínculo
- `GET /gyms/stats` - Estatísticas

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   ├── api/                    # Clients da API
│   │   ├── rest.client.ts      # Cliente HTTP genérico
│   │   └── gyms.api.ts         # Endpoints de academias
│   ├── components/
│   │   ├── common/             # Componentes reutilizáveis
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   └── Modal.svelte
│   │   └── gym/                # Componentes específicos
│   │       ├── StatsCard.svelte
│   │       └── UsersList.svelte
│   ├── stores/                 # Gerenciamento de estado
│   │   └── gym-auth.store.ts
│   └── types/                  # Tipos TypeScript
│       ├── gym.ts
│       └── api.ts
├── routes/
│   ├── login/                  # Página de login
│   ├── register/               # Página de cadastro
│   ├── dashboard/              # Dashboard principal
│   └── +page.svelte            # Redirecionamento inicial
├── app.css                     # Estilos globais
└── app.html                    # HTML base
```

## 🎨 Design

O projeto segue o mesmo padrão visual do frontend principal Elarin:
- Paleta de cores primary (azul sky)
- Fonte Nunito Sans
- Efeito glass-morphism nas páginas de autenticação
- Design responsivo mobile-first

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Token armazenado em `localStorage` como `gym_access_token`
- Separado do token de usuários comuns para evitar conflitos
- Redirecionamento automático para login em caso de token inválido

## 📝 Tipos de Dados

### Gym (Academia)
```typescript
interface Gym {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  responsible_name: string;
  is_active: boolean;
  created_at: string;
}
```

### GymUser (Usuário Vinculado)
```typescript
interface GymUser {
  id: string;
  full_name: string;
  email: string;
  status: 'active' | 'inactive';
  linked_at: string;
}
```

### GymStats (Estatísticas)
```typescript
interface GymStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
}
```

## 🚀 Próximos Passos

Para integração completa:

1. **Backend**: Implementar os endpoints listados acima no backend Elarin
2. **Database**: Criar tabelas:
   - `gyms`: Dados das academias
   - `gym_user_links`: Vínculos entre academias e usuários
3. **Autenticação**: Adicionar autenticação JWT específica para academias
4. **Deploy**: Configurar deploy em produção

## 📄 Licença

Projeto Elarin - Todos os direitos reservados
