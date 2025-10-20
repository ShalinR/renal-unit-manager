// context/DonorContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  age: string | number; // Allow both string and number
  gender?: string;
  dateOfBirth?: string;
  occupation?: string;
  address?: string;
  nicNo?: string;
  contactDetails?: string;
  emailAddress?: string;
  relationType?: string;
  relationToRecipient?: string;
}

interface DonorContextType {
  donors: Donor[];
  selectedDonor: Donor | null;
  setSelectedDonor: (donor: Donor | null) => void;
  addDonor: (donor: Donor) => void;
  updateDonor: (id: string, donor: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  getDonorById: (id: string) => Donor | undefined;
}

const DonorContext = createContext<DonorContextType | undefined>(undefined);

// Local storage keys
const DONORS_STORAGE_KEY = 'kidney-transplant-donors';
const SELECTED_DONOR_STORAGE_KEY = 'selected-donor';

// Helper functions for localStorage
const saveDonorsToStorage = (donors: Donor[]) => {
  localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(donors));
};

const getDonorsFromStorage = (): Donor[] => {
  const stored = localStorage.getItem(DONORS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveSelectedDonorToStorage = (donor: Donor | null) => {
  if (donor) {
    localStorage.setItem(SELECTED_DONOR_STORAGE_KEY, JSON.stringify(donor));
  } else {
    localStorage.removeItem(SELECTED_DONOR_STORAGE_KEY);
  }
};

const getSelectedDonorFromStorage = (): Donor | null => {
  const stored = localStorage.getItem(SELECTED_DONOR_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const DonorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<Donor[]>(() => getDonorsFromStorage());
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(() => getSelectedDonorFromStorage());

  // Save to localStorage whenever donors change
  useEffect(() => {
    saveDonorsToStorage(donors);
  }, [donors]);

  // Save to localStorage whenever selectedDonor changes
  useEffect(() => {
    saveSelectedDonorToStorage(selectedDonor);
  }, [selectedDonor]);

  const addDonor = (donor: Donor) => {
    setDonors(prev => [...prev, donor]);
  };

  const updateDonor = (id: string, updatedDonor: Partial<Donor>) => {
    setDonors(prev => prev.map(donor => 
      donor.id === id ? { ...donor, ...updatedDonor } : donor
    ));
  };

  const deleteDonor = (id: string) => {
    setDonors(prev => prev.filter(donor => donor.id !== id));
    // If the deleted donor was selected, clear selection
    if (selectedDonor?.id === id) {
      setSelectedDonor(null);
    }
  };

  const getDonorById = (id: string) => {
    return donors.find(donor => donor.id === id);
  };

  const handleSetSelectedDonor = (donor: Donor | null) => {
    setSelectedDonor(donor);
  };

  return (
    <DonorContext.Provider value={{
      donors,
      selectedDonor,
      setSelectedDonor: handleSetSelectedDonor,
      addDonor,
      updateDonor,
      deleteDonor,
      getDonorById
    }}>
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