import { publicApiClient, authApiClient } from '@/config/axios';

const brand = {
  /**
   * Get all brands
   */
  getAll: async () => {
    try {
      const response = await publicApiClient.get('/brands');
      console.log("Brand API Response: ", response.data.response);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get brands');
    }
  },

  /**
   * Get all active brands
   */
  getAllActive: async () => {
    try {
      const response = await publicApiClient.get('/brands/active');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get active brands');
    }
  },

  /**
   * Get brand by ID
   */
  getById: async (id) => {
    try {
      const response = await publicApiClient.get(`/brands/${id}`);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to get brand with ID: ${id}`);
    }
  },

  /**
   * Create new brand (requires authentication)
   */
  create: async (data) => {
    try {
      const response = await authApiClient.post('/brands', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create brand');
    }
  },

  /**
   * Update existing brand (requires authentication)
   */
  update: async (id, data) => {
    try {
      const response = await authApiClient.put(`/brands/${id}`, data);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to update brand with ID: ${id}`);
    }
  },

  /**
   * Delete brand (requires authentication)
   */
  delete: async (id) => {
    try {
      const response = await authApiClient.delete(`/brands/${id}`);
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to delete brand with ID: ${id}`);
    }
  },

  /**
   * Search brands by name
   */
  search: async (query) => {
    try {
      const response = await publicApiClient.get(`/brands/search?q=${encodeURIComponent(query)}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to search brands');
    }
  }
};

export default brand;
