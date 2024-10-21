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

      // 선택된 일기 목록 가져오기
      const diaries = await Diary.find({ _id: { $in: diaryIds } });

      // 일기 사이에 구분선 추가 (---)하여 연결
      const combinedContent = diaries
        .map((diary, index) => `일기 ${index + 1} (${new Date(diary.date).toLocaleDateString()}):\n${diary.content}`)
        .join('\n\n---\n\n'); // 일기 간 구분선

      const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
      });

      // ChatGPT 프롬프트 구성: 여러 날의 일기에 대한 감정 분석 요청
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // gpt-4 또는 gpt-3.5-turbo로 변경 가능
        messages: [
          {
            role: 'system',
            content: 'You are a professional psychotherapist. You will answer in Korean. User is a client who wants to understand their feelings better. I will provide you some diary of the user. Each diary is separated by "---". so please analyze the sentiment of the diaries. Follow a step-by-step process to explore both the explicit and implicit emotions.'
          },
          {
            role: 'user',
            content: `${combinedContent}"`
          },
          { role: 'assistant', content: 'Let’s analyze the emotions conveyed in this diary. First, identify key phrases that express explicit emotions. Then, examine the overall tone and structure to detect any implicit or hidden emotions, including potential contradictions or subtle shifts in mood. After that, interpret these emotions, both on the surface and beneath, to give a more holistic view. Finally, provide advice based on both the obvious and hidden emotions.' }
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
