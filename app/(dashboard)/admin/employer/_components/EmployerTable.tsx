// app/(dashboard)/admin/employer/_components/EmployerTable.tsx

"use client";

import React from "react";

import { Employer } from "@/types/employer";
// import { Input } from "@/components/ui/input";
import Image from "next/image";
// import { CirclePlus, Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import InviterEmployer from "./invite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListEmployer from "./listEmployer";
import ListInviter from "./list-inviter";

interface EmployerProps {
  employers: Employer[];
}

export default function EmployerTable({ employers }: EmployerProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-row w-fit gap-2">
          <div className="flex items-center justify-center bg-bleu-ciel rounded-full p-3">
            <Image
              src={"/labor.svg"}
              alt="Logo"
              width={100}
              height={100}
              className="h-8 w-8"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-black2 font-urbanist font-semibold 2xl:text-2xl xl:text-xl">
              Employés
            </h1>
            <span className="text-gray-400 font-urbanist font-medium xl:text-sm 2xl:text-base">
              01 / 04 / 2025
            </span>
          </div>
        </div>

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
          <InviteEmployer />
        </Dialog> */}
        <Dialog>
          <form>
            <InviterEmployer triggerType="button" />
          </form>
        </Dialog>
      </div>

      <div className="flex flex-row w-full gap-4">
        {/* filtre */}
        <div className="flex flex-row w-full gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Trier par nom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nomAZ">Nom ( A - Z )</SelectItem>
              <SelectItem value="nomZA">Nom ( Z - A )</SelectItem>
              <SelectItem value="ASC">Date Creation (Asc)</SelectItem>
              <SelectItem value="Desc">Date Creation (Desc)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* <div>
          {/* Barre de recherche globale 
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 py-2 xl:w-sm 2xl:w-xl 2xl:border-0 focus-visible:border-0"
            />
          </div>
        </div> */}
      </div>
      <Tabs defaultValue="Employer" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="Employer">Employer</TabsTrigger>
          <TabsTrigger value="Inviter">Inviter</TabsTrigger>
        </TabsList>
        <TabsContent value="Employer">
          <ListEmployer employers={employers} />
        </TabsContent>
        <TabsContent value="Inviter">
          <ListInviter employers={employers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
