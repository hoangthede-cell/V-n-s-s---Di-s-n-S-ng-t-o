
import React from 'react';

const ProductInfoModal = ({ onClose }: { onClose: () => void }) => {
  const productDescription = `Văn sĩ số là một giải pháp AI chuyên sâu, được thiết kế như một trợ lý ảo sư phạm dành riêng cho môn Ngữ Văn cấp THCS (lớp 6-9) theo Chương trình GDPT 2018. Sản phẩm giải quyết hai bài toán lớn: (1) Hỗ trợ học sinh yếu thế ở vùng dân tộc thiểu số thông qua tính năng song ngữ Việt và các tiếng Mông, Tày, Dao...; (2) Trở thành công cụ đắc lực cho giáo viên trong việc soạn giáo án, tạo đề kiểm tra theo ma trận và bản đặc tả của Bộ GD&ĐT, đồng thời tích hợp các hoạt động phát triển Năng lực số.

Với học sinh, Văn sĩ số không giải bài thay mà tập trung phát triển tư duy qua các tính năng gợi ý dàn ý (scaffolding), nhập vai nhân vật (roleplay) và sửa lỗi diễn đạt, **đảm bảo nguyên tắc "AI gợi ý - Con người kiểm tra - Con người quyết định - Hệ thống thực thi"**. Với giáo viên, sản phẩm là công cụ hỗ trợ đắc lực giúp giảm tải công việc, tự động hóa quy trình ra đề, và cung cấp các gợi ý sư phạm hiện đại, bám sát các công văn chỉ đạo của ngành.`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b sticky top-0 bg-white/80 backdrop-blur-lg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-serif">II. Thông tin sản phẩm dự thi</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto text-sm">
          <form className="space-y-6">
            {/* Tên sản phẩm */}
            <div>
              <label className="font-semibold text-slate-700">Tên sản phẩm/giải pháp AI:</label>
              <input type="text" readOnly value="Văn sĩ số - Trợ lý dạy học Ngữ văn THCS" className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-slate-100 cursor-default"/>
            </div>
            
            {/* Thông tin tác giả */}
            <div>
              <label className="font-semibold text-slate-700">Thông tin tác giả/nhóm tác giả:</label>
              <div className="mt-2 space-y-2 p-3 border border-slate-300 rounded-md bg-slate-50">
                <div>
                  <label className="text-xs font-medium text-slate-500">Họ và tên:</label>
                  <input type="text" readOnly value="Hoàng Thế Đệ" className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white cursor-default text-sm"/>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Đơn vị công tác:</label>
                  <input type="text" readOnly value="Giáo viên Trường PTDTBT TH&THCS Hố Quáng Phìn, Xã Lũng Phìn, Tỉnh Tuyên Quang" className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white cursor-default text-sm"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Số điện thoại:</label>
                    <input type="tel" readOnly value="0849149867" className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white cursor-default text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Email:</label>
                    <input type="email" readOnly value="hoangthede@gmail.com" className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white cursor-default text-sm"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Lĩnh vực dự thi */}
            <fieldset>
              <legend className="font-semibold text-slate-700 mb-2">Lĩnh vực dự thi:</legend>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="field1" checked={false} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="field1" className="text-slate-600">Quản lý giáo dục</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="field2" checked={true} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="field2" className="text-slate-800 font-medium">Dạy học</label>
                </div>
              </div>
            </fieldset>

            {/* Hình thức sản phẩm */}
            <fieldset>
              <legend className="font-semibold text-slate-700 mb-2">Hình thức sản phẩm:</legend>
              <div className="space-y-2 pl-2">
                 <div className="flex items-center gap-2">
                  <input type="checkbox" id="format1" checked={false} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="format1" className="text-slate-600">Giải pháp/mô hình/quy trình ứng dụng AI trong quản lý giáo dục</label>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="format2" checked={true} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-1" />
                  <label htmlFor="format2" className="text-slate-800 font-medium">Bài giảng/công cụ hỗ trợ dạy học, học liệu số, đánh giá học sinh, cá nhân hoá học tập...</label>
                </div>
              </div>
            </fieldset>
            
            {/* Mô tả tóm tắt */}
            <div>
              <label htmlFor="description" className="font-semibold text-slate-700">Mô tả tóm tắt sản phẩm (150-300 từ):</label>
              <textarea 
                id="description" 
                readOnly 
                rows={6} 
                className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-slate-100 cursor-default"
              >
                {productDescription.trim()}
              </textarea>
            </div>

            {/* Tài liệu/bằng chứng */}
            <fieldset>
              <legend className="font-semibold text-slate-700 mb-2">Tài liệu/bằng chứng kèm theo:</legend>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="doc1" checked={true} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="doc1" className="text-slate-800 font-medium">Bản mô tả sản phẩm (≤ 10 trang A4)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="doc2" checked={true} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="doc2" className="text-slate-800 font-medium">Video minh họa (≤ 10 phút)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="doc3" checked={true} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="doc3" className="text-slate-800 font-medium">Tài khoản demo / QR code / mã định danh sản phẩm</label>
                </div>
                 <div className="flex items-center gap-2">
                  <input type="checkbox" id="doc4" checked={false} disabled className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="doc4" className="text-slate-600">Tệp minh họa khác: ............................................</label>
                </div>
              </div>
            </fieldset>

            {/* III. Cam kết của thí sinh/nhóm dự thi */}
            <fieldset>
              <legend className="font-semibold text-slate-700 mb-2">III. Cam kết của thí sinh/nhóm dự thi:</legend>
              <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700">
                <li>Sản phẩm dự thi là do chúng tôi tự thực hiện, đảm bảo không sao chép, không vi phạm bản quyền, tuân thủ đạo đức AI, Luật An ninh mạng và các quy định pháp luật liên quan.</li>
                <li>Thông tin cung cấp trong Phiếu đăng ký là hoàn toàn chính xác.</li>
                <li>Đồng ý cho Sở GD&ĐT Tuyên Quang sử dụng sản phẩm cho mục đích chia sẻ, tập huấn và truyền thông theo Thể lệ cuộc thi.</li>
                <li>Chịu trách nhiệm trước pháp luật nếu phát hiện sản phẩm vi phạm quyền sở hữu trí tuệ hoặc gian lận.</li>
              </ul>
              <div className="mt-4 text-right text-xs italic text-slate-500">
                <p>Ngày ...... tháng ...... năm 2026</p>
                <p className="font-bold text-slate-700 mt-1">Thí sinh/Đại diện nhóm</p>
                <p>(Ký và ghi rõ họ tên)</p>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button onClick={() => window.print()} className="px-4 py-2 text-sm font-semibold bg-white text-slate-700 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors active:scale-95 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 2a2 2 0 0 0-2 2v2h12V4a2 2 0 0 0-2-2H4ZM2 8.25V12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.25a.75.75 0 0 1 1.5 0V12a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 12V8.25a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" /><path d="M8.25 10a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0V10ZM5.25 10a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0v-.5ZM11.5 10.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z" /></svg>
              In thông tin
            </button>
            <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors active:scale-95"
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoModal;