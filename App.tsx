
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession, ActionType, GamificationProfile } from './types';
import { WELCOME_MESSAGE, BADGE_DEFINITIONS, XP_PER_ACTION, getXpForNextLevel } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import LegalDocsModal from './components/LegalDocsModal';
import ProductInfoModal from './components/ProductInfoModal';
import RealTimeStats from './components/RealTimeStats';
import FeedbackModal from './components/FeedbackModal';
import GamificationModal from './components/GamificationModal';
import NotificationToast from './components/NotificationToast';
import GuideModal from './components/GuideModal';

type UserMode = 'student' | 'teacher';

const ETHNIC_LANGUAGES = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'hmong', name: 'Tiếng Mông (RPA)' },
    { code: 'tay', name: 'Tiếng Tày' },
    { code: 'dao', name: 'Tiếng Dao (Kìm Miền)' },
    { code: 'lolo', name: 'Tiếng Lô Lô' },
    { code: 'giay', name: 'Tiếng Giáy' },
    { code: 'colao', name: 'Tiếng Cờ Lao' },
    { code: 'pupeo', name: 'Tiếng Pu Péo' },
    { code: 'pathen', name: 'Tiếng Pà Thẻn' },
    { code: 'nung', name: 'Tiếng Nùng' },
    { code: 'hoa', name: 'Tiếng Hoa (Quảng Đông/Hán)' },
];

const createNewSession = (initialMessageText = WELCOME_MESSAGE): ChatSession => ({
  id: uuidv4(),
  messages: [{
    id: 'welcome',
    role: 'model',
    text: initialMessageText,
    timestamp: new Date(),
  }],
});

const defaultGamificationProfile: GamificationProfile = {
  xp: 0,
  level: 1,
  actionCounts: {},
  unlockedBadges: [],
};

