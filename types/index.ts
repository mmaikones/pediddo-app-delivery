// ===== MONEY (em centavos para evitar bugs de float) =====
export type MoneyCents = number;

// ===== RESTAURANT =====
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  address: string;
  phone: string;
  deliveryFeeCents: MoneyCents;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: string;
}

// ===== CATEGORY =====
export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  sortOrder: number;
}

// ===== PRODUCT =====
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceCents: MoneyCents;
  image: string;
  isActive: boolean;
  isPopular: boolean;
  preparationTime: number;
  optionGroups: OptionGroup[];
}

// ===== OPTION GROUP =====
export interface OptionGroup {
  id: string;
  productId: string;
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: ProductOption[];
}

// ===== PRODUCT OPTION =====
export interface ProductOption {
  id: string;
  groupId: string;
  name: string;
  extraPriceCents: MoneyCents;
  isActive: boolean;
  sortOrder: number;
}

// ===== SELECTED OPTION (para carrinho/pedido) =====
export interface SelectedOption {
  groupId: string;
  optionId: string;
  name: string;
  extraPriceCents: MoneyCents;
}

// ===== CART ITEM =====
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  basePriceCents: MoneyCents;
  selectedOptions: SelectedOption[];
  notes?: string;
  unitTotalCents: MoneyCents;
  lineTotalCents: MoneyCents;
}

// ===== CART =====
export interface Cart {
  items: CartItem[];
  subtotalCents: MoneyCents;
  deliveryFeeCents: MoneyCents;
  totalCents: MoneyCents;
}

// ===== ADDRESS =====
export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
  isDefault: boolean;
}

// ===== PAYMENT METHOD =====
export type PaymentMethodType = 'PIX' | 'CASH' | 'CREDIT' | 'DEBIT';

export interface PaymentMethod {
  type: PaymentMethodType;
  changeForCents?: MoneyCents;
}

// ===== CUSTOMER =====
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: CustomerAddress[];
  createdAt: string;
}

// ===== ORDER STATUS =====
export type OrderStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED';

// ===== ORDER STATUS EVENT =====
export interface OrderStatusEvent {
  status: OrderStatus;
  atISO: string;
  note?: string;
}

// ===== ORDER ITEM =====
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPriceCents: MoneyCents;
  selectedOptions: SelectedOption[];
  notes?: string;
  lineTotalCents: MoneyCents;
}

// ===== ORDER =====
export interface Order {
  id: string;
  displayCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  addressSnapshot: CustomerAddress;
  paymentSnapshot: PaymentMethod;
  items: OrderItem[];
  subtotalCents: MoneyCents;
  deliveryFeeCents: MoneyCents;
  totalCents: MoneyCents;
  status: OrderStatus;
  timeline: OrderStatusEvent[];
  notes?: string;
  createdAtISO: string;
  updatedAtISO: string;
}

// ===== ADMIN USER =====
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
}

// ===== DASHBOARD STATS =====
export interface DashboardStats {
  ordersToday: number;
  revenueTodayCents: MoneyCents;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  canceledOrders: number;
}

// ===== HELPERS =====
export function formatCentsToBRL(cents: MoneyCents): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
