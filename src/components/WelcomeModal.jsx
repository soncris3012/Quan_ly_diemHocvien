// src/components/WelcomeModal.jsx
// Popup giới thiệu dự án và nhóm thực hiện
import React, { useState, useEffect } from 'react';
import { Users, X, ArrowRight } from 'lucide-react';
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
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
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
        className="card welcome-modal-card"
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
        <div className="welcome-modal-grid" aria-hidden="true" />
        <div className="welcome-modal-orb welcome-modal-orb--one" aria-hidden="true" />
        <div className="welcome-modal-orb welcome-modal-orb--two" aria-hidden="true" />
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
        <div className="welcome-modal-header" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div className="welcome-academy-logo">
            <img src="/smta-logo.png" alt="Logo Học viện Kỹ thuật Quân sự" />
          </div>
          <div>
            <span className="badge-military" style={{ fontSize: '0.72rem' }}>
              SMTA v2.0 • HỌC VIỆN KỸ THUẬT QUÂN SỰ
            </span>
            <h3 id="welcome-title" style={{ fontSize: '1.48rem', color: '#fff', marginTop: 5, fontWeight: 800, lineHeight: 1.28 }}>
              Dự án Cơ sở dữ liệu quản lý điểm Học viên quân sự MTA
            </h3>
          </div>
        </div>

        {/* Thông tin nhóm 519 */}
        <div className="welcome-members" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 12, padding: '16px 20px', margin: '18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-blue)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>
            <Users size={18} />
            THÀNH VIÊN
          </div>
          <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0, letterSpacing: '0.02em' }}>
            Sơn, Bảo, Quyết, Hùng, Khánh
          </p>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button 
            onClick={() => setIsOpen(false)}
            className="btn btn-primary welcome-cta"
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
