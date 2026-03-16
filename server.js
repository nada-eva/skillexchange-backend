const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./config/db');

dotenv.config();
connectDB();
const app = express();

// midllware qui autorise les requêtes venant du frontend React (port 5173)
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