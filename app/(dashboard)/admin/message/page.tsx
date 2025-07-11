"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SendHorizontal,
  MessageSquare,
  Search,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewChatModal from "@/components/message/modal-new";
import { Role, Utilisateur } from "@/types";

interface Message {
  id: string;
  from: "me" | string;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file";
}

interface Conversation {
  id: number;
  name: string;
  initials?: string;
  avatar?: string;
  preview: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
  messages: Message[];
}

export default function WhatsAppStyleChatPage() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Jason K.",
      initials: "JK",
      avatar: "/user.png",
      preview: "D'accord, je vais jeter un coup d'œil cet après-midi.",
      time: "14:32",
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: "1",
          from: "JK",
          text: "Bonjour! Comment ça va?",
          time: "09:15",
          status: "read",
        },
        {
          id: "2",
          from: "me",
          text: "Salut Jason! Ça va bien, merci. As-tu terminé le rapport?",
          time: "09:20",
          status: "read",
        },
        {
          id: "3",
          from: "JK",
          text: "Pas encore, j'ai eu quelques urgences ce matin.",
          time: "09:22",
          status: "read",
        },
        {
          id: "4",
          from: "me",
          text: "Pas de problème, prends ton temps.",
          time: "09:25",
          status: "read",
        },
        {
          id: "5",
          from: "JK",
          text: "D'accord, je vais jeter un coup d'œil cet après-midi.",
          time: "14:32",
          status: "delivered",
        },
      ],
    },
    {
      id: 2,
      name: "Sandra M.",
      initials: "SM",
      avatar: "/user.png",
      preview: "Parfait, à demain alors!",
      time: "13:45",
      unreadCount: 0,
      isOnline: false,
      lastSeen: "il y a 2h",
      messages: [
        {
          id: "1",
          from: "SM",
          text: "Salut, comment ça va ?",
          time: "08:10",
          status: "read",
        },
        {
          id: "2",
          from: "me",
          text: "Je vais bien, merci Sandra ! Et toi?",
          time: "08:12",
          status: "read",
        },
        {
          id: "3",
          from: "SM",
          text: "Très bien! On se voit demain pour la réunion?",
          time: "13:40",
          status: "read",
        },
        {
          id: "4",
          from: "me",
          text: "Oui, bien sûr! À 10h comme prévu.",
          time: "13:42",
          status: "read",
        },
        {
          id: "5",
          from: "SM",
          text: "Parfait, à demain alors!",
          time: "13:45",
          status: "read",
        },
      ],
    },
    {
      id: 3,
      name: "Manager RH",
      initials: "MR",
      avatar: "/user.png",
      preview: "Pouvez-vous m'envoyer le fichier ?",
      time: "10:30",
      unreadCount: 1,
      isOnline: true,
      messages: [
        {
          id: "1",
          from: "MR",
          text: "Pouvez-vous m'envoyer le fichier de planning?",
          time: "10:30",
          status: "delivered",
        },
      ],
    },
    {
      id: 4,
      name: "Équipe Maintenance",
      initials: "EM",
      avatar: "/user.png",
      preview: "Intervention terminée avec succès",
      time: "hier",
      unreadCount: 0,
      isOnline: false,
      lastSeen: "hier à 17:30",
      messages: [
        {
          id: "1",
          from: "EM",
          text: "Bonjour, nous avons terminé la maintenance.",
          time: "17:25",
          status: "read",
        },
        {
          id: "2",
          from: "me",
          text: "Parfait! Tout s'est bien passé?",
          time: "17:27",
          status: "read",
        },
        {
          id: "3",
          from: "EM",
          text: "Intervention terminée avec succès",
          time: "17:30",
          status: "read",
        },
      ],
    },
  ]);

  const [currentConvId, setCurrentConvId] = useState(1);

  const currentConversation = conversations.find((c) => c.id === currentConvId);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChatList(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: "me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    const newConversations = conversations.map((conv) => {
      if (conv.id === currentConvId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          preview: message,
          time: newMessage.time,
        };
      }
      return conv;
    });

    setConversations(newConversations);
    setMessage("");

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === currentConvId) {
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
              ),
            };
          }
          return conv;
        })
      );
    }, 1000);
  };

  // Liste utilisateurs fictifs pour création nouvelle discussion/groupe
  const utilisateursDisponibles: Utilisateur[] = [
    {
      idUtilisateur: "u1",
      nom: "Alice",
      email: "alice@example.com",
      motDePasse: "",
      telephone: "",
      role: Role.EMPLOYE,
      isActif: false,
      entreprise: [],
    },
    {
      idUtilisateur: "u2",
      nom: "Bob",
      email: "bob@example.com",
      motDePasse: "",
      telephone: "",
      role: Role.EMPLOYE,
      isActif: false,
      entreprise: [],
    },
    {
      idUtilisateur: "u3",
      nom: "Charlie",
      email: "charlie@example.com",
      motDePasse: "",
      telephone: "",
      role: Role.EMPLOYE,
      isActif: false,
      entreprise: [],
    },
    {
      idUtilisateur: "u4",
      nom: "Denise",
      email: "denise@example.com",
      motDePasse: "",
      telephone: "",
      role: Role.EMPLOYE,
      isActif: false,
      entreprise: [],
    },
  ];

  const handleAddConversation = (employee: Utilisateur) => {
    const exists = conversations.find((c) => c.name === employee.nom);
    if (!exists) {
      const newConv: Conversation = {
        id: conversations.length + 1,
        name: employee.nom,
        initials: employee.nom
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
        avatar: "/user.png",
        preview: "",
        time: "",
        unreadCount: 0,
        isOnline: false,
        messages: [],
      };
      setConversations([...conversations, newConv]);
      setCurrentConvId(newConv.id);
    }
    setIsModalOpen(false);
  };

  const handleCreateGroup = (groupName: string, members: Utilisateur[]) => {
    if (!groupName.trim() || members.length === 0) {
      alert(
        "Veuillez saisir un nom de groupe et sélectionner au moins un membre."
      );
      return;
    }
    const newGroupConv: Conversation = {
      id: conversations.length + 1,
      name: groupName,
      initials: groupName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      avatar: "/group.png",
      preview: "",
      time: "",
      unreadCount: 0,
      isOnline: false,
      messages: [],
    };
    setConversations([...conversations, newGroupConv]);
    setCurrentConvId(newGroupConv.id);
    setIsModalOpen(false);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMessageStatus = (status?: string) => {
    switch (status) {
      case "sent":
        return <Check size={16} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={16} className="text-gray-400" />;
      case "read":
        return <CheckCheck size={16} className="text-blue-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  const handleSelectConversation = (convId: number) => {
    setCurrentConvId(convId);
    if (isMobileView) {
      setShowChatList(false);
    }
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === convId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  return (
    <div className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
      <div className="w-full h-full flex">
        {/* Left Panel - Chat List */}
        <div
          className={`${
            isMobileView ? (showChatList ? "w-full" : "hidden") : "w-80"
          } h-full border-r border-gray-200 flex flex-col bg-white`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4.5 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Messages</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <MessageSquare size={20} className="text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-1 border-gray shadow-none focus:bg-white"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectConversation(chat.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    chat.id === currentConvId
                      ? "bg-blue-50 border-b-0 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {chat.initials}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1  w-[70%]">
                      <p className="font-semibold text-gray-900 truncate">
                        {chat.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {chat.time}
                        </span>
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate w-[50%]">
                      {chat.preview}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Chat */}
        <div
          className={`${
            isMobileView ? (showChatList ? "hidden" : "w-full") : "flex-1"
          } h-full flex flex-col bg-white`}
        >
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
                {isMobileView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                )}

                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={currentConversation.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {currentConversation.initials}
                    </AvatarFallback>
                  </Avatar>
                  {currentConversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {currentConversation.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentConversation.isOnline
                      ? "En ligne"
                      : currentConversation.lastSeen || "Hors ligne"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-4 bg-white">
                <div className="space-y-4">
                  {currentConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.from === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.from === "me"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.text}
                        </p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            msg.from === "me"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{msg.time}</span>
                          {msg.from === "me" && getMessageStatus(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form
                className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white"
                onSubmit={handleSend}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Paperclip size={20} className="text-gray-500" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Écrivez un message..."
                    className="pr-10 border border-gray shadow-none focus:bg-white rounded-full"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full w-fit px-3"
                >
                  <SendHorizontal size={20} className="text-white" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare
                  size={64}
                  className="text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500">
                  Choisissez une conversation pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddConversation}
        onCreateGroup={handleCreateGroup}
        utilisateurs={utilisateursDisponibles}
      />
    </div>
  );
}
