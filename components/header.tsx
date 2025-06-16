import { Search01Icon, Notification02Icon } from "hugeicons-react";
import React from "react";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";

const Header = () => {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };
  return (
    <header className="flex h-[10vh] shrink-0 items-center gap-2 px-4">
      <div className="flex flex-row items-center px-2 rounded-md border border-gray w-full">
        <Search01Icon color="#e5e5e5" />
        <input
          type="search "
          name="search"
          placeholder="Recherche un employer, un contrat,..."
          className="py-2 px-4 w-full outline-0"
        />
      </div>
      <Button size={"icon"} variant={"outline"}>
        <Notification02Icon />
      </Button>
      <NavUser user={data.user} />
      {/* <div className="flex flex-row items-center px-3 w-fit">
            <Image
              src={"/user.png"}
              alt="photo de profil"
              width={1000}
              height={1000}
              className="h-full w-10"
            />
            <div className="flex flex-col items-start">
              <h1 className="font-semibold text-lg">Username</h1>
              <p className="text-gray text-sm">696 696 696</p>
            </div>
            <ArrowDown01Icon />
          </div> */}
    </header>
  );
};

export default Header;
