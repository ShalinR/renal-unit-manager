const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
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
    // Handle network errors (connection refused, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please make sure the backend server is running on port 8081.');
    }
    throw error;
  }
};

export const followupApi = {
  async create(patientPhn: string, data: any) {
    return handle(`${API_BASE}/followup/${patientPhn}`, { method: 'POST', body: JSON.stringify(data) });
  },
  async list(patientPhn: string) {
    return handle(`${API_BASE}/followup/${patientPhn}`);
  },
  async remove(id: number) {
    return handle(`${API_BASE}/followup/${id}`, { method: 'DELETE' });
  }
};

export default followupApi;
