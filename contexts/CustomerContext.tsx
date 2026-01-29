'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Customer, CustomerAddress, generateUUID } from '@/types';
import { getCustomerRepository } from '@/repositories';

interface CustomerContextType {
    customer: Customer;
    isLoaded: boolean;
    updateCustomerInfo: (name: string, phone: string, email?: string) => void;
    addAddress: (address: Omit<CustomerAddress, 'id' | 'customerId'>) => CustomerAddress;
    setDefaultAddress: (addressId: string) => void;
    deleteAddress: (addressId: string) => void;
    getDefaultAddress: () => CustomerAddress | null;
    refreshCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer>({
        id: '',
        name: '',
        phone: '',
        addresses: [],
        createdAt: ''
    });
    const [isLoaded, setIsLoaded] = useState(false);

    const refreshCustomer = useCallback(() => {
        const repo = getCustomerRepository();
        setCustomer(repo.getCurrentCustomer());
    }, []);

    useEffect(() => {
        refreshCustomer();
        setIsLoaded(true);
    }, [refreshCustomer]);

    const updateCustomerInfo = useCallback((name: string, phone: string, email?: string) => {
        const repo = getCustomerRepository();
        const current = repo.getCurrentCustomer();
        const updated: Customer = {
            ...current,
            name,
            phone,
            email
        };
        repo.saveCustomer(updated);
        setCustomer(updated);
    }, []);

    const addAddress = useCallback((addressData: Omit<CustomerAddress, 'id' | 'customerId'>): CustomerAddress => {
        const repo = getCustomerRepository();
        const newAddress = repo.addAddress(addressData);
        refreshCustomer();
        return newAddress;
    }, [refreshCustomer]);

    const setDefaultAddress = useCallback((addressId: string) => {
        const repo = getCustomerRepository();
        repo.setDefaultAddress(addressId);
        refreshCustomer();
    }, [refreshCustomer]);

    const deleteAddress = useCallback((addressId: string) => {
        const repo = getCustomerRepository();
        repo.deleteAddress(addressId);
        refreshCustomer();
    }, [refreshCustomer]);

    const getDefaultAddress = useCallback((): CustomerAddress | null => {
        return customer.addresses.find(a => a.isDefault) || customer.addresses[0] || null;
    }, [customer.addresses]);

    return (
        <CustomerContext.Provider value={{
            customer,
            isLoaded,
            updateCustomerInfo,
            addAddress,
            setDefaultAddress,
            deleteAddress,
            getDefaultAddress,
            refreshCustomer
        }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomer(): CustomerContextType {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
}
