// src/components/Navigation.jsx
// Thanh điều hướng bên trái với 10 chuyên mục, thanh tiến trình và nút chế độ báo cáo
import React from 'react';
import { 
  Compass, 
  Users, 
  GitBranch, 
  Layers, 
  Image, 
  Table, 
  BookOpen, 
  CheckCircle2, 
  Terminal, 
  FileCheck,
  Play,
  RotateCcw,
  Search
} from 'lucide-react';

export const SECTIONS = [
  { id: 'sec_overview', num: '01', title: 'Tổng Quan Đề Tài', icon: Compass, badge: 'Khởi đầu' },
  { id: 'sec_actors', num: '02', title: 'Nghiệp Vụ & Tác Nhân', icon: Users, badge: 'Phân quyền' },
  { id: 'sec_workflows', num: '03', title: 'Quy Trình Tương Tác', icon: GitBranch, badge: 'Swimlanes' },
  { id: 'sec_entities', num: '04', title: 'Danh Mục Thực Thể', icon: Layers, badge: '13 Thực thể' },
  { id: 'sec_er_gallery', num: '05', title: 'Phòng Trưng Bày ER', icon: Image, badge: '2 Bản ER' },
  { id: 'sec_relational', num: '06', title: 'Mô Hình Quan Hệ', icon: Table, badge: '23 Bảng (R1-R23)' },
  { id: 'sec_dictionary', num: '07', title: 'Từ Điển Dữ Liệu', icon: BookOpen, badge: '12 Ràng buộc' },
  { id: 'sec_scenarios', num: '08', title: 'Kiểm Chứng Tình Huống', icon: CheckCircle2, badge: '6 Kịch bản' },
  { id: 'sec_ai_log', num: '09', title: 'Nhật Ký Sử Dụng AI', icon: Terminal, badge: 'Prompting' },
  { id: 'sec_conclusion', num: '10', title: 'Kết Luận & Mở Rộng', icon: FileCheck, badge: 'Đánh giá' }
];

export default function Navigation({ 
  currentSection, 
  onSelectSection, 
  presentationMode, 
  onTogglePresentation,
  onResetMockData,
  onOpenSearch
}) {
  const currentIndex = SECTIONS.findIndex(s => s.id === currentSection);
  const progressPercent = Math.round(((currentIndex + 1) / SECTIONS.length) * 100);

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-icon logo-icon--academy">
          <img src="/smta-logo.png" alt="Logo Học viện Kỹ thuật Quân sự" />
        </div>
        <div className="logo-text">
          <h1>SMTA</h1>
          <p>Hệ Thống Điểm Quân Sự</p>
        </div>
      </div>

      {/* Chỉ hiển thị tiến trình khi bắt đầu chế độ báo cáo */}
      {presentationMode && (
        <div className="presentation-progress">
          <div className="presentation-progress__label">
            <span>TIẾN TRÌNH THUYẾT TRÌNH</span>
            <span className="mono-font">{progressPercent}%</span>
          </div>
          <div className="presentation-progress__track">
            <div className="presentation-progress__value" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* 10 Navigation Items */}
      <nav className={`sidebar-nav ${presentationMode ? 'is-presenting' : ''}`}>
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = currentSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={sec.title}
            >
              <span className="nav-num">{sec.num}</span>
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span className="nav-label" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sec.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Action Footer */}
      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button 
          onClick={onTogglePresentation}
          className={`btn ${presentationMode ? 'btn-primary' : 'btn-secondary'}`}
          style={{ width: '100%', fontSize: '0.82rem', padding: '8px 12px' }}
        >
          <Play size={15} />
          {presentationMode ? 'Dừng Trình Chiếu' : 'Bắt Đầu Báo Cáo'}
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          <button 
            onClick={onOpenSearch}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '0.78rem', padding: '6px 8px' }}
            title="Tìm kiếm nhanh bảng, thực thể, ràng buộc"
          >
            <Search size={14} />
            Tìm Kiếm
          </button>
          <button 
            onClick={onResetMockData}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '0.78rem', padding: '6px 8px', color: 'var(--text-muted)' }}
            title="Khôi phục trạng thái mô phỏng ban đầu"
          >
            <RotateCcw size={14} />
            Khôi Phục
          </button>
        </div>
      </div>
    </aside>
  );
}
