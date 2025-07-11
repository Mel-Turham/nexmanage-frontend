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
import { Label } from "@/components/ui/label";
import { CalendarForm } from "@/components/CalendarForm";
import { Textarea } from "@/components/ui/textarea";

export default function CreerDemande() {
  const [multiDays, setMultiDays] = useState(false);
  const [allDay, setAllDay] = useState(true);
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    motif: "",
    statut: "",
    justificationRefus: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission ici
    console.log("Données modifiées:", formData);
  };

  return (
    <DialogContent className="max-w-md rounded-2xl max-h-[75vh] overflow-y-auto no-scrollbar">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Creer la demande de congé
        </DialogTitle>
        <DialogDescription className="text-gray-500">
          Modifiez les informations ci-dessous
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-3 py-4">
          {/* Durée */}
          <div className="space-y-4">
            <h2 className="text-xl font-normal text-gray-900">Durée</h2>
            <label className="inline-flex items-center cursor-pointer gap-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => {
                    setAllDay(!allDay);
                    handleChange(e);
                  }}
                  // onChange={() => setAllDay(!allDay)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-800 transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-5 transition-transform" />
              </div>
              <span className="text-sm text-gray-900">
                Toute la journée (heure ouvrable)
              </span>
            </label>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-normal text-gray-900">Date</h2>

            <label className="inline-flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                checked={multiDays}
                onChange={() => setMultiDays(!multiDays)}
              />
              Plusieurs jours
            </label>

            {multiDays ? (
              <div className="flex gap-6">
                <div className="flex flex-col gap-1 w-1/2">
                  <Label htmlFor="date-debut">Du</Label>
                  <CalendarForm />
                  {/* <Input
                                type="date"
                                id="date-debut"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-full"
                              /> */}
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <Label htmlFor="date-fin">Au</Label>
                  <CalendarForm />
                  {/* <Input
                                type="date"
                                id="date-fin"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-full"
                              /> */}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Label htmlFor="date-input">Date</Label>
                {/* <Input
                              type="date"
                              id="date-input"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="py-4 px-3 pr-10 border focus:border-[#344EA2] transition-all duration-200"
                            /> */}
                <CalendarForm />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif">Motif</Label>
            <Textarea
              id="motif"
              name="motif"
              value={formData.motif}
              className="border rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              //   onChange={handleChange}
              //   type="text"
              placeholder="Raison du congé"
              //   label={""}
            />
          </div>
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
