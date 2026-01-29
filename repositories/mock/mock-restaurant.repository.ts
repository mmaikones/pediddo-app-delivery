import { Restaurant } from '@/types';
import { IRestaurantRepository } from '../interfaces/restaurant.repository';
import { mockRestaurant } from '@/data/mock-data';

// ========================
// MOCK RESTAURANT REPOSITORY
// Replace with Supabase implementation later
// ========================
export class MockRestaurantRepository implements IRestaurantRepository {
    private restaurant: Restaurant = { ...mockRestaurant };

    async getRestaurant(): Promise<Restaurant> {
        // Simulate network delay
        await this.delay(100);
        return { ...this.restaurant };
    }

    async updateRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
        await this.delay(100);
        this.restaurant = { ...this.restaurant, ...data };
        return { ...this.restaurant };
    }

    async toggleOpenStatus(isOpen: boolean): Promise<Restaurant> {
        await this.delay(100);
        this.restaurant.isOpen = isOpen;
        return { ...this.restaurant };
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
