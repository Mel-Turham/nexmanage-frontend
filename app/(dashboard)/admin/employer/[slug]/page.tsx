// app/(dashboard)/employes/[slug]/page.tsx

import React from "react"; // useState sera nécessaire si les onglets sont interactifs côté client
import { Employer } from "@/types/employer"; // Assurez-vous que ce chemin est correct
import employersData from "@/data/employers.json"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Pour l'avatar si une image est disponible

// Icônes de lucide-react (ou autre bibliothèque d'icônes)
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  CalendarDays,
  FileText,
  Building,
  ShieldCheck, // Pour Role
  Clock, // Pour Taux Horaire
  Award, // Pour Poste
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Fonctions Utilitaires (inchangées) ---
const generateSlug = (name: string): string => {
  if (!name) return "default-slug";
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

function getInitials(fullName: string): string {
  if (!fullName) return "??";
  const trimmedName = fullName.trim();
  if (!trimmedName) return "??";
  const nameParts = trimmedName.split(/\s+/).filter((part) => part.length > 0);
  if (nameParts.length >= 2) {
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  } else if (nameParts.length === 1) {
    const singleName = nameParts[0];
    return singleName.substring(0, 2).toUpperCase();
  }
  return trimmedName.substring(0, 2).toUpperCase();
}

// --- Génération Statique et Récupération de Données (inchangées) ---
export async function generateStaticParams() {
  const employers: Employer[] = employersData;
  return employers.map((employer) => ({ slug: generateSlug(employer.name) }));
}

async function getEmployerBySlug(slug: string): Promise<Employer | undefined> {
  const employers: Employer[] = employersData;
  if (!Array.isArray(employers)) return undefined;
  return employers.find((emp) => generateSlug(emp.name) === slug);
}

interface EmployerDetailPageProps {
  params: { slug: string };
}

// --- Composants Spécifiques au Design ---

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}

function DetailItem({ icon: Icon, label, value, className }: DetailItemProps) {
  if (value === undefined || value === null || String(value).trim() === "")
    return null;
  return (
    <div className={`mb-5 ${className}`}>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[48px]">
        <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
        {typeof value === "string" ? (
          <span className="text-sm text-gray-800 break-words">{value}</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

interface PillProps {
  text: string;
  colorClass?: string; // ex: "bg-blue-500 text-white"
}
function Pill({ text, colorClass = "bg-blue-100 text-blue-700" }: PillProps) {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass} mr-2 mb-2 inline-block`}
    >
      {text}
    </span>
  );
}

// --- Composant Principal de la Page ---

export default async function EmployerDetailPage({
  params,
}: EmployerDetailPageProps) {
  const employer = await getEmployerBySlug(params.slug);
  // Pour l'instant, l'onglet "Profil" est actif par défaut.
  // const [activeTab, setActiveTab] = useState('Profil'); // Si géré côté client

  if (!employer) {
    notFound();
  }

  const initials = getInitials(employer.name);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md text-sm"
          asChild
        >
          <Link href="/admin/employer" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonne de Gauche: Profil et Navigation d'Onglets */}
        <div className="lg:w-1/3 xl:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col items-center mb-6">
              {employer.profileImage ? (
                <Image
                  src={employer.profileImage}
                  alt={employer.name}
                  width={96}
                  height={96}
                  className="rounded-full mb-3 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-600 text-white flex items-center justify-center rounded-full text-3xl font-bold mb-3">
                    {initials}
                  </div>
                  <Pill text={employer.role || ""} />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {employer.name}
              </h2>
              {/* Icônes d'action (placeholder) */}
              <div className="flex space-x-3 mt-3">
                <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-600 transition-colors">
                  <Mail size={18} />
                </button>
                <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-600 transition-colors">
                  <Phone size={18} />
                </button>
              </div>
            </div>

            {/* Onglets */}
            <nav className="space-y-1">
              {/* Profil (Actif) */}
              <a
                href="#" // Ou gérer avec state si interactif côté client
                className="flex items-center px-3 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md"
                aria-current="page"
              >
                <User className="h-5 w-5 mr-3" />
                Profil
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium rounded-md"
              >
                <FileText className="h-5 w-5 mr-3 text-gray-400" />
                Fiche de paie
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium rounded-md"
              >
                <FileText className="h-5 w-5 mr-3 text-gray-400" />{" "}
                {/* Remplacer par une icône plus appropriée pour Notes */}
                Notes
              </a>
            </nav>
          </div>
        </div>

        {/* Colonne de Droite: Contenu de l'Onglet (Renseignements personnels) */}
        {/* Pour l'instant, affiche toujours la section "Profil" */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Renseignements personnels
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {/* Si c'était une page d'édition: "Modifier vos informations" */}
              Vos informations personnelles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <DetailItem icon={User} label="Full name" value={employer.name} />
              <DetailItem icon={Mail} label="Email" value={employer.email} />

              {/* Nouveaux champs du design */}
              <DetailItem
                icon={CalendarDays}
                label="Solde de congés"
                value={employer.leaveBalance || "N/A"}
              />
              <DetailItem
                icon={Building}
                label="Entreprise"
                value={employer.Entreprise || "N/A"}
              />
              <div className="md:col-span-2">
                {" "}
                {/* Poste peut prendre toute la largeur si beaucoup d'éléments */}
                <label className="text-xs text-gray-500 block mb-1">
                  Poste
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[48px] flex-wrap">
                  <Award className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  {Array.isArray(employer.Poste) ? (
                    employer.Poste.length > 0 ? (
                      employer.Poste.map((p) => <Pill key={p} text={p} />)
                    ) : (
                      <span className="text-sm text-gray-500">
                        Non spécifié
                      </span>
                    )
                  ) : employer.Poste ? (
                    <Pill text={employer.Poste} />
                  ) : (
                    <span className="text-sm text-gray-500">Non spécifié</span>
                  )}
                </div>
              </div>
              <DetailItem
                icon={ShieldCheck}
                label="Role"
                value={employer.role || "N/A"}
              />
              <DetailItem
                icon={Clock}
                label="Taux horaire"
                value={
                  employer.hourlyRate ? `${employer.hourlyRate} $/h` : "N/A"
                }
              />
            </div>

            {/* Le bouton "Sauvegarder" est pour un formulaire d'édition. 
                Pour une page de détails, on pourrait avoir un lien vers une page d'édition.
            <div className="mt-8 pt-5 border-t border-gray-200">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sauvegarder les modifications
              </Button>
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
