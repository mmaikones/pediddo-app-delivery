# Notas de Lançamento (MVP Fixes)

## 🔴 Correções Críticas (P0)

- **Checkout Corrigido**: O erro `QRCodeIcon is not defined` foi resolvido. A página de checkout agora carrega corretamente e permite finalizar pedidos.

## 🟠 Novas Funcionalidades (P1)

### 1. Sistema de Autenticação (Mock)
- **Login**: Acesse `/login`.
  - Admin: `admin@pediddo.com` (senha: qualquer)
  - Cliente: `cliente@teste.com` (senha: qualquer)
- **Cadastro**: Acesse `/register` para criar nova conta.
- **Perfil**: Página de perfil agora mostra dados do usuário logado e botão de sair.

### 2. Gestão de Produtos (Admin)
- **Novo Produto**: Botão "+ Novo Produto" em `/admin/products`.
- **Editar Produto**: Botão "✏️ Editar Dados" na página de detalhes do produto.
- **Formulário Completo**:
  - Dados Básicos (Nome, Preço, Categoria, Imagem)
  - Gestão de Grupos de Opções (Adicionais)
  - Status e Destaque

### 3. Gestão de Endereços
- **Meus Endereços**: Acesse `/profile/addresses` para listar, definir padrão e excluir.
- **Novo Endereço**: Botão para adicionar novo endereço funcional.

## Como Testar

1. **Checkout**: Adicione itens ao carrinho e vá para `/checkout`.
2. **Admin**:
   - Faça login como admin (`admin@pediddo.com`).
   - Vá para `/admin/products`.
   - Crie um novo produto.
   - Edite um produto existente.
3. **Cliente**:
   - Crie uma conta nova.
   - Cadastre um endereço.
   - Faça um pedido.

## Status da Aplicação

- Servidor rodando na porta: **3333**
- Banco de dados: **Mock (localStorage)**
