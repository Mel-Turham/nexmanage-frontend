"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import Input from "@/components/Input";
// import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as RPNInput from "react-phone-number-input";
import { useApiMutation } from "@/hooks/apis/use-api";
import { toast } from "sonner";
import { employerSchema } from "@/schemas/employer/employer.schema";
import { FlagComponent } from "@/components/customs/flag-component";
import { PhoneInput } from "@/components/customs/phone-input";
import { CountrySelect } from "@/components/customs/country-selected";

export default function EditEmployer() {
  const [focusedField, setFocusedField] = useState<string>("");
  const form = useForm<employerSchema>({
    resolver: zodResolver(employerSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
    },
  });

  const {
    handleSubmit,
    watch
  } = form;
  type preRegisterData = Pick<employerSchema, "nom" | "email" | "telephone">;
  // mutation pre-register

  const { mutateAsync, isPending, isError } = useApiMutation<
    preRegisterData,
    unknown
  >("POST", "#", {
    onSuccess: (data) => {
      console.log("Données d'inscription:", data);
    },
    onError: (error) => {
      console.error("Erreur d'inscription:", error);
      console.error("error : ", isError);
    },
  });

  const watchedUsername = watch("nom");
  const watchedEmail = watch("email");

  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };

  async function onsubmit(data: employerSchema) {
    try {
      const { ...rest } = data;
      await mutateAsync(rest);
      toast.success("Mise a jours effectuer avec success");
    } catch (error) {
      toast.error("Erreur lors de la mise a jours");
      console.error("Erreur lors de la mise a jours :", error);
    }
  }
  return (
    <DialogContent className="rounded-2xl  max-w-[300px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Modifier le profil
        </DialogTitle>
        <DialogDescription className="text-gray-500">
          {"Modifiez les informations de l'employé"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="space-y-4 relative z-20"
        >
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      type="text"
                      aria-label="Nom d'utilisateur"
                      className="pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200"
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField("")}
                    />
                  </FormControl>
                  <FormLabel
                    className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                      shouldAnimateLabel("username", watchedUsername)
                        ? "top-0 text-xs text-[#344EA2] -translate-y-1/2"
                        : "top-1/2 -translate-y-1/2 text-muted-foreground"
                    }`}
                  >
                    Nom d&apos;utilisateur
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div className="w-full">
                    <RPNInput.default
                      className="flex w-full"
                      international
                      flagComponent={FlagComponent}
                      inputComponent={PhoneInput}
                      countrySelectComponent={CountrySelect}
                      placeholder="Entrez votre numéro"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value || "");
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      aria-label="Email"
                      className="pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField("")}
                    />
                  </FormControl>
                  <FormLabel
                    className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                      shouldAnimateLabel("email", watchedEmail!)
                        ? "top-0 text-xs text-[#344EA2] -translate-y-1/2"
                        : "top-1/2 -translate-y-1/2 text-muted-foreground"
                    }`}
                  >
                    Email
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            disabled={isPending}
            type="submit"
            className="custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {isPending ? "%modification en cours..." : "Sauvegarder"}
          </button>
        </form>
      </Form>
    </DialogContent>
  );
}
