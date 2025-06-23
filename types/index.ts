// associations importantes dans l'application.

// Utilisateur --> entreprise (plusieurs utilisateurs dans une entreprise)
// Utilisateur --> Contract (un employé a plusieurs contrats)
// Utilisateur → Presence (journalière)
// Contract -->  Tache (association n:n via contract_taches)
// Contract → Ressource (via contract_equipements)
// Utilisateur → Conge, , Commentaire

// ================================
//        ENTITES TYPESCRIPT
// ================================

export enum Role {
  EMPLOYE = "EMPLOYE",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

export enum StatutTache {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
}

export enum StatutConge {
  EN_ATTENTE = "EN_ATTENTE",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE",
}

export type Point = {
  coordinates: [number, number];
};

export enum Priorite {
  BASSE = "BASSE",
  MOYENNE = "MOYENNE",
  HAUTE = "HAUTE",
}

export interface Entreprise {
  idEntreprise: string;
  nom: string;
  domaine: string;
  email: string;
  adresse: string;
  nbre_employers: number;
  dateCreation: Date;
  update_at: Date;
  delete_at: Date;
  utilisateurs: Utilisateur[];
}

export interface Utilisateur {
  idUtilisateur: string;
  nom: string;
  email?: string;
  motDePasse: string;
  telephone: string;
  role: Role;
  isActif: boolean;
  dateCreation?: Date;
  entreprise: Entreprise[];
}

export interface Contrat {
  id: string;
  lieu: Point;
  dateDebut?: Date;
  dateFin?: Date;
  description?: string;
  pause: number; //durree de la pause en minutes
  utilisateur: Utilisateur[];
  taches: Tache[];
  estGabarit: boolean;
  nomGabarit?: string;
  dateCreation: Date;
  //   equipements: Equipement[];
}

export interface Tache {
  id: string;
  titre: string;
  description?: string;
  TimeEstimated: number;
  priorite: Priorite;
  statut: StatutTache;
  dateCreation: Date;
  contrat?: Contrat[];
}

// export class Equipement {
//   id: string;
//   nom: string;
//   type: string;
//   contrat: Contrat;
// }

export interface Présence {
  id: string;
  utilisateur: Utilisateur;
  contrat: Contrat;
  heureArrivee: Date;
  heureDepart: Date;
  localisationArrivee: Point;
  localisationDepart: Point;
  notes?: string;
}

export interface Conge {
  id: string;
  motif: string;
  motifRefus?: string;
  statut: StatutConge;
  utilisateur: Utilisateur;
  dateDebut: Date;
  dateFin: Date;
  dureeJours: number;
  dateCreation: Date;
  update_at: Date;
  delete_at: Date;
}

export interface Commentaire {
  idComment: string;
  message: string;
  contrat: Contrat;
  utilisateur: Utilisateur;
  dateCreation: Date;
}
export interface Conversation {
  id: string;
  participants: Utilisateur[];
  messages: Message[];
}

export interface Message {
  id: string;
  auteur: Utilisateur;
  contenu: string;
  dateEnvoi: Date;
  conversation: Conversation;
  luPar: Utilisateur[];
}
export interface Demande {
  id: string;
  // Ajoute ici les autres propriétés nécessaires
}