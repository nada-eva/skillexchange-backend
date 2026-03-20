const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true 
  },
  prenom:{ type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true 
  },
  email: { type: String,
    required: [true, 'L\'email est obligatoire'], 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { type: String, 
    required: [true, 'Le mot de passe est obligatoire'], 
    minlength: 6 
  },

  // Profil
  bio: { type: String, 
    default: '', 
    maxlength: 500 
    },
  competences: [{ type: String, trim: true }],
  avatar: { type: String, default: null },

  role: { type: String, 
    enum: ['user', 'admin'], 
    default: 'user' },

  evaluations: [{
    fromId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fromName: String,
    note: { type: Number, min: 1, max: 5 },
    commentaire: String,
    date: { type: Date, default: Date.now },
  }],

  rating: { type: Number, default: 0, min: 0, max: 5 },

}, { timestamps: true }); 

// N'agit que si le password a été modifié
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) 
    return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;  
  return user;
};

module.exports = mongoose.model('User', userSchema);