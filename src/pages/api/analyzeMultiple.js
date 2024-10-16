import { OpenAI } from 'openai';
import { protect } from '@/middleware/authMiddleware';
import Diary from '@/models/Diary';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const isAuthenticated = await protect(req, res);
    if (!isAuthenticated) return;

    const { diaryIds } = req.body;

    try {
      await dbConnect();

      const diaries = await Diary.find({ _id: { $in: diaryIds } });

      const combinedContent = diaries.map((diary) => diary.content).join(' ');

      const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional Psychoterapist. You will answer in Korean.' },
          { role: 'user', content: `Analyze the sentiment of the following text:\n\n"${combinedContent}"\n\nProvide a sentiment analysis, along with a few advices depending on the sentiment.` },
        ]
      });

      const analysis = response.choices[0].message.content;

      return res.status(200).json({ analysis });
    } catch (error) {
      console.error('일기묶음 감정 분석 오류:', error);
      return res.status(500).json({ message: '일기묶음 감정 분석 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
