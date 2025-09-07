import categoryApi from '@/api/category';

// Types and interfaces
export interface SubCategory {
  id?: number;
  name: string;
  image: string;
  description?: string;
  active?: boolean;
  createdDate?: any[];
}

export interface Category {
  id: string | number;
  name: string;
  icon: string;
  color: string;
  description?: string;
  image?: string;
  active?: boolean;
  sub: SubCategory[];
}

export interface ApiCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
  subCategories?: {
    id: number;
    name: string;
    imagePath: string;
    description?: string;
    active?: boolean;
    createdDate?: any[];
  }[];
}

interface IconColorConfig {
  icon: string;
  color: string;
}

type CategoryIconColorMap = Record<string, IconColorConfig>;

// Static special categories that are not from API
export const SPECIAL_CATEGORIES: Category[] = [
  { id: 'this-week', name: "This week", icon: "bi-calendar-week", color: "#007bff", sub: [] },
  { id: 'for-you', name: "For you", icon: "bi-heart", color: "#e83e8c", sub: [] },
  { id: 'trending', name: "Trending", icon: "bi-graph-up-arrow", color: "#fd7e14", sub: [] }
];

// Mapping for category icons and colors based on category names
export const CATEGORY_ICON_COLOR_MAP: CategoryIconColorMap = {
  'Art': { icon: 'bi-palette', color: '#A3CC86' },
  'Interiors': { icon: 'bi-house', color: '#CCECFF' },
  'Jewellry': { icon: 'bi-gem', color: '#AABAC7' },
  'Jewelry': { icon: 'bi-gem', color: '#AABAC7' },
  'Watches': { icon: 'bi-watch', color: '#86A7A8' },
  'Fashion': { icon: 'bi-bag', color: '#F3CDDB' },
  'Coins & Stamps': { icon: 'bi-coin', color: '#D5D3E1' },
  'Comics': { icon: 'bi-book', color: '#B0EADF' },
  'Cars & Bikes': { icon: 'bi-car-front', color: '#A2938F' },
  'Wine, Whisky & Spirits': { icon: 'bi-cup', color: '#AF6663' },
  'Asian & Tribal': { icon: 'bi-globe-asia-australia', color: '#639AC6' },
  'Trading Cards': { icon: 'bi-collection', color: '#FBB763' },
  'Toys & Models': { icon: 'bi-puzzle', color: '#20c997' },
  'Archaeology': { icon: 'bi-hourglass-split', color: '#C7A881' },
  'Sports': { icon: 'bi-trophy', color: '#F8DE7A' },
  'Music, Movie & Cameras': { icon: 'bi-camera-video', color: '#DF6957' },
  'Books & History': { icon: 'bi-journal-bookmark', color: '#A4AF8B' },
  // Default fallback
  'default': { icon: 'bi-folder', color: '#6c757d' }
};

/**
 * Maps API category data to frontend format
 */
const mapApiCategoryToFrontend = (apiCategory: ApiCategory): Category => {
  const iconColorConfig = CATEGORY_ICON_COLOR_MAP[apiCategory.name] || CATEGORY_ICON_COLOR_MAP.default;
  
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    icon: iconColorConfig.icon,
    color: iconColorConfig.color,
    description: apiCategory.description,
    image: apiCategory.image,
    active: apiCategory.active,
    sub: apiCategory.subCategories ? apiCategory.subCategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      image: sub.imagePath, // Map imagePath to image for consistency
      description: sub.description,
      active: sub.active,
      createdDate: sub.createdDate
    })) : []
  };
};

/**
 * Fetches all categories from API and combines with special categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    // Fetch categories from API
    const apiCategories: ApiCategory[] = await categoryApi.getAllCategory();
    
    // Map API categories to frontend format
    const mappedCategories = apiCategories.map(mapApiCategoryToFrontend);
    
    // Combine special categories with API categories
    const allCategories: Category[] = [
      ...SPECIAL_CATEGORIES,
      ...mappedCategories
    ];
    
    return allCategories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Return only special categories if API fails
    return SPECIAL_CATEGORIES;
  }
};

/**
 * Fetches only active categories from API and combines with special categories
 */
export const getAllActiveCategories = async (): Promise<Category[]> => {
  try {
    // Fetch active categories from API
    const apiCategories: ApiCategory[] = await categoryApi.getAllCategoryActive();
    
    // Map API categories to frontend format
    const mappedCategories = apiCategories.map(mapApiCategoryToFrontend);
    
    // Combine special categories with API categories
    const allCategories: Category[] = [
      ...SPECIAL_CATEGORIES,
      ...mappedCategories
    ];
    
    return allCategories;
  } catch (error) {
    console.error('Failed to fetch active categories:', error);
    // Return only special categories if API fails
    return SPECIAL_CATEGORIES;
  }
};

/**
 * Gets a category by ID (supports both special categories and API categories)
 */
export const getCategoryById = async (categoryId: string | number): Promise<Category | null> => {
  try {
    const allCategories = await getAllCategories();
    return allCategories.find(category => category.id === categoryId) || null;
  } catch (error) {
    console.error('Failed to get category by ID:', error);
    return null;
  }
};

/**
 * Updates the icon/color mapping for a category
 */
export const updateCategoryIconColor = (categoryName: string, icon: string, color: string): void => {
  CATEGORY_ICON_COLOR_MAP[categoryName] = { icon, color };
};

const categoryService = {
  getAllCategories,
  getAllActiveCategories,
  getCategoryById,
  updateCategoryIconColor,
  CATEGORY_ICON_COLOR_MAP,
  SPECIAL_CATEGORIES
};

export default categoryService;
