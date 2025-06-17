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
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CirclePlus, Search } from "lucide-react";

interface DemandeCongeTableProps {
  demandes: DemandeConge[] | null; // Permet null
}

export default function DemandeCongeTable({ demandes }: DemandeCongeTableProps) {

  

  const [sorting, setSorting] = React.useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);

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
          `${row.employe.name}${row.employe.role ? ` (${row.employe.role})` : ""}`,
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
        // cell: ({ row }) => <MoreMenu demande={row.original} />,
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
  // const currentDate = new Date().toLocaleDateString("fr-FR", {
  //   day: "2-digit",
  //   month: "2-digit",
  //   year: "numeric",
  // });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between ">
              <div className="flex flex-row w-fit gap-2">
                <div className="flex items-center justify-center bg-bleu-ciel rounded-full p-3">
                  <Image
                    src="/illustration/work-history.svg"
                    alt="Icone congé"
                    width={100}
                    height={100}
                    className="h-8 w-8"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-black2 font-urbanist font-semibold 2xl:text-2xl xl:text-xl">
                    Demande
                  </h1>
                  <span className="text-gray-400 font-urbanist font-medium xl:text-sm 2xl:text-base">
                    01 / 04 / 2025
                  </span>
                </div>
              </div>

          <Button className="bg-bleu hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            Créer une demande
            <CirclePlus />
          </Button>
       </div>

      {/* Filtres */}
      <section className="flex flex-row w-full gap-4">
          <div className="relative">
            <select
              id="statut"
              aria-label="Filtrer par statut"
              title="Filtrer par statut"
              className={`appearance-none border rounded-full w-full pl-5 pr-10 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white cursor-pointer`}
              defaultValue="Tous">
              <option value="Tous">Tous</option>
              <option value="attente">en attente</option>
              <option value="approuver">approuver</option>
              <option value="refuser">refuser</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
                  clipRule="evenodd"/>
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              id="ordre"
              aria-label="Filtrer par ordre"
              title="Filtrer par ordre"
              className={`appearance-none border rounded-full w-full pl-5 pr-10 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white cursor-pointer`}
              defaultValue="Tous" // Assurez-vous que cette valeur correspond à l'option désactivée
            >
              <option value="Id">ordre</option>
              <option value="croissant">A Z</option>
              <option value="decroissant">Z A</option>
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
      

        <div className="ml-auto">
          {/* Barre de recherche globale */}
          <div className="flex items-center border border-gray-500 py-1 rounded-full">
            <div className="relative ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 py-2 xl:w-sm 2xl:w-xl 2xl:border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>

      </section>

      {/* Tableau */}
      <section className="overflow-x-auto w-full pb-6">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#E9F2F7] text-[#1E2A38] text-sm font-semibold leading-5"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 select-none first:rounded-tl-[20px] last:rounded-tr-[20px]"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ minWidth: header.column.columnDef.size }}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center border border-[#E6F0F5]"
                >
                  <div className="flex flex-col items-center justify-center w-full py-12">
                    <Image
                      src="/illustration/rafiki.svg"
                      alt="Aucun résultat"
                      width={200}
                      height={200}
                      className="h-64 w-auto"
                    />
                    <p className="mt-4">Aucune demande trouvée</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white border border-[#E6F0F5] hover:bg-gray-50 font-medium"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={`py-4 px-4 ${
                        index !== 0 ? "border-l border-[#E6F0F5]" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 text-[#6B7A8F] text-sm select-none gap-4">
          <div className="flex items-center space-x-2">
            <span>Résultats par page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setPageSize(size);
                table.setPageSize(size);
              }}
              className="border rounded-full py-1 px-3 focus:outline-none focus:ring-2 focus:ring-[#3759B8]"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <span>
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 flex items-center justify-center text-lg"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="Première page"
            >
              «
            </Button>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 flex items-center justify-center text-lg"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Page précédente"
            >
              ‹
            </Button>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 flex items-center justify-center text-lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Page suivante"
            >
              ›
            </Button>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 flex items-center justify-center text-lg"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Dernière page"
            >
              »
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}