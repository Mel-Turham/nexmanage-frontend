"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Utilisateur } from "@/types";

// interface Employee {
//   id: number;
//   name: string;
//   initials: string;
// }

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (employee: Utilisateur) => void;
}

// export interface Utilisateur {
//   idUtilisateur: string;
//   nom: string;
//   email?: string;
//   motDePasse: string;
//   telephone: string;
//   role: Role;
//   isActif: boolean;
//   dateCreation: Date;
//   update_at: Date;
//   delete_at: Date;
//   entreprise: Entreprise[];
// }
const employees: Utilisateur[] = [];

export default function NewChatModal({
  isOpen,
  onClose,
  onSelect,
}: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Dialog.Panel className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Nouveau message
          </Dialog.Title>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {employees.map((emp) => (
            <button
              key={emp.idUtilisateur}
              onClick={() => {
                onSelect(emp);
                onClose();
              }}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              {/* <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
                {emp.initials}
              </div> */}
              <span className="text-sm font-medium text-gray-800">
                {emp.nom}
              </span>
            </button>
          ))}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
