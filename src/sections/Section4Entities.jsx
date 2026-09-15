// src/sections/Section4Entities.jsx
// Mục 4: Danh mục thực thể phân loại theo 4 nhóm màu sắc trực quan
import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Tag, 
  Key, 
  GitCommit, 
  HelpCircle, 
  Database,
  ArrowRight,
  Filter
} from 'lucide-react';
import { ENTITIES, ENTITY_GROUPS } from '../data/entityCatalog';

export default function Section4Entities({ onSelectTable, onOpenInspector }) {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = ENTITIES.filter((ent) => {
    const matchGroup = selectedGroup === 'all' || ent.groupId === selectedGroup;
    const matchSearch = ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ent.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ent.identifier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <Layers size={15} />
          MÔ HÌNH THỰC THỂ KHÁI NIỆM (CONCEPTUAL ER)
        </div>
        <h2 className="section-title">
          Danh Mục Thực Thể & Lý Do Tồn Tại
        </h2>
        <p className="section-desc">
          13 thực thể cốt lõi được mã hóa theo 4 nhóm màu sắc tiêu chuẩn. Mỗi thực thể đều gắn liền với một ý nghĩa nghiệp vụ cụ thể và có lý do xác đáng để tồn tại trong CSDL.
        </p>
      </div>

      {/* Bộ Lọc Nhóm & Tìm Kiếm */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Nhóm Filter Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedGroup('all')}
            className={`btn btn-sm ${selectedGroup === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Tất Cả ({ENTITIES.length})
          </button>
          {ENTITY_GROUPS.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSelectedGroup(grp.id)}
              className={`btn btn-sm ${selectedGroup === grp.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderColor: selectedGroup === grp.id ? grp.color : 'var(--border-color)',
                color: selectedGroup === grp.id ? '#031221' : grp.color
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: grp.color, display: 'inline-block' }} />
              {grp.name}
            </button>
          ))}
        </div>

        {/* Ô Tìm Kiếm */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Tìm thực thể, mã khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 36px',
              background: 'rgba(17, 27, 46, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Danh Sách Thẻ Thực Thể */}
      <div className="grid-2" style={{ gap: 20 }}>
        {filteredEntities.map((ent) => {
          const groupMeta = ENTITY_GROUPS.find(g => g.id === ent.groupId);
          return (
            <div
              key={ent.id}
              className="card"
              style={{
                background: 'rgba(17, 27, 46, 0.85)',
                borderTop: `3px solid ${groupMeta ? groupMeta.color : 'var(--color-blue)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              {/* Header của thẻ */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span className={`tag ${groupMeta ? groupMeta.tagClass : 'tag-blue'}`} style={{ marginBottom: 4 }}>
                    {groupMeta ? groupMeta.name : ''}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginTop: 4 }}>
                    {ent.name}
                  </h3>
                </div>
                {ent.tableRef && (
                  <button
                    onClick={() => onSelectTable(ent.tableRef)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    title={`Chuyển tới bảng ${ent.tableRef}`}
                  >
                    <Database size={12} color="var(--color-blue)" />
                    Bảng: {ent.tableRef}
                  </button>
                )}
              </div>

              {/* Ý nghĩa nghiệp vụ */}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {ent.meaning}
              </p>

              {/* Lý do cần tồn tại (Điểm nhấn học thuật) */}
              <div style={{ background: 'rgba(8, 13, 24, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-amber)', fontWeight: 700, marginBottom: 4 }}>
                  <HelpCircle size={14} />
                  VÌ SAO BẮT BUỘC PHẢI CÓ THỰC THỂ NÀY?
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {ent.justification}
                </div>
              </div>

              {/* Thuộc tính khóa & Quan hệ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Key size={14} color="var(--color-amber)" />
                  <span style={{ color: 'var(--text-dim)' }}>Định danh (PK):</span>
                  <code style={{ color: 'var(--color-amber)', background: 'rgba(8, 13, 24, 0.8)', padding: '2px 6px', borderRadius: 4 }}>
                    {ent.identifier}
                  </code>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <GitCommit size={14} color="var(--color-purple)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Mối quan hệ: </span>
                    <span style={{ color: 'var(--text-muted)' }}>{ent.relationships}</span>
                  </div>
                </div>
              </div>

              {/* Ví dụ minh họa thực tế */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', borderTop: '1px dashed var(--border-subtle)', paddingTop: 8, marginTop: 'auto' }}>
                Ví dụ: <span style={{ color: 'var(--color-emerald)' }}>{ent.example}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
