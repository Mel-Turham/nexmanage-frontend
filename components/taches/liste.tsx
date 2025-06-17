import { Add01Icon, Cancel01Icon } from "hugeicons-react";
import Image from "next/image";
import React from "react";

const Liste = () => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 py-2 px-3">
        <div className="flex flex-row justify-between">
          <p className="font-semibold">Liste de taches</p>
          <Cancel01Icon />
        </div>
        <button
          name="Creer une tache"
          className="custom-button-gradient py-2 w-full flex flex-row items-center gap-2 px-3 rounded-lg"
        >
          <Add01Icon />
          Creer une tache
        </button>
      </div>
      <Image
        src={"/svg/empty-tache.svg"}
        alt={"empty-tache"}
        width={10000}
        height={10000}
        className="h-auto w-full"
      />
    </div>
  );
};

export default Liste;
