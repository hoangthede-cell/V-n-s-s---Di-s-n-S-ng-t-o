
import React, { useState } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  userMode: 'student' | 'teacher';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userMode }) => {
  const isUser = message.role === 'user';
  const isModel = message.role === 'model';
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    // Exclude the contextual language prefix from the copied text for clarity
    const contextRegex = /^\[Bối cảnh ngôn ngữ:.*?\]\s*/;
    const textToCopy = message.text.replace(contextRegex, '');

    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Không thể sao chép nội dung.');
    });
  };

  const renderFormattedContent = (text: string) => {
    // For user messages, hide the contextual prefix for a cleaner UI
    let displayText = text;
    if (isUser) {
        const contextRegex = /^\[Bối cảnh ngôn ngữ:.*?\]\s*/;
        displayText = text.replace(contextRegex, '');
    }

    const lines = displayText.split('\n');
    const elements: React.ReactNode[] = [];
    let tableBuffer: string[] = [];
    let textBuffer: string[] = [];

    const focusRingClass = userMode === 'student' ? 'focus:ring-amber-500' : 'focus:ring-slate-500';

    const flushText = () => {
      if (textBuffer.length > 0) {
        const content = textBuffer.join('\n');
        const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
          }
           if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-slate-100 text-rose-600 font-mono text-xs px-1.5 py-0.5 rounded-md">{part.slice(1, -1)}</code>;
          }
          return part;
        });

        elements.push(
          <div key={`text-${elements.length}`} className="whitespace-pre-wrap mb-3 last:mb-0">
            {parts}
          </div>
        );
        textBuffer = [];
      }
    };

    const flushTable = () => {
      if (tableBuffer.length > 0) {
        const separatorIdx = tableBuffer.findIndex(line => {
             const trimmed = line.trim();
             return trimmed.startsWith('|') && /^\|?[\s-:]+(\|[\s-:]+)+\|?$/.test(trimmed);
        });

        if (separatorIdx !== -1) {
            const rows = tableBuffer.map(line => {
                const trimmed = line.trim();
                const cells = trimmed.split('|');
                if (trimmed.startsWith('|')) cells.shift();
                if (trimmed.endsWith('|')) cells.pop();
                return cells;
            });

            const headerRow = separatorIdx > 0 ? rows.slice(0, separatorIdx).flat().join(" ").trim() ? rows.slice(0, separatorIdx)[0] : [] : [];
            const bodyRows = rows.slice(separatorIdx + 1);

            elements.push(
                <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-xl border border-slate-300 shadow-sm bg-white">
                    <table className="min-w-full border-collapse text-sm text-left">
                        {headerRow.length > 0 && (
                            <thead className="bg-slate-100">
                                <tr>
                                    {headerRow.map((h, i) => (
                                        <th 
                                            key={i} 
                                            contentEditable 
                                            suppressContentEditableWarning
                                            className={`px-4 py-3 font-semibold text-slate-700 border-b-2 border-slate-200 border-r border-slate-200 last:border-r-0 whitespace-pre-wrap outline-none focus:bg-amber-50 focus:ring-2 focus:ring-inset ${focusRingClass}`}
                                        >
                                            {h.trim()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-200">
                            {bodyRows.map((row, r) => (
                                <tr key={r} className="hover:bg-slate-50/70 transition-colors">
                                    {row.map((c, i) => (
                                        <td 
                                            key={i} 
                                            contentEditable
                                            suppressContentEditableWarning
                                            className={`px-4 py-2 text-slate-600 border-r border-slate-200 last:border-r-0 whitespace-pre-wrap outline-none focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-inset ${focusRingClass} align-top`}
                                        >
                                            {c.trim()}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-3 py-1.5 bg-slate-50 text-[11px] text-slate-500 text-right italic border-t border-slate-200">
                        * Bạn có thể chỉnh sửa trực tiếp nội dung trong bảng này
                    </div>
                </div>
            );
        } else {
            textBuffer.push(...tableBuffer);
            flushText();
        }
        tableBuffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('|')) {
            if (textBuffer.length > 0) flushText();
            tableBuffer.push(line);
        } else {
            if (tableBuffer.length > 0) flushTable();
            textBuffer.push(line);
        }
    }

    if (tableBuffer.length > 0) flushTable();
    if (textBuffer.length > 0) flushText();

    return elements;
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[95%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md mx-2 ring-2 ring-white/50 ${isUser ? 'bg-indigo-600' : 'bg-amber-700'}`}>
            {isUser ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            )}
          </div>

          <div 
            className={`group relative p-4 rounded-2xl shadow-lg text-sm md:text-base leading-relaxed overflow-hidden ${
              isUser 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                : 'bg-white text-ink border border-slate-200 rounded-tl-none font-serif w-full'
            }`}
          >
            {renderFormattedContent(message.text)}
            
            {message.groundingMetadata?.groundingChunks && (
              <div className="mt-4 pt-3 border-t border-slate-200/50 text-xs text-slate-500 font-sans">
                <p className="font-bold mb-1.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A9.916 9.916 0 0 0 10 18c2.314 0 4.438-.784 6.131-2.1.43-.333-.604-1.903-1.117-1.706A5.984 5.984 0 0 0 10 12Z" clipRule="evenodd" />
                  </svg>
                  Nguồn tham khảo:
                </p>
                <ul className="space-y-1.5">
                  {message.groundingMetadata.groundingChunks.map((chunk: any, idx: number) => {
                    if (chunk.web) {
                      return (
                         <li key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors">
                           <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 group">
                              <span className="mt-0.5 text-amber-600 group-hover:text-amber-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-slate-700 group-hover:text-amber-800 break-all line-clamp-1 font-medium">{chunk.web.title}</span>
                           </a>
                         </li>
                      )
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}
            
            {isModel && (
              <div className="absolute bottom-2 right-2">
                <button 
                    onClick={handleShare}
                    className="group relative p-1.5 bg-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-amber-500"
                    aria-label="Sao chép nội dung"
                >
                    {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-600">
                            <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L6 11.19l7.22-7.22a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                    ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                          <path d="M8.25 2.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V3.56L6.53 8.28a.75.75 0 0 1-1.06-1.06L10.19 2.5H8.25a.75.75 0 0 1-.75-.75Z" />
                          <path d="M2.5 4.5A1.5 1.5 0 0 0 1 6v7.5A1.5 1.5 0 0 0 2.5 15h7.5A1.5 1.5 0 0 0 11.5 13.5V9a.75.75 0 0 1 1.5 0v4.5a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h4.5a.75.75 0 0 1 0 1.5H2.5Z" />
                        </svg>
                    )}
                    <span className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-slate-800/90 px-2 py-1 rounded-md transition-opacity duration-300 pointer-events-none ${isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isCopied ? 'Đã sao chép!' : 'Chia sẻ (sao chép)'}
                    </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