const App: React.FC = () => {
  const [userMode, setUserMode] = useState<UserMode>('student');
  const [language, setLanguage] = useState('vi');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLegalDocsOpen, setIsLegalDocsOpen] = useState(false);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState(false);
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile>(defaultGamificationProfile);
  const [notification, setNotification] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      let initialSessions: ChatSession[] = [];
      let initialActiveSessionId: string;

      let parsedHistory: ChatSession[] = [];
      if (savedHistory) {
        const rawParsed = JSON.parse(savedHistory);
        if (Array.isArray(rawParsed)) {
          parsedHistory = rawParsed.map((session: ChatSession) => ({
            ...session,
            messages: session.messages.map(message => ({
              ...message,
              timestamp: new Date(message.timestamp),
            })),
          }));
        }
      }

      if (parsedHistory.length > 0) {
        initialSessions = parsedHistory;
        initialActiveSessionId = parsedHistory[0].id;
      } else {
        const newSession = createNewSession();
        initialSessions = [newSession];
        initialActiveSessionId = newSession.id;
      }

      setChatSessions(initialSessions);
      setActiveSessionId(initialActiveSessionId);

      const savedProfile = localStorage.getItem('gamificationProfile');
      setGamificationProfile(savedProfile ? JSON.parse(savedProfile) : defaultGamificationProfile);
      
      const savedInteractions = localStorage.getItem('interactionCount');
      const initialInteractions = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
      setInteractionCount(savedInteractions ? parseInt(savedInteractions, 10) : initialInteractions);
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      const newSession = createNewSession();
      setChatSessions([newSession]);
      setActiveSessionId(newSession.id);
      setGamificationProfile(defaultGamificationProfile);
      setInteractionCount(Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000);
    }
  }, []);

  useEffect(() => {
    try {
      if(chatSessions.length > 0) {
        const serializableSessions = chatSessions.map(session => ({
          ...session,
          messages: session.messages.map(message => ({
            ...message,
            timestamp: message.timestamp.toISOString(),
          })),
        }));
        localStorage.setItem('chatHistory', JSON.stringify(serializableSessions));
      } else {
        localStorage.removeItem('chatHistory');
      }
      localStorage.setItem('gamificationProfile', JSON.stringify(gamificationProfile));
      localStorage.setItem('interactionCount', interactionCount.toString());
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [chatSessions, gamificationProfile, interactionCount]);
  
  const activeMessages = chatSessions.find(s => s.id === activeSessionId)?.messages || [];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
  useEffect(scrollToBottom, [activeMessages, isLoading]);
  useEffect(() => inputRef.current?.focus(), [activeSessionId]);
  
  const updateGamificationProgress = (actionType: ActionType) => {
    setGamificationProfile(prev => {
      const newProfile = { ...prev, actionCounts: { ...prev.actionCounts } };
      newProfile.xp += XP_PER_ACTION;
      newProfile.actionCounts[actionType] = (newProfile.actionCounts[actionType] || 0) + 1;

      const xpForNext = getXpForNextLevel(newProfile.level);
      if (newProfile.xp >= xpForNext) {
        newProfile.level += 1;
        newProfile.xp -= xpForNext;
        setNotification(`Chúc mừng bạn đã lên cấp ${newProfile.level}!`);
      }

      BADGE_DEFINITIONS.forEach(badge => {
        if (!newProfile.unlockedBadges.includes(badge.id) && (newProfile.actionCounts[badge.id] || 0) >= badge.threshold) {
          newProfile.unlockedBadges.push(badge.id);
          setNotification(`Bạn đã mở khóa huy hiệu "${badge.name}"!`);
        }
      });
      
      return newProfile;
    });
  };

  const handleSendMessage = async (textOverride?: string, actionType?: ActionType) => {
    const textToSend = textOverride || inputText.trim();
    if (!textToSend || isLoading || !activeSessionId) return;

    if (!textOverride) setInputText('');
    setIsLoading(true);

    let contextualText = textToSend;
    if (language !== 'vi' && !textOverride) {
      const langName = ETHNIC_LANGUAGES.find(l => l.code === language)?.name;
      contextualText = `[Bối cảnh ngôn ngữ: Song ngữ Việt - ${langName}. Hãy cung cấp bản dịch và hướng dẫn phiên âm/ký âm cụ thể] ${textToSend}`;
    }

    const newMessage: Message = { id: uuidv4(), role: 'user', text: contextualText, timestamp: new Date() };
    const updatedMessages = [...activeMessages, newMessage];
    const updateSession = (msgs: Message[]) => setChatSessions(p => p.map(s => s.id === activeSessionId ? { ...s, messages: msgs } : s));
    
    updateSession(updatedMessages);

    try {
      const { text, groundingMetadata } = await sendMessageToGemini(updatedMessages);
      const aiMessage: Message = { id: uuidv4(), role: 'model', text, timestamp: new Date(), groundingMetadata };
      updateSession([...updatedMessages, aiMessage]);
      setInteractionCount(p => p + 1);
      if (userMode === 'student' && actionType) {
        updateGamificationProgress(actionType);
      }
    } catch (error) {
      const errorMessage: Message = { id: uuidv4(), role: 'model', text: "Văn sĩ số đang gặp sự cố kết nối. Em/Thầy cô vui lòng kiểm tra lại mạng và thử lại sau giây lát nhé.", timestamp: new Date() };
      updateSession([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };
  
  const handleNewChat = () => { 
    const s = createNewSession(userMode === 'student' ? "Chào em! Em cần mình giúp gì nào?" : "Kính chào Thầy/Cô, mời bắt đầu."); 
    setChatSessions(p => [s, ...p]); 
    setActiveSessionId(s.id); 
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không? Hành động này cũng sẽ đặt lại toàn bộ thành tích và huy hiệu của bạn.")) {
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('gamificationProfile');
      
      const newSession = createNewSession();
      setChatSessions([newSession]);
      setActiveSessionId(newSession.id);
      setGamificationProfile(defaultGamificationProfile);
      setNotification("Đã xóa lịch sử và đặt lại thành tích.");
    }
  };
  
  const toggleMode = (mode: UserMode) => {
    if (userMode !== mode) {
      setUserMode(mode);
      const msg = mode === 'student' ? "Chế độ Học sinh đã bật!" : "Chế độ Giáo viên đã bật.";
      const s = createNewSession(msg);
      setChatSessions(p => [s, ...p]);
      setActiveSessionId(s.id);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const langName = ETHNIC_LANGUAGES.find(l => l.code === language)?.name || "Tiếng Việt";
    const s = createNewSession(`Đã kích hoạt kho ngữ liệu ${langName}.`);
    setChatSessions(p => [s, ...p]);
    setActiveSessionId(s.id);
  };
  
  const handleFeedbackSubmit = (studentText: string) => { setIsFeedbackModalOpen(false); const prompt = `Phân tích và góp ý đoạn văn sau của học sinh:\n---\n${studentText}\n---`; handleSendMessage(prompt); };
  
  const handleQuickAction = (action: ActionType | 'feedback' | 'lesson_plan' | 'nls_activity' | 'assessment' | 'curriculum_lookup' | 'luon_coi_lesson' | 'dan_tinh_lesson' | 'tuyen_quang_material') => {
    if (userMode === 'teacher' && action === 'feedback') {
      setIsFeedbackModalOpen(true);
      return;
    }

    let prompt = "";
    if (userMode === 'student') {
        switch(action) {
            case 'local_explore': prompt = "Giải thích ý nghĩa Lễ hội Nhảy lửa của người Pà Thẻn."; break;
            case 'roleplay': prompt = "Nhập vai người già bản kể truyền thuyết bằng tiếng Việt và tiếng Mông."; break;
            case 'polish': prompt = "Sửa giúp mình đoạn văn này cho hay hơn."; break;
            case 'genre_analysis': prompt = "Đặc điểm nghệ thuật của Hát Pao Dung là gì?"; break;
            case 'script_explore': prompt = "Tìm hiểu về chữ Nôm Dao."; break;
            case 'music_explore': prompt = "Hát Then và Đàn Tính có ý nghĩa gì?"; break;
            case 'local_author_explore': prompt = "Tưởng nhớ và tìm hiểu di sản văn chương, cuộc đời của cố nhà giáo - nhà văn Lục Mạnh Cường (1981-2025), người đã dành cả tâm huyết cho giáo dục và văn học vùng cao Chiêm Hóa."; break;
        }
        handleSendMessage(prompt, action as ActionType);
    } else {
        switch(action) {
            case 'lesson_plan': prompt = "Soạn giáo án lấy cảm hứng từ tình thầy trò trong các di tác của cố nhà giáo Lục Mạnh Cường."; break;
            case 'nls_activity': prompt = "Gợi ý hoạt động tích hợp Năng lực số cho văn học địa phương."; break;
            case 'assessment': prompt = "Tạo đề đọc hiểu sử dụng trích đoạn của Chu Thị Minh Huệ hoặc di tác của Lục Mạnh Cường."; break;
            case 'curriculum_lookup': prompt = "Yêu cầu cần đạt môn Ngữ văn lớp 8."; break;
            case 'luon_coi_lesson': prompt = "Dạy học về Lượn Cọi."; break;
            case 'dan_tinh_lesson': prompt = "Tìm hiểu về Đàn Tính."; break;
            case 'tuyen_quang_material': prompt = "Phân tích giá trị nhân văn và tinh thần 'rong chơi miền mây trắng' trong di tác của cố nhà văn Lục Mạnh Cường."; break;
        }
        handleSendMessage(prompt);
    }
  };

  const xpForNextLevel = getXpForNextLevel(gamificationProfile.level);
  const progressPercentage = Math.min(100, (gamificationProfile.xp / xpForNextLevel) * 100);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
      {isLegalDocsOpen && <LegalDocsModal onClose={() => setIsLegalDocsOpen(false)} />}
      {isProductInfoOpen && <ProductInfoModal onClose={() => setIsProductInfoOpen(false)} />}
      {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} onSubmit={handleFeedbackSubmit} />}
      {isGamificationModalOpen && <GamificationModal onClose={() => setIsGamificationModalOpen(false)} profile={gamificationProfile} badgeDefinitions={BADGE_DEFINITIONS} />}
      <NotificationToast message={notification} onDismiss={() => setNotification(null)} />
      
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 shadow-xl z-20 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3"><div className="p-2.5 rounded-xl text-white shadow-lg bg-indigo-700"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg></div><div><h1 className="text-xl font-black font-serif tracking-tight text-slate-900">Văn sĩ số</h1><p className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Di sản & Sáng tạo</p></div></div>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
           <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95 group"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>Cuộc trò chuyện mới</button>
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full"><button onClick={() => toggleMode('student')} className={`w-1/2 px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${userMode === 'student' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🎓 Học sinh</button><button onClick={() => toggleMode('teacher')} className={`w-1/2 px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${userMode === 'teacher' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>👩‍🏫 Giáo viên</button></div>
            
             {userMode === 'student' && (
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">Thành tích học tập</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">Cấp {gamificationProfile.level}</span>
                    <span className="font-mono text-slate-500">{gamificationProfile.xp}/{xpForNextLevel}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{width: `${progressPercentage}%`}}></div></div>
                  <button onClick={() => setIsGamificationModalOpen(true)} className="w-full mt-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1">Xem tất cả huy hiệu</button>
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between items-center px-1 mb-1"><h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Lịch sử trò chuyện</h3><button onClick={handleClearHistory} title="Xóa toàn bộ lịch sử" className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5Z" clipRule="evenodd" /></svg></button></div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide pr-1">
                {chatSessions.map(session => {
                  const firstUserMessage = session.messages.find(m => m.role === 'user');
                  const previewText = firstUserMessage?.text.replace(/\[Bối cảnh.*?\]\s*/, '') || "Cuộc trò chuyện mới...";
                  return (<button key={session.id} onClick={() => setActiveSessionId(session.id)} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-all truncate border ${activeSessionId === session.id ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-transparent'}`}>{previewText}</button>)
                })}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100"><label htmlFor="language-select" className="text-[10px] font-black text-amber-800 uppercase mb-2 block tracking-wider">Ngôn ngữ di sản</label><div className="relative"><select id="language-select" onChange={handleLanguageChange} value={language} className="w-full text-sm font-bold bg-white border border-amber-200 rounded-lg pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer text-slate-700">{ETHNIC_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-600"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div></div>
            <RealTimeStats interactionCount={interactionCount} currentLanguage={ETHNIC_LANGUAGES.find(l => l.code === language)?.name || "Tiếng Việt"} />
        </div>
        <div className="p-4 space-y-2 border-t border-slate-200 bg-slate-50/50">
            <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-2 text-xs text-slate-600 font-bold p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">📖 Cách dùng trợ lý</button>
            <button onClick={() => setIsLegalDocsOpen(true)} className="w-full flex items-center gap-2 text-xs text-slate-600 font-bold p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">⚖️ Văn bản Pháp quy</button>
            <button onClick={() => setIsProductInfoOpen(true)} className="w-full flex items-center gap-2 text-xs text-slate-600 font-bold p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">✍️ Thông tin về Tác giả</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]"></div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10"><div className="max-w-4xl mx-auto pb-10">
              {activeMessages.map((msg) => (<ChatMessage key={msg.id} message={msg} userMode={userMode} />))}
              {isLoading && (<div className="flex w-full mb-6 justify-start animate-in fade-in slide-in-from-left-4"><div className="flex items-center gap-3"><div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white ${userMode === 'student' ? 'bg-amber-600' : 'bg-slate-700'}`}><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></div><div className="bg-white/80 backdrop-blur text-slate-400 border border-slate-200 rounded-2xl rounded-tl-none px-5 py-3 shadow-md italic text-sm">Văn sĩ số đang kết nối tri thức...</div></div></div>)}
              <div ref={messagesEndRef} />
          </div></div>
          <footer className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 md:p-6 z-20"><div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 p-2 bg-slate-50/50 rounded-xl mb-4 shadow-inner border border-slate-200">
                  {userMode === 'student' ? (<>
                      <button onClick={() => handleQuickAction('local_explore')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">🏔️ Văn hóa địa phương</button>
                      <button onClick={() => handleQuickAction('roleplay')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg">🎭 Nhập vai nhân vật</button>
                      <button onClick={() => handleQuickAction('polish')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg">✨ Trau chuốt câu từ</button>
                      <button onClick={() => handleQuickAction('genre_analysis')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg">📚 Giải mã thể loại</button>
                      <button onClick={() => handleQuickAction('script_explore')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-600 text-white rounded-xl text-xs font-bold hover:bg-stone-700 transition-all shadow-md hover:shadow-lg">📜 Khám phá Cổ tự</button>
                      <button onClick={() => handleQuickAction('music_explore')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-all shadow-md hover:shadow-lg">🎻 Tìm hiểu Hát Then</button>
                      <button onClick={() => handleQuickAction('local_author_explore')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg">✍️ Tác giả Vùng Cao</button>
                  </>) : (<>
                      <button onClick={() => handleQuickAction('lesson_plan')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-700 text-white rounded-xl text-xs font-bold hover:bg-sky-800 transition-all shadow-md hover:shadow-lg">📋 Giáo án Tích hợp</button>
                      <button onClick={() => handleQuickAction('nls_activity')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-all shadow-md hover:shadow-lg">💡 Hoạt động Năng lực số</button>
                      <button onClick={() => handleQuickAction('assessment')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-all shadow-md hover:shadow-lg">📄 Ra đề Ngữ liệu ngoài</button>
                      <button onClick={() => handleQuickAction('feedback')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold hover:bg-pink-700 transition-all shadow-md hover:shadow-lg">✍️ Góp ý Đoạn văn</button>
                      <button onClick={() => handleQuickAction('luon_coi_lesson')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-lime-700 text-white rounded-xl text-xs font-bold hover:bg-lime-800 transition-all shadow-md hover:shadow-lg">🎶 Soạn bài Lượn Cọi</button>
                      <button onClick={() => handleQuickAction('dan_tinh_lesson')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-fuchsia-700 text-white rounded-xl text-xs font-bold hover:bg-fuchsia-800 transition-all shadow-md hover:shadow-lg">🎼 Dạy về Đàn Tính</button>
                      <button onClick={() => handleQuickAction('tuyen_quang_material')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-all shadow-md hover:shadow-lg">📖 Ngữ liệu Vùng Cao</button>
                      <button onClick={() => handleQuickAction('curriculum_lookup')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg">🔍 Tra cứu CT GDPT</button>
                  </>)}
              </div>
              <div className="flex items-end gap-3">
              <div className="flex-1 relative group">
                  <input ref={inputRef} type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder={userMode === 'student' ? "Trò chuyện, khám phá và nhận huy hiệu..." : "Nhập yêu cầu soạn bài, ra đề hoặc tra cứu..."} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner bg-slate-50/50 text-slate-800 placeholder-slate-400 font-medium" disabled={isLoading}/>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" /><path d="m3.265 10.602 7.667 4.128a1.5 1.5 0 0 0 1.336 0l7.667-4.128a.75.75 0 1 1 .712 1.32l-7.667 4.128a3 3 0 0 1-2.672 0l-7.667-4.128a.75.75 0 1 1 .712-1.32Z" /><path d="m3.265 14.352 7.667 4.128a1.5 1.5 0 0 0 1.336 0l7.667-4.128a.75.75 0 1 1 .712 1.32l-7.667 4.128a3 3 0 0 1-2.672 0l-7.667-4.128a.75.75 0 1 1 .712-1.32Z" /></svg></div>
              </div>
              <button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isLoading} className="p-4 rounded-2xl flex-shrink-0 transition-all duration-300 transform disabled:bg-slate-200 disabled:scale-100 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg></button>
              </div>
          </div></footer>
      </main>
    </div>
  );
};

export default App;
