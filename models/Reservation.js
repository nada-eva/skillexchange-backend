const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  fromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  annonceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
    required: true,
  },
  date: { type: String, required: true },
  heure: { type: String, required: true },

  // Message optionnel du demandeur
  message: { type: String, default: '', maxlength: 500 },

  statut: {
    type: String,
    enum: ['en attente', 'acceptée', 'refusée', 'terminée'],
    default: 'en attente',
  },

}, { timestamps: true });

reservationSchema.index({ fromId: 1 });
reservationSchema.index({ toId: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);