// CustomMenu.jsx
"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Employer } from "@/types/employer";

export default function Supprimer({ employer }: { employer: Employer }) {
  const [name, setName] = useState(employer?.name || " azerty");
  const [email, setEmail] = useState(employer?.email || "");
  const [telephone, setTelephone] = useState(employer?.telephone || "");
  const [poste, setPoste] = useState(employer?.Poste || "");

  return (
    <DialogContent className="sm:max-w-[40vw] py-8 2xl:rounded-4xl">
      <DialogHeader>
        <DialogTitle className="text-center">{`Supprimer l'employer : ${name}`}</DialogTitle>
        <DialogDescription className="text-center">
          Êtes-vous sûr de vouloir supprimer cet employé ?
        </DialogDescription>
        <DialogDescription className="text-center">
          Cette action est irréversible et entraînera la suppression définitive
          de toutes les données associées à cet employé (présences, tâches,
          congés, etc.).
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex 2xl:justify-center xl:justify-center items-center">
        <Button
          type="submit"
          className="bg-bleu-ciel rounded-full text-black2 px-5 py-3 hover:bg-bleu-nuit text-lg"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-red-500 text-white rounded-full px-3 py-2 hover:bg-red-700"
        >
          Confirmer la suppression
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
