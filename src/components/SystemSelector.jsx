import React from 'react';
import { ArrowRight, Activity, GraduationCap, ShieldCheck } from 'lucide-react';

export default function SystemSelector({ onSelect }) {
  return (
    <main className="system-gateway">
      <div className="system-gateway__halo" />
      <header className="system-gateway__header">
        <img src="/smta-logo.png" alt="Học viện Kỹ thuật Quân sự" />
        <div>
          <span>MTA DATA PORTAL</span>
          <h1>Chọn Hệ Thống Quản Lý</h1>
        </div>
      </header>

      <section className="system-choice-grid">
        <button className="system-choice system-choice--smta" onClick={() => onSelect('smta')}>
          <div className="system-choice__number">01</div>
          <div className="system-choice__icon"><GraduationCap size={38} /></div>
          <span className="system-choice__code">SMTA</span>
          <h2>Quản Lý Điểm Học Viên</h2>
          <p>Phân công giảng dạy, điểm thành phần, thi lại, học lại và phân quyền học vụ.</p>
          <div className="system-choice__stats"><span>23 thực thể</span><span>27 khóa ngoại</span><span>10 chuyên mục</span></div>
          <strong>Truy cập SMTA <ArrowRight size={18} /></strong>
        </button>

        <button className="system-choice system-choice--xmta" onClick={() => onSelect('xmta')}>
          <div className="system-choice__number">02</div>
          <div className="system-choice__icon"><Activity size={38} /></div>
          <span className="system-choice__code">XMTA</span>
          <h2>Quản Lý Kiểm Tra Thể Lực</h2>
          <p>Sàng lọc y tế, đợt kiểm tra, lượt thi, barem theo tuổi và quy đổi kết quả thể lực.</p>
          <div className="system-choice__stats"><span>6 thực thể lõi</span><span>3NF</span><span>10 chuyên mục</span></div>
          <strong>Truy cập XMTA <ArrowRight size={18} /></strong>
        </button>
      </section>

      <footer className="system-gateway__footer"><ShieldCheck size={15} /> Báo cáo học thuật tương tác · Nhóm 519 · Học viện Kỹ thuật Quân sự</footer>
    </main>
  );
}
