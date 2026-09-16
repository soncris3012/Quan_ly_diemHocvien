// src/App.jsx
// Trung tâm ứng dụng CADET DB - Điều phối các phân hệ, thanh điều hướng và ngăn giải thích
import React, { useState, useEffect } from 'react';
import Navigation, { SECTIONS } from './components/Navigation';
import RightDrawer from './components/RightDrawer';
import PresentationController from './components/PresentationController';
import SearchModal from './components/SearchModal';
import WelcomeModal from './components/WelcomeModal';

import Section1Overview from './sections/Section1Overview';
import Section2Actors from './sections/Section2Actors';
import Section3Workflows from './sections/Section3Workflows';
import Section4Entities from './sections/Section4Entities';
import Section5ERGallery from './sections/Section5ERGallery';
import Section6RelationalModel from './sections/Section6RelationalModel';
import Section7DataDictionary from './sections/Section7DataDictionary';
import Section8Scenarios from './sections/Section8Scenarios';
import Section9AILog from './sections/Section9AILog';
import Section10Conclusion from './sections/Section10Conclusion';

import { TABLES } from './data/dbSchema';
import { ENTITIES } from './data/entityCatalog';
import { 
  ShieldCheck, 
  HelpCircle, 
  Bell, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [currentSection, setCurrentSection] = useState('sec_overview');
  const [inspectorItem, setInspectorItem] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [highlightedTable, setHighlightedTable] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Mở inspector khi người dùng chọn một bảng
  const handleSelectTable = (tableName) => {
    const found = TABLES.find(t => t.name === tableName);
    if (found) {
      setHighlightedTable(tableName);
      setInspectorItem({
        type: 'table',
        data: found
      });
    }
  };

  // Mở inspector cho thực thể, bước nghiệp vụ hoặc khóa ngoại
  const handleOpenInspector = (item) => {
    setInspectorItem(item);
  };

  // Cuộn lên đầu trang mỗi khi chuyển mục
  const handleSelectSection = (sectionId) => {
    setCurrentSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bắt phím tắt Cmd+K hoặc Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render Component tương ứng với chuyên mục
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'sec_overview':
        return (
          <Section1Overview 
            onStartPresentation={() => setPresentationMode(true)}
            onSelectSection={handleSelectSection}
            onOpenInspector={handleOpenInspector}
          />
        );
      case 'sec_actors':
        return (
          <Section2Actors 
            onSelectTable={handleSelectTable}
            onOpenInspector={handleOpenInspector}
          />
        );
      case 'sec_workflows':
        return (
          <Section3Workflows 
            onSelectTable={handleSelectTable}
            onOpenInspector={handleOpenInspector}
          />
        );
      case 'sec_entities':
        return (
          <Section4Entities 
            onSelectTable={handleSelectTable}
            onOpenInspector={handleOpenInspector}
          />
        );
      case 'sec_er_gallery':
        return (
          <Section5ERGallery 
            onOpenInspector={handleOpenInspector}
            onSelectTable={handleSelectTable}
          />
        );
      case 'sec_relational':
        return (
          <Section6RelationalModel 
            onSelectTable={handleSelectTable}
            onOpenInspector={handleOpenInspector}
            highlightedTable={highlightedTable}
          />
        );
      case 'sec_dictionary':
        return (
          <Section7DataDictionary 
            onSelectTable={handleSelectTable}
            onOpenInspector={handleOpenInspector}
          />
        );
      case 'sec_scenarios':
        return (
          <Section8Scenarios 
            onSelectTable={handleSelectTable}
            onOpenInspector={handleOpenInspector}
          />
        );
      case 'sec_ai_log':
        return <Section9AILog />;
      case 'sec_conclusion':
        return <Section10Conclusion onSelectSection={handleSelectSection} />;
      default:
        return <Section1Overview onStartPresentation={() => setPresentationMode(true)} onSelectSection={handleSelectSection} />;
    }
  };

  const currentSecObj = SECTIONS.find(s => s.id === currentSection) || SECTIONS[0];

  return (
    <div className="app-container">
      {/* 1. Thanh điều hướng bên trái */}
      <Navigation 
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        presentationMode={presentationMode}
        onTogglePresentation={() => setPresentationMode(!presentationMode)}
        onResetMockData={() => {
          setInspectorItem(null);
          setHighlightedTable(null);
          window.location.reload();
        }}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* 2. Khung nội dung chính ở giữa */}
      <div className={`main-wrapper ${inspectorItem ? 'drawer-open' : ''}`}>
        {/* Top Header Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <span className="badge-military">
              <Sparkles size={12} />
              CADET DB v2.0 • BÁO CÁO HỌC THUẬT
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Đồ án CSDL</span>
              <ChevronRight size={14} />
              <span style={{ color: '#fff', fontWeight: 600 }}>Mục {currentSecObj.num}: {currentSecObj.title}</span>
            </div>
          </div>

          <div className="top-bar-right">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: 6 }}
            >
              <span>Tìm kiếm...</span>
              <kbd style={{ background: 'rgba(8, 13, 24, 0.8)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '1px 5px', fontSize: '0.7rem' }}>
                ⌘K
              </kbd>
            </button>

            {/* Trạng thái Bảng giải thích chi tiết */}
            <button
              onClick={() => {
                if (inspectorItem) setInspectorItem(null);
                else handleSelectTable('KET_QUA_HOC_TAP'); // Bảng trung tâm tiêu biểu
              }}
              className={`btn btn-sm ${inspectorItem ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem' }}
              title="Mở hoặc đóng ngăn giải thích chi tiết bên phải"
            >
              <HelpCircle size={14} />
              {inspectorItem ? 'Đóng Giải Thích' : 'Ngăn Giải Thích'}
            </button>
          </div>
        </header>

        {/* Nội dung chuyên mục chính */}
        <main className="content-body">
          {renderCurrentSection()}
        </main>
      </div>

      {/* 3. Ngăn giải thích trượt bên phải (Right Inspector Drawer) */}
      <RightDrawer 
        item={inspectorItem}
        onClose={() => setInspectorItem(null)}
        onSelectTable={handleSelectTable}
      />

      {/* 4. Thanh điều khiển nổi khi ở Chế độ báo cáo từng bước */}
      {presentationMode && (
        <PresentationController 
          currentSection={currentSection}
          onSelectSection={handleSelectSection}
          onExit={() => setPresentationMode(false)}
        />
      )}

      {/* 5. Modal Tìm Kiếm Nhanh */}
      <SearchModal 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTable={handleSelectTable}
        onSelectSection={handleSelectSection}
      />

      {/* 6. Modal Chào Mừng Nhóm 519 */}
      <WelcomeModal />
    </div>
  );
}
