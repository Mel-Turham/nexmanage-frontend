import React from "react";
import { Utilisateur } from "@/types";

interface Props {
  employes: (Utilisateur & {
    heureArrivee: Date;
    heureDepart: Date;
  })[];
  mode: "debut" | "fin";
  onModeChange: (mode: "debut" | "fin") => void;
  heureDebutContrat: Date;
  heureFinContrat: Date;
}

function getObservation(
  heureArrivee: Date,
  heureDepart: Date,
  heureDebutContrat: Date,
  heureFinContrat: Date
): string {
  let observation = "";

  if (heureArrivee > heureDebutContrat) {
    observation = "En retard";
  } else if (heureArrivee.getTime() === heureDebutContrat.getTime()) {
    observation = "Arrivé à l'heure";
  } else {
    observation = "Arrivé en avance";
  }

  if (heureDepart > heureFinContrat) {
    observation += " / Heures sup";
  } else if (heureDepart.getTime() === heureFinContrat.getTime()) {
    observation += " / Parti à l'heure";
  } else {
    observation += " / Parti en avance";
  }

  return observation;
}

function getObservationClasses(observation: string): string {
  switch (true) {
    case observation.includes("En retard"):
      return "bg-[#FFDDDD] text-[#FF2323]"; // rouge clair / rouge foncé
    case observation.includes("Arrivé à l'heure"):
      return "bg-[#D7EDFF] text-[#0063A6]"; // bleu clair / bleu foncé
    case observation.includes("Arrivé en avance"):
      return "bg-[#FFF5C5] text-[#FFA500]"; // jaune clair / orange
    case observation.includes("Heures sup"):
      return "bg-[#D8FFD7] text-[#06CD06]"; // vert clair / vert foncé
    case observation.includes("Parti en avance"):
      return "bg-[#FFDDDD] text-[#FF2323]"; // rose clair / violet
    case observation.includes("Parti à l'heure"):
      return "bg-[#E0FFFF] text-[#20B2AA]"; // cyan clair / teal
    default:
      return "bg-gray-200 text-gray-700"; // neutre
  }
}

export default function TableEmployes({
  employes,
  mode,
  onModeChange,
  heureDebutContrat,
  heureFinContrat,
}: Props) {
  return (
    <div className="pl-4">
      {/* Boutons mode */}
      <div className="flex justify-end items-center">
        {/* <h2 className="font-semibold text-lg">Détails des employés</h2> */}
        <div className="space-x-2 mb-2">
          <button
            className={`px-3 py-1 text-sm rounded ${
              mode === "debut" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => onModeChange("debut")}
          >
            Début
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${
              mode === "fin" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => onModeChange("fin")}
          >
            Fin
          </button>
        </div>
      </div>

      {/* Tableau */}

      <div className="overflow-x-auto px-2 border rounded-xl">
        <table className="w-full border-separate border-spacing-y-2 min-w-[700px]">
          <thead className="bg-bleu-ciel text-black">
            <tr>
              <th className="bg-light text-left py-2 px-4 font-medium text-sm uppercase rounded-l-lg">
                Employé
              </th>
              <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase">
                Téléphone
              </th>
              <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase">
                Email
              </th>
              <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase">
                Heure
              </th>
              <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase rounded-r-lg">
                Observation
              </th>
            </tr>
          </thead>
          <tbody>
            {employes.map((e) => {
              const observation = getObservation(
                e.heureArrivee,
                e.heureDepart,
                heureDebutContrat,
                heureFinContrat
              );

              // Afficher la partie correspondant au mode sélectionné
              const observationToShow =
                mode === "debut"
                  ? observation.split("/")[0].trim()
                  : observation.split("/")[1]?.trim() || "";

              return (
                <tr
                  key={e.idUtilisateur}
                  className="bg-cardBackground shadow-custom-row transition-all duration-200 cursor-pointer hover:bg-blue-50/50"
                >
                  <td className="px-4 text-textColor text-sm rounded-l-lg border-b-0">
                    {e.nom}
                  </td>
                  <td className="py-3 px-4 text-textColor text-sm border-b-0">
                    {e.telephone}
                  </td>
                  <td>{e.email}</td>
                  <td className="py-3 px-4 text-textColor text-sm border-b-0">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200">
                      {mode === "debut"
                        ? e.heureArrivee.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : e.heureDepart.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-textColor text-sm rounded-r-lg border-b-0">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getObservationClasses(
                        observationToShow
                      )}`}
                    >
                      {observationToShow}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
