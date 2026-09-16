// src/sections/Section3Workflows.jsx
// Mục 3: Quy trình nghiệp vụ tương tác dạng làn trách nhiệm (Swimlanes)
import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  Database, 
  Lock, 
  Unlock, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { WORKFLOWS } from '../data/businessWorkflows';

export default function Section3Workflows({ onSelectTable, onOpenInspector }) {
  const [activeWorkflowId, setActiveWorkflowId] = useState('flow_a');
  const [activeStepId, setActiveStepId] = useState('step_a1');

  const currentWorkflow = WORKFLOWS.find(w => w.id === activeWorkflowId) || WORKFLOWS[0];

  const handleStepClick = (step) => {
    setActiveStepId(step.id);
    onOpenInspector({
      type: 'workflow_step',
      data: step
    });
  };

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <GitBranch size={15} />
          SƠ ĐỒ LÀN TRÁCH NHIỆM (SWIMLANES)
        </div>
        <h2 className="section-title">
          Quy Trình Nghiệp Vụ Tương Tác
        </h2>
        <p className="section-desc">
          Bấm vào từng bước nghiệp vụ để thấy <strong>dữ liệu đầu vào, đầu ra</strong> và <strong>các bảng cơ sở dữ liệu liên quan phát sáng</strong>. Giúp hiểu rõ tại sao CSDL cần các bảng đó.
        </p>
      </div>

      {/* Tabs Chuyển 3 Luồng Nghiệp Vụ */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {WORKFLOWS.map((wf) => {
          const isActive = activeWorkflowId === wf.id;
          return (
            <button
              key={wf.id}
              onClick={() => {
                setActiveWorkflowId(wf.id);
                setActiveStepId(wf.steps[0].id);
              }}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{wf.title.split(':')[0]}</span>
              <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>{wf.title.split(':')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Tóm tắt luồng */}
      <div className="card" style={{ marginBottom: 24, background: 'rgba(17, 27, 46, 0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{currentWorkflow.title}</h3>
          <span className="tag tag-purple">{currentWorkflow.subtitle}</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          {currentWorkflow.summary}
        </p>
      </div>

      {/* Giao diện Làn trách nhiệm (Swimlane Interactive Steps) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 30 }}>
        {currentWorkflow.steps.map((step, idx) => {
          const isSelected = activeStepId === step.id;
          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step)}
              className={`card card-clickable ${isSelected ? 'selected-step' : ''}`}
              style={{
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? 'var(--color-blue)' : 'var(--border-color)',
                background: isSelected ? 'rgba(17, 27, 46, 0.95)' : 'rgba(13, 21, 37, 0.6)',
                boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div 
                  style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 8, 
                    background: isSelected ? 'var(--color-blue)' : 'rgba(38, 52, 77, 0.4)',
                    color: isSelected ? '#031221' : 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span className="tag tag-purple" style={{ fontSize: '0.72rem' }}>
                      Làn: {step.lane}
                    </span>
                    <h4 style={{ fontSize: '1rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                      {step.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Các bảng liên quan sáng lên */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 380 }}>
                {step.relatedTables.map((tbl, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTable(tbl);
                    }}
                    className="tag tag-blue"
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.1)',
                      color: isSelected ? '#fff' : 'var(--color-blue)'
                    }}
                    title={`Click để xem cấu trúc bảng ${tbl}`}
                  >
                    <Database size={11} />
                    {tbl}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sơ Đồ Cây Quyết Định (Đặc biệt cho Luồng B: Thi lại vs Học lại) */}
      {activeWorkflowId === 'flow_b' && (
        <div className="card" style={{ background: 'rgba(8, 13, 24, 0.8)', border: '1px solid rgba(167, 139, 250, 0.3)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-purple)', marginBottom: 14 }}>
            <HelpCircle size={18} />
            ĐIỂM NHẤN BÁO CÁO: CÂY QUYẾT ĐỊNH THI LẠI VS HỌC LẠI
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 18px', background: 'rgba(17, 27, 46, 0.5)', borderRadius: 10, fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            <div>Có kết quả học tập lần đầu</div>
            <div style={{ paddingLeft: 20 }}>↓</div>
            <div style={{ paddingLeft: 20 }}>Đạt yêu cầu? ── <strong>CÓ</strong> ──➔ [Hoàn thành học phần] (KET_QUA_HOC_TAP.TrangThai = HOAN_THANH)</div>
            <div style={{ paddingLeft: 20 }}>│</div>
            <div style={{ paddingLeft: 20 }}><strong>KHÔNG ĐẠT</strong></div>
            <div style={{ paddingLeft: 20 }}>↓</div>
            <div style={{ paddingLeft: 20 }}>Đủ điều kiện thi lại? (Chưa quá 2 lần thi)</div>
            <div style={{ paddingLeft: 20 }}>↓</div>
            <div style={{ paddingLeft: 20 }}>Thi lại Lần 2 (Tổ chức <code style={{ color: 'var(--color-emerald)' }}>DOT_THI.LoaiDotThi = THI_LAI</code> và ghi đầu điểm thi mới trong DIEM)</div>
            <div style={{ paddingLeft: 20 }}>↓</div>
            <div style={{ paddingLeft: 20 }}>Đạt sau thi lại? ── <strong>CÓ</strong> ──➔ [Hoàn thành sau thi lại] (Áp trần 6.9, bảo toàn điểm thực tế 8.0)</div>
            <div style={{ paddingLeft: 20 }}>│</div>
            <div style={{ paddingLeft: 20 }}><strong>VẪN KHÔNG ĐẠT</strong></div>
            <div style={{ paddingLeft: 20 }}>↓</div>
            <div style={{ paddingLeft: 20 }}>BẮT BUỘC PHẢI HỌC LẠI Ở KHÓA SAU</div>
            <div style={{ paddingLeft: 20 }}>↓</div>
            <div style={{ paddingLeft: 20, color: 'var(--color-amber)', fontWeight: 'bold' }}>
              ➔ Tạo <code style={{ color: 'var(--color-blue)' }}>PHAN_CONG mới</code> ở học kỳ sau ➔ Tạo một <code style={{ color: 'var(--color-purple)' }}>KET_QUA_HOC_TAP mới</code> cho học viên; kết quả cũ vẫn được bảo toàn.
            </div>
          </div>
        </div>
      )}

      {/* Sơ Đồ Quy Trình Khóa / Mở Khóa (Đặc biệt cho Luồng C) */}
      {activeWorkflowId === 'flow_c' && (
        <div className="card" style={{ background: 'rgba(8, 13, 24, 0.8)', border: '1px solid rgba(251, 191, 36, 0.3)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-amber)', marginBottom: 14 }}>
            <Lock size={18} />
            QUY TRÌNH ĐỀ XUẤT CHO GIAI ĐOẠN TRIỂN KHAI (AUDIT TRAIL)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, textAlign: 'center', fontSize: '0.8rem' }}>
            <div style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.3)', borderRadius: 8, padding: 12 }}>
              <Lock size={20} color="var(--color-rose)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, color: 'var(--color-rose)' }}>1. Điểm Khóa</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Kết quả đã công bố</div>
            </div>

            <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 8, padding: 12 }}>
              <AlertCircle size={20} color="var(--color-amber)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, color: 'var(--color-amber)' }}>2. Đề Xuất</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Phiếu yêu cầu: CHỜ DUYỆT</div>
            </div>

            <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 12 }}>
              <Unlock size={20} color="var(--color-emerald)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>3. BGĐ Duyệt</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Hạn sửa trong 24h</div>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 8, padding: 12 }}>
              <FileCheck size={20} color="var(--color-blue)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, color: 'var(--color-blue)' }}>4. Sửa & Nhật Ký</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Nhật ký trước/sau (bảng mở rộng)</div>
            </div>

            <div style={{ background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: 8, padding: 12 }}>
              <Lock size={20} color="var(--color-purple)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, color: 'var(--color-purple)' }}>5. Tái Khóa</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Tính lại & Khóa sổ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
