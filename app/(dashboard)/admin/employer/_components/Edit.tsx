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
import { Label } from "@/components/ui/label";
import { Employer } from "@/types/employer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditEmployer({ employer }: { employer: Employer }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    poste: ""
  });

  useEffect(() => {
    if (employer) {
      setFormData({
        name: employer.name || "",
        email: employer.email || "",
        telephone: employer.telephone || "",
        poste: employer.Poste || ""
      });
    }
  }, [employer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission ici
    console.log("Données modifiées:", formData);
  };

  const posteOptions = [
    "Tous les postes",
    "Poste 1",
    "Poste 2",
    "Éducation",
    "Santé",
    "Finance",
    "Retail",
    "Fabrication",
    "Autre"
  ];

  return (
    <DialogContent className="max-w-md rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Modifier le profil</DialogTitle>
        <DialogDescription className="text-gray-500">
          Modifiez les informations de l'employé
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Nom de l'employé" label={""}            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="email@exemple.com" label={""}            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              type="tel"
              placeholder="+33 6 12 34 56 78" label={""}            />
          </div>

          <div className="space-y-2">
            <Label>Poste</Label>
            <Select 
              value={formData.poste} 
              onValueChange={value => setFormData({...formData, poste: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un poste" />
              </SelectTrigger>
              <SelectContent>
                {posteOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button type="submit" className="px-6">
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}