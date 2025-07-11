import React from "react";
import ContratCard from "./ContratCard"; // Votre composant carte
import { Contrat, Role, StatutContrat } from "@/types";

interface KanbanColumnProps {
  title: string;
  contrats: Contrat[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, contrats }) => {
  return (
    <div className="bg-bleu-ciel rounded-md p-4 flex flex-col w-72 max-h-[80vh] h-fit overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">
        {title} ({contrats.length})
      </h2>
      {contrats.length === 0 ? (
        <p className="text-gray-500">Aucun contrat</p>
      ) : (
        contrats.map((contrat) => (
          <ContratCard key={contrat.id} contrat={contrat} />
        ))
      )}
    </div>
  );
};

const KanbanComponent = () => {
  // Vos données fictives contratsFictifs ici (ou récupérées via API)

  const contratsFictifs: Contrat[] = [
    {
      id: "1",
      lieu: { coordinates: [48.8566, 2.3522] },
      dateDebut: new Date("2025-07-01T08:00:00Z"),
      dateFin: new Date("2025-07-01T12:00:00Z"),
      description: "Installation réseau Paris",
      pause: 15,
      utilisateur: [
        {
          idUtilisateur: "u1",
          nom: "Alice",
          email: "alice@example.com",
          telephone: "+33123456789",
          role: Role.EMPLOYE,
          isActif: true,
          dateCreation: new Date(),
          entreprise: [],
          motDePasse: "",
        },
      ],
      taches: [],
      estGabarit: false,
      dateCreation: new Date("2025-06-20T10:00:00Z"),
      statut: StatutContrat.EN_ATTENTE,
    },
    {
      id: "2",
      lieu: { coordinates: [45.75, 4.85] },
      dateDebut: new Date("2025-07-02T09:00:00Z"),
      dateFin: new Date("2025-07-02T17:00:00Z"),
      description: "Maintenance serveur Lyon",
      pause: 30,
      utilisateur: [
        {
          idUtilisateur: "u2",
          nom: "Bob",
          email: "bob@example.com",
          telephone: "+33456789012",
          role: Role.MANAGER,
          isActif: true,
          dateCreation: new Date(),
          entreprise: [],
          motDePasse: "",
        },
      ],
      taches: [],
      estGabarit: false,
      dateCreation: new Date("2025-06-21T11:00:00Z"),
      statut: StatutContrat.EN_COURS,
    },
    {
      id: "3",
      lieu: { coordinates: [43.2965, 5.3698] },
      dateDebut: new Date("2025-06-30T08:00:00Z"),
      dateFin: new Date("2025-06-30T16:00:00Z"),
      description: "Audit sécurité Marseille",
      pause: 45,
      utilisateur: [
        {
          idUtilisateur: "u3",
          nom: "Charlie",
          email: "charlie@example.com",
          telephone: "+33412345678",
          role: Role.ADMIN,
          isActif: true,
          dateCreation: new Date(),
          entreprise: [],
          motDePasse: "",
        },
      ],
      taches: [],
      estGabarit: false,
      dateCreation: new Date("2025-06-19T09:00:00Z"),
      statut: StatutContrat.TERMINE,
    },
  ];

  // Filtrer les contrats par statut
  const enAttente = contratsFictifs.filter(
    (c) => c.statut === StatutContrat.EN_ATTENTE
  );
  const enCours = contratsFictifs.filter(
    (c) => c.statut === StatutContrat.EN_COURS
  );
  const termines = contratsFictifs.filter(
    (c) => c.statut === StatutContrat.TERMINE
  );

  return (
    <div className="flex gap-6">
      <KanbanColumn title="En attente" contrats={enAttente} />
      <KanbanColumn title="En cours" contrats={enCours} />
      <KanbanColumn title="Terminés" contrats={termines} />
    </div>
  );
};

export default KanbanComponent;
