import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res
        .status(401)
        .json({ message: 'No token found in header Authorization.' });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decodedToken.email } });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePictureName: user.profilePictureName,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired. Please log in again' });
    } else {
      res.status(401).json({ message: 'Error in authentication' });
    }
  }
};

export default authMiddleware;
