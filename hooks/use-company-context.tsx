'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { MyEntreprise } from '@/types';

interface CompanyContextType {
  activeCompany: MyEntreprise | null;
  setActiveCompany: (company: MyEntreprise | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isInitialized: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [activeCompany, setActiveCompany] = useState<MyEntreprise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sauvegarder dans localStorage quand l'entreprise change
  useEffect(() => {
    if (activeCompany && isInitialized) {
      localStorage.setItem('activeCompany', JSON.stringify(activeCompany));
    }
  }, [activeCompany, isInitialized]);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const initializeFromStorage = () => {
      try {
        const savedCompany = localStorage.getItem('activeCompany');
        if (savedCompany) {
          const company = JSON.parse(savedCompany);
          setActiveCompany(company);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'entreprise active:",
          error
        );
        localStorage.removeItem('activeCompany');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeFromStorage();
  }, []);

  const value = {
    activeCompany,
    setActiveCompany,
    isLoading,
    setIsLoading,
    isInitialized,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error(
      'useCompanyContext doit être utilisé dans un CompanyProvider'
    );
  }

  return context;
}
