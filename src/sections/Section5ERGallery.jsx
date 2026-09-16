// src/sections/Section5ERGallery.jsx
// Mục 5: Phòng trưng bày ER - So sánh 2 phiên bản (Tự thiết kế đàng hoàng vs Có AI hỗ trợ)
// Tích hợp tính năng phóng to toàn màn hình (Modal Lightbox Zoom) và upload ảnh thật
import React, { useEffect, useState, useRef } from 'react';
import ERDiagram from '../components/ERDiagram';
import InitialERDiagram from '../components/InitialERDiagram';
import { 
  Image, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Columns, 
  Layers, 
  Upload, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  RotateCcw,
  GitCompare,
  FileCode,
  X,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

function AutoFitDiagram({ width, height, zoom = 1, children }) {
  const hostRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const updateScale = () => {
      const availableWidth = Math.max(1, host.clientWidth - 20);
      const availableHeight = Math.max(1, host.clientHeight - 20);
      setFitScale(Math.min(availableWidth / width, availableHeight / height, 1));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(host);
    return () => observer.disconnect();
  }, [width, height]);

  const scale = fitScale * zoom;
  return (
    <div ref={hostRef} className="diagram-fit-host">
      <div className="diagram-fit-space" style={{ width: width * scale, height: height * scale }}>
        <div className="diagram-fit-content" style={{ width, height, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Section5ERGallery({ onOpenInspector, onSelectTable }) {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'initial' | 'enhanced'
  const [notation, setNotation] = useState('crowsfoot'); // 'crowsfoot' | 'chen'
  const [showDiff, setShowDiff] = useState(true);
  const [showAttributes, setShowAttributes] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [customImage, setCustomImage] = useState(null);

  // Modal phóng to toàn màn hình
  const [fullscreenDiagram, setFullscreenDiagram] = useState(null); // null | 'initial' | 'enhanced'
  const [modalZoom, setModalZoom] = useState(1.15);

  const fileInputRef = useRef(null);

  // Xử lý upload ảnh sơ đồ vẽ tay thật từ máy tính
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(0.6, prev + delta), 1.8));
  };

  const handleModalZoom = (delta) => {
    setModalZoom(prev => Math.min(Math.max(0.7, prev + delta), 2.5));
  };

  // =========================================================================
  // RENDER: BẢN TỰ THIẾT KẾ ĐÀNG HOÀNG CỦA NHÓM 519
  // =========================================================================
  const renderInitialDiagram = (isLarge = false) => {
    if (customImage) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={customImage} 
            alt="Sơ đồ ER tự vẽ của nhóm 519" 
            style={{ transform: `scale(${isLarge ? modalZoom : zoomLevel})`, transition: 'transform 0.2s', maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
          />
        </div>
      );
    }

    return (
      <AutoFitDiagram width={1120} height={650} zoom={isLarge ? modalZoom : zoomLevel}>
        <InitialERDiagram showAttributes={showAttributes} />
      </AutoFitDiagram>
    );
  };

  // =========================================================================
  // RENDER: BẢN CẢI TIẾN CÓ AI HỖ TRỢ & HOÀN THIỆN (MÔ HÌNH 23 BẢNG R1-R23)
  // =========================================================================
  const renderEnhancedDiagram = (isLarge = false) => {
    return (
      <div 
        style={{ 
          transform: `scale(${isLarge ? modalZoom : zoomLevel})`, 
          transformOrigin: 'top left',
          transition: 'transform 0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          minWidth: 640
        }}
      >
        {/* Hàng 1: NGUOI kế thừa -> HOC_VIEN & GIANG_VIEN */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div 
            onClick={() => onSelectTable('NGUOI')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'var(--color-blue)', width: 160 }}
          >
            <span className="tag tag-blue" style={{ fontSize: '0.62rem' }}>THỰC THỂ CHA (R4)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.85rem' }}>NGUOI</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaNguoi [PK], HoTen, NgaySinh, QueQuan</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(IS-A)──➔</div>

          <div 
            onClick={() => onSelectTable('HOC_VIEN')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'var(--color-blue)', width: 150 }}
          >
            <span className="tag tag-blue" style={{ fontSize: '0.62rem' }}>HỌC VIÊN (R14)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.85rem' }}>HOC_VIEN</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaHV [PK], MaNguoi, MaLop, MaCapBac</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>và</div>

          <div 
            onClick={() => onSelectTable('GIANG_VIEN')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(167, 139, 250, 0.15)', borderColor: 'var(--color-purple)', width: 170, boxShadow: '0 0 12px rgba(167, 139, 250, 0.25)' }}
          >
            <span className="tag tag-purple" style={{ fontSize: '0.62rem' }}>GIẢNG VIÊN (R16) ★</span>
            <div style={{ fontWeight: 700, color: 'var(--color-purple)', fontSize: '0.85rem' }}>GIANG_VIEN</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaGV [PK], MaNguoi, MaBoMon, HocVi</div>}
          </div>
        </div>

        {/* Hàng 2: Bộ Môn & Phân Công Giảng Dạy */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div 
            onClick={() => onSelectTable('BO_MON')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'var(--color-blue)', width: 140 }}
          >
            <span className="tag tag-blue" style={{ fontSize: '0.62rem' }}>BỘ MÔN (R15)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.85rem' }}>BO_MON</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaBoMon [PK], MaDonVi</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          {/* MẮT XÍCH PHAN_CONG */}
          <div 
            onClick={() => onSelectTable('PHAN_CONG')} 
            className="card card-clickable" 
            style={{ 
              padding: '10px 14px', 
              background: 'rgba(52, 211, 153, 0.2)', 
              borderColor: 'var(--color-emerald)',
              boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)',
              width: 200
            }}
          >
            <span className="tag tag-emerald" style={{ fontSize: '0.62rem' }}>MẮT XÍCH TRUNG TÂM (R19)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.9rem' }}>PHAN_CONG</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: '#fff' }}>MaPhanCong [PK], MaGV, MaMonHoc, MaLop, MaHocKy, NhomHoc</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          {/* KẾT QUẢ HỌC TẬP */}
          <div 
            onClick={() => onSelectTable('KET_QUA_HOC_TAP')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'var(--color-emerald)', width: 160 }}
          >
            <span className="tag tag-emerald" style={{ fontSize: '0.62rem' }}>KẾT QUẢ (R21)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.85rem' }}>KET_QUA_HOC_TAP</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaKQ [PK], MaHV, DiemTongKet, XepLoai</div>}
          </div>
        </div>

        {/* Hàng 3: Loại Điểm, Điểm Thành Phần & Đợt Thi */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div 
            onClick={() => onSelectTable('LOAI_DIEM')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.15)', borderColor: 'var(--color-amber)', width: 150 }}
          >
            <span className="tag tag-amber" style={{ fontSize: '0.62rem' }}>TRỌNG SỐ (R20)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', fontSize: '0.85rem' }}>LOAI_DIEM</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaLoaiDiem, TrongSo</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          <div 
            onClick={() => onSelectTable('DIEM')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.15)', borderColor: 'var(--color-amber)', width: 160 }}
          >
            <span className="tag tag-amber" style={{ fontSize: '0.62rem' }}>CHI TIẾT ĐIỂM (R22)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', fontSize: '0.85rem' }}>DIEM (GV Nhập)</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaDiem [PK], Diem, MaNguoiNhap</div>}
          </div>

          <div 
            onClick={() => onSelectTable('DOT_THI')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(251, 113, 133, 0.15)', borderColor: 'var(--color-rose)', width: 150 }}
          >
            <span className="tag tag-rose" style={{ fontSize: '0.62rem' }}>KHẢO THÍ (R23)</span>
            <div style={{ fontWeight: 700, color: 'var(--color-rose)', fontSize: '0.85rem' }}>DOT_THI</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaDotThi, LoaiDotThi, NgayThi</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderAccurateDiagram = (isLarge = false) => (
    <AutoFitDiagram width={1480} height={1062} zoom={isLarge ? modalZoom : zoomLevel}>
      <ERDiagram
        showAttributes={showAttributes}
        notation={notation}
        onSelectTable={onSelectTable}
      />
    </AutoFitDiagram>
  );

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <Image size={15} />
          TRỌNG TÂM ĐỒ ÁN: SO SÁNH HAI PHIÊN BẢN ER
        </div>
        <h2 className="section-title">
          Phòng Trưng Bày ER (Ban Đầu vs AI Hỗ Trợ)
        </h2>
        <p className="section-desc">
          Bản so sánh đối chiếu giữa <strong>Bản thiết kế ban đầu của Nhóm 519</strong> và <strong>Bản hoàn thiện có sự tham gia của AI</strong>. Nhấn vào sơ đồ hoặc nút phóng to để xem toàn màn hình sắc nét.
        </p>
      </div>

      {/* Thanh Điều Khiển Sơ Đồ */}
      <div className="card" style={{ marginBottom: 20, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Bộ nút Chế độ xem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginRight: 6 }}>Bố Cục:</span>
          <button
            onClick={() => setViewMode('split')}
            className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Columns size={14} />
            Song Song
          </button>
          <button
            onClick={() => setViewMode('initial')}
            className={`btn btn-sm ${viewMode === 'initial' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Bản Nhóm 519
          </button>
          <button
            onClick={() => setViewMode('enhanced')}
            className={`btn btn-sm ${viewMode === 'enhanced' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Bản AI Hỗ Trợ
          </button>
        </div>

        {/* Nút bật tắt & Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Nút Upload ảnh thật */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: 'var(--color-blue)' }}
            title="Tải ảnh sơ đồ vẽ tay Draw.io của nhóm nếu có"
          >
            <Upload size={14} />
            {customImage ? 'Đổi Ảnh Sơ Đồ' : 'Tải Ảnh Của Bạn'}
          </button>

          {/* Toggle Điểm khác biệt */}
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={`btn btn-sm ${showDiff ? 'btn-accent-purple' : 'btn-secondary'}`}
          >
            <GitCompare size={14} />
            {showDiff ? 'Tô Khác Biệt' : 'Tắt Tô Màu'}
          </button>

          {/* Toggle Thuộc tính */}
          <button
            onClick={() => setShowAttributes(!showAttributes)}
            className="btn btn-secondary btn-sm"
          >
            {showAttributes ? <Eye size={14} /> : <EyeOff size={14} />}
            Thuộc Tính
          </button>

          {/* Ký pháp Chen vs Crow's Foot */}
          <button
            onClick={() => setNotation(notation === 'crowsfoot' ? 'chen' : 'crowsfoot')}
            className="btn btn-secondary btn-sm"
          >
            {notation === 'crowsfoot' ? "Crow's Foot" : 'Chen'}
          </button>

          {/* Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(8, 13, 24, 0.6)', padding: 2, borderRadius: 6 }}>
            <button onClick={() => handleZoom(-0.15)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
              <ZoomOut size={14} />
            </button>
            <span className="mono-font" style={{ fontSize: '0.75rem', padding: '0 6px', color: 'var(--text-muted)' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button onClick={() => handleZoom(0.15)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Vùng Trưng Bày Sơ Đồ Hai Bên */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr', 
          gap: 20, 
          marginBottom: 28 
        }}
      >
        {/* ========================================= */}
        {/* CỘT TRÁI: BẢN TỰ THIẾT KẾ BAN ĐẦU CỦA NHÓM 519 */}
        {/* ========================================= */}
        {(viewMode === 'split' || viewMode === 'initial') && (
          <div className="card" style={{ background: 'rgba(13, 21, 37, 0.85)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <span className="tag tag-amber" style={{ marginBottom: 4 }}>Bản Nhóm 519 (v0.1)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Bản Tự Thiết Kế Ban Đầu</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setFullscreenDiagram('initial')}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  title="Click để phóng to toàn màn hình"
                >
                  <Maximize2 size={13} />
                  Phóng To
                </button>
                <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>02/09/2026</span>
              </div>
            </div>

            {/* Container Canvas hiển thị */}
            <div 
              onClick={() => setFullscreenDiagram('initial')}
              style={{ 
                height: 560,
                background: '#070B14', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 8, 
                overflow: 'hidden',
                position: 'relative',
                cursor: 'zoom-in'
              }}
              title="Nhấn để phóng to toàn màn hình"
            >
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'rgba(8, 13, 24, 0.8)', padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', color: 'var(--text-dim)', pointerEvents: 'none' }}>
                🔍 Click để phóng to
              </div>
              {renderInitialDiagram(false)}
            </div>

            {/* Phân tích tự đánh giá */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-amber)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Hạn chế nhóm 519 tự nhận ra ở bản ban đầu:
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Dồn tất cả các lần thi (DiemThi1, DiemThi2) vào một dòng bảng điểm $\rightarrow$ vi phạm chuẩn hóa.</li>
                <li><strong>BANG_DIEM</strong> gộp kết quả tổng hợp và điểm thành phần nên khó lưu nhiều lần học hoặc thi lại.</li>
                <li><strong>USER.VaiTro</strong> vẫn là cờ văn bản, chưa tách ROLE–PERMISSION để quản lý quyền linh hoạt.</li>
                <li>Chưa tách <strong>LOAI_DIEM</strong>, <strong>DIEM</strong> và <strong>DOT_THI</strong> nên khó kiểm soát trọng số, người nhập và lịch sử kỳ thi.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* CỘT PHẢI: BẢN CÓ AI HỖ TRỢ & HOÀN THIỆN */}
        {/* ========================================= */}
        {(viewMode === 'split' || viewMode === 'enhanced') && (
          <div className="card" style={{ background: 'rgba(13, 21, 37, 0.85)', display: 'flex', flexDirection: 'column', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <span className="tag tag-blue" style={{ marginBottom: 4 }}>Bản Cải Tiến (v2.0)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} color="var(--color-blue)" />
                  Bản Có AI Hỗ Trợ & Rà Soát
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setFullscreenDiagram('enhanced')}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  title="Click để phóng to toàn màn hình"
                >
                  <Maximize2 size={13} />
                  Phóng To
                </button>
                <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--color-blue)' }}>08/09/2026</span>
              </div>
            </div>

            {/* Container Canvas nâng cao */}
            <div 
              onClick={() => setFullscreenDiagram('enhanced')}
              style={{ 
                height: 560,
                background: '#070B14', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 8, 
                overflow: 'hidden',
                position: 'relative',
                cursor: 'zoom-in'
              }}
              title="Nhấn để phóng to toàn màn hình"
            >
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'rgba(8, 13, 24, 0.8)', padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', color: 'var(--color-blue)', pointerEvents: 'none' }}>
                🔍 Click để phóng to
              </div>
              {renderAccurateDiagram(false)}
            </div>

            {/* Giá trị học thuật của bản cải tiến */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Điểm Khác Biệt Mang Giá Trị Học Thuật:
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li><strong style={{ color: 'var(--color-emerald)' }}>KET_QUA_HOC_TAP theo PHAN_CONG:</strong> Mỗi học kỳ/phân công tạo một kết quả độc lập, không ghi đè lịch sử học phần.</li>
                <li><strong style={{ color: 'var(--color-emerald)' }}>DIEM tách theo LOAI_DIEM:</strong> Mỗi đầu điểm là một bản ghi chuẩn hóa, loại bỏ các cột lặp DiemThi1, DiemThi2.</li>
                <li><strong style={{ color: 'var(--color-amber)' }}>RBAC đầy đủ:</strong> USER–ROLE–PERMISSION giải quyết quan hệ nhiều-nhiều và tách xác thực khỏi hồ sơ NGUOI.</li>
                <li><strong style={{ color: 'var(--color-purple)' }}>PHAN_CONG làm mắt xích:</strong> Liên kết đúng Giảng viên, Môn học, Lớp và Học kỳ; DOT_THI phụ thuộc phân công thực tế.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL LIGHTBOX PHÓNG TO TOÀN MÀN HÌNH THEO YÊU CẦU NGƯỜI DÙNG */}
      {/* ========================================================= */}
      {fullscreenDiagram && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 13, 24, 0.95)',
            backdropFilter: 'blur(16px)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            padding: 24,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setFullscreenDiagram(null)}
        >
          {/* Header Modal */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              paddingBottom: 14, 
              borderBottom: '1px solid var(--border-color)',
              marginBottom: 16
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className={`tag ${fullscreenDiagram === 'initial' ? 'tag-amber' : 'tag-blue'}`}>
                {fullscreenDiagram === 'initial' ? 'Bản Nhóm 519 Thiết Kế' : 'Bản Cải Tiến Có AI Hỗ Trợ'}
              </span>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginTop: 4 }}>
                {fullscreenDiagram === 'initial' ? 'Sơ Đồ Thực Thể Khái Niệm Ban Đầu (Toàn Màn Hình)' : 'Mô Hình ER Hoàn Thiện Sau Rà Soát Học Thuật (Toàn Màn Hình)'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Nút Zoom trong Modal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(17, 27, 46, 0.8)', padding: 4, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <button onClick={() => handleModalZoom(-0.2)} className="btn btn-secondary btn-sm">
                  <ZoomOut size={16} />
                </button>
                <span className="mono-font" style={{ fontSize: '0.85rem', padding: '0 8px', color: '#fff', fontWeight: 600 }}>
                  {Math.round(modalZoom * 100)}%
                </span>
                <button onClick={() => handleModalZoom(0.2)} className="btn btn-secondary btn-sm">
                  <ZoomIn size={16} />
                </button>
                <button onClick={() => setModalZoom(1.0)} className="btn btn-secondary btn-sm" title="Vừa màn hình">
                  100%
                </button>
              </div>

              <button 
                onClick={() => setFullscreenDiagram(null)} 
                className="btn btn-secondary"
                style={{ padding: '8px 14px' }}
                title="Đóng cửa sổ phóng to (ESC)"
              >
                <X size={18} />
                Đóng
              </button>
            </div>
          </div>

          {/* Vùng Canvas hiển thị phóng to */}
          <div 
            style={{ 
              flex: 1, 
              background: '#070B14', 
              border: '1px solid var(--border-color)', 
              borderRadius: 12, 
              overflow: 'auto', 
              padding: 30,
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {fullscreenDiagram === 'initial' ? renderInitialDiagram(true) : renderAccurateDiagram(true)}
          </div>
        </div>
      )}
    </div>
  );
}
