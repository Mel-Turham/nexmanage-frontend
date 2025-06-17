"use client";

import Image from "next/image";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function NotFoundPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <SidebarInset className="flex-1 flex flex-col">
          <Header />
          <div className="bg-bleu-ciel rounded-tl-3xl pt-5 pl-5 2xl:rounded-tl-[50px] 2xl:pt-6 2xl:pl-6 2xl:h-[95vh] xl:h-min-fit">
            <div className="bg-white rounded-tl-xl 2xl:rounded-tl-4xl h-full">
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col items-center justify-center px-4 bg-white">
                  <div className="max-w-xl text-center">
                    <Image
                      src="/404.svg"
                      alt="Erreur 404"
                      width={600}
                      height={400}
                      priority
                      className="2xl:h-[65vh] xl:h-[50vh] w-full"
                    />
                    <h1 className="mt-8 text-2xl font-bold text-gray-800">
                      Oups, cette page n’existe pas
                    </h1>
                    <p className="mt-2 text-gray-600">
                      Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
                    </p>
                    <Link
                      href="/"
                      className="mt-6 inline-block px-6 py-3 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
                    >
                      Retour à l’accueil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
