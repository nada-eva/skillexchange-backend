const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅MongoDB connecté : ${conn.connection.host}`);
    console.log(`Base de données : ${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB déconnecté');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB :', err.message);
    });

  } catch (error) {
    console.error('❌ Impossible de se connecter à MongoDB');
    console.error('Message :', error.message);
    console.error('→ Vérifiez MONGODB_URI dans votre .env');
    process.exit(1); 
  }
};

module.exports = connectDB;