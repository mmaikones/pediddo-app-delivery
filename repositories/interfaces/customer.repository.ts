import { Customer, CustomerAddress, Order } from '@/types';

// ========================
// CUSTOMER REPOSITORY INTERFACE
// Prepared for Supabase integration
// ========================
export interface ICustomerRepository {
    // Customer operations
    getAllCustomers(): Promise<Customer[]>;
    getCustomerById(id: string): Promise<Customer | null>;
    getCustomerByEmail(email: string): Promise<Customer | null>;
    createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'addresses'>): Promise<Customer>;
    updateCustomer(id: string, data: Partial<Customer>): Promise<Customer>;
    deleteCustomer(id: string): Promise<void>;

    // Address operations
    getCustomerAddresses(customerId: string): Promise<CustomerAddress[]>;
    addAddress(customerId: string, data: Omit<CustomerAddress, 'id' | 'customerId'>): Promise<CustomerAddress>;
    updateAddress(id: string, data: Partial<CustomerAddress>): Promise<CustomerAddress>;
    deleteAddress(id: string): Promise<void>;
    setDefaultAddress(customerId: string, addressId: string): Promise<void>;

    // Order history
    getCustomerOrders(customerId: string): Promise<Order[]>;
}
