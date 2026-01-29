// ===== CUSTOMER REPOSITORY =====
// Interface e implementação mock para clientes

import { Customer, CustomerAddress, generateUUID } from '@/types';
import { storage, STORAGE_KEYS } from '@/services/storage';
import { mockCustomers, createDefaultCustomer } from '@/data/mock-data';

// ===== INTERFACE =====
export interface ICustomerRepository {
    getCurrentCustomer(): Customer;
    saveCustomer(customer: Customer): void;
    addAddress(address: Omit<CustomerAddress, 'id' | 'customerId'>): CustomerAddress;
    updateAddress(address: CustomerAddress): void;
    setDefaultAddress(addressId: string): void;
    deleteAddress(addressId: string): void;
    listAllCustomers(): Promise<Customer[]>;
}

// ===== MOCK IMPLEMENTATION =====
export class MockCustomerRepository implements ICustomerRepository {
    getCurrentCustomer(): Customer {
        const stored = storage.load<Customer | null>(STORAGE_KEYS.CUSTOMER, null);
        if (stored) return stored;

        // Cria customer guest na primeira execução
        const guest = createDefaultCustomer();
        storage.save(STORAGE_KEYS.CUSTOMER, guest);
        return guest;
    }

    saveCustomer(customer: Customer): void {
        storage.save(STORAGE_KEYS.CUSTOMER, customer);
    }

    addAddress(addressData: Omit<CustomerAddress, 'id' | 'customerId'>): CustomerAddress {
        const customer = this.getCurrentCustomer();

        const newAddress: CustomerAddress = {
            ...addressData,
            id: generateUUID(),
            customerId: customer.id,
            isDefault: customer.addresses.length === 0 ? true : addressData.isDefault
        };

        // Se esta é default, remove default das outras
        let addresses = customer.addresses;
        if (newAddress.isDefault) {
            addresses = addresses.map(a => ({ ...a, isDefault: false }));
        }

        addresses.push(newAddress);

        this.saveCustomer({ ...customer, addresses });
        return newAddress;
    }

    updateAddress(address: CustomerAddress): void {
        const customer = this.getCurrentCustomer();
        const addresses = customer.addresses.map(a =>
            a.id === address.id ? address : a
        );
        this.saveCustomer({ ...customer, addresses });
    }

    setDefaultAddress(addressId: string): void {
        const customer = this.getCurrentCustomer();
        const addresses = customer.addresses.map(a => ({
            ...a,
            isDefault: a.id === addressId
        }));
        this.saveCustomer({ ...customer, addresses });
    }

    deleteAddress(addressId: string): void {
        const customer = this.getCurrentCustomer();
        const addresses = customer.addresses.filter(a => a.id !== addressId);

        // Se deletou o default e ainda há endereços, torna o primeiro default
        if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
            addresses[0].isDefault = true;
        }

        this.saveCustomer({ ...customer, addresses });
    }

    async listAllCustomers(): Promise<Customer[]> {
        // Combina clientes mock com o customer atual
        const currentCustomer = this.getCurrentCustomer();
        const allCustomers = [...mockCustomers];

        // Adiciona customer atual se não está na lista mock
        if (!allCustomers.find(c => c.id === currentCustomer.id)) {
            allCustomers.push(currentCustomer);
        }

        return allCustomers;
    }
}

// Singleton
let customerRepository: ICustomerRepository | null = null;

export function getCustomerRepository(): ICustomerRepository {
    if (!customerRepository) {
        customerRepository = new MockCustomerRepository();
    }
    return customerRepository;
}
