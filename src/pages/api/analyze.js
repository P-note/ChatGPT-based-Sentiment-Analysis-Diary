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
          { role: 'system', content: 'You are a professional psychotherapist. You will answer in Korean. User is a client who wants to understand their feelings better. I will provide you a diary of the user, so please analyze the sentiment of the diary. Follow a step-by-step process to explore both the explicit and implicit emotions.' },
          { role: 'user', content: `${text}` },
          { role: 'assistant', content: 'Let’s analyze the emotions conveyed in this diary. First, identify the explicit emotions from the text. Then, examine the overall tone and structure to detect any implicit or hidden emotions. After that, interpret these emotions, both on the surface and beneath, to give a more holistic view. Finally, provide some advice or suggestions based on both the obvious and hidden emotions.' }
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
