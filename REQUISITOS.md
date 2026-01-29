# Requisitos do Aplicativo "Pediddo"

Este documento descreve as funcionalidades necessárias para a versão inicial (MVP) do aplicativo de delivery.

## 1. Visão Geral
- **Objetivo:** Criar um aplicativo de delivery completo, inspirado em funcionalidades de apps como Goomer e iFood.
- **Foco:** Permitir que a empresa (restaurante) gerencie cardápios, horários e pedidos de forma autônoma.
- **Tecnologias:** O projeto é baseado em Next.js, TypeScript e Tailwind CSS.

---

## 2. Funcionalidades do Painel da Empresa (Admin)

### 2.1. Gestão de Cardápios
- **Múltiplos Cardápios:** A empresa deve poder criar, editar e excluir múltiplos cardápios (ex: "Cardápio Principal", "Promoções de Almoço", "Especiais do Fim de Semana").
- **Status do Cardápio:** Cada cardápio deve ter um status (Ativo/Inativo).

### 2.2. Horários de Funcionamento dos Cardápios
- **Agendamento:** A empresa deve poder associar um ou mais horários de funcionamento a cada cardápio.
- **Regras de Horário:** Um horário consiste em:
  - Dias da semana (ex: Segunda a Sexta, Sábado e Domingo).
  - Hora de início (ex: 11:00).
  - Hora de fim (ex: 15:00).
- **Lógica:** O cliente final só poderá ver e pedir de um cardápio que esteja dentro do seu horário de funcionamento ativo.

### 2.3. Gestão de Categorias e Produtos
- **Categorias:**
  - Dentro de cada cardápio, a empresa deve poder criar categorias (ex: "Bebidas", "Pizzas", "Sobremesas").
  - As categorias podem ser reordenadas.
- **Produtos:**
  - Dentro de cada categoria, a empresa deve poder criar produtos.
  - **Campos do Produto:** Nome, Descrição, Preço, Imagem, Status (Disponível/Indisponível).

### 2.4. Gestão de Pedidos
- **Dashboard de Pedidos:** Uma tela para visualizar os pedidos recebidos em tempo real.
- **Status do Pedido:** Os pedidos devem ter status claros (ex: "Pendente", "Em Preparo", "Saiu para Entrega", "Concluído", "Cancelado").
- **Ações:** A empresa deve poder atualizar o status de um pedido.

---

## 3. Funcionalidades do Cliente (App/Site)

### 3.1. Visualização do Cardápio
- **Cardápio Dinâmico:** O cliente acessa a página e vê automaticamente o cardápio correto que está ativo para o dia e horário.
- **Interface Clara:** Navegação fácil pelas categorias e produtos.

### 3.2. Carrinho de Compras
- **Adicionar/Remover Itens:** Funcionalidade padrão de um carrinho de e-commerce.
- **Observações:** Um campo para o cliente adicionar observações em um item (ex: "Sem cebola").
- **Resumo:** O carrinho deve mostrar o subtotal dos itens, taxa de entrega (se houver) e o total.

### 3.3. Checkout
- **Informações do Cliente:** Nome, Telefone (WhatsApp).
- **Endereço de Entrega:** CEP, Rua, Número, Complemento, Bairro.
- **Forma de Pagamento:** Inicialmente, "Pagar na Entrega" (Dinheiro ou Cartão).

---

## 4. Próximos Passos (Pós-MVP)
- Pagamento online (Pix, Cartão de Crédito).
- Sistema de cupons de desconto.
- Área de login para clientes.
- Sistema de avaliação de pedidos.
