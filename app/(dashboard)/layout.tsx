import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="bg-bleu-ciel p-5 pb-0 h-full rounded-t-4xl">
          <div className="bg-white h-full rounded-t-3xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
