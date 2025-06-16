// src/components/planning/PlanningHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AddCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewType } from "./types";

interface PlanningHeaderProps {
  viewType: ViewType;
  setViewType: (value: ViewType) => void;
  goToToday: () => void;
  navigate: (direction: "prev" | "next") => void;
  viewTitle: string;
}

const PlanningHeader: React.FC<PlanningHeaderProps> = ({
  viewType,
  setViewType,
  goToToday,
  navigate,
  viewTitle,
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-2 items-center">
        <button
          type="submit"
          className="flex flex-row w-fit custom-button-gradient py-2 px-4 rounded-lg gap-2"
        >
          <AddCircleIcon />
          {"Créer"}
        </button>
        <button
          onClick={goToToday}
          className="flex flex-row w-fit border-2 border-Primaire py-2 px-4 rounded-lg gap-2 text-Primaire text-sm"
        >
          {"Aujoud’hui"}
        </button>
        <Button variant="ghost" size="icon" onClick={() => navigate("prev")}>
          <ArrowLeft01Icon className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => navigate("next")}>
          <ArrowRight01Icon className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold min-w-[200px] text-center">
          {viewTitle}
        </span>
      </div>

      <Select
        value={viewType}
        onValueChange={(value: ViewType) => setViewType(value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Mois">Mois</SelectItem>
          <SelectItem value="Semaine">Semaine</SelectItem>
          <SelectItem value="Jour">Jour</SelectItem>
          <SelectItem value="Année">Année</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PlanningHeader;
