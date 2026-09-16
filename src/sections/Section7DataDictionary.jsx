// src/sections/Section7DataDictionary.jsx
// Mục 7: Từ điển dữ liệu toàn diện & 12 ràng buộc toàn vẹn cốt lõi
import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Filter, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Code
} from 'lucide-react';
import { TABLES, INTEGRITY_CONSTRAINTS } from '../data/dbSchema';

export default function Section7DataDictionary({ onSelectTable, onOpenInspector }) {
  const [selectedTable, setSelectedTable] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dictionary'); // 'dictionary' | 'constraints'

  // Thu thập toàn bộ thuộc tính từ 23 bảng thành danh sách phẳng
  const allAttributes = TABLES.flatMap(tbl => {
    return tbl.columns.map(col => ({
      ...col,
      tableName: tbl.name,
      tableTitle: tbl.title,
      groupId: tbl.groupId
    }));
  });

  const filteredAttributes = allAttributes.filter(attr => {
    const matchTable = selectedTable === 'ALL' || attr.tableName === selectedTable;
    const matchSearch = attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        attr.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        attr.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        attr.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTable && matchSearch;
  });

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <BookOpen size={15} />
          ĐẶC TẢ CHI TIẾT TỪNG TRƯỜNG DỮ LIỆU
        </div>
        <h2 className="section-title">
          Từ Điển Dữ Liệu & Ràng Buộc Toàn Vẹn
        </h2>
        <p className="section-desc">
          Bảng tra cứu toàn diện cấu trúc trường dữ liệu của 23 bảng quan hệ (R1 – R23) và hệ thống 12 quy tắc toàn vẹn cốt lõi, phân định rõ ràng ràng buộc nào do CSDL đảm nhiệm và ràng buộc nào cần xử lý nghiệp vụ.
        </p>
      </div>

      {/* Chuyển Tab: Từ Điển vs Ràng Buộc */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`btn ${activeTab === 'dictionary' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          Từ Điển Dữ Liệu ({allAttributes.length} Trường)
        </button>
        <button
          onClick={() => setActiveTab('constraints')}
          className={`btn ${activeTab === 'constraints' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <ShieldCheck size={16} />
          12 Ràng Buộc Toàn Vẹn Cốt Lõi
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TỪ ĐIỂN DỮ LIỆU */}
      {/* ========================================================= */}
      {activeTab === 'dictionary' && (
        <div>
          {/* Bộ lọc theo bảng & Search */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Chọn bảng:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{
                  background: 'rgba(17, 27, 46, 0.9)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  padding: '7px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="ALL">Tất cả 23 bảng ({allAttributes.length} thuộc tính)</option>
                {TABLES.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.columns.length} cột)</option>
                ))}
              </select>
            </div>

            <div style={{ position: 'relative', width: 300 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Tìm trường, bảng, miền giá trị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 34px',
                  background: 'rgba(17, 27, 46, 0.9)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Bảng dữ liệu tra cứu */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', maxHeight: 580 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#0D1525', zIndex: 10 }}>
                  <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 14px' }}>Bảng</th>
                    <th style={{ padding: '12px 14px' }}>Tên Trường</th>
                    <th style={{ padding: '12px 14px' }}>Ý Nghĩa Nghiệp Vụ</th>
                    <th style={{ padding: '12px 14px' }}>Kiểu Dữ Liệu</th>
                    <th style={{ padding: '12px 14px' }}>Khóa</th>
                    <th style={{ padding: '12px 14px' }}>Bắt Buộc?</th>
                    <th style={{ padding: '12px 14px' }}>Miền Giá Trị</th>
                    <th style={{ padding: '12px 14px' }}>Ví Dụ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttributes.map((attr, idx) => (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderBottom: '1px solid rgba(38, 52, 77, 0.3)',
                        background: idx % 2 === 0 ? 'rgba(8, 13, 24, 0.3)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        <button
                          onClick={() => onSelectTable(attr.tableName)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-blue)', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: 'inherit' }}
                          title="Click xem toàn bộ bảng"
                        >
                          {attr.tableName}
                        </button>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }} className="mono-font">
                        {attr.name}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                        {attr.description}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }} className="mono-font">
                        {attr.type}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {attr.key?.includes('PK') && <span className="tag tag-amber" style={{ fontSize: '0.65rem' }}>PK</span>}
                        {attr.key?.includes('FK') && <span className="tag tag-blue" style={{ fontSize: '0.65rem', marginLeft: 4 }}>FK</span>}
                        {attr.key?.includes('UQ') && <span className="tag tag-purple" style={{ fontSize: '0.65rem', marginLeft: 4 }}>UQ</span>}
                      </td>
                      <td style={{ padding: '10px 14px', color: attr.nullable ? 'var(--text-dim)' : 'var(--color-amber)', fontSize: '0.78rem' }}>
                        {attr.nullable ? 'NULL' : 'NOT NULL'}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                        {attr.domain}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--color-emerald)', fontSize: '0.8rem' }} className="mono-font">
                        {attr.example || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 12 RÀNG BUỘC TOÀN VẸN CỐT LÕI */}
      {/* ========================================================= */}
      {activeTab === 'constraints' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="alert-box alert-blue" style={{ margin: 0 }}>
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Điểm lưu ý khi thuyết trình với cô:</strong> Website chỉ rõ <em>ràng buộc nào do CSDL biểu diễn trực tiếp bằng khóa và cú pháp CHECK</em>, và <em>ràng buộc nào cần thủ tục nghiệp vụ (Stored Procedure / Trigger / Application Logic)</em> kiểm tra khi đưa vào phần mềm thực tế.
            </div>
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            {INTEGRITY_CONSTRAINTS.map((c) => (
              <div 
                key={c.id} 
                className="card"
                style={{ background: 'rgba(17, 27, 46, 0.85)', display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="tag tag-blue">{c.type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }} className="mono-font">
                    Bảng: {c.target}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>{c.title}</h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {c.description}
                </p>

                <div style={{ background: 'rgba(8, 13, 24, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '8px 12px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 2 }}>Cơ Chế Thực Thi:</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-emerald)' }} className="mono-font">
                    {c.implementation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
