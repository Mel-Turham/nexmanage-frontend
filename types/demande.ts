// Dans @/types/demandeConge.ts

import { ReactNode } from "react";
import { Employer } from "./employer";

export interface DemandeConge {
  justification: ReactNode;
  duration: number;
  heuresParJour: number;
  soldeRestant: any;
  idDemande: number; // Identifiant unique de la demande
  employe: Employer; // Référence à l'employé (interface Employer à importer)
  dateDebut: string; // Date de début de congé (format ISO string recommandé)
  dateFin: string; // Date de fin de congé (format ISO string recommandé)
  motif: string; // Motif du congé
  statut: string; // Statut de la demande (ex: "En attente", "Acceptée", "Refusée")
  justificationRefus?: string; // Justification du refus (optionnel, si la demande est refusée)
}
