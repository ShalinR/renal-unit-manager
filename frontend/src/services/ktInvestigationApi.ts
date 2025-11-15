const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/transplant';

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

export const ktInvestigationApi = {
  async create(patientPhn: string, payload: any) {
    return handle(`${API_BASE}/kt-investigation/${patientPhn}`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async list(patientPhn: string) {
    return handle(`${API_BASE}/kt-investigation/${patientPhn}`);
  },
  async getById(id: number) {
    return handle(`${API_BASE}/kt-investigation/id/${id}`);
  }
};

export default ktInvestigationApi;
