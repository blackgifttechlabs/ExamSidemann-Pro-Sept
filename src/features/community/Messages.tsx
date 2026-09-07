
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Paperclip, Mic, Send, Check, CheckCheck, Smile, ArrowLeft, Plus, Users, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequiredView } from '../auth/LoginRequiredView';
import { collection, query, limit, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
  read: boolean;
  imageBase64?: string;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'friend' | 'request' | 'temp'; 
}

interface MessagesProps { 
    onBack?: () => void; 
    onLoginRequest?: () => void;
    initialChatId?: string;
    embedded?: boolean;
}

export const Messages: React.FC<MessagesProps> = ({ onBack, onLoginRequest, initialChatId, embedded = false }) => {
  const { user, loading, refreshProfile } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [requests, setRequests] = useState<ChatContact[]>([]);
  const [tempContacts, setTempContacts] = useState<ChatContact[]>([]); // For non-friends we are chatting with
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Fetch Contacts & Requests ---
  useEffect(() => {
    const fetchContacts = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            // Subscribe to user doc to get real-time friend updates
            const unsubscribe = onSnapshot(userRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const friendIds = data.friends || [];
                    const requestIds = data.friendRequests || [];

                    // Fetch details for friends
                    const loadedContacts: ChatContact[] = [];
                    for (const friendId of friendIds) {
                        const fSnap = await getDoc(doc(db, 'users', friendId));
                        if (fSnap.exists()) {
                            const fData = fSnap.data();
                            
                            // Fetch last message for this chat
                            const chatId = [user.uid, friendId].sort().join('_');
                            // NOTE: Keeping simple query for contacts to avoid complex index needs for now
                            const msgQ = query(
                                collection(db, 'direct_messages'), 
                                where('chatId', '==', chatId)
                            );
                            const msgSnap = await getDocs(msgQ);
                            let lastMsgText = 'Start a conversation';
                            let lastMsgTime = '';
                            let unreadCount = 0; 

                            if (!msgSnap.empty) {
                                // Client side sort for last message to avoid composite index requirement on (chatId, timestamp)
                                const sortedDocs = msgSnap.docs.sort((a,b) => b.data().timestamp?.seconds - a.data().timestamp?.seconds);
                                const lastMsgData = sortedDocs[0].data();
                                lastMsgText = lastMsgData.text;
                                if (lastMsgData.timestamp) {
                                    lastMsgTime = lastMsgData.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                }
                            }

                            loadedContacts.push({
                                id: friendId,
                                name: `${fData.firstName} ${fData.lastName}`,
                                avatar: (fData.firstName?.[0] || 'U').toUpperCase(),
                                lastMessage: lastMsgText, 
                                time: lastMsgTime,
                                unread: unreadCount,
                                online: Math.random() > 0.5, 
                                type: 'friend'
                            });
                        }
                    }
                    setContacts(loadedContacts);

                    // Fetch details for requests
                    const loadedRequests: ChatContact[] = [];
                    for (const reqId of requestIds) {
                        const rSnap = await getDoc(doc(db, 'users', reqId));
                        if (rSnap.exists()) {
                            const rData = rSnap.data();
                            loadedRequests.push({
                                id: reqId,
                                name: `${rData.firstName} ${rData.lastName}`,
                                avatar: (rData.firstName?.[0] || 'U').toUpperCase(),
                                lastMessage: 'Sent a friend request',
                                time: 'New',
                                unread: 1,
                                online: false,
                                type: 'request'
                            });
                        }
                    }
                    setRequests(loadedRequests);
                }
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Error fetching contacts", e);
        }
    };
    fetchContacts();
  }, [user]);

  // --- Handle Initial Chat ID (e.g. from Class Join Request) ---
  useEffect(() => {
      const handleInitialChat = async () => {
          if (initialChatId && user) {
              setActiveChat(initialChatId);
              
              // Check if user is already in contacts or requests
              const existingContact = contacts.find(c => c.id === initialChatId) || requests.find(c => c.id === initialChatId);
              
              if (!existingContact) {
                  // Fetch temp contact details
                  try {
                      const snap = await getDoc(doc(db, 'users', initialChatId));
                      if (snap.exists()) {
                          const data = snap.data();
                          const temp: ChatContact = {
                              id: initialChatId,
                              name: `${data.firstName} ${data.lastName}`,
                              avatar: (data.firstName?.[0] || 'T').toUpperCase(),
                              lastMessage: 'New Connection',
                              time: 'Now',
                              unread: 0,
                              online: true,
                              type: 'temp'
                          };
                          setTempContacts([temp]);
                          setActiveTab('chats'); // Ensure we are on chats tab
                      }
                  } catch (e) {
                      console.error("Error fetching initial contact", e);
                  }
              } else {
                  // If it's a request, switch tab so user sees it, or keep in chats if friend
                  if (existingContact.type === 'request') setActiveTab('requests');
                  else setActiveTab('chats');
              }
          }
      };
      handleInitialChat();
  }, [initialChatId, user]);

  // --- Listen to Messages ---
  useEffect(() => {
      if (!activeChat || !user) return;

      const chatId = [user.uid, activeChat].sort().join('_');
      const messagesRef = collection(db, 'direct_messages');
      
      // Removed orderBy('timestamp', 'asc') to fix Firebase Index error
      // Will sort client-side instead
      const q = query(
          messagesRef, 
          where('chatId', '==', chatId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs: Message[] = [];
          snapshot.forEach((docSnapshot) => {
              const data = docSnapshot.data();
              msgs.push({
                  id: docSnapshot.id,
                  text: data.text,
                  senderId: data.senderId,
                  timestamp: data.timestamp,
                  read: data.read,
                  imageBase64: data.imageBase64
              });

              // Mark as read if I'm the receiver and it's not read
              if (data.senderId !== user.uid && !data.read) {
                  updateDoc(docSnapshot.ref, { read: true });
              }
          });
          
          // Client-side Sort
          msgs.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
          
          setMessages(msgs);
      });

      return () => unsubscribe();
  }, [activeChat, user]);

  // Auto-scroll logic
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChat]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !activeChat) return;
    
    const chatId = [user.uid, activeChat].sort().join('_');
    const text = inputText;
    setInputText(''); // Clear early

    try {
        await addDoc(collection(db, 'direct_messages'), {
            text: text,
            senderId: user.uid,
            receiverId: activeChat,
            chatId: chatId,
            timestamp: serverTimestamp(),
            read: false
        });
    } catch (e) {
        console.error("Error sending message", e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && user && activeChat) {
          if (file.size > 800 * 1024) {
              alert("Image is too large. Please choose an image under 800KB.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = async () => {
              const base64String = reader.result as string;
              const chatId = [user.uid, activeChat].sort().join('_');
              try {
                  await addDoc(collection(db, 'direct_messages'), {
                      text: '📷 Image',
                      imageBase64: base64String,
                      senderId: user.uid,
                      receiverId: activeChat,
                      chatId: chatId,
                      timestamp: serverTimestamp(),
                      read: false
                  });
              } catch (err) {
                  console.error("Error sending image", err);
                  alert("Failed to send image.");
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAcceptRequest = async (req: ChatContact) => {
      if (!user) return;
      try {
          const userRef = doc(db, 'users', user.uid);
          const friendRef = doc(db, 'users', req.id);

          // Add to my friends, remove from requests
          await updateDoc(userRef, {
              friends: arrayUnion(req.id),
              friendRequests: arrayRemove(req.id)
          });

          // Add me to their friends, remove from their sent requests (optional cleanup)
          await updateDoc(friendRef, {
              friends: arrayUnion(user.uid),
              sentRequests: arrayRemove(user.uid)
          });
          
          await refreshProfile();
          // Switch tab to chats automatically
          setActiveTab('chats');
          setActiveChat(req.id);
      } catch(e) {
          console.error("Error accepting request", e);
      }
  };

  const activeContact = contacts.find(c => c.id === activeChat) || requests.find(c => c.id === activeChat) || tempContacts.find(c => c.id === activeChat);

  // Filtering
  const filteredContacts = [...contacts, ...tempContacts].filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRequests = requests.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!user && !loading) {
      return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Messages" />;
  }

  // --- Render ---
  return (
    <div className={`${embedded ? 'h-full min-h-[560px]' : 'h-[calc(100vh_-_var(--app-header-h))]'} flex bg-white dark:bg-[#111b21] overflow-hidden relative`}>
      
      {/* Sidebar (Contact List) */}
      <div className={`w-full md:w-[35%] lg:w-[380px] bg-white dark:bg-[#111b21] border-r border-gray-200 dark:border-[#202c33] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
         
         {/* Sidebar Header */}
         <div className="h-16 bg-gray-100 dark:bg-[#202c33] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="text-gray-500 dark:text-[#aebac1] hover:text-gray-900 dark:hover:text-white md:hidden">
                        <ArrowLeft size={24} />
                    </button>
                )}
                {/* On desktop show avatar, on mobile assume back button handles nav */}
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden border border-gray-200 dark:border-gray-500 hidden md:flex items-center justify-center">
                   {user?.photoURL ? (
                       <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                   ) : (
                       <div className="text-gray-600 dark:text-gray-300 text-sm font-bold">{user?.email?.[0].toUpperCase()}</div>
                   )}
                </div>
                {onBack && <button onClick={onBack} className="text-gray-500 dark:text-[#aebac1] hover:text-gray-900 dark:hover:text-white hidden md:block text-sm font-bold">Dashboard</button>}
            </div>
            
            {/* Tabs for Chats / Requests */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('chats')} 
                    className={`p-2 rounded-full transition-colors relative ${activeTab === 'chats' ? 'bg-gray-200 dark:bg-[#2a3942] text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#aebac1] hover:bg-gray-200 dark:hover:bg-[#2a3942]'}`}
                    title="Chats"
                >
                    <Users size={20} />
                </button>
                <button 
                    onClick={() => setActiveTab('requests')} 
                    className={`p-2 rounded-full transition-colors relative ${activeTab === 'requests' ? 'bg-gray-200 dark:bg-[#2a3942] text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#aebac1] hover:bg-gray-200 dark:hover:bg-[#2a3942]'}`}
                    title="Friend Requests"
                >
                    <UserPlus size={20} />
                    {requests.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-100 dark:border-[#202c33]"></span>}
                </button>
            </div>
         </div>

         {/* Search */}
         <div className="p-2 border-b border-gray-200 dark:border-[#202c33]">
            <div className="bg-gray-100 dark:bg-[#202c33] rounded-lg flex items-center px-3 py-1.5">
               <Search size={18} className="text-gray-500 dark:text-[#aebac1] mr-3" />
               <input 
                 type="text" 
                 placeholder={activeTab === 'chats' ? "Search chats" : "Search requests"}
                 className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-[#d1d7db] w-full placeholder-gray-400 dark:placeholder-[#aebac1]"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'chats' ? (
                filteredContacts.map(contact => (
                   <div 
                     key={contact.id}
                     onClick={() => setActiveChat(contact.id)}
                     className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202c33] transition-colors border-b border-gray-100 dark:border-[#202c33] ${activeChat === contact.id ? 'bg-gray-100 dark:bg-[#2a3942]' : ''}`}
                   >
                      <div className="relative">
                         <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-white font-bold text-lg">
                            {contact.avatar}
                         </div>
                         {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#111b21]"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-gray-900 dark:text-[#e9edef] font-normal text-base truncate">{contact.name}</h4>
                            <span className={`text-xs ${contact.unread > 0 ? 'text-[#00a884]' : 'text-gray-500 dark:text-[#8696a0]'}`}>{contact.time}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <p className="text-gray-500 dark:text-[#8696a0] text-sm truncate">{contact.lastMessage}</p>
                            {contact.unread > 0 && (
                               <span className="bg-[#00a884] text-white dark:text-[#111b21] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{contact.unread}</span>
                            )}
                         </div>
                      </div>
                   </div>
                ))
            ) : (
                filteredRequests.map(req => (
                   <div 
                     key={req.id}
                     onClick={() => setActiveChat(req.id)}
                     className={`flex items-center gap-3 p-3 border-b border-gray-100 dark:border-[#202c33] hover:bg-gray-50 dark:hover:bg-[#202c33] cursor-pointer ${activeChat === req.id ? 'bg-gray-100 dark:bg-[#2a3942]' : ''}`}
                   >
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-white font-bold text-lg">
                         {req.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-gray-900 dark:text-[#e9edef] font-bold text-base truncate">{req.name}</h4>
                         <p className="text-xs text-gray-500 dark:text-[#8696a0]">Sent you a friend request</p>
                      </div>
                      <div className="flex gap-2">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleAcceptRequest(req); }} 
                            className="p-2 bg-[#00a884] rounded-full text-white dark:text-[#111b21] hover:opacity-90" 
                            title="Accept"
                         >
                            <Check size={16}/>
                         </button>
                      </div>
                   </div>
                ))
            )}
            
            {activeTab === 'chats' && filteredContacts.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-[#8696a0] text-sm">
                    {searchQuery ? "No chats found." : "No active chats."}
                </div>
            )}
            {activeTab === 'requests' && filteredRequests.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-[#8696a0] text-sm">
                    {searchQuery ? "No requests found." : "No pending friend requests."}
                </div>
            )}
         </div>
      </div>

      {/* Main Chat Area */}
      {activeChat && activeContact ? (
         <div className={`flex-1 flex flex-col bg-[#efeae2] dark:bg-[#0b141a] relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.06] opacity-40 dark:invert-0 invert" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>

            {/* Chat Header */}
            <div className="h-16 bg-gray-100 dark:bg-[#202c33] px-4 flex items-center justify-between shrink-0 z-10 border-l border-gray-200 dark:border-[#2a3942]">
               <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-600 dark:text-[#d1d7db] mr-1">
                     <ArrowLeft size={24} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-white font-bold cursor-pointer">
                     {activeContact.avatar}
                  </div>
                  <div className="cursor-pointer">
                     <h4 className="text-gray-900 dark:text-[#e9edef] font-normal text-base">{activeContact.name}</h4>
                     <p className="text-gray-500 dark:text-[#8696a0] text-xs">
                        {activeContact.type === 'request' ? 'Request Pending' : activeContact.online ? 'online' : ''}
                     </p>
                  </div>
               </div>
               <div className="flex gap-5 text-gray-500 dark:text-[#aebac1]">
                  <button><Video size={22} /></button>
                  <button><Phone size={20} /></button>
                  <button><Search size={20} /></button>
                  <button><MoreVertical size={20} /></button>
               </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 custom-scrollbar z-10">
               {messages.length === 0 ? (
                   <div className="flex h-full items-center justify-center text-gray-500 dark:text-[#8696a0] text-sm">
                       Start the conversation with {activeContact.name}
                   </div>
               ) : (
                   messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                         <div 
                            className={`
                               max-w-[85%] md:max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm relative text-sm md:text-base
                               ${msg.senderId === user?.uid ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-900 dark:text-[#e9edef] rounded-tr-none' : 'bg-white dark:bg-[#202c33] text-gray-900 dark:text-[#e9edef] rounded-tl-none'}
                            `}
                         >
                            {msg.imageBase64 ? (
                                <div className="mb-1">
                                    <img src={msg.imageBase64} alt="Sent image" className="max-w-full rounded-lg" style={{ maxHeight: '300px' }} />
                                    {msg.text && msg.text !== '📷 Image' && <span className="whitespace-pre-wrap leading-relaxed block mt-2">{msg.text}</span>}
                                </div>
                            ) : (
                                <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                            )}
                            <div className="flex justify-end items-end gap-1 mt-1 -mb-1">
                               <span className="text-[11px] text-gray-500 dark:text-[#ffffff99] min-w-[45px] text-right">
                                   {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                               </span>
                               {msg.senderId === user?.uid && (
                                  <span>
                                     {msg.read ? <CheckCheck size={16} className="text-[#53bdeb]" /> : <CheckCheck size={16} className="text-gray-400 dark:text-[#8696a0]" />}
                                  </span>
                               )}
                            </div>
                         </div>
                      </div>
                   ))
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-100 dark:bg-[#202c33] px-4 py-2 flex items-end gap-3 z-10 shrink-0">
               <button className="text-gray-500 dark:text-[#8696a0] p-2 hover:text-gray-700 dark:hover:text-[#d1d7db] mb-1"><Smile size={24} /></button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
               />
               <button onClick={() => fileInputRef.current?.click()} className="text-gray-500 dark:text-[#8696a0] p-2 hover:text-gray-700 dark:hover:text-[#d1d7db] mb-1"><Paperclip size={24} /></button>
               <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-4 py-2 mb-1 border border-gray-200 dark:border-transparent">
                  <input 
                     type="text" 
                     placeholder="Type a message" 
                     className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-[#d1d7db] placeholder-gray-400 dark:placeholder-[#8696a0] text-sm md:text-base h-6"
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
               </div>
               {inputText ? (
                  <button onClick={handleSend} className="bg-[#00a884] text-white dark:text-[#111b21] p-2 rounded-full hover:bg-[#008f6f] mb-1 transition-colors">
                     <Send size={20} />
                  </button>
               ) : (
                  <button className="text-gray-500 dark:text-[#8696a0] p-2 hover:text-gray-700 dark:hover:text-[#d1d7db] mb-1"><Mic size={24} /></button>
               )}
            </div>

         </div>
      ) : (
         <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-[#222e35] text-gray-900 dark:text-[#e9edef] border-b-[6px] border-[#00a884]">
            <div className="max-w-[460px] text-center">
               <h2 className="text-3xl font-light mb-4">Exam Sidemann Messages</h2>
               <p className="text-gray-500 dark:text-[#8696a0] text-sm leading-6">
                  Messages and shared images are stored in Exam Sidemann&apos;s Firebase database so they can appear after you sign in again.
               </p>
               <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs leading-5 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  Messages are not end-to-end encrypted. Do not send passwords, payment details, identity documents, or other sensitive information.
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
