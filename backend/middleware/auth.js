const { verifyToken } = require('../lib/auth');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
