import { OpenAI } from 'openai';
import { protect } from '@/middleware/authMiddleware';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const isAuthenticated = await protect(req, res);
    if (!isAuthenticated) return;

    const { text } = req.body;

    try {

      const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional Psychoterapist. You will answer in Korean.' },
          { role: 'user', content: `Analyze the sentiment of the following text:\n\n"${text}"\n\nProvide a sentiment analysis, along with a few advices depending on the sentiment.` },
        ]
      });

      const analysis = response.choices[0].message.content;

      // 분석 결과 반환
      return res.status(200).json({ analysis });
    } catch (error) {
      console.error('감정 분석 오류:', error);
      return res.status(500).json({ message: '감정 분석 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
