const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

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

  content: {
    type: String,
    required: [true, 'Le message ne peut pas être vide'],
    maxlength: 2000,
    trim: true,
  },
  // for notif
  read: { type: Boolean, default: false },
}, { timestamps: true });

// Index pour accélérer la récupération des conversations
messageSchema.index({ fromId: 1, toId: 1 });
messageSchema.index({ toId: 1, read: 1 }); //compter les non-lus

module.exports = mongoose.model('Message', messageSchema);