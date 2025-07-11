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


interface EmployerProps {
  employers: Employer[];
}
const ListEmployer = ({ employers }: EmployerProps) => {
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
    <div className="flex flex-col justify-between h-full">
        <h1>Liste des employer</h1>
      <div className="flex flex-col p-2 border border-bleu-ciel rounded-xl">
        {/* Tableau */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-bleu-ciel">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Ajout des classes arrondies selon la colonne
                  let thClass = "py-2 px-4 cursor-pointer select-none";

                  if (header.column.id === "id") {
                    thClass += " rounded-l-sm";
                  } else if (header.column.id === "actions") {
                    thClass += " rounded-r-sm";
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
  );
};

export default ListEmployer;
