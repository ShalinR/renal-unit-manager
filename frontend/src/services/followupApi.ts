const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handle = async <T>(url: string, opts: RequestInit = {}): Promise<T> => {
  const res = await fetch(url, { headers: { ...getHeaders(), ...opts.headers }, ...opts });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
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
