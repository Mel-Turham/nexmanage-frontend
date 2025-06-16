'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import demandesData from '@/data/demande.json';
import { DemandeConge } from '@/types/demande';
import MarkdownEditor from '@/components/ui/markdown';
import CustomCalendar from '@/components/ui/CustomCalendar';

const slugify = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

function findDemandeBySlug(slug: string): DemandeConge | undefined {
  return demandesData.find(
    (d) => slugify(`${d.employe.name}-${d.idDemande}`) === slug
  );
}

interface PageProps {
  params: { slug: string };
}

export default function DemandeDetailPage({ params }: PageProps) {
  const router = useRouter();
  const demande = findDemandeBySlug(params.slug);

  if (!demande) return <div className="p-6">Demande non trouvée.</div>;

  const start = new Date(demande.dateDebut);
  const end = new Date(demande.dateFin);

  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  useEffect(() => {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    setSelectedDays(dates);
  }, [demande.dateDebut, demande.dateFin]);

  const formatDate = (date: Date) => format(date, 'd MMMM yyyy', { locale: fr });
  const formatTime = (date: Date) => format(date, 'HH:mm', { locale: fr });
  const formatDay = (date: Date) => format(date, 'd', { locale: fr });

  const heuresParJour = demande.heuresParJour || 8;
  const jours = parseInt((demande.duration || '').toString().replace(/\D/g, ''), 10) || 0;
  const dureeTotale = jours * heuresParJour;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-300 flex flex-col items-center py-8 px-4">
        <Button 
          variant="ghost" 
          className="self-start mb-6 flex items-center space-x-2 text-slate-900 text-sm font-normal p-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" /> <span>Retour</span>
        </Button>

        <div className="mb-3 w-16 h-16 rounded-full bg-sky-200 flex items-center justify-center text-sm font-semibold text-slate-900 select-none mt-10">
          {demande.employe.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <p className="mb-8 text-center text-sm font-semibold text-slate-900">{demande.employe.name}</p>
        <div className="flex space-x-4">
          <Button variant="ghost" className="bg-sky-200 hover:bg-sky-300 rounded-full p-3">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="bg-sky-200 hover:bg-sky-300 rounded-full p-3">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto p-6">
        <section className="flex-1">
          <header className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold text-slate-900">Demande de congé</h1>
            <span className="flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-600 text-sm font-semibold px-3 py-1">
              <Clock className="h-4 w-4" /> {demande.statut}
            </span>
          </header>
          
          <p className="mb-6 text-sm font-normal text-slate-900">
            Créée le {formatDate(start)} à {formatTime(start)} par {demande.employe.name}
            <Link 
              href={`/demandes/${params.slug}/edit`} 
              className="border-l border-slate-900 pl-2 font-semibold ml-2 cursor-pointer"
            >
              Modifier la demande
            </Link>
          </p>

          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-1">Justification</h2>
            <p className="text-xs text-slate-500 mb-2">{demande.justification}</p>
            <hr className="border-slate-400" />
          </section>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <section className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Paramètres Généraux</h3>
                <div className="bg-white p-4 rounded-xl border">
                  <CustomCalendar start={start} end={end} onChange={setSelectedDays} />
                </div>
                <form action="">
                   <div>
                    <label htmlFor="type-conge" className="block text-sm font-semibold mb-2">
                      Type de congé
                    </label>
                    <div className="relative">
                      <select
                        className="appearance-none border rounded-full w-full pl-5 pr-10 py-3 text-gray-700 bg-white"
                        defaultValue=""
                      >
                        <option value="">Sélectionner le type de congé</option>
                        <option value="maladie">Maladie</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </form>
                
              </section>

            
            </div>

            {/* Summary Panel */}
            <aside className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-sky-100 rounded-2xl p-6 h-full">
                <h3 className="font-semibold text-lg mb-4">Sommaire</h3>
                
                <div className="mb-6">
                  <p className="font-semibold mb-2">
                    Congé du {formatDay(start)} mai au {formatDay(end)} mai
                  </p>
                  <p className="text-sm text-slate-700 flex justify-between border-b border-slate-400 pb-3">
                    <span>Semaine du {formatDay(start)} mai</span>
                    <span className="font-semibold">{jours} jours</span>
                  </p>
                </div>
                
                <div className="mb-8">
                  <p className="font-semibold mb-3">Détails</p>
                  <div className="space-y-2">
                    {["Jours comptabilisés", "Heures par jour", "Durée comptabilisée", "Solde de congé"].map((label, index) => {
                      const values = [
                        `${jours} jours`,
                        `${heuresParJour}h`,
                        `${dureeTotale}h`,
                        `${demande.soldeRestant} jours`
                      ];
                      return (
                        <p key={index} className="text-sm text-slate-700 flex justify-between">
                          <span>{label}</span>
                          <span className="font-semibold">{values[index]}</span>
                        </p>
                      );
                    })}
                  </div>
                </div>

                
              </div>
            </aside>
          </div>
          <div>
            <form className="space-y-4 mt-6">
                 

                  <div className="flex gap-3 items-center flex-wrap mt-8">
                    <div className="flex-1">
                      <label htmlFor="poste" className="block text-sm font-semibold mb-2">
                        Poste
                      </label>
                      <div className="relative">
                        <select 
                          className="appearance-none border rounded-full w-full pl-5 pr-10 py-3 text-gray-700 bg-white" 
                          defaultValue=""
                        >
                          <option value="">Sélectionner le type de poste</option>
                          <option value="gestionnaire">Gestionnaire</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-2">
                        Tarif horaire
                      </label>
                      <div className="flex rounded-full border border-slate-500 overflow-hidden">
                        <input 
                          type="text" 
                          defaultValue="8h" 
                          className="flex-1 px-4 py-3 text-sm text-slate-900 focus:outline-none w-full" 
                        />
                        <span className="px-4 py-3 text-sm text-slate-900 select-none">|</span>
                        <span className="px-4 py-3 text-sm text-slate-900 select-none">$/h</span>
                      </div>
                    </div>
                  </div>
                </form>
                  <section className="mt-6">
                <h3 className="text-sm font-semibold mb-3">Commentaires</h3>
                <MarkdownEditor />
                <div className="mt-4">
                  <Button 
                    disabled 
                    className="bg-sky-200 text-slate-700 rounded-full px-6 py-3 text-sm font-normal cursor-not-allowed opacity-60">
                    Commenter
                  </Button>
                </div>
                <div className=" mt-8">
                  <Button 
                    className="bg-blue-600 text-slate-700 rounded-full mr-5 px-6 py-3 text-sm font-normal ">
                    Approuver
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="bg-sky-200 text-slate-700 rounded-full px-9 py-3 text-sm font-normal ">
                  
                    Refuser
                  </Button>
                </div>
              </section>
          </div>
        </section>
      </main>
    </div>
  );
}