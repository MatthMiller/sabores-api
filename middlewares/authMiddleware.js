import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res
        .status(401)
        .json({ message: 'No token found in header Authorization.' });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedToken; // { id: x, email: x } payload
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
