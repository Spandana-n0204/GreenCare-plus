"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type HospitalContextType = {
  hospitalId: string | null;
  setHospitalId: (id: string | null) => void;
  hospitalName: string | null;
  setHospitalName: (name: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
};

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider = ({ children }: { children: ReactNode }) => {
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load from localStorage on initial mount (client-side only)
  useEffect(() => {
    const storedHospitalId = localStorage.getItem('hospitalId');
    const storedHospitalName = localStorage.getItem('hospitalName');
    
    if (storedHospitalId) {
      setHospitalId(storedHospitalId);
      setHospitalName(storedHospitalName);
      setIsAuthenticated(true);
    }
  }, []);

  // Update localStorage when values change
  useEffect(() => {
    if (hospitalId) {
      localStorage.setItem('hospitalId', hospitalId);
      if (hospitalName) {
        localStorage.setItem('hospitalName', hospitalName);
      }
    }
  }, [hospitalId, hospitalName]);

  const logout = () => {
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('hospitalName');
    setHospitalId(null);
    setHospitalName(null);
    setIsAuthenticated(false);
  };

  return (
    <HospitalContext.Provider 
      value={{ 
        hospitalId, 
        setHospitalId, 
        hospitalName, 
        setHospitalName, 
        isAuthenticated, 
        setIsAuthenticated,
        logout 
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};