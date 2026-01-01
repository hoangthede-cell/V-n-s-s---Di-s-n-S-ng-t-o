
import React from 'react';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto font-sans animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b sticky top-0 bg-white/95 backdrop-blur-lg z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.704v12.99a.75.75 0 0 0 1.064.683A8.226 8.226 0 0 1 6 17.25c.88 0 1.71.14 2.484.395l2.766.922V4.533Z" />
                <path d="M12.75 18.567V4.533A9.707 9.707 0 0 1 18 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.704v12.99a.75.75 0 0 1-1.064.683A8.226 8.226 0 0 0 18 17.25c-.88 0-1.71.14-2.484.395l-2.766.922Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-serif">Cẩm nang Văn Sĩ Số</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Giới thiệu chung */}
          <section className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
              ✨ Chào mừng em và Thầy/Cô!
            </h3>
            <p className="text-slate-700 leading-relaxed italic">
              "Văn Sĩ Số" không chỉ là một công cụ AI, mà là một người bạn đồng hành sư phạm, 
              được thiết kế dành riêng cho vùng cao Tuyên Quang - Hà Giang. Sứ mệnh của chúng ta là: 
              <strong> Bảo tồn di sản - Khơi nguồn sáng tạo - Kết nối tri thức.</strong>
            </p>
          </section>

          {/* Dành cho Học sinh */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-amber-800 border-l-4 border-amber-500 pl-4">🎓 Dành cho Học sinh: "Hành trình di sản"</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🏔️</div>
                <h4 className="font-bold text-slate-800 mb-1">Khám phá văn hóa</h4>
                <p className="text-xs text-slate-600">Sử dụng nút "Văn hóa địa phương" để tìm hiểu về Lễ hội Nhảy lửa, Hát Then, Đàn Tính...</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">✨</div>
                <h4 className="font-bold text-slate-800 mb-1">Trau chuốt văn hay</h4>
                <p className="text-xs text-slate-600">Dán đoạn văn em viết, Văn Sĩ Số sẽ gợi ý cách dùng từ hình ảnh và biểu cảm hơn.</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🔤</div>
                <h4 className="font-bold text-slate-800 mb-1">Học song ngữ</h4>
                <p className="text-xs text-slate-600">Chọn tiếng dân tộc mình (Mông, Tày, Dao...) để dịch lời hay ý đẹp từ bài học.</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🏅</div>
                <h4 className="font-bold text-slate-800 mb-1">Săn huy hiệu</h4>
                <p className="text-xs text-slate-600">Mỗi lần tương tác giúp em nhận XP và mở khóa các huy hiệu như "Thổ Địa Dân Gian".</p>
              </div>
            </div>
          </section>

          {/* Dành cho Giáo viên */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-800 border-l-4 border-indigo-500 pl-4">👩‍🏫 Dành cho Giáo viên: "Trợ lý chuyên môn"</h3>
            <div className="space-y-4">
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm text-2xl h-fit">📋</div>
                <div>
                  <h4 className="font-bold text-indigo-900 mb-1">Soạn bài bám sát Chương trình 2018</h4>
                  <p className="text-sm text-indigo-800/80">Yêu cầu soạn giáo án tích hợp văn học địa phương, lấy cảm hứng từ các tác giả như nhà văn Lục Mạnh Cường.</p>
                </div>
              </div>
              <div className="p-5 bg-teal-50 rounded-2xl border border-teal-100 flex gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm text-2xl h-fit">🔍</div>
                <div>
                  <h4 className="font-bold text-teal-900 mb-1">Ra đề với Ngữ liệu ngoài Sách giáo khoa</h4>
                  <p className="text-sm text-teal-800/80">Sử dụng tính năng "Ra đề Ngữ liệu ngoài" để AI gợi ý đoạn trích văn chương địa phương kèm ma trận câu hỏi.</p>
                </div>
              </div>
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm text-2xl h-fit">✍️</div>
                <div>
                  <h4 className="font-bold text-rose-900 mb-1">Góp ý bài làm của Học sinh</h4>
                  <p className="text-sm text-rose-800/80">Mở "Góp ý đoạn văn", dán bài của trò để nhận phân tích chi tiết về lỗi và hướng khắc phục.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tri thức địa phương */}
          <section className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="text-amber-400">📜</span> Tiêu điểm: Di sản Lục Mạnh Cường
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 mb-4">
              Văn Sĩ Số vinh dự lưu giữ và lan tỏa tinh thần "Rong chơi miền mây trắng" của cố nhà giáo - nhà văn Lục Mạnh Cường. 
              Hãy hỏi tôi về:
            </p>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-2 italic">• "Lòng trắc ẩn trong văn chương Lục Mạnh Cường"</li>
              <li className="flex items-center gap-2 italic">• "Tình thầy trò vùng cao qua các di tác"</li>
              <li className="flex items-center gap-2 italic">• "Vẻ đẹp văn hóa Tày trong tác phẩm của thầy Cường"</li>
            </ul>
          </section>

          {/* Lưu ý quan trọng */}
          <section className="border-t border-slate-100 pt-6">
             <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">⚠️ Nguyên tắc vận hành</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <p className="text-xs text-slate-600"><strong>AI gợi ý - Con người kiểm tra:</strong> Không sao chép nguyên văn lời giải AI, hãy dùng nó làm cảm hứng.</p>
               </div>
               <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <p className="text-xs text-slate-600"><strong>Dữ liệu địa phương:</strong> Thông tin về văn hóa luôn được ưu tiên bám sát thực tế các dân tộc.</p>
               </div>
             </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 sticky bottom-0 z-10 text-center">
          <button 
            onClick={onClose}
            className="px-12 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 hover:shadow-indigo-200"
          >
            Đã hiểu, bắt đầu khám phá!
          </button>
          <p className="text-[10px] text-slate-400 mt-3 font-medium">Phiên bản 3.0 - Hỗ trợ giáo dục vùng cao Tuyên Quang - Hà Giang</p>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
