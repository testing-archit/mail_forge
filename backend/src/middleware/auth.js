const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized', status: 'UNAUTHORIZED' });
  }

  try {
    // 1. Try to verify the token with Supabase (since frontend uses Supabase Auth)
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (user && !error) {
      req.user = user;
      return next();
    }

    // 2. Fallback to verifying with our own custom JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', status: 'UNAUTHORIZED' });
  }
};

module.exports = requireAuth;
