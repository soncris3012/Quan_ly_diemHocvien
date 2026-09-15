// src/components/WelcomeModal.jsx
// Popup thông báo chào mừng khi truy cập trang web: Nhóm 519: Sơn, Quyết, Bảo, Khánh, Hùng
import React, { useState, useEffect } from 'react';
import { Sparkles, Users, X, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tự động mở popup sau 300ms khi vào trang web
    const timer = setTimeout(() => {
      setIsOpen(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(8, 13, 24, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="card"
        style={{
          maxWidth: 560,
          width: '100%',
          background: '#0D1525',
          borderColor: 'rgba(56, 189, 248, 0.45)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.25)',
          borderRadius: 16,
          padding: 28,
          position: 'relative',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6
          }}
          title="Đóng (ESC)"
        >
          <X size={20} />
        </button>

        {/* Header Huy Hiệu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#031221', boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <span className="badge-military" style={{ fontSize: '0.72rem' }}>
              CADET DB v2.0 • HỌC VIỆN QUÂN SỰ
            </span>
            <h3 style={{ fontSize: '1.35rem', color: '#fff', marginTop: 2, fontWeight: 800 }}>
              Chào Mừng Đến Với Dự Án Quản Lý Điểm!
            </h3>
          </div>
        </div>

        {/* Thông tin nhóm 519 */}
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 12, padding: '16px 20px', margin: '18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-blue)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>
            <Users size={18} />
            NHÓM THỰC HIỆN 519
          </div>
          <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0, letterSpacing: '0.02em' }}>
            Sơn • Quyết • Bảo • Khánh • Hùng
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
            Báo cáo tương tác thiết kế cơ sở dữ liệu: Phân tích bài toán, mô hình ER tự vẽ vs AI hỗ trợ, 19 bảng quan hệ chuẩn hóa và 6 tình huống kiểm chứng thực tế.
          </p>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button 
            onClick={() => setIsOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px 20px', fontSize: '0.92rem' }}
          >
            Khám Phá Dự Án Ngay
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
