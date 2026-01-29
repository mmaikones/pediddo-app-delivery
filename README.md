# 🍔 Pediddo - MVP Delivery App

Um MVP completo de aplicativo de delivery de comida white-label, construído com Next.js 15, TypeScript e Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan)

## 🚀 Funcionalidades

### Cliente (App)
- ✅ **Home** - Busca, categorias e listagem de produtos
- ✅ **Página de Produto** - Opções configuráveis, validação e adicionar ao carrinho
- ✅ **Carrinho** - Gerenciamento de itens com persistência real
- ✅ **Checkout** - Formulário de dados, endereço e pagamento
- ✅ **Pedidos** - Lista e detalhes com timeline de status (dados reais)
- ✅ **Busca** - Busca em tempo real de produtos
- ✅ **Perfil** - Dados do cliente

### Admin
- ✅ **Dashboard** - Estatísticas reais dos pedidos
- ✅ **Pedidos** - Lista, filtros e atualização de status
- ✅ **Produtos** - Ativar/desativar produtos (impacta cliente)
- ✅ **Opções de Produtos** - Pausar/reativar opções instantaneamente
- ✅ **Clientes** - Lista de clientes

## 📦 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

O aplicativo estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
/app                 -> Páginas e rotas (App Router)
  /admin             -> Painel administrativo
  /cart              -> Carrinho
  /checkout          -> Finalização de pedido
  /orders            -> Lista e detalhes de pedidos
  /product/[id]      -> Página de produto
  /profile           -> Perfil do usuário
  /search            -> Busca de produtos

/components          -> Componentes UI reutilizáveis
  /ui                -> Botões, inputs, cards, etc.
  /layout            -> Header, navegação, sidebar

/contexts            -> React Contexts para estado global
  CartContext.tsx    -> Carrinho com persistência
  OrdersContext.tsx  -> Pedidos com persistência
  CustomerContext.tsx -> Cliente com persistência

/data                -> Dados mockados iniciais
/repositories        -> Repositórios (onde trocar para Supabase)
/services            -> Lógica de negócio pura
/types               -> Tipos TypeScript compartilhados
```

## 💾 Persistência de Dados (localStorage)

Todos os dados são persistidos em localStorage:

| Chave | Conteúdo |
|-------|----------|
| `ifome.cart.v1` | Carrinho de compras |
| `ifome.orders.v1` | Pedidos |
| `ifome.customer.v1` | Cliente atual |
| `ifome.products.v1` | Produtos (com alterações admin) |
| `ifome.optionGroups.v1` | Grupos de opções |
| `ifome.orderCounter.v1` | Contador de displayCode |

## 🔄 Integração com Supabase

### Onde substituir os MockRepositories

O projeto está preparado para integração com Supabase. Para migrar:

1. **Crie as implementações Supabase em `/repositories/supabase/`**:
   - `supabase-product.repository.ts`
   - `supabase-cart.repository.ts`
   - `supabase-order.repository.ts`
   - `supabase-customer.repository.ts`

2. **Implemente as interfaces existentes**:
   - `IProductRepository` → Supabase query em products + option_groups + options
   - `ICartRepository` → Pode continuar local ou usar Supabase para carrinhos multi-device
   - `IOrderRepository` → Supabase com RLS por customer/tenant
   - `ICustomerRepository` → Supabase Auth + profiles

3. **Troque os exports em `/repositories/index.ts`**:
   ```typescript
   // De:
   import { MockProductRepository } from './product.repository';
   
   // Para:
   import { SupabaseProductRepository } from './supabase/supabase-product.repository';
   
   export function getProductRepository(): IProductRepository {
     return new SupabaseProductRepository();
   }
   ```

### Tabelas Supabase Esperadas

```sql
-- Restaurante/Tenant
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  banner TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  delivery_fee_cents INTEGER DEFAULT 0,
  min_delivery_time INTEGER DEFAULT 30,
  max_delivery_time INTEGER DEFAULT 50,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  opening_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  name TEXT NOT NULL,
  icon TEXT,
  slug TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  preparation_time INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grupos de Opções
CREATE TABLE option_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  min_selections INTEGER DEFAULT 0,
  max_selections INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- Opções
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES option_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  extra_price_cents INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Endereços
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Casa',
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  is_default BOOLEAN DEFAULT false
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  customer_id UUID REFERENCES customers(id),
  display_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  address_snapshot JSONB NOT NULL,
  payment_snapshot JSONB NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  delivery_fee_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  selected_options JSONB DEFAULT '[]',
  notes TEXT,
  line_total_cents INTEGER NOT NULL
);

-- Histórico de Status
CREATE TABLE order_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🧪 Fluxo de Teste Manual

1. **Abrir Home** → Navegar pelos produtos
2. **Abrir Produto** → Selecionar opções obrigatórias
3. **Adicionar ao Carrinho** → Ver badge atualizar
4. **Ir ao Carrinho** → Alterar quantidade → Total recalcula
5. **Finalizar** → Checkout → Criar endereço → Escolher PIX → Confirmar
6. **Ver Pedido** em `/orders` → Status "Pendente"
7. **Admin** → `/admin/orders` → Abrir pedido → Mudar para "Em preparo"
8. **Voltar ao Cliente** → `/orders` → Status atualizado!
9. **Admin Produtos** → Pausar uma opção → No cliente ela some
10. **Admin Produtos** → Desativar produto → Ele some da home

## 📄 Licença

Este projeto é um MVP para demonstração. Sinta-se livre para usar como base para seu próprio projeto.

---

Desenvolvido com ❤️ para fins de demonstração.
