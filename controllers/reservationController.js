const Reservation = require('../models/Reservation');

// GET /api/reservations
const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await Reservation.find({ $or: [{ fromId: userId }, { toId: userId }] })
      .populate('fromId', 'nom prenom avatar')
      .populate('toId', 'nom prenom avatar')
      .populate('annonceId', 'titre competence')
      .sort({ createdAt: -1 });

    const recues   = reservations.filter(r => r.toId._id.toString() === userId);
    const envoyees = reservations.filter(r => r.fromId._id.toString() === userId);

    res.json({ recues, envoyees });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/reservations
const createReservation = async (req, res) => {
  try {
    const { toId, annonceId, date, heure, message } = req.body;
    if (toId === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas réserver votre propre annonce' });
    }

    const reservation = await Reservation.create({
      fromId: req.user.id,
      toId, annonceId, date, heure, message,
    });

    await reservation.populate([
      { path: 'fromId',  select: 'nom prenom' },
      { path: 'toId',  select: 'nom prenom' },
      { path: 'annonceId', select: 'titre' },
    ]);

    res.status(201).json({ message: 'Demande de réservation envoyée !', reservation });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/reservations/:id/statut
// Changer le statut : acceptée / refusée / terminée
// Seul le destinataire (toId) peut accepter/refuser
// Les deux peuvent marquer terminée
const updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const userId   = req.user.id;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    const isReceiver = reservation.toId.toString() === userId;
    const isSender   = reservation.fromId.toString() === userId;

    // Vérification des droits selon le statut demandé
    if (['acceptée', 'refusée'].includes(statut) && !isReceiver) {
      return res.status(403).json({ message: 'Seul le destinataire peut accepter ou refuser' });
    }
    if (statut === 'terminée' && !isReceiver && !isSender) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    reservation.statut = statut;
    await reservation.save();

    await reservation.populate([
      { path: 'fromId',    select: 'nom prenom' },
      { path: 'toId',      select: 'nom prenom' },
      { path: 'annonceId', select: 'titre' },
    ]);

    res.json({ message: `Réservation ${statut}`, reservation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getMyReservations, createReservation, updateStatut };