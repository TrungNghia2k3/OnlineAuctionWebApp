import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Configuration
 * Centralized configuration for React Query client
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time for suggested products
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh suggestions
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: 'always',
      // Network mode
      networkMode: 'online'
    },
    mutations: {
      retry: 1,
      networkMode: 'online'
    }
  }
});

// Query Keys for consistent caching
export const QUERY_KEYS = {
  // Product suggestions
  PRODUCT_SUGGESTIONS: ['product-suggestions'],
  USER_SUGGESTIONS: (userId: string) => ['product-suggestions', 'user', userId],
  CATEGORY_SUGGESTIONS: (category: string) => ['product-suggestions', 'category', category],
  SIMILAR_PRODUCTS: (productId: string | number) => ['product-suggestions', 'similar', productId],
  
  // Cached user views
  USER_VIEWED_PRODUCTS: (userId: string) => ['viewed-products', userId],
  RECENT_VIEWS: ['recent-views'],
  
  // Recommendation cache
  RECOMMENDATIONS: (userId: string) => ['recommendations', userId],
  TRENDING_PRODUCTS: ['trending-products']
} as const;
