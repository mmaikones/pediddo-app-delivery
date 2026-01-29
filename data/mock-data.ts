// ===== MOCK DATA =====
// Dados mockados consistentes com valores em centavos

import {
    Restaurant,
    Category,
    Product,
    OptionGroup,
    ProductOption,
    Customer,
    CustomerAddress
} from '@/types';

// ===== RESTAURANTE =====
export const mockRestaurant: Restaurant = {
    id: 'rest-001',
    name: 'iFome Burger',
    slug: 'ifome-burger',
    logo: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200',
    banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    description: 'Os melhores hambúrgueres artesanais da cidade',
    address: 'Rua das Delícias, 123 - Centro',
    phone: '(11) 99999-9999',
    deliveryFeeCents: 599,
    minDeliveryTime: 30,
    maxDeliveryTime: 50,
    rating: 4.8,
    reviewCount: 1250,
    isOpen: true,
    openingHours: 'Seg-Dom: 11h às 23h'
};

// ===== CATEGORIAS =====
export const mockCategories: Category[] = [
    { id: 'cat-001', name: 'Hambúrgueres', icon: '', slug: 'hamburgueres', sortOrder: 1 },
    { id: 'cat-002', name: 'Pizzas', icon: '', slug: 'pizzas', sortOrder: 2 },
    { id: 'cat-003', name: 'Bebidas', icon: '', slug: 'bebidas', sortOrder: 3 },
    { id: 'cat-004', name: 'Sobremesas', icon: '', slug: 'sobremesas', sortOrder: 4 },
    { id: 'cat-005', name: 'Combos', icon: '', slug: 'combos', sortOrder: 5 },
    { id: 'cat-006', name: 'Saudáveis', icon: '', slug: 'saudaveis', sortOrder: 6 },
];

