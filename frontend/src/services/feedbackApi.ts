const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handle = async <T>(url: string, opts: RequestInit = {}): Promise<T> => {
  try {
    const res = await fetch(url, { headers: { ...getHeaders(), ...opts.headers }, ...opts });
    if (!res.ok) {
      let errorMessage = res.statusText;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || res.statusText;
      } catch (e) {
        // If response is not JSON, use status text
      }
      throw new Error(errorMessage);
    }
    if (res.status === 204) return undefined as unknown as T;
    return res.json();
  } catch (error: any) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please make sure the backend server is running on port 8081.');
    }
    throw error;
  }
};

export const feedbackApi = {
  create: (data: { submittedBy: string; submittedByName: string; role: string; message: string }) =>
    handle(`${API_BASE}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => handle<any[]>(`${API_BASE}/feedback`),

  getByStatus: (status: string) => handle<any[]>(`${API_BASE}/feedback/status/${status}`),

  updateStatus: (id: number, status: string) =>
    handle(`${API_BASE}/feedback/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};


