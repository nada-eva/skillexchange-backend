const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  
    process.env.JWT_SECRET,              
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const user = await User.create({ nom, prenom, email, password });
    const token = generateToken(user);

    res.status(201).json({
      message: 'Compte créé avec succès !',
      token,
      user: user.toPublicJSON(),
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// post /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Connexion réussie !',
      token,
      user: user.toPublicJSON(),
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { register, login, getMe };