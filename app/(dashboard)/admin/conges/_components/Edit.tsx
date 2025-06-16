"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { DemandeConge } from "@/types/demande";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditDemandeConge({ demande }: { demande: DemandeConge }) {
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    motif: "",
    statut: "",
    justificationRefus: ""
  });

  useEffect(() => {
    if (demande) {
      setFormData({
        dateDebut: demande.dateDebut || "",
        dateFin: demande.dateFin || "",
        motif: demande.motif || "",
        statut: demande.statut || "",
        justificationRefus: demande.justificationRefus || ""
      });
    }
  }, [demande]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission ici
    console.log("Données modifiées:", formData);
  };

  return (
    <DialogContent className="max-w-md rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Modifier la demande de congé</DialogTitle>
        <DialogDescription className="text-gray-500">
          Modifiez les informations ci-dessous
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="dateDebut">Date de début</Label>
            <Input
              id="dateDebut"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              type="date" label={""}            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFin">Date de fin</Label>
            <Input
              id="dateFin"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
              type="date" label={""}            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif">Motif</Label>
            <Input
              id="motif"
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              type="text"
              placeholder="Raison du congé" label={""}            />
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select 
              value={formData.statut} 
              onValueChange={value => setFormData({...formData, statut: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Acceptée">Acceptée</SelectItem>
                <SelectItem value="Refusée">Refusée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.statut === "Refusée" && (
            <div className="space-y-2">
              <Label htmlFor="justificationRefus">Justification du refus</Label>
              <Input
                id="justificationRefus"
                name="justificationRefus"
                value={formData.justificationRefus}
                onChange={handleChange}
                type="text"
                placeholder="Raison du refus" label={""}              />
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <Button type="submit" className="bg-bleu px-6">
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}