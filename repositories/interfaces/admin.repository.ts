import { AdminUser, DashboardStats } from '@/types';

// ========================
// ADMIN REPOSITORY INTERFACE
// Prepared for Supabase integration
// ========================
export interface IAdminRepository {
    // Admin users (for future auth)
    getAdminById(id: string): Promise<AdminUser | null>;
    getAdminByEmail(email: string): Promise<AdminUser | null>;
    getAllAdmins(): Promise<AdminUser[]>;

    // Dashboard
    getDashboardStats(): Promise<DashboardStats>;
}
