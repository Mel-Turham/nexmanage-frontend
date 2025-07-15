"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { DemandeConge } from "@/types/demande";
// import { MoreMenu } from "@/app/(dashboard)/demandes/_components/MoreMenu";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import Image from "next/image";
// import { CirclePlus, Search } from "lucide-react";
import MoreMenu from "./MoreMenu";
import { CirclePlus } from "lucide-react";
import CreerDemande from "./creer-demande";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DemandeCongeTableProps {
  demandes: DemandeConge[] | null; // Permet null
}

export default function DemandeCongeTable({
  demandes,
}: DemandeCongeTableProps) {
  const [sorting, setSorting] = React.useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  // const [pageSize, setPageSize] = React.useState(10);

  // Colonnes du tableau
  const columns = React.useMemo<ColumnDef<DemandeConge>[]>(
    () => [
      {
        accessorKey: "idDemande",
        header: "#",
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 60,
      },
      {
        accessorFn: (row) =>
          `${row.employe.name}${
            row.employe.role ? ` (${row.employe.role})` : ""
          }`,
        id: "employe",
        header: "Employé nom",
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 180,
      },
      {
        accessorKey: "dateDebut",
        header: "Début",
        cell: (info) => {
          const value = info.getValue();
          return value
            ? new Date(value as string).toLocaleDateString("fr-FR")
            : "N/A";
        },
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: "dateFin",
        header: "Fin",
        cell: (info) => {
          const value = info.getValue();
          return value
            ? new Date(value as string).toLocaleDateString("fr-FR")
            : "N/A";
        },
        enableSorting: true,
        size: 140,
      },
      {
        accessorKey: "duration",
        header: "Durée",
        cell: (info) => info.getValue() || "N/A",
        enableSorting: false,
        size: 100,
      },
      {
        accessorKey: "statut",
        header: "État",
        cell: (info) => {
          const statut = info.getValue() as string;
          let bgColor = "";
          let textColor = "";
          let iconClass = "";

          switch (statut.toLowerCase()) {
            case "refusée":
            case "refuser":
              bgColor = "bg-[#FFD6D6]";
              textColor = "text-[#FF4D4D]";
              iconClass = "fas fa-times-circle";
              break;
            case "en attente":
              bgColor = "bg-[#FFEDB8]";
              textColor = "text-[#EAAA00]";
              iconClass = "fas fa-clock";
              break;
            case "approuvée":
            case "approuver":
              bgColor = "bg-[#D6FFD6]";
              textColor = "text-[#00B800]";
              iconClass = "fas fa-check-circle";
              break;
            default:
              bgColor = "bg-gray-200";
              textColor = "text-gray-700";
              iconClass = "fas fa-info-circle";
          }

          return (
            <span
              className={`inline-flex items-center space-x-2 ${bgColor} ${textColor} rounded-full px-3 py-1 text-sm font-medium select-none`}
            >
              <i className={`${iconClass}`}></i>
              <span>{statut}</span>
            </span>
          );
        },
        enableSorting: true,
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <MoreMenu demande={row.original} />,
        size: 60,
      },
    ],
    []
  );

  // Correction : Utiliser un tableau vide si demandes est null/undefined
  const data = React.useMemo(() => demandes || [], [demandes]);

  // Création du tableau avec react-table
  const table = useReactTable({
    data, // Utilisation du tableau sécurisé
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Date dynamique pour l'en-tête
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white text-[#1E2A38] flex flex-col p-6 h-full w-full">
      {/* Header */}
      {/* <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"> */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex flex-row w-fit gap-2 items-center ">
          <div className="flex items-center justify-center bg-bleu-ciel rounded-full p-3">
            <Image
              src="/illustration/work-history.svg"
              alt="Icone congé"
              width={100}
              height={100}
              draggable={false}
              className="w-8 h-8"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-5">Congé</h1>
            <p className="text-xs text-[#6B7A8F] mt-0.5">{currentDate}</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Button
                className="bg-[#3759B8] text-white rounded-md px-8 py-2 flex items-center space-x-2 text-sm font-medium select-none"
                // onClick={() => alert("Créer une nouvelle demande")}
              >
                <span>Créer</span>
                <CirclePlus className="w-4 h-4" />
              </Button>
            </div>
          </DialogTrigger>
          <CreerDemande />
        </Dialog>
      </header>

      {/* Filtres */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6 space-y-3 sm:space-y-0 w-full ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0 ">
          <div className="flex flex-row w-full gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filtres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nomAZ">Nom ( A - Z )</SelectItem>
                <SelectItem value="Duree">Duree</SelectItem>
                <SelectItem value="Debut">Date de debut </SelectItem>
                <SelectItem value="Fin">Date de fin </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row w-fit gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN_ATTENTE">EN ATTENTE</SelectItem>
                <SelectItem value="ACCEPTE">ACCEPTE</SelectItem>
                <SelectItem value="REFUSE">REFUSE</SelectItem>
                <SelectItem value="EXPIRER">EXPIRER</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* <div className="w-full md:w-40%  ml-auto">
          <label htmlFor="search" className="sr-only">
            Rechercher
          </label>
          <div className="flex flex-row items-center px-2 rounded-md border border-gray w-full focus-within:shadow-md focus-within:border-blue-500 transition-all duration-200">
            <Search01Icon color="#e5e5e5" size={24} />
            <input
              type="search"
              name="search"
              placeholder="Rechercher"
              className="py-2 px-4 w-full outline-none"
            />
          </div>
        </div> */}
      </section>

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col p-2 border border-bleu-ciel rounded-4xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-bleu-ciel">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    // Ajout des classes arrondies selon la colonne
                    let thClass = "py-2 px-4 cursor-pointer select-none";

                    if (header.column.id === "idDemande") {
                      thClass += " rounded-l-full";
                    } else if (header.column.id === "actions") {
                      thClass += " rounded-r-full";
                    }

                    return (
                      <th
                        key={header.id}
                        className={thClass}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center">
                    <div className="flex justify-center items-center w-full">
                      <Image
                        src={"/illustration/rafiki.svg"}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="h-[50vh] w-full"
                      />
                    </div>
                    Aucun résultat.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-b-0 hover:bg-gray-50 border-bleu-ciel font-medium"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    let tdClass = "py-2 px-4";

                    if (index !== 0) {
                      tdClass += " border-l border-bleu-ciel";
                    }

                    return (
                      <td key={cell.id} className={tdClass}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
