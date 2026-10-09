import React, { useEffect, useRef, useState } from 'react';
import { LoaderCircle, MessageCircleQuestion, RefreshCw, Send, X } from 'lucide-react';

const AUTHORS = [
  { name: 'Củ Cải Hay Cọc', emoji: '🥬' },
  { name: 'Cà Rốt Dễ Thương', emoji: '🥕' },
  { name: 'Khoai Tây Điềm Tĩnh', emoji: '🥔' },
  { name: 'Bí Đỏ Vui Vẻ', emoji: '🎃' },
  { name: 'Bắp Cải Mơ Mộng', emoji: '🥦' },
  { name: 'Đậu Hà Lan Tò Mò', emoji: '🫛' },
  { name: 'Ngô Non Lạc Quan', emoji: '🌽' },
  { name: 'Cà Chua Nhiệt Tình', emoji: '🍅' }
];

function getAnonymousId() {
  const key = 'cadet-feedback-author';
  const stored = Number.parseInt(localStorage.getItem(key), 10);
  if (Number.isInteger(stored) && stored >= 0 && stored < AUTHORS.length) return stored;
  const value = Math.floor(Math.random() * AUTHORS.length);
  localStorage.setItem(key, String(value));
  return value;
}

function formatTime(value) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function FeedbackBoard({ system = 'portal' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const endRef = useRef(null);
  const [authorId] = useState(getAnonymousId);
  const author = AUTHORS[authorId];

  const load = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const result = await fetch('/api/feedback', { cache: 'no-store' });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || 'Không thể tải góp ý.');
      setMessages(data.messages || []);
      setError('');
    } catch (loadError) {
      if (!quiet) setError(loadError.message);
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const kickoff = window.setTimeout(load, 0);
    const timer = window.setInterval(() => load(true), 15000);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const submit = async event => {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setError('');
    try {
      const result = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorId, system, startedAt, website: '' })
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || 'Không thể gửi góp ý.');
      setMessages(items => [...items.filter(item => item.id !== data.message.id), data.message]);
      setInput('');
      setStartedAt(Date.now());
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setSending(false);
    }
  };

  return <div className={`feedback-board ${open ? 'is-open' : ''}`}>
    {open && <section className="feedback-panel" role="dialog" aria-label="Góc góp ý chung">
      <header>
        <div className="feedback-panel__mark"><MessageCircleQuestion size={22}/></div>
        <div><strong>Góc góp ý chung</strong><span>Mọi thiết bị · cập nhật tự động</span></div>
        <button onClick={() => load()} title="Tải lại" aria-label="Tải lại góp ý"><RefreshCw size={16}/></button>
        <button onClick={() => setOpen(false)} aria-label="Đóng góc góp ý"><X size={18}/></button>
      </header>
      <div className="feedback-identity"><span>{author.emoji}</span><div>Bạn đang góp ý với tên<strong>{author.name}</strong></div></div>
      <div className="feedback-messages">
        {loading && <div className="feedback-state"><LoaderCircle className="is-spinning" size={20}/> Đang tải góp ý...</div>}
        {!loading && messages.length === 0 && <div className="feedback-empty"><b>Chưa có góp ý nào</b><span>Hãy là người đầu tiên để lại nhận xét cho nhóm nhé!</span></div>}
        {messages.map(message => <article key={message.id} className="feedback-message">
          <span className="feedback-message__avatar">{message.author?.emoji || '🌱'}</span>
          <div><header><strong>{message.author?.name || 'Rau Củ Ẩn Danh'}</strong><time>{formatTime(message.createdAt)}</time></header><p>{message.content}</p><small>{String(message.system || 'portal').toUpperCase()}</small></div>
        </article>)}
        <div ref={endRef}/>
      </div>
      {error && <div className="feedback-error">{error}</div>}
      <form onSubmit={submit}>
        <textarea value={input} onChange={event => setInput(event.target.value)} maxLength={500} rows={2} placeholder="Đóng góp ý kiến cho bài của nhóm..." aria-label="Nội dung góp ý"/>
        <div><span>{input.length}/500 · góp ý được hiển thị công khai</span><button type="submit" disabled={sending || !input.trim()}>{sending ? <LoaderCircle className="is-spinning" size={17}/> : <Send size={17}/>} Gửi góp ý</button></div>
      </form>
    </section>}
    <button className="feedback-launcher" onClick={() => setOpen(value => !value)} aria-label={open ? 'Đóng góc góp ý' : 'Mở góc góp ý chung'}>
      <MessageCircleQuestion size={29}/><b>Góp ý</b><i>?</i>
    </button>
  </div>;
}
