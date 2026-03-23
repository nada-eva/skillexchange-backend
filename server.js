const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();

// middleware autorise req venant du front
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API SkillExchange opérationnelle',
    version: '1.0.0',
    status:  'OK',
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/annonces', require('./routes/annonceRoutes'));
// Sprint 4 :
// app.use('/api/messages',     require('./routes/messageRoutes'));
// app.use('/api/reservations', require('./routes/reservationRoutes'));
// Sprint 5 :
// app.use('/api/evaluations',  require('./routes/evaluationRoutes'));
// app.use('/api/signalements', require('./routes/signalementRoutes'));
// app.use('/api/admin',        require('./routes/adminRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} introuvable` });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`❌ Erreur [${statusCode}] : ${err.message}`);
  res.status(statusCode).json({
    message: err.message || 'Erreur serveur interne',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n⚡ Serveur SkillExchange lancé !`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV}`);
});