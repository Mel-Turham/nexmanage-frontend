"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function CreerDemandeCongePage() {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [multiDays, setMultiDays] = useState(false);
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const employees = Array(6).fill({ name: "Jason Kitio", role: "Poste" });

  return (
    <div className=" flex items-center justify-between px-10 py-6">
      <div className="w-full max-w-lg ">
        <button
          onClick={() => router.push("/demandes")}
          className="text-sm text-gray-500 mb-14 "
        >
          ← Retour
        </button>

        <h1 className="text-2xl font-semibold">Créer une demande de congé</h1>
        <p className="text-sm italic text-gray-500 mb-4">
          {selectedEmployee ? selectedEmployee : "Aucun employé sélectionné"}
        </p>

        {/* Bouton Sélectionner un employé */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-100 text-blue-900 font-medium rounded-full px-5 py-2 mb-6">
              Sélectionner un employé
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-gradient-to-br from-white to-blue-100 rounded-xl p-6">
            <DialogHeader>
              <DialogTitle>Sélectionner un employé</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Recherche par nom"
              className="rounded-full mb-4"
            />
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {employees.map((emp, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedEmployee(emp.name)}
                  className="w-full flex items-center gap-4 px-4 py-3 bg-white rounded-md shadow-sm hover:bg-blue-50"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-900">
                    {emp.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Durée */}
        <div className="mb-6">
          <Label className="text-base font-medium">Durer</Label>
          <div className="flex items-center gap-3 mt-2 text-bleu">
            <Switch
              checked={!multiDays}
              onCheckedChange={() => setMultiDays(!multiDays)}
            />
            <span className="text-sm text-gray-700">
              Toute la journée (heure ouvrable)
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={multiDays}
              onChange={(e) => setMultiDays(e.target.checked)}
              className="accent-blue-500"
              id="multiDaysCheckbox"
              title="Activer la sélection sur plusieurs jours"
            />
            <Label htmlFor="multiDaysCheckbox" className="text-sm">
              Plusieurs jours
            </Label>
          </div>

          <Label className="block text-sm mb-1">Date</Label>
          <Input
            type="date"
            className="rounded-full mb-4"
            placeholder="Entrer la date"
          />

          <Label className="block text-sm mb-1">Note</Label>
          <Textarea placeholder="Écrire ici..." className="min-h-[120px]" />
        </div>

        <Button className="rounded-full bg-blue-800 text-white hover:bg-blue-900 px-6">
          Sauvegarder
        </Button>
      </div>

      {/* Illustration */}
      <div className="hidden md:block">
        <Image
          src="/illustration/demandes-conge.svg"
          alt="Illustration demandes de congé"
          width={450}
          height={400}
        />
      </div>
    </div>
  );
}
