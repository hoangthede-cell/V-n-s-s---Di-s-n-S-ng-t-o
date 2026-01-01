
import React from 'react';

const LegalDocsModal = ({ onClose }: { onClose: () => void }) => {
  const documents = [
    { name: 'Thông tư 32/2018/TT-BGDĐT', description: 'Về việc ban hành Chương trình Giáo dục phổ thông môn Ngữ Văn.', url: 'https://tulieuvankien.dangcongsan.vn/he-thong-van-ban/van-ban-quy-pham-phap-luat/thong-tu-so-322018tt-bgddt-ngay-26122018-cua-bo-giao-duc-va-dao-tao-ban-hanh-chuong-trinh-giao-duc-pho-thong-5083' },
    { name: 'Công văn 5512/BGDĐT-GDTrH', description: 'Về việc xây dựng và tổ chức thực hiện kế hoạch giáo dục của nhà trường (soạn giáo án).', url: 'https://boiduonghanoi.edu.vn/mod/folder/view.php?id=175' },
    { name: 'Công văn 3175/BGDĐT-GDTrH', description: 'Về việc hướng dẫn đổi mới phương pháp dạy học và kiểm tra, đánh giá môn Ngữ văn ở trường phổ thông.', url: 'http://thcslocthien.locninh.edu.vn/van-ban-cong-van/cong-van-3175-bgddt-gdtrh-2022-huong-dan-doi-moi-phuong-phap-day-hoc-va-kiem-tra-danh-gia-mon-ngu-van.html' },
    { name: 'Công văn 7991/BGDĐT-GDTrH', description: 'Về việc hướng dẫn công tác kiểm tra, đánh giá theo tinh thần xây dựng "Trường học thân thiện, học sinh tích cực".', url: 'https://thcsduongquan.haiphong.edu.vn/0-vb-cua-bo/cong-van-so-7791bgddt-gdtrh-vv-thuc-hien-kiem-tra-danh-gia-doi-voi-cap-thcs-thpt/vbctmb/20200/288837' },
    { name: 'Công văn 3456/BGDĐT-GDPT', description: 'Về định hướng triển khai Năng lực số và Giáo dục STEM cấp trung học.', url: 'https://c23longphu.vinhlong.edu.vn/van-ban-cong-van/van-ban-bo-gd-dt/huong-dan-trien-khai-thuc-hien-khung-nang-luc-so-cho-hoc-sinh-pho-thong-va-hoc-vien-giao-duc-thuong-xuyen.html' },
    { name: 'Quyết định số 459/QĐ-SGDĐT', description: 'Của Sở GD&ĐT Tuyên Quang: Hướng dẫn thực hiện nhiệm vụ giáo dục phổ thông năm học 2025-2026.', url: 'https://thdugia.pgdyenminh.edu.vn/tai-lieu/quyet-dinh-so-459qdsgddt-vv-huong-dan-thuc-hien-nhiem-vu-giao-duc-pho-thong-nam-hoc-20252026-68' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b sticky top-0 bg-white/80 backdrop-blur-lg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-serif">Văn bản Pháp quy Nền tảng</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Văn Sĩ Số được xây dựng dựa trên các định hướng và quy định chuyên môn từ những văn bản sau đây để đảm bảo tính sư phạm và cập nhật:
          </p>
          <ul className="space-y-4">
            {documents.map((doc, index) => (
              <li key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-slate-800">{doc.name}</h3>
                <p className="text-sm text-slate-600 mt-1 mb-3">{doc.description}</p>
                {doc.url ? (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group">
                    Xem chi tiết
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" /><path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" /></svg>
                  </a>
                ) : (
                  <span className="text-sm font-medium text-slate-400 italic">Không có liên kết công khai</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LegalDocsModal;