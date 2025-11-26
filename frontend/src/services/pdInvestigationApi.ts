const API_BASE_URL = 'http://localhost:8081/api/pd-investigation';

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
    console.error('API request failed');

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown API error occurred');
  }
};

// PD Investigation API functions
export const pdInvestigationApi = {
  async getSummariesByPatientId(patientId: string): Promise<any[]> {
    return handleApiRequest<any[]>(`${API_BASE_URL}/${patientId}`);
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
    return handleApiRequest<any>(`${API_BASE_URL}/${patientId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteSummary(id: number): Promise<void> {
    return handleApiRequest<void>(`${API_BASE_URL}/record/${id}`, {
      method: 'DELETE',
    });
  },
};

export default pdInvestigationApi;

