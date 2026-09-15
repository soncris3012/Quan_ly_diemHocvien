// src/components/Hero3DCanvas.jsx
// Mô hình 3D tương tác 4 cụm dữ liệu với đường truyền sáng và hiệu ứng nghiêng theo chuột
import React, { useRef, useEffect, useState } from 'react';
import { Shield, Sparkles, Navigation } from 'lucide-react';

export default function Hero3DCanvas({ onNodeSelect }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Định nghĩa 4 khối dữ liệu trọng tâm
  const nodes = [
    {
      id: 'sec_actors',
      title: 'Đơn Vị & Học Viên',
      sub: 'Biên chế, cây đơn vị, tài khoản & chỉ huy',
      color: '#38BDF8',
      baseX: -160,
      baseY: -70,
      baseZ: 40,
      radius: 46
    },
    {
      id: 'sec_workflows',
      title: 'Kế Hoạch Đào Tạo',
      sub: 'Học phần, kế hoạch khung & quy tắc điểm',
      color: '#A78BFA',
      baseX: 160,
      baseY: -70,
      baseZ: -20,
      radius: 46
    },
    {
      id: 'sec_relational',
      title: 'Kết Quả Học Tập',
      sub: 'Lượt học, lần thi, bảng điểm & thi lại',
      color: '#34D399',
      baseX: 150,
      baseY: 90,
      baseZ: 50,
      radius: 46
    },
    {
      id: 'sec_scenarios',
      title: 'Phê Duyệt & Lịch Sử',
      sub: 'Mở khóa điểm, duyệt BGĐ & audit trail',
      color: '#FBBF24',
      baseX: -150,
      baseY: 90,
      baseZ: -30,
      radius: 46
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    // Các hạt dữ liệu trôi nổi trong không gian
    const particles = Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 400,
      z: (Math.random() - 0.5) * 400,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.1
    }));

    let pulseOffset = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x;
      mouseY = y;
      targetRotY = (x / width) * 0.45;
      targetRotX = -(y / height) * 0.35;

      // Kiểm tra hover node
      let found = null;
      nodes.forEach((node) => {
        // Chiếu 3D sang 2D
        const p = project(node.baseX, node.baseY, node.baseZ, currentRotX, currentRotY, width, height);
        const dist = Math.hypot(x + width / 2 - p.screenX, y + height / 2 - p.screenY);
        if (dist < node.radius * p.scale) {
          found = node.id;
        }
      });
      setHoveredNode(found);
      canvas.style.cursor = found ? 'pointer' : 'default';
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      setHoveredNode(null);
      canvas.style.cursor = 'default';
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      nodes.forEach((node) => {
        const p = project(node.baseX, node.baseY, node.baseZ, currentRotX, currentRotY, width, height);
        const dist = Math.hypot(x - p.screenX, y - p.screenY);
        if (dist < node.radius * p.scale) {
          onNodeSelect(node.id);
        }
      });
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // Hàm chiếu 3D -> 2D Perspective
    function project(x, y, z, rotX, rotY, w, h) {
      // Xoay quanh trục Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      let x1 = x * cosY - z * sinY;
      let z1 = z * cosY + x * sinY;

      // Xoay quanh trục X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      let y2 = y * cosX - z1 * sinX;
      let z2 = z1 * cosX + y * sinX;

      const fov = 400;
      const scale = fov / (fov + z2 + 200);
      const screenX = w / 2 + x1 * scale;
      const screenY = h / 2 + y2 * scale;

      return { screenX, screenY, scale, z: z2 };
    }

    // Vòng lặp vẽ đồ họa
    const render = () => {
      // Interpolate góc xoay mượt mà
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      pulseOffset = (pulseOffset + 0.02) % 1;

      ctx.clearRect(0, 0, width, height);

      // 1. Vẽ các hạt lơ lửng
      particles.forEach((p) => {
        p.z -= p.speed;
        if (p.z < -200) p.z = 200;
        const pt = project(p.x, p.y, p.z, currentRotX, currentRotY, width, height);
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, p.size * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.25 * pt.scale})`;
        ctx.fill();
      });

      // 2. Chiếu tọa độ 4 node
      const projectedNodes = nodes.map((node) => ({
        ...node,
        proj: project(node.baseX, node.baseY, node.baseZ, currentRotX, currentRotY, width, height)
      }));

      // Sắp xếp vẽ từ xa đến gần theo trục Z
      projectedNodes.sort((a, b) => a.proj.z - b.proj.z);

      // 3. Vẽ đường truyền kết nối giữa các khối
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]
      ];

      connections.forEach(([i1, i2]) => {
        const n1 = projectedNodes.find(n => n.id === nodes[i1].id);
        const n2 = projectedNodes.find(n => n.id === nodes[i2].id);
        if (!n1 || !n2) return;

        // Vẽ đường nét mờ
        ctx.beginPath();
        ctx.moveTo(n1.proj.screenX, n1.proj.screenY);
        ctx.lineTo(n2.proj.screenX, n2.proj.screenY);
        ctx.strokeStyle = 'rgba(38, 52, 77, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Vẽ xung điện sáng chạy dọc dây
        const pulseX = n1.proj.screenX + (n2.proj.screenX - n1.proj.screenX) * pulseOffset;
        const pulseY = n1.proj.screenY + (n2.proj.screenY - n1.proj.screenY) * pulseOffset;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#38BDF8';
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Vẽ các khối Node 3D
      projectedNodes.forEach((node) => {
        const { screenX, screenY, scale } = node.proj;
        const rad = node.radius * scale;
        const isHover = hoveredNode === node.id;

        ctx.save();
        ctx.translate(screenX, screenY);

        // Vòng phát quang ngoài
        ctx.beginPath();
        ctx.arc(0, 0, rad + (isHover ? 12 : 6), 0, Math.PI * 2);
        ctx.fillStyle = isHover ? `${node.color}33` : `${node.color}15`;
        ctx.fill();

        // Thân node (khối hình hộp lập phương bo góc / cầu 3D)
        const grad = ctx.createRadialGradient(-rad * 0.3, -rad * 0.3, 2, 0, 0, rad);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, node.color);
        grad.addColorStop(1, '#0c1527');

        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHover ? 25 : 12;
        ctx.fill();

        // Viền node
        ctx.strokeStyle = isHover ? '#fff' : node.color;
        ctx.lineWidth = isHover ? 2.5 : 1.5;
        ctx.stroke();

        // Vòng quỹ đạo nhỏ
        ctx.beginPath();
        ctx.ellipse(0, 0, rad * 1.35, rad * 0.6, Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `${node.color}44`;
        ctx.stroke();

        // Chữ nhãn bên dưới node
        ctx.shadowBlur = 0;
        ctx.font = `700 ${Math.max(12, 14 * scale)}px Outfit, sans-serif`;
        ctx.fillStyle = isHover ? '#fff' : '#E8EEF8';
        ctx.textAlign = 'center';
        ctx.fillText(node.title, 0, rad + 20);

        ctx.font = `500 ${Math.max(9, 10 * scale)}px Plus Jakarta Sans, sans-serif`;
        ctx.fillStyle = 'rgba(168, 182, 205, 0.85)';
        ctx.fillText(node.sub, 0, rad + 35);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [hoveredNode, onNodeSelect]);

  return (
    <div className="hero-canvas-container">
      <div 
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'none'
        }}
      >
        <span className="badge-military" style={{ background: 'rgba(8, 13, 24, 0.85)', backdropFilter: 'blur(8px)' }}>
          <Sparkles size={13} />
          Mô hình 3D Không Gian Quan Hệ CSDL
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          (Di chuột để nghiêng góc nhìn 3D • Bấm vào khối để mở chuyên mục)
        </span>
      </div>

      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
