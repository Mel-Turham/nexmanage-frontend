import { Employer } from "./employer";

export enum StatutConge {
  EN_ATTENTE = "EN_ATTENTE",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE",
}

export interface DemandeConge {
  id: string;
  employe: Employer;
  dateDébut: Date;
  dateFin: Date;
  statut: StatutConge;
}
