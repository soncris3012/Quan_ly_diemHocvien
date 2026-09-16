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
          Đánh giá mức độ hoàn thiện của mô hình cơ sở dữ liệu SMTA, chỉ rõ các ranh giới thiết kế có chủ đích và lộ trình phát triển cho các giai đoạn triển khai tiếp theo.
        </p>
      </div>

      {/* 4 Đóng Góp Cốt Lõi Về Mặt Học Thuật */}
      <div className="card" style={{ marginBottom: 26, background: 'rgba(17, 27, 46, 0.9)' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="var(--color-blue)" />
          4 Đóng Góp Học Thuật Trọng Tâm Của Bản Thiết Kế (Mô Hình 23 Bảng)
        </h3>

        <div className="grid-2" style={{ gap: 16 }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', marginBottom: 6 }}>
              1. Tích Hợp Đầy Đủ Giảng Viên & Phân Công Giảng Dạy (R15, R16, R19)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Chuẩn hóa thực thể <code>GIANG_VIEN</code> kế thừa từ <code>NGUOI</code>, thuộc <code>BO_MON</code>. Bảng liên kết trung tâm <code>PHAN_CONG</code> kết nối Giảng viên - Môn học - Lớp học - Học kỳ, bảo đảm tính minh bạch khi lưu vết <code>MaNguoiNhap</code> trong bảng <code>DIEM</code>.
            </p>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', marginBottom: 6 }}>
              2. Tách Biệt Đợt Thi (DOT_THI) & Bảo Toàn Điểm Gốc Khi Áp Trần 6.9
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Không bao giờ ghi đè điểm thi 8.0 thành 6.9 trong CSDL. Bảng <code>DIEM</code> lưu điểm bài thi thực tế của đợt thi lại (<code>DOT_THI</code>: THI_LAI); trần 6.9 chỉ áp dụng khi quy đổi và tổng kết trong <code>KET_QUA_HOC_TAP</code>.
            </p>
          </div>

          <div style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-purple)', marginBottom: 6 }}>
              3. Tách Rời Thi Lại Trong Học Kỳ vs Học Lại Khóa Sau
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Thi lại diễn ra trong cùng học kỳ thông qua đợt thi lại của phân công hiện tại. Học lại ở khóa sau được tạo bằng một dòng <code>PHAN_CONG</code> và <code>KET_QUA_HOC_TAP</code> mới độc lập, hoàn toàn không ghi đè lịch sử học tập trước đó.
            </p>
          </div>

          <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', marginBottom: 6 }}>
              4. Bảo Mật Phân Quyền Đa Tầng (RBAC + Row-Level Security)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Kết hợp mô hình RBAC chuẩn (<code>USER</code>, <code>ROLE</code>, <code>PERMISSION</code>) với phạm vi nghiệp vụ: Giảng viên chỉ nhập điểm lớp mình dạy; Chỉ huy được tra cứu điểm toàn Học viện nhưng không có quyền sửa điểm.
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
          Mô hình đã tích hợp đầy đủ <strong>Giảng viên, Bộ môn và Phân công giảng dạy</strong>. Sinh viên chủ động <strong>chưa mở rộng sang các bài toán hạ tầng cơ sở vật chất ngoài phạm vi quản lý điểm</strong> như: Điểm danh từng tiết 45 phút, Quản lý phòng học vật lý hay Xếp thời khóa biểu tự động.
        </p>
        <div className="alert-box alert-amber" style={{ margin: 0 }}>
          <HelpCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.88rem' }}>
            <strong>Giải trình học thuật với cô:</strong> Trọng tâm đề tài là cơ chế tính điểm, phân công giảng dạy, khảo thí và phân quyền quân sự. Việc chuẩn hóa ở 23 bảng quan hệ (R1 - R23) giúp giải quyết trọn vẹn 100% nghiệp vụ điểm và giảng dạy mà không làm phân tán sang bài toán quản lý cơ sở vật chất trường học.
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
