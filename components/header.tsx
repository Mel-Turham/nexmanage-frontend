import { Search01Icon } from "hugeicons-react";
import { NavUser } from "./nav-user";
// import { useState } from "react";
// import notifications from "@/data/notifications.json";
import Notifications from "./notifications";

const Header = () => {
  // const [notificationOpen, setNotificationOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  // const unreadCount = notifications.filter((n) => !n.read).length;

  // const markAsRead = (id: number) => {
  //   // Ici vous pourriez mettre à jour l&apos;état des notifications
  //   console.log("Marquer comme lu:", id);
  // };

  // const markAllAsRead = () => {
  //   // Ici vous pourriez marquer toutes les notifications comme lues
  //   console.log("Marquer tout comme lu");
  // };

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };
  return (
    <header className="flex flex-row justify-between h-[10vh] shrink-0 items-center gap-2 px-4">
      <div className="flex flex-row items-center px-2 rounded-md border border-gray w-[40%] focus-within:shadow-md focus-within:border-blue-500 transition-all duration-200">
        <Search01Icon color="#e5e5e5" size={24} />
        <input
          type="search"
          name="search"
          placeholder="Recherche un employer, un contrat,..."
          className="py-3 px-4 w-full outline-none text-sm"
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Notifications />
        <NavUser user={data.user} />
      </div>
    </header>
  );
};

export default Header;
