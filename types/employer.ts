export interface EmployersPresent {
  id: number;
  name: string;
  email: string;
  phone: string;
  duration: string; // durée du contrat, ex: "10h"
  leaveBalance: string; // solde de congés, ex: "20 jours"
}

// Dans @/types/employer.ts (exemple)
export interface Employer {
  id: number | string;
  name: string;
  email: string;
  telephone?: string; // Optionnel, car non visible directement dans la section "Renseignements personnels" du design
  Poste: string | string[]; // "Bar", "Cuisine" suggère string[]
  Entreprise?: string;
  profileImage?: string; // URL vers une image de profil si disponible

  // Nouveaux champs inspirés du design
  leaveBalance?: string; // Ex: "50 jours"
  role?: string; // Ex: "Admin"
  hourlyRate?: string; // Ex: "10 $/h" (stocker comme nombre, formater pour affichage)
  // ... autres champs que vous pourriez avoir
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
