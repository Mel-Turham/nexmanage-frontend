// app/(dashboard)/admin/employer/_components/EmployerTable.tsx

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
import { useRouter } from "next/navigation"; // Import useRouter

import { Employer } from "@/types/employer";
import { MoreMenu } from "@/app/(dashboard)/admin/employer/_components/MoreMenu";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import Image from "next/image";
// import { CirclePlus, Search } from "lucide-react";
import { Search01Icon } from "hugeicons-react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

interface EmployerProps {
  employers: Employer[];
}

export default function EmployerTable({ employers }: EmployerProps) {
  const [sorting, setSorting] = React.useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const router = useRouter(); // Initialize useRouter

  // Définition des colonnes
  const columns = React.useMemo<ColumnDef<Employer>[]>(
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
        accessorKey: "telephone",
        header: "Téléphone",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "Poste",
        header: "Poste",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "Entreprise",
        header: "Entreprise",
        cell: (info) => info.getValue(),
      },
      {
        id: "actions",
        header: " ",
        cell: ({ row }) => (
          <MoreMenu
            employer={row.original}
            // onView={() => router.push(`/employes/${row.original.id}`)} // Use employer.id for navigation
            // onEdit={() => alert(`Modifier id: ${row.original.id}`)}
            // onDelete={() => alert(`Supprimer id: ${row.original.id}`)}
          />
        ),
      },
    ],
    [router] // Add router to the dependency array
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
        <Link href={"/admin/employer/create"} passHref legacyBehavior>
          <Button className="bg-bleu hover:bg-blue-700 text-white px-6 py-2 rounded-md w-fit">
            Créer une employer
            <CirclePlus />
          </Button>
        </Link>
      </div>

      <div className="flex flex-row w-full gap-4">
        {/* filtre */}
        <div className="flex flex-row w-full gap-4">
          <div className="relative">
            <select
              id="Nom"
              aria-label="Trier par nom"
              className={`appearance-none border rounded-md w-full px-5 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white cursor-pointer`}
            >
              <option value="nomAZ">Nom ( A - Z )</option>
              <option value="nomZA">Nom ( Z - A )</option>
              {/* <SeparatorHorizontal /> */}
              <option value="ASC">Date Creation (Asc)</option>
              <option value="Desc">Date Creation (Desc)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              {/* Icône de flèche pour le select */}
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              id="Role"
              aria-label="Filtrer par role"
              title="Filtrer par role"
              className={`appearance-none border rounded-md w-full pl-5 pr-10 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white cursor-pointer`}
              defaultValue="Tous" // Assurez-vous que cette valeur correspond à l'option désactivée
            >
              <option value="Tous">Tous les rôles</option>
              <option value="Gestionaire">Gestionaire</option>
              <option value="Employer">Employer</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              {/* Icône de flèche pour le select */}
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              id="domain"
              aria-label="Filtrer par poste"
              title="Filtrer par poste"
              className={`appearance-none border rounded-md w-full pl-5 pr-10 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white cursor-pointer`}
              defaultValue="" // Assurez-vous que cette valeur correspond à l'option désactivée
            >
              <option value="ToutPoste">Tous les postes</option>
              <option value="Poste1">Poste 1</option>
              <option value="Poste2">Poste 2</option>
              <option value="education">Éducation</option>
              <option value="health">Santé</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Fabrication</option>
              <option value="other">Autre</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              {/* Icône de flèche pour le select */}
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row items-center px-2 rounded-md border border-gray w-full focus-within:shadow-md focus-within:border-blue-500 transition-all duration-200">
            <Search01Icon color="#e5e5e5" size={24} />
            <input
              type="search"
              name="search"
              placeholder="Recherche un employer"
              className="py-2 px-4 w-full outline-none"
            />
          </div>
          {/* Barre de recherche globale */}
          {/* <div className="flex items-center border border-gray-500 py-1 rounded-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 py-2 xl:w-sm 2xl:w-xl 2xl:border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
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
