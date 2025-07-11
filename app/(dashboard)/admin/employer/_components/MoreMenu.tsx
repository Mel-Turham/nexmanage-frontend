// app/(dashboard)/employes/_components/MoreMenu.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, Eye } from "lucide-react";
import Link from "next/link"; // Importez Link de next/link
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Employer } from "@/types/employer";
import Supprimer from "./supprimer";

// Fonction utilitaire pour générer des slugs (doit être la même que dans [slug]/page.tsx)
// Pour une meilleure gestion des caractères spéciaux (français, etc.),
// envisagez d'utiliser une bibliothèque comme 'slugify' et de la placer dans un fichier utils partagé.
// import slugify from 'slugify';
// const generateSlug = (name: string) => slugify(name, { lower: true, strict: true, locale: 'fr' });
// const generateSlug = (name: string): string => {
//   if (!name) return "default-slug";
//   return name
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w-]+/g, "");
// };

interface MoreMenuProps {
  employer: Employer;
  // onView n'est plus nécessaire car nous utilisons Link
  // onEdit et onDelete peuvent être conservés si ce sont des actions directes
  // ou s'ils ouvrent des modales/dialogues comme actuellement.
}

export function MoreMenu({ employer }: MoreMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Pas besoin d'états séparés pour les Dialog si DialogTrigger est bien utilisé avec DropdownMenuItem

  // const employerSlug = generateSlug(employer.name);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Actions menu">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {" "}
        {/* Légèrement élargi pour un meilleur affichage */}
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          {/* L'option "Afficher" devient un lien */}
          <Link
            href={`/admin/employer/${employer.id}`}
            // href={`/admin/employer/${employerSlug}`}
            passHref
            legacyBehavior
          >
            <DropdownMenuItem asChild className="cursor-pointer">
              {/* Enveloppez le contenu dans un <a> ou un <Button> si nécessaire pour le style/comportement */}
              <div className="flex items-center w-full px-2 py-1.5 text-sm">
                {" "}
                {/* Classes similaires à un bouton de Dropdown */}
                <Eye className="mr-2 h-4 w-4 text-gray-600" />{" "}
                {/* Couleur pour l'icône */}
                Afficher les détails
              </div>
            </DropdownMenuItem>
          </Link>

          {/* Modifier le profil - utilise Dialog */}
          {/* <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()} // Empêche la fermeture du dropdown
                className="cursor-pointer flex items-center"
              >
                <Edit className="mr-2 h-4 w-4 text-gray-600" />
                Modifier le profil
              </DropdownMenuItem>
            </DialogTrigger>
          </Dialog> */}

          <DropdownMenuSeparator />

          {/* Supprimer - utilise Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()} // Empêche la fermeture du dropdown
                className="cursor-pointer flex items-center text-red-600 hover:!text-red-700" // Style pour suppression
              >
                <Trash className="mr-2 h-4 w-4" />{" "}
                {/* L'icône héritera de la couleur du texte */}
                {"Supprimer l'employé"}
              </DropdownMenuItem>
            </DialogTrigger>
            <Supprimer employer={employer} />
          </Dialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
