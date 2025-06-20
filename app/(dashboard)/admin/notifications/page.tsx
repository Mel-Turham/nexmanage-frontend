"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  FileText,
  Clock,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react";

// Données mockées pour les notifications
const allNotifications = [
  {
    id: 1,
    type: "contract",
    title: "Nouveau contrat créé",
    message:
      'Marie Dubois a créé le contrat "Projet Alpha" pour le client ABC Corp.',
    time: "2 minutes",
    date: "2024-01-15T14:30:00",
    read: false,
    priority: "high",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    user: {
      name: "Marie Dubois",
      avatar: "/user.png",
    },
  },
  {
    id: 2,
    type: "leave",
    title: "Demande de congé en attente",
    message:
      "Jean Martin a demandé un congé du 15 au 20 juillet 2024. Approbation requise.",
    time: "1 heure",
    date: "2024-01-15T13:30:00",
    read: false,
    priority: "medium",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    user: {
      name: "Jean Martin",
      avatar: "/user.png",
    },
  },
  {
    id: 3,
    type: "message",
    title: "Nouveau message",
    message:
      "Sophie Laurent vous a envoyé un message concernant le projet Beta.",
    time: "2 heures",
    date: "2024-01-15T12:30:00",
    read: true,
    priority: "low",
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-50",
    user: {
      name: "Sophie Laurent",
      avatar: "/user.png",
    },
  },
  {
    id: 4,
    type: "task",
    title: "Tâche terminée",
    message:
      'Pierre Durand a terminé la tâche "Maintenance Site B" avec succès.',
    time: "4 heures",
    date: "2024-01-15T10:30:00",
    read: true,
    priority: "low",
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    user: {
      name: "Pierre Durand",
      avatar: "/user.png",
    },
  },
  {
    id: 5,
    type: "system",
    title: "Sauvegarde automatique",
    message:
      "Sauvegarde automatique des données effectuée avec succès à 02:00.",
    time: "6 heures",
    date: "2024-01-15T08:30:00",
    read: true,
    priority: "low",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  {
    id: 6,
    type: "alert",
    title: "Alerte de sécurité",
    message:
      "Tentative de connexion suspecte détectée depuis une nouvelle adresse IP.",
    time: "1 jour",
    date: "2024-01-14T14:30:00",
    read: false,
    priority: "high",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (filter !== "all") return notification.type === filter;
    return true;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    }
    return 0;
  });

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos notifications et alertes
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="priority">Priorité</SelectItem>
            </SelectContent>
          </Select>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead}>
              <MarkAsRead className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non lues</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Priorité haute</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter((n) => n.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aujourd&apos;hui</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    notifications.filter(
                      (n) =>
                        new Date(n.date).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="unread">Non lues</TabsTrigger>
          <TabsTrigger value="contract">Contrats</TabsTrigger>
          <TabsTrigger value="leave">Congés</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="task">Tâches</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {sortedNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600">
                  Vous n&apos;avez aucune notification pour le moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {sortedNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`transition-all hover:shadow-md ${
                      !notification.read
                        ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-full ${notification.bgColor}`}
                        >
                          <Icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4
                                className={`font-medium ${
                                  !notification.read
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <Badge
                                variant={
                                  notification.priority === "high"
                                    ? "destructive"
                                    : notification.priority === "medium"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {notification.priority === "high"
                                  ? "Urgent"
                                  : notification.priority === "medium"
                                  ? "Moyen"
                                  : "Faible"}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              Il y a {notification.time}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {notification.message}
                          </p>
                          {notification.user && (
                            <div className="flex items-center space-x-2 mb-3">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={
                                    notification.user.avatar ||
                                    "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {notification.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {notification.user.name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Marquer comme lu
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
