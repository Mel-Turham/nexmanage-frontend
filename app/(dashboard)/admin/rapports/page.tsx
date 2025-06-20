"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  Filter,
} from "lucide-react";

// Données mockées pour les rapports
const employeeData = [
  { name: "Jan", actifs: 45, nouveaux: 5, partis: 2 },
  { name: "Fév", actifs: 52, nouveaux: 8, partis: 1 },
  { name: "Mar", actifs: 48, nouveaux: 3, partis: 7 },
  { name: "Avr", actifs: 58, nouveaux: 12, partis: 2 },
  { name: "Mai", actifs: 62, nouveaux: 6, partis: 2 },
  { name: "Jun", actifs: 68, nouveaux: 8, partis: 2 },
];

const contractData = [
  { name: "Jan", termines: 12, enCours: 8, nouveaux: 15 },
  { name: "Fév", termines: 19, enCours: 12, nouveaux: 18 },
  { name: "Mar", termines: 15, enCours: 10, nouveaux: 12 },
  { name: "Avr", termines: 25, enCours: 15, nouveaux: 22 },
  { name: "Mai", termines: 22, enCours: 18, nouveaux: 25 },
  { name: "Jun", termines: 30, enCours: 20, nouveaux: 28 },
];

const leaveData = [
  { name: "Jan", approuvees: 15, refusees: 2, enAttente: 3 },
  { name: "Fév", approuvees: 18, refusees: 1, enAttente: 4 },
  { name: "Mar", approuvees: 12, refusees: 3, enAttente: 2 },
  { name: "Avr", approuvees: 22, refusees: 2, enAttente: 5 },
  { name: "Mai", approuvees: 20, refusees: 1, enAttente: 3 },
  { name: "Jun", approuvees: 25, refusees: 2, enAttente: 4 },
];

// const performanceData = [
//   { name: "Jan", productivite: 85, satisfaction: 90, retard: 5 },
//   { name: "Fév", productivite: 88, satisfaction: 92, retard: 3 },
//   { name: "Mar", productivite: 82, satisfaction: 88, retard: 8 },
//   { name: "Avr", productivite: 90, satisfaction: 94, retard: 2 },
//   { name: "Mai", productivite: 87, satisfaction: 91, retard: 4 },
//   { name: "Jun", productivite: 92, satisfaction: 95, retard: 1 },
// ];

const departmentData = [
  { name: "IT", value: 25, color: "#3B82F6" },
  { name: "RH", value: 15, color: "#10B981" },
  { name: "Marketing", value: 20, color: "#F59E0B" },
  { name: "Ventes", value: 30, color: "#EF4444" },
  { name: "Support", value: 10, color: "#8B5CF6" },
];

const topEmployees = [
  { name: "Marie Dubois", department: "IT", score: 95, contracts: 12 },
  { name: "Jean Martin", department: "Ventes", score: 92, contracts: 15 },
  { name: "Sophie Laurent", department: "Marketing", score: 90, contracts: 8 },
  { name: "Pierre Durand", department: "Support", score: 88, contracts: 10 },
  { name: "Anne Moreau", department: "RH", score: 85, contracts: 6 },
];

export default function RapportsPage() {
  // const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
  //   from: new Date(2024, 0, 1),
  //   to: new Date(),
  // })
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600 mt-1">
            Analyses et statistiques détaillées
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Mois</SelectItem>
              <SelectItem value="3months">3 Mois</SelectItem>
              <SelectItem value="6months">6 Mois</SelectItem>
              <SelectItem value="1year">1 Année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button className="w-fit">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow p-0 h-fit">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Revenus Totaux
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  €245,680
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +15.2%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow p-0 h-fit">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taux de Satisfaction
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">94%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +2.1%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow p-0 h-fit">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Productivité
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">87%</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    -1.5%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow p-0 h-fit">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Contrats Actifs
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">38</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +5.3%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Onglets de rapports */}
      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
          <TabsTrigger value="leaves">Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Employés</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={employeeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="actifs"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      name="Actifs"
                    />
                    <Area
                      type="monotone"
                      dataKey="nouveaux"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Nouveaux"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Employés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEmployees.map((employee, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {employee.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Score: {employee.score}%
                        </p>
                        <p className="text-xs text-gray-600">
                          {employee.contracts} contrats
                        </p>
                      </div>
                      <Badge variant="secondary">{employee.score}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Contrats</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={contractData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="nouveaux" fill="#3B82F6" name="Nouveaux" />
                  <Bar dataKey="enCours" fill="#F59E0B" name="En Cours" />
                  <Bar dataKey="termines" fill="#10B981" name="Terminés" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de Congé</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={leaveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="approuvees"
                    stroke="#10B981"
                    name="Approuvées"
                  />
                  <Line
                    type="monotone"
                    dataKey="refusees"
                    stroke="#EF4444"
                    name="Refusées"
                  />
                  <Line
                    type="monotone"
                    dataKey="enAttente"
                    stroke="#F59E0B"
                    name="En Attente"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
