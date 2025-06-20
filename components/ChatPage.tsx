'use client';

import React, { useState, useEffect, useRef } from 'react'; // Added useRef and useEffect for scroll
import Head from 'next/head';
import { SendHorizontal, MessageSquare, X as CloseIcon } from 'lucide-react'; // Added CloseIcon for the sheet
import NewChatModal from '@/components/modal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'; // Import Sheet components
import { Utilisateur } from '@/types';

// --- Définition des types pour une meilleure sécurité ---
interface Message {
  from: 'me' | string; // 'me' ou le nom de l'expéditeur
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  initials?: string;
  preview: string;
  messages: Message[];
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Jason K.',
      initials: 'JK',
      preview: "D'accord, je vais jeter…",
      messages: [
        { from: 'JK', text: 'Bonjour!', time: '9:15 AM' },
        { from: 'me', text: 'Bonjour! As-tu terminé le rapport?', time: '9:20 AM' },
        { from: 'JK', text: "D'accord, je vais jeter un coup d'œil cet après-midi.", time: '9:22 AM' },
      ],
    },
    {
      id: 2,
      name: 'Sandra M.',
      initials: 'SM',
      preview: 'Très bien, merci !',
      messages: [
        { from: 'SM', text: 'Salut, comment ça va ?', time: '8:10 AM' },
        { from: 'me', text: "Je vais bien, merci Sandra !", time: '8:12 AM' },
      ],
    },
    {
      id: 3,
      name: 'Manoger RH',
      initials: 'MR',
      preview: "Pouvez-vous m'envoyer le fichier ?",
      messages: [
        { from: 'MR', text: "Pouvez-vous m'envoyer le fichier ?", time: '10:30 AM' },
      ],
    },
  ]);

  const [currentConvId, setCurrentConvId] = useState<number | null>(null); // Initialize with null
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false); // Renamed for clarity
  const [isChatSheetOpen, setIsChatSheetOpen] = useState(false); // State to control the Sheet's open/closed state

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling messages

  const currentConversation: Conversation | undefined = currentConvId
    ? conversations.find((c) => c.id === currentConvId)
    : undefined;

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]); // Scroll when messages change

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!currentConversation) {
      console.warn("No current conversation selected to send message.");
      return;
    }

    const newConversations = conversations.map((conv) => {
      if (conv.id === currentConvId) {
        return {
          ...conv,
          messages: [...conv.messages, { from: 'me', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
          preview: message,
        };
      }
      return conv;
    });

    setConversations(newConversations);
    setMessage('');
  };

  const handleAddConversation = (employee: Utilisateur) => {
    const exists = conversations.find(c => c.name === employee.nom);
    if (!exists) {
      const newConv: Conversation = {
        id: conversations.length > 0 ? Math.max(...conversations.map(c => c.id)) + 1 : 1,
        name: employee.nom,
        // initials: employee.initiales,
        preview: '',
        messages: []
      };
      setConversations([...conversations, newConv]);
      setCurrentConvId(newConv.id);
      setIsChatSheetOpen(true); // Open the sheet for the new conversation
    } else {
        // If conversation already exists, just switch to it and open the sheet
        setCurrentConvId(exists.id);
        setIsChatSheetOpen(true);
    }
    setIsNewChatModalOpen(false);
  };

  const openConversationInSheet = (chatId: number) => {
    setCurrentConvId(chatId);
    setIsChatSheetOpen(true); // Open the sheet
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg flex"> {/* Changed to flex for overall layout */}
      <Head>
        <title>Chat UI</title>
      </Head>

      {/* Left Panel (Always visible) */}
      <div className="w-full md:w-80 h-full border-r border-gray-200 flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-gray-600">Chats</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-search"></i> {/* Consider replacing with a Lucide icon */}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => openConversationInSheet(chat.id)} // Open sheet on click
              className={`flex items-center gap-3 w-full px-4 py-3 text-left ${
                chat.id === currentConvId ? 'bg-blue-100 border-l-4 border-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#237bd4] text-white font-semibold text-sm">
                {chat.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{chat.name}</p>
                <p className="text-gray-500 text-xs truncate max-w-[140px]">{chat.preview}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 pl-[70%]"> {/* Adjusted padding for button */}
          <button
            onClick={() => setIsNewChatModalOpen(true)} // Opens the new chat selection modal
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800 mx-auto"
          >
            <MessageSquare size={24} color="white" />
          </button>
        </div>
      </div>

      {/* Sheet for Right Panel (Conversation Display) */}
      <Sheet open={isChatSheetOpen} onOpenChange={setIsChatSheetOpen}>
        <SheetContent side="right" className="flex flex-col w-full md:w-[400px] h-full bg-[#f9fbff] p-0">
          {currentConversation ? (
            <>
              {/* Sheet Header */}
              <SheetHeader className="flex flex-row items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold text-sm">
                  {currentConversation.initials}
                </div>
                <div>
                  <SheetTitle className="font-semibold text-gray-800 text-sm">{currentConversation.name}</SheetTitle>
                  <SheetDescription className="text-gray-500 text-xs">En ligne</SheetDescription>
                </div>
                {/* Custom close button for the sheet, if desired, otherwise Sheet provides one by default */}
                <button
                    onClick={() => setIsChatSheetOpen(false)}
                    className="ml-auto p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <CloseIcon size={20} />
                </button>
              </SheetHeader>

              {/* Messages Area */}
              <div className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar bg-white space-y-4">
                {currentConversation.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-xs ${msg.from === 'me' ? 'ml-auto text-right' : ''}`}
                  >
                    <div
                      className={`text-sm rounded-xl px-4 py-2 whitespace-pre-line ${
                        msg.from === 'me'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* For auto-scrolling */}
              </div>

              {/* Message Input Form (Sheet Footer) */}
              <SheetFooter className="flex items-center gap-4 px-6 py-3 border-t border-gray-200 bg-[#f9fbff] sticky bottom-0 z-10 sm:justify-start">
                <form className="flex items-center gap-4 w-full" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Écrivez un message..."
                    className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800"
                    aria-label="Send"
                  >
                    <SendHorizontal size={24} color="white" />
                  </button>
                </form>
              </SheetFooter>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
              Sélectionnez une conversation pour commencer à discuter.
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Chat Modal */}
      <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} onSelect={handleAddConversation} />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}