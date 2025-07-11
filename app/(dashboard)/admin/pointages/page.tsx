"use client";

import { useState } from "react";
import Image from "next/image";
import TableEmployes from "@/components/presence/list-employes";
import { Contrat, Role, StatutContrat } from "@/types";
import {
  ChevronDownCircle,
  ChevronRightCircle,
} from "lucide-react";

// const bgAvatarColors = {
//   bgAvatarLB: "bg-[#FF5733]", // Example color for Loic Bryan
//   bgAvatarJD: "bg-[#e91e63]", // Example color for John Doe
//   bgAvatarLN: "bg-[#00bcd4]", // Example color for Lisa Nguyen
//   bgAvatarMM: "bg-[#ff9800]", // Example color for Mark Miller
//   bgAvatarAG: "bg-[#4caf50]", // Example color for Alice Green
// };

const contrats: Contrat[] = [
  {
    id: "c1",
    lieu: { coordinates: [3.848, 11.5021] },
    dateDebut: new Date("2025-07-01T08:00:00"),
    dateFin: new Date("2025-07-01T17:00:00"),
    description: "Contrat de maintenance des équipements",
    pause: 60,
    utilisateur: [
      {
        idUtilisateur: "u1",
        nom: "Alice Dupont",
        email: "alice.dupont@example.com",
        motDePasse: "hashedpwd1",
        telephone: "+237 690 123 456",
        role: Role.EMPLOYE,
        isActif: true,
        entreprise: [],
      },
    ],
    taches: [],
    estGabarit: false,
    dateCreation: new Date("2025-06-20T00:00:00"),
    statut: StatutContrat.EN_COURS,
  },
  {
    id: "c2",
    lieu: { coordinates: [3.879, 11.521] },
    dateDebut: new Date("2025-07-05T09:00:00"),
    dateFin: new Date("2025-07-05T18:00:00"),
    description: "Installation réseau dans les bureaux",
    pause: 45,
    utilisateur: [
      {
        idUtilisateur: "u2",
        nom: "Bob Martin",
        email: "bob.martin@example.com",
        motDePasse: "hashedpwd2",
        telephone: "+237 691 234 567",
        role: Role.MANAGER,
        isActif: true,
        entreprise: [],
      },
    ],
    taches: [],
    estGabarit: false,
    dateCreation: new Date("2025-06-22T00:00:00"),
    statut: StatutContrat.EN_ATTENTE,
  },
  {
    id: "c3",
    lieu: { coordinates: [3.86, 11.51] },
    dateDebut: new Date("2025-07-10T07:30:00"),
    dateFin: new Date("2025-07-10T16:30:00"),
    description: "Audit de sécurité informatique",
    pause: 30,
    utilisateur: [
      {
        idUtilisateur: "u3",
        nom: "Claire Bernard",
        email: "claire.bernard@example.com",
        motDePasse: "hashedpwd3",
        telephone: "+237 692 345 678",
        role: Role.EMPLOYE,
        isActif: true,
        entreprise: [],
      },
    ],
    taches: [],
    estGabarit: false,
    dateCreation: new Date("2025-06-25T00:00:00"),
    statut: StatutContrat.TERMINE,
  },
];

