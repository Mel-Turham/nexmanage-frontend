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
  EMPLOYE = 'EMPLOYE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum StatutTache {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
}

export enum StatutConge {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

export enum StatutContrat {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ARRIVEE_TARDIVE = 'ARRIVEE-TARDIVE',
}

export type Point = {
  coordinates: [number, number];
};

export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
}

export interface Entreprise {
  idEntreprise: string;
  nom: string;
  domain: string;
  email: string;
  adresse: string;
  nbreEmployes: number;
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

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export enum UserRole {
  EMPLOYE = 'EMPLOYE',
  ADMIN = 'ADMIN',
}

export interface BaseUser {
  nom: string;
  email: string;
  phone: string;
}

export interface Organisation {
  role: UserRole;
  joinedAt: string;
  nom: string;
  email: string;
  id: string;
  updatedAt: string;
  deletedAt: string | null;
  domain: string;
  adresse: string | null;
  nbreEmployes: number | null;
  createAt: string;
}

export interface User {
  user: BaseUser;
  organisation: Organisation[];
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
  statut: StatutContrat;
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

export interface MyCompaniesRespose {
  message: string;
  data: MyEntreprise[];
  pagination: pagination;
}

export interface MyEntreprise {
  id: string;
  nom: string;
  domaine: string;
  adresse: string;
  email: string;
  nbre_employers: number;
  dateCreation: Date;
  totalUsers: number;
  owner: Owner;
  employees: Owner[];
}

export interface Owner {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  dateAjout: Date;
}

interface pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Invitation data

export interface InvitationResponse {
  success: boolean;
  result: {
    nom: string;
    email?: string;
    phone?: string;
  };
}

export interface Iregister {
  token: string;
}

export interface EditOrgResponse {
  success: boolean;
  message: string;
  result: Result;
}

export interface Result {
  id: string;
  nom: string;
  domain: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  adresse: string;
  nbreEmployes: number;
  createAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface UserInvitationResponse {
  result: {
    invitation: {
      isUser: boolean;
      email: string;
      phone: string;
      organisationId: string;
      role: UserRole;
    };
  };
  success: boolean;
}

export interface UserStorageData {
  isUser?: boolean;
  email: string;
  phone: string;
  organisationId: string;
  role: string;
}

export interface Users {
  success: boolean;
  users: User[];
}

export interface User {
  id: string;
  nom: null | string;
  email: string;
  phone: string;
  joinedAt: Date;
  role: string;
}

export interface JwtPayload {
  userId: string;
  exp?: number;
  iat?: number;
  sub?: string;
}

export interface EditUser {
  nom: string;
  email: string;
  phone: string;
}
