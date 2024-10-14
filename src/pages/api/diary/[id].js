// src/pages/api/diary/[id].js

import dbConnect from '@/lib/dbConnect';
import Diary from '@/models/Diary';
import { protect } from '@/middleware/authMiddleware';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  await dbConnect();

  if (method === 'GET') {
    // protect 미들웨어로 인증된 사용자만 접근 가능
    const isAuthenticated = await protect(req, res);
    if (!isAuthenticated) return;

    try {
      // MongoDB에서 해당 id로 일기 찾기
      const diary = await Diary.findById(id);

      if (!diary) {
        return res.status(404).json({ message: '일기를 찾을 수 없습니다.' });
      }

      // 요청한 사용자가 작성한 일기인지 확인
      if (diary.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: '권한이 없습니다.' });
      }

      return res.status(200).json(diary);
    } catch (error) {
      console.error('일기 불러오기 오류:', error);
      return res.status(500).json({ message: '일기 불러오는 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
