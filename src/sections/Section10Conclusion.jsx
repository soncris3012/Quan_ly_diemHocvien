// src/sections/Section10Conclusion.jsx
// Mục 10: Kết luận thiết kế, giới hạn phạm vi & Hướng mở rộng tương lai
import React from 'react';
import { 
  FileCheck, 
  ShieldAlert, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpRight,
  Database
} from 'lucide-react';

export default function Section10Conclusion({ onSelectSection }) {
  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <FileCheck size={15} />
          TỔNG KẾT & ĐỊNH HƯỚNG PHÁT TRIỂN
        </div>
        <h2 className="section-title">
          Kết Luận Thiết Kế & Ranh Giới Đề Tài
        </h2>
        <p className="section-desc">
          Đánh giá mức độ hoàn thiện của mô hình cơ sở dữ liệu CADET DB, chỉ rõ các ranh giới thiết kế có chủ đích và lộ trình phát triển cho các giai đoạn triển khai tiếp theo.
        </p>
      </div>

      {/* 4 Đóng Góp Cốt Lõi Về Mặt Học Thuật */}
      <div className="card" style={{ marginBottom: 26, background: 'rgba(17, 27, 46, 0.9)' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="var(--color-blue)" />
          4 Đóng Góp Học Thuật Trọng Tâm Của Bản Thiết Kế
        </h3>

        <div className="grid-2" style={{ gap: 16 }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', marginBottom: 6 }}>
              1. Tách Biệt Triệt Để Thi Lại vs Học Lại
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Giải quyết bài toán học lại ở khóa sau bằng thực thể <code>LuotHoc</code> (có <code>MaLuotHocTruoc</code>), không làm mất hoặc ghi đè kết quả của đợt học trước; đồng thời tách <code>LanThi</code> để lưu trữ lịch sử thi lại trong cùng một lượt học.
            </p>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', marginBottom: 6 }}>
              2. Bảo Toàn Điểm Thi Thực Tế Dù Có Áp Trần 6.9
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Không bao giờ ghi đè điểm thi 8.0 thành 6.9 trong cơ sở dữ liệu. Điểm thi gốc được giữ nguyên phục vụ phúc khảo, tra cứu khoa học; mức trần 6.9 chỉ là thuật toán nghiệp vụ tính điểm tổng kết.
            </p>
          </div>

          <div style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-purple)', marginBottom: 6 }}>
              3. Phiên Bản Hóa Quy Tắc Tính Điểm (Versioning Rules)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Loại bỏ hoàn toàn việc "hardcode công thức trong code phần mềm". Bảng <code>QuyTacDanhGia</code> lưu phiên bản trọng số, ngưỡng liệt, trần thi lại giúp giải thích chính xác kết quả của từng đợt đào tạo qua các năm.
            </p>
          </div>

          <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', marginBottom: 6 }}>
              4. Cơ Chế Mở Khóa Điểm & Nhật Ký Biến Động (Audit Trail)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Thiết kế theo chuẩn kiểm toán quân sự: Muốn sửa điểm đã khóa phải có <code>YeuCauMoKhoa</code> được Ban Giám đốc phê chuẩn có thời hạn (24h) và lưu lại vĩnh viễn trong <code>NhatKyDiem</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Ranh Giới Thiết Kế: Những Bảng Chưa Cần Thêm */}
      <div className="card" style={{ marginBottom: 26 }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={18} color="var(--color-amber)" />
          Ranh Giới Thiết Kế Có Chủ Đích (Scope Boundary)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 14 }}>
          Trong quá trình thiết kế, sinh viên đã chủ động <strong>không mở rộng mô hình sang các thực thể ngoài phạm vi</strong> như: Giảng viên giảng dạy, Phòng học, Lịch xếp thời khóa biểu, Điểm danh từng tiết học 45 phút, Kỷ luật và Thi đua khen thưởng.
        </p>
        <div className="alert-box alert-amber" style={{ margin: 0 }}>
          <HelpCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.88rem' }}>
            <strong>Giải trình học thuật với cô:</strong> Tài liệu đề bài hiện chỉ tập trung vào <em>nghiệp vụ quản lý kết quả học tập và quy chế điểm</em>. Việc nhồi nhét quá nhiều bảng về phòng học hay giảng viên chỉ làm mô hình phình to về hình thức mà không giải quyết được chiều sâu bài toán quản lý điểm, đồng thời làm phát sinh nhiều quan hệ ngoài tầm kiểm soát.
          </div>
        </div>
      </div>

      {/* Hướng Phát Triển Mở Rộng */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 14 }}>
          Hướng Mở Rộng Tiếp Theo Khi Triển Khai Thực Tế
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <div style={{ background: 'rgba(8, 13, 24, 0.6)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', marginBottom: 6 }}>
              LichSuBienCheHocVien
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Truy vết quá trình chuyển lớp, chuyển đại đội, chuyển ngành hoặc tạm dừng học tập của học viên theo dòng thời gian.
            </p>
          </div>

          <div style={{ background: 'rgba(8, 13, 24, 0.6)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-purple)', marginBottom: 6 }}>
              LopHocPhanKeHoach
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Cho phép gộp nhiều lớp niên chế khác nhau vào cùng một Lớp học phần thực tế (quan hệ N-N giữa Kế hoạch và Lớp học phần).
            </p>
          </div>

          <div style={{ background: 'rgba(8, 13, 24, 0.6)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', marginBottom: 6 }}>
              Chữ Ký Số Quân Sự (PKI)
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Tích hợp chữ ký số chứng thư số quân đội khi cán bộ Phòng Đào tạo chốt điểm và khi Ban Giám đốc ký duyệt văn bản mở khóa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