function getInitials(nom: string): string {
  if (!nom) return "";
  // On enlève les espaces, on prend les deux premières lettres, et on les met en majuscule
  return nom
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Helper function to get Tailwind classes for status badges
const getStatusClasses = (statusType: string) => {
  switch (statusType) {
    case "EN_ATTENTE":
      return "bg-[#D7EDFF] text-[#0063A6]";
    case "EN_COURS":
      return "bg-[#FFF5C5] text-[#FFA500]";
    case "TERMINEE":
      return "bg-[#D8FFD7] text-[#06CD06]";
    case "arrivee-tardive":
      return "bg-[#FFDDDD] text-[#FF2323]";
    default:
      return "";
  }
};

export default function PointagePage() {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [pointageMode, setPointageMode] = useState<"debut" | "fin">("debut");

  const toggleContract = (id: string) => {
    setSelectedContractId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="flex-grow flex flex-col">
      <section className="flex-grow bg-backgroundLight">
        <div className="bg-cardBackground rounded-xl shadow-custom-light p-6 flex flex-col h-[87vh] justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex flex-row w-fit gap-2">
                <div className="flex items-center justify-center bg-bleu-ciel rounded-full p-3">
                  <Image
                    src={"/labor.svg"}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="h-8 w-8"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-black2 font-urbanist font-semibold 2xl:text-2xl xl:text-xl">
                    Employés
                  </h1>
                  <span className="text-gray-400 font-urbanist font-medium xl:text-sm 2xl:text-base">
                    01 / 04 / 2025
                  </span>
                </div>
              </div>
              {/* <div>
                <div className="flex flex-row items-center px-2 rounded-md border border-gray w-full focus-within:shadow-md focus-within:border-blue-500 transition-all duration-200">
                  <Search01Icon color="#e5e5e5" size={24} />
                  <input
                    type="search"
                    name="search"
                    placeholder="Recherche un employer"
                    className="py-2 px-4 w-full outline-none"
                  />
                </div>
              </div> */}
            </div>
            {/* Table Container */}
            <div className="overflow-x-auto mt-5 px-2 border rounded-xl">
              <table className="w-full border-separate border-spacing-y-2 min-w-[700px]">
                <thead className="bg-bleu-ciel text-black">
                  <tr>
                    <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase rounded-l-lg">
                      Contrat
                    </th>
                    <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase">
                      Employer
                    </th>
                    <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase">
                      Lieu
                    </th>
                    <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase">
                      Heure
                    </th>
                    <th className="bg-light text-left py-3 px-4 font-medium text-sm uppercase rounded-r-lg">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contrats.map((contract) => (
                    <>
                      <tr
                        key={contract.id}
                        className="bg-cardBackground shadow-custom-row transition-all duration-200 cursor-pointer hover:bg-blue-50/50"
                        onClick={() => toggleContract(contract.id)}
                      >
                        <td className="px-4 text-textColor text-sm rounded-l-lg border-b-0">
                          <div className=" flex flex-row items-center gap-2 justify-start h-full">
                            {selectedContractId === contract.id ? (
                              <ChevronDownCircle />
                            ) : (
                              <ChevronRightCircle />
                            )}
                            <span className="font-medium">
                              {contract.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-textColor text-sm border-b-0">
                          <div className="flex items-center employee-avatars">
                            <div className="flex items-center employee-avatars">
                              {contract.utilisateur
                                .slice(0, 3)
                                .map((emp, idx) => (
                                  <span
                                    key={idx}
                                    // Dynamically apply classes based on index for the first three avatars
                                    className={`w-10 h-10 rounded-full flex justify-center items-center text-xs font-semibold relative
                            ${
                              idx === 0
                                ? "bg-[#F9F6FE] border-[#783CC8] text-[#783CC8]"
                                : ""
                            }
                            ${
                              idx === 1
                                ? "bg-[#FFF4ED] border-[#FB7A40] text-[#FB7A40] right-2"
                                : ""
                            }
                            ${
                              idx === 2
                                ? "bg-[#EFFEF0] border-[#58EE6B] text-[#58EE6B] right-4"
                                : ""
                            }
                            border-2 z-10`}
                                  >
                                    {getInitials(emp.nom)}
                                  </span>
                                ))}
                              {contract.utilisateur.length > 3 && (
                                <span
                                  className="w-10 h-10 rounded-full flex justify-center items-center text-xs font-semibold
                       bg-[#283143] border-[#ffffff] text-[#ffffff] border-2 z-20 ml-1 relative right-8"
                                >
                                  +{contract.utilisateur.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-textColor text-sm border-b-0">
                          {contract.lieu.coordinates[0].toFixed(3)}
                        </td>
                        <td className="py-3 px-4 text-textColor text-sm border-b-0">
                          {contract.dateDebut?.toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 text-textColor text-sm rounded-r-lg border-b-0">
                          <span
                            className={`inline-block py-1.5 px-2.5 rounded-sm text-xs font-semibold whitespace-nowrap ${getStatusClasses(
                              contract.statut
                            )}`}
                          >
                            {contract.statut}
                          </span>
                        </td>
                      </tr>
                      <>
                        {selectedContractId === contract.id && (
                          <tr>
                            <td colSpan={5}>
                              <TableEmployes
                                employes={contract.utilisateur.map((u) => ({
                                  ...u,
                                  heureArrivee: new Date(
                                    contract.dateDebut!.getTime() +
                                      Math.random() * 30 * 60000
                                  ), // exemple aléatoire
                                  heureDepart: new Date(
                                    contract.dateFin!.getTime() +
                                      (Math.random() - 0.5) * 60 * 60000
                                  ),
                                }))}
                                mode={pointageMode}
                                onModeChange={setPointageMode}
                                heureDebutContrat={contract.dateDebut!}
                                heureFinContrat={contract.dateFin!}
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="flex justify-between items-center mt-5 pt-4 flex-wrap gap-3">
            <button className="bg-light text-textColor border border-borderColor py-2 px-4 rounded-lg cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-200 hover:border-gray-300">
              Précédent
            </button>
            <span className="text-sm text-secondary">Page 1 sur 1</span>
            <button className="bg-light text-textColor border border-borderColor py-2 px-4 rounded-lg cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-200 hover:border-gray-300">
              Suivant
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
