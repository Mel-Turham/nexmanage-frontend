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
  ExpandedState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Search } from "lucide-react";
import moment from "moment";
import { Contrat, Utilisateur } from "@/types";

interface EmployersPresentTableProps {
  contracts: Contrat[];
}

export default function EmployersPresentTable({
  contracts,
}: EmployersPresentTableProps) {
  const [sorting, setSorting] = React.useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  // Flatten contracts to rows
  const flattenedData = React.useMemo(() => {
    return contracts.flatMap((contract) =>
      contract.utilisateur.map((user) => ({
        ...user,
        contractId: contract.id,
        contractDescription: contract.description,
        contractDateDebut: contract.dateDebut,
        contractDateFin: contract.dateFin,
        utilisateur: contract.utilisateur, // Pour accès lors de l'expansion
      }))
    );
  }, [contracts]);

  const columns = React.useMemo<ColumnDef<(typeof flattenedData)[number]>[]>(
    () => [
      {
        accessorKey: "contractDescription",
        header: "Groupe de Contrat",
        cell: ({ cell, row }) => {
          if (row.getCanExpand()) {
            return (
              <button
                onClick={row.getToggleExpandedHandler()}
                style={{ cursor: "pointer" }}
              >
                {String(cell.getValue())} {row.getIsExpanded() ? "👇" : "👉"}
              </button>
            );
          }
          return cell.getValue();
        },
        enableSorting: true,
      },
      {
        accessorKey: "nom",
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
        accessorKey: "contractDateDebut",
        header: "Heures de début",
        cell: (info) => moment(info.getValue() as string).format("HH:mm:ss"),
      },
      {
        accessorKey: "contractDateFin",
        header: "Heures de fin",
        cell: (info) => {
          const value = info.getValue();
          return value ? moment(value as string).format("HH:mm:ss") : "-";
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: flattenedData,
    columns,
    state: {
      sorting,
      globalFilter,
      expanded,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onExpandedChange: setExpanded,
    // getSubRows: (row) => undefined, // Pas de sous-lignes natives ici
  });

  return (
    <>
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
              Employeurs présents
            </h1>
            <span className="text-gray-400 font-urbanist font-medium xl:text-sm 2xl:text-base">
              {moment().format("DD / MM / YYYY")}
            </span>
          </div>
        </div>
        {/* Barre de recherche globale */}
        <div className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom d'employé ou contrat"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 xl:w-sm 2xl:w-lg rounded-md border-gray-200"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[90%] justify-between">
        <div className="flex flex-col p-2 border border-bleu-ciel rounded-4xl">
          {/* Tableau */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-bleu-ciel">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    let thClass = "py-2 px-4 cursor-pointer select-none";
                    if (header.column.id === "contractDescription") {
                      thClass += " rounded-l-full";
                    } else if (header.column.id === "contractDateFin") {
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
                        alt="No results illustration"
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
                <React.Fragment key={row.id}>
                  <tr className="border-b last:border-b-0 hover:bg-gray-50 border-bleu-ciel">
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
                  {/* Affichage des sous-lignes si besoin */}
                  {row.original.utilisateur &&
                    Array.isArray(row.original.utilisateur) &&
                    row.original.utilisateur.length > 1 &&
                    row.original.utilisateur.map((user: Utilisateur) => {
                      // On évite de dupliquer la ligne principale
                      if (user.idUtilisateur === row.original.idUtilisateur)
                        return null;
                      return (
                        <tr
                          key={user.idUtilisateur}
                          className="bg-gray-100 border-b border-bleu-ciel"
                        >
                          <td className="py-2 px-4 pl-8"></td>
                          <td className="py-2 px-4 border-l border-bleu-ciel">
                            {user.nom}
                          </td>
                          <td className="py-2 px-4 border-l border-bleu-ciel">
                            {user.email}
                          </td>
                          <td className="py-2 px-4 border-l border-bleu-ciel">
                            {user.telephone}
                          </td>
                          <td className="py-2 px-4 border-l border-bleu-ciel">
                            {moment(row.original.contractDateDebut).format(
                              "HH:mm:ss"
                            )}
                          </td>
                          <td className="py-2 px-4 border-l border-bleu-ciel">
                            {row.original.contractDateFin
                              ? moment(row.original.contractDateFin).format(
                                  "HH:mm:ss"
                                )
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
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
    </>
  );
}
