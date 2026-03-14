const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() établit la connexion
    // process.env.MONGODB_URI lit la valeur depuis le fichier .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Afficher un message de confirmation avec le nom du serveur
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`   Base de données : ${conn.connection.name}`);

    // Surveiller les événements de connexion
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB déconnecté');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB :', err.message);
    });

  } catch (error) {
    console.error('❌ Impossible de se connecter à MongoDB');
    console.error('   Message :', error.message);
    console.error('   → Vérifiez MONGODB_URI dans votre .env');
    process.exit(1); // code 1 = erreur
  }
};

// Exporter la fonction pour l'utiliser dans server.js
module.exports = connectDB;