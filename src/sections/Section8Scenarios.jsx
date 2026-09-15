// src/sections/Section8Scenarios.jsx
// Mục 8: Tình huống kiểm chứng mô hình - 6 Kịch bản tương tác thực nghiệm
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Play, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Database,
  ArrowRight,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarioData';
import confetti from 'canvas-confetti';

export default function Section8Scenarios({ onSelectTable, onOpenInspector }) {
  const [activeScenarioId, setActiveScenarioId] = useState('sc1');

  // Trạng thái cho Tình huống 3 (Toggle 2 cách hiểu trần 6.9)
  const [retestInterpretation, setRetestInterpretation] = useState('A');

  // Trạng thái cho Tình huống 5 (Máy trạng thái quy trình mở khóa sửa điểm)
  const [simStep, setSimStep] = useState(1); // 1: Khóa, 2: Gửi Yêu Cầu, 3: BGĐ Duyệt, 4: Sửa Điểm, 5: Nhật Ký & Tái Khóa
  const [editedScore, setEditedScore] = useState('5.5');

  // Trạng thái cho Tình huống 6 (Chọn chỉ huy)
  const [selectedCommander, setSelectedCommander] = useState('ch_c1');

  const currentScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  const handleReset = () => {
    setSimStep(1);
    setEditedScore('5.5');
    setRetestInterpretation('A');
    setSelectedCommander('ch_c1');
  };

  const handleTriggerSuccess = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <CheckCircle2 size={15} />
          KIỂM CHỨNG TÍNH ĐÚNG ĐẮN CỦA THIẾT KẾ
        </div>
        <h2 className="section-title">
          6 Tình Huống Kiểm Chứng Mô Hình CSDL
        </h2>
        <p className="section-desc">
          Thực nghiệm trực tiếp với dữ liệu giả định để chứng minh thiết kế 19 bảng giải quyết trọn vẹn mọi yêu cầu nghiệp vụ phức tạp của nhà trường quân sự.
        </p>
      </div>

      {/* Tabs Chọn 6 Tình Huống */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {SCENARIOS.map((sc, i) => {
          const isActive = activeScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                handleReset();
              }}
              className={`card card-clickable ${isActive ? 'selected-scenario' : ''}`}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? 'var(--color-blue)' : 'var(--border-color)',
                background: isActive ? 'rgba(17, 27, 46, 0.95)' : 'rgba(13, 21, 37, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`tag ${sc.badgeClass}`} style={{ fontSize: '0.68rem' }}>{sc.badge}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>TH #{i + 1}</span>
              </div>
              <div style={{ fontWeight: 700, color: isActive ? '#fff' : 'var(--text-muted)', fontSize: '0.88rem' }}>
                {sc.title.split(':')[1] || sc.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* NỘI DUNG CHI TIẾT TÌNH HUỐNG ĐANG CHỌN */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: 28, background: 'rgba(17, 27, 46, 0.9)' }}>
        {/* Header Tình huống */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
          <div>
            <span className={`tag ${currentScenario.badgeClass}`} style={{ marginBottom: 6 }}>
              {currentScenario.badge}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{currentScenario.title}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {currentScenario.description}
            </p>
          </div>

          <button onClick={handleReset} className="btn btn-secondary btn-sm" title="Khôi phục trạng thái tình huống">
            <RotateCcw size={14} />
            Khôi Phục
          </button>
        </div>

        {/* Các bảng cơ sở dữ liệu liên quan phát sáng */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Các bảng liên quan được kiểm chứng:</span>
          {currentScenario.highlightTables.map((tbl, i) => (
            <button
              key={i}
              onClick={() => onSelectTable(tbl)}
              className="tag tag-blue"
              style={{ cursor: 'pointer', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'rgba(56, 189, 248, 0.15)' }}
              title="Xem chi tiết bảng"
            >
              <Database size={11} />
              {tbl}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* GIAO DIỆN TƯƠNG TÁC TỪNG TÌNH HUỐNG CỤ THỂ */}
        {/* ========================================================================= */}

        {/* TÌNH HUỐNG 1: HỌC BÌNH THƯỜNG */}
        {activeScenarioId === 'sc1' && (
          <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: 18, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div style={{ background: 'rgba(17, 27, 46, 0.7)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Chuyên Cần (10%)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-blue)' }}>8.0</div>
              </div>
              <div style={{ background: 'rgba(17, 27, 46, 0.7)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Thường Xuyên (30%)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-purple)' }}>7.0</div>
              </div>
              <div style={{ background: 'rgba(17, 27, 46, 0.7)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Thi Cuối Kỳ (60%)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-emerald)' }}>6.0</div>
              </div>
            </div>

            <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', fontWeight: 700, textTransform: 'uppercase' }}>Công thức tính tổng kết:</div>
                  <div className="mono-font" style={{ fontSize: '0.92rem', color: '#fff', marginTop: 4 }}>
                    {currentScenario.mockData.calculated.formulaStr}
                  </div>
                </div>
                <span className="tag tag-emerald" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                  KẾT QUẢ: ĐẠT
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TÌNH HUỐNG 2: CUỐI KỲ DƯỚI NGƯỠNG (< 4.0) */}
        {activeScenarioId === 'sc2' && (
          <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: 18, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div style={{ background: 'rgba(17, 27, 46, 0.7)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Chuyên Cần (10%)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-blue)' }}>9.0</div>
              </div>
              <div style={{ background: 'rgba(17, 27, 46, 0.7)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Thường Xuyên (30%)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-purple)' }}>8.0</div>
              </div>
              <div style={{ background: 'rgba(251, 113, 133, 0.15)', border: '1px solid var(--color-rose)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-rose)', fontWeight: 700 }}>Thi Cuối Kỳ (&lt; 4.0)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-rose)' }}>3.0</div>
                <span className="tag tag-rose" style={{ fontSize: '0.65rem' }}>ĐIỂM LIỆT</span>
              </div>
            </div>

            <div style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.3)', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-rose)', fontWeight: 700, textTransform: 'uppercase' }}>Xử lý quy tắc điểm liệt:</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>
                    {currentScenario.mockData.calculated.formulaStr}
                  </div>
                </div>
                <span className="tag tag-rose" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                  KẾT QUẢ: KHÔNG ĐẠT
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TÌNH HUỐNG 3: THI LẠI ĐẠT ĐIỂM CAO & ÁP TRẦN 6.9 */}
        {activeScenarioId === 'sc3' && (
          <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: 18, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>
                Học viên thi lại Lần 2 đạt: <strong style={{ color: 'var(--color-emerald)', fontSize: '1.1rem' }}>8.0 Điểm</strong> (Điểm thi thực tế bài thi)
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setRetestInterpretation('A')}
                  className={`btn btn-sm ${retestInterpretation === 'A' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Cách 1: Trần Điểm Thi (7.4)
                </button>
                <button
                  onClick={() => setRetestInterpretation('B')}
                  className={`btn btn-sm ${retestInterpretation === 'B' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Cách 2: Trần Tổng Kết (6.9)
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 700, color: 'var(--color-amber)', marginBottom: 6 }}>
                {retestInterpretation === 'A' ? currentScenario.mockData.interpretationA.title : currentScenario.mockData.interpretationB.title}
              </div>
              <div className="mono-font" style={{ fontSize: '0.9rem', color: '#fff' }}>
                {retestInterpretation === 'A' ? currentScenario.mockData.interpretationA.calc : currentScenario.mockData.interpretationB.calc}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 8, fontStyle: 'italic' }}>
                * Bảo toàn dữ liệu: Cột <code>LanThi.DiemThiThucTe</code> vẫn lưu số 8.0, không ghi đè trực tiếp trong CSDL.
              </div>
            </div>
          </div>
        )}

        {/* TÌNH HUỐNG 4: HỌC LẠI Ở KHÓA SAU (2 LƯỢT HỌC) */}
        {activeScenarioId === 'sc4' && (
          <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: 18, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
              {/* Lượt học 1 (Trượt) */}
              <div style={{ background: 'rgba(251, 113, 133, 0.05)', border: '1px solid rgba(251, 113, 133, 0.3)', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="tag tag-rose">LƯỢT HỌC 1 (LH001)</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Học lần đầu</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{currentScenario.mockData.attempt1.term}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Lớp HP: {currentScenario.mockData.attempt1.lhp}</div>
                <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--color-rose)' }}>
                  Thi lần 1: 3.0 • Thi lần 2: 3.5 ➔ Tổng kết: 3.5 (KHÔNG ĐẠT)
                </div>
              </div>

              {/* Lượt học 2 (Học lại cùng K59 - Đạt) */}
              <div style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="tag tag-emerald">LƯỢT HỌC 2 (LH002)</span>
                  <span className="mono-font" style={{ fontSize: '0.72rem', color: 'var(--color-purple)' }}>
                    MaLuotHocTruoc = 'LH001'
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{currentScenario.mockData.attempt2.term}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Lớp HP: {currentScenario.mockData.attempt2.lhp}</div>
                <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--color-emerald)' }}>
                  CC: 8.5 • TX: 7.5 • Thi 1: 7.0 ➔ Tổng kết: 7.3 (ĐẠT)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TÌNH HUỐNG 5: QUY TRÌNH SỬA ĐIỂM ĐÃ KHÓA (MÔ PHỎNG TƯƠNG TÁC) */}
        {activeScenarioId === 'sc5' && (
          <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: 18, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
                Thực Nghiệm Thao Tác Mở Khóa & Sửa Điểm (Bước {simStep}/5)
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(stepNum => (
                  <div 
                    key={stepNum}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: simStep >= stepNum ? 'var(--color-blue)' : 'rgba(38, 52, 77, 0.5)',
                      color: simStep >= stepNum ? '#031221' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {stepNum}
                  </div>
                ))}
              </div>
            </div>

            {/* Bước 1: Khóa */}
            {simStep === 1 && (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <Lock size={40} color="var(--color-rose)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ color: '#fff', marginBottom: 6 }}>Bảng Điểm Đang Ở Trạng Thái: ĐÃ KHÓA</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Học viên nộp đơn phúc khảo bài thi. Điểm bài thi hiện tại là 3.0. Nút sửa trực tiếp bị khóa.
                </p>
                <button onClick={() => setSimStep(2)} className="btn btn-primary">
                  Lập Đơn Đề Nghị Mở Khóa Gửi Ban Giám Đốc
                </button>
              </div>
            )}

            {/* Bước 2: Chờ Duyệt */}
            {simStep === 2 && (
              <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-amber)', marginBottom: 6 }}>
                  Đã tạo bản ghi YeuCauMoKhoa: Mã YC_2026_001
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                  Lý do: "Chấm phúc khảo bài thi kết thúc môn theo quyết định Hội đồng". Trạng thái: CHO_DUYET.
                </div>
                <button onClick={() => setSimStep(3)} className="btn btn-primary">
                  Đóng Vai Ban Giám Đốc: PHÊ DUYỆT YÊU CẦU
                </button>
              </div>
            )}

            {/* Bước 3: Đã Duyệt */}
            {simStep === 3 && (
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-emerald)', marginBottom: 6 }}>
                  <Unlock size={18} />
                  Ban Giám Đốc Đã Chuẩn Y: Bảng Điểm Chuyển Thành "MO_KHOA_TAM"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                  Thời hạn được phép chỉnh sửa: <strong>24 Giờ</strong> (HanDuocSua = +24h). Quyền sửa được kích hoạt.
                </div>
                <button onClick={() => setSimStep(4)} className="btn btn-primary">
                  Tiến Hành Điều Chỉnh Điểm Phúc Khảo
                </button>
              </div>
            )}

            {/* Bước 4: Sửa Điểm */}
            {simStep === 4 && (
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-blue)', marginBottom: 8 }}>
                  Cập Nhật Điểm Bài Thi Mới (LanThi.DiemThiThucTe)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Điểm cũ: <strong style={{ color: 'var(--color-rose)' }}>3.0</strong></span>
                  <ArrowRight size={16} color="var(--color-blue)" />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Điểm mới:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editedScore}
                    onChange={(e) => setEditedScore(e.target.value)}
                    style={{ width: 80, padding: '4px 8px', background: '#0D1525', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 6, fontWeight: 700 }}
                  />
                </div>
                <button 
                  onClick={() => {
                    setSimStep(5);
                    handleTriggerSuccess();
                  }} 
                  className="btn btn-primary"
                >
                  Lưu Thay Đổi & Ghi Vào Sổ Nhật Ký Điểm
                </button>
              </div>
            )}

            {/* Bước 5: Nhật Ký Audit Trail & Tái Khóa */}
            {simStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-emerald)' }}>
                    <FileCheck size={18} />
                    Đã Ghi Nhận Bản Ghi Nhật Ký Điểm (NhatKyDiem - LOG_001)
                  </div>
                  <div className="mono-font" style={{ fontSize: '0.82rem', color: '#fff', marginTop: 6 }}>
                    INSERT INTO NhatKyDiem (MaBangDiem, LoaiThaoTac, TenTruong, GiaTriCu, GiaTriMoi, NguoiThucHien) <br/>
                    VALUES ('BD001', 'SUA_DIEM', 'DiemThiThucTe', '3.0', '{editedScore}', 'TK_DAO_TAO')
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(17, 27, 46, 0.6)', padding: 12, borderRadius: 8 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Hệ thống tự động tính lại điểm tổng kết và tái khóa bảng điểm: <strong>DA_KHOA</strong>.
                  </span>
                  <button onClick={handleReset} className="btn btn-secondary btn-sm">
                    Thử Lại Từ Đầu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TÌNH HUỐNG 6: XEM THEO ĐƠN VỊ CỦA CHỈ HUY */}
        {activeScenarioId === 'sc6' && (
          <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: 18, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {currentScenario.commanders.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => setSelectedCommander(cmd.id)}
                  className={`btn ${selectedCommander === cmd.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {cmd.name} ({cmd.unit})
                </button>
              ))}
            </div>

            {(() => {
              const cmd = currentScenario.commanders.find(c => c.id === selectedCommander);
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 14 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-emerald)', marginBottom: 8 }}>
                      ✓ ĐƯỢC PHÉP TRUY CẬP ({cmd.allowedClasses.length} Lớp)
                    </div>
                    <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {cmd.allowedClasses.map((cls, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>
                          Lớp <strong>{cls}</strong> (Thuộc biên chế {cmd.unit})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(251, 113, 133, 0.08)', border: '1px solid rgba(251, 113, 133, 0.3)', borderRadius: 8, padding: 14 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-rose)', marginBottom: 8 }}>
                      ✗ TỪ CHỐI TRUY CẬP (NGOÀI PHẠM VI)
                    </div>
                    <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      {cmd.blockedClasses.map((cls, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>
                          Lớp <strong>{cls}</strong> (Không thuộc quyền quản lý)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Lời Giải Thích Học Thuật */}
        <div style={{ marginTop: 18, background: 'rgba(13, 21, 37, 0.6)', borderLeft: '3px solid var(--color-blue)', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
            Ý Nghĩa Chứng Minh Cho Thiết Kế CSDL:
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {currentScenario.explanation}
          </div>
        </div>
      </div>
    </div>
  );
}
