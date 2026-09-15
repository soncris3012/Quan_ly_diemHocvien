// src/components/SearchModal.jsx
// Hộp tìm kiếm nhanh hỗ trợ phím tắt Cmd+K / Ctrl+K
import React, { useState, useEffect } from 'react';
import { Search, X, Database, Layers, CheckCircle2, ShieldCheck, GitBranch, ArrowRight } from 'lucide-react';
import { TABLES } from '../data/dbSchema';
import { ENTITIES } from '../data/entityCatalog';
import { SCENARIOS } from '../data/scenarioData';
import { INTEGRITY_CONSTRAINTS } from '../data/dbSchema';

export default function SearchModal({ isOpen, onClose, onSelectTable, onSelectSection }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle search handled by parent or opened
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Tìm kiếm trong bảng, thực thể, tình huống, ràng buộc
  const matchedTables = TABLES.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) || 
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const matchedEntities = ENTITIES.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.meaning.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const matchedScenarios = SCENARIOS.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedConstraints = INTEGRITY_CONSTRAINTS.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(8, 13, 24, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 100
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '90%',
          maxWidth: 620,
          background: '#0D1525',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Search size={18} color="var(--color-blue)" />
          <input
            autoFocus
            type="text"
            placeholder="Tìm kiếm bảng, thực thể, tình huống, ràng buộc (hoặc bấm ESC)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: 420, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Bảng dữ liệu */}
          {matchedTables.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Database size={13} color="var(--color-blue)" />
                Bảng Cơ Sở Dữ Liệu ({matchedTables.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {matchedTables.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectSection('sec_relational');
                      onSelectTable(t.name);
                      onClose();
                    }}
                    className="card card-clickable"
                    style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div>
                      <span className="mono-font" style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.88rem' }}>{t.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>{t.title}</span>
                    </div>
                    <ArrowRight size={14} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thực thể */}
          {matchedEntities.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={13} color="var(--color-purple)" />
                Thực Thể Khái Niệm ({matchedEntities.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {matchedEntities.map(e => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onSelectSection('sec_entities');
                      onClose();
                    }}
                    className="card card-clickable"
                    style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{e.name}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8 }}>{e.meaning}</span>
                    </div>
                    <ArrowRight size={14} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tình huống kiểm chứng */}
          {matchedScenarios.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} color="var(--color-emerald)" />
                Tình Huống Kiểm Chứng ({matchedScenarios.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {matchedScenarios.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSection('sec_scenarios');
                      onClose();
                    }}
                    className="card card-clickable"
                    style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{s.title}</span>
                    </div>
                    <ArrowRight size={14} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
