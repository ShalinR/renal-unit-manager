const API_BASE_URL = 'http://localhost:8081/api/hemodialysis-investigation/monthly-review';

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

// Hemodialysis Monthly Review Investigations API functions
export const getInvestigationsByMonthlyReview = async (
  monthlyReviewId: number
): Promise<any[]> => {
  return handleApiRequest<any[]>(`${API_BASE_URL}/${monthlyReviewId}`);
};

export const getInvestigationByMonthlyReview = async (
  monthlyReviewId: number,
  id: number
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${monthlyReviewId}/${id}`);
};

export const createInvestigationForMonthlyReview = async (
  monthlyReviewId: number,
  investigation: any
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${monthlyReviewId}`, {
    method: 'POST',
    body: JSON.stringify(investigation),
  });
};

export const updateInvestigationByMonthlyReview = async (
  monthlyReviewId: number,
  id: number,
  investigation: any
): Promise<any> => {
  return handleApiRequest<any>(`${API_BASE_URL}/${monthlyReviewId}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(investigation),
  });
};

export const deleteInvestigationByMonthlyReview = async (
  monthlyReviewId: number,
  id: number
): Promise<void> => {
  return handleApiRequest<void>(`${API_BASE_URL}/${monthlyReviewId}/${id}`, {
    method: 'DELETE',
  });
};
