import React, { useMemo, useState } from 'react';
import { TABLES } from '../data/dbSchema';

const GROUPS = [
  { id: 'org', label: 'TỔ CHỨC & PHÂN QUYỀN', color: '#38bdf8' },
  { id: 'personnel', label: 'QUÂN NHÂN & CHUYÊN NGÀNH', color: '#a78bfa' },
  { id: 'teaching', label: 'ĐÀO TẠO & KẾT QUẢ', color: '#34d399' },
  { id: 'grading', label: 'ĐIỂM SỐ & KHẢO THÍ', color: '#fbbf24' }
];

const W = 214;
const H = 126;

function layoutTables() {
  const positions = {};
  const columns = {
    org: { x: 48, y: 96 },
    personnel: { x: 310, y: 96 },
    teaching: { x: 572, y: 96 },
    grading: { x: 834, y: 96 }
  };
  GROUPS.forEach(group => {
    const list = TABLES.filter(table => table.groupId === group.id);
    list.forEach((table, index) => {
      positions[table.name] = { x: columns[group.id].x, y: columns[group.id].y + index * 158 };
    });
  });
  return positions;
}

export default function ERDiagram({ showAttributes = true, notation = 'crowsfoot', onSelectTable }) {
  const positions = useMemo(() => layoutTables(), []);
  const [active, setActive] = useState('KET_QUA_HOC_TAP');
  const relations = useMemo(() => TABLES.flatMap(table => table.columns
    .filter(column => column.ref && positions[column.ref.table])
    .map(column => ({ from: table.name, to: column.ref.table, column: column.name }))), [positions]);

  const related = useMemo(() => new Set(relations
    .filter(relation => relation.from === active || relation.to === active)
    .flatMap(relation => [relation.from, relation.to])), [active, relations]);

  const height = Math.max(...Object.values(positions).map(item => item.y)) + H + 54;

  return (
    <div className="er-stage" role="group" aria-label="Mô hình ER gồm 23 thực thể và 27 khóa ngoại">
      <div className="er-stage__legend">
        <span><i className="er-key er-key--pk">PK</i> Khóa chính</span>
        <span><i className="er-key er-key--fk">FK</i> Khóa ngoại</span>
        <span><b>23</b> thực thể</span>
        <span><b>27</b> quan hệ</span>
      </div>
      <div className="er-scroll">
        <svg className="er-svg" viewBox={`0 0 1100 ${height}`} style={{ minHeight: height }}>
          <defs>
            <filter id="erGlow"><feGaussianBlur stdDeviation="2.8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <marker id="crow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
              <path d="M1 1 L11 6 L1 11 M1 6 L11 6" fill="none" stroke="#91a4c4" strokeWidth="1.2"/>
            </marker>
            <marker id="one" viewBox="0 0 8 12" refX="6" refY="6" markerWidth="7" markerHeight="10" orient="auto-start-reverse">
              <path d="M4 1 L4 11" stroke="#91a4c4" strokeWidth="1.5"/>
            </marker>
          </defs>

          {GROUPS.map(group => {
            const list = TABLES.filter(table => table.groupId === group.id);
            const first = positions[list[0]?.name];
            const last = positions[list[list.length - 1]?.name];
            if (!first || !last) return null;
            return <g key={group.id}>
              <rect x={first.x - 18} y="45" width={W + 36} height={last.y + H - 27} rx="18" fill={`${group.color}08`} stroke={`${group.color}28`} strokeDasharray="6 8"/>
              <text x={first.x} y="72" fill={group.color} fontSize="11" fontWeight="800" letterSpacing="1.2">{group.label}</text>
            </g>;
          })}

          <g className="er-relations">
            {relations.map((relation, index) => {
              const from = positions[relation.from];
              const to = positions[relation.to];
              const selfRelation = relation.from === relation.to;
              const sx = from.x + (from.x < to.x ? W : 0);
              const sy = from.y + H / 2;
              const tx = to.x + (from.x < to.x ? 0 : W);
              const ty = to.y + H / 2;
              const dx = Math.max(34, Math.abs(tx - sx) * .42);
              const highlighted = relation.from === active || relation.to === active;
              return <path
                key={`${relation.from}-${relation.column}-${index}`}
                d={selfRelation
                  ? `M ${from.x + W} ${from.y + 42} C ${from.x + W + 58} ${from.y + 22}, ${from.x + W + 58} ${from.y + 104}, ${from.x + W} ${from.y + 84}`
                  : `M ${sx} ${sy} C ${sx + (tx > sx ? dx : -dx)} ${sy}, ${tx - (tx > sx ? dx : -dx)} ${ty}, ${tx} ${ty}`}
                className={highlighted ? 'er-relation is-active' : 'er-relation'}
                markerStart={notation === 'crowsfoot' ? 'url(#crow)' : undefined}
                markerEnd={notation === 'crowsfoot' ? 'url(#one)' : undefined}
              />;
            })}
          </g>

          {TABLES.map(table => {
            const position = positions[table.name];
            const group = GROUPS.find(item => item.id === table.groupId) || GROUPS[0];
            const isActive = active === table.name;
            const isDimmed = active && !related.has(table.name);
            const primary = table.columns.find(column => column.key?.includes('PK'));
            const foreign = table.columns.filter(column => column.ref).slice(0, 3);
            return <foreignObject key={table.name} x={position.x} y={position.y} width={W} height={H}>
              <button
                className={`er-entity ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                style={{ '--entity-color': group.color }}
                onMouseEnter={() => setActive(table.name)}
                onFocus={() => setActive(table.name)}
                onClick={() => onSelectTable?.(table.name)}
              >
                <span className="er-entity__code">{table.code}</span>
                <strong>{table.name}</strong>
                <small>{table.title}</small>
                {showAttributes && <div className="er-entity__fields">
                  {primary && <span><i className="er-key er-key--pk">PK</i>{primary.name}</span>}
                  {foreign.map(column => <span key={column.name}><i className="er-key er-key--fk">FK</i>{column.name}</span>)}
                  {table.columns.length > foreign.length + (primary ? 1 : 0) && <em>+{table.columns.length - foreign.length - (primary ? 1 : 0)} thuộc tính</em>}
                </div>}
              </button>
            </foreignObject>;
          })}
        </svg>
      </div>
      <div className="er-stage__hint">Di chuột để truy vết quan hệ · Bấm vào thực thể để xem đầy đủ thuộc tính và ràng buộc</div>
    </div>
  );
}
