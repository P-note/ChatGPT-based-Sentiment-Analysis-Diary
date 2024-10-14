// src/pages/api/diary/list.js

import dbConnect from '@/lib/dbConnect';
import Diary from '@/models/Diary';
import { protect } from '@/middleware/authMiddleware';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    const isAuthenticated = await protect(req, res);
    if (!isAuthenticated) return; 

    try {
      const diaries = await Diary.find({ userId: req.user._id }).sort({ date: -1 });

      return res.status(200).json(diaries);
    } catch (error) {
      console.error('일기 목록 가져오기 오류:', error);
      return res.status(500).json({ message: '일기 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