// ===== OPÇÕES DE PRODUTOS =====
export const mockOptionGroups: OptionGroup[] = [
    // Opções para hambúrgueres
    {
        id: 'og-001',
        productId: 'prod-001',
        name: 'Ponto da Carne',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        options: [
            { id: 'opt-001', groupId: 'og-001', name: 'Mal Passado', extraPriceCents: 0, isActive: true, sortOrder: 1 },
            { id: 'opt-002', groupId: 'og-001', name: 'Ao Ponto', extraPriceCents: 0, isActive: true, sortOrder: 2 },
            { id: 'opt-003', groupId: 'og-001', name: 'Bem Passado', extraPriceCents: 0, isActive: true, sortOrder: 3 },
        ]
    },
    {
        id: 'og-002',
        productId: 'prod-001',
        name: 'Adicionais',
        isRequired: false,
        minSelections: 0,
        maxSelections: 5,
        sortOrder: 2,
        options: [
            { id: 'opt-004', groupId: 'og-002', name: 'Bacon Extra', extraPriceCents: 500, isActive: true, sortOrder: 1 },
            { id: 'opt-005', groupId: 'og-002', name: 'Queijo Extra', extraPriceCents: 400, isActive: true, sortOrder: 2 },
            { id: 'opt-006', groupId: 'og-002', name: 'Ovo', extraPriceCents: 300, isActive: true, sortOrder: 3 },
            { id: 'opt-007', groupId: 'og-002', name: 'Cebola Caramelizada', extraPriceCents: 350, isActive: true, sortOrder: 4 },
        ]
    },
    // Opções para prod-002 X-Salada
    {
        id: 'og-003',
        productId: 'prod-002',
        name: 'Ponto da Carne',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        options: [
            { id: 'opt-008', groupId: 'og-003', name: 'Mal Passado', extraPriceCents: 0, isActive: true, sortOrder: 1 },
            { id: 'opt-009', groupId: 'og-003', name: 'Ao Ponto', extraPriceCents: 0, isActive: true, sortOrder: 2 },
            { id: 'opt-010', groupId: 'og-003', name: 'Bem Passado', extraPriceCents: 0, isActive: true, sortOrder: 3 },
        ]
    },
    // Opções para prod-003 X-Tudo
    {
        id: 'og-004',
        productId: 'prod-003',
        name: 'Ponto da Carne',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        options: [
            { id: 'opt-011', groupId: 'og-004', name: 'Mal Passado', extraPriceCents: 0, isActive: true, sortOrder: 1 },
            { id: 'opt-012', groupId: 'og-004', name: 'Ao Ponto', extraPriceCents: 0, isActive: true, sortOrder: 2 },
            { id: 'opt-013', groupId: 'og-004', name: 'Bem Passado', extraPriceCents: 0, isActive: true, sortOrder: 3 },
        ]
    },
    // Opções para pizzas
    {
        id: 'og-005',
        productId: 'prod-004',
        name: 'Borda',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 1,
        options: [
            { id: 'opt-014', groupId: 'og-005', name: 'Borda Tradicional', extraPriceCents: 0, isActive: true, sortOrder: 1 },
            { id: 'opt-015', groupId: 'og-005', name: 'Borda Catupiry', extraPriceCents: 800, isActive: true, sortOrder: 2 },
            { id: 'opt-016', groupId: 'og-005', name: 'Borda Cheddar', extraPriceCents: 800, isActive: true, sortOrder: 3 },
        ]
    },
    {
        id: 'og-006',
        productId: 'prod-005',
        name: 'Borda',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 1,
        options: [
            { id: 'opt-017', groupId: 'og-006', name: 'Borda Tradicional', extraPriceCents: 0, isActive: true, sortOrder: 1 },
            { id: 'opt-018', groupId: 'og-006', name: 'Borda Catupiry', extraPriceCents: 800, isActive: true, sortOrder: 2 },
            { id: 'opt-019', groupId: 'og-006', name: 'Borda Cheddar', extraPriceCents: 800, isActive: true, sortOrder: 3 },
        ]
    },
    // Opções para bebidas - tamanho
    {
        id: 'og-007',
        productId: 'prod-006',
        name: 'Tamanho',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        options: [
            { id: 'opt-020', groupId: 'og-007', name: '350ml', extraPriceCents: 0, isActive: true, sortOrder: 1 },
            { id: 'opt-021', groupId: 'og-007', name: '600ml', extraPriceCents: 300, isActive: true, sortOrder: 2 },
            { id: 'opt-022', groupId: 'og-007', name: '2L', extraPriceCents: 700, isActive: true, sortOrder: 3 },
        ]
    },
];

