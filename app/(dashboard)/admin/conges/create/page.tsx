"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"; // Ajout du composant modal
import { X } from "lucide-react";
import MarkdownEditor from "@/components/ui/markdown";
import { CalendarForm } from "@/components/CalendarForm";

const employees = Array(8).fill({ name: "Jason Kitio", position: "Poste" });

export default function CreerDemandeCongePage() {
  const router = useRouter();

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [multiDays, setMultiDays] = useState(false);
  const [allDay, setAllDay] = useState(true);
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6">
      <main className="max-w-7xl w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <section className="flex flex-col max-w-xl w-full space-y-6">
          <button
            className="flex items-center text-gray-900 text-sm font-normal gap-2"
            onClick={() => router.push("../conges")}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="#111827"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour
          </button>

          <h1 className="text-3xl font-semibold text-Primaire">
            Créer une demande de congé
          </h1>

          {selectedEmployee ? (
            <div className="flex items-center gap-4">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[#B9D3E8] text-[#1E293B] font-semibold text-sm">
                {selectedEmployee
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <p className="italic text-gray-900">{selectedEmployee}</p>
            </div>
          ) : (
            <p className="italic text-base text-gray-700">
              Aucun employé sélectionné
            </p>
          )}

          <Button
            onClick={() => setShowModal(true)}
            className="flex h-full items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none cursor-pointer w-fit text-white px-4"
          >
            Sélectionner un employé
          </Button>

          {/* Durée */}
          <div className="space-y-4">
            <h2 className="text-xl font-normal text-gray-900">Durée</h2>
            <label className="inline-flex items-center cursor-pointer gap-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={() => setAllDay(!allDay)}
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

          {/* Dates */}
          <div className="space-y-4">
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

          {/* Note */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="textarea" className="text-xs text-gray-700">
              Note
            </Label>
            <div>
              <MarkdownEditor />
            </div>
          </div>

          <Button className="w-max bg-blue-800 hover:bg-blue-700 text-white text-sm font-normal rounded-md px-6 py-3 mt-4">
            Sauvegarder
          </Button>
        </section>

        {/* Illustration */}
        <section className="flex flex-col max-w-xl w-full space-y-6">
          <Image
            src="/svg/demandes-conge.svg"
            alt="Illustration demandes de congé"
            width={600}
            height={600}
            className="w-full h-auto"
          />
        </section>
      </main>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg w-full rounded-2xl p-6 bg-gradient-to-b from-[#F1F9FF] to-[#DCEFFB] shadow-xl">
          <DialogHeader className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Sélectionner un employé
            </h2>
            <button onClick={() => setShowModal(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </DialogHeader>

          <Input
            type="text"
            placeholder="Recherche par nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full mb-4"
          />

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredEmployees.map((emp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedEmployee(emp.name);
                  setShowModal(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-left"
              >
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-[#B9D3E8] text-[#1E293B] text-sm font-semibold">
                  {emp.name
                    .split(" ")
                    .map((n: unknown[]) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.position}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
