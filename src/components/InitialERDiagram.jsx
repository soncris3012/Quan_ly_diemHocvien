import React from 'react';

const W = 172;
const H = 102;

const NODES = [
  { id: 'DON_VI', x: 34, y: 104, color: '#38bdf8', fields: ['MaDonVi (PK)', 'TenDonVi', 'LoaiDonVi'] },
  { id: 'KHOA_DAO_TAO', x: 252, y: 104, color: '#38bdf8', fields: ['MaKhoaDT (PK)', 'TenKhoaDT', 'NamBatDau'] },
  { id: 'LOP_HOC', x: 470, y: 104, color: '#38bdf8', fields: ['MaLop (PK)', 'TenLop', 'MaDonVi (FK)'] },
  { id: 'NGANH', x: 688, y: 104, color: '#a78bfa', fields: ['MaNganh (PK)', 'TenNganh'] },
  { id: 'CHUYEN_NGANH', x: 906, y: 104, color: '#a78bfa', fields: ['MaChuyenNganh (PK)', 'TenChuyenNganh'] },
  { id: 'NGUOI', x: 34, y: 292, color: '#38bdf8', fields: ['MaNguoi (PK)', 'HoTen', 'NgaySinh'] },
  { id: 'USER', x: 252, y: 292, color: '#fbbf24', fields: ['MaUser (PK)', 'TenDangNhap', 'VaiTro (text)'], warning: true },
  { id: 'HOC_VIEN', x: 470, y: 292, color: '#38bdf8', fields: ['MaHV (PK)', 'MaNguoi (FK)', 'MaLop (FK)'] },
  { id: 'GIANG_VIEN', x: 688, y: 292, color: '#a78bfa', fields: ['MaGV (PK)', 'MaNguoi (FK)', 'MaBoMon (FK)'] },
  { id: 'BO_MON', x: 906, y: 292, color: '#38bdf8', fields: ['MaBoMon (PK)', 'TenBoMon', 'MaDonVi (FK)'] },
  { id: 'MON_HOC', x: 34, y: 504, color: '#34d399', fields: ['MaMonHoc (PK)', 'TenMonHoc', 'SoTinChi'] },
  { id: 'HOC_KY', x: 252, y: 504, color: '#34d399', fields: ['MaHocKy (PK)', 'TenHocKy', 'NamHoc'] },
  { id: 'PHAN_CONG', x: 470, y: 504, color: '#34d399', fields: ['MaPhanCong (PK)', 'MaGV, MaMonHoc', 'MaLop, MaHocKy'] },
  { id: 'BANG_DIEM', x: 746, y: 492, color: '#fb7185', fields: ['MaBangDiem (PK)', 'MaHV, MaPhanCong', 'DiemCC, DiemTX', 'DiemThi1, DiemThi2'], warning: true }
];

const EDGES = [
  ['DON_VI', 'LOP_HOC', 'quản lý'], ['DON_VI', 'BO_MON', 'quản lý'],
  ['KHOA_DAO_TAO', 'LOP_HOC', 'đào tạo'], ['NGANH', 'CHUYEN_NGANH', 'có'],
  ['CHUYEN_NGANH', 'HOC_VIEN', 'thuộc'], ['NGUOI', 'USER', 'có tài khoản'],
  ['NGUOI', 'HOC_VIEN', 'hồ sơ'], ['NGUOI', 'GIANG_VIEN', 'hồ sơ'],
  ['LOP_HOC', 'HOC_VIEN', 'biên chế'], ['BO_MON', 'GIANG_VIEN', 'quản lý'],
  ['GIANG_VIEN', 'PHAN_CONG', 'giảng dạy'], ['MON_HOC', 'PHAN_CONG', 'môn học'],
  ['HOC_KY', 'PHAN_CONG', 'học kỳ'], ['LOP_HOC', 'PHAN_CONG', 'lớp học'],
  ['HOC_VIEN', 'BANG_DIEM', 'có kết quả'], ['PHAN_CONG', 'BANG_DIEM', 'ghi nhận']
];

const nodeMap = Object.fromEntries(NODES.map(node => [node.id, node]));

function edgePath(fromId, toId) {
  const from = nodeMap[fromId];
  const to = nodeMap[toId];
  const a = { x: from.x + W / 2, y: from.y + H / 2 };
  const b = { x: to.x + W / 2, y: to.y + H / 2 };
  if (Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)) {
    const direction = b.x > a.x ? 1 : -1;
    const sx = a.x + direction * W / 2;
    const tx = b.x - direction * W / 2;
    const mid = (sx + tx) / 2;
    return `M ${sx} ${a.y} H ${mid} V ${b.y} H ${tx}`;
  }
  const direction = b.y > a.y ? 1 : -1;
  const sy = a.y + direction * H / 2;
  const ty = b.y - direction * H / 2;
  const mid = (sy + ty) / 2;
  return `M ${a.x} ${sy} V ${mid} H ${b.x} V ${ty}`;
}

export default function InitialERDiagram({ showAttributes = true }) {
  return (
    <div className="initial-er">
      <svg viewBox="0 0 1120 650" width="1120" height="650" aria-label="Mô hình ER hoàn chỉnh ban đầu của nhóm 519">
        <defs>
          <pattern id="initialGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="rgba(125,211,252,.05)"/></pattern>
          <marker id="initialCrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M1 1L11 6 1 11M1 6H11" fill="none" stroke="context-stroke"/></marker>
          <marker id="initialOne" viewBox="0 0 8 12" refX="6" refY="6" markerWidth="7" markerHeight="9" orient="auto-start-reverse"><path d="M4 1V11" stroke="context-stroke" strokeWidth="1.4"/></marker>
        </defs>
        <rect width="1120" height="650" fill="url(#initialGrid)" />
        <g className="initial-er__title"><rect x="410" y="18" width="300" height="52" rx="26"/><text x="560" y="52" textAnchor="middle">ER BAN ĐẦU — NHÓM 519</text></g>
        <g className="initial-er__groups">
          <rect x="18" y="82" width="1068" height="146" rx="14"/><text x="32" y="98">TỔ CHỨC – ĐÀO TẠO – CHUYÊN NGÀNH</text>
          <rect x="18" y="270" width="1068" height="146" rx="14"/><text x="32" y="286">CON NGƯỜI – TÀI KHOẢN – QUÂN NHÂN</text>
          <rect x="18" y="468" width="1068" height="164" rx="14"/><text x="32" y="484">GIẢNG DẠY – KẾT QUẢ HỌC TẬP</text>
        </g>
        <g className="initial-er__edges">
          {EDGES.map(([from, to, label], index) => <g key={`${from}-${to}`}>
            <path id={`initial-edge-${index}`} d={edgePath(from, to)} markerStart="url(#initialCrow)" markerEnd="url(#initialOne)" />
            <text><textPath href={`#initial-edge-${index}`} startOffset="50%">{label}</textPath></text>
          </g>)}
        </g>
        {NODES.map(node => <foreignObject key={node.id} x={node.x} y={node.y} width={W} height={H}>
          <div className={`initial-er__node ${node.warning ? 'is-warning' : ''}`} style={{ '--initial-color': node.color }}>
            <strong>{node.id}</strong>
            {showAttributes && <div>{node.fields.map(field => <span key={field}>{field}</span>)}</div>}
          </div>
        </foreignObject>)}
      </svg>
    </div>
  );
}
