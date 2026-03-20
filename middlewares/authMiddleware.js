const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }
    const token = authHeader.split(' ')[1];

    //  verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }
    req.user = { id: user._id.toString(), role: user.role };
    next(); 

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' });
    }
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authMiddleware;