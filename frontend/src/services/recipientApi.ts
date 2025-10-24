import { 
  RecipientAssessmentForm, 
  RecipientAssessmentDTO, 
  RecipientAssessmentResponseDTO 
} from '@/types/recipient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/recipient-assessment';

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

// Generic API request handler with proper error handling
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

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Authentication failed. Please log in again.');
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // For DELETE/204 requests with no content
    if (response.status === 204 || options.method === 'DELETE') {
      return undefined as T;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    console.log('Request URL:', url);
    
    // Re-throw the error for the caller to handle
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown API error occurred');
  }
};

// Convert frontend form to DTO for API
const convertToDTO = (form: RecipientAssessmentForm): RecipientAssessmentDTO => {
  return {
    id: form.id,
    phn: form.phn,
    name: form.name,
    age: form.age,
    gender: form.gender,
    dateOfBirth: form.dateOfBirth,
    occupation: form.occupation,
    address: form.address,
    nicNo: form.nicNo,
    contactDetails: form.contactDetails,
    emailAddress: form.emailAddress,
    donorId: form.donorId,
    relationType: form.relationType,
    relationToRecipient: form.relationToRecipient,
    comorbidities: form.comorbidities,
    rrtDetails: form.rrtDetails,
    systemicInquiry: form.systemicInquiry,
    complains: form.complains,
    drugHistory: form.drugHistory,
    allergyHistory: form.allergyHistory,
    familyHistory: form.familyHistory,
    substanceUse: form.substanceUse,
    socialHistory: form.socialHistory,
    examination: form.examination,
    immunologicalDetails: form.immunologicalDetails,
    transfusionHistory: form.transfusionHistory,
  };
};

// Convert API response to frontend form
const convertToForm = (response: RecipientAssessmentResponseDTO): RecipientAssessmentForm => {
  return {
    id: response.id,
    phn: response.phn,
    name: response.name,
    age: response.age,
    gender: response.gender,
    dateOfBirth: response.dateOfBirth,
    occupation: response.occupation,
    address: response.address,
    nicNo: response.nicNo,
    contactDetails: response.contactDetails,
    emailAddress: response.emailAddress,
    donorId: response.donorId,
    relationType: response.relationType,
    relationToRecipient: response.relationToRecipient,
    comorbidities: response.comorbidities,
    rrtDetails: response.rrtDetails,
    systemicInquiry: response.systemicInquiry,
    complains: response.complains,
    drugHistory: response.drugHistory,
    allergyHistory: response.allergyHistory,
    familyHistory: response.familyHistory,
    substanceUse: response.substanceUse,
    socialHistory: response.socialHistory,
    examination: response.examination,
    immunologicalDetails: response.immunologicalDetails,
    transfusionHistory: response.transfusionHistory,
  };
};

// Recipient API functions
export const fetchAllRecipients = async (): Promise<RecipientAssessmentForm[]> => {
  const response = await handleApiRequest<RecipientAssessmentResponseDTO[]>(`${API_BASE_URL}`);
  return response.map(convertToForm);
};

export const fetchRecipientByPatient = async (patientPhn: string): Promise<RecipientAssessmentForm[]> => {
  const response = await handleApiRequest<RecipientAssessmentResponseDTO[]>(`${API_BASE_URL}/patient/${patientPhn}`);
  return response.map(convertToForm);
};

export const fetchRecipientById = async (id: number): Promise<RecipientAssessmentForm> => {
  const response = await handleApiRequest<RecipientAssessmentResponseDTO>(`${API_BASE_URL}/${id}`);
  return convertToForm(response);
};

export const fetchLatestRecipientAssessment = async (patientPhn: string): Promise<RecipientAssessmentForm | null> => {
  try {
    const response = await handleApiRequest<RecipientAssessmentResponseDTO>(`${API_BASE_URL}/patient/${patientPhn}/latest`);
    return convertToForm(response);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};

export const createRecipient = async (recipientData: RecipientAssessmentForm): Promise<RecipientAssessmentForm> => {
  const dto = convertToDTO(recipientData);
  const response = await handleApiRequest<RecipientAssessmentResponseDTO>(`${API_BASE_URL}`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  return convertToForm(response);
};

export const updateRecipient = async (id: number, recipientData: Partial<RecipientAssessmentForm>): Promise<RecipientAssessmentForm> => {
  const dto = convertToDTO(recipientData as RecipientAssessmentForm);
  const response = await handleApiRequest<RecipientAssessmentResponseDTO>(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
  return convertToForm(response);
};

export const deleteRecipient = async (id: number): Promise<void> => {
  await handleApiRequest<void>(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};

// Search donor by PHN (using donor assessment endpoint)
export const searchDonorByPhn = async (phn: string): Promise<any> => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/donor-assessment/patient/${phn}`,
      {
        headers: getHeaders(),
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to search donor');
    }
    
    const assessments = await response.json();
    return assessments.length > 0 ? assessments[0] : null;
  } catch (error) {
    console.error('Error searching donor:', error);
    return null;
  }
};

// Main API service for the component
export const recipientApiService = {
  // Assessment operations
  fetchLatestRecipientAssessment,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  fetchRecipientByPatient,
  
  // Donor operations
  searchDonorByPhn,
  
  // Combined save operation (create or update)
  saveRecipientAssessment: async (data: RecipientAssessmentForm, isEditing: boolean, id?: number): Promise<RecipientAssessmentForm> => {
    try {
      if (isEditing && id) {
        return await updateRecipient(id, data);
      } else {
        return await createRecipient(data);
      }
    } catch (error) {
      console.error('Error saving recipient assessment:', error);
      throw error;
    }
  },
};

// Default export
export default recipientApiService;