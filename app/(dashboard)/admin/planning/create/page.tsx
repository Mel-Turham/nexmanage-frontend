"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ContratForm from "@/components/customs/form-contrat";
import { CardTitle } from "@/components/ui/card";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function CreateContractContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const selectedDate = date ? new Date(date) : new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-full p-6 flex flex-col gap-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/planning">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour au planning
            </Button>
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Nouveau contrat
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Créer un contrat pour le {formatDate(selectedDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <ContratForm />
    </div>
  );
}

export default function CreateContractPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <CreateContractContent />
    </Suspense>
  );
}
