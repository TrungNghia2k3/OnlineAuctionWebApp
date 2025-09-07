import { publicApiClient, authApiClient } from '@/config/axios';

const expert = {
  /**
   * Get all experts
   */
  getAll: async () => {
    try {
      const response = await publicApiClient.get('/experts');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get experts');
    }
  },

  /**
   * Get all active experts
   */
  getAllActive: async () => {
    try {
      const response = await publicApiClient.get('/experts/active');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get active experts');
    }
  },

  /**
   * Get expert by ID
   */
  getById: async (id) => {
    try {
      const response = await publicApiClient.get(`/experts/${id}`);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to get expert with ID: ${id}`);
    }
  },

  /**
   * Get experts by expertise/category
   */
  getByExpertise: async (expertise) => {
    try {
      const response = await publicApiClient.get(`/experts/expertise/${encodeURIComponent(expertise)}`);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to get experts for expertise: ${expertise}`);
    }
  },

  /**
   * Create new expert (requires authentication)
   */
  create: async (data) => {
    try {
      const response = await authApiClient.post('/experts', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create expert');
    }
  },

  /**
   * Update existing expert (requires authentication)
   */
  update: async (id, data) => {
    try {
      const response = await authApiClient.put(`/experts/${id}`, data);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to update expert with ID: ${id}`);
    }
  },

  /**
   * Delete expert (requires authentication)
   */
  delete: async (id) => {
    try {
      const response = await authApiClient.delete(`/experts/${id}`);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to delete expert with ID: ${id}`);
    }
  },

  /**
   * Search experts by name or expertise
   */
  search: async (query) => {
    try {
      const response = await publicApiClient.get(`/experts/search?q=${encodeURIComponent(query)}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to search experts');
    }
  }
};

export default expert;
