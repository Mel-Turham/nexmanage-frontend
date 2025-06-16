"use client";
import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import {
  Analytics01Icon,
  Analytics02Icon,
  Calendar01Icon,
  Calendar02Icon,
  CursorPointer02Icon,
  Home01Icon,
  Message01Icon,
  Settings02Icon,
  UserListIcon,
  WorkHistoryIcon,
} from "hugeicons-react";

const data = {
  teams: [
    { name: "Acme Inc" },
    { name: "Acme Corp." },
    { name: "Evil Corp." },
  ],
  navMain: [
    {
      title: "Menu principal",
      url: "#",
      items: [
        { title: "Accueil", icon: Home01Icon, url: "/admin" },
        { title: "Planning", icon: Calendar02Icon, url: "/admin/presences" },
        { title: "Congés", icon: WorkHistoryIcon, url: "/admin/conges" },
      ],
    },
    {
      title: "Menu Secondaire",
      url: "#",
      items: [
        { title: "Pointages", icon: CursorPointer02Icon, url: "/admin/pointages" },
        { title: "Ressources Humaines", icon: UserListIcon, url: "/admin/employer" },
        { title: "Messages", icon: Message01Icon, url: "/admin/message" },
      ],
    },
    {
      title: "Aide et Analyse",
      url: "#",
      items: [
        { title: "Rapports", icon: Analytics02Icon, url: "/admin/rapports" },
        { title: "Paramètres", icon: Settings02Icon, url: "/admin/parametres" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // State pour garder la route active
  const [activeUrl, setActiveUrl] = React.useState<string>("/admin/employer"); // valeur par défaut

  // Gestion du clic sur un menu
  const handleMenuClick = (url: string) => {
    setActiveUrl(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeUrl === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          onClick={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            handleMenuClick(item.url);
                          }}
                          className={`flex items-center space-x-2 rounded-none px-2 py-3 h-fit transition-colors ${
                            isActive
                              ? "border-l-4 border-Primaire text-Primaire font-semibold bg-bleu-ciel"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {Icon && (
                            <Icon
                              size={24}
                              color={isActive ? "#344EA2" : "#142938"}
                            />
                          )}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
