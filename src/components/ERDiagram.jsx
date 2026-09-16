import React, { useMemo, useState } from 'react';
import { TABLES } from '../data/dbSchema';

const GROUPS = [
  { id: 'org', label: 'TỔ CHỨC – TÀI KHOẢN – PHÂN QUYỀN', sub: 'Organization & Security', color: '#38bdf8', box: { x: 24, y: 92, w: 716, h: 494 } },
  { id: 'personnel', label: 'QUÂN NHÂN – CHUYÊN NGÀNH', sub: 'Personnel & Specialization', color: '#a78bfa', box: { x: 760, y: 92, w: 696, h: 316 } },
  { id: 'teaching', label: 'ĐÀO TẠO – PHÂN CÔNG', sub: 'Teaching & Assignment', color: '#34d399', box: { x: 24, y: 610, w: 956, h: 426 } },
  { id: 'grading', label: 'KẾT QUẢ – ĐIỂM – KHẢO THÍ', sub: 'Academic Results', color: '#fbbf24', box: { x: 1000, y: 432, w: 456, h: 604 } }
];

const W = 196;
const H = 126;
const CANVAS_W = 1480;
const CANVAS_H = 1062;

// Bố trí thủ công theo luồng nghiệp vụ để hạn chế đường nối giao nhau.
const POSITIONS = {
  DON_VI: { x: 48, y: 148 }, BO_MON: { x: 270, y: 148 }, NGUOI: { x: 492, y: 148 },
  USER: { x: 48, y: 330 }, USER_ROLE: { x: 270, y: 330 }, ROLE: { x: 492, y: 330 },
  ROLE_PERMISSION: { x: 270, y: 466 }, PERMISSION: { x: 492, y: 466 },
  NGANH: { x: 786, y: 148 }, CHUYEN_NGANH: { x: 1008, y: 148 },
  CAP_BAC: { x: 786, y: 272 }, CHUC_VU: { x: 1008, y: 272 },
  KHOA_DAO_TAO: { x: 48, y: 672 }, LOP_HOC: { x: 270, y: 672 }, HOC_VIEN: { x: 492, y: 672 }, GIANG_VIEN: { x: 714, y: 672 },
  MON_HOC: { x: 48, y: 872 }, HOC_KY: { x: 270, y: 872 }, PHAN_CONG: { x: 604, y: 872 },
  KET_QUA_HOC_TAP: { x: 1026, y: 510 }, DIEM: { x: 1248, y: 510 },
  LOAI_DIEM: { x: 1026, y: 720 }, DOT_THI: { x: 1248, y: 720 }
};

function relationPath(from, to, selfRelation) {
  if (selfRelation) {
    return `M ${from.x + W} ${from.y + 35} C ${from.x + W + 54} ${from.y + 12}, ${from.x + W + 54} ${from.y + 112}, ${from.x + W} ${from.y + 91}`;
  }

  const fromCenter = { x: from.x + W / 2, y: from.y + H / 2 };
  const toCenter = { x: to.x + W / 2, y: to.y + H / 2 };
  const horizontal = Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y);

  if (horizontal) {
    const direction = toCenter.x > fromCenter.x ? 1 : -1;
    const sx = fromCenter.x + direction * W / 2;
    const tx = toCenter.x - direction * W / 2;
    const midX = sx + (tx - sx) / 2;
    return `M ${sx} ${fromCenter.y} H ${midX} V ${toCenter.y} H ${tx}`;
  }

  const direction = toCenter.y > fromCenter.y ? 1 : -1;
  const sy = fromCenter.y + direction * H / 2;
  const ty = toCenter.y - direction * H / 2;
  const midY = sy + (ty - sy) / 2;
  return `M ${fromCenter.x} ${sy} V ${midY} H ${toCenter.x} V ${ty}`;
}

export default function ERDiagram({ showAttributes = true, notation = 'crowsfoot', onSelectTable }) {
  const [active, setActive] = useState(null);
  const relations = useMemo(() => TABLES.flatMap(table => table.columns
    .filter(column => column.ref && POSITIONS[column.ref.table])
    .map(column => ({ from: table.name, to: column.ref.table, column: column.name }))), []);

  const related = useMemo(() => new Set(relations
    .filter(relation => relation.from === active || relation.to === active)
    .flatMap(relation => [relation.from, relation.to])), [active, relations]);

  return (
    <div className="er-stage" role="group" aria-label="Mô hình ER gồm 23 thực thể và 27 khóa ngoại" onMouseLeave={() => setActive(null)}>
      <div className="er-stage__legend">
        <span><i className="er-key er-key--pk">PK</i> Khóa chính</span>
        <span><i className="er-key er-key--fk">FK</i> Khóa ngoại</span>
        <span><b>1</b> — <b>N</b> Quan hệ một–nhiều</span>
        <span><b>23</b> thực thể · <b>27</b> khóa ngoại</span>
      </div>
      <div className="er-scroll">
        <svg className="er-svg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
          <defs>
            <linearGradient id="erTitleGradient" x1="0" x2="1"><stop stopColor="#0756d7"/><stop offset=".5" stopColor="#0284c7"/><stop offset="1" stopColor="#0f3fa8"/></linearGradient>
            <filter id="erGlow"><feGaussianBlur stdDeviation="2.8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <marker id="crow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
              <path d="M1 1 L11 6 L1 11 M1 6 L11 6" fill="none" stroke="context-stroke" strokeWidth="1.2"/>
            </marker>
            <marker id="one" viewBox="0 0 8 12" refX="6" refY="6" markerWidth="7" markerHeight="10" orient="auto-start-reverse">
              <path d="M4 1 L4 11" stroke="context-stroke" strokeWidth="1.5"/>
            </marker>
            <pattern id="erGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(125,211,252,.045)" strokeWidth="1"/></pattern>
          </defs>

          <rect width={CANVAS_W} height={CANVAS_H} fill="url(#erGrid)" />
          <g className="er-diagram-title">
            <rect x="560" y="16" width="360" height="58" rx="29" />
            <text x="740" y="54" textAnchor="middle">MÔ HÌNH ER</text>
          </g>

          {GROUPS.map(group => <g key={group.id} className="er-domain" style={{ '--domain-color': group.color }}>
            <rect className="er-domain__box" {...group.box} rx="18" />
            <text className="er-domain__title" x={group.box.x + 18} y={group.box.y + 27}>{group.label}</text>
            <text className="er-domain__sub" x={group.box.x + 18} y={group.box.y + 45}>{group.sub}</text>
          </g>)}

          <g className="er-relations">
            {relations.map((relation, index) => {
              const from = POSITIONS[relation.from];
              const to = POSITIONS[relation.to];
              const highlighted = relation.from === active || relation.to === active;
              const pathId = `relation-${index}`;
              return <g key={`${relation.from}-${relation.column}-${index}`}>
                <path
                  id={pathId}
                  d={relationPath(from, to, relation.from === relation.to)}
                  className={highlighted ? 'er-relation is-active' : 'er-relation'}
                  markerStart={notation === 'crowsfoot' ? 'url(#crow)' : undefined}
                  markerEnd={notation === 'crowsfoot' ? 'url(#one)' : undefined}
                />
                {highlighted && <text className="er-relation__label"><textPath href={`#${pathId}`} startOffset="50%">{relation.column}</textPath></text>}
              </g>;
            })}
          </g>

          {TABLES.map(table => {
            const position = POSITIONS[table.name];
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
    </div>
  );
}
