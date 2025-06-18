"use client";

// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
import DemandeCongeTable from "./_components/DemandeTableau";
import demandeConge from "@/data/DemandeConge.json";

export default function DemandesPage() {
  // const router = useRouter();

  // const handleCreateClick = () => {
  //   router.push("/admin/conges/create");
  // };

  return (
    // <main className="p-6 flex items-center justify-center h-full w-full">
    //   <div>
    //     <h1 className="text-3xl font-semibold text-Primaire">
    //       Demandes de congé
    //     </h1>
    //     <p className="text-gray-600 mt-2 mb-6 font-semibold">
    //       Votre solution au casse-tête des demandes de congé.
    //     </p>

    //     <ul className="space-y-4">
    //       {[
    //         "Les congés s'affichent directement dans le planificateur.",
    //         "Organisez l’horaire en fonction des employés disponibles.",
    //         "Les contrats en conflit avec des congés sont convertis en contrat réassignables.",
    //       ].map((texte, index) => (
    //         <li key={index} className="flex items-start gap-4">
    //           <div className="flex items-center justify-center w-15 h-15 rounded-full bg-bleu-ciel text-black2 font-bold">
    //             {index + 1}
    //           </div>
    //           <p className="text-gray-700 mt-2 w-[90%]">{texte}</p>
    //         </li>
    //       ))}
    //     </ul>

    //     <Button
    //       className="bg-blue-800 hover:bg-blue-700 text-white p-5 my-10 rounded-md w-fit"
    //       onClick={handleCreateClick}
    //     >
    //       Créer une demande
    //     </Button>
    //   </div>

    //   <div>
    //     <div className="w-full">
    //       <Image
    //         src="/svg/pana.svg"
    //         alt="Illustration demandes de congé"
    //         width={600}
    //         height={400}
    //         className="w-full h-auto"
    //       />
    //     </div>
    //   </div>
    // </main>
    <div className="h-full">
      <DemandeCongeTable
        demandes={demandeConge.map((demande) => ({
          ...demande,
          employe: {
            ...demande.employe,
            name: demande.employe.nom,
            Poste: demande.employe.poste,
          },
        }))}
      />
    </div>
  );
}
