"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Données mockées pour les statistiques
const statsData = [
  {
    title: "Employés Actifs",
    value: "124",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Contrats en Cours",
    value: "38",
    change: "+5%",
    trend: "up",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Demandes de Congé",
    value: "15",
    change: "-3%",
    trend: "down",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Heures Travaillées",
    value: "2,847",
    change: "+8%",
    trend: "up",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const monthlyData = [
  { name: "Jan", contrats: 12, employes: 45, heures: 1200 },
  { name: "Fév", contrats: 19, employes: 52, heures: 1400 },
  { name: "Mar", contrats: 15, employes: 48, heures: 1300 },
  { name: "Avr", contrats: 25, employes: 58, heures: 1600 },
  { name: "Mai", contrats: 22, employes: 62, heures: 1550 },
  { name: "Jun", contrats: 30, employes: 68, heures: 1800 },
];

const statusData = [
  { name: "Approuvées", value: 65, color: "#10B981" },
  { name: "En Attente", value: 25, color: "#F59E0B" },
  { name: "Refusées", value: 10, color: "#EF4444" },
];

const recentActivities = [
  {
    id: 1,
    user: "Marie Dubois",
    action: "a créé un nouveau contrat",
    target: "Projet Alpha",
    time: "Il y a 2h",
    avatar: "/user.png",
  },
  {
    id: 2,
    user: "Jean Martin",
    action: "a demandé un congé",
    target: "15-20 Juillet",
    time: "Il y a 4h",
    avatar: "/user.png",
  },
  {
    id: 3,
    user: "Sophie Laurent",
    action: "a terminé le contrat",
    target: "Maintenance Site B",
    time: "Il y a 6h",
    avatar: "/user.png",
  },
  {
    id: 4,
    user: "Pierre Durand",
    action: "a pointé",
    target: "Arrivée 08:30",
    time: "Il y a 8h",
    avatar: "/user.png",
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Révision contrat Client ABC",
    dueDate: "Aujourd'hui",
    priority: "high",
    assignee: "Marie D.",
  },
  {
    id: 2,
    title: "Formation sécurité équipe",
    dueDate: "Demain",
    priority: "medium",
    assignee: "Jean M.",
  },
  {
    id: 3,
    title: "Évaluation performance Q2",
    dueDate: "3 jours",
    priority: "low",
    assignee: "Sophie L.",
  },
];

export default function AccueilPage() {
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d&apos;ensemble de votre activité
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/admin/planning/create">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Contrat
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow p-0">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp
                        className={`w-4 h-4 mr-1 ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contrats" fill="#3B82F6" name="Contrats" />
                <Bar dataKey="employes" fill="#10B981" name="Employés" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique circulaire */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des Demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes et tâches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activités Récentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/rapports">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tâches à venir */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tâches à Venir</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/planning">
                Planning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      x Assigné à {task.assignee} • {task.dueDate}
                    </p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {task.priority === "high"
                      ? "Urgent"
                      : task.priority === "medium"
                      ? "Moyen"
                      : "Faible"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
