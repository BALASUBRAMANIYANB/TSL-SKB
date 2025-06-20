const { verifyToken } = require('../../config/auth');
const User = require('../../models/user');

const authenticateToken = async (req, res, next) => {
  let token;
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    // Allow token to be passed as a query parameter for file downloads
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    // Fetch the user from the database to get the role
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'User role is not authorized to access this route'
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorize
}; 