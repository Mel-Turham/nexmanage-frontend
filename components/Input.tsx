// components/Input.tsx
"use client"; // Indique que c'est un Client Component pour pouvoir utiliser useState

import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Path,
} from "react-hook-form";

// Interface pour les props de notre composant Input
interface InputProps<TFieldValues extends FieldValues> {
  id: string; // ID de l'input, requis pour le label
  label: string;
  type: string; // Garde le type 'password' ou 'text'
  placeholder?: string;
  name: Path<TFieldValues>;
  register?: UseFormRegister<TFieldValues>;
  value: string; // Valeur de l'input, nécessaire pour le contrôle
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Fonction de changement pour gérer la valeurF
  error?: FieldError;
  className?: string; // Permet d'ajouter des classes Tailwind supplémentaires
}

// Composant Input générique
const Input = <TFieldValues extends FieldValues>({
  label,
  type,
  placeholder,
  name,
  error,
  className,
}: InputProps<TFieldValues>) => {
  // État local pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  // Détermine le type d'input réel
  // Si le type est 'password' et que showPassword est true, le type devient 'text', sinon 'password'
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={name as string}
        className="block text-sm font-medium font-urbanist ml-5"
      >
        {label}
      </label>
      <div className="relative">
        {" "}
        {/* Conteneur relatif pour positionner l'icône */}
        <input
          type={inputType} // Utilise le type dynamique
          id={name as string}
          placeholder={placeholder}
          // {...register(name)}
          className={`block w-full px-5 py-3 border rounded-3xl bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
          ${error ? "border-red-500" : "border-black2"}
          ${className || ""}
        `}
        />
        {type === "password" && ( // Affiche l'icône uniquement si le type original est 'password'
          <button
            type="button" // Important : type="button" pour éviter la soumission du formulaire
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 pr-3 flex items-center text-sm leading-5"
          >
            {/* Icône SVG simple pour l'œil ouvert/fermé */}
            {showPassword ? (
              // Icône d'œil ouvert (ex: Heroicons Eye)
              <Eye />
            ) : (
              // Icône d'œil fermé (ex: Heroicons Eye Slash)
              <EyeClosed />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default Input;

