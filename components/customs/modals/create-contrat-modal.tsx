import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
}

const CreateModal = ({ open, setOpen, children, className = "" }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent className={cn("w-[600px] p-0 ", className)}>
        <div className="  relative">
          <div className="absolute -top-14 -right-14 w-[250px] h-[250px] rounded-full bg-blue-300/15 blur-xl" />
          <div className="absolute -bottom-14 -left-14 w-[250px] h-[250px] rounded-full bg-blue-300/15 blur-xl" />
          <div className="relative z-10 p-4">
            <ScrollArea className="h-[calc(100vh-100px)]">
              {children}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateModal;
