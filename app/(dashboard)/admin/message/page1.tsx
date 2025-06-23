// "use client";

// import React, { useState } from "react";
// import Head from "next/head";
// import { SendHorizontal, MessageSquare } from "lucide-react";
// import NewChatModal from "@/components/modal";

// export default function ChatPage() {
//   const [message, setMessage] = useState("");
//   const [conversations, setConversations] = useState([
//     {
//       id: 1,
//       name: "Jason K.",
//       initials: "JK",
//       preview: "D'accord, je vais jeter…",
//       messages: [
//         { from: "JK", text: "Bonjour!", time: "9:15 AM" },
//         {
//           from: "me",
//           text: "Bonjour! As-tu terminé le rapport?",
//           time: "9:20 AM",
//         },
//         {
//           from: "JK",
//           text: "D'accord, je vais jeter un coup d'œil cet après-midi.",
//           time: "9:22 AM",
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "Sandra M.",
//       initials: "SM",
//       preview: "Très bien, merci !",
//       messages: [
//         { from: "SM", text: "Salut, comment ça va ?", time: "8:10 AM" },
//         { from: "me", text: "Je vais bien, merci Sandra !", time: "8:12 AM" },
//       ],
//     },
//     {
//       id: 3,
//       name: "Manoger RH",
//       initials: "MR",
//       preview: "Pouvez-vous m'envoyer le fichier ?",
//       messages: [
//         {
//           from: "MR",
//           text: "Pouvez-vous m'envoyer le fichier ?",
//           time: "10:30 AM",
//         },
//       ],
//     },
//   ]);

//   const [currentConvId, setCurrentConvId] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const currentConversation = conversations.find((c) => c.id === currentConvId);

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     const newConversations = conversations.map((conv) => {
//       if (conv.id === currentConvId) {
//         return {
//           ...conv,
//           messages: [
//             ...conv.messages,
//             {
//               from: "me",
//               text: message,
//               time: new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               }),
//             },
//           ],
//           preview: message,
//         };
//       }
//       return conv;
//     });

//     setConversations(newConversations);
//     setMessage("");
//   };

//   const handleAddConversation = (employee) => {
//     const exists = conversations.find((c) => c.name === employee.name);
//     if (!exists) {
//       const newConv = {
//         id: conversations.length + 1,
//         name: employee.name,
//         initials: employee.initials,
//         preview: "",
//         messages: [],
//       };
//       setConversations([...conversations, newConv]);
//       setCurrentConvId(newConv.id);
//     }
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
//       <Head>
//         <title>Chat UI</title>
//       </Head>

//       <main className="w-full h-full flex flex-col md:flex-row">
//         {/* Left Panel */}
//         <div className="w-full md:w-80 h-1/2 md:h-full border-r border-gray-200 flex flex-col bg-white">
//           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//             <h2 className="font-semibold text-lg text-gray-600">Chats</h2>
//             <button className="text-gray-400 hover:text-gray-600">
//               <i className="fas fa-search"></i>
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto custom-scrollbar">
//             {conversations.map((chat) => (
//               <button
//                 key={chat.id}
//                 onClick={() => setCurrentConvId(chat.id)}
//                 className={`flex items-center gap-3 w-full px-4 py-3 text-left ${
//                   chat.id === currentConvId
//                     ? "bg-blue-100 border-l-4 border-blue-600"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#237bd4] text-white font-semibold text-sm">
//                   {chat.initials}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-800 text-sm">
//                     {chat.name}
//                   </p>
//                   <p className="text-gray-500 text-xs truncate max-w-[140px]">
//                     {chat.preview}
//                   </p>
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="px-6 py-3 border-t border-gray-200 pl-[70%]">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800 mx-auto"
//             >
//               <MessageSquare size={24} color="white" />
//             </button>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="flex-1 h-1/2 md:h-full flex flex-col bg-[#f9fbff]">
//           <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white">
//             <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold text-sm">
//               {currentConversation.initials}
//             </div>
//             <div>
//               <p className="font-semibold text-gray-800 text-sm">
//                 {currentConversation.name}
//               </p>
//               <p className="text-gray-500 text-xs">En ligne</p>
//             </div>
//           </div>

//           <div className="flex-1 px-6 py-4 overflow-y-auto bg-white space-y-4">
//             {currentConversation.messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`max-w-xs ${
//                   msg.from === "me" ? "ml-auto text-right" : ""
//                 }`}
//               >
//                 <div
//                   className={`text-sm rounded-md px-3 py-2 whitespace-pre-line ${
//                     msg.from === "me"
//                       ? "text-blue"
//                       : "bg-bleu-ciel text-gray-800"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
//               </div>
//             ))}
//           </div>

//           <form
//             className="flex items-center gap-4 px-6 py-3 border-t border-gray-200 bg-[#f9fbff]"
//             onSubmit={handleSend}
//           >
//             <input
//               type="text"
//               placeholder="Écrivez un message..."
//               className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800"
//               aria-label="Send"
//             >
//               <SendHorizontal size={24} color="white" />
//             </button>
//           </form>
//         </div>
//       </main>

//       <NewChatModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSelect={handleAddConversation}
//       />

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: #cbd5e1;
//           border-radius: 3px;
//         }
//       `}</style>
//     </div>
//   );
// }
