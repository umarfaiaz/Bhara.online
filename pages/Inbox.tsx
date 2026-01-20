
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, MessageCircle, ChevronLeft, MoreVertical, Send, Check, CheckCheck, Percent, AlertCircle, Info, Plus, Users, Building2, Briefcase, MapPin, UserPlus, LogOut, X, Phone } from 'lucide-react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { DataService } from '../services/mockData';
import { Building, ServiceAsset } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// --- Types ---
interface Message {
    id: string;
    sender: string;
    avatar: string;
    text: string;
    time: string;
    unread: number;
    online: boolean;
    isMe?: boolean;
}

interface Group {
    id: string;
    name: string;
    type: 'Building' | 'Service';
    members: number;
    lastMessage?: string;
    image?: string;
    isJoined: boolean;
    location?: string;
}

interface Notification {
    id: string;
    title: string;
    desc: string;
    date: string;
    type: 'promo' | 'alert' | 'info' | 'success';
}

// --- Mock Data ---
const initialChats: Message[] = [
    { id: '1', sender: 'Rafiqul Islam', avatar: 'https://i.pravatar.cc/150?u=1', text: 'Rent payment done. Please check.', time: '10:30 AM', unread: 2, online: true, isMe: false },
    { id: '2', sender: 'Karim Driver', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Car is in the garage.', time: 'Yesterday', unread: 0, online: false, isMe: false },
    { id: '3', sender: 'Sumaiya Akter', avatar: 'https://i.pravatar.cc/150?u=3', text: 'Is the flat available?', time: 'Yesterday', unread: 0, online: true, isMe: false },
];

const notifications: Notification[] = [
    { id: '1', title: 'Rent Received', desc: 'You received ৳25,000 from Rafiqul Islam.', date: 'Today, 10:32 AM', type: 'success' },
    { id: '2', title: 'Bill Generated', desc: 'Utility bills for March are ready.', date: 'Yesterday, 6:00 PM', type: 'info' },
    { id: '3', title: 'Eid Offer!', desc: 'Get 50% discount on Elite plan.', date: '2 days ago', type: 'promo' },
    { id: '4', title: 'Maintenance Alert', desc: 'Lift maintenance scheduled.', date: '3 days ago', type: 'alert' },
];

// --- Main Inbox Component ---
const Inbox: React.FC = () => {
    return (
        <Routes>
            <Route index element={<InboxList />} />
            <Route path="chat/:id" element={<ChatView />} />
            <Route path="group/:id" element={<GroupChatView />} />
            <Route path="group-info/:id" element={<GroupInfoView />} />
        </Routes>
    );
};

const InboxList: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'messages' | 'groups' | 'notifications'>('messages');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 pt-10 px-5 pb-0 shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{t('inbox_title')}</h1>
                    <div className="bg-gray-100 p-2 rounded-full">
                        <Search size={20} className="text-gray-500"/>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('messages')}
                        className={`flex-1 pb-3 text-sm font-bold relative transition-colors ${activeTab === 'messages' ? 'text-[#ff4b9a]' : 'text-gray-400'}`}
                    >
                        {t('tab_messages')}
                        {activeTab === 'messages' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ff4b9a] rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('groups')}
                        className={`flex-1 pb-3 text-sm font-bold relative transition-colors ${activeTab === 'groups' ? 'text-[#ff4b9a]' : 'text-gray-400'}`}
                    >
                        {t('tab_groups')}
                        {activeTab === 'groups' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ff4b9a] rounded-t-full"></div>}
                    </button>
                     <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`flex-1 pb-3 text-sm font-bold relative transition-colors ${activeTab === 'notifications' ? 'text-[#ff4b9a]' : 'text-gray-400'}`}
                    >
                        {t('tab_alerts')}
                        {activeTab === 'notifications' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ff4b9a] rounded-t-full"></div>}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 pt-2">
                {activeTab === 'messages' && <MessagesList />}
                {activeTab === 'groups' && <GroupsList />}
                {activeTab === 'notifications' && <NotificationsList />}
            </div>
        </div>
    );
};

// --- Sub-Lists ---

