
import React, { useState, useEffect } from 'react';

interface RealTimeStatsProps {
  interactionCount: number;
  currentLanguage: string;
}

const RealTimeStats: React.FC<RealTimeStatsProps> = ({ interactionCount, currentLanguage }) => {
  const [onlineUsers, setOnlineUsers] = useState(12);

  // Mô phỏng sự thay đổi người dùng trực tuyến
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(5, prev + change);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-white shadow-inner border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thống kê bản làng số</h3>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-green-400 uppercase">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
          <p className="text-[10px] text-slate-500 font-medium mb-0.5">Đang trực tuyến</p>
          <p className="text-xl font-black font-mono text-indigo-400">{onlineUsers}</p>
        </div>
        <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
          <p className="text-[10px] text-slate-500 font-medium mb-0.5">Lượt tương tác</p>
          <p className="text-xl font-black font-mono text-amber-400">{interactionCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
         <div className="flex flex-col">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Ngôn ngữ sôi nổi</p>
            <p className="text-xs font-bold text-slate-200">{currentLanguage}</p>
         </div>
         <div className="h-8 w-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-indigo-400">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.56 6.25 6.25 0 0 1 13.24 0 .87.87 0 0 1 0 .56 6.25 6.25 0 0 1-13.24 0ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
         </div>
      </div>
    </div>
  );
};

export default RealTimeStats;
