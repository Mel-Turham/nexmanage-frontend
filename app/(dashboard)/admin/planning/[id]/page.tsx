"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  FileText,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
// import { useToast } from "@/hooks/use-toast"

import { toast } from "sonner";

// Mock contract data
const mockContract = {
  id: "1",
  description: "Contrat de maintenance informatique",
  lieu: "Paris, France",
  heureDebut: new Date("2025-06-18T09:00:00"),
  heureFin: new Date("2025-06-18T17:00:00"),
  pause: new Date("2025-06-18T12:30:00"),
  estGabarit: false,
  nomGabarit: "",
  taches: [
    {
      id: "1",
      titre: "Installation des logiciels",
      description: "Installation des logiciels sur les postes de travail",
    },
    {
      id: "2",
      titre: "Configuration réseau",
      description: "Configuration du réseau local",
    },
    {
      id: "3",
      titre: "Formation utilisateurs",
      description: "Formation des utilisateurs aux nouveaux outils",
    },
  ],
  utilisateurs: [
    {
      id: "1",
      nom: "Jean Dupont",
      role: "Technicien",
      email: "jean.dupont@example.com",
      avatar: "/user.png",
    },
    {
      id: "2",
      nom: "Marie Martin",
      role: "Chef de projet",
      email: "marie.martin@example.com",
      avatar: "/user.png",
    },
  ],
  commentaires: [
    {
      id: "1",
      auteur: "Jean Dupont",
      message: "J'ai terminé l'installation des logiciels",
      date: "18/06/2025 10:30",
    },
    {
      id: "2",
      auteur: "Marie Martin",
      message: "Parfait, je vais commencer la formation",
      date: "18/06/2025 11:15",
    },
  ],
};

export default function ContractDetailsPage() {
  const params = useParams();
  const [contract, setContract] = useState(mockContract);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Simulate API call to fetch contract details
    const fetchContract = async () => {
      try {
        // In a real app, you would fetch the contract using the ID from params
        // const response = await fetch(`/api/contracts/${params.id}`);
        // const data = await response.json();
        // setContract(data);

        // For now, we'll just use the mock data
        setContract(mockContract);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast("Impossible de charger les détails du contrat");
        setLoading(false);
      }
    };

    fetchContract();
  }, [params.id, toast]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = () => {
    const start = contract.heureDebut;
    const end = contract.heureFin;
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}h${diffMins > 0 ? ` ${diffMins}min` : ""}`;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `${contract.commentaires.length + 1}`,
      auteur: "Vous",
      message: newComment,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setContract({
      ...contract,
      commentaires: [...contract.commentaires, newCommentObj],
    });

    setNewComment("");

    toast("Votre commentaire a été ajouté avec succès");
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {contract.description}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    {contract.lieu}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/planning/contracts/${params.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-gray-500">
                        {contract.heureDebut.toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Horaires</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(contract.heureDebut)} -{" "}
                        {formatTime(contract.heureFin)} ({formatDuration()})
                      </p>
                    </div>
                  </div>
                  {contract.pause && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">Pause</p>
                        <p className="text-sm text-gray-500">
                          {formatTime(contract.pause)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Employés assignés</p>
                      <p className="text-sm text-gray-500">
                        {contract.utilisateurs.length} employé(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Tâches</p>
                      <p className="text-sm text-gray-500">
                        {contract.taches.length} tâche(s)
                      </p>
                    </div>
                  </div>
                  {contract.estGabarit && (
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="border-blue-500 text-blue-500"
                      >
                        Gabarit: {contract.nomGabarit}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tasks" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="tasks">Tâches</TabsTrigger>
              <TabsTrigger value="employees">Employés</TabsTrigger>
              <TabsTrigger value="comments">Commentaires</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Liste des tâches</CardTitle>
                </CardHeader>
                <CardContent>
                  {contract.taches.length > 0 ? (
                    <div className="space-y-4">
                      {contract.taches.map((task) => (
                        <Card key={task.id} className="bg-gray-50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-md">
                              {task.titre}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Aucune tâche associée à ce contrat
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="employees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employés assignés</CardTitle>
                </CardHeader>
                <CardContent>
                  {contract.utilisateurs.length > 0 ? (
                    <div className="space-y-4">
                      {contract.utilisateurs.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-3 border rounded-lg"
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.nom}
                            />
                            <AvatarFallback>
                              {user.nom.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.nom}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto"
                            asChild
                          >
                            <Link href={`/admin/employer/${user.id}`}>
                              Voir profil
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Aucun employé assigné à ce contrat
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Commentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {contract.commentaires.length > 0 ? (
                      <div className="space-y-4">
                        {contract.commentaires.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 border rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium">{comment.auteur}</p>
                              <p className="text-xs text-gray-500">
                                {comment.date}
                              </p>
                            </div>
                            <p className="text-sm">{comment.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          Aucun commentaire pour ce contrat
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                  <Separator className="my-4" />
                  <div className="flex gap-2">
                    <textarea
                      className="flex-1 p-2 border rounded-md text-sm"
                      placeholder="Ajouter un commentaire..."
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Envoyer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-1/3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                <Image
                  src="/map.png"
                  alt="Carte de localisation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-md shadow-md">
                    <p className="text-sm font-medium">{contract.lieu}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
