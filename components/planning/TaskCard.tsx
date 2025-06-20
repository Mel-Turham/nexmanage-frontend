// components/ContratCard.tsx
import React from "react";
import { Clock01Icon } from "hugeicons-react";
import { Tache, Contrat, StatutTache, Priorite } from "@/types"; // Importez StatutTache et Priorite

// Nouvelle interface pour ContratCard, directement liée à Contrat
interface ContratCardProps {
  contrat: Contrat;
}

// Re-définition de TaskItemProps pour correspondre à Tache, en utilisant les enums
interface TaskItemProps {
  tache: Tache;
}

const ContratCard: React.FC<ContratCardProps> = ({ contrat }) => {
  // Fonction utilitaire pour formater la durée en minutes en H/min
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours}H`;
    }
    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes}min`;
    }
    return result.trim();
  };

  // Récupérer l'adresse pour l'affichage, ou utiliser les coordonnées
  const displayLocation = (lieu: {
    coordinates: [number, number];
    adresse?: string;
  }) => {
    if (lieu.adresse) {
      return lieu.adresse;
    }
    return `Lat: ${lieu.coordinates[0].toFixed(
      2
    )}, Lon: ${lieu.coordinates[1].toFixed(2)}`;
  };

  return (
    <div className="bg-bleu-ciel p-3 rounded-xl max-w-[325px]">
      <div className="bg-white p-3 rounded-md h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {displayLocation(contrat.lieu)}
          </h3>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {contrat.taches.length === 0 ? (
            <p className="text-gray-500 text-center text-sm py-4">
              Aucune tâche pour ce contrat.
            </p>
          ) : (
            contrat.taches.map((tache) => (
              <TaskItem key={tache.id} tache={tache} />
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <p>Début: {contrat.dateDebut.toLocaleDateString("fr-FR")}</p>
          <p>Fin: {contrat.dateFin.toLocaleDateString("fr-FR")}</p>
          {contrat.description && <p>Description: {contrat.description}</p>}
          <p>Pause: {formatDuration(contrat.pause)}</p>
          {contrat.estGabarit && contrat.nomGabarit && (
            <p>Gabarit: {contrat.nomGabarit}</p>
          )}
          <p>Associés: {contrat.utilisateur.map((u) => u.nom).join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

const TaskItem: React.FC<TaskItemProps> = ({ tache }) => {
  // Mapping des statuts aux classes Tailwind
  const statusClasses = {
    [StatutTache.EN_ATTENTE]: "bg-yellow-100 text-yellow-800",
    [StatutTache.EN_COURS]: "bg-blue-100 text-blue-800",
    [StatutTache.TERMINEE]: "bg-green-100 text-green-800",
  };

  // Mapping des priorités aux classes Tailwind
  const priorityClasses = {
    [Priorite.BASSE]: "border-gray-500 text-gray-500",
    [Priorite.MOYENNE]: "border-blue-500 text-blue-500",
    [Priorite.HAUTE]: "border-red-500 text-red-500",
  };

  // Fonction utilitaire pour formater la durée de la tâche
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours}H`;
    }
    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes}min`;
    }
    return result.trim();
  };

  const isCompleted = tache.statut === StatutTache.TERMINEE;

  return (
    <div className="bg-bleu-ciel rounded-lg p-3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusClasses[tache.statut]
          }`}
        >
          {tache.statut
            .replace("_", " ")
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>

        {/* Priority Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            priorityClasses[tache.priorite]
          }`}
        >
          {tache.priorite.charAt(0).toUpperCase() +
            tache.priorite.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Checkbox (dépend du statut TERMINEE) */}
        <input
          type="checkbox"
          checked={isCompleted}
          readOnly
          className={`form-checkbox h-5 w-5 text-blue-600 rounded
            ${isCompleted ? "bg-blue-600 border-blue-600" : "border-gray-300"}
            focus:ring-blue-500 focus:ring-opacity-50`}
        />
        {/* Task Title */}
        <p
          className={`text-sm font-medium ${
            isCompleted ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {tache.titre}
        </p>
      </div>

      <div className="flex items-center gap-1 text-gray-600 text-sm">
        <Clock01Icon size={16} className="text-gray-500" />
        <span>{formatDuration(tache.TimeEstimated)}</span>
      </div>
    </div>
  );
};

export default ContratCard;
