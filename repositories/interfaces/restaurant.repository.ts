import { Restaurant } from '@/types';

// ========================
// RESTAURANT REPOSITORY INTERFACE
// Prepared for Supabase integration
// ========================
export interface IRestaurantRepository {
    getRestaurant(): Promise<Restaurant>;
    updateRestaurant(data: Partial<Restaurant>): Promise<Restaurant>;
    toggleOpenStatus(isOpen: boolean): Promise<Restaurant>;
}
