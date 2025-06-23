import React from "react";
import ContratCard from "./TaskCard"; // Importez le composant renommé
import {
  Contrat,
  Role,
} from "@/types"; // Importez tous les types nécessaires

const KanbanComponent = () => {
  // Données fictives pour les utilisateurs
  // const utilisateur1: Utilisateur = {
  //   idUtilisateur: "user1",
  //   nom: "Dupont",
  //   motDePasse: "azerg",
  //   role: Role.ADMIN,
  //   isActif: true,
  //   telephone: "696 696 696",
  //   entreprise: [],
  // };

  // const utilisateur2: Utilisateur = {
  //   idUtilisateur: "user2",
  //   nom: "Martin",
  //   motDePasse: "azerg",
  //   role: Role.EMPLOYE,
  //   isActif: true,
  //   telephone: "696 696 696",
  //   entreprise: [],
  // };
  // // const utilisateur3: Utilisateur = {
  // //   idUtilisateur: "user2",
  // //   nom: "Martin",
  // //   motDePasse: "azerg",
  // //   role: Role.MANAGER,
  // //   isActif: true,
  // //   telephone: "696 696 696",
  // //   entreprise: [],
  // // };

  // // Données fictives pour les tâches
  // const tache1: Tache = {
  //   id: "tache1",
  //   titre: "Préparation du rapport mensuel",
  //   TimeEstimated: 180, // 3 heures
  //   priorite: Priorite.HAUTE,
  //   statut: StatutTache.EN_ATTENTE,
  //   dateCreation: new Date("2025-06-20T09:00:00Z"),
  // };
  // const tache2: Tache = {
  //   id: "tache2",
  //   titre: "Réunion de suivi client",
  //   TimeEstimated: 90, // 1 heure 30 minutes
  //   priorite: Priorite.MOYENNE,
  //   statut: StatutTache.TERMINEE,
  //   dateCreation: new Date("2025-06-20T09:00:00Z"),
  // };
  // const tache3: Tache = {
  //   id: "tache3",
  //   titre: "Développement nouvelle fonctionnalité",
  //   priorite: Priorite.BASSE,
  //   TimeEstimated: 360, // 6 heures
  //   statut: StatutTache.EN_COURS,
  //   dateCreation: new Date("2025-06-20T09:00:00Z"),
  // };
  // const tache4: Tache = {
  //   id: "tache4",
  //   titre: "Test de l'application mobile",
  //   TimeEstimated: 120, // 2 heures
  //   priorite: Priorite.HAUTE,
  //   statut: StatutTache.EN_ATTENTE,
  //   dateCreation: new Date("2025-06-20T09:00:00Z"),
  // };
  // const lieuParis: Point = {
  //   coordinates: [48.8566, 2.3522],
  // };
  // const lieuLyon: Point = {
  //   coordinates: [45.75, 4.85],
  // };
  // const lieuMarseille: Point = {
  //   coordinates: [43.2965, 5.3698],
  // };

  // Création des données fictives de contrats
  const contratsFictifs: Contrat[] = [
    {
      id: "7fa42151-6623-4f9e-845b-3cf3d1d71c05",
      lieu: {
        coordinates: [11.515, 3.867],
      },
      dateDebut: new Date("2025-06-20T08:00:00.000Z"),
      dateFin: new Date("2025-06-20T12:00:00.000Z"),
      description: "Contrat test 1",
      pause: 30,
      estGabarit: false,
      dateCreation: new Date("2025-06-18T19:30:35.700Z"),
      utilisateur: [
        {
          idUtilisateur: "2b2ab46d-ff16-464e-a68f-aa9f6c47e047",
          nom: "Loic",
          email: "loic62@gmail.com",
          telephone: "+66666666666",
          motDePasse:
            "$2b$10$oKTxvv0uQ5rIL2A4ArEojuRgEwEYo8tLfv28Kse0/LXg53YusPJju",
          role: Role.ADMIN,
          isActif: true,
          dateCreation: new Date("2025-06-17T15:23:44.556Z"),
          entreprise: [],
        },
        {
          idUtilisateur: "abc-123",
          nom: "Alice",
          email: "alice@example.com",
          telephone: "+123456789",
          motDePasse: "hashedpassword",
          role: Role.EMPLOYE,
          isActif: true,
          dateCreation: new Date("2025-06-19T10:00:00.000Z"),
          entreprise: [],
        },
      ],
      taches: [],
    },
    {
      id: "25592995-2a2f-4061-b091-73605b350bda",
      lieu: {
        coordinates: [11.515, 3.867],
      },
      dateDebut: new Date("2025-06-18T09:00:00.000Z"),
      dateFin: new Date("2025-06-18T17:00:00.000Z"),
      description: "Contrat de maintenance",
      pause: 30,
      estGabarit: false,
      dateCreation: new Date("2025-06-18T19:56:31.747Z"),
      utilisateur: [
        {
          idUtilisateur: "def-456",
          nom: "Bob",
          email: "bob@example.com",
          telephone: "+987654321",
          motDePasse: "hashedpassword",
          role: Role.EMPLOYE,
          isActif: true,
          dateCreation: new Date("2025-06-19T11:00:00.000Z"),
          entreprise: [],
        },
      ],
      taches: [],
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
