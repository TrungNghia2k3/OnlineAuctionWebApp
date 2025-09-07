import expertApi from '@/api/expert';
import { Expert, CreateExpertData, UpdateExpertData, ExpertiseArea, ExpertCategoryInfo } from '@/models/Expert';

/**
 * Expert Service
 * Handles expert-related operations with API integration
 */
class ExpertService {
  /**
   * Get all experts
   */
  async getAllExperts(): Promise<Expert[]> {
    try {
      const experts = await expertApi.getAll();
      return Array.isArray(experts) ? experts : [];
    } catch (error) {
      console.error('Error fetching experts:', error);
      throw error;
    }
  }

  /**
   * Get all active experts
   */
  async getAllActiveExperts(): Promise<Expert[]> {
    try {
      const experts = await expertApi.getAllActive();
      return Array.isArray(experts) ? experts : [];
    } catch (error) {
      console.error('Error fetching active experts:', error);
      throw error;
    }
  }

  /**
   * Get expert by ID
   */
  async getExpertById(id: number): Promise<Expert | null> {
    try {
      const expert = await expertApi.getById(id);
      return expert || null;
    } catch (error) {
      console.error(`Error fetching expert with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get experts by expertise/category
   */
  async getExpertsByExpertise(expertise: string): Promise<Expert[]> {
    try {
      const experts = await expertApi.getByExpertise(expertise);
      return Array.isArray(experts) ? experts : [];
    } catch (error) {
      console.error(`Error fetching experts for expertise ${expertise}:`, error);
      throw error;
    }
  }

  /**
   * Get experts by category name
   */
  async getExpertsByCategoryName(categoryName: string): Promise<Expert[]> {
    try {
      const allExperts = await this.getAllActiveExperts();
      return allExperts.filter(expert => 
        expert.categoryName.toLowerCase() === categoryName.toLowerCase()
      );
    } catch (error) {
      console.error(`Error fetching experts for category ${categoryName}:`, error);
      throw error;
    }
  }

  /**
   * Get experts by subcategory ID
   */
  async getExpertsBySubCategoryId(subCategoryId: number): Promise<Expert[]> {
    try {
      const allExperts = await this.getAllActiveExperts();
      return allExperts.filter(expert => expert.subCategoryId === subCategoryId);
    } catch (error) {
      console.error(`Error fetching experts for subcategory ${subCategoryId}:`, error);
      throw error;
    }
  }

  /**
   * Create new expert
   */
  async createExpert(data: CreateExpertData): Promise<Expert> {
    try {
      const newExpert = await expertApi.create(data);
      return newExpert;
    } catch (error) {
      console.error('Error creating expert:', error);
      throw error;
    }
  }

  /**
   * Update existing expert
   */
  async updateExpert(id: number, data: UpdateExpertData): Promise<Expert> {
    try {
      const updatedExpert = await expertApi.update(id, data);
      return updatedExpert;
    } catch (error) {
      console.error(`Error updating expert with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete expert
   */
  async deleteExpert(id: number): Promise<boolean> {
    try {
      await expertApi.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting expert with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search experts by name or expertise
   */
  async searchExperts(query: string): Promise<Expert[]> {
    try {
      const experts = await expertApi.search(query);
      return Array.isArray(experts) ? experts : [];
    } catch (error) {
      console.error('Error searching experts:', error);
      throw error;
    }
  }

  /**
   * Get unique expertise areas with counts
   */
  async getExpertiseAreas(): Promise<ExpertiseArea[]> {
    try {
      const experts = await this.getAllActiveExperts();
      const expertiseMap = new Map<string, { count: number; categoryName: string }>();
      
      experts.forEach(expert => {
        const existing = expertiseMap.get(expert.expertise);
        if (existing) {
          existing.count++;
        } else {
          expertiseMap.set(expert.expertise, {
            count: 1,
            categoryName: expert.categoryName
          });
        }
      });

      return Array.from(expertiseMap.entries())
        .map(([name, data]) => ({
          name,
          count: data.count,
          categoryName: data.categoryName
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching expertise areas:', error);
      return [];
    }
  }

  /**
   * Get unique category names
   */
  async getCategoryNames(): Promise<string[]> {
    try {
      const experts = await this.getAllActiveExperts();
      const categorySet = new Set(experts.map(expert => expert.categoryName));
      return Array.from(categorySet).sort();
    } catch (error) {
      console.error('Error fetching category names:', error);
      return [];
    }
  }

  /**
   * Get expert category information
   */
  async getExpertCategoryInfo(expertId: number): Promise<ExpertCategoryInfo | null> {
    try {
      const expert = await this.getExpertById(expertId);
      if (!expert) return null;
      
      return {
        subCategoryId: expert.subCategoryId,
        subCategoryName: expert.subCategoryName,
        categoryName: expert.categoryName
      };
    } catch (error) {
      console.error('Error fetching expert category info:', error);
      return null;
    }
  }

  /**
   * Check if expert exists by name
   */
  async expertExists(name: string): Promise<boolean> {
    try {
      const experts = await this.searchExperts(name);
      return experts.some(expert => expert.name.toLowerCase() === name.toLowerCase());
    } catch (error) {
      console.error('Error checking expert existence:', error);
      return false;
    }
  }

  /**
   * Get expert statistics
   */
  async getExpertStats(): Promise<{ totalExperts: number; activeExperts: number; expertiseAreas: ExpertiseArea[] }> {
    try {
      const [allExperts, expertiseAreas] = await Promise.all([
        this.getAllExperts(),
        this.getExpertiseAreas()
      ]);
      
      const activeExperts = allExperts.filter(expert => expert.active);
      
      return {
        totalExperts: allExperts.length,
        activeExperts: activeExperts.length,
        expertiseAreas
      };
    } catch (error) {
      console.error('Error calculating expert statistics:', error);
      return { totalExperts: 0, activeExperts: 0, expertiseAreas: [] };
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
const expertService = new ExpertService();
export default expertService;
