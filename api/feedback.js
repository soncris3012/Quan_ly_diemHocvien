import { list, put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

const PREFIX = 'community-feedback/';
const MAX_MESSAGES = 80;
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

function send(response, status, body) {
  response.setHeader('Cache-Control', 'no-store');
  return response.status(status).json(body);
}

async function readMessages() {
  const { blobs } = await list({ prefix: PREFIX, limit: MAX_MESSAGES });
  const newest = blobs
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, MAX_MESSAGES);
  const messages = await Promise.all(newest.map(async blob => {
    try {
      const result = await fetch(blob.url, { cache: 'no-store' });
      return result.ok ? await result.json() : null;
    } catch {
      return null;
    }
  }));
  return messages.filter(Boolean).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      return send(response, 200, { messages: await readMessages() });
    } catch (error) {
      console.error('Feedback list failure', error);
      return send(response, 500, { error: 'Chưa thể tải các góp ý lúc này.' });
    }
  }

  if (request.method !== 'POST') return send(response, 405, { error: 'Chỉ hỗ trợ GET và POST.' });

  const content = typeof request.body?.content === 'string' ? request.body.content.trim() : '';
  const authorId = Number.parseInt(request.body?.authorId, 10);
  const system = ['smta', 'xmta', 'portal'].includes(request.body?.system) ? request.body.system : 'portal';
  const startedAt = Number(request.body?.startedAt);

  if (!content) return send(response, 400, { error: 'Bạn chưa nhập nội dung góp ý.' });
  if (content.length > 500) return send(response, 400, { error: 'Góp ý tối đa 500 ký tự.' });
  if (!Number.isInteger(authorId) || authorId < 0 || authorId >= AUTHORS.length) {
    return send(response, 400, { error: 'Biệt danh ẩn danh không hợp lệ.' });
  }
  // Trường bẫy bot và thời gian điền tối thiểu giúp hạn chế spam tự động đơn giản.
  if (request.body?.website || !startedAt || Date.now() - startedAt < 700) {
    return send(response, 400, { error: 'Vui lòng thử gửi lại góp ý.' });
  }

  const message = {
    id: randomUUID(),
    author: AUTHORS[authorId],
    content,
    system,
    createdAt: new Date().toISOString()
  };

  try {
    const timestamp = String(Date.now()).padStart(13, '0');
    await put(`${PREFIX}${timestamp}-${message.id}.json`, JSON.stringify(message), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      cacheControlMaxAge: 60
    });
    return send(response, 201, { message });
  } catch (error) {
    console.error('Feedback save failure', error);
    return send(response, 500, { error: 'Chưa thể lưu góp ý. Vui lòng thử lại.' });
  }
}

