// src/components/RightDrawer.jsx
// Ngăn giải thích chi tiết trượt bên phải (Right Inspector Drawer)
import React, { useEffect } from 'react';
import { X, Database, Link2, ShieldCheck, HelpCircle, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { TABLES, SCHEMA_GROUPS } from '../data/dbSchema';

export default function RightDrawer({ item, onClose, onSelectTable }) {
  // Đóng khi bấm phím ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  // Xử lý các loại item khác nhau (bảng, cột/FK, thực thể, bước quy trình)
  let title = 'Chi Tiết Đối Tượng';
  let subtitle = '';
  let badgeText = '';
  let badgeClass = 'tag-blue';

  if (item.type === 'table') {
    title = item.data.name;
    subtitle = item.data.title;
    const group = SCHEMA_GROUPS[item.data.groupId];
    badgeText = group ? group.name : 'Bảng Dữ Liệu';
    badgeClass = group ? group.colorTag : 'tag-blue';
  } else if (item.type === 'entity') {
    title = item.data.name;
    subtitle = item.data.meaning;
    badgeText = 'Thực Thể ER';
    badgeClass = item.data.groupId === 'org' ? 'tag-blue' : item.data.groupId === 'train' ? 'tag-purple' : item.data.groupId === 'score' ? 'tag-emerald' : 'tag-amber';
  } else if (item.type === 'workflow_step') {
    title = item.data.title;
    subtitle = `Thuộc làn trách nhiệm: ${item.data.lane}`;
    badgeText = 'Bước Nghiệp Vụ';
    badgeClass = 'tag-purple';
  } else if (item.type === 'fk_link') {
    title = `Liên Kết Khóa Ngoại: ${item.sourceTable}.${item.fkColumn}`;
    subtitle = `Tham chiếu đến bảng: ${item.targetTable}.${item.targetColumn}`;
    badgeText = 'Ràng Buộc Quan Hệ (FK)';
    badgeClass = 'tag-amber';
  }

  return (
    <div className="inspector-drawer open" role="dialog" aria-modal="true">
      <div className="drawer-header">
        <div>
          <span className={`tag ${badgeClass}`} style={{ marginBottom: 6 }}>
            {badgeText}
          </span>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={18} color="var(--color-blue)" />
            {title}
          </h3>
          {subtitle && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
        </div>
        <button className="drawer-close" onClick={onClose} title="Đóng ngăn giải thích (ESC)">
          <X size={20} />
        </button>
      </div>

      <div className="drawer-body">
        {/* NỘI DUNG NẾU LÀ BẢNG DỮ LIỆU */}
        {item.type === 'table' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Vì sao cần bảng này */}
            <div className="card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-blue)', fontWeight: 700, marginBottom: 8, fontSize: '0.9rem' }}>
                <HelpCircle size={16} />
                TẠI SAO BẮT BUỘC PHẢI CÓ BẢNG NÀY?
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {item.data.justification}
              </p>
            </div>

            {/* Mô tả nghiệp vụ */}
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Ý Nghĩa Nghiệp Vụ
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                {item.data.description}
              </p>
            </div>

            {/* Danh sách trường dữ liệu */}
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span>Cấu Trúc Thuộc Tính ({item.data.columns.length} Cột)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-blue)' }}>Click [FK] để truy vết</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {item.data.columns.map((col, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      background: 'rgba(8, 13, 24, 0.6)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      padding: '9px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="mono-font" style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                          {col.name}
                        </span>
                        {col.key?.includes('PK') && <span className="tag tag-amber" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>PK</span>}
                        {col.key?.includes('FK') && (
                          <button 
                            onClick={() => col.ref && onSelectTable(col.ref.table)}
                            className="tag tag-blue" 
                            style={{ fontSize: '0.68rem', padding: '1px 5px', cursor: col.ref ? 'pointer' : 'default', border: 'none' }}
                            title={col.ref ? `Bấm để mở bảng tham chiếu ${col.ref.table}` : ''}
                          >
                            FK ➔ {col.ref?.table}
                          </button>
                        )}
                        {col.key?.includes('UQ') && <span className="tag tag-purple" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>UQ</span>}
                      </div>
                      <span className="mono-font" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {col.type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>{col.description}</span>
                      <span style={{ fontSize: '0.72rem', color: col.nullable ? 'var(--text-dim)' : 'var(--color-amber)' }}>
                        {col.nullable ? 'NULL' : 'NOT NULL'}
                      </span>
                    </div>

                    {col.example && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontStyle: 'italic', borderTop: '1px dashed var(--border-subtle)', paddingTop: 4, marginTop: 2 }}>
                        Ví dụ mẫu: <code style={{ color: 'var(--color-emerald)' }}>{col.example}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Các ràng buộc toàn vẹn */}
            {item.data.constraints && (
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="var(--color-emerald)" />
                  Ràng Buộc Toàn Vẹn & Khóa
                </div>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {item.data.constraints.map((c, i) => (
                    <li key={i} className="mono-font" style={{ color: 'var(--text-primary)' }}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* NỘI DUNG NẾU LÀ BƯỚC NGHIỆP VỤ */}
        {item.type === 'workflow_step' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ background: 'rgba(167, 139, 250, 0.08)', borderColor: 'rgba(167, 139, 250, 0.3)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-purple)', marginBottom: 6, fontSize: '0.85rem' }}>
                MÔ TẢ THAO TÁC NGHIỆP VỤ
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {item.data.desc}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Dữ Liệu Đầu Vào (Input)</div>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {item.data.input}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Xử Lý Nghiệp Vụ (Processing)</div>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {item.data.processing}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Dữ Liệu Đầu Ra (Output)</div>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--color-emerald)' }}>
                {item.data.output}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Database size={14} color="var(--color-blue)" />
                CÁC BẢNG DỮ LIỆU ĐƯỢC ĐỌC / TÁC ĐỘNG ({item.data.relatedTables.length} Bảng)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {item.data.relatedTables.map((tblName, i) => {
                  const tbl = TABLES.find(t => t.name === tblName);
                  return (
                    <div 
                      key={i} 
                      onClick={() => onSelectTable(tblName)}
                      className="card card-clickable" 
                      style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-blue)' }}>{tblName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tbl ? tbl.title : ''}</div>
                      </div>
                      <ExternalLink size={14} color="var(--text-dim)" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* NỘI DUNG NẾU LÀ LIÊN KẾT KHÓA NGOẠI */}
        {item.type === 'fk_link' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ background: 'rgba(251, 191, 36, 0.08)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-amber)', marginBottom: 8, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link2 size={16} />
                QUAN HỆ THAM CHIẾU TOÀN VẸN
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Cột <code style={{ color: 'var(--color-blue)' }}>{item.fkColumn}</code> trong bảng <strong>{item.sourceTable}</strong> là khóa ngoại (Foreign Key) trỏ tới khóa chính <code style={{ color: 'var(--color-emerald)' }}>{item.targetColumn}</code> của bảng <strong>{item.targetTable}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '16px 0' }}>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.85rem' }}
                onClick={() => onSelectTable(item.sourceTable)}
              >
                {item.sourceTable}
              </button>
              <ArrowRight size={20} color="var(--color-amber)" />
              <button 
                className="btn btn-primary" 
                style={{ fontSize: '0.85rem' }}
                onClick={() => onSelectTable(item.targetTable)}
              >
                {item.targetTable}
              </button>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>
                Ý Nghĩa Ràng Buộc Nghiệp Vụ
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {item.businessRule || `Mỗi bản ghi trong ${item.sourceTable} bắt buộc phải tham chiếu đến một bản ghi hợp lệ đã tồn tại trong ${item.targetTable}.`}
              </p>
            </div>
          </div>
        )}

        {/* NỘI DUNG NẾU LÀ THỰC THỂ */}
        {item.type === 'entity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-blue)', marginBottom: 6, fontSize: '0.85rem' }}>
                LÝ DO CẦN TỒN TẠI THỰC THỂ
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {item.data.justification}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Thuộc Tính Khóa (Định Danh)</div>
              <code style={{ background: 'rgba(8, 13, 24, 0.8)', padding: '6px 12px', borderRadius: 6, color: 'var(--color-amber)', display: 'inline-block' }}>
                {item.data.identifier}
              </code>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Các Mối Quan Hệ Liên Kết</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.data.relationships}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Ví Dụ Dữ Liệu Thực Tế</div>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: 'var(--color-emerald)' }}>
                {item.data.example}
              </div>
            </div>

            {item.data.tableRef && (
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: 10, width: '100%' }}
                onClick={() => onSelectTable(item.data.tableRef)}
              >
                <Database size={16} color="var(--color-blue)" />
                Xem Bảng Quan Hệ Tương Ứng: {item.data.tableRef}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
