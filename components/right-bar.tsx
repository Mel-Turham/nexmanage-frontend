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
  WorkHistoryIcon,
} from "hugeicons-react";
import TaskManagementPage from "./taches/TaskManagementPage";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
const RightBar = ({
  onToggleKanban,
  isKanbanActive,
}: {
  onToggleKanban: () => void;
  isKanbanActive: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDebut, setOpenDebut] = useState(false);
  const [openFin, setOpenFin] = useState(false);
  const [dateDebut, setDateDebut] = React.useState<Date | undefined>(
    new Date()
  );
  const [dateFin, setDateFin] = React.useState<Date | undefined>(new Date());

  return (
    <div className="contents">
      <div className="flex flex-col gap-1">
        <div
          className={`flex flex-col gap-2 items-center rounded-full p-2 m-3 cursor-pointer bg-bleu-ciel
            transform transition-transform duration-300 ease-in-out
            ${
              isKanbanActive ? "rotate-12" : "rotate-0"
            } // Exemple d'animation: petite rotation
          `}
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

        <Dialog>
          <form>
            <DialogTrigger asChild>
              <div className="flex flex-col gap-5 items-center bg-bleu-ciel rounded-full p-2 m-3 ">
                <div className="bg-white rounded-full p-2 cursor-pointer">
                  <FilterMailCircleIcon size={20} />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Paramétrer une période</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Date de debut </Label>
                  <Popover open={openDebut} onOpenChange={setOpenDebut}>
                    <PopoverTrigger asChild className="xl:w-[28vw]">
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        {dateDebut
                          ? dateDebut.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={dateDebut}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDateDebut(date);
                          setOpenDebut(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Date de fin </Label>
                  <Popover open={openFin} onOpenChange={setOpenFin}>
                    <PopoverTrigger asChild className="xl:w-[28vw]">
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        {dateFin ? dateFin.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={dateFin}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDateFin(date);
                          setOpenFin(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter className="flex flex-wrap">
                <DialogClose asChild>
                  <Button variant="outline" className="xl:w-fit w-full">
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" className="xl:w-fit">
                  Sauvegarder
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <div className="flex flex-col gap-2 items-center bg-bleu-ciel rounded-full p-2 m-3">
          {!isExpanded ? (
            // Affiche AddCircleIcon quand pas étendu
            <div
              className="flex flex-col gap-2 bg-white rounded-full p-2 cursor-pointer
                transition-transform duration-300 hover:scale-110 ease-in-out"
              onClick={() => setIsExpanded(true)}
              title="Afficher options"
            >
              <AddCircleIcon size={20} />
            </div>
          ) : (
            // Affiche le groupe d’icônes quand étendu
            <div
              className="flex flex-col gap-4 bg-white rounded-full p-2 cursor-pointer
                transition-all duration-300 ease-in-out
                opacity-100 transform translate-y-0 
                origin-top
              "
              title="Options"
            >
              <CancelCircleHalfDotIcon
                className="cursor-pointer hover:text-gray"
                onClick={() => setIsExpanded(false)}
              />

              <InviterEmployer triggerType="icon" />
              <WorkHistoryIcon
                className="cursor-pointer hover:text-gray"
                size={20}
              />
              <Megaphone02Icon
                className="cursor-pointer hover:text-gray"
                size={20}
              />

              <Sheet>
                <SheetTrigger asChild>
                  <TaskAdd02Icon
                    className="cursor-pointer hover:text-gray"
                    size={20}
                  />
                </SheetTrigger>
                <SheetContent>
                  <TaskManagementPage />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

// export function CalendarDemo() {
//   return (
//     <Calendar
//       mode="single"
//       selected={date}
//       onSelect={setDate}
//       className="rounded-md border shadow-sm"
//       captionLayout="dropdown"
//     />
//   );
// }

import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InviterEmployer from "@/app/(dashboard)/admin/employer/_components/invite";
