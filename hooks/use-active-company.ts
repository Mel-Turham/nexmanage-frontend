import { MyEntreprise } from '@/types';
import { useCompanyContext } from './use-company-context';

export function useActiveCompany() {
  const {
    activeCompany,
    setActiveCompany,
    isLoading,
    setIsLoading,
    isInitialized,
  } = useCompanyContext();

  const switchCompany = async (company: MyEntreprise) => {
    // Éviter de changer vers la même entreprise
    if (company.id === activeCompany?.id) {
      return;
    }

    setIsLoading(true);
    try {
      // Simuler un délai pour l'UX (optionnel)
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveCompany(company);
    } catch (error) {
      console.error("Erreur lors du changement d'entreprise:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearActiveCompany = () => {
    setActiveCompany(null);
    localStorage.removeItem('activeCompany');
  };

  return {
    activeCompany,
    switchCompany,
    clearActiveCompany,
    isLoading,
    setIsLoading,
    isInitialized,
  };
}
