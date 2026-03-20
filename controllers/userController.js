const User = require('../models/User');

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { nom, prenom, bio, competences, avatar } = req.body; //data envoyee par front
    const updates = {};
    if (nom)  updates.nom = nom;
    if (prenom) updates.prenom = prenom;
    if (bio !== undefined) updates.bio = bio;
    if (competences) updates.competences = competences;
    if (avatar)  updates.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }  // new:true → retourne le doc mis à jour
    ).select('-password');

    res.json({ message: 'Profil mis à jour !', user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getUserById, updateUser, deleteUser };