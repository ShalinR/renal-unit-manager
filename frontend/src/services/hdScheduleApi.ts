const API_BASE_URL = 'http://localhost:8081/api/hd-schedule';

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return headers;
};

const handleApiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as unknown as T;
  return (await response.json()) as T;
};

export const getAppointmentsByDate = async (date: string) => {
  return handleApiRequest<any[]>(`${API_BASE_URL}/day?date=${encodeURIComponent(date)}`);
};

export const bookAppointment = async (payload: { phn: string; patientName: string; date: string; slotId: string; notes?: string }) => {
  const res = await handleApiRequest<any>(`${API_BASE_URL}/book`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  // notify listeners that schedule changed
  try {
    window.dispatchEvent(new CustomEvent('hd-schedule-updated', { detail: { action: 'book', payload: res } }));
  } catch (e) {
    // ignore
  }
  return res;
};

export const cancelAppointment = async (id: number) => {
  const res = await handleApiRequest<void>(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  try {
    window.dispatchEvent(new CustomEvent('hd-schedule-updated', { detail: { action: 'cancel', id } }));
  } catch (e) {
    // ignore
  }
  return res;
};

export default { getAppointmentsByDate, bookAppointment, cancelAppointment };
