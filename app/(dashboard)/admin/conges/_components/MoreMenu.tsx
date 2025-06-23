// app/(dashboard)/demandes/_components/MoreMenu.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import Link from "next/link";
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
import EditDemandeConge from "./Edit";
import SupprimerDemandeConge from "./supprimer";
import { DemandeConge } from "@/types/demande";

interface MoreMenuProps {
  demande: DemandeConge;
}

export function MoreMenu({ demande }: MoreMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Actions menu">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          {/* Afficher les détails */}
          <Link href={`./conges/${demande.idDemande}`} passHref legacyBehavior>
            <DropdownMenuItem asChild className="cursor-pointer">
              <div className="flex items-center w-full px-2 py-1.5 text-sm">
                <Eye className="mr-2 h-4 w-4 text-gray-600" />
                Afficher la demande
              </div>
            </DropdownMenuItem>
          </Link>

          {/* Modifier la demande */}
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer flex items-center"
              >
                <Edit className="mr-2 h-4 w-4 text-gray-600" />
                Modifier la demande
              </DropdownMenuItem>
            </DialogTrigger>
            <EditDemandeConge demande={demande} />
          </Dialog>

          <DropdownMenuSeparator />

          {/* Supprimer la demande */}
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer flex items-center text-red-600 hover:!text-red-700"
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer la demande
              </DropdownMenuItem>
            </DialogTrigger>
            <SupprimerDemandeConge demande={demande} />
          </Dialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MoreMenu;