const MessagesList: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white min-h-full">
            {initialChats.map(chat => (
                <div key={chat.id} onClick={() => navigate(`chat/${chat.id}`)} className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
                    <div className="relative">
                        <img src={chat.avatar} alt={chat.sender} className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-200"/>
                        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{chat.sender}</h4>
                            <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-[#ff4b9a]' : 'text-gray-400'}`}>{chat.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{chat.text}</p>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-[#ff4b9a] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const GroupsList: React.FC = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const buildings = DataService.getBuildings().map(b => ({
            id: b.id,
            name: b.name,
            type: 'Building' as const,
            members: b.flat_count || 10,
            lastMessage: 'Notice: Generator maintenance scheduled.',
            isJoined: true,
            location: b.area
        }));
        const services = DataService.getServices().map(s => ({
            id: s.id,
            name: s.name,
            type: 'Service' as const,
            members: 50,
            lastMessage: 'New gig available next week!',
            isJoined: false,
            location: s.location
        }));
        setGroups([...buildings, ...services]);
    }, []);

    const toggleJoin = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setGroups(prev => prev.map(g => g.id === id ? { ...g, isJoined: !g.isJoined } : g));
    };

    return (
        <div className="bg-white min-h-full">
            {groups.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No communities found.</div>}
            {groups.map(group => (
                <div key={group.id} onClick={() => group.isJoined ? navigate(`group/${group.id}`) : null} className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${group.type === 'Building' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                         {group.type === 'Building' ? <Building2 size={20}/> : <Briefcase size={20}/>}
                     </div>
                     <div className="flex-1">
                         <h4 className="font-bold text-gray-900 text-sm">{group.name}</h4>
                         <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{group.members} {t('group_members')}</p>
                     </div>
                     {group.isJoined ? (
                         <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">Joined</span>
                     ) : (
                         <button onClick={(e) => toggleJoin(e, group.id)} className="text-[10px] font-bold bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-black transition-colors">
                             {t('group_join')}
                         </button>
                     )}
                </div>
            ))}
        </div>
    );
}

