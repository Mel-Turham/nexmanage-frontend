'use client';

import React, { useState } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarkdownToolbarEditor() {
  const [markdown, setMarkdown] = useState<string>('');
  const [selection, setSelection] = useState<[number, number]>([0, 0]);
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({});

  const toggleFormat = (key: string) => {
    setActiveFormats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFormats = (text: string) => {
    if (activeFormats.bold) text = `**${text}**`;
    if (activeFormats.italic) text = `*${text}*`;
    if (activeFormats.underline) text = `__${text}__`;
    return text;
  };

  const handleInsert = (value: string) => {
    const [start, end] = selection;
    const selected = markdown.slice(start, end);
    const formatted = applyFormats(selected || value);
    const newText = markdown.slice(0, start) + formatted + markdown.slice(end);
    setMarkdown(newText);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const [start, end] = selection;
    const typedChar = e.target.value[end];
    if (Object.values(activeFormats).some(Boolean)) {
      const before = markdown.slice(0, start);
      const after = markdown.slice(end);
      const inserted = applyFormats(typedChar);
      const newText = before + inserted + after;
      setMarkdown(newText);
      setSelection([start + inserted.length, start + inserted.length]);
    } else {
      setMarkdown(e.target.value);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 border border-slate-300 rounded-xl p-2 mb-2 text-slate-600 text-xs select-none">
        <Button
          variant="ghost"
          size="sm"
          className={`font-semibold px-2 py-1 ${Object.values(activeFormats).every(f => !f) ? 'bg-sky-100' : ''}`}
          onClick={() => setActiveFormats({})}
        >
          T
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`font-bold px-2 py-1 ${activeFormats.bold ? 'bg-sky-200' : ''}`}
          onClick={() => toggleFormat('bold')}
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`underline px-2 py-1 ${activeFormats.underline ? 'bg-sky-200' : ''}`}
          onClick={() => toggleFormat('underline')}
        >
          <Underline className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`italic px-2 py-1 ${activeFormats.italic ? 'bg-sky-200' : ''}`}
          onClick={() => toggleFormat('italic')}
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={() => handleInsert('[texte](url)')}
        >
          <LinkIcon className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={() => handleInsert('- ')}
        >
          <List className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={() => handleInsert('1. ')}
        >
          <ListOrdered className="h-3 w-3" />
        </Button>
      </div>

      <textarea
        rows={8}
        className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300 font-mono"
        placeholder="Écris en Markdown ici..."
        value={markdown}
        onChange={handleTyping}
        onSelect={(e) =>
          setSelection([e.currentTarget.selectionStart, e.currentTarget.selectionEnd])
        }
      />
    </div>
  );
}