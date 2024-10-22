import { protect } from '@/middleware/authMiddleware';
import Diary from '@/models/Diary';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'DELETE') {
    const isAuthenticated = await protect(req, res);
    if (!isAuthenticated) return;

    const { diaryIds } = req.body;

    try {
      await dbConnect();

      await Diary.deleteMany({ _id: { $in: diaryIds } });

      return res.status(200).json({ message: '일기 삭제 성공' });
    } catch (error) {
      console.error('일기 삭제 오류:', error);
      return res.status(500).json({ message: '일기 삭제 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
