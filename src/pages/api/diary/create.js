// src/pages/api/diary/create.js

import dbConnect from '@/lib/dbConnect';
import Diary from '@/models/Diary';
import { protect } from '@/middleware/authMiddleware';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    const isAuthenticated = await protect(req, res);
    if (!isAuthenticated) return; 

    const { title, content } = req.body;
    const userId = req.user._id;

    try {
      const diary = await Diary.create({
        userId,
        title,
        content,
      });

      return res.status(201).json(diary);
    } catch (error) {
      console.error('일기 작성 오류:', error);
      return res.status(500).json({ message: '일기 작성 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST']); 
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
