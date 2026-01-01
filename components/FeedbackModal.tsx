
import React, { useState } from 'react';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [studentText, setStudentText] = useState('');

  const handleSubmit = () => {
    if (studentText.trim()) {
      onSubmit(studentText);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b sticky top-0 bg-white/80 backdrop-blur-lg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-serif">Phân tích & Góp ý Đoạn văn</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-sm text-slate-600 mb-4">
            Dán đoạn văn của học sinh vào đây. Văn Sĩ Số sẽ phân tích các lỗi chính tả, ngữ pháp, cấu trúc câu và đưa ra gợi ý sửa chi tiết.
          </p>
          <textarea
            value={studentText}
            onChange={(e) => setStudentText(e.target.value)}
            placeholder="Nhập hoặc dán đoạn văn của học sinh tại đây..."
            className="w-full flex-1 p-3 rounded-lg border border-slate-300 focus:ring-2 outline-none transition-all shadow-sm bg-white text-ink placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/50 resize-none"
            rows={10}
            autoFocus
          />
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-white text-slate-700 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors active:scale-95">
                Hủy
            </button>
            <button
                onClick={handleSubmit}
                disabled={!studentText.trim()}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Gửi phân tích
            </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
