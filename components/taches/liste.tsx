// Liste.tsx
import { Add01Icon} from "hugeicons-react";
import Image from "next/image";
import React from "react";

interface ListeProps {
  onCreateNew: () => void; // Function to call to open the new task form
  onClose: () => void; // Function to call to close the list view (if applicable)
}

const Liste: React.FC<ListeProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 py-2 px-3">
        <div className="flex flex-row justify-between">
          <p className="font-semibold">Liste de tâches</p>
          {/* If you want to close the entire Liste component from here, use onClose */}
          {/* <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Cancel01Icon size={20} />
          </button> */}
        </div>
        <button
          name="Creer une tache"
          className="custom-button-gradient py-2 w-full flex flex-row items-center gap-2 px-3 rounded-lg justify-center"
          onClick={onCreateNew} // This button now calls the onCreateNew prop
        >
          <Add01Icon size={20} />
          Créer une tâche
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
