"use client";

import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  User,
  // Clock,
  FileText,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Mock data - remplacer par de vraies données
const mockDemandeConge = {
  id: "1",
  motif: "Congés payés - Vacances d'été",
  dateDebut: new Date("2025-02-10"),
  dateFin: new Date("2025-02-20"),
  dureeJours: 10,
  statut: "EN_ATTENTE",
  dateCreation: new Date("2025-01-15"),
  motifRefus: "",
  employe: {
    id: "1",
    nom: "Jean Dupont",
    prenom: "Jean",
    poste: "Technicien de maintenance",
    departement: "Maintenance",
    avatar: "/user.png",
    email: "jean.dupont@entreprise.com",
  },
  description:
    "Je souhaite prendre mes congés payés pour partir en vacances en famille. J'ai organisé mon travail en conséquence et mes collègues peuvent prendre le relais si nécessaire.",
  documentsJoints: [
    { nom: "planning_remplacement.pdf", taille: "245 KB" },
    { nom: "certificat_medical.pdf", taille: "180 KB" },
  ],
  historique: [
    {
      date: new Date("2025-01-15T09:00:00"),
      action: "Demande créée",
      auteur: "Jean Dupont",
    },
    {
      date: new Date("2025-01-15T14:30:00"),
      action: "Documents ajoutés",
      auteur: "Jean Dupont",
    },
  ],
};

export default function DemandeCongeDetailsPage() {
  // const params = useParams();
  // const router = useRouter();
  const [demande, setDemande] = useState(mockDemandeConge);
  const [motifRefus, setMotifRefus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "ACCEPTE":
        return "bg-green-100 text-green-800";
      case "REFUSE":
        return "bg-red-100 text-red-800";
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // const formatDateTime = (date: Date) => {
  //   return date.toLocaleString("fr-FR");
  // };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      // Simulation d'une API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDemande((prev) => ({
        ...prev,
        statut: "ACCEPTE",
        historique: [
          ...prev.historique,
          {
            date: new Date(),
            action: "Demande acceptée",
            auteur: "Manager RH",
          },
        ],
      }));

      toast.success("Demande de congé acceptée");
    } catch (error) {
      toast.error("Erreur lors de l'acceptation");
      console.log("erreur : ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!motifRefus.trim()) {
      toast.error("Veuillez indiquer un motif de refus");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulation d'une API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDemande((prev) => ({
        ...prev,
        statut: "REFUSE",
        motifRefus,
        historique: [
          ...prev.historique,
          { date: new Date(), action: "Demande refusée", auteur: "Manager RH" },
        ],
      }));

      toast.success("Demande de congé refusée");
    } catch (error) {
      toast.error("Erreur lors du refus");
      console.error("error : ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/conges">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Retour aux demandes
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-800 shadow-none blur-none">
                  Demande de congé #{demande.id}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Créée le {formatDate(demande.dateCreation)}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(demande.statut)}>
              {demande.statut.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de la demande */}
            <Card className="bg-white/90 backdrop-blur-sm border ">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Détails de la demande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motif</h4>
                  <p className="text-gray-700">{demande.motif}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Date de début
                    </h4>
                    <p className="text-gray-700 font-semibold">
                      {formatDate(demande.dateDebut)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Date de fin
                    </h4>
                    <p className="text-gray-700 font-semibold">
                      {formatDate(demande.dateFin)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Durée</h4>
                  <p className="text-gray-700">
                    {demande.dureeJours} jour{demande.dureeJours > 1 ? "s" : ""}
                  </p>
                </div>

                {demande.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {demande.description}
                    </p>
                  </div>
                )}

                {demande.motifRefus && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Motif du refus
                    </h4>
                    <p className="text-red-700">{demande.motifRefus}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents joints */}
            {/* {demande.documentsJoints.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-sm border ">
                <CardHeader>
                  <CardTitle>Documents joints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {demande.documentsJoints.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {doc.nom}
                            </p>
                            <p className="text-xs text-gray-600">
                              {doc.taille}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Télécharger
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Historique */}
            {/* <Card className="bg-white/90 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demande.historique.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm text-gray-900">
                            {event.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            par {event.auteur}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">
                          {formatDateTime(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Actions de traitement */}
            {demande.statut === "EN_ATTENTE" && (
              <Card className="bg-white/90 backdrop-blur-sm border">
                <CardHeader>
                  <CardTitle>Traiter la demande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      onClick={handleAccept}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2 w-fit"
                    >
                      <Check size={16} />
                      {isProcessing ? "Traitement..." : "Accepter"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing || !motifRefus.trim()}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      {isProcessing ? "Traitement..." : "Refuser"}
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motif du refus (requis pour refuser)
                    </label>
                    <Textarea
                      value={motifRefus}
                      onChange={(e) => setMotifRefus(e.target.value)}
                      placeholder="Expliquez pourquoi cette demande est refusée..."
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations employé */}
            <Card className="bg-white/90 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Employé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={demande.employe.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {demande.employe.prenom[0]}
                      {demande.employe.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {demande.employe.prenom} {demande.employe.nom}
                    </p>
                    <p className="text-sm text-gray-600">
                      {demande.employe.poste}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Département</span>
                    <span className="font-medium">
                      {demande.employe.departement}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-xs">
                      {demande.employe.email}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/admin/employer/${demande.employe.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Voir le profil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Résumé */}
            <Card className="bg-white/90 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Statut</span>
                  <Badge className={getStatusColor(demande.statut)}>
                    {demande.statut.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Durée</span>
                  <span className="font-medium">
                    {demande.dureeJours} jour{demande.dureeJours > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Créée le</span>
                  <span className="font-medium text-xs">
                    {formatDate(demande.dateCreation)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
