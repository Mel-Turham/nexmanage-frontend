import React from "react";
import { Contrat } from "@/types";

interface ContratCardProps {
  contrat: Contrat;
}

const ContratCard: React.FC<ContratCardProps> = ({ contrat }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow">
      <h3 className="font-bold text-lg mb-1">{contrat.description || "Sans description"}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Début :</strong>{" "}
        {contrat.dateDebut ? contrat.dateDebut.toLocaleString() : "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Fin :</strong>{" "}
        {contrat.dateFin ? contrat.dateFin.toLocaleString() : "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Pause :</strong> {contrat.pause} min
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Employer :</strong> {contrat.utilisateur.map(u => u.nom).join(", ")}
      </p>
    </div>
  );
};

export default ContratCard;