// ===== PRODUTOS =====
export const mockProducts: Product[] = [
    {
        id: 'prod-001',
        categoryId: 'cat-001',
        name: 'X-Bacon Artesanal',
        description: 'Hambúrguer artesanal 180g, queijo cheddar, bacon crocante, alface, tomate e molho especial',
        priceCents: 3290,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isActive: true,
        isPopular: true,
        preparationTime: 20,
        optionGroups: []
    },
    {
        id: 'prod-002',
        categoryId: 'cat-001',
        name: 'X-Salada Classic',
        description: 'Hambúrguer 150g, queijo, alface, tomate, cebola e maionese',
        priceCents: 2490,
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
        isActive: true,
        isPopular: true,
        preparationTime: 15,
        optionGroups: []
    },
    {
        id: 'prod-003',
        categoryId: 'cat-001',
        name: 'X-Tudo Especial',
        description: 'Duplo hambúrguer, bacon, ovo, queijo, presunto, alface, tomate e molhos',
        priceCents: 3990,
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
        isActive: true,
        isPopular: true,
        preparationTime: 25,
        optionGroups: []
    },
    {
        id: 'prod-004',
        categoryId: 'cat-002',
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, tomate e manjericão fresco',
        priceCents: 4590,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        isActive: true,
        isPopular: true,
        preparationTime: 30,
        optionGroups: []
    },
    {
        id: 'prod-005',
        categoryId: 'cat-002',
        name: 'Pizza Calabresa',
        description: 'Molho de tomate, mussarela, calabresa fatiada e cebola',
        priceCents: 4990,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        isActive: true,
        isPopular: true,
        preparationTime: 30,
        optionGroups: []
    },
    {
        id: 'prod-006',
        categoryId: 'cat-003',
        name: 'Coca-Cola',
        description: 'Refrigerante Coca-Cola gelada',
        priceCents: 690,
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        isActive: true,
        isPopular: false,
        preparationTime: 1,
        optionGroups: []
    },
    {
        id: 'prod-007',
        categoryId: 'cat-003',
        name: 'Suco Natural',
        description: 'Suco natural de laranja ou limão - 500ml',
        priceCents: 890,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        isActive: true,
        isPopular: false,
        preparationTime: 5,
        optionGroups: []
    },
    {
        id: 'prod-008',
        categoryId: 'cat-004',
        name: 'Brownie com Sorvete',
        description: 'Brownie de chocolate com bola de sorvete de creme e calda',
        priceCents: 1890,
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
        isActive: true,
        isPopular: false,
        preparationTime: 10,
        optionGroups: []
    },
    {
        id: 'prod-009',
        categoryId: 'cat-004',
        name: 'Petit Gateau',
        description: 'Bolo de chocolate com recheio cremoso e sorvete',
        priceCents: 2190,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
        isActive: true,
        isPopular: false,
        preparationTime: 15,
        optionGroups: []
    },
    {
        id: 'prod-010',
        categoryId: 'cat-005',
        name: 'Combo Família',
        description: '2 X-Bacon + 2 X-Salada + 4 Refrigerantes + Batata Grande',
        priceCents: 9990,
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400',
        isActive: true,
        isPopular: false,
        preparationTime: 35,
        optionGroups: []
    },
    {
        id: 'prod-011',
        categoryId: 'cat-006',
        name: 'Salada Caesar',
        description: 'Alface americana, croutons, parmesão e molho caesar',
        priceCents: 2290,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        isActive: true,
        isPopular: false,
        preparationTime: 10,
        optionGroups: []
    },
];

// ===== CLIENTES MOCK =====
export const mockCustomers: Customer[] = [
    {
        id: 'cust-001',
        name: 'João Silva',
        phone: '(11) 99999-1234',
        email: 'joao@email.com',
        addresses: [
            {
                id: 'addr-001',
                customerId: 'cust-001',
                label: 'Casa',
                street: 'Rua das Flores',
                number: '123',
                complement: 'Apto 45',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567',
                isDefault: true
            }
        ],
        createdAt: '2024-01-15T10:30:00Z'
    },
    {
        id: 'cust-002',
        name: 'Maria Santos',
        phone: '(11) 98888-5678',
        email: 'maria@email.com',
        addresses: [
            {
                id: 'addr-002',
                customerId: 'cust-002',
                label: 'Trabalho',
                street: 'Av. Paulista',
                number: '1000',
                complement: 'Sala 501',
                neighborhood: 'Bela Vista',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01310-100',
                isDefault: true
            }
        ],
        createdAt: '2024-02-20T14:15:00Z'
    }
];

// ===== FUNÇÃO PARA CARREGAR PRODUTOS COM OPÇÕES =====
export function getProductsWithOptions(): Product[] {
    return mockProducts.map(product => {
        const productOptionGroups = mockOptionGroups.filter(og => og.productId === product.id);
        return {
            ...product,
            optionGroups: productOptionGroups
        };
    });
}

// ===== CUSTOMER PADRÃO (guest) =====
export function createDefaultCustomer(): Customer {
    return {
        id: 'cust-guest-001',
        name: 'Visitante',
        phone: '',
        email: '',
        addresses: [],
        createdAt: new Date().toISOString()
    };
}
