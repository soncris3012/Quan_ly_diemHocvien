// src/sections/Section6RelationalModel.jsx
// Mục 6: Mô hình quan hệ (19 Bảng), truy vết khóa ngoại và hướng dẫn chuyển đổi từ ER
import React, { useState } from 'react';
import { 
  Table, 
  Database, 
  Link2, 
  BookOpen, 
  ArrowRight, 
  Key, 
  ExternalLink, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { TABLES, SCHEMA_GROUPS } from '../data/dbSchema';

export default function Section6RelationalModel({ onSelectTable, onOpenInspector, highlightedTable }) {
  const [activeTab, setActiveTab] = useState('schema'); // 'schema' | 'er_to_relational'
  const [selectedGroup, setSelectedGroup] = useState('all');

  const groups = Object.values(SCHEMA_GROUPS);

  const filteredTables = TABLES.filter(tbl => {
    return selectedGroup === 'all' || tbl.groupId === selectedGroup;
  });

  const handleFkClick = (sourceTable, col) => {
    if (!col.ref) return;
    onOpenInspector({
      type: 'fk_link',
      sourceTable: sourceTable,
      fkColumn: col.name,
      targetTable: col.ref.table,
      targetColumn: col.ref.column,
      businessRule: `Mỗi bản ghi trong bảng ${sourceTable} có trường ${col.name} bắt buộc phải tham chiếu chính xác đến một bản ghi hợp lệ trong bảng ${col.ref.table}.`
    });

    // Cuộn tới bảng được tham chiếu nếu đang hiển thị
    const elem = document.getElementById(`table-card-${col.ref.table}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elem.classList.add('pulse-highlight');
      setTimeout(() => elem.classList.remove('pulse-highlight'), 1800);
    }
  };

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <Table size={15} />
          MÔ HÌNH DỮ LIỆU QUAN HỆ (RELATIONAL SCHEMA)
        </div>
        <h2 className="section-title">
          Mô Hình Quan Hệ 23 Bảng (R1 – R23) & Ràng Buộc Khóa
        </h2>
        <p className="section-desc">
          Bản đặc tả 23 bảng quan hệ chuẩn hóa (R1 đến R23) tích hợp đầy đủ Giảng viên, Bộ môn, Phân công giảng dạy, Loại điểm và Khảo thí. Nhấn vào bất kỳ <strong>Khóa ngoại [FK]</strong> để truy vết ngay liên kết tham chiếu và mở phân tích toàn vẹn ở bảng bên phải.
        </p>
      </div>

      {/* Chuyển Đổi Tab: Danh Sách Bảng vs Cách Chuyển Từ ER */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('schema')}
          className={`btn ${activeTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Database size={16} />
          23 Bảng Quan Hệ (R1 – R23)
        </button>
        <button
          onClick={() => setActiveTab('er_to_relational')}
          className={`btn ${activeTab === 'er_to_relational' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          Quy Tắc Chuyển Đổi Từ ER Sang Bảng
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DANH SÁCH 23 BẢNG */}
      {/* ========================================================= */}
      {activeTab === 'schema' && (
        <>
          {/* Bộ lọc nhóm bảng */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedGroup('all')}
              className={`btn btn-sm ${selectedGroup === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Tất Cả 23 Bảng (R1 – R23)
            </button>
            {groups.map(grp => (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`btn btn-sm ${selectedGroup === grp.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderColor: selectedGroup === grp.id ? grp.hex : 'var(--border-color)',
                  color: selectedGroup === grp.id ? '#031221' : grp.hex
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: grp.hex, display: 'inline-block' }} />
                {grp.name} ({TABLES.filter(t => t.groupId === grp.id).length})
              </button>
            ))}
          </div>

          {/* Grid các bảng quan hệ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filteredTables.map((tbl) => {
              const groupMeta = SCHEMA_GROUPS[tbl.groupId];
              const isTargeted = highlightedTable === tbl.name;
              return (
                <div
                  key={tbl.id}
                  id={`table-card-${tbl.name}`}
                  className="card"
                  style={{
                    background: 'rgba(17, 27, 46, 0.9)',
                    borderLeft: `4px solid ${groupMeta ? groupMeta.hex : 'var(--color-blue)'}`,
                    borderColor: isTargeted ? 'var(--color-blue)' : 'var(--border-color)',
                    boxShadow: isTargeted ? '0 0 25px rgba(56, 189, 248, 0.35)' : 'none',
                    padding: '18px 22px'
                  }}
                >
                  {/* Header của bảng */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className={`tag ${groupMeta ? groupMeta.colorTag : 'tag-blue'}`}>
                        {tbl.name}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{tbl.title}</h3>
                    </div>

                    <button
                      onClick={() => onSelectTable(tbl.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                    >
                      <HelpCircle size={13} color="var(--color-blue)" />
                      Tại sao cần bảng này?
                    </button>
                  </div>

                  {/* Chuỗi biểu diễn quan hệ chuẩn học thuật */}
                  <div style={{ background: 'rgba(8, 13, 24, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '8px 12px', marginBottom: 14, overflowX: 'auto' }}>
                    <span className="mono-font" style={{ fontSize: '0.82rem', color: 'var(--color-blue)', fontWeight: 700 }}>
                      {tbl.name.toUpperCase()} (
                    </span>
                    {tbl.columns.map((c, idx) => (
                      <span key={idx} className="mono-font" style={{ fontSize: '0.82rem' }}>
                        <span style={{ 
                          color: c.key?.includes('PK') ? 'var(--color-amber)' : c.key?.includes('FK') ? 'var(--color-blue)' : 'var(--text-primary)',
                          fontWeight: c.key ? 700 : 400,
                          textDecoration: c.key?.includes('PK') ? 'underline' : 'none'
                        }}>
                          {c.name}
                        </span>
                        {c.key && (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                            [{c.key}{c.ref ? ` ➔ ${c.ref.table}` : ''}]
                          </span>
                        )}
                        {idx < tbl.columns.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    <span className="mono-font" style={{ fontSize: '0.82rem', color: 'var(--color-blue)', fontWeight: 700 }}> )</span>
                  </div>

                  {/* Bảng các cột chi tiết */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                          <th style={{ padding: '6px 10px' }}>Tên Cột</th>
                          <th style={{ padding: '6px 10px' }}>Loại Khóa</th>
                          <th style={{ padding: '6px 10px' }}>Bắt Buộc?</th>
                          <th style={{ padding: '6px 10px' }}>Diễn Giải Nghiệp Vụ</th>
                          <th style={{ padding: '6px 10px' }}>Ví Dụ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.columns.map((col, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(38, 52, 77, 0.3)' }}>
                            <td style={{ padding: '7px 10px', fontWeight: 600, color: '#fff' }} className="mono-font">
                              {col.name}
                            </td>
                            <td style={{ padding: '7px 10px' }}>
                              {col.key?.includes('PK') && <span className="tag tag-amber" style={{ fontSize: '0.65rem' }}>PK</span>}
                              {col.key?.includes('FK') && (
                                <button
                                  onClick={() => handleFkClick(tbl.name, col)}
                                  className="tag tag-blue"
                                  style={{ fontSize: '0.65rem', border: 'none', cursor: 'pointer', marginLeft: 4 }}
                                  title="Click để kiểm tra ràng buộc khóa ngoại"
                                >
                                  FK ➔ {col.ref?.table}
                                </button>
                              )}
                              {col.key?.includes('UQ') && <span className="tag tag-purple" style={{ fontSize: '0.65rem', marginLeft: 4 }}>UQ</span>}
                            </td>
                            <td style={{ padding: '7px 10px', color: col.nullable ? 'var(--text-dim)' : 'var(--color-amber)', fontSize: '0.75rem' }}>
                              {col.nullable ? 'NULL' : 'NOT NULL'}
                            </td>
                            <td style={{ padding: '7px 10px', color: 'var(--text-muted)' }}>
                              {col.description}
                            </td>
                            <td style={{ padding: '7px 10px', color: 'var(--color-emerald)' }} className="mono-font">
                              {col.example}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* TAB 2: QUY TẮC CHUYỂN TỪ ER SANG BẢNG QUAN HỆ */}
      {/* ========================================================= */}
      {activeTab === 'er_to_relational' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ background: 'rgba(17, 27, 46, 0.85)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="var(--color-blue)" />
              5 Quy Tắc Chuyển Đổi Mô Hình ER Sang Mô Hình Quan Hệ
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Quá trình chuyển đổi từ ER sang mô hình quan hệ tuân thủ chặt chẽ lý thuyết cơ sở dữ liệu để bảo đảm các bảng sau chuyển đổi đạt chuẩn hóa (tối thiểu 3NF/BCNF):
            </p>
          </div>

          <div className="grid-2" style={{ gap: 18 }}>
            {/* Quy tắc 1 */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-blue)', fontWeight: 700, marginBottom: 8 }}>
                <span className="tag tag-blue">QUY TẮC 1</span>
                Thực Thể Mạnh ➔ Bảng Quan Hệ
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                Mỗi thực thể mạnh trong ER được ánh xạ thành một bảng quan hệ riêng. Thuộc tính định danh của thực thể trở thành Khóa chính (Primary Key - PK) của bảng.
              </p>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', color: 'var(--color-emerald)' }}>
                Ví dụ: Thực thể <code>MON_HOC</code> ➔ Bảng <code>MON_HOC(MaMonHoc [PK], TenMonHoc, SoTinChi, SoTiet...)</code>
              </div>
            </div>

            {/* Quy tắc 2 */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-purple)', fontWeight: 700, marginBottom: 8 }}>
                <span className="tag tag-purple">QUY TẮC 2</span>
                Quan Hệ 1 - N ➔ Khóa Ngoại Phía "Nhiều" (N)
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                Trong mối quan hệ 1 - N, Khóa chính của bảng phía "1" được đưa vào bảng phía "N" làm Khóa ngoại (Foreign Key - FK).
              </p>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', color: 'var(--color-emerald)' }}>
                Ví dụ: 1 Bộ môn có nhiều Giảng viên ➔ Đưa <code>MaBoMon [FK]</code> vào bảng <code>GIANG_VIEN</code>. 1 Lớp có nhiều Học viên ➔ Đưa <code>MaLop [FK]</code> vào <code>HOC_VIEN</code>.
              </div>
            </div>

            {/* Quy tắc 3 */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-emerald)', fontWeight: 700, marginBottom: 8 }}>
                <span className="tag tag-emerald">QUY TẮC 3</span>
                Quan Hệ N - N ➔ Bảng Liên Kết Mắt Xích
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                Mối quan hệ N - N được tách thành bảng liên kết trung gian chứa khóa chính của các thực thể tham gia.
              </p>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', color: 'var(--color-emerald)' }}>
                Ví dụ: Giảng viên, Môn học, Lớp học và Học kỳ ➔ Bảng <code>PHAN_CONG(MaPhanCong [PK], MaGV [FK], MaMonHoc [FK], MaLop [FK], MaHocKy [FK]...)</code>. Người dùng & Vai trò ➔ <code>USER_ROLE(MaUser, MaRole)</code>.
              </div>
            </div>

            {/* Quy tắc 4 */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-amber)', fontWeight: 700, marginBottom: 8 }}>
                <span className="tag tag-amber">QUY TẮC 4</span>
                Quan Hệ Đệ Quy (Recursive) ➔ Tự Tham Chiếu
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                Khi một thực thể có liên kết với chính nó (phân cấp cây đơn vị), tạo cột Khóa ngoại trỏ ngược lại Khóa chính của chính bảng đó.
              </p>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', color: 'var(--color-emerald)' }}>
                Ví dụ: <code>DON_VI(MaDonVi [PK], TenDonVi, LoaiDonVi, MaDonViCha [FK trỏ về DON_VI])</code>.
              </div>
            </div>

            {/* Quy tắc 5 */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-rose)', fontWeight: 700, marginBottom: 8 }}>
                <span className="tag tag-rose">QUY TẮC 5 (CHUYÊN BIỆT HÓA / KẾ THỪA IS-A)</span>
                Thực Thể Cha ➔ Thực Thể Con Kế Thừa (Học Viên & Giảng Viên)
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                Áp dụng kỹ thuật Generalization / Specialization: Thông tin dùng chung (Họ tên, Ngày sinh, Giới tính, Quê quán, SĐT, Email) được gom vào thực thể cha <code>NGUOI (R4)</code>. Các thực thể con chỉ lưu thuộc tính đặc thù riêng và sử dụng <code>MaNguoi [FK, UQ]</code> để liên kết 1 - 1.
              </p>
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', color: 'var(--color-emerald)' }}>
                Ví dụ: <code>HOC_VIEN(MaHV [PK], MaNguoi [FK, UQ], MaLop, MaCapBac...)</code> và <code>GIANG_VIEN(MaGV [PK], MaNguoi [FK, UQ], MaBoMon, HocVi, ChuyenMon...)</code>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
