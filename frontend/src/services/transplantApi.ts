import { KTFormData } from '../types/transplant';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/transplant';

// Common headers for API requests
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request handler with proper error handling
const handleApiRequest = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Authentication failed. Please log in again.');
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // For DELETE/204 requests with no content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    console.log('Request URL:', url);
    
    // Re-throw the error for the caller to handle
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown API error occurred');
  }
};

/**
 * KT Surgery API Service
 * Handles all HTTP requests for kidney transplant surgery data
 */
export const transplantApi = {
  /**
   * Create a new KT surgery record
   */
  async createKTSurgery(patientPhn: string, ktData: KTFormData): Promise<KTFormData> {
    return await handleApiRequest<KTFormData>(`${API_BASE_URL}/kt-surgery/${patientPhn}`, {
      method: 'POST',
      body: JSON.stringify(ktData),
    });
  },

  /**
   * Get KT surgery record by patient PHN
   */
  async getKTSurgeryByPatientPhn(patientPhn: string): Promise<KTFormData | null> {
    try {
      return await handleApiRequest<KTFormData>(`${API_BASE_URL}/kt-surgery/${patientPhn}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get all KT surgeries for a patient (if multiple transplants)
   */
  async getAllKTSurgeriesByPatientPhn(patientPhn: string): Promise<KTFormData[]> {
    return await handleApiRequest<KTFormData[]>(`${API_BASE_URL}/kt-surgery/all/${patientPhn}`);
  },

  /**
   * Update an existing KT surgery record
   */
  async updateKTSurgery(patientPhn: string, ktData: KTFormData): Promise<KTFormData> {
    return await handleApiRequest<KTFormData>(`${API_BASE_URL}/kt-surgery/${patientPhn}`, {
      method: 'PUT',
      body: JSON.stringify(ktData),
    });
  },

  /**
   * Check if a KT surgery record exists for a patient
   */
  async checkKTSurgeryExists(patientPhn: string): Promise<boolean> {
    return await handleApiRequest<boolean>(`${API_BASE_URL}/kt-surgery/${patientPhn}/exists`);
  },

  /**
   * Get the latest KT surgery for a patient
   */
  async getLatestKTSurgery(patientPhn: string): Promise<KTFormData | null> {
    try {
      return await handleApiRequest<KTFormData>(`${API_BASE_URL}/kt-surgery/${patientPhn}/latest`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
};

/**
 * Custom hook for KT Surgery operations
 */
export const useTransplantApi = () => {
  const createKTSurgery = async (patientPhn: string, ktData: KTFormData) => {
    try {
      return await transplantApi.createKTSurgery(patientPhn, ktData);
    } catch (error) {
      console.error('Error creating KT surgery:', error);
      throw error;
    }
  };

  const getKTSurgery = async (patientPhn: string) => {
    try {
      return await transplantApi.getKTSurgeryByPatientPhn(patientPhn);
    } catch (error) {
      console.error('Error fetching KT surgery:', error);
      throw error;
    }
  };

  const updateKTSurgery = async (patientPhn: string, ktData: KTFormData) => {
    try {
      return await transplantApi.updateKTSurgery(patientPhn, ktData);
    } catch (error) {
      console.error('Error updating KT surgery:', error);
      throw error;
    }
  };

  const checkExists = async (patientPhn: string) => {
    try {
      return await transplantApi.checkKTSurgeryExists(patientPhn);
    } catch (error) {
      console.error('Error checking KT surgery existence:', error);
      throw error;
    }
  };

  const getLatestKTSurgery = async (patientPhn: string) => {
    try {
      return await transplantApi.getLatestKTSurgery(patientPhn);
    } catch (error) {
      console.error('Error fetching latest KT surgery:', error);
      throw error;
    }
  };

  const getAllKTSurgeries = async (patientPhn: string) => {
    try {
      return await transplantApi.getAllKTSurgeriesByPatientPhn(patientPhn);
    } catch (error) {
      console.error('Error fetching all KT surgeries:', error);
      throw error;
    }
  };

  return {
    createKTSurgery,
    getKTSurgery,
    updateKTSurgery,
    checkExists,
    getLatestKTSurgery,
    getAllKTSurgeries,
  };
};

/**
 * Utility function to handle API errors
 */
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Export individual functions for direct use
export const {
  createKTSurgery,
  getKTSurgeryByPatientPhn,
  getAllKTSurgeriesByPatientPhn,
  updateKTSurgery,
  checkKTSurgeryExists,
  getLatestKTSurgery,
} = transplantApi;

// Default export
export default transplantApi;