const API_BASE_URL = 'http://localhost:8081/api/hemodialysis-monthly-review';

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
    throw error;
  }
};

export const hdMonthlyReviewApi = {
  list: async (patientPhn: string): Promise<any[]> => {
    return handleApiRequest<any[]>(`${API_BASE_URL}/${patientPhn}`);
  },

  get: async (patientPhn: string, id: number): Promise<any> => {
    return handleApiRequest<any>(`${API_BASE_URL}/${patientPhn}/${id}`);
  },

  create: async (patientPhn: string, dto: any): Promise<any> => {
    return handleApiRequest<any>(`${API_BASE_URL}/${patientPhn}`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  update: async (patientPhn: string, id: number, dto: any): Promise<any> => {
    return handleApiRequest<any>(`${API_BASE_URL}/${patientPhn}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  remove: async (patientPhn: string, id: number): Promise<void> => {
    return handleApiRequest<void>(`${API_BASE_URL}/${patientPhn}/${id}`, {
      method: 'DELETE',
    });
  },
};
