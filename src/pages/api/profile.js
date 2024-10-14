import { protect } from '../../middleware/authMiddleware';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

const handler = async (req, res) => {
  await dbConnect();

  const user = await User.findById(req.user).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
};

export default protect(handler);