const NotificationsList: React.FC = () => {
    const getIcon = (type: Notification['type']) => {
        switch(type) {
            case 'promo': return <Percent size={18} className="text-[#ff4b9a]" />;
            case 'success': return <Check size={18} className="text-green-600" />;
            case 'alert': return <AlertCircle size={18} className="text-red-600" />;
            default: return <Info size={18} className="text-blue-600" />;
        }
    };

    const getBg = (type: Notification['type']) => {
        switch(type) {
            case 'promo': return 'bg-pink-50';
            case 'success': return 'bg-green-50';
            case 'alert': return 'bg-red-50';
            default: return 'bg-blue-50';
        }
    };

    return (
        <div className="p-2 space-y-2">
            {notifications.map(notif => (
                <div key={notif.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                    <div className={`w-10 h-10 rounded-full ${getBg(notif.type)} flex items-center justify-center shrink-0`}>
                        {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                            <span className="text-[10px] text-gray-400">{notif.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{notif.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- View: Direct Chat ---
const ChatView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useLanguage();
    const [msg, setMsg] = useState('');
    const user = initialChats.find(c => c.id === id) || initialChats[0];
    
    // Message State
    const [messages, setMessages] = useState<Message[]>([
        { ...user, isMe: false }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = () => {
        if(!msg.trim()) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'Me',
            avatar: '',
            text: msg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            online: true,
            isMe: true
        };
        setMessages([...messages, newMsg]);
        setMsg('');
    };

    return (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
            {/* Minimal Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"><ChevronLeft size={24}/></button>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        <img src={user.avatar} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">{user.sender}</h3>
                        <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {t('online')}
                        </p>
                    </div>
                </div>
                <MoreVertical size={20} className="text-gray-400" />
            </div>

            {/* Messages Area - Clean Style */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
                 <div className="flex justify-center my-4"><span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-200 px-2 py-1 rounded">Today</span></div>
                 
                 {messages.map((m) => (
                     <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[75%] space-y-1 ${m.isMe ? 'items-end flex flex-col' : ''}`}>
                            <div className={`p-3 rounded-2xl shadow-sm text-sm ${m.isMe ? 'bg-[#2d1b4e] text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                {m.text}
                            </div>
                            <div className="flex items-center gap-1 px-1">
                                 <span className="text-[10px] text-gray-400">{m.time}</span>
                                 {m.isMe && <CheckCheck size={12} className="text-[#ff4b9a]"/>}
                            </div>
                         </div>
                     </div>
                 ))}
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 border-t border-gray-100 pb-safe-bottom flex items-center gap-2">
                 <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Plus size={24}/></button>
                 <input 
                    type="text" 
                    value={msg} 
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={t('chat_type_message')} 
                    className="flex-1 bg-gray-100 rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 transition-all text-gray-900"
                 />
                 <button onClick={handleSend} className={`p-3 rounded-full shadow-lg active:scale-95 transition-transform ${msg.trim() ? 'bg-[#ff4b9a] text-white' : 'bg-gray-200 text-gray-400'}`}>
                     <Send size={18} className="ml-0.5" />
                 </button>
            </div>
        </div>
    );
};

// --- View: Group Chat ---
const GroupChatView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const building = DataService.getBuildings().find(b => b.id === id);
    const service = DataService.getServices().find(s => s.id === id);
    const name = building?.name || service?.name || 'Community Group';
    const type = building ? 'Building Community' : 'Service Group';

    return (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
            {/* Header */}
            <div onClick={() => navigate(`/inbox/group-info/${id}`)} className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); navigate('/inbox'); }} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"><ChevronLeft size={24}/></button>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${building ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {building ? <Building2 size={20}/> : <Briefcase size={20}/>}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">{name}</h3>
                        <p className="text-[10px] text-gray-500 font-medium">{type}</p>
                    </div>
                </div>
                <Info size={20} className="text-gray-400" />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                 <div className="flex justify-center"><span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full">Community Guidelines applied</span></div>
                 
                 {/* Message from Admin */}
                 <div className="flex justify-start">
                     <div className="max-w-[85%]">
                        <span className="text-[10px] text-gray-500 font-bold ml-1 mb-1 block">Admin (Caretaker)</span>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-800">
                            Notice: Water tank cleaning scheduled for tomorrow 10 AM to 2 PM.
                        </div>
                        <span className="text-[10px] text-gray-400 pl-1 mt-1 block">10:00 AM</span>
                     </div>
                 </div>
            </div>

            {/* Input */}
            <div className="bg-white p-3 border-t border-gray-100 pb-safe-bottom flex items-center gap-2">
                 <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-100 rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                 <button className="p-3 bg-blue-600 text-white rounded-full shadow-lg active:scale-95"><Send size={18}/></button>
            </div>
        </div>
    );
};

// --- View: Group Details + Add Member ---
const GroupInfoView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useLanguage();
    const building = DataService.getBuildings().find(b => b.id === id);
    const service = DataService.getServices().find(s => s.id === id);
    const isBuilding = !!building;
    const name = building?.name || service?.name;
    const location = building?.area || service?.location;
    const [showAddMember, setShowAddMember] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right duration-300 z-[60] relative">
            <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={22}/></button>
                <h3 className="text-lg font-bold text-gray-900">{t('group_info')}</h3>
            </div>

            <div className="p-5 space-y-6">
                <div className="flex flex-col items-center py-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${isBuilding ? 'bg-blue-500 shadow-blue-200' : 'bg-purple-500 shadow-purple-200'}`}>
                        {isBuilding ? <Building2 size={40}/> : <Briefcase size={40}/>}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 text-center">{name}</h2>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 font-medium">
                        <MapPin size={12}/> {location}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('group_members')}</h4>
                        <button onClick={() => setShowAddMember(true)} className="text-xs font-bold text-[#ff4b9a] flex items-center gap-1 hover:bg-pink-50 px-2 py-1 rounded-lg transition-colors">
                            <Plus size={14}/> {t('add')}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">U{i}</div>
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-gray-900">Tenant {i}</h5>
                                    <p className="text-[10px] text-gray-400">{isBuilding ? `Flat ${i}A` : 'Member'}</p>
                                </div>
                                {i === 1 && <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Admin</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <button className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                    <LogOut size={18}/> {t('group_leave')}
                </button>
            </div>

            {/* Add Member Modal */}
            {showAddMember && (
                <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{t('group_add_member')}</h3>
                            <button onClick={() => setShowAddMember(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">{t('group_add_desc')}</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-2">{t('phone')}</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input type="tel" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#ff4b9a]" placeholder="01..." />
                                </div>
                            </div>
                            <button onClick={() => { alert('Invitation Sent!'); setShowAddMember(false); }} className="w-full py-3 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
