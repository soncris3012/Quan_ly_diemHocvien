// src/sections/Section5ERGallery.jsx
// Mục 5: Phòng trưng bày ER - So sánh 2 phiên bản (Tự thiết kế đàng hoàng vs Có AI hỗ trợ)
// Tích hợp tính năng phóng to toàn màn hình (Modal Lightbox Zoom) và upload ảnh thật
import React, { useState, useRef } from 'react';
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
        <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={customImage} 
            alt="Sơ đồ ER tự vẽ của nhóm 519" 
            style={{ transform: `scale(${isLarge ? modalZoom : zoomLevel})`, transition: 'transform 0.2s', maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }}
          />
        </div>
      );
    }

    return (
      <div 
        style={{ 
          transform: `scale(${isLarge ? modalZoom : zoomLevel})`, 
          transformOrigin: 'top left',
          transition: 'transform 0.2s', 
          padding: 20, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 20,
          minWidth: 580
        }}
      >
        {/* Hàng 1: Đơn Vị -> Lớp Học */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1.5px solid var(--color-blue)', borderRadius: 8, padding: '10px 14px', width: 170 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.88rem' }}>DON_VI</div>
            {showAttributes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                • <u>MaDonVi</u> (PK)<br/>• TenDonVi<br/>• LoaiDonVi
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            <span>(1)</span>
            <span>─────[Quản lý]─────➔</span>
            <span>(N)</span>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1.5px solid var(--color-blue)', borderRadius: 8, padding: '10px 14px', width: 170 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.88rem' }}>LOP_HOC</div>
            {showAttributes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                • <u>MaLop</u> (PK)<br/>• TenLop<br/>• MaDonVi (FK)
              </div>
            )}
          </div>
        </div>

        {/* Hàng 2: Học Viên -> Bảng Điểm -> Môn Học */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid var(--color-blue)', borderRadius: 8, padding: '10px 14px', width: 170 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.88rem' }}>HOC_VIEN</div>
            {showAttributes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                • <u>MaHV</u> (PK)<br/>• HoTen<br/>• NgaySinh<br/>• MaLop (FK)
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            <span>(1)</span>
            <span>─────[Có]─────➔</span>
            <span>(N)</span>
          </div>

          <div style={{ background: 'rgba(251, 113, 133, 0.12)', border: '1.5px dashed var(--color-rose)', borderRadius: 8, padding: '10px 14px', width: 190 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-rose)', fontSize: '0.88rem' }}>BANG_DIEM (Chưa chuẩn)</div>
            {showAttributes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                • <u>MaBangDiem</u> (PK)<br/>• MaHV (FK)<br/>• MaMH (FK)<br/>
                • DiemCC, DiemTX<br/>
                <span style={{ color: 'var(--color-rose)' }}>• DiemThi1, DiemThi2 (Vi phạm 1NF)</span><br/>
                • DiemTongKet<br/>
                • DaKhoa (boolean)
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            <span>(N)</span>
            <span>◄─────[Thuộc]─────</span>
            <span>(1)</span>
          </div>

          <div style={{ background: 'rgba(167, 139, 250, 0.1)', border: '1.5px solid var(--color-purple)', borderRadius: 8, padding: '10px 14px', width: 160 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-purple)', fontSize: '0.88rem' }}>MON_HOC</div>
            {showAttributes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                • <u>MaMH</u> (PK)<br/>• TenMH<br/>• SoTinChi<br/>• SoTiet
              </div>
            )}
          </div>
        </div>

        {/* Hàng 3: Tài Khoản */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1.5px solid var(--color-amber)', borderRadius: 8, padding: '10px 14px', width: 170 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', fontSize: '0.88rem' }}>TAI_KHOAN</div>
            {showAttributes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                • <u>MaTaiKhoan</u> (PK)<br/>• TenDangNhap<br/>• MatKhau<br/>• VaiTro (Chỉ huy / Đào tạo)
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            ◄ Chưa có bảng liên kết phân công đơn vị; chỉ huy không có ranh giới xem điểm rõ ràng.
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // RENDER: BẢN CẢI TIẾN CÓ AI HỖ TRỢ & HOÀN THIỆN
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
          gap: 16,
          minWidth: 560
        }}
      >
        {/* Hàng 1: Phân hệ Tổ chức & Chỉ huy */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div 
            onClick={() => onSelectTable('DonVi')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'var(--color-blue)', width: 150 }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.85rem' }}>DonVi (Đệ quy)</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaDonVi, MaDonViCha</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          {showDiff && (
            <div 
              onClick={() => onSelectTable('PhanCongQuanLy')} 
              className="card card-clickable" 
              style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.15)', borderColor: 'var(--color-amber)', boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)', width: 170 }}
              title="Thực thể mới bổ sung để phân quyền chỉ huy"
            >
              <span className="tag tag-amber" style={{ fontSize: '0.62rem' }}>+ BỔ SUNG AI</span>
              <div style={{ fontWeight: 700, color: 'var(--color-amber)', fontSize: '0.85rem' }}>PhanCongQuanLy</div>
              {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaTaiKhoan, MaDonVi, TuNgay</div>}
            </div>
          )}

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          <div 
            onClick={() => onSelectTable('LopHoc')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'var(--color-blue)', width: 140 }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.85rem' }}>LopHoc</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MaLop, MaDonVi</div>}
          </div>
        </div>

        {/* Hàng 2: Trọng tâm Đào tạo & Quản lý Lượt học */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div 
            onClick={() => onSelectTable('HocVien')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'var(--color-blue)', width: 120 }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.85rem' }}>HocVien</div>
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          {/* THỰC THỂ LUOTHOC CỐT LÕI */}
          <div 
            onClick={() => onSelectTable('LuotHoc')} 
            className="card card-clickable" 
            style={{ 
              padding: '10px 14px', 
              background: 'rgba(52, 211, 153, 0.2)', 
              borderColor: 'var(--color-emerald)',
              boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)',
              width: 170
            }}
          >
            <span className="tag tag-emerald" style={{ fontSize: '0.62rem' }}>ĐỘT PHÁ KIẾN TRÚC</span>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.9rem' }}>LuotHoc (Đệ quy)</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: '#fff' }}>MaLuotHoc, MaHV, MaLHP, MaLuotHocTruoc</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:1)──➔</div>

          {/* BẢNG ĐIỂM */}
          <div 
            onClick={() => onSelectTable('BangDiem')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'var(--color-emerald)', width: 140 }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.85rem' }}>BangDiem</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DiemCC, DiemTX, DiemTongKet</div>}
          </div>

          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>──(1:N)──➔</div>

          {/* TÁCH LANTHI */}
          <div 
            onClick={() => onSelectTable('LanThi')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(52, 211, 153, 0.15)', borderColor: 'var(--color-emerald)', width: 140 }}
          >
            <span className="tag tag-emerald" style={{ fontSize: '0.62rem' }}>+ TÁCH LẦN THI</span>
            <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.85rem' }}>LanThi (1, 2)</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DiemThiThucTe, SoLanThi</div>}
          </div>
        </div>

        {/* Hàng 3: Kiểm soát mở khóa & Audit Trail */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div 
            onClick={() => onSelectTable('QuyTacDanhGia')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(167, 139, 250, 0.15)', borderColor: 'var(--color-purple)', width: 150 }}
          >
            <span className="tag tag-purple" style={{ fontSize: '0.62rem' }}>+ PHIÊN BẢN HÓA</span>
            <div style={{ fontWeight: 700, color: 'var(--color-purple)', fontSize: '0.85rem' }}>QuyTacDanhGia</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TrongSo, NguongCK, TranDiem</div>}
          </div>

          <div 
            onClick={() => onSelectTable('YeuCauMoKhoa')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.15)', borderColor: 'var(--color-amber)', width: 150 }}
          >
            <span className="tag tag-amber" style={{ fontSize: '0.62rem' }}>+ DUYỆT BGĐ</span>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', fontSize: '0.85rem' }}>YeuCauMoKhoa</div>
          </div>

          <div 
            onClick={() => onSelectTable('NhatKyDiem')} 
            className="card card-clickable" 
            style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.15)', borderColor: 'var(--color-amber)', width: 150 }}
          >
            <span className="tag tag-amber" style={{ fontSize: '0.62rem' }}>+ AUDIT TRAIL</span>
            <div style={{ fontWeight: 700, color: 'var(--color-amber)', fontSize: '0.85rem' }}>NhatKyDiem</div>
            {showAttributes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GiaTriCu, GiaTriMoi, ThoiDiem</div>}
          </div>
        </div>
      </div>
    );
  };

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
                <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>02/03/2026</span>
              </div>
            </div>

            {/* Container Canvas hiển thị */}
            <div 
              onClick={() => setFullscreenDiagram('initial')}
              style={{ 
                height: 440, 
                background: '#070B14', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 8, 
                overflow: 'auto',
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
                <li>Không phân biệt được <strong>Học lại ở khóa sau</strong> (sẽ bị trùng khóa chính MaHV + MaMH).</li>
                <li>Chưa có cơ cấu đơn vị quân sự để ràng buộc phạm vi cho tài khoản Chỉ huy.</li>
                <li>Chỉ có 1 cờ boolean <code>DaKhoa</code>, không thể biết ai cho phép mở khóa và lý do sửa điểm.</li>
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
                <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--color-blue)' }}>08/03/2026</span>
              </div>
            </div>

            {/* Container Canvas nâng cao */}
            <div 
              onClick={() => setFullscreenDiagram('enhanced')}
              style={{ 
                height: 440, 
                background: '#070B14', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 8, 
                overflow: 'auto',
                position: 'relative',
                cursor: 'zoom-in'
              }}
              title="Nhấn để phóng to toàn màn hình"
            >
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'rgba(8, 13, 24, 0.8)', padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', color: 'var(--color-blue)', pointerEvents: 'none' }}>
                🔍 Click để phóng to
              </div>
              {renderEnhancedDiagram(false)}
            </div>

            {/* Giá trị học thuật của bản cải tiến */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Điểm Khác Biệt Mang Giá Trị Học Thuật:
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li><strong style={{ color: 'var(--color-emerald)' }}>Bổ sung LuotHoc:</strong> Phân biệt rõ thi lại (cùng lượt) với học lại ở khóa sau (lượt mới).</li>
                <li><strong style={{ color: 'var(--color-emerald)' }}>Tách LanThi:</strong> Bảo toàn điểm thi thực tế (DiemThiThucTe = 8.0) dù có trần điểm 6.9.</li>
                <li><strong style={{ color: 'var(--color-amber)' }}>Bổ sung PhanCongQuanLy:</strong> Ràng buộc bảo mật phạm vi dữ liệu theo cây đơn vị.</li>
                <li><strong style={{ color: 'var(--color-purple)' }}>QuyTacDanhGia:</strong> Không hardcode công thức; lưu cấu hình trọng số theo đợt học.</li>
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
            {fullscreenDiagram === 'initial' ? renderInitialDiagram(true) : renderEnhancedDiagram(true)}
          </div>
        </div>
      )}
    </div>
  );
}
