import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  fetchAllDonors, 
  fetchDonorsByPatient, 
  createDonor as apiCreateDonor, 
  deleteDonor as apiDeleteDonor,
  assignDonorToRecipient as apiAssignDonor,
  unassignDonor as apiUnassignDonor,
  updateDonorStatus as apiUpdateDonorStatus
} from '../services/donorApi';
import { Donor, DonorAssessmentForm, DonorAssessmentResponseDTO, DonorAssessmentDataDTO, DonorAssignmentDTO } from '../types/donor';
import { useAuth } from './AuthContext';

interface DonorContextType {
  donors: Donor[];
  selectedDonor: Donor | null;
  isLoading: boolean;
  error: string | null;
  
  // Basic CRUD operations
  addDonor: (donorData: DonorAssessmentForm, patientPhn: string) => Promise<void>;
  setSelectedDonor: (donor: Donor | null) => void;
  updateDonor: (id: string, updates: Partial<Donor>) => void;
  removeDonor: (id: string) => Promise<void>;
  fetchDonors: (patientPhn?: string) => Promise<void>;
  clearError: () => void;
  
  // Assignment operations
  assignDonorToRecipient: (donorId: string, recipientPhn: string, recipientName: string) => Promise<void>;
  unassignDonor: (donorId: string) => Promise<void>;
  getAssignedDonor: (recipientPhn: string) => Donor | undefined;
  updateDonorStatus: (donorId: string, status: Donor['status']) => Promise<void>;
  
  // Filtering and queries
  getAvailableDonors: () => Donor[];
  getAssignedDonors: () => Donor[];
}

const DonorContext = createContext<DonorContextType | undefined>(undefined);

