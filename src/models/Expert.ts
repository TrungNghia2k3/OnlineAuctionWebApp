/**
 * Expert Model
 * Represents an expert entity in the auction system
 */
export interface Expert {
  id: number;
  name: string;
  expertise: string;
  active: boolean;
  imagePath: string;
  subCategoryId: number;
  subCategoryName: string;
  categoryName: string;
  createdDate: number[]; // Array format: [year, month, day, hour, minute, second, nanosecond]
}

/**
 * Data structure for creating a new expert
 */
export interface CreateExpertData {
  name: string;
  expertise: string;
  active?: boolean;
  imagePath: string;
  subCategoryId: number;
}

/**
 * Data structure for updating an existing expert
 */
export interface UpdateExpertData {
  name?: string;
  expertise?: string;
  active?: boolean;
  imagePath?: string;
  subCategoryId?: number;
}

/**
 * Expert API response structure
 */
export interface ExpertApiResponse {
  code: number;
  result: Expert;
}

/**
 * Experts list API response structure
 */
export interface ExpertsListApiResponse {
  code: number;
  result: Expert[];
}

/**
 * Expert form data for file uploads
 */
export interface ExpertFormData {
  name: string;
  expertise: string;
  active: boolean;
  subCategoryId: number;
  image?: File; // For file upload
}

/**
 * Expert search parameters
 */
export interface ExpertSearchParams {
  query?: string;
  expertise?: string;
  categoryName?: string;
  subCategoryId?: number;
  active?: boolean;
  page?: number;
  size?: number;
}

/**
 * Expert expertise area
 */
export interface ExpertiseArea {
  name: string;
  count: number;
  categoryName: string;
}

/**
 * Expert statistics
 */
export interface ExpertStats {
  totalExperts: number;
  activeExperts: number;
  expertiseAreas: ExpertiseArea[];
}

/**
 * Expert category association
 */
export interface ExpertCategoryInfo {
  subCategoryId: number;
  subCategoryName: string;
  categoryName: string;
}

export default Expert;
