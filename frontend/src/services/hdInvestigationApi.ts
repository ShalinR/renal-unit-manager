const API_BASE_URL = 'http://localhost:8081/api/hemodialysis-investigation';

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Generic API request handler
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

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204 || options.method === 'DELETE') {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    console.log('Request URL:', url);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown API error occurred');
  }
};

// Hemodialysis Investigation API functions (Summary structure like PD)
export const hdInvestigationApi = {
  async getSummariesByPatientId(patientId: string): Promise<any[]> {
    // For now, we'll need to create a summary endpoint in the backend
    // This is a placeholder that will need backend support
    return handleApiRequest<any[]>(`${API_BASE_URL}/summary/${patientId}`);
  },

  async createSummary(
    patientId: string,
    data: {
      patientId: string;
      patientName: string;
      dates: string[];
      values: Record<string, Record<string, string>>;
      filledBy?: string;
      doctorsNote?: string;
    }
  ): Promise<any> {
    return handleApiRequest<any>(`${API_BASE_URL}/summary/${patientId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteSummary(id: number): Promise<void> {
    return handleApiRequest<void>(`${API_BASE_URL}/summary/record/${id}`, {
      method: 'DELETE',
    });
  },
};

// Legacy functions for backward compatibility
export const getHemodialysisInvestigations = async (
  patientId: string
): Promise<any[]> => {
  return handleApiRequest<any[]>(`${API_BASE_URL}/${patientId}`);
};

export const getHemodialysisInvestigationById = async (
  patientId: string,
  id: number
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${patientId}/${id}`);
};

export const createHemodialysisInvestigation = async (
  patientId: string,
  investigation: any
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(investigation),
  });
};

export const updateHemodialysisInvestigation = async (
  patientId: string,
  id: number,
  investigation: any
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${patientId}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(investigation),
  });
};

export const deleteHemodialysisInvestigation = async (
  patientId: string,
  id: number
): Promise<void> => {
  return handleApiRequest<void>(`${API_BASE_URL}/${patientId}/${id}`, {
    method: 'DELETE',
  });
};

export default hdInvestigationApi;
