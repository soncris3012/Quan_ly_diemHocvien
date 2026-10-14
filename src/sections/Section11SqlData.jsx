import React, { useState } from 'react';
import { Database, Download } from 'lucide-react';
import { INSTITUTE_UNITS, REAL_CLASS } from '../data/realSurveyData';

const SQL_PREVIEW = `-- SQL Server · dữ liệu khảo sát thực tế
USE [SMTA_KHAO_SAT_2026];

-- Các ô điểm trên phiếu gốc chưa có dữ liệu nên giữ NULL
MERGE dbo.PHIEU_DIEM AS target
USING (VALUES
  ('PD_CNTT2_C160', 'CNTT2/c160', 60, 0.10, 0.30, 0.60)
) AS source(MaPhieu, MaLopHocPhan, KhoaHoc, HSChuyenCan, HSThuongXuyen, HSThi)
ON target.MaPhieu = source.MaPhieu
WHEN NOT MATCHED THEN INSERT
  (MaPhieu, MaLopHocPhan, KhoaHoc, HSChuyenCan, HSThuongXuyen, HSThi)
VALUES
  (source.MaPhieu, source.MaLopHocPhan, source.KhoaHoc,
   source.HSChuyenCan, source.HSThuongXuyen, source.HSThi);`;

function formatDate(value) {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(`${value}T00:00:00`));
}

export default function Section11SqlData() {
  const [copied, setCopied] = useState(false);
  const copyPreview = async () => {
    await navigator.clipboard.writeText(SQL_PREVIEW);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return <div className="section-view real-sql-section">
    <div className="section-header real-sql-header">
      <div>
        <div className="section-tag"><Database size={15}/> CSDL CHUẨN HÓA · SQL SERVER</div>
        <h1 className="section-title">Cơ Sở Dữ Liệu Quản Lý Điểm</h1>
        <p className="section-desc">Cấu trúc bảng và nghiệp vụ được hoàn thiện từ file SQL tham khảo. Tên người và thông tin nhân sự trong nguồn chưa được xác minh nên chỉ dùng làm dữ liệu đối chiếu, không khẳng định là danh sách chính thức.</p>
      </div>
      <a className="sql-download-button" href="/sql/SMTA_KhaoSat2026_SQLServer.sql" download>
        <Download size={19}/><span><b>Tải file SQL</b><small>SQL Server · UTF-8</small></span>
      </a>
    </div>

    <div className="real-sql-grid">
      <section className="card">
        <header className="real-card-head"><div><span>NGUỒN THAM KHẢO A</span><h2>Cơ cấu đơn vị và cán bộ</h2></div><b>Chưa xác minh danh tính</b></header>
        <div className="institute-unit-list">
          {INSTITUTE_UNITS.map(([code, name, count]) => <article key={code}><span>{code}</span><div><strong>{name}</strong><small>{count} dòng phân công cán bộ trong nguồn</small></div><b>{count}</b></article>)}
        </div>
        <p className="real-data-footnote">Cách bố trí được giữ lại: một hồ sơ con người duy nhất, chức vụ và đơn vị được quản lý theo phân công. Tên trong nguồn chỉ là dữ liệu tham khảo và có thể thay thế mà không đổi cấu trúc CSDL.</p>
      </section>

      <section className="card sql-preview-card">
        <header className="real-card-head"><div><span>DATASET B</span><h2>Script chạy trực tiếp trên SQL Server</h2></div><button onClick={copyPreview}>{copied ? 'Đã sao chép' : 'Sao chép'}</button></header>
        <pre><code>{SQL_PREVIEW}</code></pre>
        <ul><li>23 bảng lõi, dữ liệu nguồn và nhật ký thay đổi điểm.</li><li>RBAC cho Học viên, Giảng viên, Phòng Đào tạo và Chỉ huy.</li><li>Mỗi giảng viên một tài khoản ở trạng thái chờ kích hoạt.</li><li>Dòng điểm chỉ được tạo khi giảng viên thực sự nhập điểm.</li><li>Thủ tục nhập, duyệt, khóa/mở khóa và tính điểm tổng kết.</li><li>View tái tạo bảng điểm CNTT2/c160.</li></ul>
      </section>
    </div>

    <section className="card real-student-card">
        <header className="real-card-head"><div><span>DỮ LIỆU ĐỐI CHIẾU</span><h2>Danh sách lớp {REAL_CLASS.sectionCode}</h2></div><b>Khóa {REAL_CLASS.cohort} · {REAL_CLASS.students.length} bản ghi</b></header>
      <div className="real-student-table"><table><thead><tr><th>TT</th><th>Mã dữ liệu</th><th>Họ tên trong file nguồn</th><th>Ngày sinh</th><th>Đơn vị</th><th>CC</th><th>TX</th><th>Thi</th><th>Tổng kết</th></tr></thead><tbody>
        {REAL_CLASS.students.map(([id, name, birth], index) => <tr key={id}><td>{index + 1}</td><td><code>{id}</code></td><td>{name}</td><td>{formatDate(birth)}</td><td>{REAL_CLASS.unit}</td><td className="is-null">NULL</td><td className="is-null">NULL</td><td className="is-null">NULL</td><td className="is-null">NULL</td></tr>)}
      </tbody></table></div>
    </section>
  </div>;
}

