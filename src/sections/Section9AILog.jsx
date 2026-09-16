// src/sections/Section9AILog.jsx
// Mục 9: Nhật ký sử dụng AI & Đánh giá phản biện học thuật
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Check, 
  X, 
  Copy, 
  CheckCheck, 
  Calendar, 
  Code,
  Cpu,
  Coins,
  RefreshCw
} from 'lucide-react';
import { AI_LOGS } from '../data/aiLogData';

export default function Section9AILog() {
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(25904.22);
  const [rateUpdatedAt, setRateUpdatedAt] = useState(null);
  const [rateStatus, setRateStatus] = useState('loading');

  const modelUsage = useMemo(() => [
    { model: 'Fable 5', role: 'Phân tích nghiệp vụ & phác thảo ER', input: 32400, output: 8600, inputPrice: 1.25, outputPrice: 10 },
    { model: 'Astra 6', role: 'Rà soát quan hệ & chuẩn hóa mô hình', input: 14400, output: 9600, inputPrice: 2.5, outputPrice: 15 }
  ].map(item => ({
    ...item,
    cost: item.input / 1_000_000 * item.inputPrice + item.output / 1_000_000 * item.outputPrice
  })), []);

  const usageTotals = useMemo(() => modelUsage.reduce((total, item) => ({
    input: total.input + item.input,
    output: total.output + item.output,
    cost: total.cost + item.cost
  }), { input: 0, output: 0, cost: 0 }), [modelUsage]);

  useEffect(() => {
    let cancelled = false;
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(response => {
        if (!response.ok) throw new Error('Không thể tải tỷ giá');
        return response.json();
      })
      .then(data => {
        if (cancelled || !data?.rates?.VND) return;
        setExchangeRate(data.rates.VND);
        setRateUpdatedAt(data.time_last_update_utc || new Date().toISOString());
        setRateStatus('live');
      })
      .catch(() => {
        if (!cancelled) setRateStatus('fallback');
      });
    return () => { cancelled = true; };
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const masterPrompt = `Bạn đóng vai trò người hướng dẫn phân tích và thiết kế cơ sở dữ liệu cho đề tài “Quản lý điểm học viên quân sự”.
Tôi đang ở giai đoạn phân tích nghiệp vụ, vẽ ER và chuyển sang mô hình quan hệ. Chưa triển khai SQL, backend hoặc hệ thống thực tế.
Dữ liệu tôi cung cấp gồm:
1. Mô tả bài toán.
2. Bản phân tích ban đầu.
3. Sơ đồ hoặc danh sách bảng do tôi tự thiết kế.
Hãy thực hiện theo thứ tự:
A. Phân tích yêu cầu
- Xác định tác nhân, phạm vi dữ liệu và nghiệp vụ của từng tác nhân.
- Phân biệt yêu cầu đã được nêu, giả định đề xuất và thông tin cần xác nhận.
- Kiểm tra mâu thuẫn trong công thức điểm, ngưỡng đạt, thi lại, học lại và quyền sửa điểm.
- Không tự nhận các quy tắc của đề bài là quy chế chính thức của nhà trường.
B. Đánh giá bản thiết kế ban đầu
- Chỉ ra điểm hợp lý và điểm còn thiếu bằng tình huống cụ thể.
- Không tự tạo một sơ đồ rồi gán là bản tự vẽ của tôi.
- Không đánh giá chỉ dựa trên hình thức đẹp hoặc xấu.
C. Đề xuất mô hình cải tiến
- Mô hình hóa thực thể Giảng viên (GIANG_VIEN), Bộ môn (BO_MON) và Phân công giảng dạy (PHAN_CONG).
- Kế thừa IS-A: Thực thể cha NGUOI cho cả Học viên và Giảng viên.
- Phân biệt thi lại trong cùng phân công với học lại ở một phân công mới.
- Mô hình hóa cơ cấu đơn vị và phạm vi quản lý của tài khoản chỉ huy.
- Mô hình hóa chốt điểm, phân quyền Giảng viên nhập điểm quá trình và Khảo thí mở đợt thi.
- Giữ điểm thi thực tế trong DIEM, phân biệt với điểm tổng kết được công nhận trong KET_QUA_HOC_TAP.
- Mỗi bảng bổ sung phải có lý do nghiệp vụ; tránh mở rộng ngoài phạm vi.
D. Trình bày kết quả: Tóm tắt bài toán, Ma trận tác nhân, Quy trình nghiệp vụ, Danh sách thực thể, ER khái niệm, Mô hình quan hệ 23 bảng (R1 – R23), Từ điển dữ liệu, Ràng buộc, So sánh 2 bản và 6 tình huống kiểm chứng.`;

  return (
    <div className="section-view">
      <div className="section-header">
        <div className="section-tag">
          <Terminal size={15} />
          MINH BẠCH & LÀM CHỦ CÔNG NGHỆ AI
        </div>
        <h2 className="section-title">
          Nhật Ký Sử Dụng AI & Đánh Giá Phản Biện
        </h2>
        <p className="section-desc">
          Báo cáo trung thực quá trình đồng hành cùng Trí tuệ Nhân tạo: Sinh viên đóng vai trò kiến trúc sư trưởng, tiếp thu có chọn lọc các gợi ý xác đáng và kiên quyết bác bỏ các đề xuất vi phạm nguyên tắc cơ sở dữ liệu.
        </p>
      </div>

      {/* Minh bạch mức sử dụng mô hình và chi phí ước tính */}
      <div className="card ai-usage-card" style={{ marginBottom: 28 }}>
        <div className="ai-usage-card__head">
          <div>
            <div className="section-tag" style={{ marginBottom: 8 }}><Cpu size={15} /> NHẬT KÝ TÀI NGUYÊN AI</div>
            <h3>Mô Hình AI Sử Dụng Để Vẽ Sơ Đồ</h3>
            <p>Fable 5 + Astra 6 · Số liệu token được ước tính theo các phiên phân tích, vẽ và rà soát mô hình ER.</p>
          </div>
          <div className={`ai-rate-status is-${rateStatus}`}>
            <RefreshCw size={14} className={rateStatus === 'loading' ? 'is-spinning' : ''} />
            {rateStatus === 'live' ? 'Tỷ giá trực tiếp' : rateStatus === 'loading' ? 'Đang lấy tỷ giá' : 'Tỷ giá dự phòng'}
          </div>
        </div>

        <div className="ai-usage-grid">
          {modelUsage.map(item => <div key={item.model} className="ai-model-usage">
            <div className="ai-model-usage__name"><Sparkles size={16} /> {item.model}</div>
            <div className="ai-model-usage__role">{item.role}</div>
            <div className="ai-model-usage__stats">
              <span>Input <b>{item.input.toLocaleString('vi-VN')}</b></span>
              <span>Output <b>{item.output.toLocaleString('vi-VN')}</b></span>
              <span>Chi phí <b>${item.cost.toFixed(4)}</b></span>
            </div>
          </div>)}

          <div className="ai-cost-total">
            <div><Coins size={18} /> SỐ TIỀN THỰC TẾ ƯỚC TÍNH</div>
            <strong>${usageTotals.cost.toFixed(4)}</strong>
            <b>≈ {Math.round(usageTotals.cost * exchangeRate).toLocaleString('vi-VN')} VNĐ</b>
            <small>1 USD = {exchangeRate.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} VNĐ</small>
          </div>
        </div>

        <div className="ai-usage-footnote">
          Tổng token sử dụng để vẽ và rà soát: <strong>{(usageTotals.input + usageTotals.output).toLocaleString('vi-VN')} token</strong>
          <span>Input: {usageTotals.input.toLocaleString('vi-VN')} · Output: {usageTotals.output.toLocaleString('vi-VN')}</span>
          <span>Nguồn tỷ giá: ExchangeRate-API{rateUpdatedAt ? ` · Cập nhật ${new Date(rateUpdatedAt).toLocaleString('vi-VN')}` : ''}</span>
          <em>Chi phí là ước tính học thuật theo lượng token và đơn giá giả định, không phải hóa đơn API.</em>
        </div>
      </div>

      {/* Hộp Master Prompt Chuẩn */}
      <div className="card" style={{ marginBottom: 28, background: 'rgba(17, 27, 46, 0.95)', borderColor: 'rgba(167, 139, 250, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-purple)' }}>
            <Code size={18} />
            Prompt Khung Dùng Để Phân Tích & Hoàn Thiện CSDL
          </div>
          <button
            onClick={() => handleCopy(masterPrompt, 'master')}
            className="btn btn-secondary btn-sm"
          >
            {copiedPromptId === 'master' ? <CheckCheck size={14} color="var(--color-emerald)" /> : <Copy size={14} />}
            {copiedPromptId === 'master' ? 'Đã Sao Chép!' : 'Sao Chép Prompt'}
          </button>
        </div>

        <div style={{ background: 'rgba(8, 13, 24, 0.8)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 14px', maxHeight: 180, overflowY: 'auto' }}>
          <pre style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {masterPrompt}
          </pre>
        </div>
      </div>

      {/* Danh Sách Các Phiên Làm Việc Với AI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {AI_LOGS.map((log) => (
          <div key={log.id} className="card" style={{ background: 'rgba(17, 27, 46, 0.85)' }}>
            {/* Header Phiên */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <span className="tag tag-blue" style={{ marginBottom: 4 }}>
                  {log.id.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{log.sessionTitle}</h3>
              </div>
              <span className="mono-font" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} />
                {log.date}
              </span>
            </div>

            {/* Mục tiêu & Đầu vào */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Mục Tiêu Phiên Làm Việc</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', background: 'rgba(8, 13, 24, 0.5)', padding: '8px 12px', borderRadius: 6 }}>
                  {log.objective}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Dữ Liệu Đầu Vào Cung Cấp Cho AI</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', background: 'rgba(8, 13, 24, 0.5)', padding: '8px 12px', borderRadius: 6 }}>
                  {log.inputProvided}
                </div>
              </div>
            </div>

            {/* Prompt Nguyên Văn */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Prompt Nguyên Văn Gửi AI
                </span>
                <button
                  onClick={() => handleCopy(log.verbatimPrompt, log.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {copiedPromptId === log.id ? <CheckCheck size={13} color="var(--color-emerald)" /> : <Copy size={13} />}
                  {copiedPromptId === log.id ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>
              <div style={{ background: 'rgba(8, 13, 24, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 14px' }}>
                <pre style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {log.verbatimPrompt}
                </pre>
              </div>
            </div>

            {/* Đánh Giá Phản Biện Của Sinh Viên */}
            <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--color-blue)', fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: 4 }}>
                Nhận Xét & Đánh Giá Phản Biện Của Sinh Viên:
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                {log.studentCritique}
              </p>
            </div>

            {/* Bảng Đề Xuất Được Chấp Nhận vs Bị Bác Bỏ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {/* Chấp nhận */}
              <div style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.82rem', marginBottom: 8 }}>
                  <Check size={15} />
                  ĐỀ XUẤT ĐƯỢC CHẤP NHẬN
                </div>
                <ul style={{ paddingLeft: 16, fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {log.acceptedProposals.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Bác bỏ */}
              <div style={{ background: 'rgba(251, 113, 133, 0.05)', border: '1px solid rgba(251, 113, 133, 0.3)', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-rose)', fontSize: '0.82rem', marginBottom: 8 }}>
                  <X size={15} />
                  ĐỀ XUẤT BỊ BÁC BỎ & LÝ DO KỸ THUẬT
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {log.rejectedProposals.map((rej, i) => (
                    <div key={i} style={{ fontSize: '0.8rem' }}>
                      <strong style={{ color: 'var(--color-rose)' }}>• {rej.item}:</strong>
                      <div style={{ color: 'var(--text-muted)', marginLeft: 12, marginTop: 2 }}>{rej.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
