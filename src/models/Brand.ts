/**
 * Brand Model
 * Represents a brand entity in the auction system
 */
export interface Brand {
  id: number;
  name: string;
  imagePath: string;
  description: string;
  active: boolean;
  createdDate: number[]; // Array format: [year, month, day, hour, minute, second, nanosecond]
  itemCount: number;
}

/**
 * Data structure for creating a new brand
 */
export interface CreateBrandData {
  name: string;
  imagePath: string;
  description: string;
  active?: boolean;
}

/**
 * Data structure for updating an existing brand
 */
export interface UpdateBrandData {
  name?: string;
  imagePath?: string;
  description?: string;
  active?: boolean;
}

/**
 * Brand API response structure
 */
export interface BrandApiResponse {
  code: number;
  result: Brand;
}

/**
 * Brands list API response structure
 */
export interface BrandsListApiResponse {
  code: number;
  result: Brand[];
}

/**
 * Brand form data for file uploads
 */
export interface BrandFormData {
  name: string;
  description: string;
  active: boolean;
  image?: File; // For file upload
}

/**
 * Brand search parameters
 */
export interface BrandSearchParams {
  query?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

/**
 * Brand statistics
 */
export interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  totalItems: number;
}

export default Brand;
