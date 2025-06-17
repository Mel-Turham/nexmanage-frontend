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

import { EmployersPresent } from "@/types/employer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Search } from "lucide-react";

interface EmployersPresentTableProps {
  employers: EmployersPresent[];
}

export default function EmployersPresentTable({
  employers,
}: EmployersPresentTableProps) {
  const [sorting, setSorting] = React.useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Définition des colonnes
  const columns = React.useMemo<ColumnDef<EmployersPresent>[]>(
    () => [
      {
        accessorKey: "id",
        header: "",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: "Nom",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "phone",
        header: "Téléphone",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "duration",
        header: "Durée du contrat",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "leaveBalance",
        header: "Solde congés",
        cell: (info) => info.getValue(),
      },
      // {
      //   id: "actions",
      //   header: " ",
      //   cell: ({ row }) => (
      //     <MoreMenu
      //       onView={() => alert(`Afficher id: ${row.original.id}`)}
      //       onEdit={() => alert(`Modifier id: ${row.original.id}`)}
      //       onDelete={() => alert(`Supprimer id: ${row.original.id}`)}
      //     />
      //   ),
      // },
    ],
    []
  );

  // Création du tableau
  const table = useReactTable({
    data: employers,
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row w-fit gap-2">
          <div className="flex items-center justify-center bg-bleu-ciel rounded-full p-3">
            <Image
              src={"/appointment-01.svg"}
              alt="Logo"
              width={100}
              height={100}
              className="h-8 w-8"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-black2 font-urbanist font-semibold 2xl:text-2xl xl:text-xl">
              Employer présent
            </h1>
            <span className="text-gray-400 font-urbanist font-medium xl:text-sm 2xl:text-base">
              01 / 04 / 2025
            </span>
          </div>
        </div>
        {/* Barre de recherche globale */}
        <div className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 xl:w-sm 2xl:w-lg rounded-full border-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2 border border-bleu-ciel rounded-4xl">
        {/* Tableau */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-bleu-ciel">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Ajout des classes arrondies selon la colonne
                  let thClass = "py-2 px-4 cursor-pointer select-none";

                  if (header.column.id === "id") {
                    thClass += " rounded-l-full";
                  } else if (header.column.id === "leaveBalance") {
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
                className="border-b last:border-b-0 hover:bg-gray-50 border-bleu-ciel"
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
  );
}
