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
export interface Entreprise {
  id: string;
  nom: string;
  domaine: string;
  adresse: string;
  dateCreation: Date;
  updateAt: Date;
  deleteAt: Date;
  utilisateurs: Utilisateur[];
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  motDePasse: string;
  téléphone: string;
  rôle: Role;
  poste: string;
  entreprise: Entreprise;
  isActif: boolean;
  dateCreation: Date;
  dateUpdate: Date;
  dateDelete: Date;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface ResponseLogin {
  user: User;
  message: string;
  accesstoken: string;
}

export interface User {
  idUtilisateur: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  isActif: boolean;
  dateCreation: Date;
  update_at: Date;
  delete_at: null;
}

export interface Contrat {
  id: string;
  utilisateur: Utilisateur[];
  DateDebut: Date;
  DateFin: Date;
  description: string;
  poste: string;
  pause: Date;
  lieu: string;
  estGabarit: boolean;
  nomGabarit: string;
  estRepetif: boolean;
  taches: Tache[];
  dateCreation: Date;
  dateUpdate: Date;
  dateDelete: Date;
}

export interface Tache {
  id: string;
  description: string;
  duréePrévue: number;
  priorite: string;
  statut: StatutTache;
  dateCreation: Date;
  dateUpdate: Date;
  dateDelete: Date;
  contrat: Contrat;
}

export interface Présence {
  id: string;
  utilisateur: Utilisateur;
  contrat: Contrat;
  heureArrivée: Date;
  heureDépart: Date;
  localisationArrivée: string;
  localisationDépart: string;
}

export interface Conge {
  id: string;
  utilisateur: Utilisateur;
  dateDébut: Date;
  dateFin: Date;
  statut: StatutConge;
}

export interface Commentaire {
  id: string;
  message: string;
  auteur: Utilisateur;
  contrat: Contrat;
  date: Date;
}

export interface Conversation {
  id: string;
  utilisateurs: Utilisateur[];
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
