import { Customer, CustomerAddress, Order } from '@/types';
import { ICustomerRepository } from '../interfaces/customer.repository';
import { mockCustomers, mockOrders } from '@/data/mock-data';

// ========================
// MOCK CUSTOMER REPOSITORY
// Replace with Supabase implementation later
// ========================

const STORAGE_KEY = 'ifome_customers';

export class MockCustomerRepository implements ICustomerRepository {
    private customers: Customer[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.customers = JSON.parse(stored);
            } else {
                this.customers = [...mockCustomers];
                this.saveToStorage();
            }
        } else {
            this.customers = [...mockCustomers];
        }
    }

    private saveToStorage(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customers));
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateId(): string {
        return `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async getAllCustomers(): Promise<Customer[]> {
        await this.delay(100);
        return this.customers.map(c => ({ ...c }));
    }

    async getCustomerById(id: string): Promise<Customer | null> {
        await this.delay(50);
        const customer = this.customers.find(c => c.id === id);
        return customer ? { ...customer } : null;
    }

    async getCustomerByEmail(email: string): Promise<Customer | null> {
        await this.delay(50);
        const customer = this.customers.find(c => c.email === email);
        return customer ? { ...customer } : null;
    }

    async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'addresses'>): Promise<Customer> {
        await this.delay(100);

        const newCustomer: Customer = {
            ...data,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            addresses: []
        };

        this.customers.push(newCustomer);
        this.saveToStorage();
        return { ...newCustomer };
    }

    async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
        await this.delay(100);

        const index = this.customers.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Customer not found');

        this.customers[index] = { ...this.customers[index], ...data };
        this.saveToStorage();
        return { ...this.customers[index] };
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.delay(100);
        this.customers = this.customers.filter(c => c.id !== id);
        this.saveToStorage();
    }

    async getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
        await this.delay(50);
        const customer = this.customers.find(c => c.id === customerId);
        return customer ? [...customer.addresses] : [];
    }

    async addAddress(customerId: string, data: Omit<CustomerAddress, 'id' | 'customerId'>): Promise<CustomerAddress> {
        await this.delay(100);

        const customerIndex = this.customers.findIndex(c => c.id === customerId);
        if (customerIndex === -1) throw new Error('Customer not found');

        const newAddress: CustomerAddress = {
            ...data,
            id: `addr-${Date.now()}`,
            customerId
        };

        // If this is the first address or marked as default, set as default
        if (newAddress.isDefault || this.customers[customerIndex].addresses.length === 0) {
            this.customers[customerIndex].addresses.forEach(a => a.isDefault = false);
            newAddress.isDefault = true;
        }

        this.customers[customerIndex].addresses.push(newAddress);
        this.saveToStorage();
        return { ...newAddress };
    }

    async updateAddress(id: string, data: Partial<CustomerAddress>): Promise<CustomerAddress> {
        await this.delay(100);

        for (const customer of this.customers) {
            const addrIndex = customer.addresses.findIndex(a => a.id === id);
            if (addrIndex !== -1) {
                customer.addresses[addrIndex] = { ...customer.addresses[addrIndex], ...data };
                this.saveToStorage();
                return { ...customer.addresses[addrIndex] };
            }
        }

        throw new Error('Address not found');
    }

    async deleteAddress(id: string): Promise<void> {
        await this.delay(100);

        for (const customer of this.customers) {
            const addrIndex = customer.addresses.findIndex(a => a.id === id);
            if (addrIndex !== -1) {
                customer.addresses.splice(addrIndex, 1);
                this.saveToStorage();
                return;
            }
        }
    }

    async setDefaultAddress(customerId: string, addressId: string): Promise<void> {
        await this.delay(100);

        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) throw new Error('Customer not found');

        customer.addresses.forEach(a => {
            a.isDefault = a.id === addressId;
        });

        this.saveToStorage();
    }

    async getCustomerOrders(customerId: string): Promise<Order[]> {
        await this.delay(100);
        // Get orders from localStorage or mock data
        const stored = typeof window !== 'undefined' ? localStorage.getItem('ifome_orders') : null;
        const orders: Order[] = stored ? JSON.parse(stored) : mockOrders;
        return orders.filter(o => o.customerId === customerId);
    }
}
