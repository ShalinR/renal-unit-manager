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

export interface PatientAuditLog {
  id: number;
  username: string;
  userRole: string;
  action: string;
  patientPhn: string;
  timestamp: string;
  description: string;
}

export interface AuditStats {
  totalLogs: number;
  creates: number;
  views: number;
  updates: number;
  deletes: number;
}

export const hipaaAuditApi = {
  getAll: () => handle<PatientAuditLog[]>(`${API_BASE}/hipaa-audit/all`),
  
  getByPatient: (phn: string) => handle<PatientAuditLog[]>(`${API_BASE}/hipaa-audit/patient/${phn}`),
  
  getMyLogs: () => handle<PatientAuditLog[]>(`${API_BASE}/hipaa-audit/my-logs`),
  
  getStats: () => handle<AuditStats>(`${API_BASE}/hipaa-audit/stats`),
};

