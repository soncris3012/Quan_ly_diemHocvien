import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';

const WELCOME = { role: 'model', text: 'Chào bạn! Mình là MTA Pet 🐾 Hãy hỏi mình về mô hình ER, SQL hoặc nghiệp vụ SMTA/XMTA nhé.' };

export default function PetAssistant({ system }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (event) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    const history = messages.filter(item => item !== WELCOME);
    setMessages(items => [...items, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const result = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[Đang xem ${system.toUpperCase()}] ${question}`, history })
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || 'Trợ lý chưa thể trả lời.');
      setMessages(items => [...items, { role: 'model', text: data.answer }]);
    } catch (error) {
      setMessages(items => [...items, { role: 'error', text: error.message }]);
    } finally { setLoading(false); }
  };

  return <div className={`pet-assistant ${open ? 'is-open' : ''}`}>
    {open && <section className="pet-chat" role="dialog" aria-label="Trợ lý AI MTA Pet">
      <header><div className="pet-avatar pet-avatar--small">🐾</div><div><strong>MTA Pet</strong><span><i /> Google Gemini · {system.toUpperCase()}</span></div><button onClick={() => setOpen(false)} aria-label="Đóng trợ lý"><X size={18}/></button></header>
      <div className="pet-chat__messages">{messages.map((item,index)=><div key={`${item.role}-${index}`} className={`pet-message is-${item.role}`}>{item.text}</div>)}{loading&&<div className="pet-message is-model is-typing"><i/><i/><i/></div>}<div ref={endRef}/></div>
      <form onSubmit={send}><input value={input} onChange={event=>setInput(event.target.value)} maxLength={1500} placeholder="Hỏi về bài CSDL..." aria-label="Câu hỏi cho trợ lý AI"/><button type="submit" disabled={loading||!input.trim()} aria-label="Gửi câu hỏi"><Send size={18}/></button></form>
      <small>AI có thể trả lời chưa chính xác; hãy đối chiếu nội dung báo cáo.</small>
    </section>}
    <button className="pet-launcher" onClick={() => setOpen(value=>!value)} aria-label={open?'Đóng trợ lý AI':'Mở trợ lý AI'}><span className="pet-ears">⌒　⌒</span><span className="pet-face">•ᴗ•</span><Sparkles className="pet-spark" size={17}/><b>Hỏi AI</b></button>
  </div>;
}
