# Plano de Integração Supabase - mycash+

## Informações do Projeto
- **Project ID**: `husmclvhmodkpdmjxrah`
- **Region**: `sa-east-1` (São Paulo)
- **Database Host**: `db.husmclvhmodkpdmjxrah.supabase.co`
- **Supabase URL**: `https://husmclvhmodkpdmjxrah.supabase.co`

---

## 📋 Checklist de Implementação

### Fase 1: Estrutura do Banco de Dados ✅ CONCLUÍDA
- [x] 1.1 Criar ENUMs (transaction_type, account_type, recurrence_frequency, transaction_status)
- [x] 1.2 Criar tabela `users` (integrada com auth.users)
- [x] 1.3 Criar tabela `family_members`
- [x] 1.4 Criar tabela `categories`
- [x] 1.5 Criar tabela `accounts` (unifica contas e cartões)
- [x] 1.6 Criar tabela `transactions`
- [x] 1.7 Criar tabela `recurring_transactions`
- [x] 1.8 Criar índices de performance

### Fase 2: Row Level Security (RLS) ✅ CONCLUÍDA
- [x] 2.1 Habilitar RLS em todas as tabelas
- [x] 2.2 Criar políticas para `users`
- [x] 2.3 Criar políticas para `family_members`
- [x] 2.4 Criar políticas para `categories`
- [x] 2.5 Criar políticas para `accounts`
- [x] 2.6 Criar políticas para `transactions`
- [x] 2.7 Criar políticas para `recurring_transactions`

### Fase 3: Functions e Triggers ✅ CONCLUÍDA
- [x] 3.1 Function: criar user profile após signup (`handle_new_user`)
- [x] 3.2 Function: calcular saldo total (`calculate_total_balance`)
- [x] 3.3 Function: calcular receitas/despesas do período
- [x] 3.4 Function: calcular despesas por categoria
- [x] 3.5 Function: atualizar saldo da conta após transação (`update_account_balance`)
- [x] 3.6 Trigger: auto-update de timestamps (`update_updated_at_column`)
- [x] 3.7 Function: criar categorias padrão para novo usuário (`create_default_categories`)

### Fase 4: Storage ✅ CONCLUÍDA
- [x] 4.1 Criar bucket `avatars` para fotos de perfil (público, 5MB, imagens)
- [x] 4.2 Criar bucket `attachments` para comprovantes (privado, 10MB, imagens/PDF)
- [x] 4.3 Configurar políticas de acesso aos buckets

### Fase 5: Categorias Padrão ✅ CONCLUÍDA
- [x] 5.1 Categorias criadas automaticamente via trigger no signup

### Fase 6: Integração Frontend ✅ CONCLUÍDA
- [x] 6.1 Instalar @supabase/supabase-js
- [x] 6.2 Criar cliente Supabase (`src/lib/supabase.ts`)
- [x] 6.3 Criar contexto de autenticação (`src/contexts/AuthContext.tsx`)
- [x] 6.4 Migrar FinanceContext para usar Supabase
- [x] 6.5 Criar tipos TypeScript (`src/types/database.ts`)
- [x] 6.6 Implementar páginas de login/registro

---

## 🗄️ Estrutura das Tabelas

### ENUMs
```sql
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD');
CREATE TYPE recurrence_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED');
```

### Tabelas Principais
1. **users** - Perfil do usuário (vinculado ao auth.users)
2. **family_members** - Membros da família
3. **categories** - Categorias de transações
4. **accounts** - Contas bancárias e cartões de crédito
5. **transactions** - Transações financeiras
6. **recurring_transactions** - Templates de transações recorrentes

---

## 🔐 Políticas RLS

Todas as tabelas têm políticas que permitem:
- SELECT: usuário autenticado pode ver seus próprios dados
- INSERT: usuário autenticado pode inserir seus próprios dados
- UPDATE: usuário autenticado pode atualizar seus próprios dados
- DELETE: usuário autenticado pode deletar seus próprios dados

---

## 📁 Storage Buckets

### avatars
- Fotos de perfil de usuários e membros da família
- Tamanho máximo: 5MB
- Tipos permitidos: image/jpeg, image/png, image/webp, image/gif

### attachments
- Comprovantes e documentos de transações
- Tamanho máximo: 10MB
- Tipos permitidos: image/*, application/pdf

---

## 🚀 Migrações Aplicadas

1. `001_create_enums` - ENUMs do sistema
2. `002_create_users_table` - Tabela users + trigger de updated_at + RLS
3. `003_create_family_members_table` - Tabela family_members + RLS
4. `004_create_categories_table` - Tabela categories + RLS
5. `005_create_accounts_table` - Tabela accounts (unificada) + RLS
6. `006_create_recurring_transactions_table` - Tabela recurring_transactions + RLS
7. `007_create_transactions_table` - Tabela transactions + RLS
8. `008_create_helper_functions` - Functions de cálculo
9. `009_create_account_balance_trigger` - Triggers de atualização de saldo
10. `010_create_default_categories_function` - Function de categorias padrão

---

## 📂 Arquivos Criados/Modificados

### Novos Arquivos
- `src/lib/supabase.ts` - Cliente Supabase
- `src/types/database.ts` - Tipos do banco de dados
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/pages/auth/Login.tsx` - Página de login
- `src/pages/auth/Register.tsx` - Página de registro
- `src/pages/auth/ForgotPassword.tsx` - Página de recuperação de senha
- `src/components/auth/ProtectedRoute.tsx` - Componente de proteção de rotas
- `.env` - Variáveis de ambiente

### Arquivos Modificados
- `src/App.tsx` - Adicionado AuthProvider e rotas de autenticação
- `src/contexts/FinanceContext.tsx` - Migrado para usar Supabase
- `src/contexts/index.ts` - Exportações atualizadas
- `src/types/index.ts` - Tipos atualizados para compatibilidade
- `src/utils/formatters.ts` - Funções de formatação atualizadas
- `tsconfig.json` - Configuração TypeScript ajustada

---

## 🔑 Configuração de Ambiente

Arquivo `.env`:
```
VITE_SUPABASE_URL=https://husmclvhmodkpdmjxrah.supabase.co
VITE_SUPABASE_ANON_KEY=<sua_chave_anon>
```

---

## 🎯 Próximos Passos (Opcional)

1. **Implementar Goals no banco** - Criar tabela `goals` no Supabase
2. **Implementar Bills no banco** - Criar tabela `bills` no Supabase
3. **Edge Functions** - Criar funções serverless para lógicas complexas
4. **Realtime** - Habilitar subscriptions para atualizações em tempo real
5. **Backup** - Configurar backups automáticos
6. **Monitoramento** - Configurar alertas e logs
