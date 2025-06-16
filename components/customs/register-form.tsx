"use client";
import NextManageIcon from "@/icons/logo";
import AuthLayout from "@/layouts/auth-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as RPNInput from "react-phone-number-input";
import {
  registerSchema,
  RegisterSchema,
} from "@/schemas/auth.schemas/register.schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FlagComponent } from "./flag-component";
import { CountrySelect } from "./country-selected";
import { useState, useMemo } from "react";
import { PhoneInput } from "./phone-input";
import { EyeIcon, EyeOffIcon, Frown, Meh, Smile } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Google } from "@/icons/google";
import Link from "next/link";
import { Button } from "../ui/button";

const RegisterForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Au moins 8 caractères" },
      { regex: /[0-9]/, text: "Au moins 1 chiffre" },
      { regex: /[a-z]/, text: "Au moins 1 minuscule" },
      { regex: /[A-Z]/, text: "Au moins 1 majuscule" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Surveiller les changements du mot de passe
  const watchedPassword = form.watch("password");
  const watchedTerms = form.watch("terms");

  const strength = useMemo(
    () => checkStrength(watchedPassword || ""),
    [watchedPassword]
  );

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return;
    if (score <= 2)
      return (
        <span className="flex items-center gap-1 text-red-500">
          <Frown size={20} aria-hidden="true" />
          Mot de passe faible
        </span>
      );
    if (score === 3)
      return (
        <span className="flex items-center gap-1 text-amber-500">
          <Meh size={20} aria-hidden="true" />
          Mot de passe moyen
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-emerald-500">
        <Smile size={20} aria-hidden="true" />
        Mot de passe fort
      </span>
    );
  };

  const onSubmit = (data: RegisterSchema) => console.log(data);

  return (
    <AuthLayout>
      <NextManageIcon />
      <div className="flex flex-col items-center gap-4 w-full lg:justify-center">
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold  text-[#344EA2]">
            Créer un compte
          </h1>
          <p className="text-base tracking-tighter font-medium text-center mt-2 text-muted-foreground">
            Créez facilement votre compte
          </p>
        </div>
        <Form {...form}>
          <form
            className="space-y-2 relative z-20 max-w-[400px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium ">
                      <span className="bg-background inline-flex px-2">
                        {"Nom d'utilisateur"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Votre nom"
                        type="text"
                        aria-label=""
                        className=""
                      />
                    </FormControl>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative group ">
                    <FormLabel className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium ">
                      <span className="bg-background inline-flex px-2">
                        Votre mot de passe
                      </span>
                    </FormLabel>

                    <FormControl>
                      <div>
                        <Input
                          {...field}
                          placeholder="*******"
                          type={isVisible ? "text" : "password"}
                          aria-label=""
                          className="pr-10"
                        />

                        <button
                          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                          type="button"
                          onClick={toggleVisibility}
                          aria-label={
                            isVisible ? "Hide password" : "Show password"
                          }
                          aria-pressed={isVisible}
                          aria-controls="password"
                        >
                          {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                          ) : (
                            <EyeIcon size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </div>

                  {/* Indicateur de force du mot de passe */}
                  {watchedPassword && (
                    <div className="mt-2">
                      <div
                        className="bg-border h-1 w-full  overflow-hidden rounded-full"
                        role="progressbar"
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label="Password strength"
                      >
                        <div
                          className={`h-full  ${getStrengthColor(
                            strengthScore
                          )} transition-all duration-500 ease-out`}
                          style={{ width: `${(strengthScore / 4) * 100}%` }}
                        />
                      </div>
                      {/* Description de la force du mot de passe */}
                      <p className="text-foreground text-xs mt-2 font-medium">
                        {getStrengthText(strengthScore)}
                      </p>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="group relative">
                  <FormLabel className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium ">
                    <span className="bg-background inline-flex px-2">
                      Confirmer le mot de passe
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        {...field}
                        placeholder="*******"
                        type={isPasswordVisible ? "text" : "password"}
                        aria-label=""
                        className=""
                      />
                      <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          isPasswordVisible
                            ? "Hide confirmPassword"
                            : "Show confirmPassword"
                        }
                        aria-pressed={isPasswordVisible}
                        aria-controls="confirmPassword"
                      >
                        {isPasswordVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-3.5">
                  <FormLabel className="sr-only">Terms</FormLabel>
                  <FormControl>
                    <div className="flex gap-1.5">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 cursor-pointer"
                      />
                      <small className="text-muted-foreground text-xs">
                        {"J'ai lu et j'accepte les "}
                        <Link href={"/terms"}>
                          <strong className="text-[#142938] cursor-pointer">
                            Termes et conditions
                          </strong>
                        </Link>{" "}
                        ainsi que{" "}
                        <Link href={"/police"}>
                          <strong className="text-[#142938] cursor-pointer">
                            la Politique de confidentialité
                          </strong>{" "}
                        </Link>
                      </small>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              disabled={!watchedTerms}
              type="submit"
              className="custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Créer mon compte
            </button>
            <div className="relative z-20">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" aria-hidden="true" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {"ou s'inscrire avec"}
                </span>
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full">
              <Google className="mr-2 size-5" />
              {"S'inscrire avec Google"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="px-6 flex justify-between mt-6 flex-wrap  z-20 relative">
        <p className="text-muted-foreground text-xs mt-2 font-medium">
          Vous avez déjà un compte ?{" "}
          <Link href="/auth/login" className="text-[#142938] underline">
            Se connecter
          </Link>
        </p>
        <p className="text-muted-foreground text-xs mt-2 font-medium">
          <Link href={"/terms"} className="underline">
            Conditions générales
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
