import React from 'react';
import { ChevronLeft, ChevronRight, Gauge, Pause, Play, X } from 'lucide-react';
import { SECTIONS } from './Navigation';

const SPEEDS = [
  { value: 0.5, label: '0.5×' },
  { value: 1, label: '1×' },
  { value: 1.5, label: '1.5×' },
  { value: 2, label: '2×' }
];

export default function PresentationController({
  currentSection,
  onSelectSection,
  onExit,
  isPlaying,
  speed,
  onTogglePlaying,
  onSpeedChange
}) {
  const currentIndex = SECTIONS.findIndex(section => section.id === currentSection);
  const current = SECTIONS[currentIndex] || SECTIONS[0];

  const selectSection = (index) => {
    if (index >= 0 && index < SECTIONS.length) onSelectSection(SECTIONS[index].id);
  };

  return (
    <div className="presentation-dock" role="region" aria-label="Điều khiển trình chiếu tự động">
      <div className="presentation-dock__status">
        <span className={`presentation-live-dot ${isPlaying ? 'is-playing' : ''}`} />
        <div>
          <span>{isPlaying ? 'ĐANG TỰ ĐỘNG TRÌNH CHIẾU' : 'ĐÃ TẠM DỪNG'}</span>
          <strong>Mục {current.num} · {current.title}</strong>
        </div>
      </div>

      <div className="presentation-dock__controls">
        <button onClick={() => selectSection(currentIndex - 1)} disabled={currentIndex === 0} className="presentation-icon-btn" title="Mục trước">
          <ChevronLeft size={17} />
        </button>

        <button onClick={onTogglePlaying} className="presentation-play-btn">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Tạm dừng' : 'Tiếp tục'}
        </button>

        <button onClick={() => selectSection(currentIndex + 1)} disabled={currentIndex === SECTIONS.length - 1} className="presentation-icon-btn" title="Mục tiếp theo">
          <ChevronRight size={17} />
        </button>

        <div className="presentation-speed">
          <Gauge size={15} />
          <span>Tốc độ</span>
          <select value={speed} onChange={event => onSpeedChange(Number(event.target.value))} aria-label="Tốc độ trình chiếu">
            {SPEEDS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>

        <span className="presentation-count">{currentIndex + 1}/{SECTIONS.length}</span>
        <button onClick={onExit} className="presentation-icon-btn presentation-close" title="Thoát trình chiếu">
          <X size={17} />
        </button>
      </div>
    </div>
  );
}
