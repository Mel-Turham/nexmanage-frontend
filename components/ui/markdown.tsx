"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assurez-vous que ce chemin est correct pour votre utilitaire de classes

// Importations nécessaires pour la visualisation Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Pour la prise en charge des extensions Markdown (tables, etc.)

export default function MarkdownToolbarEditor() {
  const [markdown, setMarkdown] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Référence pour manipuler le textarea directement
  const [activeFormats, setActiveFormats] = useState<{
    [key: string]: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
  });

  /**
   * Applique ou supprime un format Markdown (gras, italique, souligné) sur le texte sélectionné
   * ou insère le format à la position du curseur.
   * @param prefix Le caractère(s) à insérer avant le texte (ex: '**' pour gras)
   * @param suffix Le caractère(s) à insérer après le texte (ex: '**' pour gras)
   */
  const handleApplyFormat = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newMarkdown;
    let newCursorPos;
    const newSelectionLength = selectedText.length; // Longueur de la sélection après application

    // Vérifie si le format est déjà appliqué au texte sélectionné
    // Note: Ceci est une vérification simplifiée. Pour un cas réel,
    // il faudrait s'assurer que les caractères sont *exactement* autour de la sélection.
    const isAlreadyFormatted =
      markdown.substring(start - prefix.length, start) === prefix &&
      markdown.substring(end, end + suffix.length) === suffix;

    if (isAlreadyFormatted) {
      // Si déjà formaté, supprime le format
      newMarkdown =
        markdown.substring(0, start - prefix.length) +
        selectedText +
        markdown.substring(end + suffix.length);
      newCursorPos = start - prefix.length;
    } else {
      // Sinon, applique le format
      newMarkdown =
        markdown.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        markdown.substring(end);
      newCursorPos = start + prefix.length;
    }

    setMarkdown(newMarkdown);

    // Repositionne le curseur ou la sélection dans le textarea après la mise à jour du DOM
    setTimeout(() => {
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos + newSelectionLength;
      textarea.focus(); // Remet le focus sur le textarea
    }, 0);

    // Met à jour l'état visuel du bouton pour le format concerné
    if (prefix === "**")
      setActiveFormats((prev) => ({ ...prev, bold: !prev.bold }));
    if (prefix === "*")
      setActiveFormats((prev) => ({ ...prev, italic: !prev.italic }));
    if (prefix === "__")
      setActiveFormats((prev) => ({ ...prev, underline: !prev.underline }));
  };

  /**
   * Insère un texte Markdown statique (comme un élément de liste) à la position du curseur.
   * @param textToInsert Le texte Markdown à insérer (ex: '- ' pour une puce de liste)
   */
  const handleInsertStatic = (textToInsert: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newMarkdown =
      markdown.substring(0, start) + textToInsert + markdown.substring(end);

    setMarkdown(newMarkdown);

    // Place le curseur après le texte inséré
    setTimeout(() => {
      textarea.selectionStart = start + textToInsert.length;
      textarea.selectionEnd = start + textToInsert.length;
      textarea.focus();
    }, 0);
  };

  /**
   * Gère l'insertion d'un lien Markdown, en utilisant le texte sélectionné si disponible,
   * et positionne intelligemment le curseur pour l'édition de l'URL.
   */
  const handleLinkInsert = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    const linkText = selectedText || "texte"; // Utilise le texte sélectionné ou 'texte' par défaut

    // Insère le format de lien avec le texte sélectionné ou par défaut
    const newMarkdown =
      markdown.substring(0, start) +
      `[${linkText}](url)` +
      markdown.substring(end);

    setMarkdown(newMarkdown);

    // Calcule la nouvelle position du curseur pour qu'il soit sur 'url'
    // La position sera : début + longueur du texte entre [] + 3 (pour `[`, `]`, `(`)
    const newCursorPos = start + linkText.length + 3;

    // Sélectionne 'url' pour une édition facile
    setTimeout(() => {
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos + 3; // Sélectionne les 3 caractères de 'url'
      textarea.focus();
    }, 0);
  };

  return (
    <div className="w-full">
      {/* Barre d'outils Markdown */}
      <div className="flex items-center space-x-3 border border-slate-300 rounded-xl p-2 mb-2 text-slate-600 text-xs select-none">
        {/* Bouton pour "aucun format" / texte normal */}
        <Button
          variant="ghost"
          size="sm"
          className={`font-semibold px-2 py-1 ${
            Object.values(activeFormats).every((f) => !f) ? "bg-sky-100" : ""
          }`}
          onClick={() =>
            setActiveFormats({ bold: false, italic: false, underline: false })
          }
          title="Texte normal"
        >
          T
        </Button>
        {/* Bouton Gras */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            `font-bold px-2 py-1`,
            activeFormats.bold ? "bg-sky-200" : ""
          )}
          onClick={() => handleApplyFormat("**", "**")}
          title="Gras (Ctrl+B)"
        >
          <Bold className="h-3 w-3" />
        </Button>
        {/* Bouton Italique */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            `italic px-2 py-1`,
            activeFormats.italic ? "bg-sky-200" : ""
          )}
          onClick={() => handleApplyFormat("*", "*")}
          title="Italique (Ctrl+I)"
        >
          <Italic className="h-3 w-3" />
        </Button>
        {/* Bouton Souligné (non standard en Markdown pur, mais courant) */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            `underline px-2 py-1`,
            activeFormats.underline ? "bg-sky-200" : ""
          )}
          onClick={() => handleApplyFormat("__", "__")}
          title="Souligné"
        >
          <Underline className="h-3 w-3" />
        </Button>
        {/* Bouton Lien */}
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={handleLinkInsert}
          title="Insérer un lien (Ctrl+K)"
        >
          <LinkIcon className="h-3 w-3" />
        </Button>
        {/* Bouton Liste à puces */}
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={() => handleInsertStatic("- ")}
          title="Liste à puces"
        >
          <List className="h-3 w-3" />
        </Button>
        {/* Bouton Liste numérotée */}
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={() => handleInsertStatic("1. ")}
          title="Liste numérotée"
        >
          <ListOrdered className="h-3 w-3" />
        </Button>
      </div>

      {/* Conteneur pour l'éditeur et la prévisualisation (disposition en grille) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zone de l'éditeur (textarea) */}
        <textarea
          ref={textareaRef}
          rows={8}
          className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300 font-mono"
          placeholder="Écris ton Markdown ici..."
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)} // Met à jour l'état du Markdown à chaque saisie
          onSelect={() => {
            // Optionnel: Réinitialise l'état visuel des boutons de format quand la sélection change.
            // Une implémentation plus avancée pourrait détecter les formats existants dans la sélection.
            setActiveFormats({ bold: false, italic: false, underline: false });
          }}
        />

        {/* Zone de prévisualisation Markdown */}
        <div className="markdown-preview p-4 border border-slate-300 rounded-xl bg-white overflow-y-auto no-scrollbar h-full min-h-[160px]">
          {/* Le composant ReactMarkdown rend le texte Markdown en HTML */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
