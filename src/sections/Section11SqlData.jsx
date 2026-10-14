import React, { useState } from 'react';
import { CheckCircle2, Database, Download, FileSpreadsheet, ShieldCheck, Users } from 'lucide-react';
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
        <div className="section-tag"><Database size={15}/> DỮ LIỆU KHẢO SÁT THỰC TẾ · SQL SERVER</div>
        <h1 className="section-title">Dữ Liệu SQL Thực Tế</h1>
        <p className="section-desc">Bộ dữ liệu khởi tạo từ danh sách cán bộ Viện CNTT và Truyền thông theo Kỷ yếu 2026 và phiếu điểm lớp CNTT2/c160, khóa 60.</p>
      </div>
      <a className="sql-download-button" href="/sql/SMTA_KhaoSat2026_SQLServer.sql" download>
        <Download size={19}/><span><b>Tải file SQL</b><small>SQL Server · UTF-8</small></span>
      </a>
    </div>

    <div className="real-data-metrics">
      <article><Users/><strong>24</strong><span>học viên đúng theo phiếu</span></article>
      <article><FileSpreadsheet/><strong>01</strong><span>phiếu điểm CNTT2/c160</span></article>
      <article><Database/><strong>23</strong><span>bảng nghiệp vụ lõi chuẩn hóa</span></article>
      <article><ShieldCheck/><strong>10–30–60</strong><span>trọng số CC · TX · Thi</span></article>
    </div>

    <section className="card real-source-note">
      <div><CheckCircle2 size={20}/><strong>Nguyên tắc nhập dữ liệu trung thực</strong></div>
      <p>Tên học phần, giảng viên, ngày thi, số tín chỉ, hình thức thi và toàn bộ điểm trên phiếu gốc đang để trống. Script giữ các trường này là <code>NULL</code>, không tự suy đoán hay tạo điểm giả. Tên học viên được giữ nguyên theo văn bản nguồn, kể cả dạng viết tắt “Ng”.</p>
    </section>

    <div className="real-sql-grid">
      <section className="card">
        <header className="real-card-head"><div><span>DATASET A</span><h2>Cơ cấu Viện CNTT và Truyền thông</h2></div><b>Kỷ yếu 2026</b></header>
        <div className="institute-unit-list">
          {INSTITUTE_UNITS.map(([code, name, count]) => <article key={code}><span>{code}</span><div><strong>{name}</strong><small>{count} dòng phân công cán bộ trong nguồn</small></div><b>{count}</b></article>)}
        </div>
        <p className="real-data-footnote">Ban Chỉ huy Viện và cán bộ kiêm nhiệm được chuẩn hóa thành hồ sơ cán bộ duy nhất, còn nhiều chức vụ được lưu ở bảng phân công để không nhân đôi con người.</p>
      </section>

      <section className="card sql-preview-card">
        <header className="real-card-head"><div><span>DATASET B</span><h2>Script chạy trực tiếp trên SQL Server</h2></div><button onClick={copyPreview}>{copied ? 'Đã sao chép' : 'Sao chép'}</button></header>
        <pre><code>{SQL_PREVIEW}</code></pre>
        <ul><li>23 bảng lõi, lớp dữ liệu nguồn và nhật ký thay đổi điểm.</li><li>RBAC cho Học viên, Giảng viên, Phòng Đào tạo và Chỉ huy.</li><li>Mỗi giảng viên một tài khoản ở trạng thái chờ kích hoạt.</li><li>24 học viên × 3 đầu điểm ở trạng thái chờ nhập.</li><li>Thủ tục nhập, duyệt, khóa/mở khóa và tính điểm tổng kết.</li><li>View tái tạo bảng điểm CNTT2/c160.</li></ul>
      </section>
    </div>

    <section className="card real-student-card">
      <header className="real-card-head"><div><span>PHIẾU ĐIỂM THỰC TẾ</span><h2>Danh sách lớp {REAL_CLASS.sectionCode}</h2></div><b>Khóa {REAL_CLASS.cohort} · {REAL_CLASS.students.length} học viên</b></header>
      <div className="real-student-table"><table><thead><tr><th>TT</th><th>Mã dữ liệu</th><th>Họ tên theo phiếu</th><th>Ngày sinh</th><th>Đơn vị</th><th>CC</th><th>TX</th><th>Thi</th><th>Tổng kết</th></tr></thead><tbody>
        {REAL_CLASS.students.map(([id, name, birth], index) => <tr key={id}><td>{index + 1}</td><td><code>{id}</code></td><td>{name}</td><td>{formatDate(birth)}</td><td>{REAL_CLASS.unit}</td><td className="is-null">NULL</td><td className="is-null">NULL</td><td className="is-null">NULL</td><td className="is-null">NULL</td></tr>)}
      </tbody></table></div>
    </section>
  </div>;
}

