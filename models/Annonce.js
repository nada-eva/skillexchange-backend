const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
 //Annonce.find().populate('userId')
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  titre: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required:  [true, 'La description est obligatoire'],
    maxlength: 1000,
  },
  competence: {
    type: String,
    required: [true, 'La compétence est obligatoire'],
    trim: true,
  },

  categorie: {
    type: String,
    enum: [
      'Informatique', 'Musique', 'Langues', 'Art',
      'Gastronomie', 'Photographie', 'Sport', 'Académique', 'Autre',
    ],
    default: 'Autre',
  },

  type: {
    type: String,
    enum: ['offre', 'demande'],
    default: 'offre',
  },

  niveauRequis: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'],
    default: 'Tous niveaux',
  },
    //optionnel
  disponibilite: { type: String, trim: true, default: '' },
  enEchange: { type: String, trim: true, default: '' },

  rating: { type: Number, default: 0, min: 0, max: 5 },

  //désactiver sans supprimer
  active: { type: Boolean, default: true },

}, { timestamps: true }); 

// Index pour accélérer les recherches fréquentes
annonceSchema.index({ categorie: 1 });
annonceSchema.index({ type: 1 });
annonceSchema.index({ userId: 1 });
annonceSchema.index({
  titre: 'text',
  description: 'text',
  competence: 'text',
});

module.exports = mongoose.model('Annonce', annonceSchema);