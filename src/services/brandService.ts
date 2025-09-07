import brandApi from '@/api/brand';
import { Brand, CreateBrandData, UpdateBrandData } from '@/models/Brand';

/**
 * Brand Service
 * Handles brand-related operations with API integration
 */
class BrandService {
  /**
   * Get all brands
   */
  async getAllBrands(): Promise<Brand[]> {
    try {
      const brands = await brandApi.getAll();
      return Array.isArray(brands) ? brands : [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  /**
   * Get all active brands
   */
  async getAllActiveBrands(): Promise<Brand[]> {
    try {
      const brands = await brandApi.getAllActive();
      return Array.isArray(brands) ? brands : [];
    } catch (error) {
      console.error('Error fetching active brands:', error);
      throw error;
    }
  }

  /**
   * Get brand by ID
   */
  async getBrandById(id: number): Promise<Brand | null> {
    try {
      const brand = await brandApi.getById(id);
      return brand || null;
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new brand
   */
  async createBrand(data: CreateBrandData): Promise<Brand> {
    try {
      const newBrand = await brandApi.create(data);
      return newBrand;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }

  /**
   * Update existing brand
   */
  async updateBrand(id: number, data: UpdateBrandData): Promise<Brand> {
    try {
      const updatedBrand = await brandApi.update(id, data);
      return updatedBrand;
    } catch (error) {
      console.error(`Error updating brand with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete brand
   */
  async deleteBrand(id: number): Promise<boolean> {
    try {
      await brandApi.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting brand with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search brands by name
   */
  async searchBrands(query: string): Promise<Brand[]> {
    try {
      const brands = await brandApi.search(query);
      return Array.isArray(brands) ? brands : [];
    } catch (error) {
      console.error('Error searching brands:', error);
      throw error;
    }
  }

  /**
   * Check if brand exists by name
   */
  async brandExists(name: string): Promise<boolean> {
    try {
      const brands = await this.searchBrands(name);
      return brands.some(brand => brand.name.toLowerCase() === name.toLowerCase());
    } catch (error) {
      console.error('Error checking brand existence:', error);
      return false;
    }
  }

  /**
   * Get brand statistics
   */
  async getBrandStats(): Promise<{ totalBrands: number; activeBrands: number; totalItems: number }> {
    try {
      const allBrands = await this.getAllBrands();
      const activeBrands = allBrands.filter(brand => brand.active);
      const totalItems = allBrands.reduce((sum, brand) => sum + brand.itemCount, 0);
      
      return {
        totalBrands: allBrands.length,
        activeBrands: activeBrands.length,
        totalItems
      };
    } catch (error) {
      console.error('Error calculating brand statistics:', error);
      return { totalBrands: 0, activeBrands: 0, totalItems: 0 };
    }
  }

  /**
   * Format created date from array format to readable string
   */
  formatCreatedDate(createdDate: number[]): string {
    if (!createdDate || createdDate.length < 6) return '';
    
    const [year, month, day, hour, minute, second] = createdDate;
    const date = new Date(year, month - 1, day, hour, minute, second);
    return date.toLocaleString();
  }
}

// Export singleton instance
const brandService = new BrandService();
export default brandService;
