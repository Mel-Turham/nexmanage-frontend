"use client";
import React from "react";

import EmployerTable from "@/components/presence/EmployersPresentTable";
import { Contrat, Role } from "@/types";

const Presences = () => {
  const myContracts: Contrat[] = [
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
      // dateFin: new Date("2025-06-18T17:00:00.000Z"),
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
    <div className="h-full">
      <main className="p-6 h-full">
        <EmployerTable contracts={myContracts} />
      </main>
    </div>
  );
};

export default Presences;
