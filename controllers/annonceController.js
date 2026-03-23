const Annonce = require('../models/Annonce');

//  GET /api/annonces / req.query: ?type=offre&categorie=Musique&search=guitare&page=1
const getAnnonces = async (req, res) => {
  try {
    const {type, categorie, search, niveauRequis, page = 1, limit = 12} = req.query;

    // Construire le filtre
    const filter = { active: true };

    if (type) 
        filter.type = type;
    if (categorie)
        filter.categorie  = categorie;
    if (niveauRequis)
        filter.niveauRequis = niveauRequis;

    if (search) {
      filter.$or = [
        { titre:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { competence:  { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Annonce.countDocuments(filter);

    const annonces = await Annonce.find(filter)
      .populate('userId', 'nom prenom avatar rating') 
      .sort({ createdAt: -1 })   // plus récent
      .skip(skip)
      .limit(Number(limit));

    res.json({
      annonces,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/annonces/:id
const getAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id)
      .populate('userId', 'nom prenom avatar rating bio evaluations');

    if (!annonce) {
      return res.status(404).json({ message: 'Annonce introuvable' });
    }
    res.json({ annonce });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/annonces (protected)
const createAnnonce = async (req, res) => {
  try {
    const {titre, description, competence, categorie, type, niveauRequis, disponibilite, enEchange} = req.body;

    const annonce = await Annonce.create({
      userId: req.user.id,  // vient de authMiddleware
      titre, description, competence, categorie,
      type, niveauRequis, disponibilite, enEchange,
    });

    // Populate avant de retourner pour avoir les infos de l'auteur
    await annonce.populate('userId', 'nom prenom avatar');

    res.status(201).json({ message: 'Annonce publiée !', annonce });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PUT /api/annonces/:id
const updateAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' });
// comparer propriétaire annonce avec user connecté
    if (annonce.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const updated = await Annonce.findByIdAndUpdate(req.params.id, 
        { $set: req.body }, { new: true, runValidators: true })
      .populate('userId', 'nom prenom avatar');

    res.json({ message: 'Annonce mise à jour !', annonce: updated });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/annonces/:id
const deleteAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce introuvable' });

    if (annonce.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Annonce.findByIdAndDelete(req.params.id);
    res.json({ message: 'Annonce supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/annonces/user/:userId
const getAnnoncesByUser = async (req, res) => {
  try {
    const annonces = await Annonce.find({ userId: req.params.userId, active: true })
      .populate('userId', 'nom prenom avatar')
      .sort({ createdAt: -1 });

    res.json({ annonces });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAnnonces, getAnnonceById, createAnnonce, updateAnnonce, deleteAnnonce, getAnnoncesByUser
};