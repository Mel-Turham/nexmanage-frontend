// New.tsx
// import { Separator } from "@radix-ui/react-separator"; // Note: Separator is for UI, not functional HTML option grouping
import {
  Add01Icon,
  Cancel01Icon,
  Edit01Icon,
  PencilEdit01Icon,
  Time02Icon,
} from "hugeicons-react";
import React from "react";

// Define props interface for clarity
interface NewProps {
  onClose: () => void; // Function to call when the component should close
  onTaskCreated: () => void; // Function to call when a task is successfully created
}

const New: React.FC<NewProps> = ({ onClose, onTaskCreated }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the new task (e.g., send to API, update state)
    console.log("Task created!");
    // After task is created, navigate back to the list
    onTaskCreated();
  };

  return (
    <div className="flex flex-col gap-2 py-2 px-3">
      <div className="flex flex-row justify-between">
        <p className="font-semibold">Créer une tâche</p>
        {/* Call onClose when the Cancel icon is clicked */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Cancel01Icon size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {" "}
        {/* Wrap inputs in a form */}
        <div className="flex flex-row px-2 border rounded-xl items-center justify-between">
          <PencilEdit01Icon size={20} />
          <input
            type="text"
            name="titre"
            placeholder="Titre"
            className="w-[80%] h-full py-2 outline-0"
          />
        </div>
        <div className="flex flex-row px-2 border rounded-xl items-center justify-between">
          <Edit01Icon size={20} />
          <input
            type="text"
            name="description" // Changed name to 'description' for clarity
            placeholder="Description"
            className="w-[80%] h-full py-2 outline-0"
          />
        </div>
        <div className="flex flex-row px-2 border rounded-xl items-center justify-between">
          <Time02Icon size={20} />
          <select className="w-[80%] h-full py-2 outline-0">
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">1 Heure</option>
            <option value="90">1 Heure 30 Minutes</option>
            <option value="105">1 Heure 45 minutes</option>
            <option value="120">2 Heures</option>
          </select>
        </div>
        <button
          type="submit" // Important: set type to "submit" for form submission
          name="Creer une tache"
          className="custom-button-gradient py-2 w-full flex flex-row items-center gap-2 px-3 rounded-lg justify-center" // Added justify-center for icon+text alignment
        >
          <Add01Icon size={20} />
          Créer une tâche
        </button>
      </form>
    </div>
  );
};

export default New;
