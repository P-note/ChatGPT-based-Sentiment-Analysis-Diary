import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const messages = [
      { role: 'system', content: '당신은 감정 분석 전문가입니다.' },
      { role: 'user', content: `다음 일기의 감정을 분석하고, 세 줄 이하로 요약해줘.:\n\n"${content}"\n\n감정 분석 결과를 기반으로 간단한 조언을 줘.` },
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const analysis = completion.data.choices[0].message.content.trim();

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to analyze content' });
  }
}
