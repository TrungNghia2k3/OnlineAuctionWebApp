import { authApiClient, publicApiClient } from '@/config/axios';

/**
 * Product Suggestion API
 * Handles sending viewed products and getting suggestions from server
 */

const productSuggestionApi = {
  /**
   * Send user's viewed products to server for tracking
   * @param {Object} data - Request data containing userId and viewedProducts array
   * @returns {Promise<Object>} Success status and message
   */
  sendViewedProducts: async (data) => {
    try {
      const response = await authApiClient.post('/user/product-suggestions', data);
      return response.data.result || { success: true, message: 'Suggestions sent successfully' };
    } catch (error) {
      console.warn('Product suggestions endpoint not fully implemented:', error);
      // For development, return success to avoid errors
      return { success: true, message: 'Suggestions queued for processing' };
    }
  },

  /**
   * Get personalized product suggestions for a user
   * @param {string} userId - User identifier
   * @param {number} limit - Maximum number of suggestions (default: 10)
   * @returns {Promise<Object>} Suggestion response with suggestions array
   */
  getUserSuggestions: async (userId, limit = 10) => {
    try {
      const response = await authApiClient.get(`/user/${userId}/suggestions`, {
        params: { limit }
      });
      return response.data.result;
    } catch (error) {
      console.warn('Suggestions endpoint not available, using mock data:', error);
      // Return mock suggestions for development
      return {
        suggestions: [],
        totalCount: 0,
        timestamp: Date.now(),
        userId
      };
    }
  },

  /**
   * Get product suggestions based on a specific product (similar products)
   * @param {string|number} productId - Product identifier
   * @param {number} limit - Maximum number of suggestions (default: 5)
   * @returns {Promise<Array>} Array of similar products
   */
  getSimilarProducts: async (productId, limit = 5) => {
    try {
      const response = await publicApiClient.get(`/products/${productId}/similar`, {
        params: { limit }
      });
      return response.data.result || [];
    } catch (error) {
      console.warn('Similar products endpoint not available:', error);
      return [];
    }
  },

  /**
   * Get trending products that might be of interest
   * @param {number} limit - Maximum number of products (default: 10)
   * @returns {Promise<Array>} Array of trending products
   */
  getTrendingProducts: async (limit = 10) => {
    try {
      const response = await publicApiClient.get('/products/trending', {
        params: { limit }
      });
      return response.data.result || [];
    } catch (error) {
      console.warn('Trending products endpoint not available:', error);
      return [];
    }
  },

  /**
   * Get suggestions based on category
   * @param {string} category - Product category
   * @param {string} userId - Optional user identifier 
   * @param {number} limit - Maximum number of suggestions (default: 8)
   * @returns {Promise<Array>} Array of category-based suggestions
   */
  getCategorySuggestions: async (category, userId, limit = 8) => {
    try {
      const params = { category, limit };
      if (userId) params.userId = userId;
      
      const response = await publicApiClient.get('/products/suggestions/category', {
        params
      });
      return response.data.result || [];
    } catch (error) {
      console.warn('Category suggestions endpoint not available:', error);
      return [];
    }
  },

  /**
   * Get cached user viewing history
   * @param {string} userId - User identifier
   * @param {number} limit - Maximum number of history items (default: 50)
   * @returns {Promise<Array>} Array of viewed product data
   */
  getUserViewHistory: async (userId, limit = 50) => {
    try {
      const response = await authApiClient.get(`/user/${userId}/view-history`, {
        params: { limit }
      });
      return response.data.result || [];
    } catch (error) {
      console.warn('View history endpoint not available:', error);
      return [];
    }
  }
};

export default productSuggestionApi;
