const SYSTEM_CONTEXT = `Bạn là MTA Pet, trợ lý học thuật cho đồ án cơ sở dữ liệu gồm hai phân hệ:
- SMTA quản lý điểm học viên quân sự: 23 thực thể, phân quyền USER/ROLE/PERMISSION; giảng viên chỉ nhập điểm lớp học phần được phân công; phòng đào tạo quản lý, duyệt và khóa điểm; điểm gồm thường xuyên, chuyên cần, cuối kỳ; hỗ trợ thi lại, học lại và truy vết lịch sử.
- XMTA quản lý kiểm tra thể lực cấp tiểu đoàn: đơn vị, cấp bậc, quân nhân, môn kiểm tra, tiêu chuẩn theo giới tính/tuổi/thời gian hiệu lực, môn theo từng đợt, kết quả chi tiết và tổng hợp. Bản AI còn đề xuất buổi kiểm tra, phân công cán bộ và chỉ số cơ thể.
Hãy trả lời bằng tiếng Việt, ngắn gọn nhưng rõ ràng. Ưu tiên giải thích nghiệp vụ, ER, khóa, chuẩn hóa, SQL và sự khác nhau giữa mô hình người vẽ với AI. Nếu câu hỏi ngoài phạm vi đồ án, nói rõ bạn chỉ hỗ trợ nội dung SMTA/XMTA. Không bịa dữ liệu, quy định hoặc kết quả chưa có trong ngữ cảnh.`;

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Chỉ hỗ trợ phương thức POST.' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'Trợ lý AI chưa được cấu hình GEMINI_API_KEY trên máy chủ.' });

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  const history = Array.isArray(request.body?.history) ? request.body.history.slice(-8) : [];
  if (!message) return response.status(400).json({ error: 'Vui lòng nhập câu hỏi.' });
  if (message.length > 1500) return response.status(400).json({ error: 'Câu hỏi tối đa 1.500 ký tự.' });

  const contents = history
    .filter(item => ['user', 'model'].includes(item?.role) && typeof item?.text === 'string')
    .map(item => ({ role: item.role, parts: [{ text: item.text.slice(0, 3000) }] }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_CONTEXT }] },
        contents,
        generationConfig: { temperature: 0.25, maxOutputTokens: 900 }
      })
    });
    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error('Gemini API error', geminiResponse.status, data?.error?.message);
      return response.status(502).json({ error: 'Google Gemini chưa thể trả lời lúc này. Vui lòng thử lại.' });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!answer) return response.status(502).json({ error: 'Gemini không trả về nội dung phù hợp.' });
    return response.status(200).json({ answer });
  } catch (error) {
    console.error('AI assistant failure', error);
    return response.status(500).json({ error: 'Không thể kết nối trợ lý AI.' });
  }
}
