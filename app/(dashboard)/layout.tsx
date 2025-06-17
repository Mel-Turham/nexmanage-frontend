"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const showRightBar = pathname === "/admin/planning";
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-row h-[90vh] overflow-y-hidden">
          {showRightBar ? (
            children
          ) : (
            <div className="bg-bleu-ciel p-[3vh] pb-0 h-full w-full rounded-t-4xl">
              <div className="bg-white rounded-t-2xl h-[87vh] overflow-y-auto">
                {children}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
