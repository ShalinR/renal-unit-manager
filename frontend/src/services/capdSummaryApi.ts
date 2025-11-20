const API_BASE_URL = 'http://localhost:8081/api/capd-summary';

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
        errorMessage = errorData.message || errorData.error || errorMessage;
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

// CAPD Summary API functions
export const capdSummaryApi = {
  async getByPatientId(patientId: string): Promise<any> {
    return handleApiRequest<any>(`${API_BASE_URL}/${patientId}`);
  },

  async save(
    patientId: string,
    data: {
      counsellingDate?: string;
      catheterInsertionDate?: string;
      insertionDoneBy?: string;
      insertionPlace?: string;
      technique?: string;
      designation?: string;
      firstFlushing?: string;
      secondFlushing?: string;
      thirdFlushing?: string;
      initiationDate?: string;
      petResults?: any;
      adequacyResults?: any;
    }
  ): Promise<any> {
    return handleApiRequest<any>(`${API_BASE_URL}/${patientId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default capdSummaryApi;

