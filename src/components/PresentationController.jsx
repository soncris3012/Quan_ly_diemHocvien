// src/components/PresentationController.jsx
// Thanh điều khiển nổi ở cạnh dưới khi ở Chế độ thuyết trình từng bước
import React from 'react';
import { ChevronLeft, ChevronRight, X, Play, Compass } from 'lucide-react';
import { SECTIONS } from './Navigation';

export default function PresentationController({ currentSection, onSelectSection, onExit }) {
  const currentIndex = SECTIONS.findIndex(s => s.id === currentSection);
  const current = SECTIONS[currentIndex] || SECTIONS[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectSection(SECTIONS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < SECTIONS.length - 1) {
      onSelectSection(SECTIONS[currentIndex + 1].id);
    }
  };

  return (
    <div className="presentation-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="badge-military" style={{ fontSize: '0.7rem' }}>
          CHẾ ĐỘ BÁO CÁO ({currentIndex + 1}/{SECTIONS.length})
        </span>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
          Mục {current.num}: {current.title}
        </span>
      </div>

      <div style={{ height: 20, width: 1, background: 'var(--border-color)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="btn btn-secondary btn-sm"
          style={{ opacity: currentIndex === 0 ? 0.4 : 1, padding: '6px 10px' }}
          title="Mục trước"
        >
          <ChevronLeft size={16} />
          Trước
        </button>

        <button 
          onClick={handleNext} 
          disabled={currentIndex === SECTIONS.length - 1}
          className="btn btn-primary btn-sm"
          style={{ opacity: currentIndex === SECTIONS.length - 1 ? 0.4 : 1, padding: '6px 14px' }}
          title="Mục kế tiếp"
        >
          Tiếp Theo
          <ChevronRight size={16} />
        </button>

        <button 
          onClick={onExit} 
          className="btn btn-secondary btn-sm" 
          style={{ padding: '6px 8px', marginLeft: 6, color: 'var(--text-dim)' }}
          title="Thoát chế độ thuyết trình"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
