// SupprimerDemandeConge.jsx
"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DemandeConge } from "@/types/demande";

export default function SupprimerDemandeConge({ demande }: { demande: DemandeConge }) {
  const [employeName] = useState(demande?.employe?.name || "Employé inconnu");
  const [idDemande] = useState(demande?.idDemande || "N/A");

  return (
    <DialogContent className="sm:max-w-[40vw] py-8 2xl:rounded-4xl">
      <DialogHeader>
        <DialogTitle className="text-center">
          {`Supprimer la demande n°${idDemande} de ${employeName}`}
        </DialogTitle>
        <DialogDescription className="text-center">
          Êtes-vous sûr de vouloir supprimer cette demande de congé ?
        </DialogDescription>
        <DialogDescription className="text-center">
          Cette action est irréversible et entraînera la suppression définitive
          de toutes les données associées à cette demande.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex 2xl:justify-center xl:justify-center items-center gap-4">
        <Button
          type="button"
          className="bg-bleu-ciel rounded-full text-black2 px-5 py-3 hover:bg-bleu-nuit text-lg"
          // Vous pouvez ajouter un handler pour fermer la modale ici
        >
          Annuler
        </Button>
        <Button
          type="button"
          className="bg-red-500 text-white rounded-full px-3 py-2 hover:bg-red-700"
          // Ajouter ici la logique de suppression
        >
          Confirmer la suppression
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
