"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { employerSchema } from "@/schemas/employer/employer.schema";
import * as z from "zod";
import { Trash2, CirclePlus } from "lucide-react";
import { UserAdd01Icon } from "hugeicons-react";

const employersArraySchema = z.object({
  employers: z
    .array(employerSchema.pick({ nom: true, email: true }))
    .min(1, "Au moins un employé doit être ajouté"),
});

type FormValues = z.infer<typeof employersArraySchema>;

interface InviterEmployerProps {
  triggerType?: "button" | "icon";
}

export default function InviterEmployer({
  triggerType = "button",
}: InviterEmployerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedFields, setFocusedFields] = useState<
    { nom: boolean; email: boolean }[]
  >([{ nom: false, email: false }]);

  const form = useForm<FormValues>({
    resolver: zodResolver(employersArraySchema),
    defaultValues: {
      employers: [{ nom: "", email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "employers",
  });

  const shouldAnimateLabel = (
    focused: boolean,
    fieldValue: string | undefined
  ) => {
    return focused || (fieldValue && fieldValue.length > 0);
  };

  const setFieldFocus = (
    index: number,
    field: "nom" | "email",
    value: boolean
  ) => {
    setFocusedFields((prev) => {
      const copy = [...prev];
      if (!copy[index]) copy[index] = { nom: false, email: false };
      copy[index][field] = value;
      return copy;
    });
  };

  const onFormSubmit = async (data: FormValues) => {
    try {
      // Appelle ton API ici ou autre traitement
      console.log("Employeurs à inviter :", data.employers);

      toast.success("Invitations envoyées avec succès !");
      setIsOpen(false);
      form.reset();
      setFocusedFields([{ nom: false, email: false }]);
    } catch (error) {
      toast.error("Erreur lors de l’envoi des invitations.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerType === "button" ? (
          <Button className="bg-bleu hover:bg-blue-700 text-white px-6 py-2 rounded-md w-fit flex items-center gap-2">
            Inviter un employé
            <CirclePlus size={20} />
          </Button>
        ) : (
          <UserAdd01Icon
            className="cursor-pointer hover:text-gray-600"
            size={20}
            aria-label="Inviter un employé"
          />
        )}
      </DialogTrigger>

      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Inviter des employeurs
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Ajoutez un ou plusieurs employeurs à inviter.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
          >
            <div className="max-h-[50vh] overflow-auto no-scrollbar flex flex-col gap-2">
              {fields.map((field, index) => {
                const nomValue = form.getValues(`employers.${index}.nom`);
                const emailValue = form.getValues(`employers.${index}.email`);
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`employers.${index}.nom`}
                    render={() => (
                      <FormItem className="border rounded-lg p-4 flex flex-row gap-4 items-center">
                        <FormField
                          control={form.control}
                          name={`employers.${index}.nom`}
                          render={({ field: nomFieldInner }) => (
                            <FormItem className="w-full">
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    {...nomFieldInner}
                                    type="text"
                                    aria-label="Nom d'utilisateur"
                                    className="pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200"
                                    onFocus={() =>
                                      setFieldFocus(index, "nom", true)
                                    }
                                    onBlur={() =>
                                      setFieldFocus(index, "nom", false)
                                    }
                                  />
                                </FormControl>
                                <FormLabel
                                  className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                                    shouldAnimateLabel(
                                      focusedFields[index]?.nom,
                                      nomValue
                                    )
                                      ? "top-0 text-xs text-[#344EA2] -translate-y-1/2"
                                      : "top-1/2 -translate-y-1/2 text-muted-foreground"
                                  }`}
                                >
                                  Nom d&apos;utilisateur
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`employers.${index}.email`}
                          render={({ field: emailField }) => (
                            <FormItem className="w-full">
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    {...emailField}
                                    type="email"
                                    aria-label="Email"
                                    className="pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200"
                                    onFocus={() =>
                                      setFieldFocus(index, "email", true)
                                    }
                                    onBlur={() =>
                                      setFieldFocus(index, "email", false)
                                    }
                                  />
                                </FormControl>
                                <FormLabel
                                  className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                                    shouldAnimateLabel(
                                      focusedFields[index]?.email,
                                      emailValue
                                    )
                                      ? "top-0 text-xs text-[#344EA2] -translate-y-1/2"
                                      : "top-1/2 -translate-y-1/2 text-muted-foreground"
                                  }`}
                                >
                                  Email ou Telephone
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        {fields.length > 1 && (
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                              remove(index);
                              setFocusedFields((prev) => {
                                const copy = [...prev];
                                copy.splice(index, 1);
                                return copy;
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-2"
                            aria-label={`Supprimer employé ${index + 1}`}
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>

            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => {
                append({ nom: "", email: "" });
                setFocusedFields((prev) => [
                  ...prev,
                  { nom: false, email: false },
                ]);
              }}
            >
              + Ajouter un employé
            </Button>

            <DialogFooter>
              <Button type="submit" className="w-full">
                Envoyer les invitations
              </Button>
              {/* <DialogClose asChild>
                <Button variant="ghost" className="w-full mt-2">
                  Annuler
                </Button>
              </DialogClose> */}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
