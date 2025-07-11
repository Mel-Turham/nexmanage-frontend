"use client";

import { useState } from "react";
// import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Mock data - remplacer par de vraies données
const mockEmployee = {
  id: "1",
  nom: "Jean Dupont",
  prenom: "Jean",
  email: "jean.dupont@entreprise.com",
  telephone: "+33 1 23 45 67 89",
  poste: "Technicien de maintenance",
  departement: "Maintenance",
  adresse: "123 Rue de la République, 75011 Paris",
  dateEmbauche: new Date("2023-03-15"),
  salaire: 35000,
  role: "EMPLOYE",
  isActif: true,
  avatar: "/user.png",
  notes: "Employé très fiable avec une excellente expertise technique.",
  contrats: [
    {
      id: "1",
      description: "Maintenance bureau A",
      date: new Date("2025-01-20"),
      statut: "TERMINE",
    },
    {
      id: "2",
      description: "Réparation équipements",
      date: new Date("2025-01-18"),
      statut: "EN_COURS",
    },
    {
      id: "3",
      description: "Installation matériel",
      date: new Date("2025-01-15"),
      statut: "TERMINE",
    },
  ],
  conges: [
    {
      id: "1",
      motif: "Congés payés",
      dateDebut: new Date("2025-02-10"),
      dateFin: new Date("2025-02-20"),
      statut: "ACCEPTE",
    },
    {
      id: "2",
      motif: "Congé maladie",
      dateDebut: new Date("2025-01-05"),
      dateFin: new Date("2025-01-07"),
      statut: "ACCEPTE",
    },
  ],
  presences: [
    {
      date: new Date("2025-01-20"),
      heureArrivee: "08:00",
      heureDepart: "17:00",
      statut: "PRESENT",
    },
    {
      date: new Date("2025-01-19"),
      heureArrivee: "08:15",
      heureDepart: "17:00",
      statut: "RETARD",
    },
    {
      date: new Date("2025-01-18"),
      heureArrivee: "08:00",
      heureDepart: "17:00",
      statut: "PRESENT",
    },
  ],
};

export default function EmployeeDetailsPage() {
  // const params = useParams()
  // const router = useRouter()
  const [employee] = useState(mockEmployee);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "ACCEPTE":
      case "TERMINE":
      case "PRESENT":
        return "bg-green-100 text-green-800";
      case "EN_COURS":
      case "RETARD":
        return "bg-yellow-100 text-yellow-800";
      case "REFUSE":
      case "ABSENT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "MANAGER":
        return "bg-blue-100 text-blue-800";
      case "EMPLOYE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR");
  };

  const calculateWorkDays = () => {
    const startDate = employee.dateEmbauche;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/employer">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Retour aux employés
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Supprimer
              </Button>
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">
                      {employee.prenom[0]}
                      {employee.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {employee.prenom} {employee.nom}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{employee.poste}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleColor(employee.role)}>
                        {employee.role}
                      </Badge>
                      <Badge
                        className={
                          employee.isActif
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {employee.isActif ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="informations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="contrats">Contrats</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="presences">Présences</TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations personnelles */}
              <div className="lg:col-span-2">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Téléphone
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.telephone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Adresse
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.adresse}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Département
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.departement}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Date d&apos;embauche
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(employee.dateEmbauche)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Salaire
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.salaire.toLocaleString()} €
                          </p>
                        </div>
                      </div>
                    </div>

                    {employee.notes && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Notes
                        </p>
                        <p className="text-sm text-gray-600">
                          {employee.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Statistiques */}
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Jours travaillés
                      </span>
                      <span className="font-semibold">
                        {calculateWorkDays()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Contrats assignés
                      </span>
                      <span className="font-semibold">
                        {employee.contrats.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Congés pris</span>
                      <span className="font-semibold">
                        {employee.conges.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Taux de présence
                      </span>
                      <span className="font-semibold">95%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contrats" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>
                  Contrats assignés ({employee.contrats.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.contrats.map((contrat) => (
                    <div
                      key={contrat.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {contrat.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(contrat.date)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(contrat.statut)}>
                        {contrat.statut.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conges" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>
                  Demandes de congés ({employee.conges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.conges.map((conge) => (
                    <div
                      key={conge.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {conge.motif}
                        </p>
                        <p className="text-sm text-gray-600">
                          Du {formatDate(conge.dateDebut)} au{" "}
                          {formatDate(conge.dateFin)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(conge.statut)}>
                        {conge.statut}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presences" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Historique des présences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.presences.map((presence, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {presence.statut === "PRESENT" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : presence.statut === "RETARD" ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {mockEmployee.contrats[index].description}
                          </p>
                          <p className="font-medium text-gray-900">
                            {formatDate(presence.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {presence.heureArrivee} - {presence.heureDepart}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(presence.statut)}>
                        {presence.statut}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
