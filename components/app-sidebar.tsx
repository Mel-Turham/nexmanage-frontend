"use client";
import { usePathname } from "next/navigation";
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
  Analytics02Icon,
  Calendar02Icon,
  CursorPointer02Icon,
  Home01Icon,
  Message01Icon,
  UserListIcon,
  WorkHistoryIcon,
} from 'hugeicons-react';
import Link from 'next/link';
const data = {
  navMain: [
    {
      // title: "Menu principal",
      // url: "#",
      items: [
        { title: "Accueil", icon: Home01Icon, url: "/admin" },
        { title: "Planning", icon: Calendar02Icon, url: "/admin/planning" },
        { title: "Congés", icon: WorkHistoryIcon, url: "/admin/conges" },
        {
          title: "Pointages",
          icon: CursorPointer02Icon,
          url: "/admin/pointages",
        },
        {
          title: "Ressources Humaines",
          icon: UserListIcon,
          url: "/admin/employer",
        },
        { title: "Messages", icon: Message01Icon, url: "/admin/message" },
        { title: "Rapports", icon: Analytics02Icon, url: "/admin/rapports" },
        // { title: "Paramètres", icon: Settings02Icon, url: "/admin/parametres" },
      ],
    },
  ],
};

    
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group, index) => (
          <SidebarGroup key={index}>
            {/* <SidebarGroupLabel>{group.title}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link

                          href={`${item.url}`}
                          className={`flex items-center space-x-2 rounded-none px-2 py-3 h-fit transition-all duration-200 ${
                            isActive
                              ? "border-l-4 border-Primaire text-Primaire font-semibold bg-bleu-ciel"
                              : "text-gray-700 hover:bg-gray-100 hover:text-Primaire"
                          }`}
                        >
                          {Icon && (
                            <Icon
                              size={24}
                              color={isActive ? "#344EA2" : "#142938"}
                              className="transition-colors duration-200"
                            />
                          )}
                          <span className="transition-colors duration-200">
                            {item.title}
                          </span>
                        </Link>
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

export { Sidebar };
