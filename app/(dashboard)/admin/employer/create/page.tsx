"use client";

import type React from "react";
// import { useState } from "react";
import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
import {
  // Upload,
  User,
  Mail,
  Phone,
  // Building2,
  // Calendar,
  Save,
} from "lucide-react";

// Define the form schema
const employeeSchema = z.object({
  nom: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  role: z.enum(["EMPLOYE", "MANAGER", "ADMIN"]),
  isActif: z.boolean().default(true),
  departement: z.string().optional(),
  dateEmbauche: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  pays: z.string().optional(),
  salaire: z.string().optional(),
  notes: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function CreateEmployeePage() {
  const router = useRouter();
  //   const { toast } = useToast()
  // const [avatar, setAvatar] = useState<string | null>(null);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      role: "EMPLOYE",
      isActif: true,
      departement: "",
      dateEmbauche: new Date().toISOString().split("T")[0],
      adresse: "",
      ville: "",
      codePostal: "",
      pays: "",
      salaire: "",
      notes: "",
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast(`Employé créé L'employé ${data.nom} a été créé avec succès.`);

      router.push("/admin/employer");
    } catch (error) {
      console.error("Error creating employee:", error);
      toast("Une erreur est survenue lors de la création de l'employé.");
    }
  };

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setAvatar(event.target?.result as string);
  //       console.log("avatar : ", avatar);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col gap-2 pb-4">
        <h1 className="text-2xl font-bold">Créer un nouvel employé</h1>
        <p className="text-muted-foreground">
          Remplissez les informations ci-dessous pour créer un nouvel employé.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom complet
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jean.dupont@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+33 6 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Créer l&apos;employé
          </Button>
        </form>
      </Form>
    </div>
  );
}
