import React, { useEffect, useRef } from 'react';
import { Box, Sparkles } from 'lucide-react';

const NODES = [
  { id: 'sec_entities', title: 'TỔ CHỨC', sub: 'Đơn vị · RBAC · Con người', color: '#38bdf8', x: -210, y: -82, z: 55, count: '08 bảng' },
  { id: 'sec_workflows', title: 'ĐÀO TẠO', sub: 'Lớp · Môn · Phân công', color: '#a78bfa', x: 205, y: -82, z: -20, count: '07 bảng' },
  { id: 'sec_relational', title: 'KẾT QUẢ', sub: 'Kết quả · Điểm · Đợt thi', color: '#34d399', x: 196, y: 105, z: 72, count: '04 bảng' },
  { id: 'sec_scenarios', title: 'QUÂN SỰ', sub: 'Ngành · Cấp bậc · Chức vụ', color: '#fbbf24', x: -198, y: 105, z: -45, count: '04 bảng' }
];

export default function Hero3DCanvas({ onNodeSelect }) {
  const canvasRef = useRef(null);
  const hoverRef = useRef(null);
  const callbackRef = useRef(onNodeSelect);

  useEffect(() => {
    callbackRef.current = onNodeSelect;
  }, [onNodeSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let frame, width = 0, height = 0, dpr = 1, time = 0;
    let targetX = -.12, targetY = .08, rotX = targetX, rotY = targetY;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stars = Array.from({ length: 62 }, (_, i) => ({ x: (Math.random() - .5) * 900, y: (Math.random() - .5) * 560, z: Math.random() * 620 - 180, size: .6 + Math.random() * 1.5, phase: i * .37 }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2); width = rect.width; height = rect.height;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const project = (x, y, z) => {
      const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      const x1 = x * cy - z * sy, z1 = z * cy + x * sy;
      const y1 = y * cx - z1 * sx, z2 = z1 * cx + y * sx;
      const scale = 680 / (820 + z2);
      return { x: width / 2 + x1 * scale, y: height / 2 + y1 * scale, scale, z: z2 };
    };
    const rounded = (x, y, w, h, r = 10) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
    const drawGrid = () => {
      ctx.save(); ctx.translate(width / 2, height * .76); ctx.strokeStyle = 'rgba(56,189,248,.09)';
      for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * 55, 0); ctx.lineTo(i * 105, height * .35); ctx.stroke(); }
      for (let j = 0; j < 8; j++) { const y = j * j * 4.8; ctx.beginPath(); ctx.moveTo(-width, y); ctx.lineTo(width, y); ctx.stroke(); }
      ctx.restore();
    };
    const drawBlock = (node, p, hovered) => {
      const w = 172 * p.scale, h = 74 * p.scale, depth = 18 * p.scale, x = p.x - w / 2, y = p.y - h / 2;
      ctx.save(); ctx.shadowColor = node.color; ctx.shadowBlur = hovered ? 34 : 17; ctx.fillStyle = `${node.color}18`;
      rounded(x - 8, y - 8, w + 16, h + 18, 15); ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(x + w, y + 6); ctx.lineTo(x + w + depth, y - depth + 6); ctx.lineTo(x + w + depth, y + h - depth); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fillStyle = `${node.color}3a`; ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + depth + 8, y - depth); ctx.lineTo(x + w + depth, y - depth); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fillStyle = `${node.color}68`; ctx.fill();
      const grad = ctx.createLinearGradient(x, y, x + w, y + h); grad.addColorStop(0, `${node.color}4c`); grad.addColorStop(.45, 'rgba(13,24,42,.96)'); grad.addColorStop(1, 'rgba(5,11,22,.98)');
      rounded(x, y, w, h); ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = hovered ? '#fff' : `${node.color}c8`; ctx.lineWidth = hovered ? 1.8 : 1.1; ctx.stroke();
      ctx.fillStyle = node.color; ctx.fillRect(x, y, 4, h); ctx.textAlign = 'left'; ctx.fillStyle = '#f7fbff'; ctx.font = `800 ${Math.max(11, 14 * p.scale)}px Outfit`; ctx.fillText(node.title, x + 17 * p.scale, y + 25 * p.scale);
      ctx.fillStyle = 'rgba(196,211,232,.82)'; ctx.font = `500 ${Math.max(8, 10 * p.scale)}px Plus Jakarta Sans`; ctx.fillText(node.sub, x + 17 * p.scale, y + 44 * p.scale);
      ctx.textAlign = 'right'; ctx.fillStyle = node.color; ctx.font = `700 ${Math.max(8, 9 * p.scale)}px JetBrains Mono`; ctx.fillText(node.count, x + w - 13 * p.scale, y + 25 * p.scale); ctx.restore();
    };
    const render = () => {
      if (!reduced) time += .012; rotX += (targetX - rotX) * .045; rotY += (targetY - rotY) * .045;
      ctx.clearRect(0, 0, width, height); drawGrid();
      stars.forEach(star => { const p = project(star.x, star.y, star.z); ctx.beginPath(); ctx.arc(p.x, p.y, star.size * p.scale, 0, Math.PI * 2); ctx.fillStyle = `rgba(125,211,252,${.08 + (Math.sin(time * 2 + star.phase) + 1) * .1})`; ctx.fill(); });
      const center = project(0, 18, 15), items = NODES.map(node => ({ node, point: project(node.x, node.y, node.z) }));
      items.forEach(({ node, point }, index) => { ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(point.x, point.y); ctx.strokeStyle = `${node.color}36`; ctx.stroke(); const t = (time * .7 + index * .23) % 1; ctx.beginPath(); ctx.arc(center.x + (point.x - center.x) * t, center.y + (point.y - center.y) * t, 2.5, 0, Math.PI * 2); ctx.shadowColor = node.color; ctx.shadowBlur = 12; ctx.fillStyle = node.color; ctx.fill(); ctx.shadowBlur = 0; });
      ctx.save(); ctx.translate(center.x, center.y); const pulse = 1 + Math.sin(time * 2) * .04; ctx.scale(pulse, pulse); ctx.beginPath(); ctx.arc(0, 0, 43, 0, Math.PI * 2);
      const core = ctx.createRadialGradient(-12, -14, 2, 0, 0, 44); core.addColorStop(0, '#fff'); core.addColorStop(.16, '#7dd3fc'); core.addColorStop(.5, '#0369a1'); core.addColorStop(1, '#08111f'); ctx.fillStyle = core; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 28; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#bae6fd'; ctx.stroke(); ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = '800 13px Outfit'; ctx.fillText('CADET DB', 0, -2); ctx.fillStyle = '#bae6fd'; ctx.font = '700 9px JetBrains Mono'; ctx.fillText('23 ENTITIES', 0, 14); ctx.restore();
      items.sort((a, b) => a.point.z - b.point.z).forEach(({ node, point }) => drawBlock(node, point, hoverRef.current === node.id)); frame = requestAnimationFrame(render);
    };
    const hit = event => { const rect = canvas.getBoundingClientRect(), mx = event.clientX - rect.left, my = event.clientY - rect.top; return NODES.find(node => { const p = project(node.x, node.y, node.z); return Math.abs(mx - p.x) < 96 * p.scale && Math.abs(my - p.y) < 50 * p.scale; }); };
    const move = event => { const rect = canvas.getBoundingClientRect(); targetX = -((event.clientY - rect.top) / height - .5) * .26; targetY = ((event.clientX - rect.left) / width - .5) * .38; const node = hit(event); hoverRef.current = node?.id || null; canvas.style.cursor = node ? 'pointer' : 'grab'; };
    const leave = () => { targetX = -.12; targetY = .08; hoverRef.current = null; };
    const click = event => { const node = hit(event); if (node) callbackRef.current?.(node.id); };
    resize(); window.addEventListener('resize', resize); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave); canvas.addEventListener('click', click); render();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); canvas.removeEventListener('click', click); };
  }, []);

  return <div className="hero-canvas-container">
    <div className="hero-canvas-heading"><span className="badge-military"><Sparkles size={13}/> KIẾN TRÚC DỮ LIỆU 3D</span><span><Box size={13}/> Rê chuột để đổi góc nhìn · Chọn một khối để khám phá</span></div>
    <div className="hero-canvas-status"><b>23</b> THỰC THỂ <i/> <b>27</b> KHÓA NGOẠI <i/> <b>3NF</b> CHUẨN HÓA</div>
    <canvas ref={canvasRef} aria-label="Mô hình không gian ba chiều của kiến trúc cơ sở dữ liệu" />
  </div>;
}
