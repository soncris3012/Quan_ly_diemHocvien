// src/sections/Section1Overview.jsx
// Mục 1: Tổng quan đề tài, thông tin học thuật, giả định, nội dung cần cô xác nhận và Cụm 3D
import React from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  Sparkles, 
  Play, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import Hero3DCanvas from '../components/Hero3DCanvas';

export default function Section1Overview({ onStartPresentation, onSelectSection, onOpenInspector }) {
  const issuesNeedingConfirmation = [
    {
      issue: 'Điều kiện qua môn & Điểm liệt',
      why: 'Tài liệu chỉ nêu điểm cuối kỳ dưới 4.0 nhưng chưa nêu rõ ngưỡng điểm tổng kết tối thiểu đạt.',
      resolution: 'Tách rõ: Ngưỡng liệt cuối kỳ (< 4.0), Ngưỡng tổng kết đạt (>= 4.0) và lưu trạng thái HOAN_THANH / CHUA_DAT trong KET_QUA_HOC_TAP.'
    },
    {
      issue: 'Trần điểm thi lại 6.9',
      why: 'Chưa rõ trần 6.9 áp dụng cho điểm bài thi cuối kỳ lần 2 hay áp dụng cho điểm tổng kết học phần.',
      resolution: 'Thể hiện cả hai cách hiểu trên giao diện tương tác; giữ nguyên Điểm thi thực tế trong bảng DIEM và áp trần khi tính KET_QUA_HOC_TAP.'
    },
    {
      issue: 'Học lại cùng khóa sau',
      why: 'Nếu chỉ có mã học viên và môn học thì không thể lưu nhiều đợt học của cùng một môn mà không đè dữ liệu.',
      resolution: 'Bổ sung bảng phân công giảng dạy PHAN_CONG (R19) theo từng học kỳ và KET_QUA_HOC_TAP (R21) độc lập cho mỗi lần học.'
    },
    {
      issue: 'Giảng viên & Trách nhiệm nhập điểm',
      why: 'Đề bài ban đầu thiếu thực thể Giảng viên nên chưa xác định được ai trực tiếp giảng dạy và ai chịu trách nhiệm nhập điểm quá trình.',
      resolution: 'Chuẩn hóa thêm BO_MON (R15), GIANG_VIEN (R16) kế thừa NGUOI (R4), liên kết qua PHAN_CONG (R19) và lưu MaNguoiNhap trong DIEM (R22).'
    },
    {
      issue: 'Bảo mật phân quyền quân sự',
      why: 'Chỉ huy đơn vị, Giảng viên và Học viên có thẩm quyền và phạm vi dữ liệu hoàn toàn khác nhau.',
      resolution: 'Ứng dụng mô hình RBAC (USER, ROLE, PERMISSION) kết hợp Row-Level Security theo cây đơn vị DON_VI và phân công PHAN_CONG.'
    }
  ];

  return (
    <div className="section-view">
      {/* Tiêu đề & Thông điệp mở đầu */}
      <div className="section-header">
        <div className="section-tag">
          <GraduationCap size={15} />
          BÁO CÁO THIẾT KẾ CƠ SỞ DỮ LIỆU HỌC THUẬT
        </div>
        <h1 className="section-title">
          CADET DB — Quản Lý Điểm Học Viên Quân Sự
        </h1>
        <p className="section-desc">
          Bản báo cáo tương tác phân tích nghiệp vụ, mô hình hóa thực thể ER, chuyển đổi sang 23 bảng quan hệ chuẩn hóa (R1 - R23) tích hợp đầy đủ Giảng viên & Phân công giảng dạy, và kiểm chứng bằng 6 tình huống thực tế.
        </p>
      </div>

      {/* Thông tin sinh viên & Học phần */}
      <div className="grid-4" style={{ marginBottom: 26 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue)' }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Nhóm Thực Hiện</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>Nhóm 519</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-blue)' }}>Sơn, Bảo, Quyết, Hùng, Khánh</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-purple)' }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Môn Học & Đề Tài</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>Cơ Sở Dữ Liệu</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thiết kế CSDL Học vụ Quân sự</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-emerald)' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Giai Đoạn Thiết Kế</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>Khái Niệm & Quan Hệ</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Chưa triển khai SQL / Backend</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-amber)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Phương Pháp Thực Hiện</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>Tự Thiết Kế + Hỗ Trợ AI</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rà soát & phản biện học thuật</div>
          </div>
        </div>
      </div>

      {/* Cụm Mô Hình 3D Trung Tâm */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            <Sparkles size={18} color="var(--color-blue)" />
            Cụm 4 Không Gian Dữ Liệu Cốt Lõi (3D Interactive Architecture)
          </div>
          <button 
            onClick={onStartPresentation}
            className="btn btn-primary btn-sm"
          >
            <Play size={14} />
            Bắt Đầu Báo Cáo Từng Bước
          </button>
        </div>
        <Hero3DCanvas onNodeSelect={onSelectSection} />
      </div>

      {/* Khung Thông Điệp Bài Toán & Giả Định */}
      <div className="card" style={{ marginBottom: 28, background: 'rgba(17, 27, 46, 0.8)' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={18} color="var(--color-blue)" />
          Mục Tiêu & Phạm Vi Thiết Kế
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 14 }}>
          Đề tài tập trung <strong>mô hình hóa cấu trúc dữ liệu</strong> phục vụ việc phân công học tập theo lớp, ghi nhận điểm thành phần, xử lý thi lại, học lại cùng khóa sau và kiểm soát chặt chẽ quy trình sửa điểm trong cơ cấu tổ chức quản lý học viên quân sự.
        </p>
        <div className="alert-box alert-blue" style={{ margin: 0 }}>
          <Info size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Lưu ý về phạm vi hệ thống:</strong> Website hoạt động như một <em>bản báo cáo học thuật tương tác</em> bằng dữ liệu giả lập. Các thao tác nhập điểm, chốt sổ, mở khóa và phân quyền trên giao diện là mô phỏng trực quan để giải thích kiến trúc CSDL ở giai đoạn tiền SQL, không phải mã nguồn ứng dụng hoàn chỉnh.
          </div>
        </div>
      </div>

      {/* Bảng Các Vấn Đề Cần Cô Xác Nhận */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="var(--color-amber)" />
            Những Điểm Cần Giảng Viên Xác Nhận & Đề Xuất Xử Lý
          </h3>
          <span className="tag tag-amber">Tính Minh Bạch Học Thuật</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          Bản phân tích bài toán ban đầu có một số chỗ chưa nhất quán về mặt toán học và quy chế. Dưới đây là cách hệ thống tách biệt giữa <strong>yêu cầu đề bài</strong>, <strong>giả định mô phỏng</strong> và <strong>nội dung đề xuất cô chuẩn y</strong>:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Vấn đề trong đề bài</th>
                <th style={{ padding: '10px 14px' }}>Vì sao cần làm rõ?</th>
                <th style={{ padding: '10px 14px' }}>Cách trình bày đề xuất trên CADET DB</th>
              </tr>
            </thead>
            <tbody>
              {issuesNeedingConfirmation.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-amber)' }}>
                    {row.issue}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {row.why}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-primary)' }}>
                    {row.resolution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
