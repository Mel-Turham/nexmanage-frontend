import React from "react";
import ContratCard from "./TaskCard"; // Importez le composant renommé
import {
  Contrat,
  Point,
  Utilisateur,
  Tache,
  Priorite,
  StatutTache,
  Role,
} from "@/types"; // Importez tous les types nécessaires

const KanbanComponent = () => {
  // Données fictives pour les utilisateurs
  const utilisateur1: Utilisateur = {
    idUtilisateur: "user1",
    nom: "Dupont",
    motDePasse: "azerg",
    role: Role.ADMIN,
    isActif: true,
    telephone: "696 696 696",
    entreprise: [],
  };

  const utilisateur2: Utilisateur = {
    idUtilisateur: "user2",
    nom: "Martin",
    motDePasse: "azerg",
    role: Role.EMPLOYE,
    isActif: true,
    telephone: "696 696 696",
    entreprise: [],
  };
  // const utilisateur3: Utilisateur = {
  //   idUtilisateur: "user2",
  //   nom: "Martin",
  //   motDePasse: "azerg",
  //   role: Role.MANAGER,
  //   isActif: true,
  //   telephone: "696 696 696",
  //   entreprise: [],
  // };

  // Données fictives pour les tâches
  const tache1: Tache = {
    id: "tache1",
    titre: "Préparation du rapport mensuel",
    TimeEstimated: 180, // 3 heures
    priorite: Priorite.HAUTE,
    statut: StatutTache.EN_ATTENTE,
    dateCreation: new Date("2025-06-20T09:00:00Z"),
  };
  const tache2: Tache = {
    id: "tache2",
    titre: "Réunion de suivi client",
    TimeEstimated: 90, // 1 heure 30 minutes
    priorite: Priorite.MOYENNE,
    statut: StatutTache.TERMINEE,
    dateCreation: new Date("2025-06-20T09:00:00Z"),
  };
  const tache3: Tache = {
    id: "tache3",
    titre: "Développement nouvelle fonctionnalité",
    priorite: Priorite.BASSE,
    TimeEstimated: 360, // 6 heures
    statut: StatutTache.EN_COURS,
    dateCreation: new Date("2025-06-20T09:00:00Z"),
  };
  const tache4: Tache = {
    id: "tache4",
    titre: "Test de l'application mobile",
    TimeEstimated: 120, // 2 heures
    priorite: Priorite.HAUTE,
    statut: StatutTache.EN_ATTENTE,
    dateCreation: new Date("2025-06-20T09:00:00Z"),
  };
  const lieuParis: Point = {
    coordinates: [48.8566, 2.3522],
  };
  const lieuLyon: Point = {
    coordinates: [45.75, 4.85],
  };
  const lieuMarseille: Point = {
    coordinates: [43.2965, 5.3698],
  };

  // Création des données fictives de contrats
  const contratsFictifs: Contrat[] = [
    {
      id: "contrat1",
      lieu: lieuParis,
      dateDebut: new Date("2025-06-20T09:00:00Z"),
      dateFin: new Date("2025-06-20T17:00:00Z"),
      description: "Contrat pour le projet Alpha à Paris.",
      pause: 30,
      utilisateur: [utilisateur1],
      taches: [tache1, tache2],
      estGabarit: false,
    },
    {
      id: "contrat2",
      lieu: lieuLyon,
      dateDebut: new Date("2025-06-21T10:00:00Z"),
      dateFin: new Date("2025-06-21T18:00:00Z"),
      description: "Maintenance et support pour le client Beta à Lyon.",
      pause: 45,
      utilisateur: [utilisateur1, utilisateur2],
      taches: [tache3],
      estGabarit: true,
      nomGabarit: "Contrat Standard Client",
    },
    {
      id: "contrat3",
      lieu: lieuMarseille,
      dateDebut: new Date("2025-06-22T08:30:00Z"),
      dateFin: new Date("2025-06-22T16:30:00Z"),
      description: "Audit de sécurité pour le projet Gamma.",
      pause: 60,
      utilisateur: [utilisateur2],
      taches: [tache4, tache1], // Peut réutiliser des tâches existantes
      estGabarit: false,
    },
  ];

  return (
    <div className="flex flex-row flex-wrap gap-4 p-4 justify-start">
      {contratsFictifs.map((contrat) => (
        <ContratCard key={contrat.id} contrat={contrat} />
      ))}
    </div>
  );
};

export default KanbanComponent;
