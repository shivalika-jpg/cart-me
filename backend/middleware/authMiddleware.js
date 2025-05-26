const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded JWT:', decoded);
    req.user = {
  id: decoded.userId || decoded._id || decoded.id,
  email: decoded.email,
};
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
