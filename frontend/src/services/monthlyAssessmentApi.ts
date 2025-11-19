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
  const res = await fetch(url, { headers: { ...getHeaders(), ...opts.headers }, ...opts });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch (e) {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
};

export const monthlyAssessmentApi = {
  async list(patientPhn: string) {
    return handle<any[]>(`${API_BASE}/monthly-assessment/${patientPhn}`);
  },
  async create(patientPhn: string, dto: any) {
    return handle(`${API_BASE}/monthly-assessment/${patientPhn}`, { method: 'POST', body: JSON.stringify(dto) });
  },
  async update(patientPhn: string, id: number, dto: any) {
    return handle(`${API_BASE}/monthly-assessment/${patientPhn}/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
  },
  async remove(patientPhn: string, id: number) {
    return handle(`${API_BASE}/monthly-assessment/${patientPhn}/${id}`, { method: 'DELETE' });
  }
};

export default monthlyAssessmentApi;
