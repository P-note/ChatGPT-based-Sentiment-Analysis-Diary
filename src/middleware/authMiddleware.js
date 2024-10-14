// src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function protect(req, res) {
  await dbConnect();

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return true;
  } catch (error) {
    return res.status(401).json({ message: '토큰 인증에 실패했습니다.' });
  }
}
