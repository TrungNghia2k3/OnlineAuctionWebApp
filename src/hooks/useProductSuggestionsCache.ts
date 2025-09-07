import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import productSuggestionApi from '@/api/productSuggestion';
import { QUERY_KEYS } from '@/config/reactQuery';

/**
 * Hook for fetching and caching user's personalized suggestions
 */
export const useUserSuggestions = (limit: number = 10) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id?.toString() || currentUser?.username;

  return useQuery({
    queryKey: QUERY_KEYS.USER_SUGGESTIONS(userId || 'anonymous'),
    queryFn: () => productSuggestionApi.getUserSuggestions(userId || 'anonymous', limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching similar products with caching
 */
export const useSimilarProducts = (productId: string | number, limit: number = 5) => {
  return useQuery({
    queryKey: QUERY_KEYS.SIMILAR_PRODUCTS(productId),
    queryFn: () => productSuggestionApi.getSimilarProducts(productId, limit),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes for similar products
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook for fetching trending products
 */
export const useTrendingProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRENDING_PRODUCTS,
    queryFn: () => productSuggestionApi.getTrendingProducts(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes for trending (more dynamic)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for fetching category-based suggestions
 */
export const useCategorySuggestions = (category: string, limit: number = 8) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id?.toString() || currentUser?.username;

  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY_SUGGESTIONS(category),
    queryFn: () => productSuggestionApi.getCategorySuggestions(category, userId || '', limit),
    enabled: !!category,
    staleTime: 8 * 60 * 1000, // 8 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  });
};

/**
 * Hook for fetching user's view history with caching
 */
export const useUserViewHistory = (limit: number = 50) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id?.toString() || currentUser?.username;

  return useQuery({
    queryKey: QUERY_KEYS.USER_VIEWED_PRODUCTS(userId || 'anonymous'),
    queryFn: () => productSuggestionApi.getUserViewHistory(userId || 'anonymous', limit),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

/**
 * Mutation hook for sending viewed products to server
 */
export const useSendViewedProducts = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  return useMutation({
    mutationFn: (data: any) => productSuggestionApi.sendViewedProducts(data),
    onSuccess: () => {
      // Invalidate related queries to refresh suggestions
      const userId = currentUser?.id?.toString() || currentUser?.username;
      if (userId) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.USER_SUGGESTIONS(userId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.USER_VIEWED_PRODUCTS(userId) 
        });
      }
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to prefetch suggestions when user might need them
 */
export const usePrefetchSuggestions = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const prefetchUserSuggestions = (userId?: string) => {
    const targetUserId = userId || currentUser?.id?.toString() || currentUser?.username;
    if (targetUserId) {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.USER_SUGGESTIONS(targetUserId),
        queryFn: () => productSuggestionApi.getUserSuggestions(targetUserId, 10),
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const prefetchSimilarProducts = (productId: string | number) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.SIMILAR_PRODUCTS(productId),
      queryFn: () => productSuggestionApi.getSimilarProducts(productId, 5),
      staleTime: 10 * 60 * 1000,
    });
  };

  const prefetchCategorySuggestions = (category: string) => {
    const userId = currentUser?.id?.toString() || currentUser?.username;
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.CATEGORY_SUGGESTIONS(category),
      queryFn: () => productSuggestionApi.getCategorySuggestions(category, userId || '', 8),
      staleTime: 8 * 60 * 1000,
    });
  };

  return {
    prefetchUserSuggestions,
    prefetchSimilarProducts,
    prefetchCategorySuggestions,
  };
};

/**
 * Combined hook that provides cached suggestions with fallbacks
 */
export const useProductSuggestionsWithCache = (productId?: string | number) => {
  // Get all types of suggestions
  const userSuggestions = useUserSuggestions(8);
  const similarProducts = useSimilarProducts(productId || '', 6);
  const trendingProducts = useTrendingProducts(8);

  // Combine and prioritize suggestions
  const combinedSuggestions = [
    // Prioritize similar products if viewing a specific product
    ...(similarProducts.data || []).slice(0, 3),
    // Add personalized suggestions - handle both formats (JS API returns direct array vs object with suggestions)
    ...(Array.isArray(userSuggestions.data) ? userSuggestions.data : ((userSuggestions.data as any)?.suggestions || [])).slice(0, 4),
    // Fill with trending if needed
    ...(Array.isArray(trendingProducts.data) ? trendingProducts.data : []).slice(0, 3),
  ];

  // Remove duplicates
  const uniqueSuggestions = combinedSuggestions.filter((suggestion, index, self) => 
    index === self.findIndex(s => s.id === suggestion.id)
  );

  return {
    suggestions: uniqueSuggestions.slice(0, 10), // Limit to 10 total
    isLoading: userSuggestions.isLoading || similarProducts.isLoading || trendingProducts.isLoading,
    error: userSuggestions.error || similarProducts.error || trendingProducts.error,
    refetch: () => {
      userSuggestions.refetch();
      similarProducts.refetch();
      trendingProducts.refetch();
    },
    // Individual query states for debugging
    userSuggestionsState: {
      data: userSuggestions.data,
      isLoading: userSuggestions.isLoading,
      error: userSuggestions.error,
    },
    similarProductsState: {
      data: similarProducts.data,
      isLoading: similarProducts.isLoading,
      error: similarProducts.error,
    },
    trendingProductsState: {
      data: trendingProducts.data,
      isLoading: trendingProducts.isLoading,
      error: trendingProducts.error,
    },
  };
};
