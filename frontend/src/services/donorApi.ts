import { 
  DonorAssessmentDataDTO, 
  DonorAssessmentResponseDTO, 
  DonorAssignmentDTO,
  DonorAssessmentDTO 
} from '../types/donor';

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/donor-assessment';

console.debug('Donor API initialized');

// Common headers for API requests
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request handler
const handleApiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    // Read response body as text first to avoid json() errors on empty bodies
    const text = await response.text();

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        if (text) {
          const parsed = JSON.parse(text);
          errorMessage = parsed?.message || JSON.stringify(parsed) || errorMessage;
        }
      } catch {
        // ignore JSON parse errors here and keep default message
      }
      throw new Error(errorMessage);
    }

    // If there's no body (204 or empty), return empty object/undefined casted to T
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (err) {
      // If response isn't valid JSON, return raw text as any (caller should handle)
      // This avoids throwing unexpected JSON parse errors in the UI
      return (text as unknown) as T;
    }
  } catch (error) {
    console.error('API request failed');
    throw error;
  }
};

// Donor API functions - UPDATED TO MATCH BACKEND ENDPOINTS
export const fetchAllDonors = async (): Promise<DonorAssessmentResponseDTO[]> => {
  const url = `${API_BASE_URL}`;
  try {
    const result = await handleApiRequest<DonorAssessmentResponseDTO[]>(url);
    console.debug(`fetchAllDonors: fetched ${Array.isArray(result) ? result.length : 0} donors`);
    return result;
  } catch (error) {
    console.error('❌ Error fetching donors:', error);
    throw error;
  }
};

export const fetchDonorsByPatient = async (patientPhn: string): Promise<DonorAssessmentResponseDTO[]> => {
  return handleApiRequest<DonorAssessmentResponseDTO[]>(`${API_BASE_URL}/patient/${patientPhn}`);
};

export const fetchDonorById = async (id: number): Promise<DonorAssessmentResponseDTO> => {
  return handleApiRequest<DonorAssessmentResponseDTO>(`${API_BASE_URL}/${id}`);
};

export const createDonor = async (donorData: DonorAssessmentDataDTO, patientPhn: string): Promise<DonorAssessmentResponseDTO> => {
  // Normalize immunological PRA fields: frontend uses nested `pra: { pre, post }`,
  // backend expects `praPre` and `praPost` on the ImmunologicalDetailsDTO.
  const normalizedData = { ...donorData } as any;
  if (normalizedData.immunologicalDetails) {
    const immuno = { ...normalizedData.immunologicalDetails };
    if (immuno.pra && (immuno.pra.pre || immuno.pra.post)) {
      immuno.praPre = immuno.pra.pre;
      immuno.praPost = immuno.pra.post;
      delete immuno.pra; // remove nested shape to match backend DTO
    }
    normalizedData.immunologicalDetails = immuno;
  }

  const donorAssessmentDTO: DonorAssessmentDTO = {
    phn: patientPhn,
    data: normalizedData
  };

  return handleApiRequest<DonorAssessmentResponseDTO>(`${API_BASE_URL}`, {
    method: 'POST',
    body: JSON.stringify(donorAssessmentDTO),
  });
};

export const updateDonor = async (id: number, donorData: Partial<DonorAssessmentDataDTO>): Promise<DonorAssessmentResponseDTO> => {
  // Normalize PRA if present (same as createDonor)
  const normalized = { ...donorData } as any;
  if (normalized.immunologicalDetails) {
    const immuno = { ...normalized.immunologicalDetails };
    if (immuno.pra && (immuno.pra.pre || immuno.pra.post)) {
      immuno.praPre = immuno.pra.pre;
      immuno.praPost = immuno.pra.post;
      delete immuno.pra;
    }
    normalized.immunologicalDetails = immuno;
  }

  return handleApiRequest<DonorAssessmentResponseDTO>(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(normalized),
  });
};

export const deleteDonor = async (id: string): Promise<void> => {
  const numericId = parseInt(id);
  await handleApiRequest<void>(`${API_BASE_URL}/${numericId}`, {
    method: 'DELETE',
  });
};

export const assignDonorToRecipient = async (assignment: DonorAssignmentDTO): Promise<void> => {
  return handleApiRequest<void>(`${API_BASE_URL}/assign`, {
    method: 'POST',
    body: JSON.stringify(assignment),
  });
};

export const unassignDonor = async (donorId: string): Promise<void> => {
  const numericId = parseInt(donorId);
  return handleApiRequest<void>(`${API_BASE_URL}/${numericId}/unassign`, {
    method: 'POST',
  });
};

export const updateDonorStatus = async (donorId: string, status: string): Promise<void> => {
  const numericId = parseInt(donorId);
  return handleApiRequest<void>(`${API_BASE_URL}/${numericId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Search donors by various criteria
export const searchDonors = async (criteria: {
  bloodGroup?: string;
  relationType?: string;
  status?: string;
  patientPhn?: string;
}): Promise<DonorAssessmentResponseDTO[]> => {
  const params = new URLSearchParams();
  if (criteria.bloodGroup) params.append('bloodGroup', criteria.bloodGroup);
  if (criteria.relationType) params.append('relationType', criteria.relationType);
  if (criteria.status) params.append('status', criteria.status);
  if (criteria.patientPhn) params.append('patientPhn', criteria.patientPhn);

  return handleApiRequest<DonorAssessmentResponseDTO[]>(`${API_BASE_URL}/search?${params.toString()}`);
};

// Get donor statistics
export const getDonorStatistics = async (): Promise<{
  total: number;
  available: number;
  assigned: number;
  evaluating: number;
  rejected: number;
}> => {
  return handleApiRequest<{
    total: number;
    available: number;
    assigned: number;
    evaluating: number;
    rejected: number;
  }>(`${API_BASE_URL}/statistics`);
};

// Check if donor exists by NIC
export const checkDonorByNic = async (nicNo: string): Promise<{ exists: boolean; donor?: DonorAssessmentResponseDTO }> => {
  return handleApiRequest<{ exists: boolean; donor?: DonorAssessmentResponseDTO }>(`${API_BASE_URL}/check-nic/${nicNo}`);
};

// Get donors by status
export const getDonorsByStatus = async (status: string): Promise<DonorAssessmentResponseDTO[]> => {
  return handleApiRequest<DonorAssessmentResponseDTO[]>(`${API_BASE_URL}/status/${status}`);
};