const API_BASE_URL = 'http://localhost:8081/api/hemodialysis';

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
      credentials: 'include',
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

// Hemodialysis API functions
export const createHemodialysisRecord = async (
  patientId: string,
  record: any
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(record),
  });
};

export const getHemodialysisRecordsByPatientId = async (
  patientId: string
): Promise<any[]> => {
  return handleApiRequest<any[]>(`${API_BASE_URL}/${patientId}`);
};

export const getHemodialysisRecordById = async (id: number): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/record/${id}`);
};

export const updateHemodialysisRecord = async (
  id: number,
  record: any
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/record/${id}`, {
    method: 'PUT',
    body: JSON.stringify(record),
  });
};

export const deleteHemodialysisRecord = async (id: number): Promise<void> => {
  return handleApiRequest<void>(`${API_BASE_URL}/record/${id}`, {
    method: 'DELETE',
  });
};

