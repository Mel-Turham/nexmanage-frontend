"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utilisateur } from "@/types";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: Utilisateur) => void;
  onCreateGroup: (groupName: string, members: Utilisateur[]) => void;
  utilisateurs: Utilisateur[]; // liste des utilisateurs disponibles
}

export default function NewChatModal({
  isOpen,
  onClose,
  onSelect,
  onCreateGroup,
  utilisateurs,
}: NewChatModalProps) {
  const [activeTab, setActiveTab] = useState<"single" | "group">("single");
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Utilisateur[]>([]);

  const toggleMember = (user: Utilisateur) => {
    if (selectedMembers.find((m) => m.idUtilisateur === user.idUtilisateur)) {
      setSelectedMembers(
        selectedMembers.filter((m) => m.idUtilisateur !== user.idUtilisateur)
      );
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      alert(
        "Veuillez saisir un nom de groupe et sélectionner au moins un membre."
      );
      return;
    }
    onCreateGroup(groupName.trim(), selectedMembers);
    setGroupName("");
    setSelectedMembers([]);
    onClose();
  };

  const handleSelectUser = () => {
    if (selectedUser) {
      onSelect(selectedUser);
      setSelectedUser(null);
      onClose();
    } else {
      alert("Veuillez sélectionner un utilisateur.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle discussion</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "single"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Nouvelle discussion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("group")}
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "group"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Nouveau groupe
          </button>
        </div>

        {/* Contenu onglets */}
        {activeTab === "single" && (
          <div>
            <p className="mb-2 font-medium">Sélectionnez un utilisateur :</p>
            <div className="max-h-60 overflow-y-auto border rounded p-2 mb-4">
              {utilisateurs.map((user) => (
                <div
                  key={user.idUtilisateur}
                  onClick={() => setSelectedUser(user)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedUser?.idUtilisateur === user.idUtilisateur
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  {user.nom} ({user.email || "sans email"})
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "group" && (
          <div>
            <label className="block mb-2 font-medium" htmlFor="groupName">
              Nom du groupe :
            </label>
            <Input
              id="groupName"
              placeholder="Nom du groupe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-4"
            />

            <p className="mb-2 font-medium">Sélectionnez les membres :</p>
            <div className="max-h-48 overflow-y-auto border rounded p-2 mb-4">
              {utilisateurs.map((user) => (
                <label
                  key={user.idUtilisateur}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.some(
                      (m) => m.idUtilisateur === user.idUtilisateur
                    )}
                    onChange={() => toggleMember(user)}
                  />
                  <span>
                    {user.nom} ({user.email || "sans email"})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-end gap-2 w-full">
          <Button variant="outline" onClick={onClose} className="w-fit">
            Annuler
          </Button>
          {activeTab === "single" ? (
            <Button onClick={handleSelectUser} className="w-fit px-10">
              Démarrer
            </Button>
          ) : (
            <Button onClick={handleCreateGroup} className="w-fit px-10">Créer le groupe</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