export const DonorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchDonors = useCallback(async (patientPhn?: string) => {
  setIsLoading(true);
  setError(null);
  try {
    let donorsData: DonorAssessmentResponseDTO[];
    if (patientPhn) {
      donorsData = await fetchDonorsByPatient(patientPhn);
    } else {
      donorsData = await fetchAllDonors();
    }
    
    // Transform backend data to frontend Donor format
    const transformedDonors: Donor[] = donorsData.map((donor: DonorAssessmentResponseDTO) => ({
      id: donor.id?.toString() || `donor-${Date.now()}`,
      name: donor.name || '',
      bloodGroup: `${donor.immunologicalDetails?.bloodGroup?.d || ''}${donor.immunologicalDetails?.bloodGroup?.r || ''}`,
      age: Number(donor.age) || 0, // ✅ Convert to number
      gender: donor.gender || '',
      dateOfBirth: donor.dateOfBirth || '',
      occupation: donor.occupation || '',
      address: donor.address || '',
      nicNo: donor.nicNo || '',
      contactDetails: donor.contactDetails || '',
      emailAddress: donor.emailAddress || '',
      relationType: donor.relationType || '',
      relationToRecipient: donor.relationToRecipient || '',
      patientPhn: donor.patientPhn || '',
      comorbidities: donor.comorbidities || {
        dl: false,
        dm: false,
        psychiatricIllness: false,
        htn: false,
        ihd: false,
      },
      examination: donor.examination || {
        height: "",
        weight: "",
        bmi: "",
        pallor: false,
        icterus: false,
        oral: { dentalCaries: false, oralHygiene: false, satisfactory: false, unsatisfactory: false },
        lymphNodes: { cervical: false, axillary: false, inguinal: false },
        clubbing: false,
        ankleOedema: false,
        cvs: { bp: "", pr: "", murmurs: false },
        respiratory: { rr: false, spo2: false, auscultation: false, crepts: false, ranchi: false, effusion: false },
        abdomen: { hepatomegaly: false, splenomegaly: false, renalMasses: false, freeFluid: false },
        BrcostExamination: "",
        neurologicalExam: { cranialNerves: false, upperLimb: false, lowerLimb: false, coordination: false },
      },
      immunologicalDetails: donor.immunologicalDetails || {
        bloodGroup: { d: "", r: "" },
        crossMatch: { tCell: "", bCell: "" },
        hlaTyping: {
          donor: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          recipient: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          conclusion: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
        },
        pra: { pre: "", post: "" },
        dsa: "",
        immunologicalRisk: "",
      },
      status: (donor.status as Donor['status']) || 'available',
      assignedRecipientPhn: donor.patientPhn, // Map patientPhn to assignedRecipientPhn if assigned
      assignedRecipientName: '', // This would need to come from backend
    }));

    setDonors(transformedDonors);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch donors';
    setError(errorMessage);
    console.error('Error fetching donors:', err);
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    // Only fetch donors if user is authenticated
    if (isAuthenticated) {
      fetchDonors();
    }
  }, [fetchDonors, isAuthenticated]);

  const addDonor = async (donorData: DonorAssessmentForm, patientPhn: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Transform frontend DonorAssessmentForm to backend DonorAssessmentDataDTO format
      const apiData: DonorAssessmentDataDTO = {
        name: donorData.name,
        age: donorData.age || 0,
        gender: donorData.gender,
        dateOfBirth: donorData.dateOfBirth,
        occupation: donorData.occupation,
        address: donorData.address,
        nicNo: donorData.nicNo,
        contactDetails: donorData.contactDetails,
        emailAddress: donorData.emailAddress,
        relationToRecipient: donorData.relationToRecipient,
        relationType: donorData.relationType,
        comorbidities: donorData.comorbidities,
        complains: donorData.complains,
        systemicInquiry: donorData.systemicInquiry,
        drugHistory: donorData.drugHistory,
        allergyHistory: donorData.allergyHistory,
        familyHistory: donorData.familyHistory,
        substanceUse: donorData.substanceUse,
        socialHistory: donorData.socialHistory,
        examination: donorData.examination,
        immunologicalDetails: donorData.immunologicalDetails,
      };

      const savedDonor = await apiCreateDonor(apiData, patientPhn);
      
      // Transform back to frontend Donor format
      const newDonor: Donor = {
        id: savedDonor.id.toString(),
        name: savedDonor.name,
        bloodGroup: `${savedDonor.immunologicalDetails?.bloodGroup?.d || ''}${savedDonor.immunologicalDetails?.bloodGroup?.r || ''}`,
        age: savedDonor.age,
        gender: savedDonor.gender,
        dateOfBirth: savedDonor.dateOfBirth || '',
        occupation: savedDonor.occupation || '',
        address: savedDonor.address || '',
        nicNo: savedDonor.nicNo || '',
        contactDetails: savedDonor.contactDetails || '',
        emailAddress: savedDonor.emailAddress || '',
        relationType: savedDonor.relationType || '',
        relationToRecipient: savedDonor.relationToRecipient || '',
        patientPhn: savedDonor.patientPhn || '',
        comorbidities: savedDonor.comorbidities || donorData.comorbidities,
        examination: savedDonor.examination || donorData.examination,
        immunologicalDetails: savedDonor.immunologicalDetails || donorData.immunologicalDetails,
        status: (savedDonor.status as Donor['status']) || 'available',
      };
      
      setDonors(prev => [...prev, newDonor]);
      return Promise.resolve();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create donor';
      setError(errorMessage);
      console.error('Error adding donor:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDonor = (id: string, updates: Partial<Donor>) => {
    setDonors(prev => prev.map(donor => 
      donor.id === id ? { ...donor, ...updates } : donor
    ));
  };

  const removeDonor = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        await apiDeleteDonor(numericId);
      }
      setDonors(prev => prev.filter(donor => donor.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete donor';
      setError(errorMessage);
      console.error('Error deleting donor:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const assignDonorToRecipient = async (donorId: string, recipientPhn: string, recipientName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const assignment: DonorAssignmentDTO = {
        donorId,
        recipientPhn,
        recipientName,
        assignmentDate: new Date().toISOString(),
      };

      await apiAssignDonor(assignment);

      // Update local state
      setDonors(prev => prev.map(donor => 
        donor.id === donorId 
          ? { 
              ...donor, 
              status: 'assigned',
              assignedRecipientPhn: recipientPhn,
              assignedRecipientName: recipientName,
              patientPhn: recipientPhn
            }
          : donor
      ));

      console.log(`Donor ${donorId} assigned to recipient ${recipientName}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign donor';
      setError(errorMessage);
      console.error('Error assigning donor:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unassignDonor = async (donorId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiUnassignDonor(donorId);

      // Update local state
      setDonors(prev => prev.map(donor => 
        donor.id === donorId 
          ? { 
              ...donor, 
              status: 'available',
              assignedRecipientPhn: undefined,
              assignedRecipientName: undefined,
              patientPhn: undefined
            }
          : donor
      ));

      console.log(`Donor ${donorId} unassigned`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unassign donor';
      setError(errorMessage);
      console.error('Error unassigning donor:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDonorStatus = async (donorId: string, status: Donor['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiUpdateDonorStatus(donorId, status || 'available');

      // Update local state
      setDonors(prev => prev.map(donor => 
        donor.id === donorId ? { ...donor, status } : donor
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update donor status';
      setError(errorMessage);
      console.error('Error updating donor status:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getAssignedDonor = (recipientPhn: string) => {
    return donors.find(donor => 
      donor.assignedRecipientPhn === recipientPhn && donor.status === 'assigned'
    );
  };

  const getAvailableDonors = () => {
    return donors.filter(donor => donor.status === 'available');
  };

  const getAssignedDonors = () => {
    return donors.filter(donor => donor.status === 'assigned');
  };

  const clearError = () => setError(null);

  const value: DonorContextType = {
    donors,
    selectedDonor,
    isLoading,
    error,
    addDonor,
    setSelectedDonor,
    updateDonor,
    removeDonor,
    fetchDonors,
    clearError,
    assignDonorToRecipient,
    unassignDonor,
    getAssignedDonor,
    updateDonorStatus,
    getAvailableDonors,
    getAssignedDonors,
  };

  return (
    <DonorContext.Provider value={value}>
      {children}
    </DonorContext.Provider>
  );
};

export const useDonorContext = () => {
  const context = useContext(DonorContext);
  if (context === undefined) {
    throw new Error('useDonorContext must be used within a DonorProvider');
  }
  return context;
};