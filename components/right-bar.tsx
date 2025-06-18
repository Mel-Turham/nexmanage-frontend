"use client";

import { useState } from "react";
import { Kanban } from "lucide-react";
import {
  AddCircleIcon,
  Calendar02Icon,
  CancelCircleHalfDotIcon,
  FilterMailCircleIcon,
  Megaphone02Icon,
  TaskAdd02Icon,
  UserAdd01Icon,
  WorkHistoryIcon,
} from "hugeicons-react";
// import New from "./taches/new";
import TaskManagementPage from "./taches/TaskManagementPage";

const RightBar = ({
  onToggleKanban,
  isKanbanActive,
}: {
  onToggleKanban: () => void;
  isKanbanActive: boolean;
}) => {
  const [showListe, setShowListe] = useState(false);

  // Toggle Liste via TaskAdd02Icon
  const toggleListe = () => setShowListe((v) => !v);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="contents">
      <div className="flex flex-col gap-1">
        <div
          className={`flex flex-col gap-2 items-center rounded-full p-2 m-3 cursor-pointer bg-bleu-ciel`}
          onClick={onToggleKanban}
          title="Toggle Kanban / Planning"
        >
          <div
            className={`rounded-full p-2 ${
              isKanbanActive ? "bg-white" : "bg-transparent"
            }`}
          >
            <Kanban size={20} />
          </div>
          <div
            className={`rounded-full p-2 ${
              !isKanbanActive ? "bg-white" : "bg-transparent"
            }`}
          >
            <Calendar02Icon size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center bg-bleu-ciel rounded-full p-2 m-3 ">
          <div className="bg-white rounded-full p-2 cursor-pointer">
            <FilterMailCircleIcon size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center bg-bleu-ciel rounded-full p-2 m-3">
          {!isExpanded ? (
            // Affiche AddCircleIcon quand pas étendu
            <div
              className="flex flex-col gap-2 bg-white rounded-full p-2 cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => setIsExpanded(true)}
              title="Afficher options"
            >
              <AddCircleIcon size={20} />
            </div>
          ) : (
            // Affiche le groupe d’icônes quand étendu
            <div
              className="flex flex-col gap-4 bg-white rounded-full p-2 cursor-pointer transition-opacity duration-300 opacity-100"
              title="Options"
            >
              <CancelCircleHalfDotIcon
                className="cursor-pointer hover:text-gray"
                onClick={() => setIsExpanded(false)}
              />
              <UserAdd01Icon
                className="cursor-pointer hover:text-gray"
                size={20}
              />
              <WorkHistoryIcon
                className="cursor-pointer hover:text-gray"
                size={20}
              />
              <Megaphone02Icon
                className="cursor-pointer hover:text-gray"
                size={20}
              />
              <TaskAdd02Icon
                className="cursor-pointer hover:text-gray"
                onClick={toggleListe}
                size={20}
              />
            </div>
          )}
        </div>
      </div>

      {/* Contenu Liste affiché / masqué */}
      {showListe && (
        // <div className="bg-bleu-ciel p-5 pb-0 pr-0 h-full w-full rounded-tl-4xl transition-opacity duration-300 ease-in-out opacity-100">
        //   <div className="bg-white h-full pr-0 rounded-tl-2xl">
        //     {/* <Liste /> */}
        //     <New />
        //   </div>
        // </div>
        <TaskManagementPage />
      )}
    </div>
  );
};

export default RightBar;
