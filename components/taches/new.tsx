import { Separator } from "@radix-ui/react-separator";
import {
  Add01Icon,
  Cancel01Icon,
  Edit01Icon,
  PencilEdit01Icon,
  Time02Icon,
} from "hugeicons-react";
import React from "react";

const New = () => {
  return (
    <div className="flex flex-col gap-2 py-2 px-3">
      <div className="flex flex-row justify-between">
        <p className="font-semibold">Créer une taches</p>
        <Cancel01Icon />
      </div>
      <div className="flex flex-row px-3 border rounded-xl items-center justify-between">
        <PencilEdit01Icon />
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          className="w-[80%] h-full py-2 outline-0"
        />
      </div>
      <div className="flex flex-row px-3 border rounded-xl items-center justify-between">
        <Edit01Icon />
        <input
          type="text"
          name="titre"
          placeholder="Description"
          className="w-[80%] h-full py-2 outline-0"
        />
      </div>
      <div className="flex flex-row px-3 border rounded-xl items-center justify-between">
        <Time02Icon />
        <select className="w-[80%] h-full py-2 outline-0">
          <option value="15">15 Minutes</option>
          <option value="30">30 Minutes</option>
          <option value="45">45 Minutes</option>
          <option value="60">1 Heure</option>
          <Separator />
          <option value="75">1 Heure 15 Minutes</option>
          <option value="90">1 Heure 30 Minutes</option>
          <option value="105">1 Heure 45 minutes</option>
          <option value="120">2 Heures</option>
        </select>
      </div>
      <button
        name="Creer une tache"
        className="custom-button-gradient py-2 w-full flex flex-row items-center gap-2 px-3 rounded-lg"
      >
        <Add01Icon />
        Creer une tache
      </button>
    </div>
  );
};

export default New;
