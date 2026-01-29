import { AdminUser, DashboardStats } from '@/types';
import { IAdminRepository } from '../interfaces/admin.repository';
import { mockOrders } from '@/data/mock-data';

// ========================
// MOCK ADMIN REPOSITORY
// Replace with Supabase implementation later
// ========================

const mockAdmins: AdminUser[] = [
    {
        id: 'admin-001',
        name: 'Administrador',
        email: 'admin@ifome.com',
        role: 'admin'
    },
    {
        id: 'admin-002',
        name: 'Gerente',
        email: 'gerente@ifome.com',
        role: 'manager'
    }
];

export class MockAdminRepository implements IAdminRepository {
    private admins: AdminUser[] = [...mockAdmins];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAdminById(id: string): Promise<AdminUser | null> {
        await this.delay(50);
        return this.admins.find(a => a.id === id) || null;
    }

    async getAdminByEmail(email: string): Promise<AdminUser | null> {
        await this.delay(50);
        return this.admins.find(a => a.email === email) || null;
    }

    async getAllAdmins(): Promise<AdminUser[]> {
        await this.delay(100);
        return [...this.admins];
    }

    async getDashboardStats(): Promise<DashboardStats> {
        await this.delay(100);

        // Get orders from localStorage or mock data
        let orders = mockOrders;
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('ifome_orders');
            if (stored) {
                orders = JSON.parse(stored);
            }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);

        return {
            ordersToday: todayOrders.length,
            revenueToday: todayOrders
                .filter(o => o.status !== 'canceled')
                .reduce((sum, o) => sum + o.total, 0),
            pendingOrders: todayOrders.filter(o => o.status === 'pending' || o.status === 'received').length,
            preparingOrders: todayOrders.filter(o => o.status === 'preparing').length,
            deliveredOrders: todayOrders.filter(o => o.status === 'delivered').length,
            canceledOrders: todayOrders.filter(o => o.status === 'canceled').length
        };
    }
}
