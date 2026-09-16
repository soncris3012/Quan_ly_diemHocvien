// src/sections/Section2Actors.jsx
// Mục 2: Nghiệp vụ và tác nhân, ma trận phân quyền và mô phỏng cây đơn vị quân sự
import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  GraduationCap, 
  Award, 
  Eye, 
  Edit3, 
  Database, 
  GitFork, 
  Check, 
  X, 
  Info,
  ChevronRight,
  FolderTree
} from 'lucide-react';
import { ACTORS, UNIT_TREE_DATA } from '../data/actorsData';

export default function Section2Actors({ onSelectTable, onOpenInspector }) {
  const [selectedActor, setSelectedActor] = useState(ACTORS[1]); // Mặc định chọn Chỉ huy
  const [activeCommanderUnit, setActiveCommanderUnit] = useState('d1_c1'); // Đại đội 1

  const handleSelectActor = (actor) => {
    setSelectedActor(actor);
  };

  const handleSelectUnitCommander = (unitId) => {
    setActiveCommanderUnit(unitId);
    onOpenInspector({
      type: 'entity',
      data: {
        name: 'Phạm Vi Quản Lý Theo Đơn Vị',
        groupId: 'org',
        meaning: 'Phạm vi xem được suy ra từ vai trò của tài khoản và chuỗi biên chế HOC_VIEN → LOP_HOC → DON_VI.',
        identifier: 'MaUser + MaRole',
        relationships: 'USER (N) — USER_ROLE — (N) ROLE; HOC_VIEN (N) — LOP_HOC (N) — DON_VI',
        example: `Chỉ huy đơn vị ${unitId === 'd1_c1' ? 'Đại đội 1' : 'Đại đội 2'} có phạm vi xem học viên thuộc các lớp biên chế tại đơn vị này.`,
        justification: 'Trong phạm vi mô hình 23 bảng hiện tại, RBAC xác định quyền thao tác; phạm vi dữ liệu được lọc theo cây DON_VI. Nếu cần lưu lịch sử cán bộ phụ trách từng đơn vị, đây là một bảng mở rộng ở giai đoạn triển khai.',
        tableRef: 'USER_ROLE'
      }
    });
  };

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <Users size={15} />
          PHÂN QUYỀN TRUY CẬP DỮ LIỆU
        </div>
        <h2 className="section-title">
          Tác Nhân & Ma Trận Phân Quyền Nghiệp Vụ
        </h2>
        <p className="section-desc">
          Mô hình hóa 5 nhóm đối tượng tương tác trong nhà trường quân sự (đặc biệt có sự tham gia của <strong>Giảng viên giảng dạy</strong>). Nhấn vào từng tác nhân hoặc đơn vị chỉ huy để kiểm chứng phạm vi dữ liệu và các bảng bị tác động.
        </p>
      </div>

      {/* 5 Thẻ Đối Tượng Tác Nhân */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 26 }}>
        {ACTORS.map((actor) => {
          const isSelected = selectedActor.id === actor.id;
          return (
            <div
              key={actor.id}
              onClick={() => handleSelectActor(actor)}
              className={`card card-clickable ${isSelected ? 'selected-card' : ''}`}
              style={{
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? actor.badgeColor : 'var(--border-color)',
                boxShadow: isSelected ? `0 0 20px ${actor.badgeColor}33` : 'none',
                background: isSelected ? 'rgba(17, 27, 46, 0.95)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className={`tag ${actor.tagClass}`}>{actor.roleCode}</span>
                {isSelected && <span style={{ fontSize: '0.72rem', color: actor.badgeColor, fontWeight: 700 }}>ĐANG CHỌN</span>}
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: 6 }}>{actor.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {actor.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chi Tiết Tác Nhân Đang Chọn */}
      <div className="card" style={{ marginBottom: 30, background: 'rgba(13, 21, 37, 0.9)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
          <span className={`tag ${selectedActor.tagClass}`} style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
            {selectedActor.roleCode}
          </span>
          <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
            Chi Tiết Nghiệp Vụ: {selectedActor.name}
          </h3>
        </div>

        <div className="grid-2" style={{ gap: 24, marginBottom: 20 }}>
          {/* Cột 1: Làm gì & Được xem gì */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--color-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                <Edit3 size={15} />
                Người này làm gì trong hệ thống?
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, background: 'rgba(8, 13, 24, 0.5)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                {selectedActor.whatTheyDo}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--color-emerald)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                <Eye size={15} />
                Phạm vi dữ liệu được xem (Read Scope)
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'rgba(8, 13, 24, 0.5)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                {selectedActor.dataScopeView}
              </p>
            </div>
          </div>

          {/* Cột 2: Được sửa gì & Bảng tác động */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--color-amber)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                <Shield size={15} />
                Phạm vi dữ liệu được thay đổi (Write Scope)
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'rgba(8, 13, 24, 0.5)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                {selectedActor.dataScopeModify}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--color-purple)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                <Database size={15} />
                Các bảng dữ liệu bị tác động trực tiếp ({selectedActor.impactedTables.length} Bảng)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedActor.impactedTables.map((tblName, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectTable(tblName)}
                    className="btn btn-secondary btn-sm"
                    style={{ background: 'rgba(8, 13, 24, 0.8)', borderColor: 'var(--border-color)', color: 'var(--color-blue)' }}
                  >
                    <Database size={13} />
                    {tblName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="alert-box alert-amber" style={{ margin: 0 }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.88rem' }}>
            <strong>Ý nghĩa thiết kế CSDL:</strong> {selectedActor.note}
          </div>
        </div>
      </div>

      {/* Tương Tác Đặc Biệt: Mô Phỏng Cây Phân Cấp Đơn Vị & Phạm Vi Chỉ Huy */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderTree size={18} color="var(--color-blue)" />
            Tương Tác Thực Nghiệm: Cây Đơn Vị & Ranh Giới Quản Lý Của Chỉ Huy
          </h3>
          <span className="badge-military">Bấm để kiểm chứng</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 18 }}>
          Hãy chọn một cán bộ chỉ huy đại đội bên dưới để quan sát hệ thống tự động <strong>tô sáng đại đội được giao</strong>, <strong>sáng các lớp trực thuộc</strong> và <strong>làm mờ học viên ngoài phạm vi</strong>:
        </p>

        {/* Nút chọn chỉ huy */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => handleSelectUnitCommander('d1_c1')}
            className={`btn ${activeCommanderUnit === 'd1_c1' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Chỉ huy Đại đội 1 (Đại úy Trần Văn Bình)
          </button>
          <button
            onClick={() => handleSelectUnitCommander('d1_c2')}
            className={`btn ${activeCommanderUnit === 'd1_c2' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Chỉ huy Đại đội 2 (Đại úy Nguyễn Hữu Hùng)
          </button>
        </div>

        {/* Cây đơn vị trực quan */}
        <div style={{ background: 'rgba(8, 13, 24, 0.7)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#fff', marginBottom: 14 }}>
            <span className="tag tag-blue">TIỂU ĐOÀN</span>
            {UNIT_TREE_DATA.name} — {UNIT_TREE_DATA.commander}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginLeft: 20, borderLeft: '2px dashed var(--border-color)', paddingLeft: 18 }}>
            {UNIT_TREE_DATA.children.map((cUnit) => {
              const isManaged = activeCommanderUnit === cUnit.id;
              return (
                <div
                  key={cUnit.id}
                  style={{
                    background: isManaged ? 'rgba(56, 189, 248, 0.08)' : 'rgba(17, 27, 46, 0.4)',
                    border: '1px solid',
                    borderColor: isManaged ? 'var(--color-blue)' : 'var(--border-subtle)',
                    borderRadius: 10,
                    padding: 16,
                    opacity: isManaged ? 1 : 0.45,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className={`tag ${isManaged ? 'tag-blue' : 'tag-dim'}`}>
                      {cUnit.name}
                    </span>
                    {isManaged && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-blue)', fontWeight: 700 }}>
                        ● TRONG PHẠM VI QUẢN LÝ
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginBottom: 12 }}>
                    Chỉ huy: {cUnit.commander}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cUnit.classes.map((cls) => (
                      <div
                        key={cls.id}
                        style={{
                          background: isManaged ? 'rgba(8, 13, 24, 0.8)' : 'rgba(8, 13, 24, 0.3)',
                          border: '1px solid',
                          borderColor: isManaged ? 'rgba(56, 189, 248, 0.3)' : 'var(--border-subtle)',
                          borderRadius: 8,
                          padding: 10
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: isManaged ? '#fff' : 'var(--text-dim)', marginBottom: 6 }}>
                          <span>{cls.name}</span>
                          <span>{cls.studentsCount} Quân nhân</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {cls.students.map((st) => (
                            <span
                              key={st.id}
                              style={{
                                fontSize: '0.74rem',
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: isManaged ? 'rgba(52, 211, 153, 0.15)' : 'rgba(38, 52, 77, 0.3)',
                                color: isManaged ? 'var(--color-emerald)' : 'var(--text-dim)',
                                border: '1px solid',
                                borderColor: isManaged ? 'rgba(52, 211, 153, 0.3)' : 'transparent'
                              }}
                            >
                              {st.id} - {st.name} ({st.gpa})
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          * Nhận xét: Đây là mô phỏng phạm vi truy cập theo <code style={{ color: 'var(--color-blue)' }}>USER_ROLE</code> và cây <code style={{ color: 'var(--color-blue)' }}>DON_VI</code>. Lịch sử cán bộ phụ trách đơn vị là phần mở rộng đề xuất, chưa thuộc 23 bảng cốt lõi.
        </div>
      </div>

      {/* Ma Trận CRUD Tổng Hợp */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: 14 }}>
          Ma Trận Phân Quyền Thao Tác (CRUD Matrix)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Nhóm Nghiệp Vụ / Dữ Liệu</th>
                <th style={{ padding: '10px 14px' }}>Học Viên</th>
                <th style={{ padding: '10px 14px' }}>Chỉ Huy Đại Đội</th>
                <th style={{ padding: '10px 14px' }}>Phòng Đào Tạo</th>
                <th style={{ padding: '10px 14px' }}>Ban Giám Đốc</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>Xem điểm của mình</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Đọc (R)</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>Xem điểm theo Đơn vị phụ trách</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Chặn</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Đọc đơn vị (R)</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Đọc toàn trường (R)</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Đọc toàn trường (R)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>Lập Kế hoạch & Mở Lớp học phần</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Tạo/Sửa (C/U)</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-blue)' }}><Check size={16} /> Giám sát</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>Nhập điểm & Chốt sổ điểm</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Ghi/Khóa (C/U)</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>Phê duyệt mở khóa điểm đã chốt</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-amber)' }}>Gửi Yêu Cầu (C)</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> DUYỆT (U)</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>Sửa điểm đã khóa (khi có duyệt)</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-emerald)' }}><Check size={16} /> Sửa trong hạn (U)</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}><X size={16} /> Không</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
